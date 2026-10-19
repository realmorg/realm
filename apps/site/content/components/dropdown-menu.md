---
title: Dropdown Menu
description: A menu of actions that opens from a trigger, with labels, groups, separators, shortcuts, checkbox and radio items, keyboard navigation and a select event.
group: Overlays
order: 306
nav: Dropdown Menu
---

# Dropdown Menu

`ui-dropdown-menu` pairs a `ui-dropdown-menu-trigger` with a `ui-dropdown-menu-content`. The content is a native
`popover="auto"` element with `role="menu"`, anchored to the trigger with CSS anchor positioning, so it closes on
Escape, on a click outside and when focus leaves it. Opening moves focus to the first enabled item, the arrow keys
move between items and Enter or Space chooses one.

The items are shared with [Context Menu](/components/context-menu/) and [Menubar](/components/menubar/):
`ui-menu-item`, `ui-menu-checkbox-item`, `ui-menu-radio-group` with `ui-menu-radio-item`, `ui-menu-label`,
`ui-menu-group`, `ui-menu-separator` and `ui-menu-shortcut`. Choosing an item fires a `select` event with the item's
`value` and closes the menu.

```html live
<ui-dropdown-menu onselect="document.dispatchEvent(new CustomEvent('toast', { detail: { title: 'Selected ' + event.detail.value } }))">
  <ui-dropdown-menu-trigger><ui-button variant="outline">Open menu</ui-button></ui-dropdown-menu-trigger>
  <ui-dropdown-menu-content>
    <ui-menu-label>My Account</ui-menu-label>
    <ui-menu-group>
      <ui-menu-item value="profile">Profile <ui-menu-shortcut>⇧⌘P</ui-menu-shortcut></ui-menu-item>
      <ui-menu-item value="billing">Billing <ui-menu-shortcut>⌘B</ui-menu-shortcut></ui-menu-item>
      <ui-menu-item value="settings">Settings <ui-menu-shortcut>⌘S</ui-menu-shortcut></ui-menu-item>
    </ui-menu-group>
    <ui-menu-separator></ui-menu-separator>
    <ui-menu-item value="logout" variant="destructive">Log out <ui-menu-shortcut>⇧⌘Q</ui-menu-shortcut></ui-menu-item>
  </ui-dropdown-menu-content>
</ui-dropdown-menu>
```

## Examples

### Handle the selection

`select` bubbles from the item, so one listener on `ui-dropdown-menu` handles every item. `event.detail.value` is the
item's `value`.

```html live
<custom-element name="dropdown-menu-sort-demo">
  <script type="realm">
    const list = useState({ sort: "newest" });

    function sorted(event) {
      list.sort = event.detail.value;
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

  <ui-dropdown-menu onselect="sorted(event)">
    <ui-dropdown-menu-trigger><ui-button variant="outline">Sort</ui-button></ui-dropdown-menu-trigger>
    <ui-dropdown-menu-content>
      <ui-menu-item value="newest">Newest first</ui-menu-item>
      <ui-menu-item value="oldest">Oldest first</ui-menu-item>
      <ui-menu-item value="name">Name</ui-menu-item>
    </ui-dropdown-menu-content>
  </ui-dropdown-menu>
  <span>Sorted by: <slot name="#list.sort"></slot></span>
</custom-element>
<dropdown-menu-sort-demo></dropdown-menu-sort-demo>
```

### Checkbox items

`ui-menu-checkbox-item` toggles its `checked` attribute when chosen. Its `select` event carries `{ value, checked }`.

```html live
<ui-dropdown-menu>
  <ui-dropdown-menu-trigger><ui-button variant="outline">View</ui-button></ui-dropdown-menu-trigger>
  <ui-dropdown-menu-content>
    <ui-menu-label>Appearance</ui-menu-label>
    <ui-menu-separator></ui-menu-separator>
    <ui-menu-checkbox-item value="status-bar" checked>Status Bar</ui-menu-checkbox-item>
    <ui-menu-checkbox-item value="activity-bar" disabled>Activity Bar</ui-menu-checkbox-item>
    <ui-menu-checkbox-item value="panel">Panel</ui-menu-checkbox-item>
  </ui-dropdown-menu-content>
</ui-dropdown-menu>
```

