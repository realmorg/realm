---
title: Select
description: A styled, form-associated native select that mirrors its option children, with an optional placeholder and validation.
group: Forms
order: 112
nav: Select
---

# Select

`ui-select` renders a native `<select>` and copies its `<option>` children into it, so you get the platform's own
picker, keyboard handling and mobile UI with the theme's styling. It is form-associated: the chosen option's
`value` is submitted under the element's `name`.

Without a `placeholder`, the select behaves like a native one: the option marked `selected`, or else the first
option, is chosen from the start. It fills the width of its container; `width` gives it a fixed width instead.

```html live
<ui-select aria-label="Fruit" width="48">
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="blueberry">Blueberry</option>
  <option value="grapes">Grapes</option>
</ui-select>
```

## Examples

### Placeholder

`placeholder` adds an empty first entry that cannot be picked again once a real option is chosen. Combine it with
`required` to make the user choose.

```html live
<ui-select aria-label="Time zone" placeholder="Select a time zone" width="60">
  <option value="utc">UTC</option>
  <option value="cet">Central European Time</option>
  <option value="jst">Japan Standard Time</option>
</ui-select>
```

### Selected option

Set `value` on the element, or `selected` on an option.

```html live
<div class="demo-row">
  <ui-select aria-label="Role" value="editor" width="40">
    <option value="viewer">Viewer</option>
    <option value="editor">Editor</option>
    <option value="admin">Admin</option>
  </ui-select>
  <ui-select aria-label="Status" width="40">
    <option value="todo">To do</option>
    <option value="doing" selected>In progress</option>
    <option value="done">Done</option>
  </ui-select>
</div>
```

### Small

```html live
<ui-select aria-label="Rows per page" size="sm" value="25" width="20">
  <option value="10">10</option>
  <option value="25">25</option>
  <option value="50">50</option>
</ui-select>
```

### Disabled

```html live
<div class="demo-row">
  <ui-select aria-label="Region" disabled width="40">
    <option value="eu">Europe</option>
  </ui-select>
  <ui-select aria-label="Plan" width="40">
    <option value="free">Free</option>
    <option value="pro">Pro</option>
    <option value="enterprise" disabled>Enterprise</option>
  </ui-select>
</div>
```

### Width

By default the select fills its container, like the inputs it sits next to in a form. `width` sets a fixed width in
spacing units: `width="40"` is `calc(var(--spacing) * 40)`.

```html live
<div class="demo-stack">
  <ui-select aria-label="Fills the container">
    <option value="full">Fills the container</option>
  </ui-select>
  <ui-select aria-label="Fixed width" width="40">
    <option value="fixed">width="40"</option>
  </ui-select>
</div>
```

### Options from state

The select watches its `<option>` children, so options rendered with `repeat` stay in sync.

```html live
<custom-element name="select-state-demo">
  <script type="realm">
    const picker = useState({
      languages: [
        { code: "en", name: "English" },
        { code: "de", name: "Deutsch" },
        { code: "id", name: "Bahasa Indonesia" },
      ],
      chosen: "en",
    });

    function changed(select) {
      picker.chosen = select.value;
    }
  </script>

  <style type="realm">
    :host {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 3);
    }
    p {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--muted-foreground);
    }
  </style>

  <ui-select aria-label="Language" value="en" onchange="changed(this)">
    <option repeat="#picker.languages" as="language" key="code" _value="#language.code"><slot name="#language.name"></slot></option>
  </ui-select>
  <p>value: <slot name="#picker.chosen"></slot></p>
</custom-element>
<select-state-demo></select-state-demo>
```

### In a form

The chosen value is submitted under `name`. `required` with a placeholder blocks submission until an option is
chosen, and reset returns to the `value` attribute (or the placeholder).

```html live
<custom-element name="select-form-demo">
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
    <ui-select name="country" aria-label="Country" placeholder="Choose a country" required>
      <option value="BR">Brazil</option>
      <option value="DE">Germany</option>
      <option value="JP">Japan</option>
    </ui-select>
    <ui-select name="currency" aria-label="Currency" value="EUR">
      <option value="USD">US dollar</option>
      <option value="EUR">Euro</option>
      <option value="JPY">Yen</option>
    </ui-select>
    <div class="actions">
      <ui-button type="submit">Save</ui-button>
      <ui-button type="reset" variant="outline">Reset</ui-button>
    </div>
  </form>
  <output><slot name="#result.text"></slot></output>
</custom-element>
<select-form-demo></select-form-demo>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-select` | | A native `<select>` styled like an input, with a chevron. Fills its container's width unless `width` is set. |
| `<option>` | (data) | One choice, copied into the native select. |

The select keeps the native `<option>` children rather than separate item parts, so the platform picker, keyboard
handling and mobile UI keep working.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | string | `""` | The `value` of the chosen option. |
| `placeholder` | string | | Text of an empty, unselectable first entry. Without it, the first or `selected` option is chosen automatically. |
| `size` | `"default"` \| `"sm"` | `"default"` | Height of the select. |
| `width` | number | | Fixed width in spacing units: `n` means `calc(var(--spacing) * n)`. Without it the select fills its container. |
| `disabled` | boolean | `false` | Disables the select. Also true inside a disabled `<fieldset>`. |
| `required` | boolean | `false` | The form is invalid while the placeholder is shown. |
| `aria-label` | string | | Accessible name, passed to the inner select. Property name: `label`. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `value` | string | The chosen value. Setting it selects the matching option. |

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `change` | none | Dispatched from the element (bubbling) after the user picks an option. |
| `input` | none | The inner select's native `input` event (composed). |

### Child elements

| Element | Attributes read | Description |
| --- | --- | --- |
| `<option>` | `value`, `label` (or text), `disabled`, `selected` | One choice. Options are copied into the inner select and kept in sync. `selected` only picks the initial option when there is no `placeholder` and no `value`. `<optgroup>` is not supported. |

### CSS parts

| Part | Description |
| --- | --- |
| `control` | The inner native `<select>`. |

### CSS states

| State | Description |
| --- | --- |
| `:state(attr-size-is-sm)` | Set for the small size. |

### Forms

`ui-select` is form-associated. It submits `value` under its `name` (an empty string while the placeholder is
shown). Validity is mirrored from the inner select, so `required` with a placeholder reports `valueMissing` and the
validation bubble points at the select. `form.reset()` restores the `value` attribute; without one, the select goes
back to the placeholder, or to the first or `selected` option.

### Accessibility

The host delegates focus to the inner native `<select>`, which keeps the platform's keyboard support and picker.
Name it with `aria-label`, `ui-label for` or a wrapping `<label>`.
