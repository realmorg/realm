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

const attributeMirror = (instance: Instance, names: string[]) => {
  const host = instance.host;
  const mirror = reactive<Record<string, string | null>>({});
  const read = () => {
    for (const name of names) mirror[name] = host.getAttribute(name);
  };
  read();
  const observer = new MutationObserver(read);
  observer.observe(host, { attributes: true, attributeFilter: names });
  instance.disposers.push(() => observer.disconnect());
  return mirror;
};

export const bindCss = (instance: Instance, scope: Scope) => {
  const { variables, states } = instance.definition.css;
  if (!variables.size && !states.size) return;
  const parsed = [
    ...[...variables].map((name) => VARIABLE_NAME.exec(name) as RegExpExecArray),
    ...[...states].map((name) => STATE_NAME.exec(name) as RegExpExecArray),
  ];
  const loose = parsed
    .filter((m) => m[1] === "attr" && !instance.propAttributes.has(m[2] as string))
    .map((m) => m[2] as string);
  const mirror = attributeMirror(instance, [...new Set(loose)]);

  const read = (kind: string, name: string) => {
    if (kind === "attr") {
      const key = instance.propAttributes.get(name);
      return key === undefined ? mirror[name] : instance.props?.[key];
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
