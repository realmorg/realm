import { RealmAttributeNames, RealmMutableAttr } from "../constants/attrs";
import { META_PREFIX } from "../constants/chars";
import { MixedDataType } from "../constants/data";
import { RealmTagNames } from "../constants/tags";
import { RealmElement } from "../libs/RealmElement.class";
import { RealmState } from "../libs/RealmState.class";
import { getAttrType } from "../utils/action";
import {
  ElementAttributeEntries,
  bindElement,
  defineElement,
  getElementAttrBindings,
} from "../utils/element";
import { createArray, forEach, isArray, toDotNotation } from "../utils/object";
import { strSlice } from "../utils/string";
import { eventFlowList } from "./element-flow";
import { getGlobalState } from "./global-state";

export const repeatListElement = defineElement({
  name: RealmTagNames.REPEAT_LIST,

  onBeforeInit(element) {
    const fragment = element._createFragment();
    forEach(element.$nodes(), (node) => {
      element._append(element.$clone(node), fragment);
      element._remove(node);
    });

    element._attach();
    element._clear();

    const hostElement = element.$host<RealmElement>();
    if (!hostElement) return;

    const ofAttr = element.$attr<string>(RealmAttributeNames.OF);
    const dataSource = strSlice(ofAttr);
    if (!dataSource) return;

    const hostElementStates = hostElement?.states;
    const hostElementStatesRegistry = hostElement.statesRegistry;
    const hostElementAttrsRegistry = hostElement.attrsRegistry;

    const removeElementFlow = async () => {
      for (const [, , removeEventFlow] of eventFlowList)
        await removeEventFlow(hostElement, element);
    };

    const updateElementFlow = async () => {
      for (const [, applyEventFlow] of eventFlowList)
        await applyEventFlow(hostElement, element);
    };

    const updateIterableContent = (entries: Array<MixedDataType>) => {
      const elementShadow = element.$shadow();
      element._clear();
      element._clear(elementShadow);

      forEach(entries, (value, index) => {
        element._append(
          element.$clone<DocumentFragment>(fragment),
          elementShadow
        );

        const elementAttrBindings = getElementAttrBindings(element);
        forEach(toDotNotation(value), (mutateName) => {
          bindElement(
            element,
            RealmMutableAttr.SRC,
            elementAttrBindings,
            mutateName,
            value,
            undefined,
            false
          );
        });

        const meta = { index, length: entries.length };
        forEach(toDotNotation(meta, META_PREFIX), (name) =>
          bindElement(
            element,
            RealmMutableAttr.META,
            elementAttrBindings,
            name,
            meta,
            undefined,
            false
          )
        );
      });

      const elementAttrBindings = getElementAttrBindings(element);
      forEach(
        createArray<[Set<ElementAttributeEntries>, string]>([
          [hostElementStatesRegistry, RealmMutableAttr.STATE],
          [hostElementAttrsRegistry, RealmMutableAttr.ATTR],
        ]),
        ([registry, dataType]) =>
          forEach(registry, ([mutateName]) => {
            const valueLookup: Record<string, () => unknown> = {
              [RealmMutableAttr.ATTR]: () => hostElement.$attr(mutateName),
              [RealmMutableAttr.STATE]: () =>
                hostElementStates.get<MixedDataType>(mutateName),
            };
            const valueType = getAttrType(mutateName, registry);
            bindElement(
              element,
              dataType,
              elementAttrBindings,
              mutateName,
              valueLookup[dataType](),
              valueType,
              false
            );
          })
      );
    };

    // Whenever attributes, local & global state changes, reupdate binding elements
    forEach(
      createArray<[RealmState, string, boolean]>([
        [hostElement, RealmMutableAttr.ATTR],
        [hostElementStates, RealmMutableAttr.STATE],
        [getGlobalState(), RealmMutableAttr.STATE, true],
      ]),
      ([mutator, mutateType, isGlobalState]) => {
        mutator.subscribe(
          async (mutatorName, value: MixedDataType | Array<MixedDataType>) => {
            const isValidIterableSource =
              isArray(value) && mutatorName === dataSource;

            if (!isValidIterableSource)
              return bindElement(
                element,
                mutateType,
                getElementAttrBindings(element),
                mutatorName,
                value,
                undefined,
                isGlobalState,
                true
              );

            await removeElementFlow();
            updateIterableContent(value as Array<MixedDataType>);
            await updateElementFlow();
          }
        );
      }
    );
    //#endregion
  },
});
