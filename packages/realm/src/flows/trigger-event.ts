import { RealmElement } from "../libs/RealmElement.class";
import { RealmAttributeNames } from "../constants/attrs";
import { EMPTY_STRING } from "../constants/chars";
import { FlowEventNames } from "../constants/flow";
import { findAttrFrom } from "../utils/element";
import { FlowAction, FlowEvent, defineFlow } from "../utils/flow";
import { forEach, forEachNode } from "../utils/object";
import { TimerReturn, timerOnce } from "../utils/timer";

type ApplyEventCallback<T> = (
  dispatcherElement: RealmElement,
  debounceTime: number,
  eventName: string,
  actions: FlowAction[]
) => (element: T) => void;

const sendTriggerEvent =
  (
    dispatcherElement: RealmElement,
    debounceTimer: TimerReturn,
    debounceTime: number,
    eventName: string,
    actions: FlowAction[]
  ) =>
  (event: Event) => {
    const [, clearTimeout] = debounceTimer || [];
    clearTimeout?.();

    if (debounceTime > 0) {
      const eventValue = event?.target?.[RealmAttributeNames.VALUE];
      debounceTimer = timerOnce(() => {
        if (eventValue !== undefined && !!event?.target)
          event.target[RealmAttributeNames.VALUE] = eventValue;
        dispatcherElement._sendEvent(FlowEventNames.TRIGGER_EVENT, [
          EMPTY_STRING,
          eventName,
          actions,
          event,
        ]);
      }, debounceTime);
      return;
    }

    return dispatcherElement._sendEvent(FlowEventNames.TRIGGER_EVENT, [
      EMPTY_STRING,
      eventName,
      actions,
      event,
    ]);
  };

const dispatchEvent =
  (hostElement?: RealmElement, isRemoveEvent?: boolean) =>
  (
    dispatcherElement: RealmElement,
    debounceTime: number,
    eventName: string,
    actions: FlowAction[]
  ) =>
  (listenerElement: RealmElement) => {
    let debounceTimer: TimerReturn;
    const eventCaller = isRemoveEvent
      ? dispatcherElement._removeEvent
      : dispatcherElement._addEvent;
    eventCaller(
      eventName,
      sendTriggerEvent(
        hostElement,
        debounceTimer,
        debounceTime,
        eventName,
        actions
      ),
      listenerElement
    );
  };

const applyTriggerEvent = (
  flow: Set<FlowEvent>,
  hostElement: RealmElement,
  applyEventCallback: ApplyEventCallback<RealmElement>
) =>
  forEach(flow, ([attrs, actions]) => {
    const debounceTime = +findAttrFrom(attrs, RealmAttributeNames.DEBOUNCE);
    forEach(attrs, ([attrName, attrValue]) => {
      if (attrName === RealmAttributeNames.DEBOUNCE) return;
      forEachNode(
        hostElement.$shadowEls(
          EMPTY_STRING,
          RealmAttributeNames.REF,
          attrValue
        ),
        applyEventCallback(hostElement, debounceTime, attrName, actions)
      );
    });
  });

export const triggerEventFlow = defineFlow({
  name: FlowEventNames.TRIGGER_EVENT,

  async onApply(flow, hostElement, dispatcherElement) {
    applyTriggerEvent(
      flow,
      dispatcherElement ?? hostElement,
      dispatchEvent(hostElement)
    );
  },

  async onRemove(flow, hostElement, dispatcherElement) {
    applyTriggerEvent(
      flow,
      dispatcherElement ?? hostElement,
      dispatchEvent(hostElement, true)
    );
  },
});
