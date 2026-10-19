---
title: Hover Card
description: A card that previews the content behind a link when the pointer rests on it or it receives keyboard focus.
group: Overlays
order: 307
nav: Hover Card
---

# Hover Card

`ui-hover-card` shows a floating card next to its trigger after the pointer has rested on it for a moment, or when the
trigger receives keyboard focus. Put the link in `ui-hover-card-trigger` and the card in `ui-hover-card-content`. The
card stays open while the pointer is over it, so users can move into it and click links. It is a `popover="manual"`
element anchored to the trigger, so it does not close other popovers and is not light dismissed.

Use it for previews that sighted mouse users can do without, such as a profile summary behind a username link. Put
anything essential in the page itself.

```html live
<ui-hover-card>
  <ui-hover-card-trigger><ui-button variant="link">@realmorg</ui-button></ui-hover-card-trigger>
  <ui-hover-card-content width="80">
    <div class="demo-media">
      <ui-avatar><ui-avatar-fallback>R</ui-avatar-fallback></ui-avatar>
      <div class="demo-stack-tight">
        <strong class="demo-text">@realmorg</strong>
        <span class="demo-text">Native-first custom elements, written as HTML.</span>
        <span class="demo-muted">Joined December 2021</span>
      </div>
    </div>
  </ui-hover-card-content>
</ui-hover-card>
```

## Examples

### Delays

`open-delay` on `ui-hover-card` is the time in milliseconds before the card opens (default `500`). `close-delay` is the
time before it closes after the pointer or focus leaves (default `300`).

```html live
<div class="demo-row">
  <ui-hover-card open-delay="0" close-delay="0">
    <ui-hover-card-trigger><ui-button variant="link">Instant</ui-button></ui-hover-card-trigger>
    <ui-hover-card-content>Opens and closes without delay.</ui-hover-card-content>
  </ui-hover-card>
  <ui-hover-card open-delay="1000" close-delay="1000">
    <ui-hover-card-trigger><ui-button variant="link">Slow</ui-button></ui-hover-card-trigger>
    <ui-hover-card-content>Waits a second before opening and before closing.</ui-hover-card-content>
  </ui-hover-card>
</div>
```

### Placement and width

`placement` on `ui-hover-card-content` puts the card `bottom` (default), `top`, `left` or `right` of the trigger. It
flips when there is not enough room. `width` sets the card width in spacing units (default `64`).

```html live
<div class="demo-row-tight">
  <ui-hover-card open-delay="100">
    <ui-hover-card-trigger><ui-button variant="outline">Top</ui-button></ui-hover-card-trigger>
    <ui-hover-card-content placement="top">Card above the trigger.</ui-hover-card-content>
  </ui-hover-card>
  <ui-hover-card open-delay="100">
    <ui-hover-card-trigger><ui-button variant="outline">Right</ui-button></ui-hover-card-trigger>
    <ui-hover-card-content placement="right" width="48">Card to the right.</ui-hover-card-content>
  </ui-hover-card>
  <ui-hover-card open-delay="100">
    <ui-hover-card-trigger><ui-button variant="outline">Bottom</ui-button></ui-hover-card-trigger>
    <ui-hover-card-content placement="bottom">Card below the trigger.</ui-hover-card-content>
  </ui-hover-card>
  <ui-hover-card open-delay="100">
    <ui-hover-card-trigger><ui-button variant="outline">Left</ui-button></ui-hover-card-trigger>
    <ui-hover-card-content placement="left" width="48">Card to the left.</ui-hover-card-content>
  </ui-hover-card>
</div>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-hover-card` | | Its parts, with no box of its own. Holds the delays. |
| `ui-hover-card-trigger` | (default) | An inline block around the trigger. Pointer enter and focus schedule the card to open; pointer leave and focus out schedule it to close. |
| `ui-hover-card-content` | (default) | The card: a bordered `popover="manual"` panel with padding, anchored to the trigger. The pointer over it keeps it open. |

### ui-hover-card attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `open-delay` | number | `500` | Milliseconds before the card opens. Minimum `0`. Property name: `openDelay`. |
| `close-delay` | number | `300` | Milliseconds before the card closes. Minimum `0`. Property name: `closeDelay`. |

### ui-hover-card-content attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `placement` | `"bottom"` \| `"top"` \| `"left"` \| `"right"` | `"bottom"` | Side of the trigger the card appears on. |
| `width` | number | `64` | Card width in spacing units: `n` means `calc(var(--spacing) * n)`. |

### CSS parts

| Element | Part | Description |
| --- | --- | --- |
| `ui-hover-card-trigger` | `trigger` | The wrapper that listens for pointer and focus events. |
| `ui-hover-card-content` | `content` | The padded box inside the card. |

### Accessibility

- The card opens on pointer enter and on focus inside the trigger, and closes on pointer leave and focus out.
- The card is not announced or linked to the trigger with ARIA. Treat it as a visual preview.
- Escape closes the card, wherever focus is. Moving focus away also closes it.
