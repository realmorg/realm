---
title: Resizable
description: Panel groups split by draggable handles that users resize with the pointer or the arrow keys.
group: Layout
order: 504
nav: Resizable
---

# Resizable

`ui-resizable` is a flex container for `ui-resizable-panel` elements separated by `ui-resizable-handle` elements.
Each panel's `size` is its share of the group. Dragging a handle, or focusing it and pressing the arrow keys,
moves size from one neighbouring panel to the other, never below either panel's `min`. The group is as wide as its
container. Give it a `height` in spacing units (or size its parent), and add `variant="outline"` for a border.

```html live
<div class="demo-medium">
<ui-resizable variant="outline" height="48">
  <ui-resizable-panel size="50">
    <div class="demo-tile">One</div>
  </ui-resizable-panel>
  <ui-resizable-handle></ui-resizable-handle>
  <ui-resizable-panel size="50">
    <div class="demo-tile">Two</div>
  </ui-resizable-panel>
</ui-resizable>
</div>
```

## Examples

### Vertical

`direction="vertical"` stacks the panels. Drag the handle up and down, or use the Up and Down arrows.

```html live
<div class="demo-narrow">
<ui-resizable direction="vertical" variant="outline" height="64">
  <ui-resizable-panel size="30">
    <div class="demo-tile">Header</div>
  </ui-resizable-panel>
  <ui-resizable-handle></ui-resizable-handle>
  <ui-resizable-panel size="70">
    <div class="demo-tile">Content</div>
  </ui-resizable-panel>
</ui-resizable>
</div>
```

### Visible grip

Add `handle` to a handle to draw a grip on it, which makes the drag target easier to see.

```html live
<div class="demo-medium">
<ui-resizable variant="outline" height="40">
  <ui-resizable-panel size="25" min="15">
    <div class="demo-tile">Sidebar</div>
  </ui-resizable-panel>
  <ui-resizable-handle handle></ui-resizable-handle>
  <ui-resizable-panel size="75" min="40">
    <div class="demo-tile">Content</div>
  </ui-resizable-panel>
</ui-resizable>
</div>
```

### Nested groups

A panel can hold another group in the other direction.

```html live
<div class="demo-medium">
<ui-resizable variant="outline" height="56">
  <ui-resizable-panel size="40">
    <div class="demo-tile">One</div>
  </ui-resizable-panel>
  <ui-resizable-handle handle></ui-resizable-handle>
  <ui-resizable-panel size="60">
    <ui-resizable direction="vertical">
      <ui-resizable-panel size="25">
        <div class="demo-tile">Two</div>
      </ui-resizable-panel>
      <ui-resizable-handle handle></ui-resizable-handle>
      <ui-resizable-panel size="75">
        <div class="demo-tile">Three</div>
      </ui-resizable-panel>
    </ui-resizable>
  </ui-resizable-panel>
</ui-resizable>
</div>
```

## API

### Attributes

#### ui-resizable

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `"horizontal"` \| `"vertical"` | `"horizontal"` | Lays the panels out in a row or a column. Handles read it when they connect. |
| `height` | number | none | Height in spacing units: `height="48"` is `calc(var(--spacing) * 48)`. Without it the group fills its parent's height. |
| `variant` | `"default"` \| `"outline"` | `"default"` | `outline` adds a 1px border and `var(--radius-lg)` corners. |

#### ui-resizable-panel

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | number | `50` | The panel's share of the group, used as its `flex-grow`. Between 0 and 100. Make the sizes in a group add up to 100 so they read as percentages. Updated while resizing. |
| `min` | number | `10` | The smallest `size` a handle can shrink the panel to. At least 0. |

#### ui-resizable-handle

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `handle` | boolean | `false` | Shows a visible grip in the middle of the handle. |

### Properties and methods

`ui-resizable-panel` exposes `size` and `min` as properties. Set `size` from script to resize a panel; the handles
read both properties from the panels on either side.

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-resizable-panel` | (default) | One panel. Its content scrolls when it overflows. |
| `ui-resizable-handle` | (default) | A separator between two panels that resizes them. |

Panels and handles alternate in the default slot of `ui-resizable`. The default slot of a panel takes any content,
including another `ui-resizable`.

### CSS parts

| Part | Element | Description |
| --- | --- | --- |
| `grip` | `ui-resizable-handle` | The grip shown with the `handle` attribute. |

### CSS states and custom properties

- `ui-resizable-handle:state(vertical)` matches handles in a vertical group, which are horizontal lines.
- `ui-resizable-panel` applies its size through the reactive custom property `--attr-size`.

### Accessibility

- Each handle has `role="separator"`, `aria-orientation` (`vertical` between side-by-side panels, `horizontal`
  between stacked panels), `aria-valuemin="0"` and `aria-valuemax="100"`. After a resize, `aria-valuenow` holds the
  size of the panel before the handle.
- Handles are in the Tab order. Left and Up arrows shrink the panel before the handle by 5, Right and Down arrows
  grow it by 5, within both panels' `min`.
- Dragging uses pointer capture, so the drag continues when the pointer leaves the handle.
- Give a handle an `aria-label` that says what it resizes, for example `aria-label="Resize sidebar"`.
