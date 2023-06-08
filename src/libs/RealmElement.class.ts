import { RealmTagNames } from "../constants/tags";

interface ReamlElementParams {
  name: string;
  onPrepare?: (element: HTMLElement) => void;
  onInit?: (element: HTMLElement) => void;
  onMounted?: (element: HTMLElement) => void;
}

export class RealmElement extends HTMLElement {
  // Get name attribute
  readonly name: string;
  readonly id: string;
  readonly stateName: string;

  // Get innerHTML
  #html: string;

  // Get shadow root
  shadow: ShadowRoot;

  onInit?: (element: HTMLElement) => void;
  onMounted?: (element: HTMLElement) => void;
  onUnmounted?: (element: HTMLElement) => void;

  constructor({ name, onInit, onPrepare, onMounted }: ReamlElementParams) {
    super();
    this.name = name;

    const elementId = this.$randId();
    this.id = elementId;
    this.stateName = `$${elementId}`;

    this.onMounted = onMounted;

    onPrepare?.(this);
    this._html(this.innerHTML);
    onInit?.(this);
  }

  // Events
  connectedCallback() {
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
    element ? (element.textContent = content) : (this.textContent = content);

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
    attributes: Array<[name: string, value: string]>,
    source?: Element
  ) => {
    const el = source || this;
    attributes.forEach(([name, value]) => {
      el.setAttribute(name, value);
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
  _reqAnimFrame = (fn: FrameRequestCallback) => requestAnimationFrame(fn);

  // Assign slot
  _slotTo = (
    slot: HTMLSlotElement,
    nodes?:
      | Array<Element | HTMLElement | HTMLSlotElement | Text>
      | NodeListOf<Element | HTMLElement | HTMLSlotElement | Text>
  ) => slot && !!nodes && slot.assign(...nodes);
  //#endregion

  //#region Getter utilities
  // Generate random ID
  $randId = () =>
    parseInt(Math.random().toString().replace(".", "")).toString(0x24);

  // Get innerHTML
  $html = (element?: Element) => (element?.innerHTML || this.#html).trim();

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
  //#endregion
}
