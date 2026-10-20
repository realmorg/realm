---
title: Lists and keys
description: Repeat content with repeat-list or the repeat attribute, name the item and index, use keys so rows are reused and moved, and repeat rows inside tables and selects.
group: Core concepts
order: 16
nav: Lists and keys
---

# Lists and keys

REALM repeats content with `<repeat-list>`, or with the `repeat` attribute on the element to repeat.

```html
<repeat-list of="#todo.items" as="item" index="i" key="id">
  <article>
    <h3><slot name="#item.title"></slot></h3>
    <p>Item <slot name="#i"></slot></p>
  </article>
</repeat-list>

<ul>
  <li repeat="#todo.items" as="item" key="id"><slot name="#item.title"></slot></li>
</ul>
```

| Attribute | Meaning | Default |
| --- | --- | --- |
| `of` (on `<repeat-list>`) or `repeat` (on any element) | A reference to an array | |
| `as` | Name of the item variable | `item` |
| `index` | Name of the index variable, if you need one | none |
| `key` | Name of a property that identifies each item | the position |

Inside each copy:

- `#item.title` and `#i` work in slots, bindings and conditions.
- `item` and `i` are variables in event handlers: `onclick="remove(item)"`.
- Everything else still resolves to the component's script, so `#todo.filter` works inside the loop too.

A value that is not an array renders nothing.

## Which form to use

`<repeat-list>` lays out as if it were not there (`display: contents`) and can repeat several elements per item. Use it anywhere unknown elements are allowed.

Use the `repeat` attribute **inside `<ul>`, `<ol>`, `<table>`, `<tbody>`, `<tr>` and `<select>`**. The HTML parser moves unknown tags such as `<repeat-list>` out of tables and selects, and lists only allow `<li>` children.

```html
<table>
  <tbody>
    <tr repeat="#report.rows" as="row" key="id">
      <td><slot name="#row.name"></slot></td>
      <td><slot name="#row.total"></slot></td>
    </tr>
  </tbody>
</table>

<select>
  <option repeat="#form.countries" as="country" key="code" _value="#country.code"><slot name="#country.name"></slot></option>
</select>
```

## Keys

With `key`, REALM matches items by that property between updates:

- an item that is still there keeps its DOM nodes, so focus, typed text, scroll position and running transitions survive,
- moved items are moved, not re-created,
- removed items are torn down, including their listeners and requests,
- new items are created.

Without `key`, items are matched by position: changing the first item of a list updates the first row in place. That is fine for static or append-only lists. Use a key whenever items can be reordered, inserted or removed.

Keys must be unique. A duplicate key logs a warning and the duplicate gets its own row.

```html live
<custom-element name="sortable-names">
  <script type="realm">
    const people = useState({
      list: [
        { id: 1, name: "Ana" },
        { id: 2, name: "Bo" },
        { id: 3, name: "Chen" },
      ],
    });

    function shuffle() {
      people.list.sort(() => Math.random() - 0.5);
    }

    function addFirst() {
      const id = people.list.length + 1;
      people.list.unshift({ id, name: `Person ${id}` });
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
      width: min(calc(var(--spacing) * 96), 100%);
    }
    ol {
      margin: 0;
      padding-left: calc(var(--spacing) * 5);
    }
    li {
      padding: calc(var(--spacing) * 1) 0;
    }
    li ui-input {
      display: inline-block;
      width: calc(var(--spacing) * 56);
      margin-left: calc(var(--spacing) * 2);
      vertical-align: middle;
    }
    .actions {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
  </style>

  <ol>
    <li repeat="#people.list" as="person" key="id">
      <slot name="#person.name"></slot>
      <ui-input aria-label="Note" placeholder="Type a note, then shuffle"></ui-input>
    </li>
  </ol>
  <div class="actions">
    <ui-button size="sm" onclick="shuffle()">Shuffle</ui-button>
    <ui-button size="sm" variant="outline" onclick="addFirst()">Add first</ui-button>
  </div>
</custom-element>

<sortable-names></sortable-names>
```

Type in a note, then shuffle: the note moves with its person, because the row is moved, not rebuilt.

## Updating lists

Change the array in the script. Every array method that mutates is tracked:

```js
todo.items.push(item);
todo.items.splice(index, 1);
todo.items.sort((a, b) => a.title.localeCompare(b.title));
todo.items = todo.items.filter((item) => !item.done); // replacing works too
item.done = true; // changing a field updates only what reads it
```

When a keyed item is replaced by a new object with the same key, its row is kept and its bindings show the new object's values.

## Filtered and sorted views

Keep the source array as it is and expose a getter for what the markup shows:

```js
const todo = useState({
  items: [],
  filter: "all",
  get visible() {
    return this.items.filter(FILTERS[this.filter]);
  },
});
```

```html
<li repeat="#todo.visible" as="item" key="id">…</li>
```

## Nested loops

Loops nest. Inner loops can use outer variables:

```html
<repeat-list of="#board.columns" as="column" key="id">
  <section>
    <h3><slot name="#column.title"></slot></h3>
    <ul>
      <li repeat="#column.cards" as="card" key="id" onclick="open(column, card)"><slot name="#card.title"></slot></li>
    </ul>
  </section>
</repeat-list>
```
