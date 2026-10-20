---
title: Toggle Group
description: A form-associated set of toggles where one or several can be pressed, submitting the pressed values as one field.
group: Forms
order: 117
nav: Toggle Group
---

# Toggle Group

`ui-toggle-group` joins `ui-toggle` children into one control with a shared `value`. With `type="single"` at most one
toggle is pressed, like a segmented control; with `type="multiple"` any number can be pressed, like the bold,
italic and underline buttons of an editor. The `value` of each `ui-toggle` identifies it.

The group has the `group` role, moves focus between its toggles with the arrow keys, and is form-associated: the
pressed values are submitted under its `name`, separated by commas.

```html live
<ui-toggle-group value="left" aria-label="Text alignment">
  <ui-toggle value="left" aria-label="Align left">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h10M3 18h14" /></svg>
  </ui-toggle>
  <ui-toggle value="center" aria-label="Align center">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M7 12h10M5 18h14" /></svg>
  </ui-toggle>
  <ui-toggle value="right" aria-label="Align right">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M11 12h10M7 18h14" /></svg>
  </ui-toggle>
</ui-toggle-group>
```

## Examples

### Multiple

With `type="multiple"`, each toggle is pressed independently and `value` lists every pressed toggle.

```html live
<ui-toggle-group type="multiple" value="bold,underline" aria-label="Text formatting">
  <ui-toggle value="bold" variant="outline" aria-label="Bold">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 12h9a4 4 0 0 1 0 8H6V4h8a4 4 0 0 1 0 8" /></svg>
  </ui-toggle>
  <ui-toggle value="italic" variant="outline" aria-label="Italic">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 4h-9M14 20H5M15 4 9 20" /></svg>
  </ui-toggle>
  <ui-toggle value="underline" variant="outline" aria-label="Underline">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16" /></svg>
  </ui-toggle>
</ui-toggle-group>
```

### Outline segmented control

Outline toggles with text make a segmented control. In single mode, clicking the pressed toggle again unpresses it
and the value becomes empty.

```html live
<ui-toggle-group value="week" aria-label="Range">
  <ui-toggle value="day" variant="outline">Day</ui-toggle>
  <ui-toggle value="week" variant="outline">Week</ui-toggle>
  <ui-toggle value="month" variant="outline">Month</ui-toggle>
</ui-toggle-group>
```

### Listening for changes

The group fires `change` after every click; read the new `value` from the group. The toggles' own `change` events
stop at the group.

```html live
<custom-element name="toggle-group-change-demo">
  <script type="realm">
    const view = useState({ mode: "grid" });

    function changed(group) {
      view.mode = group.value || "none";
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

  <ui-toggle-group value="grid" aria-label="View" onchange="changed(this)">
    <ui-toggle value="list" variant="outline" size="sm">List</ui-toggle>
    <ui-toggle value="grid" variant="outline" size="sm">Grid</ui-toggle>
    <ui-toggle value="board" variant="outline" size="sm">Board</ui-toggle>
  </ui-toggle-group>
  <p>View: <slot name="#view.mode"></slot></p>
</custom-element>
<toggle-group-change-demo></toggle-group-change-demo>
```

### In a form

The group submits `value` under its `name`: one value in single mode, a comma-separated list in multiple mode, or an
empty string when nothing is pressed. Reset returns to the `value` attribute.

```html live
<custom-element name="toggle-group-form-demo">
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
      box-sizing: border-box;
      width: 100%;
      padding: calc(var(--spacing) * 3);
      border-radius: var(--radius-md);
      background: var(--muted);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      white-space: pre-wrap;
    }
  </style>

  <form onsubmit="submit(event)" onreset="reset()">
    <ui-toggle-group name="size" value="m" aria-label="Size">
      <ui-toggle value="s" variant="outline">S</ui-toggle>
      <ui-toggle value="m" variant="outline">M</ui-toggle>
      <ui-toggle value="l" variant="outline">L</ui-toggle>
    </ui-toggle-group>
    <ui-toggle-group name="toppings" type="multiple" aria-label="Toppings">
      <ui-toggle value="cheese" variant="outline">Cheese</ui-toggle>
      <ui-toggle value="olives" variant="outline">Olives</ui-toggle>
      <ui-toggle value="basil" variant="outline">Basil</ui-toggle>
    </ui-toggle-group>
    <div class="actions">
      <ui-button type="submit">Order</ui-button>
      <ui-button type="reset" variant="outline">Reset</ui-button>
    </div>
  </form>
  <output><slot name="#result.text"></slot></output>
</custom-element>
<toggle-group-form-demo></toggle-group-form-demo>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `"single"` \| `"multiple"` | `"single"` | Whether one or several toggles can be pressed. |
| `value` | string | `""` | Pressed toggle values, separated by commas. The attribute is the initial and reset value. |
| `orientation` | `"horizontal"` \| `"vertical"` | `"horizontal"` | Layout direction, and which arrow keys move focus. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `value` | string | Pressed values as a comma-separated string. Setting it presses the matching toggles. |

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `change` | none | Fired after a toggle in the group is clicked and `value` is updated. |

### Slots

| Slot | Description |
| --- | --- |
| (default) | The `ui-toggle` elements. Every child except the first gets `--ui-radius-start: 0`, and every child except the last gets `--ui-radius-end: 0`. |

### Child elements

| Element | Attributes read | Description |
| --- | --- | --- |
| `ui-toggle` | `value`, `pressed` | The group sets each toggle's `pressed` from its own `value`. A toggle's value must not contain a comma. |

### CSS parts

| Part | Description |
| --- | --- |
| `group` | The `display: contents` wrapper that carries the `focusgroup` attribute. |

### CSS states

| State | Description |
| --- | --- |
| `:state(attr-orientation-is-vertical)` | Set for the vertical layout. |

### Forms

`ui-toggle-group` is form-associated and submits `value` under its `name`, including an empty string when nothing
is pressed. `form.reset()` restores the `value` attribute and the pressed toggles follow it. The group has no
`disabled` attribute; disable individual toggles instead.

### Accessibility

The host has `role="group"`; name it with `aria-label`. Each toggle is a button with `aria-pressed`. The toggles
form a native `focusgroup`: the arrow keys (Left and Right, or Up and Down when vertical) move focus between them,
wrapping at the ends, and Home and End jump to the first and last toggle. Space or Enter presses the focused toggle.
