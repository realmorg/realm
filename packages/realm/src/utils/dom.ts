import { RealmAttributeNames } from "../constants/attrs";
import {
  ATTR_PREFIX,
  DATA_PREFIX,
  DOT_NOTATION,
  EMPTY_STRING,
  EVENT_PREFIX,
  STATE_PREFIX,
} from "../constants/chars";
import { MixedDataType } from "../constants/data";
import { RealmMimeTypes } from "../constants/data";
import { RealmState } from "../libs/RealmState.class";
import { JSONSafeStringify, JSONstringify } from "./json";
import { logger } from "./logger";
import { arrayReduce, createArray, forEach, isArray } from "./object";
import { strReplace, strToLower } from "./string";

export interface RealmBaseInterface {
  name: string;
  id: string;
  shadow: ShadowRoot;
  states: RealmState;
}

type ShadowAcceptedElement = HTMLElement | Document | RealmBaseInterface;

type HTMLElementLike = DocumentFragment | Element | HTMLElement | Document;

export type WindowWithCustomType<T> = Window & typeof globalThis & T;

export const doc = document;

export const head = doc.head;

export const win = window;

// Set html content of element
export const _html = (self: HTMLElement | ShadowRoot, html: string) =>
  (self.innerHTML = html);

// Set html content of element
export const _clear =
  (self: HTMLElement) => (element?: HTMLElement | ShadowRoot) =>
    _html(element ?? self, EMPTY_STRING);

// Set content of element
export const _content =
  (self: HTMLElement | Document) =>
  (content: MixedDataType, element?: Element) =>
    ((element ?? self).textContent =
      typeof content === "object" ? JSONstringify(content) : `${content}`);

// Attach to shadow root
export const _attach = (self: ShadowAcceptedElement) => () => {
  const element = self as RealmBaseInterface;
  element.shadow = (self as HTMLElement).attachShadow({
    mode: "closed",
    slotAssignment: "manual",
  });
  return $shadow(element)();
};

// Append element to current or shadow root
export const _append =
  (self: HTMLElementLike) => (element: Node, appendTo?: HTMLElementLike) =>
    (appendTo ?? self).append(element);

// Render element as template tag
export const _renderTemplate =
  (self: ShadowAcceptedElement) =>
  (node: HTMLTemplateElement | DocumentFragment) => {
    if (!node) return;

    const $$clone = $clone(self as HTMLElement);
    const element =
      node instanceof HTMLTemplateElement
        ? $$clone<HTMLTemplateElement>(node).content
        : node;
    _append(<HTMLElement>self)(element, $shadow(<RealmBaseInterface>self)());
  };

// Remove element
export const _remove = (self: Element) => (element?: Element) =>
  (element ?? self).remove();

// Replace element
export const _replace =
  (self: HTMLElement) =>
  (newElement?: HTMLElementLike, targetElement?: Element) =>
    (targetElement ?? self).replaceWith(newElement);

// Create element tag
export const _createElement = <T>(tagName: string) =>
  doc.createElement(tagName) as T;

// Create fragment element
export const _createFragment = () => doc.createDocumentFragment();

export const _removeAttr =
  (self: HTMLElement) => (attrName: string, element?: Element) =>
    (element ?? self).removeAttribute(attrName);

// Set multiple element attributes
export const _attrs =
  (self: HTMLElement) =>
  (
    attributes: Array<[name: string, value?: MixedDataType]>,
    element?: Element
  ) => {
    const el = element ?? self;
    const setAttribute = el.setAttribute.bind(el);
    const removeAttribute = el.removeAttribute.bind(el);
    const setDOMAttribute = (name: string, value: string | boolean) =>
      name in el && (el[name] = value);

    forEach(
      attributes.filter((attr) => attr),
      ([name, value]) => {
        if (typeof value !== "boolean") {
          const finalValue = JSONSafeStringify(value);
          setAttribute(name, finalValue);
          setDOMAttribute(name, finalValue);
          return;
        }

        if (value) {
          setAttribute(name, EMPTY_STRING);
        } else {
          removeAttribute(name);
        }

        setDOMAttribute(name, value);
      }
    );
  };

