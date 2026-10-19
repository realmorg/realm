import { afterEach, describe, expect, test, vi } from "vitest";
import { flush } from "../src/reactivity";
import { defineStore } from "../src/store";
import { define, render, root, tag, text, tick } from "./helpers";

afterEach(() => vi.restoreAllMocks());

describe("defineStore", () => {
  test("returns the same store for the same name", () => {
    const name = tag("store");
    expect(defineStore(name, { a: 1 })).toBe(defineStore(name, { a: 2 }));
  });

  test("persists to localStorage and restores typed values", async () => {
    const name = tag("cart");
    localStorage.setItem(`realm:${name}`, JSON.stringify({ items: [1, 2], count: 2, total: 99 }));
    const cart = defineStore(
      name,
      {
        items: [] as number[],
        count: 0,
        get total() {
          return this.items.length;
        },
      },
      { persist: "local" },
    );
    expect(cart.items).toEqual([1, 2]);
    expect(cart.count).toBe(2);
    expect(cart.total).toBe(2);
    cart.items.push(3);
    await Promise.resolve();
    flush();
    expect(JSON.parse(localStorage.getItem(`realm:${name}`) as string).items).toEqual([1, 2, 3]);
  });

  test("session storage, custom adapters and corrupt values", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const session = tag("session");
    defineStore(session, { n: 1 }, { persist: "session" });
    expect(sessionStorage.getItem(`realm:${session}`)).toBe('{"n":1}');
    const custom = tag("custom");
    const memory = new Map<string, string>([[`realm:${custom}`, "{bad"]]);
    const store = defineStore(
      custom,
      { n: 5 },
      {
        persist: {
          get: (key) => memory.get(key) ?? null,
          set: (key, value) => memory.set(key, value),
        },
      },
    );
    expect(store.n).toBe(5);
    expect(warn).toHaveBeenCalledWith(
      "[realm]",
      `Stored value for store "${custom}" is not valid JSON and was ignored.`,
    );
  });

  test("components read and update stores imported from a module", async () => {
    const storeName = tag("shared");
    (window as unknown as { sharedStore: { n: number } }).sharedStore = defineStore(storeName, {
      n: 1,
    });
    const name = tag("uses-store");
    await define(`<custom-element name="${name}">
      <script>const shared = window.sharedStore; function inc() { shared.n++; }</script>
      <button onclick="inc()"><slot name="#shared.n"></slot></button>
    </custom-element>`);
    const host = render(`<${name}></${name}><${name}></${name}>`);
    const [a, b] = [...host.querySelectorAll(name)];
    (root(a as Element).querySelector("button") as HTMLButtonElement).click();
    await tick();
    expect(text(root(b as Element))).toBe("2");
  });
});
