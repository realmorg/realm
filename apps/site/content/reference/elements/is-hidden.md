---
title: "<is-hidden>"
description: The is-hidden tag, which mounts its content while a reference is falsy or does not match a comparison.
group: Elements
order: 14
nav: "<is-hidden>"
---

# `<is-hidden>`

The inverse of [`<is-visible>`](/reference/elements/is-visible/). It mounts its content while the condition is **false**. Laid out with `display: contents`. Used in component markup.

```html
<is-hidden when="#ref" [eq|neq|gt|gte|lt|lte|contains="value"]>
  …content…
</is-hidden>
```

## Attributes

The same as `<is-visible>`. The condition is evaluated the same way and the result is inverted.

| Attribute | Type | Content is mounted when |
| --- | --- | --- |
| `when` | [reference](/reference/syntax/) | Required. Alone: the value is falsy |
| `eq` | text | `String(value) !== eq` |
| `neq` | text | `String(value) === neq` |
| `gt` | number | not `Number(value) > Number(gt)` |
| `gte` | number | not `Number(value) >= Number(gte)` |
| `lt` | number | not `Number(value) < Number(lt)` |
| `lte` | number | not `Number(value) <= Number(lte)` |
| `contains` | text | The array or string does not contain the text |

`<is-hidden when="#x">` is the same as `<is-visible when="!#x">`. Use whichever reads better.

## Example

```html live
<custom-element name="todo-empty">
  <script type="realm">
    const todo = useState({ items: [] });

    function add() {
      todo.items.push(`Task ${todo.items.length + 1}`);
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      justify-items: start;
    }
  </style>

  <ui-button onclick="add()">Add task</ui-button>
  <is-hidden when="#todo.items.length"><p>Nothing to do.</p></is-hidden>
  <is-hidden when="#todo.items.length" lt="3"><p>That is a lot of tasks.</p></is-hidden>
</custom-element>

<todo-empty></todo-empty>
```

## Related

- [Control flow](/docs/control-flow/)
