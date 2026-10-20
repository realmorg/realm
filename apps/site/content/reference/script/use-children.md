---
title: useChildren
description: Reference for useChildren, a reactive array of the host's direct light DOM children that match a selector.
group: "Script: element"
order: 55
nav: useChildren
---

# `useChildren`

A reactive array of the host's direct light DOM children that match a selector. Used by components that take `<option>`-like children.

```ts
useChildren(selector: string, attributes?: string[]): Element[]
```

```js
const options = useChildren("option", ["value", "label", "disabled"]);
const menu = useState({
  get items() {
    return options.map((option) => ({ value: option.value, label: option.label }));
  },
});
```

## Parameters

| Parameter | Type | Default | Meaning |
| --- | --- | --- | --- |
| `selector` | CSS selector | required | Which direct children to include (`child.matches(selector)`) |
| `attributes` | `string[]` | `[]` | Attribute names to watch on the children and their descendants |

## Updates

The array is refreshed when:

- children are added, removed or reordered (anywhere in the light DOM subtree),
- text inside them changes,
- one of the listed `attributes` changes on a descendant,
- a child REALM component finishes mounting, so its props can be read.

Watching stops when the element is removed.

## Example

```html live
<custom-element name="option-count">
  <script type="realm">
    const options = useChildren("option", ["disabled"]);
    const view = useState({
      get enabled() {
        return options.filter((option) => !option.disabled).map((option) => option.textContent).join(", ");
      },
    });

    function toggleLast() {
      host.lastElementChild.toggleAttribute("disabled");
    }
  </script>

  <p>Enabled: <slot name="#view.enabled"></slot></p>
  <ui-button variant="outline" onclick="toggleLast()">Toggle the last option</ui-button>
</custom-element>

<option-count>
  <option>Small</option>
  <option>Medium</option>
  <option>Large</option>
</option-count>
```

## Related

- [`useChildren` in REALM UI's select and tabs](/components/)
