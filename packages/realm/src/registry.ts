import { warn } from "./log";
import type { Handler, Setup } from "./types";

const runtimeId = crypto.randomUUID();
const setups = new Map<string, (setup: Setup) => void>();
const handlers = new Map<string, Handler>();

const runtime = {
  register(id: string, setup: Setup) {
    const resolve = setups.get(id);
    setups.delete(id);
    resolve?.(setup);
  },
  handler(id: string, fn: Handler) {
    handlers.set(id, fn);
  },
};

const GLOBAL = Symbol.for("realm");
const global = globalThis as unknown as Record<symbol, Map<string, typeof runtime> | undefined>;
const runtimes = global[GLOBAL] ?? new Map();
global[GLOBAL] = runtimes;
runtimes.set(runtimeId, runtime);

export const settingUp = new Set<string>();

export const RUNTIME = `globalThis[Symbol.for("realm")].get(${JSON.stringify(runtimeId)})`;

let counter = 0;
export const nextId = (prefix: string) => `${prefix}:${++counter}`;

const insert = (code: string, module: boolean, onerror?: () => void) => {
  const script = document.createElement("script");
  if (module) script.type = "module";
  if (onerror) script.addEventListener("error", onerror, { once: true });
  const nonce = document.querySelector<HTMLScriptElement>("script[nonce]")?.nonce;
  if (nonce) script.nonce = nonce;
  script.textContent = code;
  document.head.append(script);
  script.remove();
};

export const EMPTY_SETUP: Setup = () => ({ get: () => undefined, handlers: [] });

export const runSetupScript = (id: string, code: string, module: boolean, label: string) =>
  new Promise<Setup>((resolve) => {
    const fail = () => {
      if (!setups.delete(id)) return;
      warn(`<${label}> has an error in its <script>. The component renders without it.`);
      resolve(EMPTY_SETUP);
    };
    setups.set(id, resolve);
    insert(code, module, fail);
    if (!module) fail();
  });

export const compileHandler = (code: string): Handler | undefined => {
  const id = nextId("handler");
  insert(`${RUNTIME}.handler(${JSON.stringify(id)}, function (event) {\n${code}\n});`, false);
  const fn = handlers.get(id);
  handlers.delete(id);
  return fn;
};
