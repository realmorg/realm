---
title: Skeleton
description: A pulsing placeholder block that shows the shape of content while it loads.
group: Display
order: 211
nav: Skeleton
---

# Skeleton

`ui-skeleton` is an empty block with a muted background and a slow pulse. Size it with `width` and `height` in
spacing units (`width="12"` is `calc(var(--spacing) * 12)`), and set `shape="circle"` for avatars. Without a
`width` it fills its container. The pulse stops when the user prefers reduced motion.

```html live
<div class="demo-row">
  <ui-skeleton shape="circle" width="12" height="12"></ui-skeleton>
  <div class="demo-stack-tight">
    <ui-skeleton width="62" height="4"></ui-skeleton>
    <ui-skeleton width="50" height="4"></ui-skeleton>
  </div>
</div>
```

## Examples

### Card

Skeletons without a `width` fill the wrapper, so the wrapper sets the width of the whole placeholder.

```html live
<div class="demo-narrow demo-stack">
  <ui-skeleton height="32"></ui-skeleton>
  <div class="demo-stack-tight">
    <ui-skeleton height="4"></ui-skeleton>
    <ui-skeleton width="50" height="4"></ui-skeleton>
  </div>
</div>
```

### While loading

Show skeletons until data arrives, then swap them for the content with `<is-visible>` and `<is-hidden>`.

```html live
<custom-element name="skeleton-profile-demo">
  <script type="realm">
    const profile = useState({ loaded: false });

    function toggle() {
      profile.loaded = !profile.loaded;
    }
  </script>
  <style type="realm">
    :host {
      display: grid;
      justify-items: start;
      gap: calc(var(--spacing) * 4);
      width: calc(var(--spacing) * 72);
    }
    .row {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 3);
      height: calc(var(--spacing) * 10);
      font-size: var(--text-sm);
    }
    .lines {
      display: grid;
      gap: calc(var(--spacing) * 2);
    }
    small {
      color: var(--muted-foreground);
    }
  </style>
  <is-hidden when="#profile.loaded">
    <div class="row" aria-busy="true">
      <ui-skeleton shape="circle" width="8" height="8"></ui-skeleton>
      <div class="lines"><ui-skeleton width="40" height="3"></ui-skeleton><ui-skeleton width="40" height="3"></ui-skeleton></div>
    </div>
  </is-hidden>
  <is-visible when="#profile.loaded">
    <div class="row">
      <ui-avatar><ui-avatar-fallback>OM</ui-avatar-fallback></ui-avatar>
      <div class="lines"><span>Olivia Martin</span><small>olivia.martin@email.com</small></div>
    </div>
  </is-visible>
  <ui-button size="sm" variant="outline" onclick="toggle()">Toggle loaded</ui-button>
</custom-element>
<skeleton-profile-demo></skeleton-profile-demo>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-skeleton` | (default) | A pulsing block in `var(--accent)` with `var(--radius-md)` corners. It has no slot and takes no content. |

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | number | none | Width in spacing units (`calc(var(--spacing) * width)`). Without it the skeleton fills its container. |
| `height` | number | none | Height in spacing units. |
| `shape` | `"circle"` | none | Fully rounded corners, and the skeleton does not shrink in a flex row. Use with equal `width` and `height`. |

### CSS parts

None. The skeleton renders no shadow content.

### Accessibility

The skeleton has no role and no text, so screen readers ignore it. Mark the loading region with
`aria-busy="true"` and remove it when the content is in place.
