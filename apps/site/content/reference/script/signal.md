---
title: signal
description: Reference for signal, the AbortSignal that aborts when a component element is removed.
group: "Script: element"
order: 52
nav: signal
---

# `signal`

An `AbortSignal` that aborts when the element is removed (not when it is moved).

```ts
signal: AbortSignal
```

```js
fetch(`/api/users/${props.id}`, { signal })
  .then((response) => response.json())
  .then((user) => (profile.user = user));

window.addEventListener("resize", layout, { signal });
```

## Behaviour

| Topic | Detail |
| --- | --- |
| When it aborts | After [`onDisconnected`](/reference/script/on-disconnected/) hooks run, when the element is removed |
| What else uses it | [`listen`](/reference/script/listen/), handler attributes, fetch attributes and the [element-bound timers](/reference/script/timers/) |
| Use it for | `fetch`, `addEventListener` on other targets, `AbortSignal.any`, and any API that accepts a signal |

## Example

```html live
<custom-element name="pointer-tracker">
  <script type="realm">
    const pointer = useState({ x: 0, y: 0 });

    document.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    }, { signal });
  </script>

  <p>Pointer: <slot name="#pointer.x"></slot>, <slot name="#pointer.y"></slot></p>
</custom-element>

<pointer-tracker></pointer-tracker>
```

The document listener is removed when `<pointer-tracker>` is removed.

## Related

- [Lifecycle: signal](/docs/lifecycle/#signal)
