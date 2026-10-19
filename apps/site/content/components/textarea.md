---
title: Textarea
description: A form-associated multi-line text field that wraps a native textarea and grows with its content.
group: Forms
order: 115
nav: Textarea
---

# Textarea

`ui-textarea` wraps a native `<textarea>`. It starts at `rows` lines, grows with its content in browsers that support
`field-sizing: content`, and can be resized vertically. It is form-associated: its `value` is submitted under its
`name`, and its validity is the inner textarea's validity.

```html live
<div class="demo-narrow">
  <ui-textarea aria-label="Message" placeholder="Type your message here."></ui-textarea>
</div>
```

## Examples

### With a label and description

```html live
<div class="demo-narrow">
  <ui-field>
    <ui-label for="textarea-bio">Bio</ui-label>
    <ui-textarea id="textarea-bio" rows="4" maxlength="160" placeholder="Tell us a little about yourself"></ui-textarea>
    <ui-field-description>Up to 160 characters.</ui-field-description>
  </ui-field>
</div>
```

### Disabled and read-only

```html live
<div class="demo-narrow demo-stack-tight">
  <ui-textarea aria-label="Disabled" placeholder="Disabled" disabled></ui-textarea>
  <ui-textarea aria-label="Release notes" value="Version 2.0 replaces the template syntax with native slots." readonly></ui-textarea>
</div>
```

### Invalid

`invalid` sets `aria-invalid` and a destructive border, for errors you detect yourself.

```html live
<div class="demo-narrow">
  <ui-textarea aria-label="Feedback" value="Too short" invalid></ui-textarea>
</div>
```

### Character count

Listen for `input` to react while the user types.

```html live
<custom-element name="textarea-count-demo">
  <script type="realm">
    const note = useState({ length: 0 });

    function typed(field) {
      note.length = field.value.length;
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      width: 100%;
      max-width: calc(var(--spacing) * 96);
    }
    p {
      margin: 0;
      justify-self: end;
      font-size: var(--text-xs);
      color: var(--muted-foreground);
    }
  </style>

  <ui-textarea aria-label="Note" maxlength="200" placeholder="Write a note" oninput="typed(this)"></ui-textarea>
  <p><slot name="#note.length"></slot> / 200</p>
</custom-element>
<textarea-count-demo></textarea-count-demo>
```

### In a form

The text, including line breaks, is submitted under `name`. `required` and `minlength` block submission with the
browser's messages, and reset returns to the `value` attribute. Enter adds a new line; it does not submit.

```html live
<custom-element name="textarea-form-demo">
  <script type="realm">
    const result = useState({ text: "Submit the form to see its data." });

    function submit(event) {
      event.preventDefault();
      result.text = [...new FormData(event.target)].map(([name, value]) => `${name}=${JSON.stringify(value)}`).join("\n");
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
      max-width: calc(var(--spacing) * 96);
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
    <ui-textarea name="review" aria-label="Review" rows="3" minlength="10" required placeholder="What did you think?"></ui-textarea>
    <div class="actions">
      <ui-button type="submit">Post review</ui-button>
      <ui-button type="reset" variant="outline">Reset</ui-button>
    </div>
  </form>
  <output><slot name="#result.text"></slot></output>
</custom-element>
<textarea-form-demo></textarea-form-demo>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | string | `""` | Current text. The attribute is the initial and reset value. |
| `placeholder` | string | | Placeholder text. |
| `rows` | number | `3` | Visible lines before the field grows. An integer of at least 1. |
| `minlength` | number | | Minimum length. |
| `maxlength` | number | | Maximum length. |
| `disabled` | boolean | `false` | Disables the textarea. Also true inside a disabled `<fieldset>`. |
| `readonly` | boolean | `false` | Makes the text read-only. |
| `required` | boolean | `false` | The form is invalid while the text is empty. |
| `invalid` | boolean | `false` | Sets `aria-invalid="true"` and the error style. Does not affect validity. |
| `aria-label` | string | | Accessible name, passed to the inner textarea. Property name: `label`. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `value` | string | Current text. Updated as the user types; setting it updates the field. |

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `input` | none | The inner textarea's native `input` event (composed). |
| `change` | none | Dispatched from the element (bubbling) when the inner textarea fires `change`, after it loses focus. |

### CSS parts

| Part | Description |
| --- | --- |
| `textarea` | The inner native `<textarea>`. |

### Forms

`ui-textarea` is form-associated and submits `value` under its `name`. Validity is mirrored from the inner
textarea, so `required`, `minlength` and `maxlength` take part in `checkValidity()` and `reportValidity()`.
`form.reset()` restores the `value` attribute, and a disabled `<fieldset>` disables the field.

### Accessibility

The host delegates focus to the inner textarea. Name it with `aria-label`, `ui-label for` or a wrapping `<label>`.
