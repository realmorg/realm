export const RealmAttributeNames = {
  ACTION: "action",
  AS: "as",
  ASYNC: "async",
  CHILDREN: "children",
  DEBOUNCE: "debounce",
  DEBUG: "debug",
  DEFER: "defer",
  ELEMENT: "element",
  EVERY: "every",
  FROM: "from",
  GLOBAL: "global",
  HREF: "href",
  INDEX: "index",
  IS_LOADED: "loaded",
  MOUNT: "mount",
  MUTATE: "mutate",
  NAME: "name",
  OF: "of",
  ONCE: "once",
  REF: "ref",
  REL: "rel",
  SCRIPT_ID: "script-id",
  SLOT: "slot",
  SRC: "src",
  STORAGE: "storage",
  TO: "to",
  TOGGLE: "toggle",
  TYPE: "type",
  VALUE: "value",
  METHOD: "method",
  HTTP_URL: "url",
} as const;

export const RealmMutableAttr = {
  ATTR: "attr",
  META: "meta",
  SRC: "src",
  STATE: "state",
} as const;

export type BindingAttrValue = [
  attrName: string,
  attrValue: string,
  isGlobal: boolean,
  debug: string
];

export type ElementBinding = Array<
  [
    Element,
    Set<BindingAttrValue>,
    Set<BindingAttrValue>,
    Set<BindingAttrValue>,
    Set<BindingAttrValue>
  ]
>;
