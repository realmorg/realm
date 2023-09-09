import { RealmAttributeNames } from "../constants/attrs";
import { MixedDataType } from "../constants/data";
import { FlowMutateTypes, FlowDataSource } from "../constants/flow";
import { RealmElement } from "../libs/RealmElement.class";
import {
  ElementDataTypes,
  ElementAttributeEntries,
  parseValue,
  findAttrFrom,
  getDefaultAttrValues,
} from "../utils/element";
import { ActionArg, FlowAction, mutatesValue } from "../utils/flow";
import {
  DataSource,
  arrayReduce,
  createArray,
  createMap,
  createSet,
  forEach,
  getMap,
  getValueFrom,
  setMap,
  someArray,
} from "../utils/object";
import { getGlobalState } from "../elements/global-state";

type TriggerAction = (
  element: RealmElement,
  elementName: string,
  actionArgs: ActionArg[],
  event: Event | Record<string, unknown>,
  eventType: string,
  eventName: string
) => Promise<void> | void;

const ACTIONS_REGISTRY = createMap<
  string,
  [requiredAttrs: string[], triggerActionFn: TriggerAction]
>();

const ATTRS_REGISTRY = createMap<string, Set<ElementAttributeEntries>>();

const STATE_REGISTRY = createMap<string, Set<ElementAttributeEntries>>();

const setAttrMapRegistry = (
  attrMap: Map<string, Set<ElementAttributeEntries>>,
  elementName: string,
  attrs: Set<ElementAttributeEntries>
) => attrs.size && setMap(attrMap, elementName, attrs);

export const setAttrRegistry = (
  elementName: string,
  attrs: Set<ElementAttributeEntries>
) => setAttrMapRegistry(ATTRS_REGISTRY, elementName, attrs);

export const setStateRegistry = (
  elementName: string,
  attrs: Set<ElementAttributeEntries>
) => setAttrMapRegistry(STATE_REGISTRY, elementName, attrs);

export const getAttrRegistry = (elementName: string) =>
  getMap(ATTRS_REGISTRY, elementName) ?? createSet();

export const getStateRegistry = (elementName: string) =>
  getMap(STATE_REGISTRY, elementName) ?? createSet();

const {
  EQUALS_TO: MutateTypeEqual,
  REMOVE: MutateTypeRemove,
  POP: MutateTypeArrayPop,
  PUSH: MutateTypeArrayPush,
  ASSIGN: MutateTypeArrayAssign,
  ADD_STR: MutateTypeArrayAdd,
} = FlowMutateTypes;

const {
  MUTATE: AttrMutate,
  INDEX: AttrIndex,
  VALUE: AttrValue,
  FROM: AttrFrom,
  TOGGLE: AttrToggle,
} = RealmAttributeNames;

const {
  ARRAY: DataTypeArray,
  HTML: DataTypeHTML,
  BOOLEAN: DataTypeBool,
} = ElementDataTypes;

/**
 * Get value from dot notation raw, without parsing by type
 * @param element
 * @param value
 * @param sourceType
 * @param event
 * @returns
 */
export const getRawSourceFrom = (
  element: RealmElement,
  value: MixedDataType,
  sourceType?: string,
  event?: DataSource
) => {
  const strValue = `${value}`;
  const eventLookup: Record<string, () => MixedDataType> = {
    [FlowDataSource.EVENT]: () => getValueFrom(event, strValue),
    [FlowDataSource.GLOBAL_STATE]: () =>
      getValueFrom(getGlobalState(), strValue),
    [FlowDataSource.LOCAL_STATE]: () => getValueFrom(element.states, strValue),
    [FlowDataSource.EVENT_ATTR]: () => {
      const attrOwner = (<Event>event).target as RealmElement;
      const attrs = element.$attrsKv(attrOwner);
      return getValueFrom(attrs, strValue);
    },
    [FlowDataSource.ATTR]: () =>
      getValueFrom(
        {
          ...getDefaultAttrValues(element),
          ...element.$attrsKv(element),
        },
        strValue
      ),
  };
  return eventLookup?.[sourceType]?.();
};

/**
 * Get value from dot notation and parse by type
 * @param element
 * @param type
 * @param value
 * @param sourceType
 * @param event
 * @returns
 */
export const getSourceFrom = (
  element: RealmElement,
  type: ElementDataTypes,
  value: MixedDataType,
  sourceType?: string,
  event?: DataSource
) => {
  const getRawValue = () => getRawSourceFrom(element, value, sourceType, event);
  const eventLookup: Record<string, () => MixedDataType> = {
    [FlowDataSource.EVENT]: () => parseValue(type, getRawValue()),
    [FlowDataSource.EVENT_ATTR]: getRawValue,
    [FlowDataSource.ATTR]: getRawValue,
    [FlowDataSource.GLOBAL_STATE]: () => parseValue(type, getRawValue()),
    [FlowDataSource.LOCAL_STATE]: () => parseValue(type, getRawValue()),
  };
  return eventLookup?.[sourceType]?.() ?? parseValue(type, value);
};

/**
 * Find attribute for the action element
 * @param actionArgs
 * @param attrName
 * @param fallbackAttr
 * @returns
 */
