---
title: Drawer
description: A modal panel that slides up from the bottom edge with a drag handle, or in from another edge, for mobile-friendly menus and forms.
group: Overlays
order: 305
nav: Drawer
---

# Drawer

`ui-drawer` is a modal `<dialog>` that slides in from an edge of the viewport, by default from the bottom. A bottom
drawer shows a drag handle. Drag it down more than 80 pixels to close the drawer. Escape and a click on the backdrop
also close it, and focus returns to the trigger.

Build it from `ui-drawer-trigger`, `ui-drawer-header` with `ui-drawer-title` and `ui-drawer-description`, the content,
and `ui-drawer-footer`. `ui-drawer-close` closes the drawer when the element inside it is clicked.

```html live
<ui-drawer>
  <ui-drawer-trigger><ui-button variant="outline">Set daily goal</ui-button></ui-drawer-trigger>
  <ui-drawer-header>
    <ui-drawer-title>Move goal</ui-drawer-title>
    <ui-drawer-description>Set your daily activity goal.</ui-drawer-description>
  </ui-drawer-header>
  <ui-slider value="350" min="200" max="600" step="10" aria-label="Calories per day"></ui-slider>
  <ui-drawer-footer>
    <ui-drawer-close><ui-button>Submit</ui-button></ui-drawer-close>
    <ui-drawer-close><ui-button variant="outline">Cancel</ui-button></ui-drawer-close>
  </ui-drawer-footer>
</ui-drawer>
```

## Examples

### Sides

Set `side` to `top`, `left` or `right`. Only the bottom drawer shows the drag handle.

```html live
<custom-element name="drawer-side-demo">
  <script type="realm">
    const panel = useState({ side: "bottom" });

    function open(side) {
      panel.side = side;
      refs.drawer.showModal();
    }
  </script>

  <style type="realm">
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: calc(var(--spacing) * 2);
    }
  </style>

  <ui-button variant="outline" onclick="open('top')">Top</ui-button>
  <ui-button variant="outline" onclick="open('right')">Right</ui-button>
  <ui-button variant="outline" onclick="open('bottom')">Bottom</ui-button>
  <ui-button variant="outline" onclick="open('left')">Left</ui-button>
  <ui-drawer ref="drawer" _side="#panel.side">
    <ui-drawer-header>
      <ui-drawer-title>Recent activity</ui-drawer-title>
      <ui-drawer-description>You have three unread notifications.</ui-drawer-description>
    </ui-drawer-header>
    <ui-drawer-footer>
      <ui-drawer-close><ui-button variant="outline">Close</ui-button></ui-drawer-close>
    </ui-drawer-footer>
  </ui-drawer>
</custom-element>
<drawer-side-demo></drawer-side-demo>
```

### React to closing

`close` fires after the drawer closes, whether by a button, Escape, the backdrop or a drag.

```html live
<custom-element name="drawer-close-demo">
  <script type="realm">
    const share = useState({ status: "Not shared yet." });

    function pick(target) {
      share.status = `Shared to ${target}.`;
    }

    function closed() {
      document.dispatchEvent(new CustomEvent("toast", { detail: { title: "Drawer closed", description: share.status } }));
    }
  </script>

  <style type="realm">
    :host {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 4);
      font-size: var(--text-sm);
    }
    .targets {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
  </style>

  <ui-drawer onclose="closed()">
    <ui-drawer-trigger><ui-button variant="outline">Share</ui-button></ui-drawer-trigger>
    <ui-drawer-header>
      <ui-drawer-title>Share</ui-drawer-title>
      <ui-drawer-description>Pick where to send this link.</ui-drawer-description>
    </ui-drawer-header>
    <div class="targets">
      <ui-drawer-close><ui-button variant="secondary" onclick="pick('Email')">Email</ui-button></ui-drawer-close>
      <ui-drawer-close><ui-button variant="secondary" onclick="pick('Messages')">Messages</ui-button></ui-drawer-close>
    </div>
  </ui-drawer>
  <span><slot name="#share.status"></slot></span>
</custom-element>
<drawer-close-demo></drawer-close-demo>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-drawer` | | The modal `<dialog>` with the drag handle, a grid with a gap between the header, content and footer. |
| `ui-drawer-trigger` | `trigger` | Its content, outside the drawer. A click on it focuses the element inside and opens the drawer. |
| `ui-drawer-header` | `header` | A column for the title and description. |
| `ui-drawer-title` | (default) | An `<h2>` in `var(--text-base)` semibold. Its text becomes the drawer's accessible name. |
| `ui-drawer-description` | (default) | A `<p>` in muted `var(--text-sm)`. Its text becomes the drawer's accessible description. |
| `ui-drawer-footer` | `footer` | A column of full-width actions at the bottom. |
| `ui-drawer-close` | (default) | Its content. A click on it closes the drawer. |

Parts with a slot assign themselves to it, so you do not write `slot`. Everything else goes in the body in source
order.

### ui-drawer attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | boolean | `false` | Whether the drawer is open. Setting it opens the drawer modally. Reflects. |
| `side` | `"bottom"` \| `"top"` \| `"left"` \| `"right"` | `"bottom"` | The edge the drawer slides in from. |

### Properties and methods

| Name | Description |
| --- | --- |
| `showModal()` | Opens the drawer. |
| `show()` | Same as `showModal()`. |
| `close()` | Closes the drawer. |
| `open` | Boolean property mirroring the attribute. |

### Commands

| Command | Action |
| --- | --- |
| `--show-modal` | Opens the drawer. |
| `--close` | Closes the drawer. |
| `--request-close` | Same as `--close`. |

`ui-button` also accepts the commands without the `--` prefix. A plain `<button>` needs the prefix.

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `close` | none | Fired after the drawer has closed. Does not bubble. |

### CSS parts

| Element | Part | Description |
| --- | --- | --- |
| `ui-drawer` | `dialog` | The native `<dialog>` element. |
| `ui-drawer` | `handle` | The drag handle. Visible only when `side` is `bottom`. |
| `ui-drawer` | `body` | Wrapper around the default slot. |
| `ui-drawer-title` | `title` | The `<h2>`. |
| `ui-drawer-description` | `description` | The `<p>`. |

### Accessibility

- The inner `<dialog>` is opened with `showModal()`, so the page behind it is inert and focus stays inside.
- The text of the title and description parts becomes the drawer's `aria-label` and `aria-description`.
- Escape and a backdrop click close the drawer. Focus returns to the trigger.
- The drag handle is a pointer shortcut only. Keyboard users close the drawer with Escape or a footer button.
