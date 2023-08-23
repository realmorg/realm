import { RealmAttributeNames } from "../constants/attrs";
import { FlowActionTypes } from "../constants/flow";
import { RealmElement } from "../libs/RealmElement.class";
import { defineAction, doAction, findAttr } from "../utils/action";
import { FlowAction } from "../utils/flow";
import { timerEvery, timerOnce } from "../utils/timer";

/**
 * Trigger <set-timer /> action
 * @param element
 * @param actionArgs
 * @returns
 */
export const setTimerAction = defineAction({
  name: FlowActionTypes.SET_TIMER,

  requiredAttrs: [RealmAttributeNames.ONCE, RealmAttributeNames.EVERY],

  onTrigger(
    element: RealmElement,
    elementName: string,
    actionArgs: Array<string[]>,
    event: Event,
    eventType: string,
    eventName: string
  ) {
    const [actionAttr, hasActionAttr] = findAttr<FlowAction[]>(
      actionArgs,
      RealmAttributeNames.ACTION
    );

    if (!hasActionAttr) return;

    const [onceAttr, hasOnceAttr] = findAttr(
      actionArgs,
      RealmAttributeNames.ONCE
    );
    const [everyAttr, hasEveryAttr] = findAttr(
      actionArgs,
      RealmAttributeNames.EVERY
    );

    const doTimer = () =>
      doAction(element, elementName, actionAttr)(eventName, eventType, event);

    if (hasOnceAttr) {
      timerOnce(doTimer, +onceAttr);
    } else if (hasEveryAttr) {
      timerEvery(doTimer, +everyAttr);
    }
  },
});
