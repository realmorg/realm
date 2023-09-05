import { RealmAttributeNames } from "../constants/attrs";
import { ALL, COMMA_SEPARATOR, SOURCE_PREFIX } from "../constants/chars";
import { MixedDataType } from "../constants/data";
import {
  ALL_USE_FN,
  FlowActionTypes,
  FlowMutateTypes,
} from "../constants/flow";
import { $attrName, $attrValue, $randId, WindowWithCustomType } from "./dom";
import { ElementDataTypes } from "./element";
import {
  arrayIncludes,
  arrayPop,
  arrayPush,
  arrayReduce,
  arraySplice,
  arraySplit,
  createArray,
  createMap,
  createSet,
  fromEntries,
  getMap,
  isArray,
  setMap,
  trimArrayString,
} from "./object";
import { RealmElement } from "../libs/RealmElement.class";
import { RealmTagNames } from "../constants/tags";
import { RealmScriptTypes } from "../constants/scripts";
import { attatchScriptFlow } from "./script";
import { RealmState } from "../libs/RealmState.class";

type ScriptParams = {
  $: RealmElement;
  ref: (refName: string) => Element;
  refs: (refName: string) => Element[];
  localState: RealmState;
  globalState: RealmState;
  event: Event;
  attrs: Record<string, unknown>;
  attr: {
    get: (attrName: string) => unknown;
    set: (attrName: string, attrValue: string) => void;
  };
};

export type ScriptFlow = (params: ScriptParams) => void;

type AddScriptFlowType = {
  __REALM_ADD_CUSTOM_FLOW: typeof addScriptFlow;
};

export type ActionArg = Array<string>;

export type ActionAttr = [attrName: string, attrValue: string];

export type FlowAction = [actionName: string, actionArgs: ActionArg[]];

export type FlowEvent = [attrs: Array<ActionAttr>, action: FlowAction[]];

const CUSTOM_SCRIPT_FLOW_REGISTRY = createMap<
  string,
  Map<string, ScriptFlow>
>();

const FLOW_REGISTRY = createMap<string, Map<string, Set<FlowEvent>>>();

export type FlowRegistry = typeof FLOW_REGISTRY;

export type CallFlow = (
  flow: Set<FlowEvent>,
  hostElement: RealmElement,
  dispatcherElement?: RealmElement
) => Promise<void>;

export interface DefineFlowOption {
  name: string;
  onBeforeRegister?: (eventFlowOwnerName: string) => void;
  onRegistered?: (eventFlowOwnerName: string, flows: Set<FlowEvent>) => void;
  onApply?: CallFlow;
  onRemove?: CallFlow;
}

export type ActionElementReducerCallback = (
  eventFlowOwnerName: string,
  eventOwnerElement: RealmElement,
  acc: FlowEvent[],
  actionElement: Element
) => FlowEvent[];

export type EventAttrReducerCallback = (
  acc: FlowEvent[],
  eventElement: Attr
) => FlowEvent[];

export type RegisterFlowCallback = (
  eventFlowOwnerName: string,
  eventOwnerElement: RealmElement
) => void;

export type ApplyFlowCallback = (
  eventOwnerElement: RealmElement,
  dispatcherElement?: RealmElement
) => Promise<void>;

export type DefineFlowReturn = [
  registerFlow: RegisterFlowCallback,
  applyFlow: ApplyFlowCallback,
  removeFlow: ApplyFlowCallback
];

const getScriptFlowRegistry = (elementName: string) =>
  getMap(CUSTOM_SCRIPT_FLOW_REGISTRY, elementName);

const addScriptFlow = (elementName: string, scriptId: string, fn: ScriptFlow) =>
  setMap(getScriptFlowRegistry(elementName), scriptId, fn);

(window as WindowWithCustomType<AddScriptFlowType>).__REALM_ADD_CUSTOM_FLOW =
  addScriptFlow;

export const registerScriptFlow = (eventFlowOwnerName: string) =>
  setMap(
    CUSTOM_SCRIPT_FLOW_REGISTRY,
    eventFlowOwnerName,
    createMap<string, () => void>()
  );

export const getScriptFlow = (elementName: string, scriptId: string) =>
  getMap(getScriptFlowRegistry(elementName), scriptId);

