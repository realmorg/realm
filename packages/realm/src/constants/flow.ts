import { RealmMutableAttr } from "./attrs";

export const FlowEventNames = {
  TRIGGER_EVENT: "trigger-event",
  LISTEN_EVENT: "listen-event",
} as const;

export const FlowRuntimeEventTypes = {
  MOUNTED: "mounted",
  UNMOUNTED: "unmounted",
  ATTR_CHANGED: "attrchanged",
  STATE_CHANGED: "statechanged",
  ON: "on",
} as const;

export const FlowRuntimeMutableEventTypesLookup = {
  [RealmMutableAttr.ATTR]: FlowRuntimeEventTypes.ATTR_CHANGED,
  [RealmMutableAttr.STATE]: FlowRuntimeEventTypes.STATE_CHANGED,
};

export const FlowActionTypes = {
  SET_STATE: "set-state",
  SET_ATTR: "set-attr",
  SET_TIMER: "set-timer",
  SEND_EVENT: "send-event",
  TRIGGER_ELEMENT: "trigger-element",
  SCRIPT: "script",
  HTTP_REQUEST: "http-request",
  REQUEST_HEADER: "request-header",
  REQUEST_BODY: "request-body",
  RESPONSE_SUCCESS: "response-ok",
  RESPONSE_ERROR: "response-fail",
} as const;

export const FlowMutateTypes = {
  EQUALS_TO: "=",
  ADD: "+",
  SUBTRACT: "-",
  MULTIPLY: "*",
  DIVIDE: "/",
  ADD_STR: "add",
  ASSIGN: "assign",
  PUSH: "push",
  POP: "pop",
  REMOVE: "remove",
} as const;

export enum FlowDataSource {
  EVENT = "event",
  EVENT_ATTR = "event:attr",
  LOCAL_STATE = "localState",
  GLOBAL_STATE = "globalState",
  ATTR = "attr",
}

export const ALL_USE_FN = `${FlowDataSource.LOCAL_STATE},${FlowDataSource.GLOBAL_STATE},${FlowDataSource.EVENT},attrs, ${FlowDataSource.ATTR},$`;
