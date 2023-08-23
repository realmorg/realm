import { httpRequestAction } from "../actions/http-request";
import { scriptAction } from "../actions/script-flow";
import { sendEventAction } from "../actions/send-event";
import { setAttrAction, setStateAction } from "../actions/set-action";
import { setTimerAction } from "../actions/set-timer";
import { triggerElementAction } from "../actions/trigger-element";
import { RealmAttributeNames } from "../constants/attrs";
import { RealmTagNames } from "../constants/tags";
import { listenEventFlow } from "../flows/listen-event";
import { triggerEventFlow } from "../flows/trigger-event";
import { RealmElement } from "../libs/RealmElement.class";
import { defineElement } from "../utils/element";

export const eventFlowList = [listenEventFlow, triggerEventFlow];
const actionList = [
  httpRequestAction,
  scriptAction,
  sendEventAction,
  setAttrAction,
  setStateAction,
  setTimerAction,
  triggerElementAction,
];

export const elementFlow = defineElement({
  name: RealmTagNames.ELEMENT_FLOW,

  async onBeforeInit(element) {
    const parentElement = element.$parent<RealmElement>();
    if (!parentElement) return;

    const eventFlowOwnerName = element.$attr<string>(
      RealmAttributeNames.NAME,
      parentElement
    );

    for (const registerAction of actionList) await registerAction();
    for (const [registerEventFlow] of eventFlowList)
      await registerEventFlow(eventFlowOwnerName, element);
  },

  async onMounted(element) {
    const parentNode = element.$parentNode();
    const isValidParentNode = parentNode instanceof ShadowRoot;
    if (!isValidParentNode) return;

    const hostElement = element.$host<RealmElement>();
    for (const [, applyEventFlow] of eventFlowList)
      await applyEventFlow(hostElement);
    element._remove();
  },
});
