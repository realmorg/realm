import { warn } from "./log";
import { effect, reactive } from "./reactivity";
import type { StorageAdapter, StoreOptions } from "./types";

const stores = new Map<string, object>();

const fromStorage = (storage: Storage): StorageAdapter => ({
  get: (key) => storage.getItem(key),
  set: (key, value) => storage.setItem(key, value),
});

const adapterFor = (persist: StoreOptions["persist"]): StorageAdapter | undefined => {
  if (persist === "local") return fromStorage(localStorage);
  if (persist === "session") return fromStorage(sessionStorage);
  return persist;
};

const isData = (target: object, key: string) => {
  const descriptor = Object.getOwnPropertyDescriptor(target, key);
  return !descriptor || "value" in descriptor;
};

export const defineStore = <T extends object>(
  name: string,
  initial: T,
  options: StoreOptions = {},
): T => {
  const existing = stores.get(name);
  if (existing) return existing as T;
  const state = reactive(initial);
  const adapter = adapterFor(options.persist);
  stores.set(name, state);
  if (!adapter) return state;
  const key = `realm:${name}`;
  const saved = adapter.get(key);
  if (saved !== null) {
    try {
      const values = JSON.parse(saved) as Record<string, unknown>;
      for (const [field, value] of Object.entries(values)) {
        if (isData(initial, field)) (state as Record<string, unknown>)[field] = value;
      }
    } catch {
      warn(`Stored value for store "${name}" is not valid JSON and was ignored.`);
    }
  }
  const fields = state as Record<string, unknown>;
  effect(() =>
    adapter.set(
      key,
      JSON.stringify(
        Object.fromEntries(
          Object.keys(fields)
            .filter((field) => isData(initial, field))
            .map((field) => [field, fields[field]]),
        ),
      ),
    ),
  );
  return state;
};
