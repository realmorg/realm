---
title: Input Group
description: A form-associated text input with start and end addons inside one border, for prefixes, suffixes, icons and inline buttons.
group: Forms
order: 108
nav: Input Group
---

# Input Group

`ui-input-group` draws one bordered box with a native `<input>` in the middle and optional addons before and after
it: a URL prefix, a currency symbol, a search icon, a unit or a small button. Each addon is a
`ui-input-group-addon` child; `align` puts it before (`inline-start`, the default) or after (`inline-end`) the input,
whatever its position in the source. The whole box shows the focus ring when the input is focused, and it fills the
width of its container.

It is form-associated: only the text you type is submitted, not the addon text.

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

### In a form

The input's value is submitted under the element's `name`; the addons are not. `required` takes part in validation,
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
| `disabled` | boolean | `false` | Disables the input. Also true inside a disabled `<fieldset>`. |
| `required` | boolean | `false` | The form is invalid while the value is empty. |
| `name` | string | | Form field name the value is submitted under. |
| `aria-label` | string | | Accessible name, passed to the inner input. Property name: `label`. |

#### ui-input-group-addon

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `"inline-start"` \| `"inline-end"` | `"inline-start"` | Places the addon before or after the input. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `value` | string | Current value. Updated as the user types; setting it updates the field. |

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

`ui-input-group` is form-associated. It submits the input's `value` under its `name`; addon content is never
submitted. Validity comes from the inner input (`required` and `type`), Enter submits the form, `form.reset()`
restores the `value` attribute, and a disabled `<fieldset>` disables the input.

### Accessibility

The host delegates focus to the inner input. Addons are not part of the input's accessible name, so name the field
with `aria-label`, `ui-label for` or a wrapping `<label>`, and mark decorative icons `aria-hidden="true"`.