export const getFlowRegistry = (name: string) =>
  getMap(FLOW_REGISTRY, name) ?? createMap();

export const registerFlow = (
  name: string,
  elementName: string,
  flow: Set<FlowEvent>
) => {
  const flowMap = getFlowRegistry(name) ?? createMap<string, Set<FlowEvent>>();
  setMap(flowMap, elementName, flow);
  setMap(FLOW_REGISTRY, name, flowMap);
};

export const getFlow = (name: string, elementName: string) =>
  getMap(getFlowRegistry(name), elementName);

/**
 * Assign value to element state / attribute
 * @param param0
 * @returns
 */
export const mutatesValue = ([mutateType, attrType, attrValue, attrIndex]: [
  mutateType: string,
  attrType: ElementDataTypes,
  attrValue: MixedDataType,
  attrIndex: number
]) => {
  const isAllowedMutation = arrayIncludes(attrType, [
    ElementDataTypes.NUMBER,
    ElementDataTypes.ARRAY,
  ]);

  return (prevValue: MixedDataType) => {
    if (!isAllowedMutation) return attrValue;

    const mutateLookup: Record<string, () => MixedDataType | void> = {
      [FlowMutateTypes.EQUALS_TO]: () =>
        isArray(attrValue) ? attrValue : +attrValue,
      [FlowMutateTypes.ADD]: () => +prevValue + +attrValue,
      [FlowMutateTypes.SUBTRACT]: () => +prevValue - +attrValue,
      [FlowMutateTypes.MULTIPLY]: () => +prevValue * +attrValue,
      [FlowMutateTypes.DIVIDE]: () => +prevValue / +attrValue,
      [FlowMutateTypes.ASSIGN]: () => {
        const array = [...(prevValue as MixedDataType[])];
        const prevValueIndex = array[+attrIndex];
        if (prevValueIndex !== undefined)
          array[+attrIndex] =
            typeof prevValueIndex === "object"
              ? {
                  ...prevValueIndex,
                  ...attrValue?.[0],
                }
              : attrValue;
        return array;
      },
      [FlowMutateTypes.PUSH]: () => [
        ...(prevValue as Array<unknown>),
        ...arrayReduce(
          attrValue as Array<unknown>,
          (acc, value) => {
            const newId = `${SOURCE_PREFIX}${SOURCE_PREFIX}${$randId()}`;
            return [
              ...acc,
              typeof value === "object"
                ? {
                    [newId]: Symbol(newId),
                    ...value,
                  }
                : value,
            ];
          },
          []
        ),
      ],
      [FlowMutateTypes.POP]: () => {
        const array = [...(prevValue as MixedDataType[])];
        arrayPop(array);
        return array;
      },
      [FlowMutateTypes.REMOVE]: () => {
        const array = [...(prevValue as MixedDataType[])];
        arraySplice(array, +attrIndex, 1);
        return array;
      },
    };
    return mutateLookup?.[mutateType]?.();
  };
};

/**
 * Default event reducer callback
 * @param eventFlowOwnerName
 * @param eventOwnerElement
 * @param acc
 * @param attr
 */
