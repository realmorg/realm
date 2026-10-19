---
title: Script helpers
description: Signatures and behaviour of every helper available in a REALM component script, from defineProps and the prop builder to useState, observe, dispatch, listen and the lifecycle hooks.
group: Reference
order: 2
nav: Script helpers
---

# Script helpers

These names are in scope in every component `<script>` without importing. The script runs once per element, when it connects. Write scripts in this order: `defineProps`, `useState`, functions, then `defineMethods`, `listen`, lifecycle hooks and `observe`.

## defineProps

```ts
defineProps<T extends Record<string, PropType>>(schema: T): Record<keyof T, unknown>
```

Declares the component's props and returns a reactive object of their current values. Each key becomes a property on the element and an attribute (camelCase keys map to kebab-case attributes). Attribute and property changes are validated; invalid values log a warning and fall back to the default. Writing a declared prop on the returned object validates it and reflects it if `.reflect()` is set; writing an undeclared name warns. Call it at most once. In a `form-associated` component, `props.disabled` is also `true` while a surrounding fieldset is disabled.

See [Props](/docs/props/).

## prop

| Builder | Value type | Attribute text conversion |
| --- | --- | --- |
| `prop.string()` | `string` | As-is |
| `prop.number()` | `number` | `Number(text)`; empty text is invalid |
| `prop.boolean()` | `boolean` | Present is `true`, absent is `false` |
| `prop.enum(values: string[])` | one of `values` | As-is, then checked |
| `prop.date()` | `Date` | `new Date(text)` |
| `prop.array(item?: PropType)` | `unknown[]` | `JSON.parse(text)`, items checked with `item` |
| `prop.object(shape?: Record<string, PropType>)` | `object` | `JSON.parse(text)`, keys checked with `shape` |

Modifiers return a new type and can be chained:

| Modifier | Applies to | Meaning |
| --- | --- | --- |
| `.default(value)` | all | Value when missing or invalid. Objects and arrays are cloned per instance |
| `.required()` | all | Missing values warn |
| `.optional()` | all | Missing values are `undefined` (the default behaviour, stated explicitly) |
| `.reflect()` | all | Property writes update the attribute |
| `.attribute(name: string)` | all | Use another attribute name |
| `.min(n)`, `.max(n)` | string (length), number | Range |
| `.int()` | number | Must be an integer |
| `.pattern(regex: RegExp)` | string | Must match |
| `.email()`, `.url()` | string | Must be an email address or a parseable URL |

## useState

```ts
useState<T extends object>(initial: T): T
```

Returns a deep reactive proxy. Plain objects and arrays are tracked, including added and deleted keys, array mutation methods and `length`. Getters are cached derived values; setters run with the proxy as `this`. Other objects (`Map`, `Set`, `Date`, class instances) are returned unchanged. The same object always gives the same proxy. See [State and reactivity](/docs/state/).

## observe

```ts
observe(fn: () => unknown): () => void
```

Runs `fn` immediately and again after any value it read changes (batched per microtask). If `fn` returns a function, it runs before the next run and when the observer stops. Returns a stop function. Stops automatically when the element is removed. Errors are reported without stopping other observers; an observer that re-triggers itself 100 times in one flush is stopped with an error.

## tick

```ts
tick(): Promise<void>
```

Resolves after pending updates have been applied to the DOM.

## defineStore

```ts
defineStore<T extends object>(name: string, initial: T, options?: { persist?: "local" | "session" | StorageAdapter }): T
```

Returns the reactive store called `name`, creating it from `initial` on first call. Later calls with the same name return the same store and ignore their arguments. With `persist`, data fields are saved as JSON under `realm:<name>` after every change and restored on creation; getters are not saved. See [Stores](/docs/stores/).

## defineMethods

```ts
defineMethods(methods: object): void
```

Copies the methods, getters and setters of `methods` onto the element, so outside code can call `element.method()`. They are removed when the element is torn down.

## dispatch

```ts
dispatch(type: string, detail?: unknown, options?: CustomEventInit): boolean
```

Dispatches a `CustomEvent` from the host with `bubbles: true`, `composed: true` and `cancelable: true` unless `options` overrides them. Returns `false` if a listener called `preventDefault()`.

Parent components handle the event with `on<type>` in their markup. For `on<type>` attributes on plain pages, REALM recognises event names written as `new CustomEvent("type"` or `new Event("type"` in the script.

## listen

```ts
listen(type: string, handler: (event: Event) => unknown, target?: EventTarget): void
```

`target.addEventListener(type, handler)` with the element's `signal`, so the listener is removed when the element is. `target` defaults to the host.

## attrs

```ts
attrs: Record<string, string | null>
```

Reactive access to any attribute on the host, declared or not. Reading returns the attribute's text or `null` and subscribes to changes. Writing `null`, `undefined` or `false` removes the attribute, `true` sets it empty, anything else is written as text.

```js
const view = useState({
  get compact() {
    return attrs.density === "compact";
  },
});
attrs.tabindex ??= 0;
```

## useChildren

```ts
useChildren(selector: string, attributes?: string[]): Element[]
```

A reactive array of the host's direct light DOM children that match `selector`. It updates when children are added, removed or their text changes, when one of the listed `attributes` changes on a descendant, and when a child component finishes mounting, so you can read its props. Used by components that take `<option>` elements or items as children.

```js
const options = useChildren("option", ["value", "label", "disabled"]);
const menu = useState({
  get items() {
    return options.map((option) => ({ value: option.value, label: option.label }));
  },
});
```

## onConnected

```ts
onConnected(fn: () => unknown): void
```

Runs `fn` after the markup is connected and `refs` are filled. If `fn` returns a function, it runs when the element is removed.

## onDisconnected

```ts
onDisconnected(fn: () => void): void
```

Runs `fn` when the element is removed (not when it is moved), before its signal aborts.

## onFormReset, onFormDisabled, onFormStateRestore

```ts
onFormReset(fn: () => void): void
onFormDisabled(fn: (disabled: boolean) => void): void
onFormStateRestore(fn: (state: unknown, mode: string) => void): void
```

Form-associated lifecycle callbacks, for components defined with `form-associated`. See [Forms](/docs/forms/).

## lookup

```ts
lookup(name: string): unknown
```

Returns `name` from the nearest parent component that defines it, or from `globalThis`. Handlers use the same lookup for names the script does not define.

## host

```ts
host: HTMLElement
```

The element itself.

## refs

```ts
refs: Record<string, Element>
```

Elements with a `ref="name"` attribute in the component's markup, keyed by name. Reactive: empty while the script's top level runs, filled once the markup is connected.

## signal

```ts
signal: AbortSignal
```

Aborts when the element is removed. Pass it to `fetch`, `addEventListener` and anything else that accepts a signal.

## internals

```ts
internals: ElementInternals
```

The element's `ElementInternals`: `states` for `:state()` CSS, `role` and ARIA properties, and for form-associated components `setFormValue`, `setValidity`, `form`, `labels`, `validity`.
