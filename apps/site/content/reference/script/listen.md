---
title: listen
description: Reference for listen, which adds an event listener on the host or another target that is removed with the element.
group: "Script: element"
order: 58
nav: listen
---

# `listen`

Adds an event listener that is removed when the element is removed.

```ts
listen(type: string, handler: (event: Event) => unknown, target?: EventTarget): void
```

```js
listen("keydown", onKey);
listen("resize", layout, window);
listen("visibilitychange", pause, document);
```

## Parameters

| Parameter | Type | Default | Meaning |
| --- | --- | --- | --- |
| `type` | `string` | required | Event name |
| `handler` | `(event) => unknown` | required | Listener |
| `target` | `EventTarget` | `host` | Where to listen |

Same as `target.addEventListener(type, handler, { signal })` with the element's [`signal`](/reference/script/signal/). The return value of `handler` is ignored (use `event.preventDefault()` to cancel).

## Example

```html live
<custom-element name="key-display">
  <script type="realm">
    const keys = useState({ last: "" });

    listen("keydown", (event) => {
      keys.last = event.key;
    }, window);
  </script>

  <p>Last key pressed anywhere: <kbd><slot name="#keys.last">none</slot></kbd></p>
</custom-element>

<key-display></key-display>
```

## Related

- [Events: listening from the script](/docs/events/#listening-from-the-script)
