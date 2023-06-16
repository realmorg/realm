import { RealmTagNames } from "../constants/tags";
import { RealmAttributeNames } from "../constants/attrs";
import { RealmElementPropKey } from "../constants/props";
import {
  RealmEventAliases,
  RealmEventTypes,
  RealmRuntimeEventTypes,
} from "../constants/events";
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
import { camel, dash, replaceKeywords } from "../utils/string";
import { RealmUtils } from "../constants/static";
import {
  ObjectFromEntries,
  createArray,
  createMap,
  createSet,
} from "../utils/object";

type ElementRuntimeEvents = {
  [RealmRuntimeEventTypes.ON]?: Map<
    // Element's ID
    string,
    Map<string, Set<(args: ElementRuntimeEventArgs) => void>>
  >;
  [RealmRuntimeEventTypes.INIT]?: Map<
    string,
    (args: ElementRuntimeEventArgs) => void
  >;
  [RealmRuntimeEventTypes.MOUNTED]?: Map<
    string,
    (args: ElementRuntimeEventArgs) => void
  >;
  [RealmRuntimeEventTypes.UNMOUNTED]?: Map<string, () => void>;
  [RealmRuntimeEventTypes.ATTR_UPDATE]?: Map<
    string,
    (attrName: string, attrValue: string) => void
  >;
  [RealmRuntimeEventTypes.STATES_UPDATE]?: Map<string, StateObserver>;
};

const __RL_ATTRS_DEFINITION_LIST: Record<string, ElementAttribute[]> = {};

const __RL_SCRIPT_DEFINITION_LIST: Record<string, Node[]> = {};

const __RL_RUNTIME_LIST = createMap<string, ElementRuntimeEvents>();

const __RL_SCRIPT_CONTENT_LIST = createMap<
  string,
  (args: { elementId: string }) => void
>();

const __RL_ELEMENT_STATES = createMap<string, HTMLSlotElement>();

const __RL_ELEMENT_REGISTRY = createMap<
  RealmElement,
  Map<RealmElementPropKey, unknown>
>();

const __RL_ELEMENT_ATTRS_BIND_ATTRS = createMap<Element, Map<string, string>>();

const __RL_ELEMENT_ATTRS_BIND_LOCAL_STATES = createMap<
  Element,
  Map<string, string>
>();

const __RL_ELEMENT_MAP = createMap<string, RealmElement>();

const __RL_SCRIPT_RUNTIME_MAP = createMap<string, Set<string>>();

const __RL_EVENT_LIST = [
  RealmRuntimeEventTypes.ON,
  RealmRuntimeEventTypes.INIT,
  RealmRuntimeEventTypes.MOUNTED,
  RealmRuntimeEventTypes.UNMOUNTED,
  RealmRuntimeEventTypes.ATTR_UPDATE,
  RealmRuntimeEventTypes.STATES_UPDATE,
];

const geCustomElementtAttributes = (element: RealmElement) => {
  const registeredElement = __RL_ATTRS_DEFINITION_LIST[element.name];
  const attrs = ObjectFromEntries(
    createArray<Attr>(element.attributes).map((attr) => {
      const type = registeredElement.find(
        (item) => item.name === attr.name
      )?.type;
      return [
        camel(attr.name),
        type ? parseAttrValue(type, attr.value) : attr.value,
      ];
    })
  );

  return new Proxy(attrs, {
    set: (target, key, value) => {
      const dashedKey = dash(key as string);
      const attr = registeredElement.find((item) => item.name === dashedKey);
      if (!attr) return false;

      element.setAttribute(dashedKey, value as string);
      return Reflect.set(target, key, value);
    },
    get: (...args) => Reflect.get(...args),
  });
};

