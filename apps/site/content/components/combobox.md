---
title: Combobox
description: A searchable, form-associated select that filters native option children as you type and submits the chosen value.
group: Forms
order: 105
nav: Combobox
---

# Combobox

`ui-combobox` is a text input with a filterable list of choices, following the ARIA combobox pattern. The choices
are plain `<option>` elements written as children, like in a `<select>`. Typing filters them by label, and picking
one sets the element's `value`. The list is a native manual popover, so it renders in the top layer. It opens when
the input is focused or clicked, and closes on Escape, on a choice and when focus leaves the input.

It is form-associated. With a `name`, the chosen option's `value` is submitted with the form. Like a native form
control in a form field, it fills the width of its container. `width` gives it a fixed width instead.

```html live
<ui-combobox aria-label="Framework" placeholder="Select a framework…" width="60">
  <option value="realm">REALM</option>
  <option value="lit">Lit</option>
  <option value="stencil">Stencil</option>
  <option value="fast">FAST</option>
  <option value="vanilla">Vanilla custom elements</option>
</ui-combobox>
```

## Examples

### Preselected value

Set `value` to the `value` of one of the options. The input shows that option's label.

```html live
<ui-combobox aria-label="Time zone" value="europe-berlin">
  <option value="america-new-york">New York (UTC-5)</option>
  <option value="europe-london">London (UTC+0)</option>
  <option value="europe-berlin">Berlin (UTC+1)</option>
  <option value="asia-tokyo">Tokyo (UTC+9)</option>
</ui-combobox>
```

### Disabled options

A `disabled` option is shown dimmed and cannot be chosen.

```html live
<ui-combobox aria-label="Plan" placeholder="Choose a plan…">
  <option value="free">Free</option>
  <option value="pro">Pro</option>
  <option value="enterprise" disabled>Enterprise (contact sales)</option>
</ui-combobox>
```

### Option labels

The visible text comes from the option's `label` attribute, or its text when there is no `label`, as with native
options. Filtering matches the label.

```html live
<ui-combobox aria-label="Country" placeholder="Search countries…">
  <option value="DE" label="Germany">DE</option>
  <option value="FR" label="France">FR</option>
  <option value="JP" label="Japan">JP</option>
  <option value="BR" label="Brazil">BR</option>
</ui-combobox>
```

### Empty state

`ui-combobox-empty` replaces the default "No results found." text shown when nothing matches the query.

```html live
<ui-combobox aria-label="Language" width="60">
  <option value="en">English</option>
  <option value="es">Spanish</option>
  <option value="id">Indonesian</option>
  <ui-combobox-empty>No language matches that search.</ui-combobox-empty>
</ui-combobox>
```

### Width

By default the combobox fills its container. `width` sets a fixed width in spacing units, so `width="48"` is
`calc(var(--spacing) * 48)`.

```html live
<div class="demo-stack">
  <ui-combobox aria-label="Fruit" placeholder="Fills the container">
    <option value="apple">Apple</option>
  </ui-combobox>
  <ui-combobox aria-label="Fruit" placeholder="width=48" width="48">
    <option value="apple">Apple</option>
  </ui-combobox>
</div>
```

### Disabled

```html live
<ui-combobox aria-label="Framework" value="realm" disabled>
  <option value="realm">REALM</option>
</ui-combobox>
```

### Dynamic options

The combobox watches its `<option>` children, so options rendered from state with `repeat` show up in the list.