export const findAttr = <T>(
  actionArgs: Array<string[]>,
  attrName: string,
  fallbackAttr?: T,
  isMultipleResult = false
) => {
  const attr = findAttrFrom(actionArgs, attrName, isMultipleResult);
  const hasAttr = attr !== undefined;
  return [hasAttr ? attr : fallbackAttr, hasAttr] as [T, boolean];
};

/**
 * Update state or attribute
 * @returns
 */
export const getMutatedValue = (
  element: RealmElement,
  actionArgs: Array<string[]>,
  attrType: ElementDataTypes,
  event: Event | Record<string, unknown>
): ((
  prevValue: MixedDataType
) => string | number | boolean | void | object) => {
  const [mutateAttr] = findAttr<string>(
    actionArgs,
    AttrMutate,
    MutateTypeEqual
  );
  const [indexAttr, hasIndexAttr] = findAttr<number>(actionArgs, AttrIndex);
  const [valueAttr, hasValueAttr] = findAttr<MixedDataType>(
    actionArgs,
    AttrValue
  );

  const isDataTypeArray = attrType === DataTypeArray;
  const isDataTypeHTML = attrType === DataTypeHTML;
  const isDataTypeBool = attrType === DataTypeBool;
  const isMutateTypeEqualsTo = mutateAttr === MutateTypeEqual;
  const isMutateTypeArrayRemove = mutateAttr === MutateTypeRemove;
  const isMutateTypeArrayPop = mutateAttr === MutateTypeArrayPop;
  const isMutateTypeArrayPush = mutateAttr === MutateTypeArrayPush;
  const isMutateTypeArrayAdd = mutateAttr === MutateTypeArrayAdd;
  const isMutateTypeArrayAssign = mutateAttr === MutateTypeArrayAssign;

  const isMutationArrayNotRequiredIndex =
    isMutateTypeArrayPush || isMutateTypeEqualsTo;
  const isMutationArrayRequiredIndex =
    isMutateTypeArrayRemove || isMutateTypeArrayAdd || isMutateTypeArrayAssign;
  const isStringMutationAllowed = !isDataTypeArray && hasValueAttr;
  const isHTMLMutationAllowed = isDataTypeHTML;
  const isArrayMutationAllowed =
    isDataTypeArray &&
    (isMutateTypeArrayPop ||
      (isMutationArrayRequiredIndex && hasIndexAttr) ||
      (isMutationArrayNotRequiredIndex && hasValueAttr));
  const isMutationAllowed =
    isStringMutationAllowed || isHTMLMutationAllowed || isArrayMutationAllowed;
  if (!isMutationAllowed) return;

  const [sourceType] = findAttr<string>(actionArgs, AttrFrom);
  const attrIndex = hasIndexAttr
    ? getSourceFrom(element, attrType, indexAttr, sourceType, event)
    : "-1";
  let attrValue = getSourceFrom(
    element,
    attrType,
    valueAttr,
    sourceType,
    event
  );

  const [, hasToggleAttr] = findAttr(actionArgs, AttrToggle);
  const isToggleBoolean = hasToggleAttr && isDataTypeBool;
  if (isToggleBoolean) attrValue = !attrValue;

  const mutatedValue = mutatesValue([
    mutateAttr,
    attrType,
    attrValue,
    +attrIndex,
    hasToggleAttr,
  ]);

  return mutatedValue;
};

/**
 * Get element's attribute type
 * @param name
 * @param attrEntries
 * @returns
 */
export const getAttrType = (
  name: string,
  attrEntries: Set<ElementAttributeEntries>
): ElementDataTypes | undefined =>
  arrayReduce(
    createArray<ElementAttributeEntries>(attrEntries),
    (acc, [attrName, attrType]) => (attrName === name ? attrType : acc)
  );

/**
 * Execute the action
 * @param element
 * @param elementName
 * @param actions
 * @returns
 */
export const doAction =
  (element: RealmElement, elementName: string, actions: Array<FlowAction>) =>
  (
    eventType: string,
    eventName: string,
    event?: Event | Record<string, unknown>
  ) =>
    forEach<FlowAction>(actions, ([actionName, actionArgs]) => {
      const [requiredAttrs = [], triggerAction] = getMap(
        ACTIONS_REGISTRY,
        actionName
      );

      const isValidAction = someArray(requiredAttrs, (attrName) => {
        const [, hasAttr] = findAttr(actionArgs, attrName);
        return hasAttr;
      });

      if (requiredAttrs.length && !isValidAction) return;
      return triggerAction?.(
        element,
        elementName,
        actionArgs,
        event,
        eventType,
        eventName
      );
    });

/**
 * Trigger action wrapper
 * @param element
 * @param elementName
 * @returns
 */
const actionTrigger =
  (element: RealmElement, elementName: string) =>
  (actions: Array<FlowAction>) =>
    doAction(element, elementName, actions);

/**
 * Create action trigger for element flow actions
 */
export const createActionTrigger = (element: RealmElement) =>
  actionTrigger(element, element.$name());

interface DefineActionOption {
  name: string;
  requiredAttrs?: string[];
  onTrigger: TriggerAction;
}

export const defineAction =
  ({ name, requiredAttrs, onTrigger }: DefineActionOption) =>
  () =>
    setMap(ACTIONS_REGISTRY, name, [requiredAttrs, onTrigger]);
