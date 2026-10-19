---
title: Popover
description: Floating content anchored to a trigger, built on the native popover attribute with light dismiss and placement.
group: Overlays
order: 308
nav: Popover
---

# Popover

`ui-popover` pairs a `ui-popover-trigger` with a `ui-popover-content`. The content is the native
[popover API](https://developer.mozilla.org/docs/Web/API/Popover_API) with a card style: it sets `popover="auto"` on
itself, so it starts hidden, opens in the top layer, closes when you click outside or press Escape, and closes other
`auto` popovers when it opens. A click on the trigger toggles it, and it is placed next to the trigger with CSS anchor
positioning, flipping when there is not enough room.

`ui-popover-header`, `ui-popover-title` and `ui-popover-description` lay out a heading inside the content.

```html live
<ui-popover>
  <ui-popover-trigger><ui-button variant="outline">Open popover</ui-button></ui-popover-trigger>
  <ui-popover-content width="80">
    <ui-popover-header>
      <ui-popover-title>Dimensions</ui-popover-title>
      <ui-popover-description>Set the dimensions for the layer.</ui-popover-description>
    </ui-popover-header>
    <ui-field orientation="horizontal">
      <ui-label for="popover-width">Width</ui-label>
      <ui-input id="popover-width" value="100%"></ui-input>
    </ui-field>
    <ui-field orientation="horizontal">
      <ui-label for="popover-height">Height</ui-label>
      <ui-input id="popover-height" value="25px"></ui-input>
    </ui-field>
  </ui-popover-content>
</ui-popover>
```

## Examples

### Placement

`placement` on `ui-popover-content` puts it `bottom` (default), `top`, `left` or `right` of the trigger.

```html live
<div class="demo-row-tight">
  <ui-popover>
    <ui-popover-trigger><ui-button variant="outline">Top</ui-button></ui-popover-trigger>
    <ui-popover-content placement="top" width="48">Placed above the button.</ui-popover-content>
  </ui-popover>
  <ui-popover>
    <ui-popover-trigger><ui-button variant="outline">Right</ui-button></ui-popover-trigger>
    <ui-popover-content placement="right" width="48">Placed to the right.</ui-popover-content>
  </ui-popover>
  <ui-popover>
    <ui-popover-trigger><ui-button variant="outline">Bottom</ui-button></ui-popover-trigger>
    <ui-popover-content placement="bottom" width="48">Placed below the button.</ui-popover-content>
  </ui-popover>
  <ui-popover>
    <ui-popover-trigger><ui-button variant="outline">Left</ui-button></ui-popover-trigger>
    <ui-popover-content placement="left" width="48">Placed to the left.</ui-popover-content>
  </ui-popover>
</div>
```

### Open with popovertarget or a command

`ui-popover-content` is a real popover, so a button anywhere on the page can open it by id: `popovertarget`, or
`commandfor` with `command="toggle-popover"`, `"show-popover"` or `"hide-popover"`. The popover is then anchored to that
button. A close button inside the popover can use `hide-popover`.

```html live
<div class="demo-row-tight">
  <ui-button variant="outline" popovertarget="popover-target">Pinned note</ui-button>
  <ui-popover-content id="popover-target">Opened with popovertarget.</ui-popover-content>
  <ui-button variant="outline" commandfor="popover-command" command="toggle-popover">Notifications</ui-button>
  <ui-popover-content id="popover-command">
    <span class="demo-text">You are all caught up.</span>
    <ui-button size="sm" variant="secondary" commandfor="popover-command" command="hide-popover">Dismiss</ui-button>
  </ui-popover-content>
</div>
```

### Open from script

Call the native `showPopover()`, `hidePopover()` or `togglePopover()` on `ui-popover-content`. Pass `{ source }` so it
is anchored to the element that opened it. The native `toggle` event reports the new state.

```html live
<custom-element name="popover-script-demo">
  <script type="realm">
    const info = useState({ state: "closed" });

    function show() {
      refs.popover.showPopover({ source: refs.trigger });
    }

    function toggled(event) {
      info.state = event.newState;
    }
  </script>

  <style type="realm">
    :host {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 4);
      font-size: var(--text-sm);
    }
  </style>

  <ui-button ref="trigger" variant="outline" onclick="show()">Show details</ui-button>
  <span>Popover is <slot name="#info.state"></slot></span>
  <ui-popover-content ref="popover" ontoggle="toggled(event)">Opened with showPopover(). Press Escape to close.</ui-popover-content>
</custom-element>
<popover-script-demo></popover-script-demo>
```

### Manual popovers

Set `popover="manual"` on the content yourself to turn off light dismiss. A manual popover stays open until it is
toggled again or hidden from script.

```html live
<ui-popover>
  <ui-popover-trigger><ui-button variant="outline">Toggle pinned note</ui-button></ui-popover-trigger>
  <ui-popover-content popover="manual">This note stays open when you click elsewhere. Click the button again to hide it.</ui-popover-content>
</ui-popover>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-popover` | | Its parts, with no box of its own. |
| `ui-popover-trigger` | (default) | An inline block around the trigger. A click on it focuses the element inside and toggles the content, anchored to the trigger. |
| `ui-popover-content` | (default) | The popover: a bordered card with padding, a gap between children and `popover="auto"`. |
| `ui-popover-header` | (default) | A column for the title and description, with a small gap. |
| `ui-popover-title` | (default) | An `<h3>` in `var(--text-sm)` medium. |
| `ui-popover-description` | (default) | A `<p>` in muted `var(--text-sm)`. |

### ui-popover-content attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `placement` | `"bottom"` \| `"top"` \| `"left"` \| `"right"` | `"bottom"` | Side of the anchor the popover appears on. It flips when there is not enough room. |
| `width` | number | `72` | Width in spacing units: `n` means `calc(var(--spacing) * n)`. |
| `popover` | `"auto"` \| `"manual"` | `"auto"` | The native popover attribute. Set on connect when missing. |

### Properties and methods

`ui-popover-content` has the native popover methods: `showPopover(options?)`, `hidePopover()` and
`togglePopover(options?)`. Use `:popover-open` to check whether it is open.

### Events

| Event | Element | Detail | Description |
| --- | --- | --- | --- |
| `beforetoggle` | `ui-popover-content` | `ToggleEvent` | Native. Fired before the popover opens or closes; cancelable when opening. |
| `toggle` | `ui-popover-content` | `ToggleEvent` | Native. Fired after it opens or closes; `event.newState` is `"open"` or `"closed"`. |

### CSS parts

| Element | Part | Description |
| --- | --- | --- |
| `ui-popover-trigger` | `trigger` | The wrapper that listens for clicks. |
| `ui-popover-title` | `title` | The `<h3>`. |
| `ui-popover-description` | `description` | The `<p>`. |

### CSS states

| Name | Description |
| --- | --- |
| `ui-popover-content:popover-open` | Native pseudo-class that matches while the popover is shown. |

### Accessibility

- Opened by a button with `popovertarget` or `commandfor`, the browser sets `aria-expanded` on that button and links
  it to the popover.
- Escape and a click outside close an `auto` popover. When it closes with focus inside, focus returns to the trigger.
- Without CSS anchor positioning support, the popover is centred in the viewport instead.
