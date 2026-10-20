---
title: lookup
description: Reference for lookup, which reads a name from the nearest parent component that defines it, or from globalThis.
group: "Script: element"
order: 59
nav: lookup
---

# `lookup`

Returns a name from the nearest parent component that defines it, or from `globalThis`.

```ts
lookup(name: string): unknown
```

```js
const session = lookup("session");
```

## Behaviour

| Step | Source |
| --- | --- |
| 1 | Parent components, nearest first, walking up through shadow roots. A component "defines" a name when it is a top-level name of its script |
| 2 | `globalThis[name]` |

When a parent provides the name, REALM logs `<child> reads "name" from <parent>.` once (not for [compound parts](/reference/elements/custom-element/#slot)). Handlers use the same lookup, at call time, for names the script does not define.

Use props for data a reusable component depends on. Use `lookup` for small parts that always live inside one parent.

## Example

```html live
<custom-element name="theme-shell">
  <script type="realm">
    const theme = useState({ accent: "Blue" });
  </script>

  <theme-label></theme-label>
  <ui-button variant="outline" onclick="theme.accent = theme.accent === 'Blue' ? 'Green' : 'Blue'">Switch</ui-button>
</custom-element>

<custom-element name="theme-label">
  <script type="realm">
    const theme = lookup("theme");
  </script>

  <p>Accent from the parent: <slot name="#theme.accent"></slot></p>
</custom-element>

<theme-shell></theme-shell>
```

`theme-label` reads the parent's state once with `lookup`. The object it gets is reactive, so the slot stays up to date.

## Related

- [Nested components and scope](/docs/scope/)
