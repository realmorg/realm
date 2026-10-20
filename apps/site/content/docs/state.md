---
title: State and reactivity
description: Create reactive state with useState, derive values with getters, run side effects with observe, and wait for the DOM with tick.
group: Core concepts
order: 12
nav: State and reactivity
---

# State and reactivity

REALM's reactivity has three pieces: `useState` for state, getters for derived values, and `observe` for side effects. There is no dependency list anywhere. REALM records what each binding, getter and observer reads, and re-runs only those when the values change.

## useState

`useState(object)` returns a reactive proxy of the object. Reading a property inside a slot, binding, getter or observer subscribes to it. Writing it notifies them.

```js
const todo = useState({
  items: [],
  draft: "",
  filter: "all",
});

todo.draft = "Buy milk"; // updates every slot and binding that reads todo.draft
todo.items.push({ id: 1, text: "Buy milk", done: false });
todo.items[0].done = true; // nested objects are reactive too
delete todo.filter; // added and deleted keys are tracked
```

- Nested plain objects and arrays become reactive when you read them.
- Array methods that change the array (`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`), index writes and `length` writes all notify.
- `includes`, `indexOf` and `lastIndexOf` find items whether you pass the reactive item or the original object.
- Writing the same value again does nothing.
- Only plain objects and arrays are made reactive. `Map`, `Set`, `Date` and class instances are stored as they are: replace them to trigger an update.
- `useState` called twice with the same object returns the same proxy.

Plain variables are not reactive. `let count = 0` followed by `count++` changes a variable that nothing observes, so the page does not update. Put anything the markup shows into `useState`.

## Getters are derived values

A getter on a state object is a cached derived value. It computes on first read, then only again after something it read has changed.

```js
const cart = useState({
  items: [],
  get total() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
  get totalLabel() {
    return `$${this.total.toFixed(2)}`;
  },
  get isEmpty() {
    return this.items.length === 0;
  },
});
```

Markup only holds references, so getters are where comparisons and formatting go:

```html
<p _hidden="#cart.isEmpty">Total: <slot name="#cart.totalLabel"></slot></p>
```

Getters can read props, other state objects and stores. When two getters share an input, observers still run once and never see a stale value. A setter on a state object runs with the proxy as `this`, so its writes are reactive. A getter that throws reports the error and recovers on the next change.

## Updates are batched

Changes are collected and applied once per microtask. Five writes in a row cause one update of each affected binding:

```js
function reset() {
  form.name = "";
  form.email = "";
  form.message = "";
  form.sent = false;
}
```

## observe

`observe(fn)` runs `fn` now, and again whenever anything it read changes. It returns a function that stops it. In a component script, observers stop automatically when the element is removed.

If `fn` returns a function, that function runs before the next run and when the observer stops. Use it to undo what the run started:

```html live
<custom-element name="stop-watch">
  <script type="realm">
    const props = defineProps({ interval: prop.number().min(10).default(100) });

    const watch = useState({
      elapsed: 0,
      running: false,
      get seconds() {
        return (this.elapsed * props.interval / 1000).toFixed(1);
      },
      get action() {
        return this.running ? "Stop" : "Start";
      },
    });

    function toggle() {
      watch.running = !watch.running;
    }

    function reset() {
      watch.elapsed = 0;
    }

    observe(() => {
      if (!watch.running) return;
      const id = setInterval(() => watch.elapsed++, props.interval);
      return () => clearInterval(id);
    });
  </script>

  <style type="realm">
    :host {
      display: inline-flex;
      gap: calc(var(--spacing) * 2);
      align-items: center;
      font-variant-numeric: tabular-nums;
    }
    output {
      min-width: calc(var(--spacing) * 16);
      font-size: var(--text-2xl);
      font-weight: var(--font-weight-semibold);
    }
  </style>

  <output><slot name="#watch.seconds"></slot>s</output>
  <ui-button onclick="toggle()"><slot name="#watch.action"></slot></ui-button>
  <ui-button variant="outline" onclick="reset()">Reset</ui-button>
</custom-element>

<stop-watch></stop-watch>
```

The observer reads `watch.running` and `props.interval`. When either changes, the previous interval is cleared by the returned function and a new run decides whether to start another. Removing the element stops it.

Things to know:

- An observer that throws is reported and does not stop other observers.
- An observer that keeps changing a value it also reads is stopped after 100 rounds, with an "Update loop detected" error.
- Observers inside observers keep their own dependencies.
- Put observers last in the script, after the functions they use.

### Why not an effect with a dependency array

`observe` has no list to keep in sync with the code, and it does not run after every render, because there are no renders. It runs once, then only when something it actually read has changed.

## Reading without subscribing

`untrack(fn)` runs `fn` without subscribing the current observer to what it reads. `toRaw(proxy)` returns the original object behind a reactive proxy, which is useful before handing data to `structuredClone` or `JSON.stringify` in hot paths. Both are exported from `@realmorg/realm`:

```js
import { toRaw, untrack } from "@realmorg/realm";
```

## tick

Updates are applied in a microtask, so right after a state change the DOM still shows the old value. `await tick()` waits until pending updates have been applied:

```js
async function edit(item) {
  item.editing = true;
  await tick();
  refs.editor.focus();
}
```

`flush()`, exported from the package, applies pending updates synchronously. You rarely need it outside tests.

## Using state outside components

`useState` and `observe` are also exported from `@realmorg/realm` for use in plain modules. Observers created there are not tied to any element, so stop them yourself with the function `observe` returns. For state shared between components, use a [store](/docs/stores/).
