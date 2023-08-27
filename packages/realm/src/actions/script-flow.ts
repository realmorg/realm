import { RealmAttributeNames } from "../constants/attrs";
import { EMPTY_STRING } from "../constants/chars";
import { FlowActionTypes } from "../constants/flow";
import { getGlobalState } from "../elements/global-state";
import { RealmElement } from "../libs/RealmElement.class";
import { defineAction, findAttr } from "../utils/action";
import { getDefaultAttrValues } from "../utils/element";
import { getScriptFlow } from "../utils/flow";
import { reqAnim } from "../utils/timer";

const getScriptArgs = (element: RealmElement, $event: Event) => {
  event = undefined;
  const attrs = {
    ...getDefaultAttrValues(element),
    ...element.$attrsKv(),
  };

  const getShadowArgs = (refName: string) => [
    EMPTY_STRING,
    [[RealmAttributeNames.REF, refName]],
  ];

  return [
    {
      $: element,
      attr: {
        get: (name: string) => element.$attr(name) ?? attrs?.[name],
        set: element._attr,
      },
      refs: (refName: string) =>
        element.$shadowEls.apply(null, getShadowArgs(refName)),
      ref: (refName: string) =>
        element.$shadowEl.apply(null, getShadowArgs(refName)),
      attrs: element.$attrsKv(),
      localState: element.states,
      globalState: getGlobalState(),
      event: $event,
    },
  ];
};

/**
 * Trigger <script type="module/realm" /> action
 * @param element
 * @param actionArgs
 * @returns
 */
export const scriptAction = defineAction({
  name: FlowActionTypes.SCRIPT,

  requiredAttrs: [RealmAttributeNames.SCRIPT_ID],

  onTrigger(
    element: RealmElement,
    elementName: string,
    actionArgs: Array<string[]>,
    event: Event
  ) {
    const [scriptIdAttr] = findAttr<string>(
      actionArgs,
      RealmAttributeNames.SCRIPT_ID
    );

    const waitForScriptLoaded = () =>
      reqAnim(() => {
        const scriptFlow = getScriptFlow(elementName, scriptIdAttr);
        const isScriptLoaded = !!scriptFlow;
        if (!isScriptLoaded) return waitForScriptLoaded();
        scriptFlow?.apply(element, getScriptArgs(element, event));
      });
    waitForScriptLoaded();
  },
});
