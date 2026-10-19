---
title: Input OTP
description: A one-time code input with one box per character, paste support and a complete event, that submits the whole code with its form.
group: Forms
order: 109
nav: Input OTP
---

# Input OTP

`ui-input-otp` shows one native `<input>` per character of a verification code. Typing moves to the next box,
Backspace moves back, and pasting a whole code fills every box at once. Characters that do not match `pattern` are
ignored. The boxes use `autocomplete="one-time-code"`, so browsers can offer a code received by SMS.

It is form-associated: the code is the element's `value` and is submitted under its `name`.

```html live
<ui-input-otp></ui-input-otp>
```

## Examples

### Length and separator

`length` sets the number of boxes (1 to 12). `separator` adds a gap every that many boxes, for codes read in groups.

```html live
<ui-input-otp length="6" separator="3"></ui-input-otp>
<ui-input-otp length="4"></ui-input-otp>
```

### Pattern

`pattern` is a regular expression for a single character. The default accepts digits. This one accepts letters and
digits, for a recovery code.

```html live
<ui-input-otp length="8" separator="4" pattern="[A-Za-z0-9]"></ui-input-otp>
```

### Disabled

```html live
<ui-input-otp value="1234" length="4" disabled></ui-input-otp>
```

### Complete event

`complete` fires once every box is filled, with the code in `event.detail.value`. `change` fires after every edit.

```html live
<custom-element name="input-otp-verify-demo">
  <script type="realm">
    const verify = useState({ status: "Enter the code. Try 424242." });

    function complete(event) {
      verify.status = event.detail.value === "424242" ? "Code verified." : "That code is not valid.";
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
      justify-items: center;
    }
    p {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--muted-foreground);
    }
  </style>

  <ui-input-otp length="6" separator="3" oncomplete="complete(event)"></ui-input-otp>
  <p role="status"><slot name="#verify.status"></slot></p>
</custom-element>
<input-otp-verify-demo></input-otp-verify-demo>
```

### In a form

The whole code is submitted as one value, even while it is incomplete. Reset
restores the `value` attribute.

```html live
<custom-element name="input-otp-form-demo">
  <script type="realm">
    const result = useState({ text: "Submit the form to see its data." });

    function submit(event) {
      event.preventDefault();
      result.text = [...new FormData(event.target)].map(([name, value]) => `${name}=${value}`).join("\n");
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
    <ui-input-otp name="code" length="6" separator="3"></ui-input-otp>
    <div class="actions">
      <ui-button type="submit">Verify</ui-button>
      <ui-button type="reset" variant="outline">Clear</ui-button>
    </div>
  </form>
  <output><slot name="#result.text"></slot></output>
</custom-element>
<input-otp-form-demo></input-otp-form-demo>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | string | `""` | The code entered so far. The attribute is the initial and reset value. |
| `length` | number | `6` | Number of boxes. An integer from 1 to 12. |
| `pattern` | string | `"[0-9]"` | Regular expression that a single character must match. |
| `separator` | number | `0` | Adds a gap before every box whose index is a multiple of this number. `0` means no gaps. |
| `disabled` | boolean | `false` | Disables every box. Also true inside a disabled `<fieldset>`. |
| `required` | boolean | `false` | The form is invalid until all boxes are filled. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `value` | string | The current code. Setting it fills the boxes. |

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `change` | none | Fired after each typed, pasted or deleted character. |
| `complete` | `{ value: string }` | Fired when the code reaches `length` characters. |

`complete` is a custom event name. Handle it with `oncomplete` inside a component's markup, as in the example above,
or with `addEventListener("complete", …)`.

### CSS parts

| Part | Description |
| --- | --- |
| `group` | The row of boxes (`role="group"`). |
| `slot` | Each character box. Boxes that start a new group carry `data-gap`. |

### Forms

`ui-input-otp` is form-associated and submits `value` under its `name`, even when it is incomplete. With `required`
it reports `valueMissing` with the message "Enter the full code." until all boxes are filled; the validation bubble
points at the first empty box, which takes focus. `form.reset()` restores the `value` attribute.

### Accessibility

Each box is a native text input labelled "Character N of M" and uses `inputmode="numeric"`, so phones show a number
pad. The boxes are wrapped in an element with `role="group"`.

| Key | Action |
| --- | --- |
| Character | Fills the box and moves to the next one. |
| Backspace | Clears the box, or the previous box when this one is empty, and focuses it. |
| Arrow Left / Arrow Right | Moves to the previous or next box. |
| Paste | Fills the boxes from the focused one onward with the matching characters. |
