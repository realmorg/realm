import { HANDLER_PREFIX, handlerKey } from "./assemble";
import { setupFetch, wantsFetch } from "./fetch";
import { bindFocusgroup } from "./focusgroup";
import { noticeTag } from "./loader";
import { warn } from "./log";
import { effect, reactive, untrack } from "./reactivity";
import { clean, parseHTML, sanitize } from "./sanitize";
import { type Box, type Reference, readReference, requireReference, type Scope } from "./scope";
import { childController } from "./signal";
import { withTiming } from "./time";

export const FORM_PROPERTIES = new Set(["value", "checked", "selected", "indeterminate"]);
const TRUE_FALSE_ATTRIBUTES = new Set(["draggable", "spellcheck", "contenteditable"]);
const COMPARATORS = ["eq", "neq", "gt", "gte", "lt", "lte", "contains"] as const;
type Comparator = (typeof COMPARATORS)[number];

export const watch = (scope: Scope, fn: () => unknown) => {
  scope.disposers.push(effect(fn));
};

const SVG = "http://www.w3.org/2000/svg";
const SVG_ATTRIBUTES: Record<string, string> = Object.fromEntries(
  "viewBox preserveAspectRatio gradientTransform gradientUnits patternTransform patternUnits patternContentUnits clipPathUnits markerHeight markerWidth markerUnits maskUnits maskContentUnits textLength lengthAdjust refX refY pathLength stdDeviation filterUnits primitiveUnits spreadMethod startOffset tableValues baseFrequency numOctaves stitchTiles surfaceScale specularExponent diffuseConstant kernelMatrix edgeMode xChannelSelector yChannelSelector attributeName repeatCount keyTimes keySplines calcMode"
    .split(" ")
    .map((name) => [name.toLowerCase(), name]),
);

const RANGE_ELEMENTS = new Set(["progress", "meter"]);

const camelCase = (name: string) => name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

export const applyAttribute = (el: Element, attribute: string, value: unknown) => {
  const name = el.namespaceURI === SVG ? (SVG_ATTRIBUTES[attribute] ?? attribute) : attribute;
  const target = el as unknown as Record<string, unknown>;
  if (name.startsWith("--")) {
    const style = (el as HTMLElement).style;
    if (value === null || value === undefined || value === false) style.removeProperty(name);
    else style.setProperty(name, String(value));
  } else if (name === "value" && value == null && RANGE_ELEMENTS.has(el.localName)) {
    el.removeAttribute(name);
  } else if (FORM_PROPERTIES.has(name) && name in el) {
    // Writing a control's own value back would clear the browser's "changed by the user" flag,
    // which tooShort and tooLong depend on.
    const next = name === "value" ? (value ?? "") : Boolean(value);
    if (target[name] !== next) target[name] = next;
  } else if (el.localName.includes("-") && value !== null && typeof value === "object") {
    target[camelCase(name)] = value;
  } else if (
    (name.startsWith("aria-") || TRUE_FALSE_ATTRIBUTES.has(name)) &&
    typeof value === "boolean"
  ) {
    el.setAttribute(name, String(value));
  } else if (value === true) {
    el.setAttribute(name, "");
  } else if (value === false || value === null || value === undefined) {
    el.removeAttribute(name);
  } else {
    el.setAttribute(name, String(value));
  }
};

const bindAttribute = (el: Element, name: string, text: string, scope: Scope) => {
  const reference = requireReference(text, `_${name}`, scope);
  // Applied untracked: reading a component's own value prop would make the binding rerun on
  // every keystroke and put the old state value back.
  if (reference)
    watch(scope, () => {
      const value = readReference(reference, scope);
      untrack(() => applyAttribute(el, name, value));
    });
};

const bindHandler = (el: Element, event: string, code: string, scope: Scope) => {
  const { instance, vars } = scope;
  const index = instance.definition.handlers.get(
    handlerKey(
      vars.map(([name]) => name),
      code,
    ),
  ) as number;
  const fn = instance.scope.handlers[index];
  if (!fn) return;
  const handle = (e: Event) => {
    if (fn.call(el, e, ...vars.map(([, box]) => box.value)) === false) e.preventDefault();
  };
  const listener = wantsFetch(el) ? handle : withTiming(el, handle, scope.signal);
  el.addEventListener(event, listener, { signal: scope.signal });
};

