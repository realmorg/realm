---
title: Sheet
description: A modal panel that slides in from an edge of the screen, for navigation, filters or secondary forms.
group: Overlays
order: 309
nav: Sheet
---

# Sheet

`ui-sheet` is a modal panel attached to one edge of the viewport. It is a thin wrapper around
[Dialog](/components/dialog/) with `side` set, so it behaves the same way: it opens with `showModal()`, traps focus,
closes on Escape, a backdrop click or the close button, and returns focus to the trigger when it closes. The default
side is `right`.

It has the same parts as the dialog: `ui-sheet-trigger`, `ui-sheet-header` with `ui-sheet-title` and
`ui-sheet-description`, `ui-sheet-footer` and `ui-sheet-close`.

```html live
<ui-sheet>
  <ui-sheet-trigger><ui-button variant="outline">Open sheet</ui-button></ui-sheet-trigger>
  <ui-sheet-header>
    <ui-sheet-title>Edit profile</ui-sheet-title>
    <ui-sheet-description>Make changes to your profile here. Click save when you are done.</ui-sheet-description>
  </ui-sheet-header>
  <ui-field>
    <ui-label for="sheet-profile-name">Name</ui-label>
    <ui-input id="sheet-profile-name" value="Pedro Duarte"></ui-input>
  </ui-field>
  <ui-field>
    <ui-label for="sheet-profile-username">Username</ui-label>
    <ui-input id="sheet-profile-username" value="@peduarte"></ui-input>
  </ui-field>
  <ui-sheet-footer>
    <ui-sheet-close><ui-button>Save changes</ui-button></ui-sheet-close>
  </ui-sheet-footer>
</ui-sheet>
```

## Examples

### Sides

Set `side` to `top`, `right`, `bottom` or `left`. Left and right sheets are full height; top and bottom sheets are
full width.

```html live
<custom-element name="sheet-side-demo">
  <script type="realm">
    const panel = useState({ side: "right" });

    function open(side) {
      panel.side = side;
      refs.sheet.showModal();
    }
  </script>

  <style type="realm">
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: calc(var(--spacing) * 2);
    }
    nav {
      display: grid;
      gap: calc(var(--spacing) * 2);
      font-size: var(--text-sm);
    }
  </style>

  <ui-button variant="outline" onclick="open('top')">Top</ui-button>
  <ui-button variant="outline" onclick="open('right')">Right</ui-button>
  <ui-button variant="outline" onclick="open('bottom')">Bottom</ui-button>
  <ui-button variant="outline" onclick="open('left')">Left</ui-button>
  <ui-sheet ref="sheet" _side="#panel.side">
    <ui-sheet-header>
      <ui-sheet-title>Menu</ui-sheet-title>
      <ui-sheet-description>Jump to a section of the app.</ui-sheet-description>
    </ui-sheet-header>
    <nav>
      <a href="#sheet-overview">Overview</a>
      <a href="#sheet-projects">Projects</a>
      <a href="#sheet-settings">Settings</a>
    </nav>
    <ui-sheet-footer>
      <ui-sheet-close><ui-button variant="outline">Close</ui-button></ui-sheet-close>
    </ui-sheet-footer>
  </ui-sheet>
</custom-element>
<sheet-side-demo></sheet-side-demo>
```

### React to closing

`close` fires on the sheet after it closes, however it was closed.

```html live
<custom-element name="sheet-close-demo">
  <script type="realm">
    const filters = useState({ closed: 0 });

    function closed() {
      filters.closed++;
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

  <ui-sheet side="left" onclose="closed()">
    <ui-sheet-trigger><ui-button variant="outline">Filters</ui-button></ui-sheet-trigger>
    <ui-sheet-header>
      <ui-sheet-title>Filters</ui-sheet-title>
      <ui-sheet-description>Press Escape or click outside to close.</ui-sheet-description>
    </ui-sheet-header>
  </ui-sheet>
  <span>Closed <slot name="#filters.closed"></slot> times</span>
</custom-element>
<sheet-close-demo></sheet-close-demo>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-sheet` | | A `ui-dialog` attached to the `side` edge. |
| `ui-sheet-trigger` | `trigger` | Its content, outside the sheet. A click on it focuses the element inside and opens the sheet. |
| `ui-sheet-header` | `header` | A column for the title and description at the top. |
| `ui-sheet-title` | (default) | An `<h2>` in `var(--text-lg)` semibold. Its text becomes the sheet's accessible name. |
| `ui-sheet-description` | (default) | A `<p>` in muted `var(--text-sm)`. Its text becomes the sheet's accessible description. |
| `ui-sheet-footer` | `footer` | A row of actions at the bottom, aligned to the end. |
| `ui-sheet-close` | (default) | Its content. A click on it closes the sheet. |

Parts with a slot assign themselves to it, so you do not write `slot`. Everything else goes in the body in source
order.

### ui-sheet attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | boolean | `false` | Whether the sheet is open. Setting it opens the sheet modally; reflects to the attribute. |
| `side` | `"top"` \| `"right"` \| `"bottom"` \| `"left"` | `"right"` | The edge the sheet is attached to. |

### Properties and methods

| Name | Description |
| --- | --- |
| `showModal()` | Opens the sheet. |
| `show()` | Same as `showModal()`. |
| `close()` | Closes the sheet. |
| `requestClose()` | Fires `cancel` on the inner dialog, then closes unless it was cancelled. |
| `open` | Boolean property mirroring the attribute. |

### Commands

| Command | Action |
| --- | --- |
| `--show-modal` | Opens the sheet. |
| `--close` | Closes the sheet. |
| `--request-close` | Same as `requestClose()`. |

`ui-button` also accepts the commands without the `--` prefix; a plain `<button>` needs the prefix.

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `close` | none | Fired after the sheet has closed. Does not bubble. |

### CSS parts

| Element | Part | Description |
| --- | --- | --- |
| `ui-sheet` | `dialog` | The inner `ui-dialog` element. Its own parts are not exported. |
| `ui-sheet-title` | `title` | The `<h2>`. |
| `ui-sheet-description` | `description` | The `<p>`. |

### Accessibility

`ui-sheet` inherits the behaviour of `ui-dialog`: the page behind it is inert, focus moves into the sheet on open and
back to the trigger on close, Escape and a backdrop click close it, and the close button has `aria-label="Close"`. The
title and description text name and describe the sheet.
