---
title: refs
description: Reference for refs, the reactive object of elements named with the ref attribute in a component's markup.
group: "Script: element"
order: 51
nav: refs
---

# `refs`

Elements with a [`ref="name"`](/reference/attributes/ref/) attribute in the component's markup, keyed by name.

```ts
refs: Record<string, Element>
```

```html
<canvas ref="chart"></canvas>
```

```js
onConnected(() => {
  const context = refs.chart.getContext("2d");
});
```

## Behaviour

| Topic | Detail |
| --- | --- |
| Timing | Empty while the script's top level runs. Filled as the markup is processed, before `onConnected` hooks |
| Reactive | `refs` is a reactive object, so an [`observe`](/reference/script/observe/) that reads `refs.chart` runs again once the element exists |
| Loops and conditions | Elements inside `repeat` or `<is-visible>` are added when they are mounted. The last mounted element with a name wins, and removed content is not taken out |
| `ref="control"` | Also makes the element the delegated form control in `form-associated` components. See [`ref`](/reference/attributes/ref/#ref-control) |

## Example

```html live
<custom-element name="draw-dot">
  <script type="realm">
    function draw(event) {
      const canvas = refs.canvas;
      const box = canvas.getBoundingClientRect();
      const context = canvas.getContext("2d");
      context.fillStyle = getComputedStyle(host).color;
      context.beginPath();
      context.arc(event.clientX - box.left, event.clientY - box.top, 4, 0, Math.PI * 2);
      context.fill();
    }
  </script>

  <style type="realm">
    canvas {
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      cursor: crosshair;
    }
  </style>

  <canvas ref="canvas" width="240" height="120" onclick="draw(event)"></canvas>
</custom-element>

<draw-dot></draw-dot>
```

## Related

- [`ref` attribute](/reference/attributes/ref/)
