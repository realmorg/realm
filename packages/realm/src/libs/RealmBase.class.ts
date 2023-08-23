import * as DOMUtils from "../utils/dom";
import * as CSSOMUtils from "../utils/cssom";
import { RealmState } from "./RealmState.class";
import { ElementAttributeEntries } from "../utils/element";
import { MixedDataType } from "../constants/data";

export class RealmBase
  extends HTMLElement
  implements DOMUtils.RealmBaseInterface
{
  // Element's name / tag's name
  name: string;

  // Element's random id
  id: string;

  // innerHTML cacche
  #html: string;

  // Shadow root assigned to element
  shadow: ShadowRoot;

  // Element's state
  states: RealmState;

  // Default element's states and attributes
  statesRegistry: Set<ElementAttributeEntries>;
  attrsRegistry: Set<ElementAttributeEntries>;

  // Clear HTML content
  _clear = DOMUtils._clear(this);

  // Set innerHTML
  _html = (html: MixedDataType, element?: HTMLElement) => {
    const setCurrentHtml = () => (this.#html = `${html}`);
    element ? DOMUtils._html(element, `${html}`) : setCurrentHtml();
  };

  //#region manipulate DOM utility functions
  _renderTemplate = DOMUtils._renderTemplate(this);
  _renderShadow = (flowElement: RealmBase) =>
    flowElement &&
    DOMUtils._append(this)(DOMUtils.$clone(this)(flowElement), this.$shadow());
  _content = DOMUtils._content(this);
  _attach = DOMUtils._attach(this);
  _append = DOMUtils._append(this);
  _remove = DOMUtils._remove(this);
  _replace = DOMUtils._replace(this);
  _createElement = DOMUtils._createElement;
  _createFragment = DOMUtils._createFragment;
  _attrs = DOMUtils._attrs(this);
  _attr = DOMUtils._attr(this);
  _removeAttr = DOMUtils._removeAttr(this);
  _data = DOMUtils._data(this);
  _datas = DOMUtils._datas(this);
  _slotTo = DOMUtils._slotTo;
  _addEvent = DOMUtils._addEvent(this);
  _removeEvent = DOMUtils._removeEvent(this);
  _addCustomEvent = DOMUtils._addCustomEvent(this);
  _sendEvent = DOMUtils._sendEvent(this);
  _debug = DOMUtils._debug(this);
  //#endregion

  //#region get DOM infos utility functions
  $html = (element?: Element) => DOMUtils.$html(element ?? this);
  $randId = DOMUtils.$randId;
  $name = DOMUtils.$name(this);
  $id = DOMUtils.$id(this);
  $tagName = DOMUtils.$tagName(this);
  $parent = DOMUtils.$parent(this);
  $parentNode = DOMUtils.$parentNode(this);
  $shadow = DOMUtils.$shadow(this);
  $root = DOMUtils.$root(this);
  $host = <T>(element?: Element) => DOMUtils.$host(element ?? this)<T>();
  $clone = DOMUtils.$clone(this);
  $qsString = DOMUtils.$qsString;
  $qs = DOMUtils.$qs(this);
  $qsAll = DOMUtils.$qsAll(this);
  $children = DOMUtils.$children(this);
  $nodes = DOMUtils.$nodes(this);
  $attrs = DOMUtils.$attrs(this);
  $attrsKv = DOMUtils.$attrsKv(this);
  $attr = DOMUtils.$attr(this);
  $hasAttr = DOMUtils.$hasAttr(this);
  $data = DOMUtils.$data(this);
  $el = DOMUtils.$el(this);
  $els = DOMUtils.$els(this);
  $shadowEl = DOMUtils.$shadowEl(this);
  $shadowEls = DOMUtils.$shadowEls(this);
  $slotAttrName = DOMUtils.$slotAttrName;
  $slotStateName = DOMUtils.$slotStateName;
  //#endregion

  //#region CSSOM utility functions
  _attachStyle = CSSOMUtils._attachStyle(this);
  _renderStyle = CSSOMUtils._renderStyle(this);
  _addCSS = CSSOMUtils._addCSS;
  _setCSSProperty = CSSOMUtils._setCSSProperty(this);
  _CSSvar = CSSOMUtils._CSSvar;
  $CSSvar = CSSOMUtils.$CSSvar;
  //#endregion
}
