import { RealmAttributeNames } from "../constants/attrs";
import { RealmScriptTypes } from "../constants/scripts";
import { RealmTagNames } from "../constants/tags";
import { _append, _attrs, _createElement, _remove, head } from "./dom";
import { arrayJoin } from "./object";

const createScriptBlob = (script: string) =>
  new Blob([script], { type: RealmScriptTypes.JS });

const createScriptURL = (
  elementName: string,
  scriptId: string,
  script: string,
  params: string[]
) => {
  const fnParams = params.length ? `{ ${arrayJoin(params, ", ")} }` : "";
  const scriptWrapper = `async (${fnParams})=>{\n${script}\n}`;
  const scriptContent = `__REALM_ADD_CUSTOM_FLOW('${elementName}', '${scriptId}', ${scriptWrapper})`;
  return URL.createObjectURL(createScriptBlob(scriptContent));
};

export const attatchScriptFlow = (
  elementName: string,
  scriptId: string,
  script: string,
  params: string[],
  onScriptLoad?: (elementName: string) => void
) => {
  const scriptURL = createScriptURL(elementName, scriptId, script, params);
  const scriptElement = _createElement<HTMLElement>(RealmTagNames.SCRIPT);
  scriptElement.onload = () => {
    onScriptLoad?.(elementName);
    URL.revokeObjectURL(scriptURL);
    _remove(head)(scriptElement);
  };
  _attrs(scriptElement)([
    [RealmAttributeNames.SRC, scriptURL],
    [RealmAttributeNames.TYPE, RealmScriptTypes.MODULE],
    [RealmAttributeNames.ASYNC],
    [RealmAttributeNames.SCRIPT_ID, scriptId],
  ]);
  _append(head)(scriptElement);
};
