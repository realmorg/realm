---
title: Input
description: A form-associated single-line text input that wraps a native input, with native types, constraints and validation.
group: Forms
order: 107
nav: Input
---

# Input

`ui-input` wraps a native `<input>` in its shadow root and passes the usual attributes through: `type`,
`placeholder`, `pattern`, `min`, `max`, `minlength` and the rest. It is form-associated, so its `value` is
submitted under its `name`, its validity is the inner input's validity, and pressing Enter submits the form as in
a native text field.

```html live
<div class="demo-narrow">
  <ui-input aria-label="Email" type="email" placeholder="Email"></ui-input>
</div>
```

## Examples

### Types

`type` accepts the text-like and date-like native types: `text`, `email`, `password`, `number`, `search`, `tel`,
`url`, `date`, `time`, `datetime-local`, `month`, `week` and `color`. For checkboxes, radios, ranges and files use
the dedicated components or a native input.

```html live
<div class="demo-narrow demo-stack-tight">
  <ui-input type="password" aria-label="Password" placeholder="Password"></ui-input>
  <ui-input type="number" aria-label="Quantity" value="2" min="1" max="10"></ui-input>
  <ui-input type="search" aria-label="Search" placeholder="Search…"></ui-input>
  <ui-input type="date" aria-label="Start date" value="2026-10-19"></ui-input>
  <ui-input type="time" aria-label="Start time" value="09:30" step="900"></ui-input>
</div>
```

### With a label

Use `ui-label for` (or a native `<label>` around the element) to name the input. Clicking the label focuses it.

```html live
<div class="demo-narrow demo-stack-tight">
  <ui-label for="input-name">Full name</ui-label>
  <ui-input id="input-name" autocomplete="name"></ui-input>
</div>
```

### Disabled and read-only

```html live
<div class="demo-narrow demo-stack-tight">
  <ui-input aria-label="Disabled" placeholder="Disabled" disabled></ui-input>
  <ui-input aria-label="API key" value="sk-live-4f9a" readonly></ui-input>
</div>
```

### Invalid

`invalid` sets `aria-invalid` on the inner input and draws a destructive border. Use it for errors you detect
yourself, such as a taken username. Native constraint errors are reported through validity instead.

To block the form as well, call `setCustomValidity(message)`, as on a native input, and clear it with an empty
string. `title` describes the format expected by `pattern` in the browser's own message.

```html live
<custom-element name="input-username-demo">
  <script type="realm">
    const TAKEN = new Set(["admin", "root"]);

    function check(field) {
      field.setCustomValidity(TAKEN.has(field.value) ? "That username is taken." : "");
    }

    function stay(event) {
      event.preventDefault();
    }
  </script>
  <form class="demo-narrow" onsubmit="stay(event)">
    <ui-input name="username" aria-label="Username" value="admin" pattern="[a-z]+" title="Lowercase letters only"
      oninput="check(this)"></ui-input>
    <ui-button type="submit">Check</ui-button>
  </form>
</custom-element>
<input-username-demo></input-username-demo>
```

```html live
<div class="demo-narrow">
  <ui-input aria-label="Username" value="admin" invalid></ui-input>
</div>
```

### Listening for input

`input` reaches the page from the inner field as you type, and `change` fires from the element when the value is
committed. Both run after `value` is updated.

```html live
<custom-element name="input-echo-demo">
  <script type="realm">
    const echo = useState({ text: "" });

    function typed(field) {
      echo.text = field.value;
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      width: 100%;
      max-width: calc(var(--spacing) * 80);
    }
    p {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--muted-foreground);
    }
  </style>

  <ui-input aria-label="Message" placeholder="Type something" oninput="typed(this)"></ui-input>
  <p>You typed: <slot name="#echo.text"></slot></p>
</custom-element>
<input-echo-demo></input-echo-demo>
```

### In a form

