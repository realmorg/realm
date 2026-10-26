import { processTree } from "./bindings";
import { attributesOf, bindCss } from "./css";
import { bindControl } from "./forms";
import { bindPageHandler, definePageHandlerProperty } from "./handlers";
import { report, warn } from "./log";
import { prop } from "./props";
import { attachProps } from "./props-runtime";
import { effect, reactive, tick, untrack } from "./reactivity";
import { settingUp } from "./registry";
import { defineStore } from "./store";
import type { Context, Definition, SetupResult } from "./types";

type Hook = () => unknown;

const EMPTY_SCOPE: SetupResult = { get: () => undefined, handlers: [] };

export const instances = new WeakMap<Node, Instance>();

// Walks the flat tree: slotted content continues from its slot, so components wrapping that slot
// are parents too. Reported (implicit) reads skip slots, so a library's shadow markup never
// captures the names in its users' content.
const parentOf = (node: Node, report?: boolean): Node | null =>
  (!report && (node as Element).assignedSlot) ||
  (node.parentNode instanceof ShadowRoot ? node.parentNode.host : node.parentNode);

// Setting up a component connects the components in its markup synchronously, so each nesting
// level grows the call stack. Every 32nd level finishes setting up in a microtask, on a fresh stack.
const depthOf = (el: Element): number => {
  const root = el.getRootNode();
  return root instanceof ShadowRoot ? 1 + depthOf(root.host) : 0;
};

export class Instance {
  readonly controller = new AbortController();
  readonly refs = reactive<Record<string, Element>>({});
  readonly disposers: (() => void)[] = [];
  readonly connected: Hook[] = [];
  readonly disconnected: Hook[] = [];
  readonly formReset: Hook[] = [];
  readonly formDisabled: ((disabled: boolean) => void)[] = [];
  readonly formStateRestore: ((state: unknown, mode: string) => void)[] = [];
  props: Record<string, unknown> | undefined;
  readonly propAttributes = new Map<string, string>();
  readonly form = reactive({ disabled: false });
  readonly childWatchers = new Set<() => void>();
  attrs: Record<string, string | null> | undefined;
  scope: SetupResult = EMPTY_SCOPE;
  loading = 0;

  constructor(
    readonly host: RealmElement,
    readonly definition: Definition,
    readonly internals: ElementInternals,
  ) {}

  get signal() {
    return this.controller.signal;
  }

  has(name: string) {
    return this.definition.names.has(name);
  }

  get(name: string) {
    return this.scope.get(name);
  }

  findInParents(name: string, report?: boolean): Instance | undefined {
    for (let node = parentOf(this.host, report); node; node = parentOf(node, report)) {
      const owner = instances.get(node);
      if (owner?.has(name)) {
        if (report && !owner.host.contains(this.host))
          warn(`<${this.host.localName}> reads "${name}" from <${owner.host.localName}>.`);
        return owner;
      }
    }
    return undefined;
  }

  setLoading(delta: number) {
    this.loading += delta;
    if (this.loading > 0) this.internals.states.add("loading");
    else this.internals.states.delete("loading");
  }

  destroy() {
    for (const hook of this.disconnected) hook();
    this.controller.abort();
    for (const dispose of this.disposers.splice(0)) dispose();
    this.host.shadowRoot?.replaceChildren();
    instances.delete(this.host);
  }
}

type TimerCallback = (...args: unknown[]) => void;

const timers = (signal: AbortSignal) => {
  const active = new Set<number>();
  signal.addEventListener("abort", () => {
    for (const id of active) clearTimeout(id);
  });
  const clear = (id?: number) => {
    if (id !== undefined) active.delete(id);
    clearTimeout(id);
  };
  return {
    setTimeout(callback: TimerCallback, delay?: number, ...args: unknown[]) {
      const id = window.setTimeout(() => {
        active.delete(id);
        callback(...args);
      }, delay);
      active.add(id);
      return id;
    },
    setInterval(callback: TimerCallback, delay?: number, ...args: unknown[]) {
      const id = window.setInterval(callback, delay, ...args);
      active.add(id);
      return id;
    },
    clearTimeout: clear,
    clearInterval: clear,
  };
};

