import { freeNames, splitImports, topLevelNames } from "./scan";

export const HELPERS =
  "defineProps defineMethods listen useState useChildren tick dispatch attrs observe onConnected onDisconnected onFormReset onFormDisabled onFormStateRestore defineStore lookup prop host refs signal internals setTimeout setInterval clearTimeout clearInterval untrack".split(
    " ",
  );

export const HANDLER_PREFIX = "realm:on";

export type HandlerList = Map<string, [string[], string]>;

export const handlerKey = (vars: readonly string[], code: string) =>
  `${vars.join(",")}\u0000${code}`;

const loopVars = (el: Element, vars: readonly string[]) => {
  const index = el.getAttribute("index");
  return [...vars, el.getAttribute("as") ?? "item", ...(index ? [index] : [])];
};

export const collectHandlers = (
  elements: Iterable<Element>,
  vars: readonly string[] = [],
  found: HandlerList = new Map(),
) => {
  for (const el of elements) {
    const repeats = el.localName === "repeat-list";
    const inner = repeats || el.hasAttribute("repeat") ? loopVars(el, vars) : vars;
    for (const attr of el.attributes) {
      const handler =
        attr.name.startsWith(HANDLER_PREFIX) ||
        (attr.name.length > 2 && attr.name.startsWith("on"));
      if (handler && !repeats) {
        found.set(handlerKey(inner, attr.value), [[...inner], attr.value]);
      }
    }
    collectHandlers(el.children, inner, found);
  }
  return found;
};

const handlerSource = (vars: string[], code: string, names: Set<string>) => {
  const skip = new Set([...names, ...vars, ...HELPERS, "event"]);
  const lookups = [...freeNames(code)].filter((name) => !skip.has(name));
  const params = ["event", ...vars].join(", ");
  const resolved = lookups
    .map((name) => `const ${name} = lookup(${JSON.stringify(name)});`)
    .join("\n");
  return `function (${params}) {\n${resolved}\n{\n${code}\n}\n}`;
};

export const setupSource = (script: string, base: string | null, handlers: HandlerList) => {
  const { imports, body, names: imported } = splitImports(script, base);
  const names = new Set([...imported, ...topLevelNames(body)]);
  const cases = [...names]
    .map((name) => `case ${JSON.stringify(name)}: return ${name};`)
    .join("\n");
  const setup = `function (__realm) {
"use strict";
const { ${HELPERS.join(", ")} } = __realm;
{
${body}
return {
get(__name) {
switch (__name) {
${cases}
}
},
handlers: [
${[...handlers.values()].map(([vars, source]) => handlerSource(vars, source, names)).join(",\n")}
]
};
}
}`;
  return { imports, setup, names };
};
