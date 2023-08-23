import { RealmAttributeNames } from "../constants/attrs";
import { EMPTY_STRING } from "../constants/chars";
import { FlowActionTypes } from "../constants/flow";
import { RealmElement } from "../libs/RealmElement.class";
import { defineAction } from "../utils/action";
import { forEach, forEachNode } from "../utils/object";

/**
 * Trigger <trigger-action /> action
 * @param element
 * @param actionArgs
 * @returns
 */
export const triggerElementAction = defineAction({
  name: FlowActionTypes.TRIGGER_ELEMENT,

  onTrigger(
    element: RealmElement,
    _elementName: string,
    actionArgs: Array<string[]>,
    event: Event
  ) {
    forEach(actionArgs, ([actionName, selector]) =>
      forEachNode(
        element.$shadowEls(EMPTY_STRING, [[RealmAttributeNames.REF, selector]]),
        (el) => el?.[actionName]?.(event)
      )
    );
  },
});
