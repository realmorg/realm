import { RealmAttributeNames } from "../constants/attrs";
import { RealmTagNames } from "../constants/tags";
import { RealmElement } from "../libs/RealmElement.class";
import { createArray } from "./object";

export interface CreateElementParams {
  onRegistered?: (elementName: string) => void;
  onPrepare?: (element: RealmElement) => void;
  onInit?: (element: RealmElement) => void;
  onMounted?: (element: RealmElement) => void;
  onUnmounted?: (element: RealmElement) => void;
  onAttributeChanged?: (
    element: RealmElement,
    attrName: string,
    oldValue: any,
    newValue: any
  ) => void;
}

export enum ElementAttributeTypes {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  OBJECT = "object",
  EVENT = "event",
}

export interface ElementAttribute {
  name: string;
  type: ElementAttributeTypes;
  value: string | number | object | boolean;
}

export type ElementRuntimeEventArgs = {
  $: RealmElement;
  $$?: HTMLElement;
  event?: Event;
  attrs?: Object;
};

/**
 * Register element to customElements
 * @param elementName
 * @param { onRegistered: (elementName: string) => void, ...params }
 */
export const registerElement =
  (elementName: string, { onRegistered, ...params }: CreateElementParams) =>
  () => {
    const isNameValid = elementName.includes("-");
    const isDefined = customElements.get(elementName);
    if (!isNameValid || isDefined)
      throw new Error(
        `Element ${elementName} has invalid name or already defined`
      );

    customElements
      .whenDefined(elementName)
      .then(() => onRegistered?.(elementName));

    customElements.define(
      elementName,
      class extends RealmElement {
        constructor() {
          super({ name: elementName, ...params });
        }
      }
    );
  };

/**
 * Parse attribute value to specific type based on attribute type definition
 * @param type
 * @param value
 * @returns {string | number | object | boolean}
 */
export const parseAttrValue = (type: ElementAttributeTypes, value: string) => {
  if (type === ElementAttributeTypes.NUMBER) return +value;
  if (type === ElementAttributeTypes.BOOLEAN) return value === "true";
  if (type === ElementAttributeTypes.OBJECT) return JSON.parse(value);
  return value;
};

/**
 * Get custom element attributes as an array
 * @param element
 * @returns {ElementAttribute[]}
 */
export const getCustomElementAttrEntries = (element: RealmElement) =>
  createArray<Element>(element.$els(RealmTagNames.ELEMENT_ATTR));

/**
 * Get custom element embedded scripts as an array
 * @param element
 * @returns {ElementAttribute[]}
 */
export const getCustomElementScriptEntries = (element: RealmElement) =>
  createArray<HTMLScriptElement>(element.$els(RealmTagNames.SCRIPT));

/**
 * Get custom element's scripts as an array
 * @param element
 * @returns {Element[]}
 */
export const getCustomElementScripts = (element: RealmElement) =>
  getCustomElementScriptEntries(element)?.reduce<Element[]>(
    (acc, script) => [...acc, script],
    []
  );

/**
 * Get custom element attributes entries as definitions
 * @param element
 * @returns {ElementAttribute[]}
 */
export const getCustomElementAttrs = (element: RealmElement) =>
  getCustomElementAttrEntries(element)?.reduce<ElementAttribute[]>(
    (acc, item) => {
      const name = element.$attr(RealmAttributeNames.NAME, item);
      const type = element.$attr(
        RealmAttributeNames.TYPE,
        item
      ) as ElementAttributeTypes;
      const value = parseAttrValue(type, element.$html(item));

      return [
        ...acc,
        {
          name,
          type,
          value,
        },
      ];
    },
    []
  );

/**
 * Remove custom element attributes, it is called when element is initialized
 * @param element
 */
export const removeCustomElementAttrs = (element: RealmElement) =>
  getCustomElementAttrEntries(element)?.forEach((el) => el.remove());

/**
 * Remove custom element scripts, it is called when element is initialized
 * @param element
 */
export const removeCustomElementScripts = (element: RealmElement) =>
  getCustomElementScripts(element)?.forEach((script) => script.remove());
