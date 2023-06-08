import { RealmTagNames } from "../constants/tags";
import { RealmAttributeNames } from "../constants/attrs";
import { RealmElement } from "../libs/RealmElement.class";
import { registerElement } from "./element.helper";
import { RealmElementPropKey } from "../constants/props";
import { RealmEventNames } from "../constants/events";
import { RealmStates, StateObserver } from "../libs/RealmStates.class";

type ElementAttributeType = "string" | "number" | "boolean" | "object";

interface ElementAttribute {
  name: string;
  type: ElementAttributeType;
  value: string;
}

type ElementRuntimeEvents = {
  [RealmEventNames.INIT]?: Map<string, (RealmElement) => void>;
  [RealmEventNames.MOUNTED]?: Map<string, (RealmElement) => void>;
  [RealmEventNames.UNMOUNTED]?: Map<string, () => void>;
  [RealmEventNames.ATTR_UPDATE]?: Map<
    string,
    (attrName: string, attrValue: string) => void
  >;
  [RealmEventNames.STATES_UPDATE]?: Map<string, StateObserver>;
};

const __RL_ATTRS_DEFINITION_LIST: Record<string, ElementAttribute[]> = {};

const __RL_SCRIPT_DEFINITION_LIST: Record<string, Node[]> = {};

const __RL_RUNTIME_LIST: Map<string, ElementRuntimeEvents> = new Map();

const __RL_ELEMENT_ATTRS: Map<string, HTMLSlotElement> = new Map();

const __RL_ELEMENT_STATES: Map<string, HTMLSlotElement> = new Map();

const __RL_ELEMENT_REGISTRY: Map<
  RealmElement,
  Map<RealmElementPropKey, unknown>
> = new Map();

const __RL_ELEMENT_MAP: Map<string, RealmElement> = new Map();

const __RL_EVENT_LIST = [
  RealmEventNames.ON,
  RealmEventNames.INIT,
  RealmEventNames.MOUNTED,
  RealmEventNames.UNMOUNTED,
  RealmEventNames.ATTR_UPDATE,
  RealmEventNames.STATES_UPDATE,
];

const __RL_UTILS = {
  registerScriptEventList: (elementId: string, scriptId: string) => {
    const element = __RL_ELEMENT_MAP.get(elementId);
    const runtimeEvents = __RL_RUNTIME_LIST.get(elementId);
    const localState = new RealmStates();

    return __RL_EVENT_LIST.reduce((acc, eventName) => {
      const isEventStateUpdate = eventName === RealmEventNames.STATES_UPDATE;

      const eventFn = (fn) => {
        runtimeEvents?.[eventName]?.set(scriptId, fn);

        if (!isEventStateUpdate) return;

        localState.subscribe((oldValue, newValue, key) => {
          fn?.apply?.(element, [oldValue, newValue, key]);
          if (!newValue) return;

          const slotStateName = `#${key}`;
          const slotStateKey = `${scriptId}-${slotStateName}`;

          if (!__RL_ELEMENT_STATES.has(slotStateKey)) {
            const slotState = element._createTag<HTMLSlotElement>(
              RealmTagNames.SLOT
            );
            element._attr(RealmAttributeNames.SLOT, slotStateName, slotState);
            element._html(`${newValue}`, slotState);
            element._append(slotState);
            element._reqAnimFrame(() => {
              const shadowSlotState = element.$shadowEl<HTMLSlotElement>(
                RealmTagNames.SLOT,
                RealmAttributeNames.NAME,
                slotStateName
              );
              element._slotTo(shadowSlotState, [slotState]);
            });
            __RL_ELEMENT_STATES.set(slotStateKey, slotState);
          }

          element._html(
            `${newValue}`,
            element.$el(
              RealmTagNames.SLOT,
              RealmAttributeNames.SLOT,
              slotStateName
            )
          );
        });
      };

      acc.push(eventFn);
      if (isEventStateUpdate) acc.push(localState);
      return acc;
    }, []);
  },
};
(window as any).__RL_UTILS = __RL_UTILS;

const __RL_STRING_CONST = {
  registerScriptEventList: "__RL_UTILS.registerScriptEventList",
};

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
  if (!__RL_ELEMENT_REGISTRY.has(element)) {
    __RL_ELEMENT_MAP.set(element.id, element);
    __RL_ELEMENT_REGISTRY.set(element, new Map());
  }
  return __RL_ELEMENT_REGISTRY.get(element);
};

const scriptClosure = (
  script: HTMLScriptElement | Node,
  args: unknown[],
  fnArgs: string
) => `(([${args.join(",")}]) => {${script.textContent}})(${fnArgs})`.trim();