```html live
<custom-element name="combobox-dynamic-demo">
  <script type="realm">
    const catalog = useState({
      fruits: [
        { id: "apple", name: "Apple" },
        { id: "banana", name: "Banana" },
      ],
      chosen: "",
    });

    function addCherry() {
      if (catalog.fruits.some((fruit) => fruit.id === "cherry")) return;
      catalog.fruits = [...catalog.fruits, { id: "cherry", name: "Cherry" }];
    }

    function changed(combobox) {
      catalog.chosen = combobox.value;
    }
  </script>

  <style type="realm">
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: calc(var(--spacing) * 3);
    }
    p {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--muted-foreground);
    }
  </style>

  <ui-combobox aria-label="Fruit" placeholder="Pick a fruit…" onchange="changed(this)">
    <option repeat="#catalog.fruits" as="fruit" key="id" _value="#fruit.id" _label="#fruit.name"></option>
  </ui-combobox>
  <ui-button variant="outline" onclick="addCherry()">Add cherry</ui-button>
  <p>value: <slot name="#catalog.chosen"></slot></p>
</custom-element>
<combobox-dynamic-demo></combobox-dynamic-demo>
```

### In a form

The chosen `value` is submitted under the element's `name`. With `required`, the form is invalid until an option is
chosen, and `form.reset()` returns to the `value` attribute.

```html live
<custom-element name="combobox-form-demo">
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
    <ui-combobox name="framework" aria-label="Framework" required>
      <option value="realm">REALM</option>
      <option value="lit">Lit</option>
      <option value="stencil">Stencil</option>
    </ui-combobox>
    <div class="actions">
      <ui-button type="submit">Save</ui-button>
      <ui-button type="reset" variant="outline">Reset</ui-button>
    </div>
  </form>
  <output><slot name="#result.text"></slot></output>
</custom-element>
<combobox-form-demo></combobox-form-demo>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-combobox` | | The text input with a chevron and the popover list. Fills its container's width unless `width` is set. |
| `<option>` | (data) | One choice in the list, with a check mark when chosen. |
| `ui-combobox-empty` | `empty` | The text shown when nothing matches, in place of "No results found.". |

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | string | | Form field name the value is submitted under. Also the `name` property, which reflects to the attribute like a native control's. |
| `value` | string | `""` | The `value` of the chosen option. |
| `placeholder` | string | `"Select…"` | Placeholder of the text input. |
| `width` | number | | Fixed width in spacing units, where `n` means `calc(var(--spacing) * n)`. Without it the combobox fills its container. |
| `disabled` | boolean | `false` | Disables the input. Also true inside a disabled `<fieldset>`. |
| `required` | boolean | `false` | The form is invalid until an option is chosen. |
| `aria-label` | string | | Accessible name, passed to the inner input. Property name: `label`. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `value` | string | The chosen value. Setting it selects the matching option. |

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `change` | none | Fired after the user chooses an option. |

### Child elements

| Element | Attributes read | Description |
| --- | --- | --- |
| `<option>` | `value`, `label` (or text), `disabled` | One choice. Options are hidden in place and rendered in the list. Adding, removing or changing options updates the list. |
| `ui-combobox-empty` | | Rich content for the empty state. |

### CSS parts

| Part | Description |
| --- | --- |
| `field` | The bordered box around the input and chevron. |
| `input` | The inner text `<input role="combobox">`. |
| `list` | The popover `role="listbox"` element. |
| `option` | Each rendered option (`role="option"`). |
| `empty` | The paragraph shown when nothing matches. |

### Forms

`ui-combobox` is form-associated. With a `name`, it submits `value`, or an empty string when nothing is chosen. With
`required` and no value it reports `valueMissing` with the message "Please select an item." and the validation
bubble points at the input. `form.reset()` restores the `value` attribute.

### Accessibility

The inner input has `role="combobox"`, `aria-autocomplete="list"`, `aria-controls` pointing at the listbox and
`aria-expanded` while the list is open. Options have `role="option"`, with `aria-selected` on the chosen one and
`aria-disabled` on disabled ones. The highlighted option follows the arrow keys while focus stays in the input, and
the input's `aria-activedescendant` points at it while the list is open.

| Key | Action |
| --- | --- |
| Tab into the input | Opens the list. |
| Typing | Opens the list and filters the options by label. |
| Arrow Down / Arrow Up | Opens the list and moves the highlight, wrapping at the ends. |
| Enter | Chooses the highlighted option and closes the list. |
| Escape | Closes the list. |
