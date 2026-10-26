// Behaviour adapted from Vue's packages/reactivity/__tests__ (MIT), rewritten for REALM's API.
import { describe, expect, test, vi } from "vitest";
import {
  effect,
  flush,
  isObservable,
  isReactive,
  reactive,
  toRaw,
  untrack,
} from "../src/reactivity";

const settle = async () => {
  await Promise.resolve();
  flush();
};

describe("reactive", () => {
  test("returns the same proxy for the same object", () => {
    const raw = { a: 1 };
    expect(reactive(raw)).toBe(reactive(raw));
    expect(reactive(reactive(raw))).toBe(reactive(raw));
    expect(isReactive(reactive(raw))).toBe(true);
    expect(isReactive(raw)).toBe(false);
    expect(toRaw(reactive(raw))).toBe(raw);
    expect(toRaw(5)).toBe(5);
  });

  test("leaves non-plain objects untouched", () => {
    const date = new Date();
    expect(reactive(date)).toBe(date);
    expect(isObservable(Object.create(null))).toBe(true);
    expect(isObservable(new Map())).toBe(false);
    expect(isObservable(null)).toBe(false);
    expect(isObservable(1)).toBe(false);
  });

  test("frozen data is read as it is", () => {
    const rows = Object.freeze([Object.freeze({ id: 1, tags: Object.freeze(["a"]) })]);
    const state = reactive({ rows });
    expect(state.rows).toBe(rows);
    expect(state.rows[0]).toBe(rows[0]);
    expect(state.rows[0]?.tags[0]).toBe("a");
    const frozen = Object.freeze({ nested: Object.freeze({ value: 1 }) });
    expect(reactive(frozen)).toBe(frozen);
    expect(isObservable(frozen)).toBe(false);
  });

  test("batches several changes into one run", async () => {
    const state = reactive({ a: 1, b: 2 });
    const spy = vi.fn(() => state.a + state.b);
    effect(spy);
    state.a = 10;
    state.b = 20;
    await settle();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test("does not run when the value is the same", async () => {
    const state = reactive({ a: 1 });
    const spy = vi.fn(() => state.a);
    effect(spy);
    state.a = 1;
    await settle();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("tracks nested objects lazily", async () => {
    const state = reactive({ user: { name: "Ana" } });
    let seen = "";
    effect(() => {
      seen = state.user.name;
    });
    state.user.name = "Budi";
    await settle();
    expect(seen).toBe("Budi");
    state.user = { name: "Citra" };
    await settle();
    expect(seen).toBe("Citra");
  });

  test("tracks added and deleted keys", async () => {
    const state = reactive<Record<string, number>>({});
    let keys: string[] = [];
    let has = false;
    effect(() => {
      keys = Object.keys(state);
      has = "x" in state;
    });
    state.x = 1;
    await settle();
    expect(keys).toEqual(["x"]);
    expect(has).toBe(true);
    delete state.x;
    await settle();
    expect(keys).toEqual([]);
    delete state.missing;
    await settle();
    expect(has).toBe(false);
  });

  test("getters are cached derived values", async () => {
    const getter = vi.fn();
    const state = reactive({
      items: [1, 2, 3],
      get total() {
        getter();
        return this.items.reduce((sum, n) => sum + n, 0);
      },
    });
    expect(state.total).toBe(6);
    expect(state.total).toBe(6);
    expect(getter).toHaveBeenCalledTimes(1);
    let seen = 0;
    effect(() => {
      seen = state.total;
    });
    state.items.push(4);
    await settle();
    expect(seen).toBe(10);
    expect(getter).toHaveBeenCalledTimes(2);
  });

  test("diamond dependencies update once and never see stale values", async () => {
    const state = reactive({
      n: 1,
      get double() {
        return this.n * 2;
      },
      get triple() {
        return this.n * 3;
      },
    });
    const seen: number[] = [];
    effect(() => {
      seen.push(state.double + state.triple);
    });
    state.n = 2;
    await settle();
    expect(seen).toEqual([5, 10]);
  });

  test("setters run with the proxy as this", async () => {
    const state = reactive({
      first: "a",
      last: "b",
      set full(value: string) {
        [this.first, this.last] = value.split(" ") as [string, string];
      },
    });
    state.full = "x y";
    expect(state.first).toBe("x");
    expect(state.last).toBe("y");
  });

  test("a getter that throws reports the error and recovers", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const state = reactive({
      fail: true,
      get value() {
        if (this.fail) throw new Error("boom");
        return "ok";
      },
    });
    let seen = "";
    effect(() => {
      seen = state.value;
    });
    expect(error).toHaveBeenCalled();
    state.fail = false;
    await settle();
    expect(seen).toBe("ok");
    error.mockRestore();
  });
});

describe("arrays", () => {
  test("push, splice and index writes notify", async () => {
    const list = reactive([1, 2, 3]);
    let snapshot: number[] = [];
    effect(() => {
      snapshot = list.map((n) => n);
    });
    list.push(4);
    await settle();
    expect(snapshot).toEqual([1, 2, 3, 4]);
    list.splice(0, 1);
    await settle();
    expect(snapshot).toEqual([2, 3, 4]);
    list[0] = 9;
    await settle();
    expect(snapshot).toEqual([9, 3, 4]);
  });

  test("push inside an observer does not loop on its own length", async () => {
    const list = reactive<number[]>([]);
    const source = reactive({ n: 0 });
    effect(() => {
      list.push(source.n);
    });
    source.n = 1;
    await settle();
    expect(toRaw(list)).toEqual([0, 1]);
  });

  test("shrinking length notifies readers of removed indexes", async () => {
    const list = reactive(["a", "b", "c"]);
    let third: string | undefined = "";
    effect(() => {
      third = list[2];
    });
    list.length = 1;
    await settle();
    expect(third).toBeUndefined();
  });

  test("length writes without index readers still notify iteration", async () => {
    const list = reactive([1, 2]);
    let count = 0;
    effect(() => {
      count = Object.keys(list).length;
    });
    list.length = 0;
    await settle();
    expect(count).toBe(0);
    const untouched = reactive([1]);
    untouched.length = 0;
    expect(untouched.length).toBe(0);
  });

  test("search methods find raw and reactive members", () => {
    const item = { id: 1 };
    const list = reactive([item]);
    expect(list.includes(item)).toBe(true);
    expect(list.indexOf(list[0] as typeof item)).toBe(0);
    expect(list.lastIndexOf({ id: 2 })).toBe(-1);
    expect(list.includes({ id: 1 })).toBe(false);
  });
});

describe("effect", () => {
  test("runs cleanup before the next run and on stop", async () => {
    const state = reactive({ n: 0 });
    const cleanup = vi.fn();
    const stop = effect(() => {
      void state.n;
      return cleanup;
    });
    state.n = 1;
    await settle();
    expect(cleanup).toHaveBeenCalledTimes(1);
    stop();
    expect(cleanup).toHaveBeenCalledTimes(2);
    state.n = 2;
    await settle();
    expect(cleanup).toHaveBeenCalledTimes(2);
  });

  test("a stopped effect queued for a run does not run", async () => {
    const state = reactive({ n: 0 });
    const spy = vi.fn(() => state.n);
    const stop = effect(spy);
    state.n = 1;
    stop();
    await settle();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("errors are reported and do not stop other observers", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const state = reactive({ n: 0 });
    let other = 0;
    effect(() => {
      if (state.n === 1) throw new Error("boom");
    });
    effect(() => {
      other = state.n;
    });
    state.n = 1;
    await settle();
    expect(error).toHaveBeenCalled();
    expect(other).toBe(1);
    error.mockRestore();
  });

  test("detects update loops", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const state = reactive({ n: 0 });
    const stop = effect(() => {
      state.n = state.n + 1;
    });
    await settle();
    expect(error).toHaveBeenCalledWith(
      "[realm]",
      expect.objectContaining({ message: expect.stringContaining("Update loop") }),
    );
    stop();
    error.mockRestore();
  });

  test("an observer stopped by another during the same flush does not run", async () => {
    const state = reactive({ n: 0 });
    const second = vi.fn(() => state.n);
    let stopSecond = () => {};
    effect(() => {
      if (state.n === 1) stopSecond();
    });
    stopSecond = effect(second);
    state.n = 1;
    await settle();
    expect(second).toHaveBeenCalledTimes(1);
  });

  test("a derived value invalidated twice before it is read recomputes once", async () => {
    const getter = vi.fn();
    const state = reactive({
      a: 1,
      b: 1,
      get sum() {
        getter();
        return this.a + this.b;
      },
    });
    let seen = 0;
    effect(() => {
      seen = state.sum;
    });
    state.a = 2;
    state.b = 2;
    await settle();
    expect(seen).toBe(4);
    expect(getter).toHaveBeenCalledTimes(2);
  });

  test("untrack reads without subscribing", async () => {
    const state = reactive({ n: 0 });
    const spy = vi.fn(() => untrack(() => state.n));
    effect(spy);
    state.n = 1;
    await settle();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("nested observers keep their own dependencies", async () => {
    const state = reactive({ outer: 0, inner: 0 });
    const inner = vi.fn(() => state.inner);
    const outer = vi.fn(() => {
      void state.outer;
      return effect(inner);
    });
    effect(outer);
    state.inner = 1;
    await settle();
    expect(outer).toHaveBeenCalledTimes(1);
    expect(inner).toHaveBeenCalledTimes(2);
  });
});
