---
title: Kbd
description: Styled keyboard keys and key combinations for shortcuts in menus, buttons, tooltips and help text.
group: Display
order: 208
nav: Kbd
---

# Kbd

`ui-kbd` shows a single key or key label in a small muted box. `ui-kbd-group` puts several keys in a row for a
shortcut. Both are presentational. Wrap them in a native `<kbd>` when the text should be marked up as keyboard
input.

```html live
<ui-kbd-group>
  <ui-kbd>⌘</ui-kbd>
  <ui-kbd>⇧</ui-kbd>
  <ui-kbd>⌥</ui-kbd>
  <ui-kbd>⌃</ui-kbd>
</ui-kbd-group>
<ui-kbd-group>
  <ui-kbd>Ctrl</ui-kbd>
  <span>+</span>
  <ui-kbd>B</ui-kbd>
</ui-kbd-group>
```

## Examples

### In text

```html live
<p class="demo-muted">
  Press <ui-kbd>⌘</ui-kbd> <ui-kbd>K</ui-kbd> to open the command palette, or <ui-kbd>Esc</ui-kbd> to close it.
</p>
```

### In a button

A key label inside a button hints at its shortcut.

```html live
<ui-button variant="outline" size="sm">Search… <ui-kbd>⌘K</ui-kbd></ui-button>
<ui-button variant="outline" size="sm">Accept <ui-kbd>⏎</ui-kbd></ui-button>
```

### With semantic markup

Wrap the keys in `<kbd>` so the shortcut is also marked up as keyboard input. Each `ui-kbd` sets its own font, so
the native monospace font of `<kbd>` does not reach the key labels.

```html live
<kbd>
  <ui-kbd-group>
    <ui-kbd>Ctrl</ui-kbd>
    <ui-kbd>Shift</ui-kbd>
    <ui-kbd>P</ui-kbd>
  </ui-kbd-group>
</kbd>
```

### In a tooltip

```html live
<ui-tooltip>
  <ui-tooltip-trigger><ui-button variant="outline">Save</ui-button></ui-tooltip-trigger>
  <ui-tooltip-content>Save draft <ui-kbd>⌘S</ui-kbd></ui-tooltip-content>
</ui-tooltip>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-kbd` | (default) | One key in a small muted box. Its default slot takes the key label: a character, a word, or a small `<svg>` icon. |
| `ui-kbd-group` | (default) | An inline row of keys with a small gap. Its default slot takes the `ui-kbd` elements and any separators such as `+` or `then`. |

### Attributes

Neither element has attributes.

### CSS parts

None. Both elements render only a slot.

### Accessibility

Neither element has a role. Screen readers read the key labels as text, so prefer words such as `Ctrl` or
`Esc` over symbols when the audience may not know the symbols, or add visually hidden text. `ui-kbd` sets
`pointer-events: none` and `user-select: none`, so clicks go to the surrounding element.
