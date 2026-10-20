---
title: Menubar
description: A horizontal bar of menus, like the File and Edit menus of a desktop application, with triggers, menus and shared menu items.
group: Navigation
order: 404
nav: Menubar
---

# Menubar

`ui-menubar` is a bordered horizontal bar with `role="menubar"`. Each `ui-menubar-menu` in it pairs a
`ui-menubar-trigger`, a small button with `role="menuitem"`, with a `ui-menubar-content`, a `popover="auto"` menu
anchored under the trigger. The entries are the same `ui-menu-*` parts as in [Dropdown Menu](/components/dropdown-menu/).
The bar declares a `focusgroup`, so Left and Right arrows move between the triggers.

```html live
<ui-menubar>
  <ui-menubar-menu>
    <ui-menubar-trigger>File</ui-menubar-trigger>
    <ui-menubar-content>
      <ui-menu-item value="new-tab">New Tab <ui-menu-shortcut>⌘T</ui-menu-shortcut></ui-menu-item>
      <ui-menu-item value="new-window">New Window <ui-menu-shortcut>⌘N</ui-menu-shortcut></ui-menu-item>
      <ui-menu-separator></ui-menu-separator>
      <ui-menu-item value="print">Print… <ui-menu-shortcut>⌘P</ui-menu-shortcut></ui-menu-item>
    </ui-menubar-content>
  </ui-menubar-menu>
  <ui-menubar-menu>
    <ui-menubar-trigger>Edit</ui-menubar-trigger>
    <ui-menubar-content>
      <ui-menu-item value="undo">Undo <ui-menu-shortcut>⌘Z</ui-menu-shortcut></ui-menu-item>
      <ui-menu-item value="redo">Redo <ui-menu-shortcut>⇧⌘Z</ui-menu-shortcut></ui-menu-item>
      <ui-menu-separator></ui-menu-separator>
      <ui-menu-item value="cut">Cut</ui-menu-item>
      <ui-menu-item value="copy">Copy</ui-menu-item>
      <ui-menu-item value="paste" disabled>Paste</ui-menu-item>
    </ui-menubar-content>
  </ui-menubar-menu>
  <ui-menubar-menu>
    <ui-menubar-trigger>View</ui-menubar-trigger>
    <ui-menubar-content>
      <ui-menu-checkbox-item value="bookmarks" checked>Always Show Bookmarks Bar</ui-menu-checkbox-item>
      <ui-menu-separator></ui-menu-separator>
      <ui-menu-item value="reload">Reload <ui-menu-shortcut>⌘R</ui-menu-shortcut></ui-menu-item>
      <ui-menu-item value="fullscreen">Toggle Fullscreen</ui-menu-item>
    </ui-menubar-content>
  </ui-menubar-menu>
</ui-menubar>
```

## Examples

### Handling commands

Every item emits a bubbling `select` event with `{ value }` in `detail`, and its menu closes. Listen once on the
menubar to handle every menu.

```html live
<custom-element name="menubar-commands-demo">
  <script type="realm">
    const log = useState({ last: "none" });

    function run(event) {
      log.last = event.detail.value;
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
      justify-items: center;
    }
    p {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--muted-foreground);
    }
  </style>

  <ui-menubar onselect="run(event)">
    <ui-menubar-menu>
      <ui-menubar-trigger>File</ui-menubar-trigger>
      <ui-menubar-content>
        <ui-menu-item value="open">Open…</ui-menu-item>
        <ui-menu-item value="save">Save</ui-menu-item>
      </ui-menubar-content>
    </ui-menubar-menu>
    <ui-menubar-menu>
      <ui-menubar-trigger>Profiles</ui-menubar-trigger>
      <ui-menubar-content>
        <ui-menu-radio-group value="benoit">
          <ui-menu-radio-item value="andy">Andy</ui-menu-radio-item>
          <ui-menu-radio-item value="benoit">Benoit</ui-menu-radio-item>
        </ui-menu-radio-group>
        <ui-menu-separator></ui-menu-separator>
        <ui-menu-item value="remove" variant="destructive">Remove profile</ui-menu-item>
      </ui-menubar-content>
    </ui-menubar-menu>
  </ui-menubar>
  <p>Last command: <slot name="#log.last"></slot></p>
</custom-element>
<menubar-commands-demo></menubar-commands-demo>
```

### Toolbar of buttons

A menubar can also hold plain buttons. Left and Right arrows move focus between them and wrap at the ends.

```html live
<ui-menubar>
  <ui-button variant="ghost" size="sm">Bold</ui-button>
  <ui-button variant="ghost" size="sm">Italic</ui-button>
  <ui-button variant="ghost" size="sm">Underline</ui-button>
</ui-menubar>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-menubar` | | The bordered bar, `role="menubar"`, with a gap between menus. |
| `ui-menubar-menu` | (default) | One menu: its trigger and content, with no box of its own. |
| `ui-menubar-trigger` | (default) | A `<button>` with `role="menuitem"` and `aria-haspopup="menu"` in `var(--text-sm)` medium. A click toggles its menu. |
| `ui-menubar-content` | (default) | The menu: a bordered `popover="auto"` panel with `role="menu"`, anchored under the trigger. |
| `ui-menu-*` | (default) | Items, labels, groups, separators and shortcuts. See [Dropdown Menu](/components/dropdown-menu/). |

None of the menubar parts has attributes of its own. See [Dropdown Menu](/components/dropdown-menu/) for the item
attributes and the `select` event.

### CSS parts

| Element | Part | Description |
| --- | --- | --- |
| `ui-menubar` | `bar` | The focusgroup wrapper around the slot. It uses `display: contents`, so it does not affect layout. |
| `ui-menubar-trigger` | `trigger` | The `<button>`. |
| `ui-menubar-content` | `menu` | The focusgroup wrapper around the items. |

### Accessibility

- The bar has `role="menubar"`, each trigger is a `<button>` with `role="menuitem"` and `aria-haspopup="menu"`, and
  each content has `role="menu"`.
- Left and Right arrows move between triggers and wrap (`focusgroup="menubar inline wrap"`). Enter or Space on a
  trigger opens its menu and focuses the first enabled item.
- Inside an open menu, Up and Down arrows move between items and wrap, Home and End jump to the first and last item,
  Enter or Space selects, and Escape closes the menu and returns focus to the trigger. A click outside also closes it.