const getRegisteredElement = (element: RealmElement) => {
  if (!__RL_ELEMENT_REGISTRY.has(element)) {
    __RL_ELEMENT_MAP.set(element.id, element);
    __RL_ELEMENT_REGISTRY.set(element, createMap());
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
  eventName: string,
  args: unknown[] = []
) => {
  const attrs = geCustomElementtAttributes(element);
  const callbackArgs = getDispatchEventScriptArgs([element, attrs]);
  element._reqAnimFrame(() =>
    __RL_RUNTIME_LIST.get(element.id)?.[eventName]?.forEach((callback) => {
      callback.apply(this, [...args, ...(callbackArgs as unknown[])]);
    })
  );
};

const getBindedElementAttributes = (element: Element, symbol: string) =>
  createArray<Attr>(element.attributes)
    .filter(
      (attr) => attr.name.charAt(0) === ":" && attr.value.charAt(0) === symbol
    )
    .reduce(
      (acc, attr) => [
        ...acc,
        [attr.value, attr.name.substring(symbol.length, attr.name.length)],
      ],
      []
    );

const updateElementBindings = (
  map: Map<Element, Map<string, string>>,
  element: RealmElement,
  attrName: string,
  value: string
) =>
  map.forEach((attrs, bindElement) => {
    const attrBind = attrs.get(attrName);
    if (attrBind) {
      element._reqAnimFrame(() => element._attr(attrBind, value, bindElement));
    }
  });

const __RL_STRING_CONST = {
  runtime: `__RL_UTILS.${RealmUtils.RUNTIME}`,
  trigger: `__RL_UTILS.${RealmUtils.TRIGGER}`,
};

const __RL_UTILS = {
  // Runtime closure
  [RealmUtils.RUNTIME]: (elementId: string, runtimeId: string) => {
    const element = __RL_ELEMENT_MAP.get(elementId);
    const attrs = geCustomElementtAttributes(element);

    const runtimeEvents = __RL_RUNTIME_LIST.get(elementId);
    const localState = element.states;

    const events = __RL_EVENT_LIST.reduce((acc, eventName) => {
      const isCustomEvent = eventName === RealmRuntimeEventTypes.ON;
      const isEventInit = eventName === RealmRuntimeEventTypes.INIT;
      const isEventStateUpdate =
        eventName === RealmRuntimeEventTypes.STATES_UPDATE;
      const exceptionEvents =
        isCustomEvent || isEventInit || isEventStateUpdate;
      const currentEvent = runtimeEvents?.[eventName];

      if (!exceptionEvents) {
        acc[eventName] = (callback) =>
          runtimeEvents?.[eventName]?.set(runtimeId, callback);
      }

      if (isCustomEvent) {
        acc[eventName] = (
          () =>
          (
            customEventName: string,
            callback: (args: ElementRuntimeEventArgs) => void
          ) => {
            const currentCustomEvent =
              (
                currentEvent as ElementRuntimeEvents[RealmRuntimeEventTypes.ON]
              )?.get(runtimeId) ?? new Map();
            const triggerEvents =
              currentCustomEvent?.get(customEventName) ?? new Set();
            triggerEvents.add(callback);
            currentCustomEvent.set(customEventName, triggerEvents);
            runtimeEvents?.[eventName]?.set(runtimeId, currentCustomEvent);
          }
        )();
      }

      if (isEventStateUpdate || isEventInit) {
        const callbackArgs = getDispatchEventScriptArgs([element, attrs]);
        const onStateUpdateEvent = (callback) => {
          currentEvent?.set(runtimeId, callback);
          localState.subscribe((newValue, oldValue, stateName) => {
            if (!isEventInit)
              callback?.apply?.(null, [
                newValue,
                oldValue,
                stateName,
                ...(callbackArgs as unknown[]),
              ]);
            if (!newValue) return;

            const htmlValue = `${newValue}`;
            const slotStateName = element.$slotStateName(stateName);
            const slotStateKey = `${runtimeId}-${slotStateName}`;
            const isStateDefined = __RL_ELEMENT_STATES.has(slotStateKey);

            if (!isStateDefined) {
              const slotState = element._createTag<HTMLSlotElement>(
                RealmTagNames.SLOT
              );
              element._attr(RealmAttributeNames.SLOT, slotStateName, slotState);
              element._html(htmlValue, slotState);
              element._append(slotState);
              element._reqAnimFrame(() =>
                element._slotTo(
                  element.$shadowEl<HTMLSlotElement>(
                    RealmTagNames.SLOT,
                    RealmAttributeNames.NAME,
                    slotStateName
                  ),
                  [slotState]
                )
              );
              __RL_ELEMENT_STATES.set(slotStateKey, slotState);
            }

            updateElementBindings(
              __RL_ELEMENT_ATTRS_BIND_LOCAL_STATES,
              element,
              slotStateName,
              newValue as string
            );

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

        acc[eventName] = onStateUpdateEvent;
      }

      return acc;
    }, {});

    events["localState"] = localState;
    events["$trigger"] = (...args) => {
      console.log(args);
      // const runtimeEvents = __RL_RUNTIME_LIST.get(elementId);
      // const hostElement = __RL_ELEMENT_MAP.get(elementId);
      // const eventTriggers = runtimeEvents?.[RealmRuntimeEventTypes.ON];
      // const attrs = geCustomElementtAttributes(hostElement);
      // const args = getDispatchEventScriptArgs([
      //   hostElement,
      //   attrs,
      //   element,
      //   false,
      // ]);
      // return ;
    };

    return events;
  },

  // Event trigger
  [RealmUtils.TRIGGER]: ([elementId, element, event]: [
    string,
    HTMLElement,
    Event
  ]) => {
    const runtimeEvents = __RL_RUNTIME_LIST.get(elementId);
    const hostElement = __RL_ELEMENT_MAP.get(elementId);
    const eventTriggers = runtimeEvents?.[RealmRuntimeEventTypes.ON];
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
(window as any).__RL_SCRIPT_CONTENT_LIST = __RL_SCRIPT_CONTENT_LIST;

const documentHead = document.head;

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

    const customElementName = customElement.$attr(RealmAttributeNames.NAME);
    const runtimeScripts = __RL_SCRIPT_DEFINITION_LIST?.[
      customElementName
    ]?.reduce((acc, script) => {
      if (!script.textContent) return;

      const scriptId = customElement.$randId();
      const runtimeScriptMap =
        __RL_SCRIPT_RUNTIME_MAP.get(customElementName) ?? createSet();
      runtimeScriptMap.add(scriptId);

      __RL_SCRIPT_RUNTIME_MAP.set(customElementName, runtimeScriptMap);

      acc += `__RL_SCRIPT_CONTENT_LIST.set('${scriptId}', ({ $trigger, localState, on, onInit, onMounted, onLocalStatesUpdate, onAttrsUpdate, onUnmounted, }) => {${script.textContent}});`;
      return acc;
    }, "");

    if (runtimeScripts.length) {
      const runtimeScriptElement = customElement._createTag<HTMLScriptElement>(
        RealmTagNames.SCRIPT
      );
      const runtimeId = customElement.$randId();
      customElement._content(runtimeScripts, runtimeScriptElement);
      customElement._data(
        RealmAttributeNames.DATA_RUNTIME_ID,
        runtimeId,
        runtimeScriptElement
      );
      customElement._attrs(
        [
          [RealmAttributeNames.ASYNC, true],
          [RealmAttributeNames.TYPE, RealmAttributeNames.MODULE],
        ],
        runtimeScriptElement
      );
      documentHead.append(runtimeScriptElement);
      new MutationObserver((mutations) => {
        const isAdded = mutations.reduce((acc, mutation) => {
          mutation.addedNodes.forEach((node) => {
            acc.push(
              customElement.$data(
                RealmAttributeNames.DATA_RUNTIME_ID,
                node as Element
              )
            );
          });
          return acc;
        }, []).length;

        if (!isAdded) return;
        customElement._event(RealmEventTypes.SCRIPT_ADDED);
      }).observe(documentHead, { childList: true });
    }
  },

  // This function is triggered when `define-element` is registered
  onRegistered() {
    __RL_ELEMENT_REGISTRY.forEach((props, element) => {
      const registeredHtml = replaceEventsKeyword(
        props.get(RealmElementPropKey.HTML) as string,
        element.id
      );

      //#region Render the element
      element._html(registeredHtml);
      element._attach();
      element._render();
      //#endregion

      //#region Append all children to the shadow root
      element._slotTo(
        element.$shadowEl<HTMLSlotElement>(
          RealmTagNames.SLOT,
          RealmAttributeNames.CHILDREN
        ),
        element.$children()
      );
      //#endregion

      //#region Get bind atttributes
      element.$shadowEls("*").forEach((element) => {
        const fromAttrs = getBindedElementAttributes(element, "@");
        if (fromAttrs.length) {
          const attrBinds =
            __RL_ELEMENT_ATTRS_BIND_ATTRS.get(element) ?? createMap();
          fromAttrs.forEach(([name, value]) => attrBinds.set(name, value));
          __RL_ELEMENT_ATTRS_BIND_ATTRS.set(element, attrBinds);
        }

        const fromLocalStates = getBindedElementAttributes(element, "#");
        if (fromLocalStates.length) {
          const localStatesBinds =
            __RL_ELEMENT_ATTRS_BIND_LOCAL_STATES.get(element) ?? createMap();
          fromLocalStates.forEach(([name, value]) =>
            localStatesBinds.set(name, value)
          );
          __RL_ELEMENT_ATTRS_BIND_LOCAL_STATES.set(element, localStatesBinds);
        }
      });
      //#endregion

      const registeredAttrs = props.get(RealmElementPropKey.ATTRS) as Array<
        [string, string]
      >;

      // Render attributes
      registeredAttrs.forEach(([name, value]) => {
        const slotName = element.$slotAttrName(name);
        const shadowSlot = element.$shadowEl<HTMLSlotElement>(
          RealmTagNames.SLOT,
          RealmAttributeNames.NAME,
          slotName
        );

        //#region assign slot element
        const slot = element._createTag<HTMLSlotElement>(RealmTagNames.SLOT);
        element._attr(name, value);
        element._attr(RealmAttributeNames.SLOT, slotName, slot);
        element._html(value, slot);
        element._append(slot);
        element._slotTo(shadowSlot, [slot]);
        //#endregion

        //#region apply binded attributes
        updateElementBindings(
          __RL_ELEMENT_ATTRS_BIND_ATTRS,
          element,
          slotName,
          value
        );
        //#endregion
      });
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
          ObjectFromEntries(
            __RL_EVENT_LIST.map((eventName) => [eventName, createMap()])
          )
        );

        const iterateRuntime = (scriptId: string) =>
          element._reqAnimFrame(() => {
            if (!__RL_SCRIPT_CONTENT_LIST.has(scriptId))
              return iterateRuntime(scriptId);

            const runtimeId = element.$randId();
            customElement._event(RealmEventTypes.RUNTIME_READY, {
              element,
              elementId,
              runtimeId,
              scriptId,
            });
          });

        const callRuntime = () =>
          element._reqAnimFrame(() => {
            if (__RL_SCRIPT_RUNTIME_MAP.has(customElementName))
              return __RL_SCRIPT_RUNTIME_MAP
                .get(customElementName)
                .forEach(iterateRuntime);
            callRuntime();
          });

        callRuntime();

        // currentElement.set(
        //   RealmElementPropKey.SCRIPTS,
        //   __RL_SCRIPT_DEFINITION_LIST?.[customElementName].reduce(
        //     (acc, script) => {
        //       const clonedScript = script.cloneNode(true);

        //       const $script = customElement._createTag<HTMLScriptElement>(
        //         RealmTagNames.SCRIPT
        //       );

        //       const scriptId = element.$randId();

        //       const scriptContent = replaceEventsKeyword(
        //         scriptClosure(
        //           elementId,
        //           scriptId,
        //           [...__RL_EVENT_LIST, "localState"],
        //           `${__RL_STRING_CONST.runtime}('${elementId}','${scriptId}')`
        //         ),
        //         elementId
        //       );

        //       const runtimeScript =
        //         __RL_SCRIPT_CONTENT_LIST?.get(customElementName) ?? createMap();
        //       runtimeScript.set(scriptId, clonedScript.textContent);
        //       __RL_SCRIPT_CONTENT_LIST.set(customElementName, runtimeScript);

        //       const scriptUrl = createScriptURL(scriptContent);

        //       // customElement._html(scriptContent, $script);

        //       customElement._attrs(
        //         [
        //           [RealmAttributeNames.ASYNC, true],
        //           [RealmAttributeNames.SRC, scriptUrl],
        //           [RealmAttributeNames.TYPE, RealmAttributeNames.MODULE],
        //         ],
        //         $script
        //       );

        //       customElement._data(
        //         RealmAttributeNames.DATA_SCRIPT_ID,
        //         scriptId,
        //         $script
        //       );

        //       element._append($script);
        //       return [...acc, $script];
        //     },
        //     []
        //   )
        // );
      },

      onAttributeChanged(element, attrName, oldValue, newValue) {
        const slotAttrName = element.$slotAttrName(attrName);

        const slot = element.$el<HTMLSlotElement>(
          RealmTagNames.SLOT,
          RealmAttributeNames.SLOT,
          slotAttrName
        );
        if (element) element._html(newValue, slot);

        updateElementBindings(
          __RL_ELEMENT_ATTRS_BIND_ATTRS,
          element,
          slotAttrName,
          newValue
        );

        element._reqAnimFrame(() =>
          dispatchEvent(element, RealmRuntimeEventTypes.ATTR_UPDATE, [
            newValue,
            oldValue,
            attrName,
          ])
        );
      },

      onInit(element) {
        // customElement.addEventListener(
        //   "readiness",
        //   () => {
        //     dispatchEvent(element, RealmRuntimeEventTypes.INIT);
        //   },
        //   false
        // );
        // customElement._reqAnimFrame(() =>
        //   dispatchEvent(element, RealmRuntimeEventTypes.INIT)
        // );
      },

      onMounted(element) {
        dispatchEvent(element, RealmRuntimeEventTypes.MOUNTED);
      },

      onUnmounted(element) {
        dispatchEvent(element, RealmRuntimeEventTypes.UNMOUNTED);
      },
    });

    customElementRegister();

    customElement.$event(
      RealmEventTypes.RUNTIME_READY,
      ({ element, elementId, scriptId, runtimeId }) => {
        dispatchEvent(element, RealmRuntimeEventTypes.INIT);
        __RL_SCRIPT_CONTENT_LIST
          .get(scriptId)
          .call(element, __RL_UTILS[RealmUtils.RUNTIME](elementId, scriptId));
      }
    );

    customElement.$event(RealmEventTypes.SCRIPT_ADDED, () => {
      customElement._attach();
      customElement._clear();
    });
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