const createContext = (instance: Instance): Context => ({
  ...timers(instance.signal),
  untrack,
  defineProps: (schema) => attachProps(instance, schema) as never,
  useState: reactive,
  useChildren(selector, attributes = []) {
    const host = instance.host;
    const children = reactive<Element[]>([]);
    const read = () => {
      children.length = 0;
      children.push(...[...host.children].filter((child) => child.matches(selector)));
    };
    read();
    instance.childWatchers.add(read);
    const observer = new MutationObserver(read);
    observer.observe(host, {
      childList: true,
      subtree: true,
      characterData: true,
      attributeFilter: attributes,
    });
    instance.disposers.push(() => observer.disconnect());
    return children;
  },
  tick,
  listen: (type, handler, target = instance.host) =>
    target.addEventListener(type, handler, { signal: instance.signal }),
  defineMethods(methods) {
    const host = instance.host;
    const descriptors = Object.getOwnPropertyDescriptors(methods);
    for (const [name, descriptor] of Object.entries(descriptors)) {
      Object.defineProperty(host, name, { ...descriptor, configurable: true });
    }
    instance.disposers.push(() => {
      for (const name of Object.keys(descriptors))
        delete (host as unknown as Record<string, unknown>)[name];
    });
  },
  dispatch: (type, detail, options) =>
    instance.host.dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail,
        ...options,
      }),
    ),
  attrs: new Proxy({} as Record<string, string | null>, {
    get: (_, name: string) => attributesOf(instance)[name],
    set: (_, name: string, value) => {
      attributesOf(instance)[name] = value;
      return true;
    },
  }),
  observe(fn) {
    const stop = effect(fn);
    instance.disposers.push(stop);
    return stop;
  },
  onConnected: (fn) => instance.connected.push(fn),
  onDisconnected: (fn) => instance.disconnected.push(fn),
  onFormReset: (fn) => instance.formReset.push(fn),
  onFormDisabled: (fn) => instance.formDisabled.push(fn),
  onFormStateRestore: (fn) => instance.formStateRestore.push(fn),
  defineStore,
  lookup: (name, report) => {
    const owner = instance.findInParents(name, report);
    return owner ? owner.get(name) : (globalThis as Record<string, unknown>)[name];
  },
  prop,
  host: instance.host,
  refs: instance.refs,
  signal: instance.signal,
  internals: instance.internals,
});

export class RealmElement extends HTMLElement {
  static definition: Definition;
  readonly #internals = this.attachInternals();
  #instance: Instance | undefined;
  #pending = false;
  // Set while this element waits for an ancestor, so its descendants wait behind it and never
  // set up before their parent.
  #waiting: Promise<unknown> | undefined;

  get #definition() {
    return (this.constructor as typeof RealmElement).definition;
  }

  connectedCallback(deferred?: boolean) {
    this.#pending = false;
    for (const attribute of this.attributes) bindPageHandler(this, attribute.name, attribute.value);
    if (this.#instance || this.closest("custom-element")) return;
    for (let node = parentOf(this); node; node = parentOf(node)) {
      const wait =
        node instanceof RealmElement
          ? node.#waiting
          : settingUp.has((node as Element).localName) &&
            customElements.whenDefined((node as Element).localName);
      if (wait) {
        this.#waiting = wait.then(() => {
          this.#waiting = undefined;
          if (this.isConnected) this.connectedCallback();
        });
        return;
      }
    }
    const depth = depthOf(this);
    if (depth > 1000) {
      warn(`<${this.localName}> is nested 1000 deep. Stop its recursion with a condition.`);
      return;
    }
    if (depth % 32 > 30 && !deferred) {
      queueMicrotask(() => this.isConnected && this.connectedCallback(true));
      return;
    }
    const definition = this.#definition;
    if (definition.slot && !this.hasAttribute("slot")) this.slot = definition.slot;
    const shadow =
      this.shadowRoot ??
      this.attachShadow({ mode: "open", delegatesFocus: definition.delegatesFocus });
    shadow.adoptedStyleSheets = definition.sheets;
    if (definition.role) this.#internals.role = definition.role;
    const instance = new Instance(this, definition, this.#internals);
    this.#instance = instance;
    instances.set(this, instance);
    if (definition.formAssociated) instance.form.disabled = this.matches(":disabled");
    try {
      instance.scope = definition.setup(createContext(instance));
    } catch (error) {
      report(error);
    }
    const scope = { instance, vars: [], signal: instance.signal, disposers: instance.disposers };
    bindCss(instance, scope);
    const fragment = document.importNode(definition.markup, true);
    processTree(fragment, scope);
    shadow.append(fragment);
    bindControl(instance);
    const parent = this.parentElement && instances.get(this.parentElement);
    if (parent) for (const refresh of parent.childWatchers) refresh();
    for (const hook of instance.connected) {
      const cleanup = hook();
      if (typeof cleanup === "function") instance.disposers.push(cleanup as () => void);
    }
  }

  disconnectedCallback() {
    this.#pending = true;
    queueMicrotask(() => {
      if (!this.#pending || this.isConnected) return;
      this.#instance?.destroy();
      this.#instance = undefined;
    });
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    if (this.isConnected) bindPageHandler(this, name, value);
  }

  formResetCallback() {
    for (const hook of this.#instance?.formReset ?? []) hook();
  }

  formDisabledCallback(disabled: boolean) {
    if (this.#instance) this.#instance.form.disabled = disabled;
    for (const hook of this.#instance?.formDisabled ?? []) hook(disabled);
  }

  formStateRestoreCallback(state: unknown, mode: string) {
    for (const hook of this.#instance?.formStateRestore ?? []) hook(state, mode);
  }
}

export const mountElementClass = (definition: Definition) => {
  const handlerAttributes = definition.events
    .filter((name) => !(`on${name}` in HTMLElement.prototype))
    .map((name) => `on${name}`);
  const ElementClass = class extends RealmElement {
    static override definition = definition;
    static formAssociated = definition.formAssociated;
    static observedAttributes = handlerAttributes;
  };
  for (const attribute of handlerAttributes)
    definePageHandlerProperty(ElementClass.prototype, attribute);
  customElements.define(definition.name, ElementClass);
};
