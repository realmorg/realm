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
| 1 | Parent components, nearest first, walking up the flat tree: slotted content continues from its slot (so components wrapping the slot come before the host), and a shadow root continues from its host. Handler names skip slots and resolve from the component the content is placed in. A component "defines" a name when it is a top-level name of its script |
| 2 | `globalThis[name]` |

A `lookup` call is a dependency you chose, so it logs nothing. Handlers also look up names the script does not define, at call time. Those reads are implicit, so REALM logs `<child> reads "name" from <parent>.` once when the name comes from a parent through a shadow root (not for [compound parts](/reference/elements/custom-element/#slot)).

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
