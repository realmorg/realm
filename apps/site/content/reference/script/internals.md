---
title: internals
description: Reference for internals, the component's ElementInternals for custom states, ARIA and form association.
group: "Script: element"
order: 53
nav: internals
---

# `internals`

The element's `ElementInternals`, attached by REALM.

```ts
internals: ElementInternals
```

```js
internals.states.add("expanded");
internals.ariaExpanded = "true";
internals.setFormValue(props.value);
```

## What it is used for

| Member | Use |
| --- | --- |
| `states` | Custom states for CSS: `internals.states.add("open")` matches `:host(:state(open))` and `tag:state(open)` |
| `role`, `aria*` | Default ARIA role and properties. The definition's `role` attribute sets `internals.role` |
| `setFormValue(value)` | The value submitted with the form (form-associated components) |
| `setValidity(flags, message, anchor)` | Validation state |
| `form`, `labels`, `validity`, `validationMessage`, `willValidate`, `checkValidity()`, `reportValidity()` | Form association |

REALM uses `internals.states` for the [reactive `:state()` selectors](/reference/css/states/) and `:state(loading)`. In form-associated components with a `value` prop, REALM calls `setFormValue` for you, and with [`ref="control"`](/reference/attributes/ref/#ref-control) it calls `setValidity`.

## Example

```html live
<custom-element name="expand-box">
  <script type="realm">
    function toggle() {
      if (internals.states.has("expanded")) internals.states.delete("expanded");
      else internals.states.add("expanded");
    }
  </script>

  <style type="realm">
    :host {
      display: block;
      max-width: calc(var(--spacing) * 100);
    }
    p {
      display: none;
    }
    :host(:state(expanded)) p {
      display: block;
    }
  </style>

  <ui-button variant="outline" onclick="toggle()">Toggle details</ui-button>
  <p>Details shown through a custom state.</p>
</custom-element>

<expand-box></expand-box>
```

## Related

- [Styling: your own states](/docs/styling/#your-own-states)
- [Forms: doing it by hand](/docs/forms/#doing-it-by-hand)
