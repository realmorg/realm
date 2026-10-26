---
title: Input Group
description: A form-associated text input with start and end addons inside one border, for prefixes, suffixes, icons and inline buttons.
group: Forms
order: 108
nav: Input Group
---

# Input Group

`ui-input-group` draws one bordered box with a native `<input>` in the middle and optional addons before and after
it, such as a URL prefix, a currency symbol, a search icon, a unit or a small button. Each addon is a
`ui-input-group-addon` child. `align` puts it before (`inline-start`, the default) or after (`inline-end`) the input,
whatever its position in the source. The whole box shows the focus ring when the input is focused, and it fills the
width of its container.

It is form-associated. Only the text you type is submitted, not the addon text.

```html live
<div class="demo-narrow">
  <ui-input-group aria-label="Website" placeholder="example.com">
    <ui-input-group-addon>https://</ui-input-group-addon>
  </ui-input-group>
</div>
```

## Examples

### Icon addon

An `<svg>` in an addon is sized to `calc(var(--spacing) * 4)`.

```html live
<div class="demo-narrow">
  <ui-input-group type="search" aria-label="Search" placeholder="Search documentation…">
    <ui-input-group-addon>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
    </ui-input-group-addon>
  </ui-input-group>
</div>
```

### Start and end addons

```html live
<div class="demo-narrow">
  <ui-input-group type="number" aria-label="Price" value="49">
    <ui-input-group-addon>$</ui-input-group-addon>
    <ui-input-group-addon align="inline-end">USD</ui-input-group-addon>
  </ui-input-group>
</div>
```

### Button addon

Put a small ghost button in an `inline-end` addon, for example to copy the value. Use `size="icon-xs"` for an
icon-only button and give it an `aria-label`.

```html live
<custom-element name="input-group-copy-demo">
  <script type="realm">
    const clip = useState({ label: "Copy" });

    async function copy() {
      await navigator.clipboard?.writeText(refs.link.value).catch(() => {});
      clip.label = "Copied";
    }
  </script>

  <style type="realm">
    :host {
      display: block;
      width: 100%;
      max-width: calc(var(--spacing) * 96);
    }
  </style>

  <ui-input-group ref="link" aria-label="Invite link" value="https://realm.dev/invite/8f2k">
    <ui-input-group-addon align="inline-end">
      <ui-button size="xs" variant="ghost" onclick="copy()"><slot name="#clip.label"></slot></ui-button>
    </ui-input-group-addon>
  </ui-input-group>
</custom-element>
<input-group-copy-demo></input-group-copy-demo>
```

### Disabled

```html live
<div class="demo-narrow">
  <ui-input-group aria-label="Username" value="ada" disabled>
    <ui-input-group-addon>@</ui-input-group-addon>
  </ui-input-group>
</div>
```

### Constraints

`ui-input-group` forwards the same input attributes as `ui-input`, such as `pattern`, `minlength`, `maxlength`
and `autocomplete`.

```html live
<div class="demo-narrow">
  <ui-input-group aria-label="Handle" pattern="[a-z0-9-]+" minlength="3" maxlength="20" autocomplete="username"
    title="Lowercase letters, digits and dashes">
    <ui-input-group-addon>@</ui-input-group-addon>
  </ui-input-group>
</div>
```

### In a form

The input's value is submitted under the element's `name`, but the addons are not. `required` takes part in validation,
Enter submits the form, and reset restores the `value` attribute.

```html live
<custom-element name="input-group-form-demo">
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

  <form onsubmit="submit(event)" onreset="reset()">
    <ui-input-group name="subdomain" aria-label="Subdomain" value="acme" required>
      <ui-input-group-addon>https://</ui-input-group-addon>
      <ui-input-group-addon align="inline-end">.realm.dev</ui-input-group-addon>
    </ui-input-group>
    <ui-input-group name="budget" type="number" aria-label="Budget" value="1200">
      <ui-input-group-addon>$</ui-input-group-addon>
    </ui-input-group>
    <div class="actions">
      <ui-button type="submit">Save</ui-button>
      <ui-button type="reset" variant="outline">Reset</ui-button>
    </div>
  </form>
  <output><slot name="#result.text"></slot></output>
</custom-element>
<input-group-form-demo></input-group-form-demo>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-input-group` | (root) | The bordered box with the native `<input>`. |
| `ui-input-group-addon` | (default) | Text, icons or buttons before or after the input, in muted colour. |

The default slot of each part takes any content.

### Attributes

#### ui-input-group

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | string | `""` | Current value. The attribute is the initial and reset value. |
| `type` | `"text"` \| `"email"` \| `"password"` \| `"number"` \| `"search"` \| `"tel"` \| `"url"` | `"text"` | Native input type. |
| `placeholder` | string | | Placeholder text. |
| `autocomplete` | string | | Autofill hint, passed to the inner input. |
| `inputmode` | string | | Virtual keyboard hint, passed to the inner input. |
| `pattern` | string | | Regular expression the value must match. |
| `min`, `max`, `step` | string | | Range and step for `type="number"`. |
| `minlength` | number | | Minimum length. |
| `maxlength` | number | | Maximum length. |
| `disabled` | boolean | `false` | Disables the input. Also true inside a disabled `<fieldset>`. |
| `readonly` | boolean | `false` | Makes the value read-only. |
| `required` | boolean | `false` | The form is invalid while the value is empty. |
| `invalid` | boolean | `false` | Sets `aria-invalid="true"` on the input and draws the error style on the group. Does not affect validity. |
| `title` | string | | Passed to the inner input. Browsers add it to the message shown when `pattern` does not match. |
| `name` | string | | Form field name the value is submitted under. Also the `name` property, which reflects to the attribute like a native control's. |
| `aria-label` | string | | Accessible name, passed to the inner input. Property name: `label`. |

#### ui-input-group-addon

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `"inline-start"` \| `"inline-end"` | `"inline-start"` | Places the addon before or after the input. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `value` | string | Current value. Updated as the user types. Setting it updates the field. |

### Methods

| Method | Description |
| --- | --- |
| `setCustomValidity(message)` | Like the native method: a non-empty `message` makes the field and its form invalid with that message, and an empty string clears it. |

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `input` | none | The inner input's native `input` event (composed). |
| `change` | none | Dispatched from the element (bubbling) when the inner input fires `change`. |

### CSS parts

| Part | Description |
| --- | --- |
| `input` | The inner native `<input>`. |

### Forms

`ui-input-group` is form-associated. It submits the input's `value` under its `name`. Addon content is never
submitted. Validity comes from the inner input (`required`, `type`, `pattern`, `minlength`, `maxlength`, `min`, `max` and
`step`), plus any message set with `setCustomValidity(message)`, which works like the native method. Enter submits the form, `form.reset()`
restores the `value` attribute, and a disabled `<fieldset>` disables the input.

### Accessibility

The host delegates focus to the inner input. Addons are not part of the input's accessible name, so name the field
with `aria-label`, `ui-label for` or a wrapping `<label>`, and mark decorative icons `aria-hidden="true"`.