### Radio items

`ui-menu-radio-group` holds `ui-menu-radio-item` elements and keeps one of them checked. Its `value` attribute is the
checked item's value and updates when another item is chosen.

```html live
<ui-dropdown-menu>
  <ui-dropdown-menu-trigger><ui-button variant="outline">Panel position</ui-button></ui-dropdown-menu-trigger>
  <ui-dropdown-menu-content>
    <ui-menu-label>Panel Position</ui-menu-label>
    <ui-menu-separator></ui-menu-separator>
    <ui-menu-radio-group value="bottom">
      <ui-menu-radio-item value="top">Top</ui-menu-radio-item>
      <ui-menu-radio-item value="bottom">Bottom</ui-menu-radio-item>
      <ui-menu-radio-item value="right">Right</ui-menu-radio-item>
    </ui-menu-radio-group>
  </ui-dropdown-menu-content>
</ui-dropdown-menu>
```

### Icons, disabled and destructive items

A slotted `<svg>` is sized and muted. `disabled` items are skipped by the keyboard and ignore clicks.
`variant="destructive"` colours an item for dangerous actions.

```html live
<ui-dropdown-menu>
  <ui-dropdown-menu-trigger><ui-button variant="outline">Actions</ui-button></ui-dropdown-menu-trigger>
  <ui-dropdown-menu-content>
    <ui-menu-item value="edit">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
      Edit
    </ui-menu-item>
    <ui-menu-item value="duplicate">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M4 16V6a2 2 0 0 1 2-2h10" /></svg>
      Duplicate
    </ui-menu-item>
    <ui-menu-item value="share" disabled>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12v8h16v-8M12 3v12M7 8l5-5 5 5" /></svg>
      Share
    </ui-menu-item>
    <ui-menu-separator></ui-menu-separator>
    <ui-menu-item value="delete" variant="destructive">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
      Delete
    </ui-menu-item>
  </ui-dropdown-menu-content>
</ui-dropdown-menu>
```

### Placement

`placement` on `ui-dropdown-menu-content` sets where the menu opens relative to the trigger: `bottom-start` (default),
`bottom-end`, `top-start` or `top-end`. The menu flips when there is not enough room.

```html live
<div class="demo-row-tight">
  <ui-dropdown-menu>
    <ui-dropdown-menu-trigger><ui-button variant="outline">Bottom end</ui-button></ui-dropdown-menu-trigger>
    <ui-dropdown-menu-content placement="bottom-end">
      <ui-menu-item value="one">First item</ui-menu-item>
      <ui-menu-item value="two">Second item</ui-menu-item>
    </ui-dropdown-menu-content>
  </ui-dropdown-menu>
  <ui-dropdown-menu>
    <ui-dropdown-menu-trigger><ui-button variant="outline">Top start</ui-button></ui-dropdown-menu-trigger>
    <ui-dropdown-menu-content placement="top-start">
      <ui-menu-item value="one">First item</ui-menu-item>
      <ui-menu-item value="two">Second item</ui-menu-item>
    </ui-dropdown-menu-content>
  </ui-dropdown-menu>
</div>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-dropdown-menu` | | Its parts, with no box of its own. |
| `ui-dropdown-menu-trigger` | (default) | An inline block around the trigger. A click on it focuses the element inside and toggles the menu. |
| `ui-dropdown-menu-content` | (default) | The menu: a bordered `popover="auto"` panel with `role="menu"`, anchored to the trigger. |
| `ui-menu-item` | (default) | A row with `role="menuitem"`: an optional leading `<svg>`, the label and an optional shortcut. |
| `ui-menu-checkbox-item` | (default) | A row with `role="menuitemcheckbox"` and a check mark when `checked`. |
| `ui-menu-radio-group` | (default) | A group (`role="group"`) that keeps one radio item checked. |
| `ui-menu-radio-item` | (default) | A row with `role="menuitemradio"` and a dot when checked. Place it in `ui-menu-radio-group`. |
| `ui-menu-label` | (default) | A heading row in `var(--text-sm)` medium. Not focusable. |
| `ui-menu-group` | (default) | A block with `role="group"` around related items. |
| `ui-menu-separator` | (default) | A one-pixel line with `role="separator"`. |
| `ui-menu-shortcut` | (default) | Muted `var(--text-xs)` text pushed to the end of its item. Place it in an item. |

