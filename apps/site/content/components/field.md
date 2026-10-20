---
title: Field
description: Layout wrappers that pair a form control with its label, description and error message, and group related fields under a legend.
group: Forms
order: 106
nav: Field
---

# Field

`ui-field` stacks a label, a control, an optional `ui-field-description` and an error message with consistent
spacing. It is a layout element with the `group` role. The control inside keeps its own form behaviour. Its parts go
in the default slot and show in source order. `ui-field-group` stacks several fields, and `ui-field-set` groups
fields under a `ui-field-legend`.

Pair the label with the control through `ui-label for`, which also gives the control its accessible name.

```html live
<div class="demo-narrow">
  <ui-field>
    <ui-label for="field-email">Email</ui-label>
    <ui-input id="field-email" type="email" placeholder="m@example.com"></ui-input>
    <ui-field-description>We only use it to send receipts.</ui-field-description>
  </ui-field>
</div>
```

## Examples

### Error message

`error` shows a message below the field in a `role="alert"` paragraph, and `invalid` colours the label. Set
`invalid` on the control as well so its border and `aria-invalid` match.

```html live
<div class="demo-narrow">
  <ui-field invalid error="Choose a username with at least 3 characters.">
    <ui-label for="field-username">Username</ui-label>
    <ui-input id="field-username" value="ab" invalid></ui-input>
  </ui-field>
</div>
```

### Horizontal

`orientation="horizontal"` puts the label and control on one row, which suits switches and checkboxes.

```html live
<div class="demo-narrow">
  <ui-field orientation="horizontal">
    <ui-label for="field-marketing">Marketing emails</ui-label>
    <ui-switch id="field-marketing"></ui-switch>
  </ui-field>
</div>
```

### Horizontal with a description

Wrap the label and description in `ui-field-content` so they stay together in a column beside the control. Source
order decides which side the control is on.

```html live
<div class="demo-medium">
  <ui-field orientation="horizontal">
    <ui-checkbox id="field-sync"></ui-checkbox>
    <ui-field-content>
      <ui-label for="field-sync">Sync across devices</ui-label>
      <ui-field-description>Your settings follow you to every device you sign in on.</ui-field-description>
    </ui-field-content>
  </ui-field>
</div>
```

### Field group

`ui-field-group` stacks fields with a larger gap than the parts inside a field.

```html live
<div class="demo-narrow">
  <ui-field-group>
    <ui-field>
      <ui-label for="field-first-name">First name</ui-label>
      <ui-input id="field-first-name" autocomplete="given-name"></ui-input>
    </ui-field>
    <ui-field>
      <ui-label for="field-last-name">Last name</ui-label>
      <ui-input id="field-last-name" autocomplete="family-name"></ui-input>
    </ui-field>
  </ui-field-group>
</div>
```

### Field set

`ui-field-set` takes a `ui-field-legend`, an optional `ui-field-description` and the fields. The legend names the
group.

```html live
<div class="demo-medium">
  <ui-field-set>
    <ui-field-legend>Shipping address</ui-field-legend>
    <ui-field-description>Where should we send the order?</ui-field-description>
    <ui-field-group>
      <ui-field>
        <ui-label for="field-street">Street</ui-label>
        <ui-input id="field-street" autocomplete="street-address"></ui-input>
      </ui-field>
      <ui-field>
        <ui-label for="field-city">City</ui-label>
        <ui-input id="field-city" autocomplete="address-level2"></ui-input>
      </ui-field>
    </ui-field-group>
  </ui-field-set>
</div>
```

### Legend as a label

`variant="label"` on `ui-field-legend` uses label-sized text, for a set of checkboxes or radios.

```html live
<div class="demo-narrow">
  <ui-field-set>
    <ui-field-legend variant="label">Notify me about</ui-field-legend>
    <ui-field-group>
      <ui-field orientation="horizontal">
        <ui-checkbox id="field-notify-mentions" checked></ui-checkbox>
        <ui-label for="field-notify-mentions">Mentions</ui-label>
      </ui-field>
      <ui-field orientation="horizontal">
        <ui-checkbox id="field-notify-replies"></ui-checkbox>
        <ui-label for="field-notify-replies">Replies</ui-label>
      </ui-field>
    </ui-field-group>
  </ui-field-set>
</div>
```

