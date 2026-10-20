---
title: attrs
description: Reference for attrs, reactive read and write access to any attribute on the component host.
group: "Script: element"
order: 54
nav: attrs
---

# `attrs`

Reactive access to every attribute on the host, declared as a prop or not.

```ts
attrs: Record<string, string | null>
```

```js
const view = useState({
  get compact() {
    return attrs.density === "compact";
  },
});

attrs.tabindex ??= 0;
attrs["aria-expanded"] = open;
```

## Reading

| Read | Result |
| --- | --- |
| `attrs.name` | The attribute's text, or `null` when it is absent |
| In an observer or getter | Subscribes. It re-runs when that attribute changes, is added or is removed |

## Writing

| Value written | Result |
| --- | --- |
| `null`, `undefined`, `false` | `removeAttribute(name)` |
| `true` | `setAttribute(name, "")` |
| anything else | `setAttribute(name, String(value))` |

The attribute mirror is created on first use and watches the host with a `MutationObserver` until the element is removed. For typed, validated attributes, use [`defineProps`](/reference/script/define-props/).

## Example

```html live
<custom-element name="density-label">
  <script type="realm">
    const view = useState({
      get text() {
        return attrs.density === "compact" ? "Compact" : "Comfortable";
      },
    });

    function toggle() {
      attrs.density = attrs.density === "compact" ? null : "compact";
    }
  </script>

  <ui-button variant="outline" onclick="toggle()"><slot name="#view.text"></slot></ui-button>
</custom-element>

<density-label></density-label>
```

## Related

- [Props: attributes and properties](/docs/props/#attributes-and-properties)
