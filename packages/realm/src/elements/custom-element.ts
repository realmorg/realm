import { RealmAttributeNames } from "../constants/attrs";
import { RealmTagNames } from "../constants/tags";
import { setAttrRegistry, setStateRegistry } from "../utils/action";
import {
  getCustomElementAttrs,
  defineElement,
  removeCustomElementAttrs,
} from "../utils/element";
import { registerElement } from "./core-element";

export const customElement = defineElement({
  name: RealmTagNames.CUSTOM_ELEMENT,

  /**
   * Preparing attributes and states for `custom-element` element
   * @param element RealmElement
   */
  onBeforeInit(element) {
    //#region register attributes and states definition
    const mutableStores: Array<
      [string, typeof setAttrRegistry | typeof setStateRegistry]
    > = [
      [RealmTagNames.ELEMENT_ATTR, setAttrRegistry],
      [RealmTagNames.ELEMENT_STATE, setStateRegistry],
    ];

    const customElementName = element.$attr<string>(RealmAttributeNames.NAME);
    for (const [tagName, setRegistry] of mutableStores) {
      const attrs = getCustomElementAttrs(element, tagName);
      if (attrs) setRegistry(customElementName, attrs);
      removeCustomElementAttrs(element, tagName);
    }
    //#endregion
  },

  /**
   * Initializing custom element
   * @param element RealmElement
   */
  onInit(element) {
    registerElement(element.$attr<string>(RealmAttributeNames.NAME)).call(this);
  },

  /**
   * Mounting custom element
   * @param element RealmElement
   */
  onMounted(element) {
    element._remove();
  },
});
