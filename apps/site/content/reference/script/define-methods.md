---
title: defineMethods
description: Reference for defineMethods, which exposes methods, getters and setters on the component element for outside code.
group: "Script: element"
order: 56
nav: defineMethods
---

# `defineMethods`

Copies methods, getters and setters onto the element, so outside code can call `element.method()`.

```ts
defineMethods(methods: object): void
```

```js
defineMethods({
  open() {
    panel.open = true;
  },
  close() {
    panel.open = false;
  },
  get isOpen() {
    return panel.open;
  },
});
```

## Parameters

| Parameter | Type | Meaning |
| --- | --- | --- |
| `methods` | object | Every own property (including getters and setters) is defined on the element with the same descriptor, made configurable |

The properties are removed when the element is removed. Call `defineMethods` after your functions and before lifecycle hooks.

## Example

```html live
<custom-element name="step-counter">
  <script type="realm">
    const counter = useState({ value: 0 });

    defineMethods({
      increment() {
        counter.value++;
      },
      get value() {
        return counter.value;
      },
    });
  </script>

  <p>Value: <slot name="#counter.value"></slot></p>
</custom-element>

<step-counter id="steps"></step-counter>
<ui-button variant="outline" onclick="document.getElementById('steps').increment()">Call steps.increment()</ui-button>
```

## Related

- [Events: public methods](/docs/events/#public-methods)
