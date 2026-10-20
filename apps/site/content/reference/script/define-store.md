---
title: defineStore
description: Reference for defineStore, which creates or returns an app-wide named reactive store, optionally persisted to localStorage, sessionStorage or a custom adapter.
group: Script
order: 46
nav: defineStore
---

# `defineStore`

Returns the app-wide reactive store called `name`, creating it on the first call. Available in every script and exported from `@realmorg/realm`.

```ts
defineStore<T extends object>(name: string, initial: T, options?: StoreOptions): T

interface StoreOptions {
  persist?: "local" | "session" | StorageAdapter;
}

interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
}
```

```js
const cart = defineStore("cart", {
  items: [],
  get count() {
    return this.items.length;
  },
}, { persist: "local" });
```

## Parameters

| Parameter | Type | Default | Meaning |
| --- | --- | --- | --- |
| `name` | `string` | required | Store name, shared by the whole page |
| `initial` | plain object | required | Initial state. Used only on the first call for this name |
| `options.persist` | `"local"`, `"session"` or `StorageAdapter` | none | Save the store after every change and restore it on creation |

Returns the same reactive proxy for every call with the same `name`. Later calls ignore `initial` and `options`.

## Persistence

| Topic | Behaviour |
| --- | --- |
| Key | `realm:<name>` |
| Format | `JSON.stringify(store)`, written once on creation and again after every change (batched per microtask) |
| Restore | On creation, each saved field that is a data property of `initial` is written to the store. Getter values are ignored |
| Corrupt data | Logs `Stored value for store "name" is not valid JSON and was ignored.` and keeps `initial` |
| `"local"` / `"session"` | `localStorage` / `sessionStorage` |
| Custom adapter | Any object with synchronous `get(key)` and `set(key, value)`, for example one backed by cookies or an in-memory `Map` |

## Sharing a store

Two components that call `defineStore("cart", …)` get the same object. To share one definition, put it in a module and import it:

```js
// cart.js
import { defineStore } from "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/index.js";

export const cart = defineStore("cart", { items: [] }, { persist: "local" });
```

Use the same version for `index.js` (or `realm.js`) as the page uses to start REALM. Both files load the same runtime chunk, so the store is shared.

## Example

```html live
<custom-element name="store-add">
  <script type="realm">
    const basket = defineStore("reference-basket", { items: [] });

    function add() {
      basket.items.push(`Item ${basket.items.length + 1}`);
    }
  </script>

  <ui-button onclick="add()">Add an item</ui-button>
</custom-element>

<custom-element name="store-count">
  <script type="realm">
    const basket = defineStore("reference-basket", { items: [] });
  </script>

  <p>The basket holds <slot name="#basket.items.length"></slot> items.</p>
</custom-element>

<store-add></store-add>
<store-count></store-count>
```

## Related

- [Stores](/docs/stores/)