export const actionFlowReducer = (
  eventFlowOwnerName: string,
  eventOwnerElement: RealmElement,
  acc: FlowEvent[],
  actionElement: Element
): Array<FlowAction | FlowEvent> | string => {
  const actionName = eventOwnerElement.$tagName(actionElement);
  const actionAttrs = eventOwnerElement.$attrs(actionElement);
  const actionContent = eventOwnerElement.$html(actionElement);
  const actionArgs = arrayReduce<Attr, ActionArg[]>(
    actionAttrs,
    eventFlowReducer,
    []
  );

  // Exceptional for `set-state` type `html`
  // Push html to `actionArgs`
  if (actionName === FlowActionTypes.SET_STATE) {
    arrayPush(actionArgs, [RealmAttributeNames.VALUE, actionContent]);
  }

  // Exceptional for `script` tag
  // Push script id in the `actionArgs`
  if (actionName === RealmTagNames.SCRIPT) {
    const { type, use = "" } = fromEntries<{
      type: string;
      use: string;
    }>(actionArgs);
    const isValidScriptType = type === RealmScriptTypes.REALM_MODULE;

    if (isValidScriptType) {
      const scriptId = `${actionName}-${eventOwnerElement.$id()}-${eventOwnerElement.$randId()}`;
      const dependencies = trimArrayString(
        arraySplit(use === ALL ? ALL_USE_FN : use, COMMA_SEPARATOR)
      );
      arrayPush(actionArgs, [RealmAttributeNames.SCRIPT_ID, scriptId]);
      attatchScriptFlow(
        eventFlowOwnerName,
        scriptId,
        actionContent,
        dependencies
      );
    }
  }

  // Exceptional for `set-timer`, `http-request`, `response-success`, `response-error` tag
  // Push child nodes in the `actionArg`
  if (
    (<string[]>[
      FlowActionTypes.SET_TIMER,
      FlowActionTypes.HTTP_REQUEST,
      FlowActionTypes.RESPONSE_SUCCESS,
      FlowActionTypes.RESPONSE_ERROR,
    ]).includes(actionName)
  ) {
    const actionReducer = createActionReducer(
      eventFlowOwnerName,
      eventOwnerElement
    );
    arrayPush(actionArgs, [
      RealmAttributeNames.ACTION,
      arrayReduce(
        eventOwnerElement.$children(actionElement),
        actionReducer(),
        []
      ),
    ]);
  }

  // Exceptional for `send-event`, `request-body` tag
  // Push HTML in the `actionArg`
  if (
    (<string[]>[
      FlowActionTypes.SEND_EVENT,
      FlowActionTypes.REQUEST_BODY,
    ]).includes(actionName)
  ) {
    arrayPush(actionArgs, [
      RealmAttributeNames.ACTION,
      eventOwnerElement.$html(actionElement),
    ]);
  }

  const actionFlow: FlowAction = [actionName, actionArgs];
  return [...acc, actionFlow];
};

const createActionReducer =
  (eventFlowOwnerName: string, eventOwnerElement: RealmElement) =>
  () =>
  (acc: Array<FlowEvent>, actionElement: Element) =>
    actionFlowReducer(
      eventFlowOwnerName,
      eventOwnerElement,
      acc,
      actionElement
    );

export const eventFlowReducer = (acc: Array<ActionAttr>, attr: Attr) => [
  ...acc,
  [$attrName(attr), $attrValue(attr)],
];

const createEventReducer = () => () => (acc: Array<ActionAttr>, attr: Attr) =>
  eventFlowReducer(acc, attr);

/**
 * Define a flow for an event type
 * @param eventFlowType - event flow type
 * @param actionReducerCallback - event reducer callback
 * @returns flow definition
 */
export const defineFlow = ({
  name,
  onBeforeRegister,
  onRegistered,
  onApply,
  onRemove,
}: DefineFlowOption): DefineFlowReturn => {
  // Add flow to registry
  const registerFlowFn = async (
    eventOwnerName: string,
    eventOwnerElement: RealmElement
  ) => {
    const flowElements = createArray<HTMLElement>(eventOwnerElement.$els(name));
    const attrReducer = createEventReducer();
    const actionReducer = createActionReducer(
      eventOwnerName,
      eventOwnerElement
    );
    const flow = createSet<FlowEvent>(
      arrayReduce(
        flowElements,
        (acc, eventElement) => [
          ...acc,
          [
            // @note: attributes
            arrayReduce(
              eventOwnerElement.$attrs(eventElement),
              attrReducer(),
              []
            ),
            // @note: actions
            arrayReduce(
              eventOwnerElement.$children(eventElement),
              actionReducer(),
              []
            ),
          ],
        ],
        []
      )
    );

    registerScriptFlow(eventOwnerName);
    onBeforeRegister?.(eventOwnerName);
    registerFlow(name, eventOwnerName, flow);
    onRegistered?.(eventOwnerName, flow);
  };

  const flowCallback =
    (callback?: CallFlow) =>
    async (hostElement: RealmElement, dispatcherElement?: RealmElement) => {
      const flow = getFlow(name, hostElement.$tagName());
      if (flow) callback?.(flow, hostElement, dispatcherElement);
    };

  return [registerFlowFn, flowCallback(onApply), flowCallback(onRemove)];
};