### In a form

Fields do not change what a form submits. The controls inside do. This form validates on submit and shows the
errors through `error` and `invalid`.

```html live
<custom-element name="field-form-demo">
  <script type="realm">
    const signup = useState({
      nameError: "",
      emailError: "",
      text: "Submit the form to see its data.",
      get nameInvalid() {
        return this.nameError !== "";
      },
      get emailInvalid() {
        return this.emailError !== "";
      },
    });

    function submit(event) {
      event.preventDefault();
      const data = new FormData(event.target);
      signup.nameError = data.get("name") ? "" : "Enter your name.";
      signup.emailError = String(data.get("email")).includes("@") ? "" : "Enter a valid email address.";
      if (signup.nameError || signup.emailError) {
        signup.text = "Fix the errors above.";
        return;
      }
      signup.text = [...data].map(([name, value]) => `${name}=${value}`).join("\n");
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 4);
      width: 100%;
      max-width: calc(var(--spacing) * 96);
    }
    form {
      display: grid;
      gap: calc(var(--spacing) * 6);
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

  <form onsubmit="submit(event)" novalidate>
    <ui-field-set>
      <ui-field-legend>Profile</ui-field-legend>
      <ui-field-description>This is shown on your public page.</ui-field-description>
      <ui-field _invalid="#signup.nameInvalid" _error="#signup.nameError">
        <ui-label for="field-form-name">Name</ui-label>
        <ui-input id="field-form-name" name="name" _invalid="#signup.nameInvalid"></ui-input>
      </ui-field>
      <ui-field _invalid="#signup.emailInvalid" _error="#signup.emailError">
        <ui-label for="field-form-email">Email</ui-label>
        <ui-input id="field-form-email" name="email" type="email" _invalid="#signup.emailInvalid"></ui-input>
        <ui-field-description>Used for sign-in only.</ui-field-description>
      </ui-field>
      <ui-field orientation="horizontal">
        <ui-label for="field-form-public">Public profile</ui-label>
        <ui-switch id="field-form-public" name="public" checked></ui-switch>
      </ui-field>
    </ui-field-set>
    <ui-button type="submit">Save profile</ui-button>
  </form>
  <output><slot name="#signup.text"></slot></output>
</custom-element>
<field-form-demo></field-form-demo>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-field` | | One field: label, control, description and error, stacked (or in a row when horizontal). Role `group`. |
| `ui-label` | (default) | The label of a `ui-field`. A plain child. See [Label](/components/label/). |
| `ui-field-content` | (default) | A column that keeps a label and description together beside the control in a horizontal field. |
| `ui-field-description` | (default) | Help text in muted `var(--text-sm)`. Goes in `ui-field`, `ui-field-content` or `ui-field-set`. |
| `ui-field-group` | (default) | A column of fields with a gap of `calc(var(--spacing) * 7)`. |
| `ui-field-set` | | A group of fields under a legend. Role `group`. |
| `ui-field-legend` | `legend` | The heading of a `ui-field-set`. Assigns itself to the `legend` slot, so you do not set `slot`. |

Parts show in source order. Every part's default slot takes any content.

### ui-field attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `"vertical"` \| `"horizontal"` | `"vertical"` | Stacks the parts, or puts them on one row. |
| `invalid` | boolean | `false` | Colours the label with `--destructive`. |
| `error` | string | | Error message shown below the field. Hidden when empty. |

### ui-field-legend attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"label"` | | Uses `var(--text-sm)` instead of `var(--text-base)`. |

The other parts have no attributes.

### CSS parts

| Element | Part | Description |
| --- | --- | --- |
| `ui-field` | `error` | The error paragraph (`role="alert"`). |

### CSS states

| Element | State | Description |
| --- | --- | --- |
| `ui-field` | `:state(attr-invalid)` | Set while `invalid` is present. |
| `ui-field` | `:state(attr-orientation-is-horizontal)` | Set for the horizontal layout. |

### Accessibility

`ui-field` has `role="group"`. Its `error` paragraph has `role="alert"`, so a message that appears is announced.
The field does not link its label, description or error to the control. Use `ui-label for` (or `aria-label` on the
control) for the name. `ui-field-set` has `role="group"` and takes its accessible name from its `ui-field-legend`.
