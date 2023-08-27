import { COLON } from "../constants/chars";
import { FlowEventNames, FlowRuntimeEventTypes } from "../constants/flow";
import { RealmElement } from "../libs/RealmElement.class";
import { FlowAction, FlowEvent, defineFlow } from "../utils/flow";
import { forEach } from "../utils/object";
import { reqAnim } from "../utils/timer";

type ApplyEventCallback = (
  dispatcherElement: RealmElement,
  eventType: string,
  eventName: string,
  actions: FlowAction[]
) => void;

const dispatchEvent =
  (isRemoveEvent?: boolean) =>
  (
    dispatcherElement: RealmElement,
    eventType: string,
    eventName: string,
    actions: FlowAction[]
  ) => {
    const hasEventName = !!eventName;
    const eventCaller = isRemoveEvent
      ? dispatcherElement._removeEvent
      : dispatcherElement._addCustomEvent;
    const isCustomEvent = eventType === FlowRuntimeEventTypes.ON;
    const finalEventName = isCustomEvent
      ? FlowRuntimeEventTypes.ON + COLON + eventName
      : eventType;

    eventCaller(finalEventName, (event) => {
      if (!isCustomEvent && hasEventName && eventName !== event[0]) return;
      reqAnim(() =>
        dispatcherElement._sendEvent(FlowEventNames.LISTEN_EVENT, [
          eventType,
          eventName,
          actions,
          event,
        ])
      );
    });
  };

const applyEventListener = (
  flow: Set<FlowEvent>,
  hostElement: RealmElement,
  applyEventCallback: ApplyEventCallback
) =>
  forEach(flow, ([attrs, actions]) =>
    forEach(attrs, ([eventType, eventName]) =>
      applyEventCallback(hostElement, eventType, eventName, actions)
    )
  );

export const listenEventFlow = defineFlow({
  name: FlowEventNames.LISTEN_EVENT,

  async onApply(flow, hostElement, dispatcherElement) {
    applyEventListener(flow, dispatcherElement ?? hostElement, dispatchEvent());
  },

  async onRemove(flow, hostElement, dispatcherElement) {
    applyEventListener(
      flow,
      dispatcherElement ?? hostElement,
      dispatchEvent(true)
    );
  },
});
