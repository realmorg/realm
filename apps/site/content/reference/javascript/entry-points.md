---
title: Entry points
description: Reference for the REALM package files and module entry points (realm.js, index.js, compiler.js, realm.css) and every name they export.
group: JavaScript API
order: 100
nav: Entry points
---

# Entry points

REALM ships as ES modules. Load them from realm.js.org. To pin an exact version in production, load the npm package instead (see [Pin a version](/docs/installation/#pin-a-version)).

| File | Package export | Purpose |
| --- | --- | --- |
| `https://realm.js.org/dist/realm.js` | `@realmorg/realm/auto` | Calls [`start()`](/reference/javascript/start/) when it loads, and exports the API |
| `https://realm.js.org/dist/index.js` | `@realmorg/realm` | The same API without starting. No side effects |
| `https://realm.js.org/dist/compiler.js` | `@realmorg/realm/compiler` | Build-time helpers. See [Compiler](/reference/javascript/compiler/) |
| `https://realm.js.org/dist/realm.css` | `@realmorg/realm/realm.css` | The page stylesheet. See [realm.css](/reference/css/realm-css/) |

`realm.js` and `index.js` share one runtime chunk, so a page that starts REALM with `realm.js` and a module that imports from `index.js` (same version) use the same stores and definitions.

## Starting REALM

```html
<link rel="stylesheet" href="https://realm.js.org/dist/realm.css">
<script type="module" src="https://realm.js.org/dist/realm.js"></script>
```

Or start it yourself after other setup:

```html
<script type="module">
  import { start } from "https://realm.js.org/dist/index.js";

  start();
</script>
```

## Exports

`realm.js` and `index.js` export the same names:

| Export | Signature | Page |
| --- | --- | --- |
| `start` | `start(): void` | [start](/reference/javascript/start/) |
| `importDefinitions` | `importDefinitions(url: string): Promise<void>` | [importDefinitions](/reference/javascript/import-definitions/) |
| `defineComponent` | `defineComponent(element: Element, base: string, inline: boolean): Promise<void>` | [defineComponent](/reference/javascript/define-component/) |
| `useState` | `useState<T extends object>(initial: T): T` | [useState](/reference/script/use-state/) |
| `observe` | `observe(fn: () => unknown): () => void` | [observe](/reference/script/observe/). Not tied to an element when imported |
| `defineStore` | `defineStore<T extends object>(name: string, initial: T, options?: StoreOptions): T` | [defineStore](/reference/script/define-store/) |
| `prop` | `{ string, number, boolean, enum, date, array, object }` | [prop](/reference/script/prop/) |
| `flush` | `flush(): void` | [flush](/reference/javascript/flush/) |
| `toRaw` | `toRaw<T>(value: T): T` | [toRaw](/reference/javascript/to-raw/) |
| `untrack` | `untrack<T>(fn: () => T): T` | [untrack](/reference/javascript/untrack/) |

Types (for TypeScript users of the package): `Context` (the [script helpers](/reference/script/)), `StoreOptions` and `StorageAdapter`.

## Bare specifiers in component scripts

A component script that writes `import { defineStore } from "@realmorg/realm"` needs an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap). Point it at the file the page uses to start REALM:

```html
<script type="importmap">
  { "imports": { "@realmorg/realm": "https://realm.js.org/dist/realm.js" } }
</script>
```

## Related

- [Installation](/docs/installation/)
