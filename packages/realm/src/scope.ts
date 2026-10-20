import type { Instance } from "./element";
import { warn } from "./log";

export interface Box {
  value: unknown;
}

export interface Scope {
  instance: Instance;
  vars: ReadonlyArray<readonly [string, Box]>;
  signal: AbortSignal;
  disposers: (() => void)[];
}

export interface Reference {
  text: string;
  negate: boolean;
  kind: "#" | "@";
  path: string[];
}

const REFERENCE = /^(!?)([#@])([A-Za-z_$][\w$]*(?:\.[\w$-]+)*)$/;

export const parseReference = (text: string): Reference | undefined => {
  const match = text.trim().match(REFERENCE);
  if (!match) return undefined;
  return {
    text,
    negate: match[1] === "!",
    kind: match[2] as "#" | "@",
    path: (match[3] as string).split("."),
  };
};

export const requireReference = (text: string | null, where: string, scope: Scope) => {
  const reference = parseReference(text ?? "");
  if (!reference) {
    warn(
      `<${scope.instance.host.localName}> ${where}="${text ?? ""}" must be a reference like "#state.path" or "@prop".`,
    );
  }
  return reference;
};

const readRoot = (reference: Reference, scope: Scope) => {
  const root = reference.path[0] as string;
  const { instance } = scope;
  if (reference.kind === "@") return instance.props?.[root];
  const local = scope.vars.findLast(([name]) => name === root);
  if (local) return local[1].value;
  if (instance.has(root)) return instance.get(root);
  const found = instance.findInParents(root);
  if (!found)
    warn(
      `<${instance.host.localName}> "${reference.text}" is not defined in this component or its parents.`,
    );
  return found?.value;
};

export const readReference = (reference: Reference, scope: Scope): unknown => {
  let value = readRoot(reference, scope);
  for (const key of reference.path.slice(1)) {
    value =
      value === null || value === undefined ? undefined : (value as Record<string, unknown>)[key];
  }
  return reference.negate ? !value : value;
};

export const writeReference = (
  reference: Reference,
  scope: Scope,
  update: (current: unknown) => unknown,
) => {
  if (reference.kind === "@" || reference.path.length < 2 || reference.negate) {
    warn(
      `<${scope.instance.host.localName}> "${reference.text}" can't be written. Use a state property like "#todo.items".`,
    );
    return;
  }
  const parent = readReference({ ...reference, path: reference.path.slice(0, -1) }, scope) as
    | Record<string, unknown>
    | undefined;
  const key = reference.path.at(-1) as string;
  if (parent === null || typeof parent !== "object") {
    warn(
      `<${scope.instance.host.localName}> "${reference.text}" can't be written because its parent is not an object.`,
    );
    return;
  }
  parent[key] = update(parent[key]);
};
