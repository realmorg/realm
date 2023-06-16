import { RealmTagNames } from "../constants/tags";
import { RealmStates } from "./RealmStates.class";

export interface ReamlElementParams {
  name: string;
  onPrepare?: (element: HTMLElement) => void;
  onInit?: (element: HTMLElement) => void;
  onMounted?: (element: HTMLElement) => void;
  onUnmounted?: (element: HTMLElement) => void;
  onAttributeChanged?: (
    element: HTMLElement,
    attrName: string,
    oldValue: any,
    newValue: any
  ) => void;
}

export class RealmElement extends HTMLElement {
  // Get name attribute
  readonly name: string;
  readonly id: string;

  // Get innerHTML
  #html: string;

  // Get shadow root
  shadow: ShadowRoot;

  onInit?: ReamlElementParams["onInit"];
  onMounted?: ReamlElementParams["onMounted"];
  onUnmounted?: ReamlElementParams["onUnmounted"];
  onAttributeChanged?: ReamlElementParams["onAttributeChanged"];

  states: RealmStates = new RealmStates();

  constructor({
    name,
    onInit,
    onPrepare,
    onMounted,
    onUnmounted,
    onAttributeChanged,
  }: ReamlElementParams) {
    super();
    this.name = name;

    this.id = this.$randId();

    this.onMounted = onMounted;
    this.onUnmounted = onUnmounted;
    this.onAttributeChanged = onAttributeChanged;

    onPrepare?.(this);
    this._html(this.innerHTML);
    onInit?.(this);
  }

  // Events
  connectedCallback() {
    const mutationObsrver = new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type !== "attributes") return;
        const attrName = mutation.attributeName;
        // @ts-expect-error
        const value = mutation.target.getAttribute(attrName);
        const oldValue = mutation.oldValue;
        if (oldValue !== value) {
          this._reqAnimFrame(() => {
            this.onAttributeChanged?.(this, attrName, oldValue, value);
          });
        }
      }
    });
    mutationObsrver.observe(this, {
      attributes: true,
      attributeOldValue: true,
    });

    this._reqAnimFrame(() => {
      this.onMounted?.(this);
    });
  }

  disconnectedCallback() {
    this._reqAnimFrame(() => {
      this.onUnmounted?.(this);
    });
  }

  // Utilities for RealmElement, these are rules:
  // _: prefix for setter util
  // $: prefix for getter util

  //#region Setter utilities
  // Clear HTML content
  _clear = () => (this.innerHTML = "");

  // Set innerHTML
  _html = (html: string, element?: Element) =>
    element ? (element.innerHTML = html) : (this.#html = html);

  // Set content of element
  _content = (content: string, element?: Element) =>
    ((element ?? this).textContent = content);

  // Attach to shadow root
  _attach = () =>
    (this.shadow = this.attachShadow({
      mode: "open",
      slotAssignment: "manual",
    }));

  // Append element to current or shadow root
  _append = (element: Node, shadow?: boolean) =>
    (shadow ? this.shadow : this).append(element);

  // Render element as template tag
  _render = () => {
    const template = this._createTag<HTMLTemplateElement>(
      RealmTagNames.TEMPLATE
    );
    template.innerHTML = this.$html();
    this._append(template.content, true);
  };

  // Remove element
  _remove = () => this.remove();

  // Create element tag
  _createTag = <T>(tagName: string) => document.createElement(tagName) as T;

  // Set multiple element attributes
  _attrs = (
    attributes: Array<[name: string, value: string | boolean]>,
    source?: Element
  ) => {
    const el = source || this;
    attributes.forEach(([name, value]) => {
      el.setAttribute(name, typeof value === "boolean" ? name : value);
    });
  };

  // Set Element attribute
  _attr = (name: string, value: string, source?: Element) =>
    this._attrs([[name, value]], source);

  // Set Element data
  _data = (name: string, value: string, source?: Element) =>
    this._attr(`data-${name}`, value, source);

  // Set multiple element data
  _datas = (
    attributes: Array<[name: string, value: string]>,
    source?: Element
  ) => this._attrs(attributes, source);

  // Request animation frame
  _reqAnimFrame = (fn: FrameRequestCallback) => {
    const reqAnimFrame = requestAnimationFrame(() => {
      cancelAnimationFrame(reqAnimFrame);
      fn.apply(this);
    });
  };

  // Assign slot
  _slotTo = (
    slot: HTMLSlotElement,
    nodes?:
      | Array<Element | HTMLElement | HTMLSlotElement | Text>
      | NodeListOf<Element | HTMLElement | HTMLSlotElement | Text>
  ) => slot && !!nodes && slot.assign(...nodes);

  _event = <T>(name: string, detail?: T) =>
    this.dispatchEvent(
      new CustomEvent<T>(name, {
        detail,
      })
    );

  // _runtimeId = (id: string) => (this.runtimeId = id);
  //#endregion

  //#region Getter utilities
  // Generate random ID
  $randId = () =>
    parseInt(Math.random().toString().replace(".", "")).toString(0x10);

  // Get innerHTML
  $html = (element?: Element) =>
    (element?.innerHTML || this.#html).toString().trim();

  // Query selector for element or it's shadow root
  $qs = <T extends Element>(selector: string, shadow?: boolean) =>
    (shadow ? this.shadowRoot : this)?.querySelector<T>(selector);

  // Query selector all for element or it's shadow root
  $qsAll = <T extends Element>(selector: string, shadow?: boolean) =>
    (shadow ? this.shadowRoot : this)?.querySelectorAll<T>(selector);

  // Query selector string builder
  $qsString = (selector: string, tagOrAttr?: string, attrValue?: string) =>
    tagOrAttr
      ? `${selector}[${tagOrAttr}${attrValue ? `="${attrValue}"` : ""}]`
      : selector;

  $children = () =>
    this.$qsAll<HTMLElement>(
      `*${[RealmTagNames.SLOT, RealmTagNames.SCRIPT]
        .map((tag) => `:not(${tag})`)
        .join("")}`
    );

  // Get element's attribute
  $attr = (name: string, source?: Element) =>
    (source || this).getAttribute(name);

  $data = (name: string, source?: Element) =>
    (source || this).getAttribute(`data-${name}`);

  // Get query selector for current element
  $el = <T extends Element>(
    selector: string,
    tagOrAttr?: string,
    attrValue?: string
  ) => this.$qs<T>(this.$qsString(selector, tagOrAttr, attrValue));

  // Get query selector all for current element
  $els = <T extends Element>(
    selector: string,
    tagOrAttr?: string,
    attrValue?: string
  ) => this.$qsAll<T>(this.$qsString(selector, tagOrAttr, attrValue));

  // Get query selector for current element's shadow root
  $shadowEl = <T extends Element>(
    selector: string,
    tagOrAttr?: string,
    attrValue?: string
  ) => this.$qs<T>(this.$qsString(selector, tagOrAttr, attrValue), true);

  // Get query selector all for current element's shadow root
  $shadowEls = <T extends Element>(
    selector: string,
    tagOrAttr?: string,
    attrValue?: string
  ) => this.$qsAll<T>(this.$qsString(selector, tagOrAttr, attrValue), true);

  // Get attribute slot's name
  $slotAttrName = (name: string) => `@${name}`;

  // Get state slot's name
  $slotStateName = (name: string) => `#${name}`;

  $event = <T>(name: string, callback?: (args: T) => void) =>
    this.addEventListener(name, (event: CustomEvent) => {
      callback?.apply(this, [event.detail]);
    });
  //#endregion
}
