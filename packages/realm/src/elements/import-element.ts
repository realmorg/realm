import { RealmAttributeNames } from "../constants/attrs";
import { DOT_NOTATION } from "../constants/chars";
import { RealmTagNames } from "../constants/tags";
import { DOMFrom, doc } from "../utils/dom";
import { defineElement } from "../utils/element";
import { createMap, entriesOf, getMap, setMap } from "../utils/object";
import { newError } from "../utils/string";

const IMPORT_ELEMENT_REQUEST_CACHE = createMap<string, string>();

export const importElement = defineElement({
  name: RealmTagNames.IMPORT_ELEMENT,

  async onBeforeInit(element) {
    const { from, automount, as: tagAlias, ...attrs } = element.$attrsKv();
    const [, cachedHtml] =
      getMap<string, string>(IMPORT_ELEMENT_REQUEST_CACHE, <string>from) ?? [];

    if (!cachedHtml) {
      try {
        const response = await fetch(<string>from);
        const html = await response.text();
        setMap(IMPORT_ELEMENT_REQUEST_CACHE, from, html);
      } catch {
        newError(`Failed to fetch "${from}"`);
      }
    }

    const customElement = element.$qs(
      RealmTagNames.CUSTOM_ELEMENT,
      [],
      DOMFrom(getMap(IMPORT_ELEMENT_REQUEST_CACHE, from))
    );
    if (!customElement) return element._remove();

    const nameAttr = element.$attr<string>(
      RealmAttributeNames.NAME,
      customElement
    );
    let customElementName = <string>tagAlias ?? nameAttr;
    const hasDefined = !!customElements.get(customElementName);
    if (hasDefined) {
      customElementName = customElementName + DOT_NOTATION + element.$randId();
    }
    element._attr(RealmAttributeNames.NAME, customElementName, customElement);

    if (automount !== undefined) {
      const mountElement =
        element._createElement<HTMLElement>(customElementName);
      element._attrs(entriesOf(attrs), mountElement);
      element._append(customElement, doc.body);
      element._replace(mountElement, element);
    } else {
      element._append(customElement, doc.body);
      element._remove();
    }
  },
});
