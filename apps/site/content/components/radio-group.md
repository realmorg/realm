---
title: Radio Group
description: A form-associated set of radio buttons built from native option children, for choosing exactly one value.
group: Forms
order: 111
nav: Radio Group
---

# Radio Group

`ui-radio-group` turns its `<option>` children into native radio buttons with labels, laid out in a column or a row.
Choosing a radio sets the group's `value`. The host has the `radiogroup` role and is form-associated. The chosen
option's `value` is submitted under the group's `name`.

Because the radios are native inputs that share a name inside the group's shadow root, the arrow keys move between
them as usual.

```html live
<ui-radio-group aria-label="Plan" value="pro">
  <option value="free">Free</option>
  <option value="pro">Pro</option>
  <option value="team">Team</option>
</ui-radio-group>
```

## Examples

### Horizontal

```html live
<ui-radio-group aria-label="Size" orientation="horizontal" value="m">
  <option value="s">Small</option>
  <option value="m">Medium</option>
  <option value="l">Large</option>
</ui-radio-group>
```

### Disabled options

`disabled` on an option disables that radio. `disabled` on the group disables all of them.

```html live
<ui-radio-group aria-label="Shipping" value="standard">
  <option value="standard">Standard (5 days)</option>
  <option value="express">Express (2 days)</option>
  <option value="overnight" disabled>Overnight (unavailable)</option>
</ui-radio-group>
<ui-radio-group aria-label="Locked plan" value="free" disabled>
  <option value="free">Free</option>
  <option value="pro">Pro</option>
</ui-radio-group>
```

### Option labels

The radio label is the option's `label` attribute, or its text when there is no `label`.

```html live
<ui-radio-group aria-label="Theme" value="system">
  <option value="light" label="Light theme">light</option>
  <option value="dark" label="Dark theme">dark</option>
  <option value="system" label="Follow the system">system</option>
</ui-radio-group>
```

### Listening for changes

```html live
<custom-element name="radio-group-change-demo">
  <script type="realm">
    const density = useState({ value: "comfortable" });

    function changed(group) {
      density.value = group.value;
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
    }
    p {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--muted-foreground);
    }
  </style>

  <ui-radio-group aria-label="Density" value="comfortable" onchange="changed(this)">
    <option value="compact">Compact</option>
    <option value="comfortable">Comfortable</option>
    <option value="spacious">Spacious</option>
  </ui-radio-group>
  <p>Density: <slot name="#density.value"></slot></p>
</custom-element>
<radio-group-change-demo></radio-group-change-demo>
```

### In a form

The chosen `value` is submitted under the group's `name`. Nothing is submitted while no option is chosen. Reset
returns the group to its `value` attribute.

```html live
<custom-element name="radio-group-form-demo">
  <script type="realm">
    const result = useState({ text: "Submit the form to see its data." });

    function submit(event) {
      event.preventDefault();
      const entries = [...new FormData(event.target)].map(([name, value]) => `${name}=${value}`);
      result.text = entries.join("\n") || "(nothing submitted)";
    }

    function reset() {
      result.text = "The form was reset.";
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 4);
      width: 100%;
      max-width: calc(var(--spacing) * 80);
    }
    form {
      display: grid;
      gap: calc(var(--spacing) * 4);
    }
    .actions {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
    output {
      display: block;
      padding: calc(var(--spacing) * 3);
      border-radius: var(--radius-md);
      background: var(--muted);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      white-space: pre-wrap;
    }
  </style>

  <form onsubmit="submit(event)" onreset="reset()">
    <ui-radio-group name="billing" aria-label="Billing period" value="monthly">
      <option value="monthly">Monthly</option>
      <option value="yearly">Yearly (2 months free)</option>
    </ui-radio-group>
    <ui-radio-group name="payment" aria-label="Payment method" orientation="horizontal">
      <option value="card">Card</option>
      <option value="invoice">Invoice</option>
    </ui-radio-group>
    <div class="actions">
      <ui-button type="submit">Continue</ui-button>
      <ui-button type="reset" variant="outline">Reset</ui-button>
    </div>
  </form>
  <output><slot name="#result.text"></slot></output>
</custom-element>
<radio-group-form-demo></radio-group-form-demo>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | string | | Form field name the value is submitted under. Also the `name` property, which reflects to the attribute like a native control's. |
| `value` | string | | The `value` of the chosen option. |
| `orientation` | `"vertical"` \| `"horizontal"` | `"vertical"` | Lays the radios out in a column or a row. |
| `disabled` | boolean | `false` | Disables every radio. Also true inside a disabled `<fieldset>`. |
| `required` | boolean | `false` | The form is invalid until an option is chosen. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `value` | string | The chosen value. Setting it checks the matching radio. |

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `change` | none | Fired from the group after the user chooses a radio. |

### Child elements

| Element | Attributes read | Description |
| --- | --- | --- |
| `<option>` | `value`, `label` (or text), `disabled` | One radio. Options stay hidden in place. Adding or removing options updates the radios. |

### CSS parts

| Part | Description |
| --- | --- |
| `item` | The `<label>` around each radio and its text. |
| `control` | Each native `<input type="radio">`. |

### CSS states

| State | Description |
| --- | --- |
| `:state(attr-orientation-is-horizontal)` | Set for the horizontal layout. |

### Forms

`ui-radio-group` is form-associated. It submits `value` under its `name`, or nothing while no option is chosen. With
`required` and no value it reports `valueMissing` with the message "Please select an option.", and the validation
bubble points at the first enabled radio, which takes focus. `form.reset()` restores the `value` attribute.

### Accessibility

The host has `role="radiogroup"`. Name it with `aria-label` or `aria-labelledby`. Each radio is a native input
inside its own `<label>`, so the option text is its name and clicking the text checks it. Tab moves into the group
on the checked radio, and the arrow keys move and check the next or previous radio.
