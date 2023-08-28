import {
  BindingAttrValue,
  ElementBinding,
  RealmAttributeNames,
  RealmMutableAttr,
} from "../constants/attrs";
import {
  ATTR_PREFIX,
  COLON as ATTR_SEPARATOR,
  BIND_ATTR_PREFIX,
  DASH_SEPARATOR,
  DATA_PREFIX,
  META_PREFIX,
  SOURCE_PREFIX,
  STATE_PREFIX,
} from "../constants/chars";
import { MixedDataType } from "../constants/data";
import { RealmTagNames } from "../constants/tags";
import { RealmElement } from "../libs/RealmElement.class";
import { bindCSS } from "./cssom";
import { $attrName, $attrValue, doc } from "./dom";
import { JSONSafeParse } from "./json";
import {
  DataSource,
  addSet,
  arrayMap,
  arrayReduce,
  createArray,
  createMap,
  createSet,
  filterArray,
  findArray,
  forEach,
  forEachNode,
  fromEntries,
  getMap,
  getValueFrom,
  setMap,
} from "./object";
import {
  newError,
  strIncludes,
  strSlice,
  strSplit,
  strStartWith,
} from "./string";

interface DefineElementOption extends ElementDefinitionOptions {
  name: string;
  onBeforeRegister?: (elementName: string) => Promise<void> | void;
  onRegistered?: (elementName: string) => Promise<void> | void;
  onConnected?: (element: RealmElement) => Promise<void> | void;
  onBeforeInit?: (element: RealmElement) => Promise<void> | void;
  onInit?: (element: RealmElement) => Promise<void> | void;
  onMounted?: (element: RealmElement) => Promise<void> | void;
  onUnmounted?: (element: RealmElement) => Promise<void> | void;
  onAttributeChanged?: (
    element: RealmElement,
    attrName: string,
    attrValue: unknown,
    prevAttrValue: unknown
  ) => Promise<void> | void;
}

export enum ElementDataTypes {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  ARRAY = "array",
  OBJECT = "object",
  HTML = "html",
  JSON_STRING = "json",
}

export type ElementAttributeEntries = [
  name: string,
  type: ElementDataTypes,
  value: MixedDataType,
  options?: Record<string, unknown>
];

type ElementRuntimeEventArgs = {
  $: RealmElement;
  $$?: HTMLElement;
  event?: Event;
  attrs?: Object;
};

/**
 * Register element to customElements
 * @param elementName
 * @param ...params DefineElementOption
 */
export const defineElement =
  ({
    name,
    extends: extendsTagName,
    onBeforeRegister,
    onRegistered,
    onConnected,
    ...params
  }: DefineElementOption) =>
  (): Promise<boolean> =>
    new Promise((resolve) => {
      const isNameValid = strIncludes(name, DASH_SEPARATOR);
      const isDefined = customElements.get(name);
      if (!isNameValid || isDefined)
        throw newError(
          `Element \`${name}\` has invalid name or already defined`
        );

      customElements.whenDefined(name).then(async () => {
        onRegistered?.(name);
        resolve(true);
      });

      onBeforeRegister?.(name);

      class CustomElement extends RealmElement {
        constructor() {
          super({ name, ...params });
        }

        async connectedCallback() {
          super.connectedCallback();
          onConnected?.(this);
        }
      }

      customElements.define(name, CustomElement, { extends: extendsTagName });
    });

/**
 * Parse attribute value to specific type based on attribute type definition
 * @param type
 * @param value
 * @returns {string | number | object | boolean}
 */
export const parseValue = (type: ElementDataTypes, value: MixedDataType) => {
  const transformValue = (defaultValue: MixedDataType) =>
    typeof value !== "string" ? value : JSONSafeParse(value || defaultValue);
  const valueLookup: Record<string, () => MixedDataType> = {
    [ElementDataTypes.NUMBER]: () => +value,
    [ElementDataTypes.BOOLEAN]: () => transformValue(value),
    [ElementDataTypes.ARRAY]: () => transformValue("[]"),
    [ElementDataTypes.OBJECT]: () => transformValue("{}"),
  };
  return valueLookup?.[type]?.() ?? value;
};

/**
 * Get custom element attributes as an array
 * @param element
 */
const getElementEntries = (
  element: RealmElement,
  tagName: string = RealmTagNames.ELEMENT_ATTR
) => createArray<Element>(element.$els(tagName));

/**
 * Get custom element attributes entries as definitions
 * @param element
 */
