import { webAppElement } from "./elements/web-app";
import { defineElement } from "./elements/define-element";

window.onload = () =>
  [webAppElement, defineElement].forEach((registerElement) =>
    registerElement()
  );
