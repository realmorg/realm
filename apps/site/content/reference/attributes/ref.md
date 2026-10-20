---
title: ref
description: The ref attribute, which names an element for refs, render targets and form control delegation.
group: Attributes
order: 23
nav: ref
---

# `ref`

Names an element in a component's markup. Used in component markup.

```html
<canvas ref="canvas"></canvas>
<div ref="results"></div>
<input ref="control">
```

## Attribute

| Attribute | Type | Meaning |
| --- | --- | --- |
| `ref` | name | Registers the element as `refs[name]` |

## Uses

| Use | How |
| --- | --- |
| Script access | [`refs.name`](/reference/script/refs/) in the script. `refs` is reactive and empty while the script's top level runs. It is filled once the markup is connected, before [`onConnected`](/reference/script/on-connected/) hooks run |
| Render target | [`render="name"`](/reference/fetch/render/) inserts a response into the element with that `ref` |
| Form control | `ref="control"` in a `form-associated` component (see below) |

The attribute stays on the element. When several elements use the same name (for example inside a loop), `refs[name]` is the last one mounted. Content that `<is-visible>` removes is not taken out of `refs`.

## ref="control"

In a component defined with `form-associated`, an `<input>`, `<select>` or `<textarea>` with `ref="control"` becomes the component's delegated control:

| Behaviour | Detail |
| --- | --- |
| Value sync | On `input` and `change`, the control's value is written to the `value` prop (as a number when the prop holds a number), or its `checked` state to the `checked` prop for checkboxes and radios |
| Validity | The control's `validity` and `validationMessage` are mirrored with `internals.setValidity`, anchored to the control |
| `change` | The control's `change` is re-dispatched from the host (bubbling, not composed) |
| Enter | Enter in a text-like control (`text`, `email`, `password`, `number`, `search`, `tel`, `url`, date and time types) submits the outer form |
| Labels | Text of the host's `<label>` elements is copied to the control's `aria-label`, unless it has one |

See [Forms](/docs/forms/#delegating-to-an-inner-control).

## Example

```html live
<custom-element name="focus-field">
  <script type="realm">
    function focusField() {
      refs.field.focus();
    }
  </script>

  <style type="realm">
    :host {
      display: flex;
      gap: calc(var(--spacing) * 2);
      align-items: center;
    }
  </style>

  <input ref="field" aria-label="Name" placeholder="Name">
  <ui-button variant="outline" onclick="focusField()">Focus the field</ui-button>
</custom-element>

<focus-field></focus-field>
```

## Related

- [Lifecycle: host, refs and internals](/docs/lifecycle/#host-refs-and-internals)
