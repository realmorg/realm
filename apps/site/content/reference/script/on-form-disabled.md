---
title: onFormDisabled
description: Reference for onFormDisabled, which runs when a form-associated component is disabled or enabled through its own attribute or a surrounding fieldset.
group: Lifecycle hooks
order: 73
nav: onFormDisabled
---

# `onFormDisabled`

Runs when the element becomes disabled or enabled, either through its own `disabled` attribute or a surrounding `<fieldset disabled>`. For components defined with [`form-associated`](/reference/elements/custom-element/#form-associated).

```ts
onFormDisabled(fn: (disabled: boolean) => void): void
```

```js
onFormDisabled((disabled) => {
  refs.control.tabIndex = disabled ? -1 : 0;
});
```

## Parameters

| Parameter | Type | Meaning |
| --- | --- | --- |
| `fn` | `(disabled: boolean) => void` | Runs from the element's `formDisabledCallback` with the new state |

You often do not need it. With a `disabled` prop, `props.disabled` already reads `true` while a fieldset disables the element, and the component starts disabled when it is created inside one.

## Example

```html live
<custom-element name="disable-aware" form-associated>
  <script type="realm">
    const status = useState({ text: "enabled" });

    onFormDisabled((disabled) => {
      status.text = disabled ? "disabled" : "enabled";
    });
  </script>

  <p>I am <slot name="#status.text"></slot>.</p>
</custom-element>

<fieldset id="disable-set">
  <legend>Fieldset</legend>
  <disable-aware></disable-aware>
</fieldset>
<ui-button variant="outline" onclick="document.getElementById('disable-set').toggleAttribute('disabled')">Toggle fieldset disabled</ui-button>
```

## Related

- [Forms: disabled fields](/docs/forms/#disabled-fields)