const createScriptURL = (content: string) => {
  const blob = new Blob([content], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  return url;
};

const replaceKeyword = (content: string, replacement: string) =>
  content.replaceAll(/\$\$do/g, replacement);

const dispatchEvent = <T>(
  element: RealmElement,
  eventName: RealmEventNames,
  args: T[]
) => {
  element._reqAnimFrame(() => {
    __RL_RUNTIME_LIST.get(element.id)?.[eventName]?.forEach((fn) => {
      fn.apply(this, args);
    });
  });
};

export const defineElement = registerElement(RealmTagNames.DEFINE_ELEMENT, {
  // Prepare the custome element before it is registered
  // This function is to get the attributes and scripts
  // and store them in a global variable
  onPrepare(customElement) {
    const customcustomElementName = customElement.$attr(
      RealmAttributeNames.NAME
    );

    // Attributes stuff
    // Get `element-attr` elements and store it into attributes definition list
    const attrs = getCustomElementAttrs(customElement);
    if (attrs) __RL_ATTRS_DEFINITION_LIST[customcustomElementName] = attrs;
    removeCustomElementAttrs(customElement);

    // Scripts stuff
    // Get `script` elements and store it into scripts definition list
    const scripts = getCustomElementScripts(customElement);
    if (scripts) __RL_SCRIPT_DEFINITION_LIST[customcustomElementName] = scripts;
    removeCustomElementScripts(customElement);
  },

  // This function is triggered when `define-element` is registered
  onRegistered() {
    __RL_ELEMENT_REGISTRY.forEach((props, element) => {
      const html = props.get(RealmElementPropKey.HTML);
      element._html(`${html}`);
      element._attach();
      element._render();

      element._slotTo(
        element.$shadowEl<HTMLSlotElement>(
          RealmTagNames.SLOT,
          RealmAttributeNames.CHILDREN
        ),
        element.$children()
      );

      (props.get(RealmElementPropKey.ATTRS) as Array<[string, string]>).forEach(
        ([name, value]) => {
          const slotName = `@${name}`;
          const slot = element._createTag<HTMLSlotElement>(RealmTagNames.SLOT);
          const shadowSlot = element.$shadowEl<HTMLSlotElement>(
            RealmTagNames.SLOT,
            RealmAttributeNames.NAME,
            slotName
          );
          element._attr(RealmAttributeNames.SLOT, slotName, slot);
          element._content(value, slot);
          element._append(slot);
          element._slotTo(shadowSlot, [slot]);
        }
      );
    });
  },

  onInit(customElement) {
    const customElementHtml = customElement.$html();
    const customElementName = customElement.$attr(RealmAttributeNames.NAME);

    const customElementRegister = registerElement(customElementName, {
      onPrepare(element) {
        const currentElement = getRegisteredElement(element);
        const elementId = element.id;

        currentElement.set(RealmElementPropKey.HTML, customElementHtml);

        // Set attributes from definition list
        // to the current `custom-element`
        currentElement.set(
          RealmElementPropKey.ATTRS,
          __RL_ATTRS_DEFINITION_LIST?.[customElementName].reduce(
            (acc, { name, value: defaultValue }) => {
              const value = element.$attr(name) || defaultValue;
              acc.push([name, value]);
              return acc;
            },
            []
          )
        );

        // Set scripts for runtime list to the current `custom-element`
        __RL_RUNTIME_LIST.set(
          elementId,
          Object.fromEntries(
            __RL_EVENT_LIST.map((eventName) => [eventName, new Map()])
          )
        );

        currentElement.set(
          RealmElementPropKey.SCRIPTS,
          __RL_SCRIPT_DEFINITION_LIST?.[customElementName].reduce(
            (acc, script) => {
              const clonedScript = script.cloneNode(true);

              const $script = customElement._createTag<HTMLScriptElement>(
                RealmTagNames.SCRIPT
              );

              const scriptId = element.$randId();
              $script.src = createScriptURL(
                scriptClosure(
                  clonedScript,
                  [...__RL_EVENT_LIST, "localState"],
                  `${__RL_STRING_CONST.registerScriptEventList}('${elementId}','${scriptId}')`
                )
              );

              customElement._attr(
                RealmAttributeNames.TYPE,
                RealmAttributeNames.MODULE,
                $script
              );

              customElement._data(
                RealmAttributeNames.DATA_SCRIPT_ID,
                scriptId,
                $script
              );

              element._append($script);
              acc.push($script);
              return acc;
            },
            []
          )
        );
      },

      onInit(element) {
        element._reqAnimFrame(() => {
          dispatchEvent(element, RealmEventNames.INIT, [element]);
        });
      },

      onMounted(element) {
        dispatchEvent(element, RealmEventNames.MOUNTED, [element]);
      },

      onUnmounted(element) {
        dispatchEvent(element, RealmEventNames.UNMOUNTED, []);
      },
    });

    // logger("define element init");
    customElement._attach();
    customElement._clear();
    customElementRegister();
  },

  // This function is to dispatch the mounted event
  onMounted(customElement) {
    customElement.remove();
  },

  // This function is to dispatch the unmounted event
  onUnmounted() {
    // nope.
  },
});
