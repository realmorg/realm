---
title: onConnected
description: Reference for onConnected, which runs a function once a component's markup is connected and refs are filled, with an optional cleanup.
group: Lifecycle hooks
order: 70
nav: onConnected
---

# `onConnected`

Runs a function after the component's markup is in its shadow root and [`refs`](/reference/script/refs/) are filled.

```ts
onConnected(fn: () => unknown): void
```

```js
onConnected(() => {
  const chart = new Chart(refs.canvas, config);
  return () => chart.destroy();
});
```

## Parameters

| Parameter | Type | Meaning |
| --- | --- | --- |
| `fn` | `() => unknown` | Runs once, after the first connection. If it returns a function, that function runs when the element is removed |

## Order on connection

1. The script runs (`defineProps`, `useState`, …).
2. Reactive CSS is bound.
3. The markup is cloned, bound and appended to the shadow root, and `refs` fill.
4. A delegated `ref="control"` is wired up.
5. The parent's [`useChildren`](/reference/script/use-children/) arrays refresh.
6. `onConnected` hooks run in the order they were registered.

Moving the element does not run the hooks again. It keeps its state.

## Example

```html live
<custom-element name="auto-focus">
  <script type="realm">
    onConnected(() => {
      refs.field.placeholder = "Filled in by onConnected";
    });
  </script>

  <input ref="field" aria-label="Example field">
</custom-element>

<auto-focus></auto-focus>
```

## Related

- [Lifecycle](/docs/lifecycle/)