// Set Element attribute
export const _attr =
  (self: HTMLElement) =>
  (name: string, value: MixedDataType, element?: Element) =>
    _attrs(self)([[name, value]], element);

// Set Element data
export const _data =
  (self: HTMLElement) => (name: string, value: string, element?: Element) =>
    _attr(self)(`${DATA_PREFIX}${name}`, value, element);

// Set multiple element data
export const _datas =
  (self: HTMLElement) =>
  (attributes: Array<[name: string, value: string]>, element?: Element) =>
    _attrs(self)(attributes, element);

// Assign slot
export const _slotTo = (
  slot: HTMLSlotElement,
  nodes?:
    | Array<Element | HTMLElement | HTMLSlotElement | Text>
    | NodeListOf<Element | HTMLElement | HTMLSlotElement | Text>
) => slot && !!nodes && slot.assign(...nodes);

// Add event listener
export const _addEvent =
  (self: HTMLElement | Document) =>
  (name: string, callback?: EventListener, element?: Element) =>
    (element ?? self).addEventListener(name, callback);

// Remove event listener
export const _removeEvent =
  (self: HTMLElement | Document) =>
  (name: string, callback?: EventListener, element?: Element) =>
    (element ?? self).removeEventListener(name, callback);

// Add custom event listener
export const _addCustomEvent =
  (self: HTMLElement | Document) =>
  <T>(name: string, callback?: (args: T) => void, element?: Element) =>
    _addEvent(self)(EVENT_PREFIX + name, (event: CustomEvent<T>) =>
      callback?.apply(element ?? self, [event.detail])
    );

// Dispatch event
export const _sendEvent =
  (self: HTMLElement | Document) =>
  <T>(name: string, detail?: T, element?: Element) =>
    (element ?? self).dispatchEvent(
      new CustomEvent<T>(EVENT_PREFIX + name, {
        detail,
      })
    );

export const _debug =
  (self: HTMLElement) =>
  (slot: HTMLSlotElement, value: unknown, element?: HTMLElement) => {
    const debug = $attr(element ?? self)<string>(
      RealmAttributeNames.DEBUG,
      slot
    );
    if (debug) logger([debug, value]);
  };

// Generate random ID
export const $randId = () =>
  parseInt(
    strReplace(Math.random().toString(), DOT_NOTATION, EMPTY_STRING)
  ).toString(0x10);

// Get innerHTML
export const $html = (element?: Element) => element?.innerHTML;

// Get name of element
export const $name = (self: RealmBaseInterface) => () => self.name;

// Get element's id
export const $id = (self: RealmBaseInterface) => (element?: Element) =>
  (element ?? self).id;

// Get element's tag name
export const $tagName = (self: HTMLElement) => (element?: Element) =>
  strToLower((element ?? self)?.tagName);

// Clone node
export const $clone =
  (self: HTMLElement | Document | DocumentFragment) =>
  <T>(element?: Element | DocumentFragment) =>
    (element ?? self).cloneNode(true) as T;

// Query selector string builder
export const $qsString = (selector: string, attrs?: Array<string[]>) => {
  if (!isArray(attrs)) return selector;
  return arrayReduce(
    attrs.filter((item) => isArray(item)),
    (acc, [attrName, attrValue]) => {
      const attrValueAssignment = `="${attrValue}"`;
      if (attrName)
        acc += `[${attrName}${attrValue ? attrValueAssignment : EMPTY_STRING}]`;
      return acc;
    },
    selector
  );
};

// Query selector for element or it's shadow root
export const $qs =
  (self: HTMLElementLike) =>
  <T extends Element>(
    selector: string,
    attrs?: Array<string[]>,
    element?: HTMLElementLike
  ) =>
    (element ?? self)?.querySelector<T>($qsString(selector, attrs));

// Query selector all for element or it's shadow root
export const $qsAll =
  (self: HTMLElementLike) =>
  <T extends Element>(
    selector: string,
    attrs?: Array<string[]>,
    element?: HTMLElementLike
  ) =>
    (element ?? self)?.querySelectorAll<T>($qsString(selector, attrs));

// Get children of element
export const $children =
  (self: HTMLElement | Document) =>
  (element?: Element | DocumentFragment): Element[] =>
    createArray<HTMLElement>((element ?? self).children);

