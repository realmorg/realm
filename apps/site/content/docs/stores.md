---
title: Stores
description: Share app-wide state between components with defineStore, persist it to localStorage, sessionStorage or a custom adapter, and keep value types intact.
group: Data
order: 22
nav: Stores
---

# Stores

There are two ways to share state:

1. **Parent state** is visible to nested components automatically. See [Nested components and scope](/docs/scope/). This covers most sharing inside one part of a page.
2. **A store** holds app-wide state that several unrelated components use, or that should outlive any one component.

## defineStore

```js
// /state/cart.js
import { defineStore } from "@realmorg/realm";

export const cart = defineStore(
  "cart",
  {
    items: [],
    get count() {
      return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },
  },
  { persist: "local" },
);
```

```html
<custom-element name="cart-badge">
  <script type="module">
    import { cart } from "/state/cart.js";
  </script>

  <ui-badge><slot name="#cart.count">0</slot></ui-badge>
</custom-element>

<custom-element name="add-to-cart">
  <script type="module">
    import { cart } from "/state/cart.js";

    const props = defineProps({ sku: prop.string().required() });

    function add() {
      const line = cart.items.find((item) => item.sku === props.sku);
      if (line) line.quantity++;
      else cart.items.push({ sku: props.sku, quantity: 1 });
    }
  </script>

  <ui-button onclick="add()">Add to cart</ui-button>
</custom-element>
```

- A store is reactive, exactly like `useState`, including getters.
- `defineStore` returns the same store for the same name, wherever it is called. Defining it in a module and importing it is the clearest pattern; calling `defineStore("cart", …)` directly in two component scripts also gives both the same store.
- Nothing is attached to `window`.

`defineStore` is also available inside component scripts without importing, which is handy for small apps:

```html live
<custom-element name="theme-picker">
  <script type="realm">
    const settings = defineStore("docs-demo-settings", { accent: "chart-1" }, { persist: "session" });
    const ACCENTS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];
    const picker = useState({
      get swatches() {
        return ACCENTS.map((id) => ({ id, color: `var(--${id})`, current: id === settings.accent }));
      },
    });

    function choose(swatch) {
      settings.accent = swatch.id;
    }
  </script>

  <style type="realm">
    :host {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
    button {
      width: calc(var(--spacing) * 8);
      height: calc(var(--spacing) * 8);
      border: 2px solid transparent;
      border-radius: var(--radius-full);
      background: var(--swatch);
      cursor: pointer;
    }
    button[aria-pressed="true"] {
      border-color: var(--foreground);
    }
  </style>

  <button type="button" repeat="#picker.swatches" as="swatch" key="id" _aria-label="#swatch.id" _aria-pressed="#swatch.current" _--swatch="#swatch.color" onclick="choose(swatch)"></button>
</custom-element>

<custom-element name="accent-preview">
  <script type="realm">
    const settings = defineStore("docs-demo-settings", { accent: "chart-1" }, { persist: "session" });
    const preview = useState({
      get color() {
        return `var(--${settings.accent})`;
      },
    });
  </script>

  <style type="realm">
    :host {
      display: block;
      padding: calc(var(--spacing) * 3) calc(var(--spacing) * 4);
      border-radius: var(--radius-md);
      background: var(--state-preview-color);
      color: white;
      font-weight: var(--font-weight-medium);
    }
  </style>

  Accent: <slot name="#settings.accent"></slot>
</custom-element>

<theme-picker></theme-picker>
<accent-preview></accent-preview>
```

Both components call `defineStore` with the same name, so they share one store. The choice survives a reload in this tab because the store persists to `sessionStorage`.

## Persistence

| `persist` | Where values are saved |
| --- | --- |
| `"local"` | `localStorage`, kept across sessions |
| `"session"` | `sessionStorage`, kept for the tab |
| An adapter | Anything with `get(key)` and `set(key, value)` |

- Values are saved as JSON under the key `realm:<name>` after every change, and restored when the store is defined.
- Types are kept: numbers, booleans, arrays and nested objects come back as they were.
- Getters are never saved or overwritten.
- A stored value that is not valid JSON is ignored with a warning, and the initial values are used.

A custom adapter, for example to namespace keys or add expiry:

```js
const adapter = {
  get: (key) => localStorage.getItem(`myapp:${key}`),
  set: (key, value) => localStorage.setItem(`myapp:${key}`, value),
};

export const prefs = defineStore("prefs", { density: "comfortable" }, { persist: adapter });
```

## Things to know

- A store is defined once per name. Later calls return the existing store and ignore their arguments, so define it in one place.
- Stores are never torn down. Observers you create on a store from inside a component still stop with the component.
- Keep stores for shared data. A value only one component uses belongs in that component's `useState`.
