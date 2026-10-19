import { tokenize } from "@realmorg/realm/compiler";

export interface Source {
  path: string;
  html: string;
}

interface Attribute {
  name: string;
  fieldName: string;
  type?: { text: string };
  default?: string;
}

const named = (names: Iterable<string>) => [...new Set(names)].sort().map((name) => ({ name }));

const pascal = (tag: string) =>
  tag.replace(/(^|-)([a-z0-9])/g, (_match, _dash, letter: string) => letter.toUpperCase());

const kebab = (key: string) => key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

const TYPES: Record<string, (args: string) => string> = {
  string: () => "string",
  number: () => "number",
  boolean: () => "boolean",
  date: () => "Date",
  array: () => "array",
  object: () => "object",
  enum: (args) =>
    args
      .replace(/^\[|\]$/g, "")
      .trim()
      .replace(/\s*,\s*/g, " | "),
};

const propsObject = (script: string) => {
  const start = script.indexOf("defineProps(");
  if (start === -1) return "";
  const open = script.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < script.length; index++) {
    depth += { "{": 1, "}": -1 }[script[index] as string] ?? 0;
    if (depth === 0) return script.slice(open + 1, index);
  }
  return "";
};

const splitTopLevel = (source: string) => {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const token of tokenize(source)) {
    if (token.type === "punct" && "([{".includes(token.value)) depth++;
    if (token.type === "punct" && ")]}".includes(token.value)) depth--;
    if (depth === 0 && token.value === ",") {
      parts.push(current);
      current = "";
    } else current += `${token.value} `;
  }
  return [...parts, current].map((part) => part.trim()).filter(Boolean);
};

const CALL = /\.\s*(\w+)\s*\(\s*((?:[^()]|\([^()]*\))*?)\s*\)/g;

const attributesOf = (script: string): Attribute[] =>
  splitTopLevel(propsObject(script)).flatMap((entry) => {
    const [key = "", definition = ""] = entry.split(/\s*:\s*(.*)/s);
    const calls = new Map([...definition.matchAll(CALL)].map((call) => [call[1], call[2]]));
    const type = [...calls.keys()].find((name) => name && name in TYPES);
    if (!type) return [];
    const attribute: Attribute = {
      name: calls.get("attribute")?.replace(/^["'`]|["'`]$/g, "") ?? kebab(key),
      fieldName: key,
      type: { text: (TYPES[type] as (args: string) => string)(calls.get(type) as string) },
    };
    if (calls.has("default")) attribute.default = calls.get("default");
    return [attribute];
  });

const EVENTS = /(?:dispatch\s*\(|new\s+(?:Custom)?Event\s*\()\s*["'`]([a-z][\w-]*)["'`]/g;
const STATES = /:state\(([\w-]+)\)/g;

export const describe = (definition: Element, path: string) => {
  const tagName = definition.getAttribute("name") as string;
  const script = definition.querySelector(":scope > script")?.textContent ?? "";
  const css = [...definition.querySelectorAll(":scope > style")]
    .map((style) => style.textContent)
    .join("\n");
  const slots = [...definition.querySelectorAll("slot")]
    .map((slot) => slot.getAttribute("name") ?? "")
    .filter((name) => !/^[#@]/.test(name));
  const parts = [...definition.querySelectorAll("[part]")].flatMap((el) =>
    (el.getAttribute("part") as string).split(/\s+/),
  );
  return {
    kind: "class",
    name: pascal(tagName),
    tagName,
    customElement: true,
    attributes: attributesOf(script),
    events: named([...script.matchAll(EVENTS)].map((match) => match[1] as string)),
    slots: named(slots),
    cssParts: named(parts),
    cssStates: named([...css.matchAll(STATES)].map((match) => match[1] as string)),
    path,
  };
};

export const createManifest = (definitions: ReturnType<typeof describe>[]) => ({
  schemaVersion: "2.1.0",
  modules: definitions.map(({ path, ...declaration }) => ({
    kind: "javascript-module",
    path,
    declarations: [declaration],
    exports: [
      {
        kind: "custom-element-definition",
        name: declaration.tagName,
        declaration: { name: declaration.name, module: path },
      },
    ],
  })),
});
