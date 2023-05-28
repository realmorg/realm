import { webAppElement } from "./elements/web-app";
import { defineElement } from "./elements/define-element";

[webAppElement, defineElement].forEach((registerElement) => registerElement());
