import { RealmAttributeNames } from "../constants/attrs";
import { COLON, EMPTY_STRING } from "../constants/chars";
import { FlowActionTypes, FlowRuntimeEventTypes } from "../constants/flow";
import { RealmElement } from "../libs/RealmElement.class";
import { defineAction, findAttr, getSourceFrom } from "../utils/action";
import { ElementDataTypes } from "../utils/element";
import { JSONSafeParse } from "../utils/json";
import { createArray, forEach } from "../utils/object";

/**
 * Trigger <send-event /> action
 * @param element
 * @param actionArgs
 * @returns
 */
export const sendEventAction = defineAction({
  name: FlowActionTypes.SEND_EVENT,

  requiredAttrs: [RealmAttributeNames.NAME],

  onTrigger(
    element: RealmElement,
    _elementName: string,
    actionArgs: Array<string[]>,
    $event: Event
  ) {
    const [eventNameAttr] = findAttr<string>(
      actionArgs,
      RealmAttributeNames.NAME
    );
    const [targetAttr, hasTargetAttr] = findAttr<string>(
      actionArgs,
      RealmAttributeNames.TO
    );
    const [parentTargetAttr, hasParentTargetAttr] = findAttr<string>(
      actionArgs,
      RealmAttributeNames.TO + COLON + "parent"
    );
    const [typeAttr, hasTypeAttr] = findAttr<ElementDataTypes>(
      actionArgs,
      RealmAttributeNames.TYPE
    );
    const [valueAttr, hasValueAttr] = findAttr<ElementDataTypes>(
      actionArgs,
      RealmAttributeNames.VALUE
    );
    const [fromAttr, hasFromAttr] = findAttr<ElementDataTypes>(
      actionArgs,
      RealmAttributeNames.FROM
    );
    const [actionAttr] = findAttr<string>(
      actionArgs,
      RealmAttributeNames.ACTION
    );
    const hasValueFromAttr = hasValueAttr && hasFromAttr;

    const getValue = () =>
      getSourceFrom(element, typeAttr, valueAttr, fromAttr, $event);

    const eventDetailExtendedTypeLookup = {
      [ElementDataTypes.HTML]: () => actionAttr,
      [ElementDataTypes.JSON_STRING]: () => JSONSafeParse(actionAttr),
    };

    const selector = [EMPTY_STRING, RealmAttributeNames.REF, targetAttr];
    const eventName = FlowRuntimeEventTypes.ON + COLON + eventNameAttr;
    let eventDetail = $event;
    if (hasTypeAttr)
      eventDetail = !hasValueFromAttr
        ? eventDetailExtendedTypeLookup[typeAttr]?.()
        : getValue();

    let targetElements: RealmElement[] = [element];

    if (hasTargetAttr) {
      targetElements = createArray(element.$shadowEls.apply(null, selector));
    }

    if (hasParentTargetAttr) {
      const parentElement = element.$host<RealmElement>();
      targetElements = [parentElement];
      if (parentTargetAttr !== EMPTY_STRING) {
        targetElements = createArray(
          parentElement.$shadowEls.apply(null, selector)
        );
      }
    }

    forEach(targetElements, (targetElement: RealmElement) =>
      targetElement._sendEvent(eventName, eventDetail)
    );
  },
});
