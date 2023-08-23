import { RealmAttributeNames } from "../constants/attrs";
import { MixedDataType } from "../constants/data";
import { RealmTagNames } from "../constants/tags";
import { RealmElement } from "../libs/RealmElement.class";
import { head } from "../utils/dom";
import { defineElement } from "../utils/element";
import { createMap, entriesOf, getMap, setMap } from "../utils/object";

const SCRIPT_RESOURCE_REGISTRY = createMap<string, boolean>();

const STYLES_RESOURCE_REGISTRY = createMap<string, boolean>();

const appendResource = <T extends Element>(
  element: RealmElement,
  tagName: string,
  attrs: [name: string, value?: MixedDataType][],
  appendTo: HTMLElement | ShadowRoot
) => {
  const createdElement = element._createElement<T>(tagName);
  element._attrs(attrs, createdElement);
  element._append(createdElement, appendTo);
};

export const importScriptElement = defineElement({
  name: RealmTagNames.IMPORT_SCRIPT,

  onMounted(element) {
    const parentNode = element.$parentNode();
    const isValidParentNode = parentNode instanceof ShadowRoot;
    if (!isValidParentNode) return;

    const { from, local, ...attrs } = element.$attrsKv();
    const hasAdded = getMap(SCRIPT_RESOURCE_REGISTRY, from);
    const hasLocal = local !== undefined;
    if (!hasAdded && !hasLocal) {
      appendResource<HTMLScriptElement>(
        element,
        RealmTagNames.SCRIPT,
        [[RealmAttributeNames.SRC, <string>from], ...entriesOf(attrs)],
        head
      );
      setMap(SCRIPT_RESOURCE_REGISTRY, from, true);
    }
    element._remove();
  },
});

export const importStyleElement = defineElement({
  name: RealmTagNames.IMPORT_STYLE,

  onMounted(element) {
    const parentNode = element.$parentNode();
    const isValidParentNode = parentNode instanceof ShadowRoot;
    if (!isValidParentNode) return;

    const { from, local, ...attrs } = element.$attrsKv();
    const hasAdded = getMap(STYLES_RESOURCE_REGISTRY, from);
    const hasLocalAttr = local !== undefined;
    const resourceArgs = [
      element,
      RealmTagNames.LINK,
      [
        [RealmAttributeNames.HREF, from],
        [RealmAttributeNames.REL, "stylesheet"],
        ...entriesOf(attrs),
      ],
    ];
    if (!hasAdded) {
      appendResource.apply(null, [...resourceArgs, head]);
      setMap(STYLES_RESOURCE_REGISTRY, from, true);
    }

    if (hasLocalAttr) {
      appendResource.apply(null, [
        ...resourceArgs,
        element.$host<RealmElement>().$shadow(),
      ]);
    }
    element._remove();
  },
});
