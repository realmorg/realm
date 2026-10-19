---
title: Label
description: A text label that names a form control by id, focuses it on click and toggles checkboxes and switches.
group: Forms
order: 110
nav: Label
---

# Label

`ui-label` is a styled caption for a form control. A native `<label for>` cannot reach a control inside another
element's shadow root, so `ui-label` does the work itself: with `for` set to the id of a control, it copies its text
to the control's `aria-label` (unless the control already has one), focuses the control when the label text is
clicked, and toggles it when it is a checkbox, radio or switch.

It works with native controls and with `ui-*` controls such as `ui-input`, `ui-checkbox` and `ui-switch`.

```html live
<div class="demo-narrow demo-stack-tight">
  <ui-label for="label-email">Email</ui-label>
  <ui-input id="label-email" type="email" placeholder="m@example.com"></ui-input>
</div>
```

## Examples

### With a checkbox or switch

Clicking the label text toggles the control, like a native label.

```html live
<div class="demo-stack">
  <div class="demo-row-tight">
    <ui-checkbox id="label-terms"></ui-checkbox>
    <ui-label for="label-terms">Accept terms and conditions</ui-label>
  </div>
  <div class="demo-row-tight">
    <ui-switch id="label-airplane"></ui-switch>
    <ui-label for="label-airplane">Airplane mode</ui-label>
  </div>
</div>
```

### With a native control

```html live
<div class="demo-stack-tight">
  <ui-label for="label-native">Notes</ui-label>
  <textarea id="label-native" rows="2"></textarea>
</div>
```

### In a field

Inside a `ui-field`, the label is a plain child placed before the control.

```html live
<div class="demo-narrow">
  <ui-field>
    <ui-label for="label-company">Company</ui-label>
    <ui-input id="label-company" autocomplete="organization"></ui-input>
  </ui-field>
</div>
```

### In a form

The label is not submitted. It names the controls whose values are, and clicking it works inside a form the same
way.

```html live
<custom-element name="label-form-demo">
  <script type="realm">
    const result = useState({ text: "Submit the form to see its data." });

    function submit(event) {
      event.preventDefault();
      const entries = [...new FormData(event.target)].map(([name, value]) => `${name}=${value}`);
      result.text = entries.join("\n") || "(nothing submitted)";
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
    .row {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 2);
    }
    ui-input {
      width: 100%;
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

  <form onsubmit="submit(event)">
    <ui-label for="label-form-city">City</ui-label>
    <ui-input id="label-form-city" name="city" value="Lisbon"></ui-input>
    <div class="row">
      <ui-checkbox id="label-form-news" name="newsletter" value="yes"></ui-checkbox>
      <ui-label for="label-form-news">Send me the newsletter</ui-label>
    </div>
    <ui-button type="submit">Save</ui-button>
  </form>
  <output><slot name="#result.text"></slot></output>
</custom-element>
<label-form-demo></label-form-demo>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `for` | string | | Id of the control to label, looked up in the label's own document or shadow root. |

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-label` | (default) | The label text, and optionally an icon, in a `<span>` that handles the click. Inside `ui-field` it is a plain child. |

The default slot takes any content.

### CSS parts

| Part | Description |
| --- | --- |
| `label` | The `<span>` around the slotted text. It handles the click. |

### CSS states

| State | Description |
| --- | --- |
| `:state(attr-for)` | Set while `for` is present. The label then shows a pointer cursor. |

### Accessibility

`ui-label` is not a native `<label>`, so the browser does not link it to the control. Instead, when the label is
connected it sets the target's `aria-label` to the label text, unless the target already has an `aria-label`. The
text is copied once; changing the label text later does not update it.

Only the label text responds to clicks. The target must exist when the label is connected and be in the same document
or shadow root.