export const getCustomElementAttrs = (
  element: RealmElement,
  tagName?: string
): Set<ElementAttributeEntries> =>
  createSet(
    arrayReduce(
      getElementEntries(element, tagName),
      (acc, item) => {
        const name = element.$attr<string>(RealmAttributeNames.NAME, item);
        const type = element.$attr<ElementDataTypes>(
          RealmAttributeNames.TYPE,
          item
        );
        const value = parseValue(type, element.$html(item));
        const attrs: ElementAttributeEntries = [name, type, value];
        return [...acc, attrs];
      },
      []
    )
  );

/**
 * Remove custom element attributes, it is called when element is initialized
 * @param element
 */
export const removeCustomElementAttrs = (
  element: RealmElement,
  tagName?: string
) => forEach(getElementEntries(element, tagName), (el) => element._remove(el));

const getValueType = (
  slotName: string,
  registry: Set<ElementAttributeEntries>
) =>
  findArray(
    createArray<ElementAttributeEntries>(registry),
    ([name]) => name === slotName
  )?.at(1) as ElementDataTypes;

/**
 * Create slot element inside shadow root
 * @param element
 * @param name
 * @param value
 * @returns {HTMLSlotElement|void}
 */
const bindSlot = (
  element: RealmElement,
  dataType: string,
  slotName: string,
  slotValue: MixedDataType | DataSource,
  hasGlobalAttr?: boolean
) => {
  const getSlotName = () => slotName;
  const getSlotValue = () => slotValue;

  const getSlotValueFromObject = () => getValueFrom(slotValue, slotName);

  const attrNameLookup: Record<string, () => string> = {
    [RealmMutableAttr.STATE]: () => element.$slotStateName(slotName),
    [RealmMutableAttr.ATTR]: () => element.$slotAttrName(slotName),
    [RealmMutableAttr.SRC]: getSlotName,
    [RealmMutableAttr.META]: getSlotName,
  };
  const slotAttrName = attrNameLookup[dataType]?.();

  const attrValueLookup: Record<string, () => MixedDataType> = {
    [RealmMutableAttr.STATE]: getSlotValue,
    [RealmMutableAttr.ATTR]: getSlotValue,
    [RealmMutableAttr.SRC]: getSlotValueFromObject,
    [RealmMutableAttr.META]: getSlotValueFromObject,
  };
  const slotAttrValue = attrValueLookup[dataType]?.();

  const attrTypeLookup: Record<string, ElementDataTypes> = {
    [RealmMutableAttr.STATE]: getValueType(slotName, element.statesRegistry),
    [RealmMutableAttr.ATTR]: getValueType(slotName, element.attrsRegistry),
  };
  const slotAttrType = attrTypeLookup[dataType];

  forEachNode(
    element.$shadowEls<HTMLSlotElement>(RealmAttributeNames.SLOT, [
      [RealmAttributeNames.NAME, slotAttrName],
      hasGlobalAttr && [RealmAttributeNames.GLOBAL],
    ]),
    (shadowSlot) => {
      if (!shadowSlot) return;
      if (
        !hasGlobalAttr &&
        element.$hasAttr(RealmAttributeNames.GLOBAL, shadowSlot)
      )
        return;

      const slot = element._createElement<HTMLSlotElement>(RealmTagNames.SLOT);
      const slotId = element.$slotStateName(element.$randId());

      const slotAttrMap = createMap<HTMLSlotElement, string>();
      setMap(slotAttrMap, shadowSlot, RealmAttributeNames.NAME);
      setMap(slotAttrMap, slot, RealmAttributeNames.SLOT);
      forEach([shadowSlot, slot], (slotElement) => {
        element._data(dataType, slotAttrName, slotElement);
        element._attrs(
          [
            [getMap(slotAttrMap, slotElement), slotId],
            hasGlobalAttr && [RealmAttributeNames.GLOBAL],
          ],
          slotElement
        );
      });

      if (slotAttrType === ElementDataTypes.HTML) {
        element._html(slotAttrValue, slot);
      } else {
        element._content(slotAttrValue, slot);
      }
      element._append(slot);
      element._slotTo(shadowSlot, [slot]);
      element._debug(shadowSlot, slotAttrValue);
    }
  );
};

/**
 * Update `slot[slot]` value
 * @param element
 * @param slotName
 * @param slotValue
 * @returns
 */