const RENDER_SLOT: Record<string, (slot: Element, value: string) => void> = {
  text: (slot, value) => slot.replaceChildren(value),
  html: (slot, value) => slot.replaceChildren(sanitize(value)),
  "html-unsafe": (slot, value) => {
    slot.innerHTML = value;
  },
};

const svgMarkup = (value: string, safe: boolean) => {
  const svg = parseHTML(`<svg>${value}</svg>`).firstElementChild as Element;
  return [...(safe ? clean(svg) : svg).childNodes];
};

const RENDER_SVG_SLOT: Record<string, (group: Element, value: string) => void> = {
  html: (group, value) => group.replaceChildren(...svgMarkup(value, true)),
  "html-unsafe": (group, value) => group.replaceChildren(...svgMarkup(value, false)),
};

const isEmpty = (value: unknown) => value === null || value === undefined || value === "";

const bindValueSlot = (slot: Element, reference: Reference, scope: Scope) => {
  const mode = ["html-unsafe", "html"].find((name) => slot.hasAttribute(name)) ?? "text";
  const fallback = [...slot.childNodes];
  if (slot.namespaceURI === SVG) {
    const text = mode === "text";
    const target = text ? document.createTextNode("") : document.createElementNS(SVG, "g");
    slot.replaceWith(target);
    const render = RENDER_SVG_SLOT[mode] as (group: Element, value: string) => void;
    watch(scope, () => {
      const value = readReference(reference, scope);
      if (text)
        (target as Text).data = isEmpty(value) ? (slot.textContent as string) : String(value);
      else if (isEmpty(value)) (target as Element).replaceChildren(...fallback);
      else render(target as Element, String(value));
    });
    return;
  }
  const render = RENDER_SLOT[mode] as (slot: Element, value: string) => void;
  watch(scope, () => {
    const value = readReference(reference, scope);
    if (isEmpty(value)) slot.replaceChildren(...fallback);
    else render(slot, String(value));
  });
};

interface Block {
  nodes: Node[];
  dispose(): void;
}

const mountBlock = (
  template: Node,
  parent: Node,
  before: Node | null,
  scope: Scope,
  vars: Scope["vars"],
): Block => {
  const controller = childController(scope.signal);
  const child: Scope = {
    instance: scope.instance,
    vars,
    signal: controller.signal,
    disposers: [],
  };
  const fragment = new DocumentFragment();
  fragment.append(template.cloneNode(true));
  processTree(fragment, child);
  const nodes = [...fragment.childNodes];
  parent.insertBefore(fragment, before);
  return {
    nodes,
    dispose() {
      controller.abort();
      for (const dispose of child.disposers) dispose();
      for (const node of nodes) (node as ChildNode).remove();
    },
  };
};

const takeChildren = (el: Element) => {
  const template = new DocumentFragment();
  template.append(...el.childNodes);
  return template;
};

const COMPARE: Record<Comparator, (value: unknown, expected: string) => boolean> = {
  eq: (value, expected) => String(value) === expected,
  neq: (value, expected) => String(value) !== expected,
  gt: (value, expected) => Number(value) > Number(expected),
  gte: (value, expected) => Number(value) >= Number(expected),
  lt: (value, expected) => Number(value) < Number(expected),
  lte: (value, expected) => Number(value) <= Number(expected),
  contains: (value, expected) =>
    Array.isArray(value)
      ? value.some((item) => String(item) === expected)
      : String(value ?? "").includes(expected),
};

export const compare = (value: unknown, comparator: Comparator | undefined, expected: string) =>
  comparator ? COMPARE[comparator](value, expected) : Boolean(value);

const conditional = (el: Element, scope: Scope) => {
  const reference = requireReference(el.getAttribute("when"), `<${el.localName}> when`, scope);
  const template = takeChildren(el);
  if (!reference) return;
  const hidden = el.localName === "is-hidden";
  const comparator = COMPARATORS.find((name) => el.hasAttribute(name));
  const expected = comparator ? (el.getAttribute(comparator) as string) : "";
  let block: Block | undefined;
  watch(scope, () => {
    const visible = compare(readReference(reference, scope), comparator, expected) !== hidden;
    untrack(() => {
      if (visible && !block) block = mountBlock(template, el, null, scope, scope.vars);
      else if (!visible && block) {
        block.dispose();
        block = undefined;
      }
    });
  });
  scope.disposers.push(() => block?.dispose());
};