Constraint attributes (`required`, `type="email"`, `minlength`, `pattern`, `min`, `max`) block submission with the
browser's own messages. Enter inside a field submits the form. Reset returns each input to its `value` attribute.

```html live
<custom-element name="input-form-demo">
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

  <form onsubmit="stay(event)" onreset="reset()">
    <ui-input name="email" type="email" aria-label="Email" placeholder="Email" required></ui-input>
    <ui-input name="handle" aria-label="Handle" value="realm" minlength="3" pattern="[a-z0-9_]+"></ui-input>
    <ui-input name="seats" type="number" aria-label="Seats" value="5" min="1" max="50"></ui-input>
    <div class="actions">
      <ui-button type="submit">Create</ui-button>
      <ui-button type="reset" variant="outline">Reset</ui-button>
    </div>
  </form>
  <output><slot name="#result.text"></slot></output>
</custom-element>
<input-form-demo></input-form-demo>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | string | | Form field name the value is submitted under. Also the `name` property, which reflects to the attribute like a native control's. |
| `value` | string | `""` | Current value. The attribute is the initial and reset value. |
| `type` | `"text"` \| `"email"` \| `"password"` \| `"number"` \| `"search"` \| `"tel"` \| `"url"` \| `"date"` \| `"time"` \| `"datetime-local"` \| `"month"` \| `"week"` \| `"color"` | `"text"` | Native input type. |
| `placeholder` | string | | Placeholder text. |
| `autocomplete` | string | | Native autofill hint. |
| `inputmode` | string | | Virtual keyboard hint. |
| `pattern` | string | | Regular expression the value must match. |
| `min` | string | | Minimum for number and date types. |
| `max` | string | | Maximum for number and date types. |
| `step` | string | | Step for number and date types. |
| `minlength` | number | | Minimum length. |
| `maxlength` | number | | Maximum length. |
| `disabled` | boolean | `false` | Disables the input. Also true inside a disabled `<fieldset>`. |
| `readonly` | boolean | `false` | Makes the value read-only. |
| `required` | boolean | `false` | The form is invalid while the value is empty. |
| `invalid` | boolean | `false` | Sets `aria-invalid="true"` and the error style. Does not affect validity. |
| `aria-label` | string | | Accessible name, passed to the inner input. Property name: `label`. |
| `title` | string | | Passed to the inner input. Browsers add it to the message shown when `pattern` does not match, so use it to describe the expected format. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `value` | string | Current value. Updated as the user types. Setting it updates the field and the submitted value. |

Every attribute above is also a property with the same name in camelCase (`label` for `aria-label`).

### Methods

| Method | Description |
| --- | --- |
| `setCustomValidity(message)` | Like the native method: a non-empty `message` makes the field and its form invalid with that message, and an empty string clears it. The message stays until you clear it. |

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `input` | none | The inner input's native `input` event, which is composed and reaches the page. |
| `change` | none | Dispatched from the element (bubbling) when the inner input fires `change`. |

### CSS parts

| Part | Description |
| --- | --- |
| `input` | The inner native `<input>`. |

### Forms

`ui-input` is form-associated. It submits `value` under its `name`. Validity is mirrored from the inner input, so
`required`, `type`, `pattern`, `minlength`, `maxlength`, `min`, `max` and `step` all take part in `checkValidity()`
and `reportValidity()`, and the validation bubble points at the inner field. `setCustomValidity(message)` adds a
custom error on top. Enter submits the form for the
text-like types. `form.reset()` restores the `value` attribute, and a disabled `<fieldset>` disables the input.

### Accessibility

The host delegates focus to the inner input. Name it with `aria-label`, `ui-label for`, or a native `<label>`
wrapped around the element. A `ui-label for` points the inner input's `aria-labelledby` at itself, and a native label's
text is copied to the inner input's `aria-label`. Neither adds attributes to the `<ui-input>` host, so libraries that
patch or hydrate the page see the markup they rendered.
