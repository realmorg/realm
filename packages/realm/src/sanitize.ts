import { HANDLER_PREFIX } from "./assemble";

const BLOCKED = new Set(
  "script style iframe frame frameset object embed link meta base template noscript".split(" "),
);
const URL_ATTRIBUTES = new Set(
  "href src action formaction xlink:href poster to from values".split(" "),
);
const UNSAFE_URL = /^\s*(?:javascript|vbscript|data:text\/html)/i;

export const parseHTML = (html: string) =>
  new DOMParser().parseFromString(`<body>${html}`, "text/html").body;

// Chrome reports a CSP violation whenever an on* attribute is parsed, even into an inert
// DOMParser document, so handlers are renamed in the source text before it is parsed.
const TAGS = /<(script)\b[\s\S]*?<\/script|<[a-z](?:=\s*(?:"[^"]*"|'[^']*')|[^>])*/gi;
const HANDLERS = /=\s*(?:"[^"]*"|'[^']*')|\son(?=\w)/gi;

export const parseSource = (html: string) =>
  new DOMParser().parseFromString(
    html.replace(TAGS, (tag, raw) =>
      raw
        ? tag
        : tag.replace(HANDLERS, (part) => (part[0] === "=" ? part : part[0] + HANDLER_PREFIX)),
    ),
    "text/html",
  );

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
  const fragment = new DocumentFragment();
  for (const node of [...root.childNodes]) fragment.append(document.importNode(node, true));
  return fragment;
};

export const sanitize = (html: string) => toFragment(clean(parseHTML(html)));
