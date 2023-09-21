import { RealmAttributeNames } from "../constants/attrs";
import { FlowActionTypes } from "../constants/flow";
import {
  getGlobalStateType,
  updateGlobalState,
} from "../elements/global-state";
import { RealmElement } from "../libs/RealmElement.class";
import {
  defineAction,
  findAttr,
  getAttrType,
  getMutatedValue,
} from "../utils/action";
import { ElementDataTypes, parseValue } from "../utils/element";

/**
 * Trigger <set-state /> action
 * @param element
 * @param actionArgs
 * @returns
 */
export const setStateAction = defineAction({
  name: FlowActionTypes.SET_STATE,
  requiredAttrs: [RealmAttributeNames.NAME],

  onTrigger(
    element: RealmElement,
    _elementName: string,
    actionArgs: Array<string[]>,
    event
  ) {
    const updateLocalState = (name: string, value: unknown) =>
      element.states.set(name, value);
    const [nameAttr] = findAttr<string>(actionArgs, RealmAttributeNames.NAME);
    const [, hasGlobalAttr] = findAttr(actionArgs, RealmAttributeNames.GLOBAL);
    const attrType = hasGlobalAttr
      ? getGlobalStateType(nameAttr)
      : getAttrType(nameAttr, element.statesRegistry);
    const updateState = hasGlobalAttr ? updateGlobalState : updateLocalState;
    const value = getMutatedValue(element, actionArgs, attrType, event);
    updateState(nameAttr, value);
  },
});

/**
 * Trigger <set-attr /> action
 * @param element
 * @param actionArgs
 * @returns
 */
export const setAttrAction = defineAction({
  name: FlowActionTypes.SET_ATTR,
  requiredAttrs: [RealmAttributeNames.NAME],

  onTrigger(
    element: RealmElement,
    _elementName: string,
    actionArgs: Array<string[]>,
    event
  ) {
    const [nameAttr] = findAttr<string>(actionArgs, RealmAttributeNames.NAME);
    const attrType = getAttrType(nameAttr, element.attrsRegistry);
    const attrValue = element.$attr<string>(nameAttr);
    const parsedValue =
      attrType === ElementDataTypes.BOOLEAN ? Boolean(attrValue) : attrValue;
    const mutatedValue = getMutatedValue(element, actionArgs, attrType, event);
    const prevValue = parseValue(attrType, parsedValue);
    const value = mutatedValue(prevValue);
    element._attr(nameAttr, `${value}`);
  },
});