// Get node list, it's like a children but return nodes
export const $nodes =
  (self: HTMLElement | Document) =>
  (element?: Element | DocumentFragment): Element[] =>
    createArray<HTMLElement>((element ?? self).childNodes);

export const $attrName = (attr: Attr) => attr.name;

export const $attrValue = (attr: Attr) => attr.value;

export const $attrs = (self: HTMLElement) => (element?: Element) =>
  createArray<Attr>((element || self)?.attributes ?? []);

export const $attrsKv = (self: HTMLElement) => (element?: Element) =>
  arrayReduce<Attr, Record<string, unknown>>(
    $attrs(self)(element),
    (acc, attr) => {
      acc[$attrName(attr)] = $attrValue(attr);
      return acc;
    },
    {}
  );

// Get element's attribute
export const $attr =
  (self: HTMLElement) =>
  <T>(name: string, element?: Element) =>
    (element || self)?.getAttribute?.(name) as T;

// Check if element has attribute
export const $hasAttr =
  (self: HTMLElement) => (name: string, element?: Element) =>
    (element || self).hasAttribute(name);

// Get element's data
export const $data = (self: HTMLElement) => (name: string, element?: Element) =>
  $attr(self)(`${DATA_PREFIX}${name}`, element);

// Get query selector for current element
export const $el =
  (self: HTMLElementLike) =>
  <T extends Element>(
    selector: string,
    attrNameOrAttrs?: string | Array<string[]>,
    attrValue?: string
  ) =>
    $qs(self)<T>(
      selector,
      isArray(attrNameOrAttrs)
        ? (attrNameOrAttrs as Array<string[]>)
        : ([[attrNameOrAttrs, attrValue]] as Array<string[]>)
    );

// Get query selector all for current element
export const $els =
  (self: HTMLElementLike) =>
  <T extends Element>(
    selector: string,
    attrNameOrAttrs?: string | Array<string[]>,
    attrValue?: string
  ) =>
    $qsAll(self)<T>(
      selector,
      isArray(attrNameOrAttrs)
        ? (attrNameOrAttrs as Array<string[]>)
        : ([[attrNameOrAttrs, attrValue]] as Array<string[]>)
    );

// Get query selector for current element's shadow root
export const $shadowEl =
  (self: ShadowAcceptedElement) =>
  <T extends Element>(
    selector: string,
    attrNameOrAttrs?: string | Array<string[]>,
    attrValue?: string
  ) =>
    $qs(self as HTMLElement)<T>(
      selector,
      isArray(attrNameOrAttrs)
        ? (attrNameOrAttrs as Array<string[]>)
        : ([[attrNameOrAttrs, attrValue]] as Array<string[]>),
      $shadow(<RealmBaseInterface>self)()
    );

// Get query selector all for current element's shadow root
export const $shadowEls =
  (self: ShadowAcceptedElement) =>
  <T extends Element>(
    selector: string,
    attrNameOrAttrs?: string | Array<string[]>,
    attrValue?: string
  ) =>
    $qsAll(self as HTMLElement)<T>(
      selector,
      isArray(attrNameOrAttrs)
        ? (attrNameOrAttrs as Array<string[]>)
        : ([[attrNameOrAttrs, attrValue]] as Array<string[]>),
      $shadow(<RealmBaseInterface>self)()
    );

// Get attribute slot's name
export const $slotAttrName = (name: string) => `${ATTR_PREFIX}${name}`;

// Get state slot's name
export const $slotStateName = (name: string) => `${STATE_PREFIX}${name}`;

// Get parent's element
export const $parent =
  (self: HTMLElement) =>
  <T extends HTMLElement>(element?: Element) =>
    (element ?? self).parentElement as T;

// Get parent's node
export const $parentNode = (self: HTMLElement) => (element?: Element) =>
  (element ?? self).parentNode;

export const $shadow = (self: RealmBaseInterface) => () => self.shadow;

export const $root = (self: HTMLElementLike) => () =>
  <ShadowRoot>self.getRootNode();

export const $host =
  (self: HTMLElementLike) =>
  <T>() =>
    $root(self)().host as T;

export const DOMFrom = (string: string) => {
  const domParser = new DOMParser();
  return domParser.parseFromString(string, RealmMimeTypes.HTML);
};
