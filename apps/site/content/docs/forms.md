---
title: Forms
description: Build form-associated components that submit, reset, validate, disable and restore like native fields, with automatic value syncing and ref="control" delegation.
group: Forms and accessibility
order: 40
nav: Forms
---

# Forms

Add `form-associated` to a definition and the component becomes a real form field through `ElementInternals`. It takes part in submission and `FormData`, `form.reset()`, `<fieldset disabled>`, validation, labels and back/forward restore, like `<input>`.

```html
<custom-element name="star-input" form-associated>
  …
</custom-element>

<form>
  <star-input name="rating" required></star-input>
</form>
```

The `name` attribute works as on native fields, because the browser reads it from the element.

## Values are synced for you

If a form-associated component declares a prop called `value`, REALM keeps the submitted form value equal to it. If it declares `checked`, the field submits its `value` (or `"on"`) only while `checked` is true, like a checkbox.

On `form.reset()`, every prop is parsed again from its attribute, so the field returns to the value written in the HTML. When the browser restores form state (back/forward navigation or autofill), `value` or `checked` is restored.

## Delegating to an inner control

Most fields wrap a native control. Mark it with `ref="control"` and REALM wires it up:

- typing in the control updates the `value` prop (as a number when the prop is a number), and toggling a checkbox or radio updates `checked`,
- the control's validity (`required`, `pattern`, `min`, `type="email"`, …) becomes the component's validity, so `form.checkValidity()` and `:invalid` work,
- `change` from the control is re-dispatched from the host,
- pressing Enter in a text-like control submits the form, like a native input,
- a `<label>` around the component, or one pointing at it, names the inner control.

```html live
<custom-element name="quantity-input" form-associated delegates-focus>
  <script type="realm">
    const props = defineProps({
      value: prop.number().int().default(1),
      min: prop.number().default(1),
      max: prop.number().default(10),
      disabled: prop.boolean(),
    });

    function step(amount) {
      props.value = Math.min(props.max, Math.max(props.min, props.value + amount));
    }
  </script>

  <style type="realm">
    :host {
      display: inline-flex;
      align-items: center;
      gap: calc(var(--spacing) * 1);
    }
    input {
      width: calc(var(--spacing) * 14);
      height: calc(var(--spacing) * 8);
      border: 1px solid var(--input);
      border-radius: var(--radius-md);
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: center;
    }
    input:invalid {
      border-color: var(--destructive);
    }
  </style>

  <ui-button size="icon-sm" variant="outline" aria-label="Less" _disabled="@disabled" onclick="step(-1)">-</ui-button>
  <input ref="control" type="number" _value="@value" _min="@min" _max="@max" _disabled="@disabled">
  <ui-button size="icon-sm" variant="outline" aria-label="More" _disabled="@disabled" onclick="step(1)">+</ui-button>
</custom-element>

<custom-element name="order-form">
  <script type="realm">
    const result = useState({ text: "Submit to see the form data." });

    function submit(event) {
      event.preventDefault();
      result.text = new URLSearchParams(new FormData(event.target)).toString();
    }

    function cleared() {
      result.text = "Reset.";
    }
  </script>

  <style type="realm">
    form {
      display: grid;
      gap: calc(var(--spacing) * 3);
      justify-items: start;
    }
    label {
      display: flex;
      gap: calc(var(--spacing) * 3);
      align-items: center;
    }
    .actions {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
    output {
      font-family: var(--font-mono);
      font-size: var(--text-sm);
    }
  </style>

  <form onsubmit="submit(event)" onreset="cleared()">
    <label>Coffee <quantity-input name="coffee" value="2"></quantity-input></label>
    <label>Tea <quantity-input name="tea" value="1" max="3"></quantity-input></label>
    <label>Cake (sold out) <quantity-input name="cake" disabled></quantity-input></label>
    <div class="actions">
      <ui-button type="submit">Order</ui-button>
      <ui-button type="reset" variant="outline">Reset</ui-button>
    </div>
    <output><slot name="#result.text"></slot></output>
  </form>
</custom-element>

<order-form></order-form>
```

Things to see in the demo:

- `coffee` and `tea` are submitted; `cake` is not, because it is disabled. Its inner buttons and input follow `props.disabled`.
- Typing a number above `max` makes the field invalid, and submitting is blocked by native validation.
- Reset puts every field back to its `value` attribute.

## Disabled fields

Inside a form-associated component, `props.disabled` is `true` when the `disabled` attribute is set **or** when a surrounding `<fieldset disabled>` disables the field. Bind it to inner controls (`_disabled="@disabled"`) and both cases work.

## Doing it by hand

Without a `value` or `checked` prop, or for anything special, use `internals` directly:

```js
const props = defineProps({ tags: prop.array(prop.string()).default([]), required: prop.boolean() });

observe(() => {
  internals.setFormValue(props.tags.join(","));
  internals.setValidity(
    props.required && props.tags.length === 0 ? { valueMissing: true } : {},
    "Add at least one tag.",
  );
});
```

`internals.form`, `internals.labels`, `internals.validity` and `internals.willValidate` are the native properties.

## Form lifecycle hooks

| Hook | Runs when |
| --- | --- |
| `onFormReset(fn)` | The form is reset. Runs after REALM re-reads the props |
| `onFormDisabled(fn)` | The field becomes disabled or enabled through a fieldset or its own attribute. `fn(disabled)` |
| `onFormStateRestore(fn)` | The browser restores the field's state. `fn(state, mode)`, where `mode` is `"restore"` or `"autocomplete"` |

## Submitting with fetch attributes

A `<form>` with [fetch attributes](/docs/fetching/) sends its fields, including form-associated components, without a page load:

```html
<form action="/api/orders" method="post" into="#orders.list" into-mode="append" onload="this.reset()">
  <quantity-input name="coffee" value="1"></quantity-input>
  <ui-button type="submit">Order</ui-button>
</form>
```

## REALM UI fields

Every REALM UI input is form-associated: [Input](/components/input/), [Textarea](/components/textarea/), [Select](/components/select/), [Checkbox](/components/checkbox/), [Switch](/components/switch/), [Radio Group](/components/radio-group/), [Slider](/components/slider/), [Input OTP](/components/input-otp/), [Combobox](/components/combobox/), [Calendar](/components/calendar/), [Toggle](/components/toggle/), [Toggle Group](/components/toggle-group/), and [Button](/components/button/) for submit and reset.
