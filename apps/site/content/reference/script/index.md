---
title: Component script
description: How a REALM component script runs, which names it exposes to markup, the helpers in scope, imports, and the recommended order.
group: Script
order: 40
nav: Component script
---

# Component script

The first `<script>` inside a [`<custom-element>`](/reference/elements/custom-element/) is the component script. It is plain JavaScript in strict mode.

```html
<custom-element name="todo-app">
  <script type="realm">
    const props = defineProps({ title: prop.string().default("Todo") });
    const todo = useState({ items: [], draft: "" });

    function add() {
      todo.items.push({ id: crypto.randomUUID(), title: todo.draft });
      todo.draft = "";
    }

    observe(() => {
      document.title = `${todo.items.length} · ${props.title}`;
    });
  </script>
  …
</custom-element>
```

## How it runs

- Once per element, when the element is first connected, before its markup is created.
- Top-level `const`, `let`, `var`, `function` and `class` declarations (including destructured names) and imported names are **exposed**: markup reads them with `#name.path` and handlers call them by name.
- `refs` is empty while the top level runs. Use [`onConnected`](/reference/script/on-connected/) or [`observe`](/reference/script/observe/) for work that needs the markup.
- Leading `import` statements are hoisted and the script runs as a module. Relative specifiers resolve against the file that holds the definition.
- An error thrown at the top level is logged, and the markup still renders.

## Helpers in scope

These names are available without importing. They are not exposed to markup unless you assign them to a top-level name.

| Group | Helpers |
| --- | --- |
| Props and state | [`defineProps`](/reference/script/define-props/), [`prop`](/reference/script/prop/), [`useState`](/reference/script/use-state/), [`observe`](/reference/script/observe/), [`tick`](/reference/script/tick/), [`defineStore`](/reference/script/define-store/) |
| Element | [`host`](/reference/script/host/), [`refs`](/reference/script/refs/), [`signal`](/reference/script/signal/), [`internals`](/reference/script/internals/), [`attrs`](/reference/script/attrs/), [`useChildren`](/reference/script/use-children/), [`defineMethods`](/reference/script/define-methods/), [`dispatch`](/reference/script/dispatch/), [`listen`](/reference/script/listen/), [`lookup`](/reference/script/lookup/) |
| Timers | [`setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`](/reference/script/timers/) |
| Lifecycle | [`onConnected`](/reference/script/on-connected/), [`onDisconnected`](/reference/script/on-disconnected/), [`onFormReset`](/reference/script/on-form-reset/), [`onFormDisabled`](/reference/script/on-form-disabled/), [`onFormStateRestore`](/reference/script/on-form-state-restore/) |

## Signatures

```ts
defineProps<T extends Record<string, PropType>>(schema: T): Record<keyof T, unknown>
useState<T extends object>(initial: T): T
observe(fn: () => unknown): () => void
tick(): Promise<void>
defineStore<T extends object>(name: string, initial: T, options?: StoreOptions): T
useChildren(selector: string, attributes?: string[]): Element[]
defineMethods(methods: object): void
dispatch(type: string, detail?: unknown, options?: CustomEventInit): boolean
listen(type: string, handler: (event: Event) => unknown, target?: EventTarget): void
lookup(name: string): unknown
onConnected(fn: () => unknown): void
onDisconnected(fn: () => void): void
onFormReset(fn: () => void): void
onFormDisabled(fn: (disabled: boolean) => void): void
onFormStateRestore(fn: (state: unknown, mode: string) => void): void
setTimeout(callback: (...args: unknown[]) => void, delay?: number, ...args: unknown[]): number
setInterval(callback: (...args: unknown[]) => void, delay?: number, ...args: unknown[]): number
clearTimeout(id?: number): void
clearInterval(id?: number): void

attrs: Record<string, string | null>
host: HTMLElement
refs: Record<string, Element>
signal: AbortSignal
internals: ElementInternals
prop: { string, number, boolean, enum, date, array, object }
```

The `Context` type exported by `@realmorg/realm` describes this object.

## Order

Write scripts in this order, so they read the same way across components:

1. `defineProps`
2. `useState` (and `defineStore`)
3. functions
4. `defineMethods`, `listen`, lifecycle hooks
5. `observe`

## Related

- [Component anatomy: helpers available in the script](/docs/components/#helpers-available-in-the-script)
- [Nested components and scope](/docs/scope/)
