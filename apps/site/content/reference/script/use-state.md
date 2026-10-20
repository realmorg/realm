---
title: useState
description: Reference for useState, which returns a deep reactive proxy of a plain object or array, with getters as cached derived values and batched updates.
group: Script
order: 43
nav: useState
---

# `useState`

Returns a deep reactive proxy of a plain object or array. Also exported from `@realmorg/realm` for use outside components.

```ts
useState<T extends object>(initial: T): T
```

```js
const todo = useState({
  items: [],
  filter: "all",
  get remaining() {
    return this.items.filter((item) => !item.done).length;
  },
});
```

## Parameters

| Parameter | Type | Meaning |
| --- | --- | --- |
| `initial` | plain object or array | The object to track. It is not copied: the proxy reads and writes it |

Returns the proxy. Write to it directly: `todo.filter = "done"`, `todo.items.push(item)`.

## What is tracked

| Operation | Tracked |
| --- | --- |
| Reading and writing properties | yes, per property |
| Adding and deleting keys, `in`, `Object.keys`, `for…in` | yes |
| Nested plain objects and arrays | yes, wrapped lazily when read |
| Array index writes, `length`, `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin` | yes |
| `includes`, `indexOf`, `lastIndexOf` | yes, and they find both raw and proxied members |
| `Map`, `Set`, `Date`, class instances | no. They are returned unchanged |

Writing the same value (`Object.is`) does not notify.

## Getters and setters

- A getter is a **cached derived value**. It recomputes only after something it read changes, and only when read again.
- A setter runs with the proxy as `this`, so writes inside it are tracked.
- A getter that throws reports the error to whoever reads it, and recovers on the next change.

## Identity

- The same object always gives the same proxy. `useState(useState(x))` returns the proxy unchanged.
- [`toRaw(proxy)`](/reference/javascript/to-raw/) returns the original object.

## Batching

Changes are collected and applied once per microtask, so several writes in a handler cause one update. [`tick()`](/reference/script/tick/) waits for that update. [`flush()`](/reference/javascript/flush/) applies it synchronously.

## Example

```html live
<custom-element name="todo-mini">
  <script type="realm">
    const todo = useState({
      draft: "",
      items: [{ id: 1, title: "Read the reference", done: true }],
      get remaining() {
        return this.items.filter((item) => !item.done).length;
      },
    });

    function add() {
      if (!todo.draft.trim()) return;
      todo.items.push({ id: Date.now(), title: todo.draft, done: false });
      todo.draft = "";
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      width: min(calc(var(--spacing) * 100), 100%);
    }
    form {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
    label {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
  </style>

  <form onsubmit="add(); return false">
    <input aria-label="New task" _value="#todo.draft" oninput="todo.draft = this.value">
    <ui-button type="submit">Add</ui-button>
  </form>
  <div>
    <label repeat="#todo.items" as="item" key="id">
      <input type="checkbox" _checked="#item.done" onchange="item.done = this.checked">
      <slot name="#item.title"></slot>
    </label>
  </div>
  <p><slot name="#todo.remaining"></slot> remaining</p>
</custom-element>

<todo-mini></todo-mini>
```

## Related

- [State and reactivity](/docs/state/)
- [`observe`](/reference/script/observe/)
