import { RealmTagNames } from "../constants/tags";
import { RealmAttributeNames } from "../constants/attrs";
import { RealmElement } from "../libs/RealmElement.class";
import { registerElement } from "./element.helper";
import { RealmElementPropKey } from "../constants/props";
import { RealmEventNames } from "../constants/events";

type ElementAttributeType = "string" | "number" | "boolean" | "object";

interface ElementAttribute {
  name: string;
  type: ElementAttributeType;
  value: string;
}

type ElementRuntimeEvents = {
  [RealmEventNames.MOUNTED]?: Map<string, () => void>;
  [RealmEventNames.UNMOUNTED]?: Map<string, () => void>;
  [RealmEventNames.ATTR_UPDATE]?: Map<
    string,
    (attrName: string, attrValue: string) => void
  >;
  [RealmEventNames.STATES_UPDATE]?: Map<
    string,
    (oldValue: unknown, attrValue: unknown) => void
  >;
};

const __RL_ATTRS_DEF_LIST: Record<string, ElementAttribute[]> = {};

const __RL_SCRIPT_DEF_LIST: Record<string, Node[]> = {};

const __RL_RUNTIME_LIST: Map<string, ElementRuntimeEvents> = new Map();

const __RL_RUNTIME_LIST_STR = "__RL_RUNTIME_LIST";

const __RL_ELEMENT_REGISTRY: Map<
  RealmElement,
  Map<RealmElementPropKey, unknown>
> = new Map();

const getCustomElementAttrEntries = (element: RealmElement) =>
  Array.from(element.$els(RealmTagNames.ELEMENT_ATTR));

const getCustomElementScriptEntries = (element: RealmElement) =>
  Array.from(element.$els(RealmTagNames.SCRIPT));

const getCustomElementAttrs = (element: RealmElement) =>
  getCustomElementAttrEntries(element)?.reduce<ElementAttribute[]>(
    (acc, item) => {
      acc.push({
        name: element.$attr(RealmAttributeNames.NAME, item),
        type: element.$attr(
          RealmAttributeNames.TYPE,
          item
        ) as ElementAttributeType,
        value: element.$html(item),
      });
      return acc;
    },
    []
  );

const getCustomElementScripts = (element: RealmElement) =>
  getCustomElementScriptEntries(element)?.reduce<Element[]>((acc, script) => {
    acc.push(script);
    return acc;
  }, []);

const removeCustomElementAttrs = (element: RealmElement) =>
  getCustomElementAttrEntries(element)?.forEach((el) => el.remove());

const removeCustomElementScripts = (element: RealmElement) =>
  getCustomElementScripts(element)?.forEach((script) => script.remove());

const getRegisteredElement = (element: RealmElement) => {
  const $element = () => __RL_ELEMENT_REGISTRY.get(element);
  if (!$element()) __RL_ELEMENT_REGISTRY.set(element, new Map());
  return $element();
};

export const defineElement = registerElement(RealmTagNames.DEFINE_ELEMENT, {
  onRegistered() {
    __RL_ELEMENT_REGISTRY.forEach((props, element) => {
      const html = props.get(RealmElementPropKey.HTML) as string;
      element._html(html);
      element._attach();
      element._render();
    });
  },

  onPrepare(element) {
    const tagName = element.$attr(RealmAttributeNames.NAME);

    // Attributes stuff
    const attrs = getCustomElementAttrs(element);
    if (attrs) __RL_ATTRS_DEF_LIST[tagName] = attrs;
    removeCustomElementAttrs(element);

    // Scripts stuff
    const scripts = getCustomElementScripts(element);
    if (scripts) __RL_SCRIPT_DEF_LIST[tagName] = scripts;
    removeCustomElementScripts(element);
  },

  onInit(element) {
    const html = element.$html();
    const tagName = element.$attr(RealmAttributeNames.NAME);
    const elementId = element.$id();

    const customElementRegister = registerElement(tagName, {
      onPrepare($element) {
        const elementRegistry = getRegisteredElement($element);

        elementRegistry.set(
          RealmElementPropKey.ATTRS,
          __RL_ATTRS_DEF_LIST?.[tagName].reduce(
            (acc, { name, value: defaultValue }) => {
              const slot = $element._createTag<HTMLSlotElement>(
                RealmTagNames.SLOT
              );
              slot.slot = name;

              const value = $element.$attr(name) || defaultValue;
              slot.textContent = value;

              acc.push([name, value]);
              $element.appendChild(slot);

              return acc;
            },
            []
          )
        );

        __RL_RUNTIME_LIST.set(tagName, {
          [RealmEventNames.MOUNTED]: new Map(),
          [RealmEventNames.UNMOUNTED]: new Map(),
          [RealmEventNames.ATTR_UPDATE]: new Map(),
          [RealmEventNames.STATES_UPDATE]: new Map(),
        });

        elementRegistry.set(
          RealmElementPropKey.SCRIPTS,
          __RL_SCRIPT_DEF_LIST?.[tagName].reduce((acc, script) => {
            const clonedScript = script.cloneNode(true);
            acc.push(clonedScript);

            const $script = element._createTag<HTMLScriptElement>(
              RealmTagNames.SCRIPT
            );
            $script.textContent = `(([${RealmEventNames.MOUNTED}, ${RealmEventNames.UNMOUNTED}, ${RealmEventNames.ATTR_UPDATE}, ${RealmEventNames.STATES_UPDATE}]) => { ${clonedScript.textContent} })([
              (fn) => ${__RL_RUNTIME_LIST_STR}.get('${tagName}')?.${RealmEventNames.MOUNTED}?.set('${elementId}', fn),
              (fn) => ${__RL_RUNTIME_LIST_STR}.get('${tagName}')?.${RealmEventNames.UNMOUNTED}?.set('${elementId}', fn),
              (fn) => ${__RL_RUNTIME_LIST_STR}.get('${tagName}')?.${RealmEventNames.ATTR_UPDATE}?.set('${elementId}', fn),
              (fn) => ${__RL_RUNTIME_LIST_STR}.get('${tagName}')?.${RealmEventNames.STATES_UPDATE}?.set('${elementId}', fn),
            ])`;
            element._attr(RealmAttributeNames.TYPE, "module", $script);
            $element.appendChild($script);
            return acc;
          }, [])
        );
      },

      onInit($element) {
        getRegisteredElement($element).set(RealmElementPropKey.HTML, html);
      },

      onMounted($element) {
        requestAnimationFrame(() => {
          __RL_RUNTIME_LIST
            .get(tagName)
            ?.[RealmEventNames.MOUNTED]?.forEach((fn) =>
              fn.apply(null, [$element])
            );
        });
        console.log("%s mounted", $element.name);
      },
    });

    console.log("define element init");
    element._attach();
    element._clear();
    customElementRegister();
  },

  onMounted(element) {
    console.log("define element mounted");
    element.remove();
  },

  onUnmounted(element) {
    console.log("define element unmounted");
  },
});
