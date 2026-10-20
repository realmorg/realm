---
title: repeat
description: The repeat attribute, which repeats an element once per array item inside lists, tables and selects.
group: Attributes
order: 24
nav: repeat
---

# `repeat`

Repeats the element it is on once per item of an array. It does the same job as [`<repeat-list>`](/reference/elements/repeat-list/) without a wrapper, so it works where the HTML parser only allows certain children: `<ul>`, `<ol>`, `<table>`, `<tbody>`, `<tr>`, `<select>`, `<datalist>`. Used in component markup.

```html
<li repeat="#ref" [as="item"] [index="i"] [key="id"]>…</li>
```

## Attributes

| Attribute | Type | Default | Meaning |
| --- | --- | --- | --- |
| `repeat` | [reference](/reference/syntax/) to an array | required | The list. Anything that is not an array renders nothing |
| `as` | name | `item` | Variable name for the current item |
| `index` | name | none | Variable name for the current position |
| `key` | property name | position | Property that identifies each item between updates |

The four attributes are removed from the copies. Everything else on the element, including `_` bindings and `on…` handlers, is applied to each copy with the loop variables in scope. Keys work as described on [`<repeat-list>`](/reference/elements/repeat-list/#keys).

The original element is replaced by an empty comment that marks where the copies go.

## Example

```html live
<custom-element name="score-table">
  <script type="realm">
    const board = useState({
      rows: [
        { id: "a", name: "Ana", score: 12 },
        { id: "b", name: "Ben", score: 9 },
        { id: "c", name: "Chi", score: 15 },
      ],
    });

    function sort() {
      board.rows.sort((a, b) => b.score - a.score);
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      justify-items: start;
    }
    td,
    th {
      padding: calc(var(--spacing) * 1) calc(var(--spacing) * 3);
      text-align: left;
    }
  </style>

  <table>
    <thead><tr><th>#</th><th>Name</th><th>Score</th></tr></thead>
    <tbody>
      <tr repeat="#board.rows" as="row" index="i" key="id">
        <td><slot name="#i"></slot></td>
        <td><slot name="#row.name"></slot></td>
        <td><slot name="#row.score"></slot></td>
      </tr>
    </tbody>
  </table>
  <ui-button variant="outline" onclick="sort()">Sort by score</ui-button>
</custom-element>

<score-table></score-table>
```

## Related

- [Lists and keys](/docs/lists/)
