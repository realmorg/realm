import { compare } from "./bindings";
import type { Instance } from "./element";
import { effect, reactive } from "./reactivity";
import { readReference, type Scope } from "./scope";

const VARIABLE = /var\(\s*--((?:attr|state)-[\w-]+)/g;
const STATE = /:state\(\s*((?:attr|state)-[\w-]+)\s*\)/g;
const VARIABLE_NAME = /^(attr|state)-(.+)$/;
const STATE_NAME = /^(attr|state)-(.+?)(?:-(is|gt|gte|lt|lte)-(.+))?$/;
const COMPARATORS = { is: "eq", gt: "gt", gte: "gte", lt: "lt", lte: "lte" } as const;

export interface CssBindings {
  variables: Set<string>;
  states: Set<string>;
}

export const scanCss = (css: string, into: CssBindings) => {
  for (const match of css.matchAll(VARIABLE)) into.variables.add(match[1] as string);
  for (const match of css.matchAll(STATE)) into.states.add(match[1] as string);
};

export const attributesOf = (instance: Instance) => {
  if (instance.attrs) return instance.attrs;
  const host = instance.host;
  const mirror = reactive<Record<string, string | null>>({});
  const read = () => {
    for (const { name, value } of host.attributes) mirror[name] = value;
    for (const name of Object.keys(mirror)) if (!host.hasAttribute(name)) mirror[name] = null;
  };
  read();
  const observer = new MutationObserver(read);
  observer.observe(host, { attributes: true });
  instance.disposers.push(() => observer.disconnect());
  instance.attrs = new Proxy(mirror, {
    get: (target, name: string) => target[name] ?? null,
    set(_, name: string, value: unknown) {
      if (value === null || value === undefined || value === false) host.removeAttribute(name);
      else host.setAttribute(name, value === true ? "" : String(value));
      read();
      return true;
    },
  });
  return instance.attrs;
};

export const bindCss = (instance: Instance, scope: Scope) => {
  const { variables, states } = instance.definition.css;
  if (!variables.size && !states.size) return;
  const read = (kind: string, name: string) => {
    if (kind === "attr") {
      const key = instance.propAttributes.get(name);
      return key === undefined ? attributesOf(instance)[name] : instance.props?.[key];
    }
    return readReference(
      { text: `#${name}`, negate: false, kind: "#", path: name.split("-") },
      scope,
    );
  };

  const style = instance.host.style;
  for (const name of variables) {
    const [, kind, path] = VARIABLE_NAME.exec(name) as RegExpExecArray;
    instance.disposers.push(
      effect(() => {
        const value = read(kind as string, path as string);
        if (value === null || value === undefined || typeof value === "object")
          style.setProperty(`--${name}`, "initial");
        else style.setProperty(`--${name}`, String(value));
      }),
    );
  }
  for (const name of states) {
    const [, kind, path, operator, expected = ""] = STATE_NAME.exec(name) as RegExpExecArray;
    const comparator = operator ? COMPARATORS[operator as keyof typeof COMPARATORS] : undefined;
    instance.disposers.push(
      effect(() => {
        if (compare(read(kind as string, path as string), comparator, expected))
          instance.internals.states.add(name);
        else instance.internals.states.delete(name);
      }),
    );
  }
};
