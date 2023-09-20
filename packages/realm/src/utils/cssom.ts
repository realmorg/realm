import { RealmMutableAttr } from "../constants/attrs";
import {
  COLON as ATTR_SEPARATOR,
  DASH_SEPARATOR,
  EMPTY_STRING,
  LEFT_BRACES,
  LEFT_PARENTHESES,
  PIPELINE_SEPARATOR,
  RIGHT_BRACES,
  RIGHT_PARENTHESES,
  SEMICOLON,
  STATE_PREFIX,
  VAR_PREFIX,
} from "../constants/chars";
import { MixedDataType } from "../constants/data";
import { CSS_CUSTOM_SELECTOR_REGEX } from "../constants/regx";
import { HOST_SELECTOR, RealmCSSVarConst } from "../constants/styles";
import { RealmElement } from "../libs/RealmElement.class";
import { $html, $shadow, RealmBaseInterface, _remove } from "./dom";
import { ElementDataTypes } from "./element";
import { isTruthy } from "./logic";
import {
  arrayJoin,
  arrayMap,
  arrayPush,
  arrayReduce,
  arraySplit,
  createArray,
  forEach,
  someArray,
} from "./object";
import { dash, strReplace, strSlice, strStartWith, strTrim } from "./string";

export type CSSRules = Array<[string, [property: string, value: string][]]>;

const getStyle = (rule: CSSStyleRule) => rule?.style;

const selectorText = (rule: CSSStyleRule, value?: string) => {
  if (!value) return rule?.selectorText;
  rule.selectorText = value;
};

const CSSText = (style: CSSStyleDeclaration, value?: string) => {
  if (!value) return style.cssText;
  style.cssText = value;
};

const setStyleProperty = (
  style: CSSStyleDeclaration,
  propName: string,
  propValue: string
) => style.setProperty(propName, propValue);

const getStyleProperty = (style: CSSStyleDeclaration, propName: string) =>
  style.getPropertyValue(propName);

const forEachCSSRules = (
  sheets: CSSStyleSheet[],
  callback: (rule: CSSStyleRule) => void
) =>
  forEach(sheets, (sheet) => forEach(Object.values(sheet.cssRules), callback));

export const $adoptedStyleSheets = (self: RealmBaseInterface) =>
  $shadow(self)().adoptedStyleSheets;

export const _attachStyle = (self: RealmBaseInterface) => () => {
  const sheet = new CSSStyleSheet();
  arrayPush($adoptedStyleSheets(self), sheet);
  return sheet;
};

export const _CSSvar = (
  name: string,
  rule?: CSSStyleRule,
  value?: string | number,
  overwrite: boolean = true
) => {
  const varName = `${DASH_SEPARATOR}${DASH_SEPARATOR}${CSS.escape(dash(name))}`;
  const style = getStyle(rule);
  if (!style) return varName;

  const getProperty = () => getStyleProperty(style, varName);
  if (value === undefined) return getProperty();

  const setProperty = () => setStyleProperty(style, varName, `${value}`);
  if (!overwrite && !getProperty()) {
    setProperty();
    return;
  }

  setProperty();
};

export const $CSSvar = (name: string) =>
  `${VAR_PREFIX}${LEFT_PARENTHESES}${DASH_SEPARATOR}${DASH_SEPARATOR}${name}${RIGHT_PARENTHESES}`;

export const _renderStyle =
  (self: RealmBaseInterface) => (styleElement: HTMLStyleElement) => {
    if (!styleElement) return;

    const cssRules = $html(styleElement);
    const sheet = _attachStyle(self)();
    arrayPush($adoptedStyleSheets(self), sheet);
    sheet.replaceSync(cssRules);

    forEachCSSRules([sheet], (rule) => {
      const selector = selectorText(rule);
      const matches = createArray<string>(
        selector?.matchAll(CSS_CUSTOM_SELECTOR_REGEX) ?? []
      );
      if (!matches.length) return;

      const currentRule = getStyle(rule);

      // @note: get css property and value as entries
      const cssPropValue = arrayReduce(
        arraySplit(CSSText(currentRule), SEMICOLON),
        (acc, style) =>
          !style
            ? acc
            : [...acc, arrayMap(arraySplit(style, ATTR_SEPARATOR), strTrim)],
        []
      );

      // @note: replace selector :host(\(@|#)name) with :host only
      selectorText(
        rule,
        strReplace(selector, CSS_CUSTOM_SELECTOR_REGEX, HOST_SELECTOR)
      );

      // @note: add --style css var to rule
      _CSSvar(
        RealmCSSVarConst.STYLE,
        rule,
        arrayJoin(
          arrayMap(cssPropValue, (item) => arrayJoin(item, ATTR_SEPARATOR)),
          PIPELINE_SEPARATOR
        )
      );

      for (const match of matches) {
        const [, mutator, _hasCondition, operatorOrGlobal, ...operators] =
          match;
        const mutatorType = strStartWith(mutator, STATE_PREFIX)
          ? RealmMutableAttr.STATE
          : RealmMutableAttr.ATTR;
        const mutatorName = strSlice(mutator);
        _CSSvar(mutatorType, rule, mutatorName);

        const isGlobal = operatorOrGlobal === RealmCSSVarConst.GLOBAL;
        const cssVarPrefix = mutatorName + DASH_SEPARATOR;
        if (isGlobal) _CSSvar(cssVarPrefix + RealmCSSVarConst.GLOBAL, rule, 1);

        const [hasOperator, operator, value] = operators ?? [];
        if (!hasOperator) return;
        _CSSvar(cssVarPrefix + RealmCSSVarConst.OPERATOR, rule, operator);
        _CSSvar(cssVarPrefix + RealmCSSVarConst.COMPARATOR, rule, value);
      }
    });

    _remove(styleElement)();
  };

