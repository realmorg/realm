---
title: Checkbox
description: A form-associated checkbox with a built-in label, indeterminate state and native validation.
group: Forms
order: 104
nav: Checkbox
---

# Checkbox

`ui-checkbox` renders a native `<input type="checkbox">` and a `<label>` in its shadow root. The element's text is
the label, and clicking the label toggles the box. It is form-associated. When checked, it submits its `value`
(or `on`) under its `name`, like a native checkbox.

```html live
<ui-checkbox>Accept terms and conditions</ui-checkbox>
```

## Examples

### Checked

```html live
<ui-checkbox checked>Email me about product updates</ui-checkbox>
```

### Indeterminate

`indeterminate` shows a dash instead of a check mark, for a "select all" box whose items are partly checked. Like
the native property, it changes only the look. The box still submits according to `checked`. Clicking the box clears
`indeterminate`, as it does on a native checkbox.

```html live
<ui-checkbox indeterminate>Select all</ui-checkbox>
```

### Disabled

```html live
<ui-checkbox disabled>Disabled</ui-checkbox>
<ui-checkbox disabled checked>Disabled and checked</ui-checkbox>
```

### Without visible text

When the checkbox has no text, name it with `aria-label`.

```html live
<ui-checkbox aria-label="Select row"></ui-checkbox>
```

### Listening for changes

`change` bubbles from the element after each toggle. Read `checked` from the element.

```html live
<custom-element name="checkbox-change-demo">
  <script type="realm">
    const settings = useState({ status: "Notifications are off." });

    function changed(checkbox) {
      settings.status = checkbox.checked ? "Notifications are on." : "Notifications are off.";
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
    }
    p {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--muted-foreground);
    }
  </style>

  <ui-checkbox onchange="changed(this)">Enable notifications</ui-checkbox>
  <p role="status"><slot name="#settings.status"></slot></p>
</custom-element>
<checkbox-change-demo></checkbox-change-demo>
```

### In a form

Only checked boxes are submitted. Several checkboxes can share a `name`, and `FormData.getAll()` returns every checked
value. `required` blocks submission until the box is checked, and `form.reset()` restores the `checked` attribute.

```html live
<custom-element name="checkbox-form-demo">
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
      gap: calc(var(--spacing) * 3);
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
    <ui-checkbox name="topics" value="releases" checked>Releases</ui-checkbox>
    <ui-checkbox name="topics" value="security">Security advisories</ui-checkbox>
    <ui-checkbox name="topics" value="events">Events</ui-checkbox>
    <ui-checkbox name="terms" required>I agree to the terms</ui-checkbox>
    <div class="actions">
      <ui-button type="submit">Subscribe</ui-button>
      <ui-button type="reset" variant="outline">Reset</ui-button>
    </div>
  </form>
  <output><slot name="#result.text"></slot></output>
</custom-element>
<checkbox-form-demo></checkbox-form-demo>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | string | | Form field name the value is submitted under. Also the `name` property, which reflects to the attribute like a native control's. |
| `checked` | boolean | `false` | Whether the box is checked. The attribute is the initial and reset state. The property follows the user. |
| `value` | string | | Value submitted when checked. Without it the form submits `on`. |
| `indeterminate` | boolean | `false` | Shows the mixed state. Visual only. Cleared when the user toggles the box. |
| `disabled` | boolean | `false` | Disables the box. Also true inside a disabled `<fieldset>`. |
| `required` | boolean | `false` | The form is invalid until the box is checked. |
| `aria-label` | string | | Accessible name when there is no visible text. Property name: `label`. |

The `name` attribute is read by the form, as on any form-associated element.

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `checked` | boolean | Current state. Updated when the user toggles the box. Setting it updates the box and the submitted value. |
| `value`, `indeterminate`, `disabled`, `required` | | Mirror the attributes above. |

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `change` | none | Bubbles from the element after the user toggles the box. `checked` is already updated. |
| `input` | none | The native `input` event of the inner checkbox, which is composed and reaches the page. |

### Slots

| Slot | Description |
| --- | --- |
| (default) | The label text. It is rendered inside a native `<label>` for the inner checkbox. |

### CSS parts

| Part | Description |
| --- | --- |
| `control` | The inner `<input type="checkbox">`. |
| `label` | The `<label>` around the slotted text. |

### CSS states

| State | Description |
| --- | --- |
| `:state(attr-checked)` | Set while the box is checked, for example `ui-checkbox:state(attr-checked)`. |

### Forms

`ui-checkbox` is form-associated. When checked it submits `value`, or `on` without one. When unchecked it submits
nothing. Validity is mirrored from the inner checkbox, so `required` takes part in `checkValidity()` and
`reportValidity()`. `form.reset()` restores the `checked` attribute, and a disabled `<fieldset>` disables the box.

### Accessibility

The inner native checkbox keeps its role, Space toggles it, and the host delegates focus to it. The slotted text is
its label. When there is no text, `aria-label` is passed to the inner checkbox, and a `<ui-label for>` pointing at
the element sets one too.
