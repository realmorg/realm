import { report } from "./log";
import { getOrCreate } from "./map";

interface Subscriber {
  deps: Set<Dep>;
  notify(): void;
}

type Dep = Set<Subscriber>;
type Cleanup = undefined | (() => void);

const RAW = Symbol("realm.raw");
const ITERATE = Symbol("realm.iterate");
const MAX_FLUSH_ROUNDS = 100;

const targets = new WeakMap<object, Map<PropertyKey, Dep>>();
const proxies = new WeakMap<object, object>();
const queue = new Set<Runner>();

let active: Subscriber | undefined;
let scheduled = false;

const subscribe = (dep: Dep) => {
  if (!active) return;
  dep.add(active);
  active.deps.add(dep);
};

const track = (target: object, key: PropertyKey) => {
  if (!active) return;
  const keys = getOrCreate(targets, target, () => new Map<PropertyKey, Dep>());
  subscribe(getOrCreate(keys, key, () => new Set()));
};

const notifyAll = (dep: Dep | undefined) => {
  if (dep) for (const subscriber of [...dep]) subscriber.notify();
};

const trigger = (target: object, key: PropertyKey) => notifyAll(targets.get(target)?.get(key));

const unsubscribe = (subscriber: Subscriber) => {
  for (const dep of subscriber.deps) dep.delete(subscriber);
  subscriber.deps.clear();
};

const schedule = () => {
  if (scheduled) return;
  scheduled = true;
  queueMicrotask(flush);
};

export const flush = () => {
  scheduled = false;
  for (let round = 0; queue.size; round++) {
    if (round === MAX_FLUSH_ROUNDS) {
      queue.clear();
      report(new Error("Update loop detected: an observer keeps changing state it depends on."));
      return;
    }
    const batch = [...queue];
    queue.clear();
    for (const runner of batch) runner.run();
  }
};

class Runner implements Subscriber {
  deps = new Set<Dep>();
  #cleanup: Cleanup;
  #stopped = false;

  constructor(readonly fn: () => unknown) {}

  notify() {
    queue.add(this);
    schedule();
  }

  run() {
    if (this.#stopped) return;
    this.#dispose();
    const previous = active;
    active = this;
    try {
      const result = this.fn();
      if (typeof result === "function") this.#cleanup = result as () => void;
    } catch (error) {
      report(error);
    } finally {
      active = previous;
    }
  }

  stop() {
    this.#stopped = true;
    queue.delete(this);
    this.#dispose();
  }

  #dispose() {
    unsubscribe(this);
    const cleanup = this.#cleanup;
    this.#cleanup = undefined;
    cleanup?.();
  }
}

class Computed implements Subscriber {
  deps = new Set<Dep>();
  subscribers: Dep = new Set();
  dirty = true;
  value: unknown;
  error: unknown;
  failed = false;

  constructor(readonly getter: () => unknown) {}

  notify() {
    if (this.dirty) return;
    this.dirty = true;
    notifyAll(this.subscribers);
  }

  get() {
    subscribe(this.subscribers);
    if (this.dirty) {
      unsubscribe(this);
      const previous = active;
      active = this;
      try {
        this.value = this.getter();
        this.failed = false;
      } catch (error) {
        this.error = error;
        this.failed = true;
      } finally {
        this.dirty = false;
        active = previous;
      }
    }
    if (this.failed) throw this.error;
    return this.value;
  }
}

export const tick = async () => {
  await Promise.resolve();
  flush();
};

export const effect = (fn: () => unknown) => {
  const runner = new Runner(fn);
  runner.run();
  return () => runner.stop();
};

export const untrack = <T>(fn: () => T): T => {
  const previous = active;
  active = undefined;
  try {
    return fn();
  } finally {
    active = previous;
  }
};

export const isObservable = (value: unknown): value is object => {
  if (value === null || typeof value !== "object") return false;
  if (Array.isArray(value)) return true;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

export const toRaw = <T>(value: T): T =>
  (value !== null && typeof value === "object" && (value as Record<symbol, T>)[RAW]) || value;

export const isReactive = (value: unknown) => toRaw(value) !== value;

const ARRAY_MUTATORS = new Set(
  "push pop shift unshift splice sort reverse fill copyWithin".split(" "),
);
const ARRAY_SEARCHES = new Set(["includes", "indexOf", "lastIndexOf"]);

const arrayMethod = (target: unknown[], key: string, receiver: unknown) => {
  const method = Array.prototype[key as keyof unknown[]] as (...args: unknown[]) => unknown;
  if (ARRAY_MUTATORS.has(key))
    return (...args: unknown[]) => untrack(() => method.apply(receiver, args));
  return (...args: unknown[]) => {
    track(target, ITERATE);
    const result = method.apply(target, args.map(toRaw));
    return result === -1 || result === false ? method.apply(receiver, args) : result;
  };
};

const triggerTruncated = (target: unknown[], length: number) => {
  const keys = targets.get(target);
  if (!keys) return;
  for (const [key, dep] of keys) {
    if (typeof key === "string" && Number(key) >= length) notifyAll(dep);
  }
};

export const reactive = <T extends object>(target: T): T => {
  if (!isObservable(target) || isReactive(target)) return target;
  const existing = proxies.get(target);
  if (existing) return existing as T;

  const computed = new Map<PropertyKey, Computed>();
  const isArray = Array.isArray(target);

  const proxy = new Proxy(target, {
    get(t, key, receiver) {
      if (key === RAW) return t;
      if (
        isArray &&
        typeof key === "string" &&
        (ARRAY_MUTATORS.has(key) || ARRAY_SEARCHES.has(key))
      )
        return arrayMethod(t as unknown[], key, receiver);
      const getter = Object.getOwnPropertyDescriptor(t, key)?.get;
      if (getter) {
        return getOrCreate(computed, key, () => new Computed(() => getter.call(receiver))).get();
      }
      track(t, key);
      const value = Reflect.get(t, key, receiver);
      return isObservable(value) ? reactive(value) : value;
    },
    set(t, key, value, receiver) {
      const setter = Object.getOwnPropertyDescriptor(t, key)?.set;
      if (setter) {
        setter.call(receiver, value);
        return true;
      }
      const raw = toRaw(value);
      const had = Object.hasOwn(t, key);
      const previous = (t as Record<PropertyKey, unknown>)[key];
      const oldLength = isArray ? (t as unknown[]).length : 0;
      (t as Record<PropertyKey, unknown>)[key] = raw;
      if (had && Object.is(previous, raw)) return true;
      trigger(t, key);
      if (!had) trigger(t, ITERATE);
      if (isArray) {
        const newLength = (t as unknown[]).length;
        if (newLength !== oldLength && key !== "length") trigger(t, "length");
        if (key === "length") {
          trigger(t, ITERATE);
          triggerTruncated(t as unknown[], newLength);
        }
      }
      return true;
    },
    deleteProperty(t, key) {
      const had = Object.hasOwn(t, key);
      delete (t as Record<PropertyKey, unknown>)[key];
      if (had) {
        trigger(t, key);
        trigger(t, ITERATE);
      }
      return true;
    },
    has(t, key) {
      track(t, key);
      return Reflect.has(t, key);
    },
    ownKeys(t) {
      track(t, ITERATE);
      if (isArray) track(t, "length");
      return Reflect.ownKeys(t);
    },
  });

  proxies.set(target, proxy);
  return proxy;
};
