---
title: "<is-visible>"
description: The is-visible tag, which mounts its content while a reference is truthy or matches a comparison (eq, neq, gt, gte, lt, lte, contains).
group: Elements
order: 13
nav: "<is-visible>"
---

# `<is-visible>`

Mounts its content while a condition is true and removes it while it is false. Laid out with `display: contents`. Used in component markup. [`<is-hidden>`](/reference/elements/is-hidden/) is the inverse.

```html
<is-visible when="#ref" [eq|neq|gt|gte|lt|lte|contains="value"]>
  …content…
</is-visible>
```

## Attributes

| Attribute | Type | Meaning |
| --- | --- | --- |
| `when` | [reference](/reference/syntax/) | The value to test. Required. Without a comparison, the condition is "truthy" |
| `eq` | text | `String(value) === eq` |
| `neq` | text | `String(value) !== neq` |
| `gt` | number | `Number(value) > Number(gt)` |
| `gte` | number | `Number(value) >= Number(gte)` |
| `lt` | number | `Number(value) < Number(lt)` |
| `lte` | number | `Number(value) <= Number(lte)` |
| `contains` | text | An array has an item whose `String(item)` equals the text, or a string includes the text |

Use at most one comparison attribute. If there are several, the first in the order above is used.

## Mounting

- While the condition is false, the content is not in the DOM. Its bindings, handlers, observers and requests do not exist.
- When it becomes true, the content is created fresh. When it becomes false again, the content is removed and everything inside it stops.
- To keep content in the DOM and only hide it, bind `hidden` instead: `<div _hidden="!#panel.open">`.

## Example

```html live
<custom-element name="stock-level">
  <script type="realm">
    const stock = useState({ count: 3 });
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      justify-items: start;
    }
  </style>

  <ui-button onclick="stock.count = (stock.count + 1) % 6">Count: <slot name="#stock.count"></slot></ui-button>
  <is-visible when="#stock.count" eq="0"><p>Sold out.</p></is-visible>
  <is-visible when="#stock.count" lte="2"><p>Only a few left.</p></is-visible>
  <is-visible when="#stock.count" gt="2"><p>In stock.</p></is-visible>
</custom-element>

<stock-level></stock-level>
```

## Related

- [Control flow](/docs/control-flow/)
- [`<is-hidden>`](/reference/elements/is-hidden/)
