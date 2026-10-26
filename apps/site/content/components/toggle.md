---
title: Toggle
description: A two-state button that stays pressed or unpressed, for options such as bold text or a pinned item.
group: Forms
order: 116
nav: Toggle
---

# Toggle

`ui-toggle` is a native `<button>` with `aria-pressed`. Each click flips its `pressed` state and fires `change`.
Use it for an on/off option that is shown as a button, such as bold in a text toolbar. For several toggles that share
one value, wrap them in a [Toggle Group](/components/toggle-group).

A toggle is not form-associated on its own and submits nothing. Inside a `ui-toggle-group` with a `name`, the group
submits the pressed values.

```html live
<ui-toggle aria-label="Bold">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 12h9a4 4 0 0 1 0 8H6V4h8a4 4 0 0 1 0 8" /></svg>
</ui-toggle>
```

## Examples

### Outline

```html live
<ui-toggle variant="outline" aria-label="Italic">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 4h-9M14 20H5M15 4 9 20" /></svg>
</ui-toggle>
```

### With text

```html live
<ui-toggle variant="outline">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 17v5M9 10.76V6h6v4.76l2 2.24v2H7v-2z" /><path d="M8 2h8" /></svg>
  Pin
</ui-toggle>
```

### Sizes

```html live
<ui-toggle size="sm" variant="outline">Small</ui-toggle>
<ui-toggle variant="outline">Default</ui-toggle>
<ui-toggle size="lg" variant="outline">Large</ui-toggle>
```

### Pressed and disabled

`pressed` sets the initial state and reflects to the attribute as the user toggles.

```html live
<ui-toggle pressed variant="outline">Pressed</ui-toggle>
<ui-toggle disabled variant="outline">Disabled</ui-toggle>
```

### Listening for changes

```html live
<custom-element name="toggle-change-demo">
  <script type="realm">
    const editor = useState({ wrap: "Line wrapping is off." });

    function changed(toggle) {
      editor.wrap = toggle.pressed ? "Line wrapping is on." : "Line wrapping is off.";
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

  <ui-toggle variant="outline" onchange="changed(this)">Wrap lines</ui-toggle>
  <p role="status"><slot name="#editor.wrap"></slot></p>
</custom-element>
<toggle-change-demo></toggle-change-demo>
```

### In a form

A lone toggle adds nothing to `FormData`. To submit toggles, put them in a `ui-toggle-group` with a `name` and give
each toggle a `value`.

```html live
<custom-element name="toggle-form-demo">
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

  <form onsubmit="submit(event)">
    <div class="row">
      <ui-toggle variant="outline" value="draft">Lone toggle</ui-toggle>
      <ui-toggle-group name="flags" type="multiple" aria-label="Flags">
        <ui-toggle variant="outline" value="pinned">Pinned</ui-toggle>
      </ui-toggle-group>
    </div>
    <ui-button type="submit">Submit</ui-button>
  </form>
  <output><slot name="#result.text"></slot></output>
</custom-element>
<toggle-form-demo></toggle-form-demo>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `pressed` | boolean | `false` | Whether the toggle is pressed. Reflects to the attribute. |
| `variant` | `"default"` \| `"outline"` | `"default"` | Visual style. `outline` adds a border. |
| `size` | `"default"` \| `"sm"` \| `"lg"` | `"default"` | Height and padding. |
| `disabled` | boolean | `false` | Disables the button. |
| `value` | string | | Identifies the toggle inside a `ui-toggle-group`. |
| `aria-label` | string | | Accessible name, passed to the inner button. Use it for icon-only toggles. Property name: `label`. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `pressed` | boolean | Current state. Flipped by each click. Setting it updates the button. |

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `change` | none | Fired after each click, once `pressed` has flipped. It bubbles but, like a native `change`, does not leave the shadow root that contains the toggle. Inside a `ui-toggle-group`, the group stops it before it reaches listeners on the group and fires its own `change`. |

### Slots

| Slot | Description |
| --- | --- |
| (default) | The label and icons. Slotted `<svg>` elements are sized to `calc(var(--spacing) * 4)`. |

### CSS parts

| Part | Description |
| --- | --- |
| `button` | The inner native `<button>`. |

### CSS states and custom properties

| Name | Description |
| --- | --- |
| `:state(attr-pressed)` | Set while the toggle is pressed. |
| `:state(attr-variant-is-outline)`, `:state(attr-size-is-sm)`, `:state(attr-size-is-lg)` | Set for the current variant and size. |
| `--ui-radius-start`, `--ui-radius-end` | Override the start and end corner radii. Set by `ui-toggle-group` and `ui-button-group`. |

### Accessibility

The inner native button has `aria-pressed="true"` or `"false"`, so screen readers announce it as a toggle button.
Enter and Space toggle it, and the host delegates focus to the button.