interface ListBlock extends Block {
  item: Box;
  index: Box;
}

const repeat = (source: Element, template: Node, parent: Node, end: Node | null, scope: Scope) => {
  const reference = requireReference(
    source.getAttribute("of") ?? source.getAttribute("repeat"),
    "repeat",
    scope,
  );
  if (!reference) return;
  const as = source.getAttribute("as") ?? "item";
  const indexName = source.getAttribute("index");
  const key = source.getAttribute("key");
  const container = () => end?.parentNode ?? parent;
  let blocks = new Map<unknown, ListBlock>();

  const create = (item: unknown, index: number): ListBlock => {
    const itemBox = reactive({ value: item });
    const indexBox = reactive({ value: index });
    const vars: Scope["vars"] = [
      ...scope.vars,
      [as, itemBox],
      ...(indexName ? [[indexName, indexBox] as const] : []),
    ];
    return {
      ...mountBlock(template, container(), end, scope, vars),
      item: itemBox,
      index: indexBox,
    };
  };

  watch(scope, () => {
    const value = readReference(reference, scope);
    const items = Array.isArray(value) ? [...value] : [];
    untrack(() => {
      const next = new Map<unknown, ListBlock>();
      const order: ListBlock[] = [];
      items.forEach((item, index) => {
        let id: unknown = key ? (item as Record<string, unknown> | null)?.[key] : index;
        if (next.has(id)) {
          warn(`<${scope.instance.host.localName}> repeat has a duplicate key "${String(id)}".`);
          id = Symbol();
        }
        let block = blocks.get(id);
        if (block) {
          blocks.delete(id);
          block.item.value = item;
          block.index.value = index;
        } else block = create(item, index);
        next.set(id, block);
        order.push(block);
      });
      for (const stale of blocks.values()) stale.dispose();
      blocks = next;
      let cursor = end;
      for (const block of order.reverse()) {
        for (const node of block.nodes.toReversed()) {
          if (node.nextSibling !== cursor) container().insertBefore(node, cursor);
          cursor = node;
        }
      }
    });
  });
  scope.disposers.push(() => {
    for (const block of blocks.values()) block.dispose();
  });
};

const repeatAttribute = (el: Element, scope: Scope) => {
  const anchor = document.createComment("repeat");
  el.replaceWith(anchor);
  const template = el.cloneNode(true) as Element;
  for (const name of ["repeat", "as", "index", "key"]) template.removeAttribute(name);
  repeat(el, template, anchor.parentNode as Node, anchor, scope);
};

const bindAttributes = (el: Element, scope: Scope) => {
  for (const { name, value } of [...el.attributes]) {
    if (name.length > 1 && name.startsWith("_")) {
      el.removeAttribute(name);
      bindAttribute(el, name.slice(1), value, scope);
    } else if (name.startsWith(HANDLER_PREFIX)) {
      el.removeAttribute(name);
      bindHandler(el, name.slice(HANDLER_PREFIX.length), value, scope);
    } else if (name === "ref") {
      scope.instance.refs[value] = el;
    }
  }
};

const processElement = (el: Element, scope: Scope) => {
  const tag = el.localName;
  if (tag === "is-visible" || tag === "is-hidden") return conditional(el, scope);
  if (tag === "repeat-list") return repeat(el, takeChildren(el), el, null, scope);
  if (el.hasAttribute("repeat")) return repeatAttribute(el, scope);
  if (tag.includes("-")) noticeTag(tag);
  processTree(el, scope);
  bindAttributes(el, scope);
  if (wantsFetch(el)) setupFetch(el, scope);
  if (el.hasAttribute("focusgroup")) bindFocusgroup(el, scope.signal);
  const name = el.getAttribute("name");
  if (tag === "slot" && name && /^[#@!]/.test(name)) {
    const reference = requireReference(name, "<slot> name", scope);
    if (reference) bindValueSlot(el, reference, scope);
  }
};

export const processTree = (root: ParentNode, scope: Scope) => {
  for (const node of [...root.children]) processElement(node, scope);
};