export const _addCSS = (sheet: CSSStyleSheet, cssRules: CSSRules) =>
  sheet.insertRule(
    arrayReduce(
      cssRules,
      (acc, [selector, rules]) => {
        acc +=
          selector +
          LEFT_BRACES +
          arrayJoin(
            arrayReduce(
              rules,
              (acc, [property, value]) => [
                ...acc,
                arrayJoin([property, value], ATTR_SEPARATOR),
              ],
              []
            ),
            SEMICOLON
          ) +
          RIGHT_BRACES;
        return acc;
      },
      EMPTY_STRING
    )
  );

export const _setCSSProperty =
  (self: RealmBaseInterface) =>
  (selector: string, name: string, value: string | null) =>
    forEachCSSRules($adoptedStyleSheets(self), (rule: CSSStyleRule) => {
      if (selectorText(rule) !== selector) return;
      const style = rule.style;
      if (getStyleProperty(style, name) !== value)
        setStyleProperty(style, name, value);
    });

const updateRuleProperty =
  (rule: CSSStyleRule) =>
  ([property, value]: Array<string>): void =>
    setStyleProperty(getStyle(rule), property, value);

const removeRuleProperty =
  (rule: CSSStyleRule) =>
  ([property]: Array<string>) =>
    getStyle(rule).removeProperty(property);

export const bindCSS = (
  element: RealmElement,
  name: string,
  value: MixedDataType,
  valueType: ElementDataTypes,
  dataType: string,
  isGlobalUpdate: boolean = false
): void => {
  if (
    ![
      ElementDataTypes.STRING,
      ElementDataTypes.BOOLEAN,
      ElementDataTypes.NUMBER,
    ].includes(valueType)
  )
    return;

  const sheet = $adoptedStyleSheets(element);
  const strValue = `${value}`;

  forEachCSSRules(sheet, (rule) => {
    // @note: convert all states or attributes to css vars
    const defaultCSSVarPrefix =
      (isGlobalUpdate ? RealmCSSVarConst.GLOBAL : dataType) + DASH_SEPARATOR;
    _CSSvar(defaultCSSVarPrefix + name, rule, strValue, false);

    // @note: matching css selector
    const state = _CSSvar(RealmMutableAttr.STATE, rule);
    const attr = _CSSvar(RealmMutableAttr.ATTR, rule);
    if (!state && !attr) return;
    if ((state && state !== name) || (attr && attr !== name)) return;

    const cssVarPrefix = name + DASH_SEPARATOR;
    _CSSvar(cssVarPrefix + RealmCSSVarConst.VALUE, rule, strValue);

    const operator = _CSSvar(cssVarPrefix + RealmCSSVarConst.OPERATOR, rule);
    const styles = _CSSvar(RealmCSSVarConst.STYLE, rule);
    const cssText = arrayMap(arraySplit(styles, PIPELINE_SEPARATOR), (style) =>
      arraySplit(style, ATTR_SEPARATOR)
    );
    const hasOperator = !!operator;

    const comparator = _CSSvar(
      cssVarPrefix + RealmCSSVarConst.COMPARATOR,
      rule
    );

    const isTrue = isTruthy(operator, comparator, strValue);
    const isUpdateStyle = hasOperator ? isTrue : true;

    if (!isUpdateStyle) {
      if (!someArray(cssText, ([property]) => !!getStyle(rule)[property]))
        return;
      return forEach(cssText, removeRuleProperty(rule));
    }

    forEach(cssText, updateRuleProperty(rule));
  });
};
