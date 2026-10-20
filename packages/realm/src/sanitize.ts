const BLOCKED = new Set(
  "script style iframe frame frameset object embed link meta base template noscript".split(" "),
);
const URL_ATTRIBUTES = new Set(
  "href src action formaction xlink:href poster to from values".split(" "),
);
const UNSAFE_URL = /^\s*(?:javascript|vbscript|data:text\/html)/i;

export const parseHTML = (html: string) =>
  new DOMParser().parseFromString(`<body>${html}`, "text/html").body;

export const clean = (root: Element) => {
  for (const el of [...root.querySelectorAll("*")]) {
    if (BLOCKED.has(el.localName)) {
      el.remove();
      continue;
    }
    for (const { name, value } of [...el.attributes]) {
      if (
        name.startsWith("on") ||
        name === "srcdoc" ||
        (URL_ATTRIBUTES.has(name) && UNSAFE_URL.test(value))
      ) {
        el.removeAttribute(name);
      }
    }
  }
  return root;
};

export const toFragment = (root: Element) => {
  const fragment = document.createDocumentFragment();
  for (const node of [...root.childNodes]) fragment.append(document.importNode(node, true));
  return fragment;
};

export const sanitize = (html: string) => toFragment(clean(parseHTML(html)));
