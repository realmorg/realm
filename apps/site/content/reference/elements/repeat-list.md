---
title: "<repeat-list>"
description: The repeat-list tag, which repeats its content for each item of an array, with its attributes and keyed updates.
group: Elements
order: 12
nav: "<repeat-list>"
---

# `<repeat-list>`

Repeats its content once per item of an array. Laid out with `display: contents`, so it adds no box. Used in component markup.

```html
<repeat-list of="#ref" [as="item"] [index="i"] [key="id"]>
  …content per item…
</repeat-list>
```

Inside `<ul>`, `<ol>`, `<table>`, `<tbody>`, `<tr>` and `<select>`, the HTML parser does not allow unknown elements. Use the [`repeat` attribute](/reference/attributes/repeat/) on the item element there.

## Attributes

| Attribute | Type | Default | Meaning |
| --- | --- | --- | --- |
| `of` | [reference](/reference/syntax/) to an array | required | The list. Anything that is not an array renders nothing |
| `as` | name | `item` | Variable name for the current item |
| `index` | name | none | Variable name for the current position (0-based). Only defined when set |
| `key` | property name | position | Property of each item that identifies it between updates |

## Inside each copy

- `#item.title`, `#i` work in value slots, `_` bindings, `<is-visible>` and nested lists.
- `item` and `i` are variables in handler code: `onclick="remove(item)"`.
- Every other name still resolves to the component script, so `#todo.filter` works inside the loop.
- Loops nest. An inner loop can read the outer loop's variables.

## Keys

With `key`, items are matched by that property when the array changes:

| Change | Result |
| --- | --- |
| Item still present | Its nodes are kept and updated in place. Focus, typed text and transitions survive |
| Item moved | Its nodes are moved, not re-created |
| Item removed | Its nodes are removed and its listeners, observers and requests stop |
| New item | New nodes are created |

Without `key`, items are matched by position. A duplicate key logs `repeat has a duplicate key "…"` and the duplicate gets its own row.

## Example

```html live
<custom-element name="fruit-list">
  <script type="realm">
    const basket = useState({
      next: 4,
      items: [
        { id: 1, name: "Apple" },
        { id: 2, name: "Banana" },
        { id: 3, name: "Cherry" },
      ],
    });

    function add() {
      basket.items.unshift({ id: basket.next, name: `Fruit ${basket.next}` });
      basket.next++;
    }

    function remove(fruit) {
      basket.items = basket.items.filter((item) => item.id !== fruit.id);
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      justify-items: start;
    }
    p {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 2);
      margin: 0;
    }
  </style>

  <ui-button onclick="add()">Add to top</ui-button>
  <repeat-list of="#basket.items" as="fruit" index="i" key="id">
    <p>
      <slot name="#i"></slot>.
      <slot name="#fruit.name"></slot>
      <ui-button variant="ghost" size="sm" onclick="remove(fruit)">Remove</ui-button>
    </p>
  </repeat-list>
</custom-element>

<fruit-list></fruit-list>
```

## Related

- [Lists and keys](/docs/lists/)
- [`repeat` attribute](/reference/attributes/repeat/)
