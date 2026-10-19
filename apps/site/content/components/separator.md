---
title: Separator
description: A thin horizontal or vertical line that divides content, with the ARIA separator role.
group: Display
order: 210
nav: Separator
---

# Separator

`ui-separator` draws a one pixel line in the border colour. It is horizontal by default and fills the width of
its container; set `orientation="vertical"` to divide items in a row. The element has the role `separator` and
reports its orientation to assistive technology. It has no margin: the space around it comes from the gap of its
container.

```html live
<div class="demo-narrow demo-stack demo-text">
  <div class="demo-stack-tight">
    <strong>REALM UI</strong>
    <p class="demo-muted">Native custom elements for every app.</p>
  </div>
  <ui-separator></ui-separator>
  <div class="demo-row">
    <span>Blog</span>
    <ui-separator orientation="vertical"></ui-separator>
    <span>Docs</span>
    <ui-separator orientation="vertical"></ui-separator>
    <span>Source</span>
  </div>
</div>
```

## Examples

### Vertical

A vertical separator stretches to the height of its flex row, which the tallest item sets.

```html live
<div class="demo-row-tight">
  <ui-button variant="ghost" size="sm">Bold</ui-button>
  <ui-button variant="ghost" size="sm">Italic</ui-button>
  <ui-separator orientation="vertical"></ui-separator>
  <ui-button variant="ghost" size="sm">Link</ui-button>
</div>
```

### Between list items

```html live
<div class="demo-narrow demo-stack-tight demo-text">
  <div>Account</div>
  <ui-separator></ui-separator>
  <div>Billing</div>
  <ui-separator></ui-separator>
  <div>Notifications</div>
</div>
```

### With a label

For a label between two lines, such as an "or" divider, use `<ui-marker variant="separator">` instead of two
separators.

```html live
<div class="demo-narrow">
  <ui-marker variant="separator">Or continue with</ui-marker>
</div>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-separator` | (default) | A one pixel line in `var(--border)`, 100% wide when horizontal. It has no slot and takes no content. |

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `"horizontal"` \| `"vertical"` | `"horizontal"` | Direction of the line. Also sets `aria-orientation`. |

### CSS parts

None. The separator renders no shadow content; style the element itself.

### Accessibility

The element has the role `separator` and `aria-orientation` set from `orientation`, both through
`ElementInternals`. For a purely decorative line that should be skipped by screen readers, add
`role="none"`.
