---
title: onDisconnected
description: Reference for onDisconnected, which runs a function when a component element is removed from the document.
group: Lifecycle hooks
order: 71
nav: onDisconnected
---

# `onDisconnected`

Runs a function when the element is removed.

```ts
onDisconnected(fn: () => void): void
```

```js
onDisconnected(() => {
  socket.close();
});
```

## Parameters

| Parameter | Type | Meaning |
| --- | --- | --- |
| `fn` | `() => void` | Runs once when the element is removed |

## Order on removal

REALM waits one microtask after `disconnectedCallback`. If the element is connected again by then (it was moved), nothing happens. Otherwise:

1. `onDisconnected` hooks run in the order they were registered.
2. [`signal`](/reference/script/signal/) aborts: listeners, requests, timers and debounced calls stop.
3. Observers stop, cleanups returned from `onConnected` and `observe` run, prop accessors and [`defineMethods`](/reference/script/define-methods/) are removed.
4. The shadow root is emptied.

Adding the element again later creates a fresh instance: the script runs again.

## Example

```html live
<custom-element name="goodbye-note">
  <script type="realm">
    onDisconnected(() => {
      document.getElementById("goodbye-log").value = `Removed at ${new Date().toLocaleTimeString()}`;
    });
  </script>

  <p>I will log when I am removed.</p>
</custom-element>

<custom-element name="goodbye-host">
  <script type="realm">
    const view = useState({ shown: true });
  </script>

  <is-visible when="#view.shown"><goodbye-note></goodbye-note></is-visible>
  <ui-button variant="outline" onclick="view.shown = !view.shown">Toggle the note</ui-button>
</custom-element>

<goodbye-host></goodbye-host>
<output id="goodbye-log">Not removed yet.</output>
```

## Related

- [Lifecycle: when an element is removed](/docs/lifecycle/#when-an-element-is-removed)
