---
title: Context Menu
description: A menu of actions that opens at the pointer when the user right-clicks an area, sharing its items with the dropdown menu.
group: Overlays
order: 303
nav: Context Menu
---

# Context Menu

`ui-context-menu` replaces the browser's context menu inside `ui-context-menu-trigger`. A right-click (or the context
menu key) on the trigger opens `ui-context-menu-content`, a `popover="auto"` menu, at the pointer position and
focuses the first enabled item. The items are the same `ui-menu-*` parts used by
[Dropdown Menu](/components/dropdown-menu/): the arrow keys move between them, Enter or Space chooses one, and choosing
fires `select` and closes the menu. Escape and a click outside close it too.

```html live
<ui-context-menu onselect="document.dispatchEvent(new CustomEvent('toast', { detail: { title: 'Chose ' + event.detail.value } }))">
  <ui-context-menu-trigger><div class="demo-area">Right click here</div></ui-context-menu-trigger>
  <ui-context-menu-content>
    <ui-menu-item value="back">Back <ui-menu-shortcut>⌘[</ui-menu-shortcut></ui-menu-item>
    <ui-menu-item value="forward" disabled>Forward <ui-menu-shortcut>⌘]</ui-menu-shortcut></ui-menu-item>
    <ui-menu-item value="reload">Reload <ui-menu-shortcut>⌘R</ui-menu-shortcut></ui-menu-item>
    <ui-menu-separator></ui-menu-separator>
    <ui-menu-checkbox-item value="bookmarks" checked>Show Bookmarks</ui-menu-checkbox-item>
    <ui-menu-separator></ui-menu-separator>
    <ui-menu-label>People</ui-menu-label>
    <ui-menu-radio-group value="pedro">
      <ui-menu-radio-item value="pedro">Pedro Duarte</ui-menu-radio-item>
      <ui-menu-radio-item value="colm">Colm Tuite</ui-menu-radio-item>
    </ui-menu-radio-group>
  </ui-context-menu-content>
</ui-context-menu>
```

## Examples

### Handle the selection

`select` bubbles from the chosen item; `event.detail.value` is its `value`.

```html live
<custom-element name="context-menu-file-demo">
  <script type="realm">
    const file = useState({ name: "report.pdf", log: "Right click the file." });

    const ACTIONS = {
      open: (name) => `Opened ${name}.`,
      rename: (name) => `Renaming ${name}.`,
      delete: (name) => `Deleted ${name}.`,
    };

    function act(event) {
      file.log = ACTIONS[event.detail.value](file.name);
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      justify-items: center;
      gap: calc(var(--spacing) * 3);
      font-size: var(--text-sm);
    }
    .file {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 2);
      padding: calc(var(--spacing) * 3) calc(var(--spacing) * 4);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
    }
    svg {
      width: calc(var(--spacing) * 4);
      height: calc(var(--spacing) * 4);
    }
    output {
      color: var(--muted-foreground);
    }
  </style>

  <ui-context-menu onselect="act(event)">
    <ui-context-menu-trigger>
      <div class="file">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 3H6v18h12V7Z" /><path d="M14 3v4h4" /></svg>
        <slot name="#file.name"></slot>
      </div>
    </ui-context-menu-trigger>
    <ui-context-menu-content>
      <ui-menu-item value="open">Open</ui-menu-item>
      <ui-menu-item value="rename">Rename</ui-menu-item>
      <ui-menu-separator></ui-menu-separator>
      <ui-menu-item value="delete" variant="destructive">Delete</ui-menu-item>
    </ui-context-menu-content>
  </ui-context-menu>
  <output><slot name="#file.log"></slot></output>
</custom-element>
<context-menu-file-demo></context-menu-file-demo>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-context-menu` | | Its parts, with no box of its own. |
| `ui-context-menu-trigger` | (default) | A block around the area. A `contextmenu` event inside it opens the menu at the pointer. |
| `ui-context-menu-content` | (default) | The menu: a bordered `popover="auto"` panel with `role="menu"`, positioned at the pointer with `position: fixed`. |
| `ui-menu-*` | (default) | Items, labels, groups, separators and shortcuts. See [Dropdown Menu](/components/dropdown-menu/). |

None of the parts has attributes of its own. See [Dropdown Menu](/components/dropdown-menu/) for the item attributes
(`value`, `disabled`, `variant`, `checked`).

### Events

| Event | Element | Detail | Description |
| --- | --- | --- | --- |
| `select` | `ui-menu-item`, `ui-menu-radio-item` | `{ value }` | Fired when an enabled item is chosen. Bubbles to `ui-context-menu`. The menu closes afterwards. |
| `select` | `ui-menu-checkbox-item` | `{ value, checked }` | Same, with the new checked state. |

### CSS parts

| Element | Part | Description |
| --- | --- | --- |
| `ui-context-menu-trigger` | `trigger` | The wrapper that listens for `contextmenu`. |
| `ui-context-menu-content` | `menu` | The focusgroup wrapper around the items. |

### Accessibility

- The content has `role="menu"` and its items `role="menuitem"`, `menuitemcheckbox` or `menuitemradio`.
- Opening focuses the first enabled item. Arrow Up and Arrow Down move focus with wrap-around, Home and End jump to the
  ends, Enter and Space choose, Escape closes.
- The menu opens on any `contextmenu` event from the trigger. Browsers also fire it for the context menu key and
  Shift+F10 on a focused element, so put a focusable element in the trigger if keyboard users need the menu. Offer
  the same actions somewhere else as well.
