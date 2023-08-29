import { RealmAttributeNames } from "../constants/attrs";
import { DASH_SEPARATOR, RealmLogicOp, VAR_PREFIX } from "../constants/chars";
import { HOST_SELECTOR } from "../constants/styles";
import { RealmTagNames } from "../constants/tags";
import { RealmElement } from "../libs/RealmElement.class";
import { CSSRules, _CSSvar } from "../utils/cssom";
import { $randId } from "../utils/dom";
import { addAttrBinding, defineElement } from "../utils/element";
import { isTruthy } from "../utils/logic";
import { arrayReduce } from "../utils/object";

type VisibilitySwitch = [on: string | null, off: string | null];

const getOperatorComparator = (element: RealmElement) =>
  arrayReduce<string, string[]>(
    [
      RealmLogicOp.EQUALS_TO,
      RealmLogicOp.NOT_EQUALS_TO,
      RealmLogicOp.GREATER_THAN,
      RealmLogicOp.GREATER_THAN_OR_EQUALS_TO,
      RealmLogicOp.LESS_THAN,
      RealmLogicOp.LESS_THAN_OR_EQUALS_TO,
      RealmLogicOp.CONTAINS,
    ],
    (acc, operator) => {
      if (!element.$hasAttr(operator)) return acc;
      return [operator, element.$attr(operator)];
    },
    []
  );

const isVisibleTruthy = (element: RealmElement, value: string | boolean) => {
  const [operator, comparator] = getOperatorComparator(element);
  return isTruthy(operator, comparator, `${value}`);
};

const updateIsVisibleCSSProperty = (
  element: RealmElement,
  attrValue: string,
  cssVarName: string,
  isVisiblePropName,
  isHiddenPropName
) => {
  const hasAttrValue = element.$hasAttr(RealmAttributeNames.VALUE);
  const isVisible = isVisibleTruthy(
    element,
    attrValue || (hasAttrValue && attrValue === "")
  );
  element._setCSSProperty(
    HOST_SELECTOR,
    element._CSSvar(cssVarName),
    isVisible ? isVisiblePropName : isHiddenPropName
  );
};

const createVisibilityElement = (
  elementName: string,
  [visible, hidden]: VisibilitySwitch
) => {
  const displayVarName = VAR_PREFIX + DASH_SEPARATOR + $randId();

  return defineElement({
    name: elementName,

    onBeforeInit(element) {
      const [operator] = getOperatorComparator(element);
      addAttrBinding(element, RealmAttributeNames.VALUE);
      addAttrBinding(element, operator);

      const slot = element._createElement<HTMLSlotElement>(RealmTagNames.SLOT);
      const cssRules = <CSSRules>[
        [
          HOST_SELECTOR,
          [
            [_CSSvar(displayVarName), hidden],
            ["display", element.$CSSvar(displayVarName)],
          ],
        ],
      ];
      element._attach();
      element._append(slot, element.$shadow());
      element._addCSS(element._attachStyle(), cssRules);
      element._slotTo(slot, element.$nodes());
    },

    onInit(element) {
      updateIsVisibleCSSProperty(
        element,
        element.$attr<string>(RealmAttributeNames.VALUE),
        displayVarName,
        hidden,
        visible
      );
    },

    onAttributeChanged(element, attrName, attrValue: string) {
      if (attrName !== RealmAttributeNames.VALUE) return;
      updateIsVisibleCSSProperty(
        element,
        attrValue,
        displayVarName,
        hidden,
        visible
      );
    },
  });
};

const VISIBLE_VALUE = "contents";
const HIDDEN_VALUE = "none";

export const isVisibleElement = createVisibilityElement(
  RealmTagNames.IS_VISIBLE,
  [HIDDEN_VALUE, VISIBLE_VALUE]
);

export const isHiddenElement = createVisibilityElement(
  RealmTagNames.IS_HIDDEN,
  [VISIBLE_VALUE, HIDDEN_VALUE]
);