const updateSlot = (
  element: RealmElement,
  dataType: string,
  slotName: string,
  slotValue: MixedDataType,
  isGlobalUpdate?: boolean
) => {
  const attrNameLookup: Record<string, string> = {
    [RealmMutableAttr.STATE]: element.$slotStateName(slotName),
    [RealmMutableAttr.ATTR]: element.$slotAttrName(slotName),
    [RealmMutableAttr.SRC]: slotName,
  };
  const slotAttrName = attrNameLookup[dataType];

  const attrTypeLookup: Record<string, ElementDataTypes> = {
    [RealmMutableAttr.STATE]: getValueType(slotName, element.statesRegistry),
    [RealmMutableAttr.ATTR]: getValueType(slotName, element.attrsRegistry),
  };
  const slotAttrType = attrTypeLookup[dataType];

  const selector = !isGlobalUpdate
    ? `[${DATA_PREFIX}${dataType}="${slotAttrName}"]:not([${RealmAttributeNames.GLOBAL}])`
    : RealmTagNames.SLOT;

  const attrs = !isGlobalUpdate
    ? []
    : [
        [RealmAttributeNames.GLOBAL],
        [`${DATA_PREFIX}${dataType}`, slotAttrName],
      ];

  const nodes = createArray<HTMLSlotElement>([
    ...element.$qsAll<HTMLSlotElement>(selector, attrs),
    ...element.$qsAll<HTMLSlotElement>(
      selector,
      attrs,
      isGlobalUpdate ? doc : undefined
    ),
  ]);

  forEach(nodes, (slot) => {
    if (!slot) return;
    if (slotAttrType === ElementDataTypes.HTML) {
      element._html(slotValue, slot);
    } else {
      element._content(slotValue, slot);
    }
    element._debug(
      element.$shadowEl<HTMLSlotElement>(selector, [
        ...attrs,
        [
          RealmAttributeNames.NAME,
          element.$attr(RealmAttributeNames.SLOT, slot),
        ],
        [RealmAttributeNames.DEBUG],
      ]),
      slotValue
    );
  });
};

/**
 * Bind attributes with dynamic value
 * @param element {RealmElement}
 * @param bindings {Set<[attrName: string, attrValue: string, isGlobal: boolean]>}
 * @param name {string}
 * @param value {string}
 * @returns {void}
 */
const bindAttr = (
  element: RealmElement,
  dataType: string,
  dataBinding: Set<BindingAttrValue>,
  node: Element,
  name: string,
  value: MixedDataType,
  isGlobalUpdate?: boolean
): void => {
  const getValue = () => value;
  const getSlotValueFromObject = () => getValueFrom(value, name);
  const attrValueLookup: Record<string, () => MixedDataType> = {
    [RealmMutableAttr.STATE]: getValue,
    [RealmMutableAttr.ATTR]: getValue,
    [RealmMutableAttr.SRC]: getSlotValueFromObject,
    [RealmMutableAttr.META]: getSlotValueFromObject,
  };
  const attrValue = attrValueLookup[dataType]();
  const nodeHasGlobalAttr = element.$hasAttr(RealmAttributeNames.GLOBAL, node);
  forEach(dataBinding, ([attrName, attrSrc, isGlobalFlag]) => {
    const shouldUpdateGlobalState = isGlobalUpdate
      ? isGlobalFlag
      : !(isGlobalFlag && !nodeHasGlobalAttr);
    const shouldUpdate = shouldUpdateGlobalState && name === attrSrc;
    if (shouldUpdate) element._attr(attrName, attrValue, node);
  });
};

/**
 * Update element's value that binded to attr / state / global state,
 * Slot element will be updated too
 */
const attrMutableLookup = (
  statesBinding: Set<BindingAttrValue> = createSet(),
  attrsBinding: Set<BindingAttrValue> = createSet(),
  srcDataBinding: Set<BindingAttrValue> = createSet(),
  metasBinding: Set<BindingAttrValue> = createSet()
) => ({
  [RealmMutableAttr.STATE]: statesBinding,
  [RealmMutableAttr.ATTR]: attrsBinding,
  [RealmMutableAttr.SRC]: srcDataBinding,
  [RealmMutableAttr.META]: metasBinding,
});

export const bindElement = (
  element: RealmElement,
  dataType: string,
  dataBinding: ElementBinding,
  name: string,
  value: MixedDataType | DataSource,
  isGlobalUpdate?: boolean,
  isUpdate?: boolean
) => {
  bindCSS(element, name, value, dataType, isGlobalUpdate);
  forEach(dataBinding, ([node, ...bindings]) =>
    bindAttr(
      element,
      dataType,
      attrMutableLookup?.(...bindings)[dataType],
      node,
      name,
      value,
      isGlobalUpdate
    )
  );

  if (isUpdate)
    return updateSlot(element, dataType, name, value, isGlobalUpdate);

  if (!isGlobalUpdate && dataType === RealmMutableAttr.STATE)
    element.states.set(name, value);

  return bindSlot(element, dataType, name, value, isGlobalUpdate);
};

/**
 * Bind attributes with dynamic value
 * @param element  {RealmElement}
 * @param attrName {string}
 */
export const addAttrBinding = (element: RealmElement, attrName: string) => {
  const globalAttrName = `${attrName}${ATTR_SEPARATOR}${RealmAttributeNames.GLOBAL}`;
  const isGlobal = element.$hasAttr(globalAttrName);
  const attrSelector = isGlobal ? globalAttrName : attrName;
  element._attr(BIND_ATTR_PREFIX + attrSelector, element.$attr(attrSelector));
};

