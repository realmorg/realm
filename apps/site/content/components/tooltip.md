---
title: Tooltip
description: A short text label that appears next to an element on hover or keyboard focus, built on a manual popover with anchor positioning.
group: Overlays
order: 311
nav: Tooltip
---

# Tooltip

`ui-tooltip` shows a small label next to its trigger when the pointer enters it or it receives focus. Put the element
in `ui-tooltip-trigger` and the label in `ui-tooltip-content`. The content is a `role="tooltip"` element shown as a
`popover="manual"`, so it renders in the top layer, is anchored to the trigger and does not close other popovers. It
hides on pointer leave, focus out and Escape.

```html live
<ui-tooltip>
  <ui-tooltip-trigger><ui-button variant="outline">Hover me</ui-button></ui-tooltip-trigger>
  <ui-tooltip-content>Add to library</ui-tooltip-content>
</ui-tooltip>
```

## Examples

### Placement

`placement` on `ui-tooltip-content` puts the tooltip `top` (default), `bottom`, `left` or `right` of the trigger. A
tooltip that does not fit flips to the opposite side.

```html live
<div class="demo-row-tight">
  <ui-tooltip>
    <ui-tooltip-trigger><ui-button variant="outline">Top</ui-button></ui-tooltip-trigger>
    <ui-tooltip-content placement="top">Above</ui-tooltip-content>
  </ui-tooltip>
  <ui-tooltip>
    <ui-tooltip-trigger><ui-button variant="outline">Right</ui-button></ui-tooltip-trigger>
    <ui-tooltip-content placement="right">To the right</ui-tooltip-content>
  </ui-tooltip>
  <ui-tooltip>
    <ui-tooltip-trigger><ui-button variant="outline">Bottom</ui-button></ui-tooltip-trigger>
    <ui-tooltip-content placement="bottom">Below</ui-tooltip-content>
  </ui-tooltip>
  <ui-tooltip>
    <ui-tooltip-trigger><ui-button variant="outline">Left</ui-button></ui-tooltip-trigger>
    <ui-tooltip-content placement="left">To the left</ui-tooltip-content>
  </ui-tooltip>
</div>
```

### Icon buttons

Tooltips suit icon-only buttons. Keep the button's own `aria-label`, because the tooltip text becomes the button's
description, not its name.

```html live
<div class="demo-row-tight">
  <ui-tooltip>
    <ui-tooltip-trigger>
      <ui-button variant="ghost" size="icon" aria-label="Bold">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 12h9a4 4 0 0 1 0 8H6V4h8a4 4 0 0 1 0 8" /></svg>
      </ui-button>
    </ui-tooltip-trigger>
    <ui-tooltip-content>Bold</ui-tooltip-content>
  </ui-tooltip>
  <ui-tooltip>
    <ui-tooltip-trigger>
      <ui-button variant="ghost" size="icon" aria-label="Italic">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 4h-9M14 20H5M15 4 9 20" /></svg>
      </ui-button>
    </ui-tooltip-trigger>
    <ui-tooltip-content>Italic</ui-tooltip-content>
  </ui-tooltip>
</div>
```

### Rich content and delay

`ui-tooltip-content` can hold markup such as a keyboard shortcut. `delay` on `ui-tooltip` sets the milliseconds before
the tooltip appears (default `300`). Hiding is immediate.

```html live
<ui-tooltip delay="0">
  <ui-tooltip-trigger><ui-button variant="outline">Save</ui-button></ui-tooltip-trigger>
  <ui-tooltip-content>Save draft <ui-kbd>Ctrl S</ui-kbd></ui-tooltip-content>
</ui-tooltip>
```

### Dynamic content

The content can be bound from a component's state. The trigger's description follows it.

```html live
<custom-element name="tooltip-copy-demo">
  <script type="realm">
    const copy = useState({ label: "Copy link" });

    function copied() {
      copy.label = "Copied";
    }

    function reset() {
      copy.label = "Copy link";
    }
  </script>

  <ui-tooltip delay="0">
    <ui-tooltip-trigger onpointerleave="reset()"><ui-button variant="outline" onclick="copied()">Share</ui-button></ui-tooltip-trigger>
    <ui-tooltip-content><slot name="#copy.label"></slot></ui-tooltip-content>
  </ui-tooltip>
</custom-element>
<tooltip-copy-demo></tooltip-copy-demo>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-tooltip` | | Its parts, with no box of its own. |
| `ui-tooltip-trigger` | (default) | An inline block around the trigger. Pointer enter and focus show the tooltip. Pointer leave, focus out and Escape hide it. |
| `ui-tooltip-content` | (default) | A `popover="manual"` element with `role="tooltip"`, in `var(--text-xs)` on the foreground colour, anchored to the trigger. |

### ui-tooltip attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `delay` | number | `300` | Milliseconds before the tooltip opens. Minimum `0`. |

### ui-tooltip-content attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `placement` | `"top"` \| `"bottom"` \| `"left"` \| `"right"` | `"top"` | Side of the trigger the tooltip appears on. |

### CSS parts

| Element | Part | Description |
| --- | --- | --- |
| `ui-tooltip-trigger` | `trigger` | The wrapper that listens for pointer and focus events. |

### CSS states

| Name | Description |
| --- | --- |
| `ui-tooltip-content:popover-open` | Matches while the tooltip is shown. |

### Accessibility

- The content has `role="tooltip"` and opens on focus as well as hover, so keyboard users see it.
- Escape hides it while focus is on the trigger.
- The tooltip text is set as `aria-description` on each element in `ui-tooltip-trigger` (`ui-button` passes it to its
  inner button). Give the trigger its own accessible name.
