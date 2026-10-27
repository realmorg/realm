import { defineComponent } from "./definition";
import { ImportElement, watchDocumentTags } from "./loader";

const PAGE_SHEET = new CSSStyleSheet();
PAGE_SHEET.replaceSync(
  "custom-element,import-element{display:none!important}is-visible,is-hidden,repeat-list{display:contents}",
);

let started = false;

// The definition stays in the page until it is defined, so realm.css keeps hiding what it defines.
const defineInline = (el: Element) =>
  defineComponent(el, document.baseURI, true).then(() => el.remove());

const scan = (root: ParentNode) => {
  for (const el of root.querySelectorAll("custom-element")) defineInline(el);
};

export const start = () => {
  if (started) return;
  started = true;
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, PAGE_SHEET];
  if (!customElements.get("import-element")) customElements.define("import-element", ImportElement);
  scan(document);
  new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.localName === "custom-element") defineInline(node);
        else scan(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  watchDocumentTags(document);
};
