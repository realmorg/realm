---
title: Switch
description: A form-associated on/off switch built on a native checkbox with the switch role, for settings that apply immediately.
group: Forms
order: 114
nav: Switch
---

# Switch

`ui-switch` is a native `<input type="checkbox" role="switch">` drawn as a sliding toggle, with the element's text
as its label. Use it for a setting that takes effect right away; use [Checkbox](/components/checkbox) for choices
that are confirmed later with a submit button.

It is form-associated: when on, it submits its `value` (or `on`) under its `name`, like a checkbox.

```html live
<ui-switch>Airplane mode</ui-switch>
```

## Examples

### Checked

```html live
<ui-switch checked>Wi-Fi</ui-switch>
```

### Small

```html live
<ui-switch size="sm" checked>Compact mode</ui-switch>
```

### Disabled

```html live
<ui-switch disabled>Bluetooth</ui-switch>
<ui-switch disabled checked>Location</ui-switch>
```

### Without visible text

```html live
<ui-switch aria-label="Dark mode"></ui-switch>
```

### Listening for changes

```html live
<custom-element name="switch-change-demo">
  <script type="realm">
    const sync = useState({ status: "Sync is paused." });

    function changed(control) {
      sync.status = control.checked ? "Sync is running." : "Sync is paused.";
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

  <ui-switch onchange="changed(this)">Sync files</ui-switch>
  <p role="status"><slot name="#sync.status"></slot></p>
</custom-element>
<switch-change-demo></switch-change-demo>
```

### In a form

Only switches that are on are submitted. Reset restores the `checked` attribute.

```html live
<custom-element name="switch-form-demo">
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
      justify-items: start;
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
    <ui-switch name="email" checked>Email notifications</ui-switch>
    <ui-switch name="push" value="enabled">Push notifications</ui-switch>
    <div class="actions">
      <ui-button type="submit">Save</ui-button>
      <ui-button type="reset" variant="outline">Reset</ui-button>
    </div>
  </form>
  <output><slot name="#result.text"></slot></output>
</custom-element>
<switch-form-demo></switch-form-demo>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | boolean | `false` | Whether the switch is on. The attribute is the initial and reset state. |
| `value` | string | | Value submitted when on. Without it the form submits `on`. |
| `size` | `"default"` \| `"sm"` | `"default"` | Track and thumb size. |
| `disabled` | boolean | `false` | Disables the switch. Also true inside a disabled `<fieldset>`. |
| `aria-label` | string | | Accessible name when there is no visible text. Property name: `label`. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `checked` | boolean | Current state. Updated when the user toggles; setting it moves the switch. |

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `change` | none | Bubbles from the element after the user toggles. `checked` is already updated. |
| `input` | none | The inner checkbox's native `input` event (composed). |

### Slots

| Slot | Description |
| --- | --- |
| (default) | The label text, rendered inside a native `<label>` for the switch. |

### CSS parts

| Part | Description |
| --- | --- |
| `control` | The inner `<input type="checkbox" role="switch">`. |
| `label` | The `<label>` around the slotted text. |

### CSS states

| State | Description |
| --- | --- |
| `:state(attr-checked)` | Set while the switch is on. |
| `:state(attr-size-is-sm)` | Set for the small size. |

### Forms

`ui-switch` is form-associated. When on it submits `value`, or `on` without one; when off it submits nothing.
`form.reset()` restores the `checked` attribute.

### Accessibility

The inner checkbox has `role="switch"` and `aria-checked`, so screen readers announce it as on or off. Space toggles
it and the host delegates focus to it. The slotted text labels it; without text, use `aria-label`.
