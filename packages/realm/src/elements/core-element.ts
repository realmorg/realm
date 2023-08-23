import { RealmAttributeNames, RealmMutableAttr } from "../constants/attrs";
import { MixedDataType } from "../constants/data";
import {
  FlowEventNames,
  FlowRuntimeEventTypes,
  FlowRuntimeMutableEventTypesLookup,
} from "../constants/flow";
import { RealmTagNames } from "../constants/tags";
import { RealmElement } from "../libs/RealmElement.class";
import { RealmState } from "../libs/RealmState.class";
import {
  createActionTrigger,
  getAttrRegistry,
  getStateRegistry,
} from "../utils/action";
import { $el, $els, doc } from "../utils/dom";
import {
  ElementAttributeEntries,
  defineElement,
  parseValue,
  getElementAttrBindings,
  bindElement,
} from "../utils/element";
import { FlowAction } from "../utils/flow";
import {
  addSet,
  arrayPush,
  arrayReduce,
  createArray,
  createMap,
  createSet,
  entriesOf,
  forEach,
  forEachNode,
  getMap,
  getValueFrom,
  setMap,
} from "../utils/object";
import { getGlobalStateRegistry, getGlobalState } from "./global-state";

const HTML_REGISTRY = createMap<string, HTMLTemplateElement>();

const STYLE_REGISTRY = createMap<string, HTMLStyleElement>();

const ELEMENT_FLOW_REGISTRY = createMap<string, Set<RealmElement>>();

const SCRIPT_REGISTRY = createMap<string, Set<RealmElement>>();

const LINK_STYLE_REGISTRY = createMap<string, Set<RealmElement>>();

/**
 * Register custom element
 * @param elementName
 * @returns
 */
export const registerElement = (elementName: string) =>
  defineElement({
    name: elementName,

    onBeforeRegister() {
      const element = $el(doc)<RealmElement>(
        RealmTagNames.CUSTOM_ELEMENT,
        RealmAttributeNames.NAME,
        elementName
      );

      //#region register html definition
      const template = $el(element)<HTMLTemplateElement>(
        RealmTagNames.TEMPLATE
      );
      setMap(HTML_REGISTRY, elementName, template);
      //#endregion

      //#region register style definition
      if (template) {
        forEachNode(
          $els(template.content)<HTMLStyleElement>(RealmTagNames.STYLE),
          (style) => setMap(STYLE_REGISTRY, elementName, style)
        );
      }
      //#endregioin

      //#region register element to shadow
      forEach<[string, Map<string, Set<RealmElement>>]>(
        [
          [RealmTagNames.ELEMENT_FLOW, ELEMENT_FLOW_REGISTRY],
          [RealmTagNames.IMPORT_SCRIPT, SCRIPT_REGISTRY],
          [RealmTagNames.IMPORT_STYLE, LINK_STYLE_REGISTRY],
        ],
        ([tagName, registry]) => {
          setMap(
            registry,
            elementName,
            createSet(createArray($els(element)<RealmElement>(tagName)))
          );
        }
      );
      //#endregion
    },

    onBeforeInit(element) {
      //#region render styles and DOM to shadow DOM
      element._attach();
      element._renderStyle(getMap(STYLE_REGISTRY, elementName));
      element._renderTemplate(getMap(HTML_REGISTRY, elementName));
      forEach(
        [ELEMENT_FLOW_REGISTRY, SCRIPT_REGISTRY, LINK_STYLE_REGISTRY],
        (registry) =>
          forEach(getMap(registry, elementName), element._renderShadow)
      );
      //#endregion

      //#region slot element's children to shadow element
      const slotChildren = element.$shadowEl<HTMLSlotElement>(
        RealmTagNames.SLOT,
        [[RealmAttributeNames.CHILDREN]]
      );
      const slottedChildren = arrayReduce(
        element.$nodes(),
        (acc, childElement) => {
          const slotName = element.$attr<string>(
            RealmAttributeNames.SLOT,
            childElement
          );

          if (slotName) {
            element._slotTo(
              element.$shadowEl<HTMLSlotElement>(RealmTagNames.SLOT, [
                [RealmAttributeNames.NAME, slotName],
              ]),
              [childElement]
            );
            return acc;
          }
          return [...acc, childElement];
        },
        []
      );
      element._slotTo(slotChildren, slottedChildren);
      //#endregion

      //#region register and apply element that contains binding attributes
      const bindingElements = getElementAttrBindings(element);
      //#endregion

      //#region apply attributes, local & global states to element
      const attributesRegistry = getAttrRegistry(elementName);
      const statesRegistry = getStateRegistry(elementName);
      forEach(
        createArray<[Set<ElementAttributeEntries>, string, boolean]>([
          [createArray(attributesRegistry), RealmMutableAttr.ATTR],
          [createArray(statesRegistry), RealmMutableAttr.STATE],
          [getGlobalStateRegistry(), RealmMutableAttr.STATE, true],
        ]),
        ([registry, dataType, isGlobalState]) =>
          forEach(registry, ([mutateName, valueType, value]) => {
            const getParsedValue = () => parseValue(valueType, value);
            const getValueFromSource = () => getValueFrom(value, mutateName);
            const valueLookup: Record<string, () => MixedDataType> = {
              [RealmMutableAttr.ATTR]: () =>
                element.$attr<string>(mutateName) ?? getParsedValue(),
              [RealmMutableAttr.STATE]: getParsedValue,
              [RealmMutableAttr.SRC]: getValueFromSource,
              [RealmMutableAttr.META]: getValueFromSource,
            };

            if (dataType === RealmMutableAttr.ATTR)
              addSet(element.attrsRegistry, [mutateName, valueType, value]);

            if (!isGlobalState && dataType === RealmMutableAttr.STATE)
              addSet(element.statesRegistry, [mutateName, valueType, value]);

            bindElement(
              element,
              dataType,
              bindingElements,
              mutateName,
              valueLookup[dataType](),
              isGlobalState
            );
          })
      );

      // Update whenever element's attr, local & global state changes
      forEach(
        createArray<[RealmState, string, boolean]>([
          [element, RealmMutableAttr.ATTR],
          [element.states, RealmMutableAttr.STATE, false],
          [getGlobalState(), RealmMutableAttr.STATE, true],
        ]),
        ([mutator, mutateType, globalState]) =>
          mutator.subscribe((mutatorName, value: string, oldValue) => {
            const eventDetail = [mutatorName, value, oldValue];
            if (mutateType === RealmMutableAttr.STATE)
              arrayPush(eventDetail, globalState);
            element._sendEvent(
              FlowRuntimeMutableEventTypesLookup[mutateType],
              eventDetail
            );
            bindElement(
              element,
              mutateType,
              bindingElements,
              mutatorName,
              value,
              globalState,
              true
            );
          })
      );
      //#endregion

      //#region apply actions to element
      const actionTrigger = createActionTrigger(element);
      forEach(entriesOf(FlowEventNames), ([, flowName]) =>
        element._addCustomEvent<
          [
            eventType: string,
            eventName: string,
            actions: FlowAction[],
            event: Event
          ]
        >(flowName, ([eventType, eventName, actions, event]) =>
          actionTrigger(actions)(eventType, eventName, event)
        )
      );
      //#endregion
    },

    onMounted(element) {
      element._sendEvent(FlowRuntimeEventTypes.MOUNTED);
    },

    onUnmounted(element) {
      element._sendEvent(FlowRuntimeEventTypes.UNMOUNTED);
    },
  });
