---
title: onFormReset
description: Reference for onFormReset, which runs when the form that owns a form-associated component is reset.
group: Lifecycle hooks
order: 72
nav: onFormReset
---

# `onFormReset`

Runs when the owning form is reset. For components defined with [`form-associated`](/reference/elements/custom-element/#form-associated).

```ts
onFormReset(fn: () => void): void
```

```js
onFormReset(() => {
  editor.text = "";
});
```

## Parameters

| Parameter | Type | Meaning |
| --- | --- | --- |
| `fn` | `() => void` | Runs from the element's `formResetCallback` |

Before your hooks run, REALM re-reads every declared prop from its attribute, so props with an attribute go back to their initial values automatically. Use this hook for state that is not a prop.

## Example

```html live
<custom-element name="tally-field" form-associated>
  <script type="realm">
    const props = defineProps({ value: prop.number().default(0) });

    onFormReset(() => {
      document.getElementById("reset-log").value = "Reset ran";
    });
  </script>

  <ui-button variant="outline" onclick="props.value++">Tally: <slot name="@value"></slot></ui-button>
</custom-element>

<form>
  <tally-field name="tally"></tally-field>
  <ui-button type="reset" variant="ghost">Reset</ui-button>
  <output id="reset-log"></output>
</form>
```

## Related

- [Forms: form lifecycle hooks](/docs/forms/#form-lifecycle-hooks)
