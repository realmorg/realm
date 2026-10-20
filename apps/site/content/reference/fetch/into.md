---
title: into, into-mode and into-key
description: into, which writes a response into state, and into-mode and into-key for updating lists.
group: Fetch attributes
order: 32
nav: into, into-mode, into-key
---

# `into`, `into-mode` and `into-key`

Write a successful response's `data` into state. `data` is the parsed JSON when the response is JSON, otherwise the text.

```html
<button fetch="/api/items" into="#list.items">Load</button>
<form fetch="/api/items" method="post" into="#list.items" into-mode="append">…</form>
<button fetch="/api/items/3" method="delete" into="#list.items" into-mode="remove">Delete</button>
```

## Attributes

| Attribute | Type | Default | Meaning |
| --- | --- | --- | --- |
| `into` | writable [reference](/reference/syntax/) | none | Where to write. Needs at least one property (`#list.items`), cannot be a prop or negated |
| `into-mode` | `replace`, `append`, `prepend`, `update`, `remove` | `replace` | How `data` is combined with the current value |
| `into-key` | property name | `id` | Identity property for `update` and `remove` |

`into` is applied before `render` and before the `load` event. It is not applied for non-2xx responses.

## Modes

For every mode except `replace`, the current value is treated as a list (`[]` if it is not an array) and `data` as a list of items (a single value becomes one item).

| Mode | New value |
| --- | --- |
| `replace` | `data` |
| `append` | current items, then the new items |
| `prepend` | the new items, then current items |
| `update` | Each current item whose `into-key` matches a new item is replaced by it, in place. New items with no match are appended |
| `remove` | Current items whose `into-key` matches a new item are removed |

An unknown `into-mode` behaves like `append`. The write replaces the array, so a `key` on the list keeps unchanged rows.

## Example

```html live
<custom-element name="first-pages">
  <script type="realm">
    const list = useState({ pages: [] });
    const view = useState({
      get count() {
        return list.pages.length;
      },
    });
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      justify-items: start;
    }
    div {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
  </style>

  <div>
    <ui-button fetch="{{root}}search-index.json" into="#list.pages">Replace</ui-button>
    <ui-button variant="outline" fetch="{{root}}search-index.json" into="#list.pages" into-mode="append">Append</ui-button>
    <ui-button variant="outline" fetch="{{root}}search-index.json" into="#list.pages" into-mode="update" into-key="url">Update by url</ui-button>
  </div>
  <p><slot name="#view.count"></slot> items in the list</p>
</custom-element>

<first-pages></first-pages>
```

"Append" doubles the list each time. "Update by url" replaces matching pages in place, so the count stays the same.

## Related

- [Fetching data: updating one item in a list](/docs/fetching/#updating-one-item-in-a-list)
