---
title: API reference
description: Every REALM export, script helper, tag, attribute, event and CSS hook, with signatures, on one set of reference pages.
group: Reference
order: 1
nav: Overview
---

# API reference

The reference is split by where you use each piece:

| Page | Covers |
| --- | --- |
| [Script helpers](/reference/script/) | Everything available inside a component `<script>`: `defineProps`, `prop`, `useState`, `observe`, `tick`, `defineStore`, `defineMethods`, `dispatch`, `listen`, `attrs`, `useChildren`, lifecycle hooks, `lookup`, `host`, `refs`, `signal`, `internals` |
| [Tags and attributes](/reference/markup/) | `<custom-element>`, `<import-element>`, `<is-visible>`, `<is-hidden>`, `<repeat-list>`, value slots, `_` bindings, `on*` handlers, `ref`, `repeat`, `focusgroup`, `debounce`, `throttle` and the fetch attributes |
| [Events](/reference/events/) | Events REALM fires: request events and `<import-element>` events, plus custom event handler attributes |
| [CSS](/reference/css/) | `realm.css`, `--attr-*` and `--state-*` variables, `:state()` selectors, `:state(loading)` |

## Package exports

`@realmorg/realm` (no side effects) and `@realmorg/realm/auto` (starts REALM on import) export the same names:

| Export | Signature | Purpose |
| --- | --- | --- |
| `start` | `start(): void` | Adopt REALM's page stylesheet, register `<import-element>`, define every inline `<custom-element>` in the page and watch for new ones. Safe to call more than once |
| `useState` | `useState<T extends object>(initial: T): T` | Reactive proxy of a plain object or array |
| `observe` | `observe(fn: () => unknown): () => void` | Run `fn` now and whenever what it read changes; returns a stop function. Not tied to any element when used outside a component |
| `defineStore` | `defineStore<T extends object>(name: string, initial: T, options?: { persist?: "local" \| "session" \| StorageAdapter }): T` | Named, app-wide reactive store, optionally persisted |
| `prop` | `prop.string()`, `prop.number()`, … | The prop type builder. See [Script helpers](/reference/script/#prop) |
| `flush` | `flush(): void` | Apply pending updates synchronously |
| `toRaw` | `toRaw<T>(value: T): T` | The original object behind a reactive proxy |
| `untrack` | `untrack<T>(fn: () => T): T` | Run `fn` without subscribing to what it reads |
| `importDefinitions` | `importDefinitions(url: string): Promise<void>` | Load a file and define every `<custom-element>` in it, sharing requests with `<import-element>` |
| `defineComponent` | `defineComponent(element: Element, base: string, inline: boolean): Promise<void>` | Low-level: define a component from a `<custom-element>` element you already have, resolving relative URLs against `base`. `<import-element>` and `start` use it |

Types: `Context` (the script helpers), `StoreOptions` and `StorageAdapter` (`{ get(key: string): string | null; set(key: string, value: string): void }`).

## Files

| File | Purpose |
| --- | --- |
| `dist/realm.js` | Auto-starting module, for `<script type="module" src>` |
| `dist/index.js` | Module without side effects |
| `dist/realm.css` | Page stylesheet: hides definitions, `<import-element>` and undefined elements; `display: contents` for control-flow tags |

## Console messages

REALM writes warnings and errors to the console with the prefix `[realm]`. Each distinct warning is shown once. Warnings name the component and the attribute or prop involved, for example:

- `<price-tag> prop "amount" must be at least 0. Using the default.`
- `<nav-bar> reads "session" from <app-shell>.`
- `<todo-app> "#todo.itmes" is not defined in this component or its parents.`
- `<todo-app> repeat has a duplicate key "3".`
- `<x-card> is defined twice with different sources (a.html and b.html). Keeping the first.`