The `ui-menu-*` parts work the same in `ui-context-menu-content` and `ui-menubar-content`.

### ui-dropdown-menu-content attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `placement` | `"bottom-start"` \| `"bottom-end"` \| `"top-start"` \| `"top-end"` | `"bottom-start"` | Where the menu opens relative to the trigger. |

### ui-menu-item attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | string | | Sent as `event.detail.value` when the item is chosen. |
| `disabled` | boolean | `false` | Ignores clicks and keys, sets `aria-disabled` and skips the item in keyboard navigation. |
| `variant` | `"default"` \| `"destructive"` | `"default"` | Destructive items use the destructive colour. |

### ui-menu-checkbox-item attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | string | | Sent in `event.detail.value`. |
| `checked` | boolean | `false` | Whether the item is checked. Toggled when chosen; reflects to the attribute. |
| `disabled` | boolean | `false` | Ignores clicks and keys and skips the item in keyboard navigation. |

### ui-menu-radio-group and ui-menu-radio-item attributes

| Element | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `ui-menu-radio-group` | `value` | string | | The checked item's value. Updated when an item is chosen; reflects to the attribute. |
| `ui-menu-radio-item` | `value` | string | | The item's value. |
| `ui-menu-radio-item` | `disabled` | boolean | `false` | Ignores clicks and keys and skips the item in keyboard navigation. |

### Events

| Event | Element | Detail | Description |
| --- | --- | --- | --- |
| `select` | `ui-menu-item`, `ui-menu-radio-item` | `{ value }` | Fired when an enabled item is clicked or activated with Enter or Space. Bubbles and is composed, so you can listen on `ui-dropdown-menu`. The menu closes afterwards. |
| `select` | `ui-menu-checkbox-item` | `{ value, checked }` | Same, with the new checked state. |

### CSS parts

| Element | Part | Description |
| --- | --- | --- |
| `ui-dropdown-menu-trigger` | `trigger` | The wrapper that listens for clicks. It is the anchor for positioning. |
| `ui-dropdown-menu-content` | `menu` | The focusgroup wrapper around the items. |
| `ui-menu-checkbox-item`, `ui-menu-radio-item` | `indicator` | The check mark or dot. |

### CSS states

| Name | Description |
| --- | --- |
| `ui-menu-item:state(attr-disabled)` | Matches disabled items. |
| `ui-menu-item:state(attr-variant-is-destructive)` | Matches destructive items. |
| `ui-menu-checkbox-item:state(attr-checked)` | Matches checked checkbox items. Radio items have the same state. |
| `ui-dropdown-menu-content:popover-open` | Matches while the menu is open. |

### Accessibility

- The content has `role="menu"`; items have `role="menuitem"`, `menuitemcheckbox` or `menuitemradio` with
  `aria-checked`, and `tabindex="-1"`. Groups and the radio group have `role="group"`, separators `role="separator"`.
- Opening the menu focuses the first enabled item. Arrow Up and Arrow Down move focus and wrap around; Home and End
  jump to the first and last item.
- Enter and Space choose the focused item. Escape, a click outside or moving focus out of the menu closes it.
- When the menu closes with focus inside it, focus returns to the trigger.