/**
 * Element's mutation observer
 */
const mutationObserver = (
  target: Element,
  options?: MutationObserverInit & { callback: MutationCallback }
): [() => void, () => void] => {
  const observer = new MutationObserver(options?.callback);
  return [() => observer.observe(target, options), () => observer.disconnect()];
};

const addToBindList = (
  shouldAdded: boolean,
  bindAttrValues: Set<BindingAttrValue>,
  attrName: string,
  attrValue: string,
  isGlobal: boolean
) => shouldAdded && addSet(bindAttrValues, [attrName, attrValue, isGlobal]);

/**
 * Get element's attribute bindings list by element data
 * @param element
 * @returns ElementBinding
 */
export const getElementAttrBindings = (element: RealmElement) =>
  arrayReduce<Element, ElementBinding>(
    createArray<Element>(element.$shadowEls(RealmTagNames.ALL)),
    (acc, node) => {
      const stateBindList = createSet<BindingAttrValue>();
      const attrBindList = createSet<BindingAttrValue>();
      const srcBindList = createSet<BindingAttrValue>();
      const metaBindList = createSet<BindingAttrValue>();

      const [statesBinding, attrsBinding, srcDataBinding, metasBinding] =
        arrayReduce<Attr, Array<Set<BindingAttrValue>>>(
          element.$attrs(node),
          (acc, attr) => {
            const hasBindAttr = strStartWith($attrName(attr), BIND_ATTR_PREFIX);
            const hasAttr = element.$hasAttr($attrName(attr), node);
            if (hasAttr && !hasBindAttr) return acc;

            const [attrName, global] = strSplit(
              $attrName(attr),
              ATTR_SEPARATOR
            );
            const isGlobal = global === RealmAttributeNames.GLOBAL;

            const attrValue = $attrValue(attr);
            const slicedAttrName = strSlice(attrName);
            const slicedAttrValue = strSlice(attrValue);

            const isState = strStartWith(attrValue, STATE_PREFIX);
            addToBindList(
              isState,
              stateBindList,
              slicedAttrName,
              slicedAttrValue,
              isGlobal
            );

            const isAttr = strStartWith(attrValue, ATTR_PREFIX);
            addToBindList(
              isAttr,
              attrBindList,
              slicedAttrName,
              slicedAttrValue,
              false
            );

            const isSource = strStartWith(attrValue, SOURCE_PREFIX);
            addToBindList(
              isSource,
              srcBindList,
              slicedAttrName,
              attrValue,
              false
            );

            const isMeta = strStartWith(attrValue, META_PREFIX);
            addToBindList(
              isMeta,
              metaBindList,
              slicedAttrName,
              attrValue,
              false
            );

            if (isSource || isMeta) element._removeAttr(attr.name, node);
            return [stateBindList, attrBindList, srcBindList, metaBindList];
          },
          []
        );

      return [
        ...acc,
        [node, statesBinding, attrsBinding, srcDataBinding, metasBinding],
      ];
    },
    []
  );

/**
 * Subscribe element's attr mutation
 */
export const subscribeAttrMutation = (
  element: RealmElement,
  observer: (
    attrName: string,
    attrValue: unknown,
    prevAttrValue: unknown
  ) => void
) =>
  mutationObserver(element, {
    attributes: true,
    attributeOldValue: true,
    callback: (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type !== "attributes") return;
        const attrName = mutation.attributeName;
        // @ts-expect-error
        const attrValue = element.$attr(attrName, mutation.target);
        const prevAttrValue = mutation.oldValue;
        if (prevAttrValue !== attrValue) {
          observer?.(attrName, attrValue, prevAttrValue);
        }
      }
    },
  });

/**
 * Find element flow's actions by event name
 * @param actionArgs
 * @param comparator
 * @param isMultipleResult
 * @returns
 */
export const findAttrFrom = <T>(
  actionArgs: Array<T[]>,
  comparator: T,
  isMultipleResult?: boolean
) =>
  isMultipleResult
    ? arrayMap(
        filterArray(actionArgs, ([argName]) => argName === comparator),
        ([, argValue]) => argValue
      )
    : findArray(actionArgs, ([argName]) => argName === comparator)?.at(1);

/**
 * Get default value from element's attribute registry
 * @param element {RealmElement}
 * @returns Record<string, unknown>
 */

export const getDefaultAttrValues = (element: RealmElement) =>
  fromEntries<Record<string, unknown>>(
    arrayMap(createArray(element.attrsRegistry), ([attrName, , attrValue]) => [
      attrName,
      attrValue,
    ])
  );
