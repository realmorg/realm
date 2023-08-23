import { importElement } from "./elements/import-element";
import {
  importScriptElement,
  importStyleElement,
} from "./elements/import-resource";
import {
  isVisibleElement,
  isHiddenElement,
} from "./elements/visibility-element";
import { repeatListElement } from "./elements/repeat-list";
import { globalStateElement } from "./elements/global-state";
import { webAppElement } from "./elements/web-app";
import { customElement } from "./elements/custom-element";
import { elementFlow } from "./elements/element-flow";

const ASYNC_ELEMENT = [
  importElement,
  importScriptElement,
  importStyleElement,
  repeatListElement,
  isVisibleElement,
  isHiddenElement,
  elementFlow,
];

const SYNC_ELEMENT = [globalStateElement, customElement, webAppElement];

(async () => {
  for (const defineElement of ASYNC_ELEMENT) await defineElement();
  for (const defineElement of SYNC_ELEMENT) defineElement();
})();
