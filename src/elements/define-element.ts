import { RealmTagNames } from "../constants/tags";
import { RealmAttributeNames } from "../constants/attrs";
import { RealmElementPropKey } from "../constants/props";
import { RealmEventAliases, RealmEventNames } from "../constants/events";
import { RealmElement } from "../libs/RealmElement.class";
import { RealmStates, StateObserver } from "../libs/RealmStates.class";
import {
  ElementAttribute,
  ElementRuntimeEventArgs,
  getCustomElementAttrs,
  getCustomElementScripts,
  parseAttrValue,
  registerElement,
  removeCustomElementAttrs,
  removeCustomElementScripts,
} from "../utils/element";
import { createScriptURL, scriptClosure } from "../utils/script";
import { replaceKeywords } from "../utils/string";

type ElementRuntimeEvents = {
  [RealmEventNames.ON]?: Map<
    // Element's ID
    string,
    Map<string, Set<(args: ElementRuntimeEventArgs) => void>>
  >;
  [RealmEventNames.INIT]?: Map<string, (args: ElementRuntimeEventArgs) => void>;
  [RealmEventNames.MOUNTED]?: Map<
    string,
    (args: ElementRuntimeEventArgs) => void
  >;
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

const geCustomElementtAttributes = (element: RealmElement) => {
  const registeredElement = __RL_ATTRS_DEFINITION_LIST[element.name];
  const attrs = Object.fromEntries(
    Array.from(element.attributes).map((attr) => {
      const type = registeredElement.find(
        (item) => item.name === attr.name
      )?.type;
      return [attr.name, type ? parseAttrValue(type, attr.value) : attr.value];
    })
  );

  return new Proxy(attrs, {
    set: (target, key, value) => {
      const attr = registeredElement.find((item) => item.name === key);
      if (!attr) return false;

      element.setAttribute(key as string, value as string);
      return Reflect.set(target, key, value);
    },
    get: (...args) => Reflect.get(...args),
  });
};

const getRegisteredElement = (element: RealmElement) => {
  if (!__RL_ELEMENT_REGISTRY.has(element)) {
    __RL_ELEMENT_MAP.set(element.id, element);
    __RL_ELEMENT_REGISTRY.set(element, new Map());
  }
  return __RL_ELEMENT_REGISTRY.get(element);
};

const replaceEventsKeyword = (content: string, elementId: string) =>
  replaceKeywords(content, {
    [RealmEventAliases.TRIGGER]: `${__RL_STRING_CONST.trigger}(['${elementId}',this,event])`,
  });

const getDispatchEventScriptArgs = ([
  customElement,
  attrs,
  element = null,
  isArray = true,
]: [RealmElement, Record<string, unknown>, HTMLElement?, boolean?]) => {
  const obj = { $: customElement, $$: element, attrs };
  return isArray ? [obj] : obj;
};

const dispatchEvent = (
  element: RealmElement,
  eventName: RealmEventNames,
  args: unknown[] = []
) => {
  const attrs = geCustomElementtAttributes(element);
  const callbackArgs = getDispatchEventScriptArgs([element, attrs]);
  element._reqAnimFrame(() => {
    __RL_RUNTIME_LIST.get(element.id)?.[eventName]?.forEach((callback) => {
      callback.apply(this, [...args, ...(callbackArgs as unknown[])]);
    });
  });
};

const __RL_STRING_CONST = {
  runtime: "__RL_UTILS.runtime",
  trigger: "__RL_UTILS.trigger",
};

const __RL_UTILS = {
  // Runtime closure
  runtime: (elementId: string, scriptId: string) => {
    const element = __RL_ELEMENT_MAP.get(elementId);
    const attrs = geCustomElementtAttributes(element);

    const runtimeEvents = __RL_RUNTIME_LIST.get(elementId);
    const localState = new RealmStates();

    return __RL_EVENT_LIST.reduce((acc, eventName) => {
      const isCustomEvent = eventName === RealmEventNames.ON;
      const isEventStateUpdate = eventName === RealmEventNames.STATES_UPDATE;
      const currentEvent = runtimeEvents?.[eventName];

      if (!(isCustomEvent || isEventStateUpdate)) {
        return [
          ...acc,
          (fn) => {
            runtimeEvents?.[eventName]?.set(scriptId, fn);
          },
        ];
      }

      if (isCustomEvent) {
        const onCustomEvent =
          () =>
          (
            customEventName: string,
            callback: (args: ElementRuntimeEventArgs) => void
          ) => {
            const currentCustomEvent =
              (currentEvent as ElementRuntimeEvents[RealmEventNames.ON])?.get(
                scriptId
              ) ?? new Map();
            const triggerEvents =
              currentCustomEvent?.get(customEventName) ?? new Set();
            triggerEvents.add(callback);
            currentCustomEvent.set(customEventName, triggerEvents);
            runtimeEvents?.[eventName]?.set(scriptId, currentCustomEvent);
          };

        acc.push(onCustomEvent());
        return acc;
      }

      if (isEventStateUpdate) {
        const callbackArgs = getDispatchEventScriptArgs([element, attrs]);
        const onStateUpdateEvent = (callback) => {
          currentEvent?.set(scriptId, callback);
          localState.subscribe((newValue, oldValue, stateName) => {
            callback?.apply?.(null, [
              newValue,
              oldValue,
              stateName,
              ...(callbackArgs as unknown[]),
            ]);
            if (!newValue) return;

            const htmlValue = `${newValue}`;
            const slotStateName = element.$slotStateName(stateName);
            const slotStateKey = `${scriptId}-${slotStateName}`;
            const isStateDefined = __RL_ELEMENT_STATES.has(slotStateKey);

            if (!isStateDefined) {
              const slotState = element._createTag<HTMLSlotElement>(
                RealmTagNames.SLOT
              );
              element._attr(RealmAttributeNames.SLOT, slotStateName, slotState);
              element._html(htmlValue, slotState);
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
              htmlValue,
              element.$el(
                RealmTagNames.SLOT,
                RealmAttributeNames.SLOT,
                slotStateName
              )
            );
          });
        };

        acc.push(onStateUpdateEvent);
        acc.push(localState);
        return acc;
      }
    }, []);
  },

  // Event trigger
  trigger: ([elementId, element, event]: [string, HTMLElement, Event]) => {
    const runtimeEvents = __RL_RUNTIME_LIST.get(elementId);
    const hostElement = __RL_ELEMENT_MAP.get(elementId);
    const eventTriggers = runtimeEvents?.[RealmEventNames.ON];
    const attrs = geCustomElementtAttributes(hostElement);
    const args = getDispatchEventScriptArgs([
      hostElement,
      attrs,
      element,
      false,
    ]);
    return (customEventName: string) => {
      eventTriggers.forEach((eventTrigger) => {
        eventTrigger.get(customEventName)?.forEach((callback) => {
          callback?.apply?.(null, [{ event, ...args }]);
        });
      });
    };
  },
};
(window as any).__RL_UTILS = __RL_UTILS;

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
      const html = replaceEventsKeyword(
        props.get(RealmElementPropKey.HTML) as string,
        element.id
      );
      element._html(html);
      element._attach();
      element._render();

      // Append all children to the shadow root
      element._slotTo(
        element.$shadowEl<HTMLSlotElement>(
          RealmTagNames.SLOT,
          RealmAttributeNames.CHILDREN
        ),
        element.$children()
      );

      // Apply rendered element with default attribues
      // Assign all slotted attributes
      (props.get(RealmElementPropKey.ATTRS) as Array<[string, string]>).forEach(
        ([name, value]) => {
          const slotName = element.$slotAttrName(name);
          const slot = element._createTag<HTMLSlotElement>(RealmTagNames.SLOT);
          const shadowSlot = element.$shadowEl<HTMLSlotElement>(
            RealmTagNames.SLOT,
            RealmAttributeNames.NAME,
            slotName
          );
          element._attr(name, value);
          element._attr(RealmAttributeNames.SLOT, slotName, slot);
          element._html(value, slot);
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
            (acc, { name, value: defaultValue }) => [
              ...acc,
              [name, element.$attr(name) || defaultValue],
            ],
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

              const scriptUrl = createScriptURL(
                replaceEventsKeyword(
                  scriptClosure(
                    clonedScript,
                    [...__RL_EVENT_LIST, "localState"],
                    `${__RL_STRING_CONST.runtime}('${elementId}','${scriptId}')`
                  ),
                  elementId
                )
              );

              customElement._attrs(
                [
                  [RealmAttributeNames.SRC, scriptUrl],
                  [RealmAttributeNames.TYPE, RealmAttributeNames.MODULE],
                ],
                $script
              );

              customElement._data(
                RealmAttributeNames.DATA_SCRIPT_ID,
                scriptId,
                $script
              );

              element._append($script);
              return [...acc, $script];
            },
            []
          )
        );
      },

      onAttributeChanged(element, attrName, oldValue, newValue) {
        const slot = element.$el<HTMLSlotElement>(
          RealmTagNames.SLOT,
          RealmAttributeNames.SLOT,
          element.$slotAttrName(attrName)
        );
        if (element) element._html(newValue, slot);
        element._reqAnimFrame(() => {
          dispatchEvent(element, RealmEventNames.ATTR_UPDATE, [
            newValue,
            oldValue,
            attrName,
          ]);
        });
      },

      onInit(element) {
        element._reqAnimFrame(() => {
          dispatchEvent(element, RealmEventNames.INIT);
        });
      },

      onMounted(element) {
        dispatchEvent(element, RealmEventNames.MOUNTED);
      },

      onUnmounted(element) {
        dispatchEvent(element, RealmEventNames.UNMOUNTED);
      },
    });

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
