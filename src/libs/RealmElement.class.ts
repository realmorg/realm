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

  // Get innerHTML
  #html: string;

  // Get shadow root
  shadow: ShadowRoot;

  onMounted?: (element: HTMLElement) => void;
  onUnmounted?: (element: HTMLElement) => void;

  constructor({ name, onInit, onPrepare, onMounted }: ReamlElementParams) {
    super();
    this.name = name;
    this.id = Math.random().toString();
    this.onMounted = onMounted;
    onPrepare?.(this);
    this._html(this.innerHTML);
    onInit?.(this);
  }

  // Events
  connectedCallback() {
    this.onMounted?.(this);
  }

  disconnectedCallback() {
    this.onUnmounted?.(this);
  }

  // Utils where $ is prefix for getter
  // where _ is prefix for setter or action
  _clear = () => (this.innerHTML = "");
  _html = (html: string) => (this.#html = html);
  _attach = () => (this.shadow = this.attachShadow({ mode: "open" }));
  _append = (element: Node) => this.shadow.appendChild(element);
  _render = () => {
    const template = this._createTag<HTMLTemplateElement>(
      RealmTagNames.TEMPLATE
    );
    template.innerHTML = this.$html();
    this._append(template.content.cloneNode(true));
  };
  _remove = () => this.remove();
  _createTag = <T>(tagName: string) => document.createElement(tagName) as T;
  _attr = (name: string, value: string, source?: Element) =>
    (source || this).setAttribute(name, value);

  $id = () => this.id;
  $html = (element?: Element) => (element?.innerHTML || this.#html).trim();
  $attr = (name: string, source?: Element) =>
    (source || this).getAttribute(name);
  $els = (selector: string) => this.querySelectorAll(selector);
}
