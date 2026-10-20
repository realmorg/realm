---
title: Button Group
description: Joins adjacent buttons or toggles into one connected control, such as a toolbar or a split button.
group: Forms
order: 102
nav: Button Group
---

# Button Group

`ui-button-group` lays its children out in a row or column and removes the inner corner radii, so neighbouring
`ui-button` (or `ui-toggle`) elements read as one control. The host has the `group` role. It only handles layout
and does not track a value. For a group of pressable buttons with a selected value, use
[Toggle Group](/components/toggle-group).

```html live
<ui-button-group aria-label="Text alignment">
  <ui-button variant="outline">Left</ui-button>
  <ui-button variant="outline">Center</ui-button>
  <ui-button variant="outline">Right</ui-button>
</ui-button-group>
```

## Examples

### Icon buttons

Group icon buttons for toolbars. Each icon button needs its own `aria-label`.

```html live
<ui-button-group aria-label="History">
  <ui-button variant="outline" size="icon" aria-label="Undo">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 14 4 9l5-5" /><path d="M4 9h11a5 5 0 0 1 0 10h-4" /></svg>
  </ui-button>
  <ui-button variant="outline" size="icon" aria-label="Redo">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m15 14 5-5-5-5" /><path d="M20 9H9a5 5 0 0 0 0 10h4" /></svg>
  </ui-button>
</ui-button-group>
```

### Split button

A primary action next to a second button that opens more options.

```html live
<ui-button-group aria-label="Merge">
  <ui-button>Merge pull request</ui-button>
  <ui-button size="icon" aria-label="More merge options" popovertarget="button-group-menu">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
  </ui-button>
</ui-button-group>
<div id="button-group-menu" popover>Squash and merge, or rebase and merge.</div>
```

### Separator

Buttons with a filled background have no border between them. Put a `ui-button-group-separator` between them to
draw one.

```html live
<ui-button-group aria-label="Copy and share">
  <ui-button variant="secondary" size="sm">Copy</ui-button>
  <ui-button-group-separator></ui-button-group-separator>
  <ui-button variant="secondary" size="sm">Paste</ui-button>
</ui-button-group>
```

### Text

`ui-button-group-text` adds a bordered label to the group, joined like the buttons.

```html live
<ui-button-group aria-label="Zoom">
  <ui-button variant="outline" size="icon" aria-label="Zoom out">−</ui-button>
  <ui-button-group-text>100%</ui-button-group-text>
  <ui-button variant="outline" size="icon" aria-label="Zoom in">+</ui-button>
</ui-button-group>
```

### Vertical

`orientation="vertical"` stacks the buttons and joins the top and bottom corners. A separator in a vertical group
takes `orientation="horizontal"`.

```html live
<ui-button-group orientation="vertical" aria-label="Volume">
  <ui-button variant="secondary" size="icon" aria-label="Louder">+</ui-button>
  <ui-button-group-separator orientation="horizontal"></ui-button-group-separator>
  <ui-button variant="secondary" size="icon" aria-label="Quieter">−</ui-button>
</ui-button-group>
```

### Form actions

Grouped buttons keep their form behaviour, so a group can hold the submit and reset actions of a form.

```html live
<custom-element name="button-group-form-demo">
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
    <ui-input name="query" value="button group" aria-label="Search"></ui-input>
    <ui-button-group aria-label="Search actions">
      <ui-button type="submit">Search</ui-button>
      <ui-button type="reset" variant="outline">Clear</ui-button>
    </ui-button-group>
  </form>
  <output><slot name="#result.text"></slot></output>
</custom-element>
<button-group-form-demo></button-group-form-demo>
```

## API

### Parts

| Element | Fills | Renders |
| --- | --- | --- |
| `ui-button-group` | | A `role="group"` row or column that joins its children's corners. |
| `ui-button-group-text` | the default slot of `ui-button-group` | A bordered, muted label joined like a button. |
| `ui-button-group-separator` | the default slot of `ui-button-group` | A one-pixel `role="separator"` line between two buttons. |

### Attributes

#### ui-button-group

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `"horizontal"` \| `"vertical"` | `"horizontal"` | Lays the children out in a row or a column. |

#### ui-button-group-separator

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `"vertical"` \| `"horizontal"` | `"vertical"` | Direction of the line. Use `"horizontal"` in a vertical group. Sets `aria-orientation`. |

### Slots

| Slot | Description |
| --- | --- |
| (default) | The grouped buttons. Every child except the first gets `--ui-radius-start: 0` and a `-1px` start margin so borders overlap. Every child except the last gets `--ui-radius-end: 0`. |

### CSS states and custom properties

| Name | Description |
| --- | --- |
| `:state(attr-orientation-is-vertical)` | Set when `orientation="vertical"`. |

The group sets `--ui-radius-start` and `--ui-radius-end` on its children. `ui-button`, `ui-toggle` and
`ui-button-group-text` read them. Other children can use them for their own corner radii.

### Accessibility

The host has `role="group"`. Give it an `aria-label` that names what the buttons do together.
