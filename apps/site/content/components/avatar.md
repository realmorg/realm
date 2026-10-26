---
title: Avatar
description: A round image of a user or entity, with a text fallback while the image loads or when it fails.
group: Display
order: 202
nav: Avatar
---

# Avatar

`ui-avatar` is a small circle with a `ui-avatar-image` and a `ui-avatar-fallback` inside. The fallback, usually
initials or an icon, is shown until the image has loaded and again when it fails to load. Without an image only the
fallback is shown.

```html live
<div class="demo-row">
  <ui-avatar>
    <ui-avatar-image src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%236366f1'/%3E%3Ccircle cx='32' cy='26' r='12' fill='%23e0e7ff'/%3E%3Cpath d='M10 60c4-14 14-20 22-20s18 6 22 20' fill='%23e0e7ff'/%3E%3C/svg%3E" alt="Ada Lovelace"></ui-avatar-image>
    <ui-avatar-fallback>AL</ui-avatar-fallback>
  </ui-avatar>
  <ui-avatar>
    <ui-avatar-fallback>CN</ui-avatar-fallback>
  </ui-avatar>
</div>
```

## Examples

### Fallback

When the image cannot be loaded, the fallback is shown and the broken image is removed.

```html live
<ui-avatar>
  <ui-avatar-image src="data:image/png;base64,broken" alt="Grace Hopper"></ui-avatar-image>
  <ui-avatar-fallback>GH</ui-avatar-fallback>
</ui-avatar>
```

### Sizes

`size` is `sm` (24px), `default` (32px) or `lg` (40px). The small size uses `var(--text-xs)` for the fallback, so
keep it to one or two letters.

```html live
<div class="demo-row">
  <ui-avatar size="sm"><ui-avatar-fallback>S</ui-avatar-fallback></ui-avatar>
  <ui-avatar><ui-avatar-fallback>MD</ui-avatar-fallback></ui-avatar>
  <ui-avatar size="lg"><ui-avatar-fallback>LG</ui-avatar-fallback></ui-avatar>
</div>
```

### Square

`shape="square"` uses `var(--radius-md)` instead of a circle, for an organisation or project logo.

```html live
<ui-avatar shape="square"><ui-avatar-fallback>AC</ui-avatar-fallback></ui-avatar>
```

### Group

`ui-avatar-group` overlaps its children and draws a ring in the background colour around each one. The overlap
grows with the avatar `size`, and the initials of a covered avatar are centred in the part that stays visible.
`ui-avatar-group-count` is a muted pill for the number of people not shown. Give it the same `size` as the avatars;
it widens to fit longer counts.

```html live
<ui-avatar-group aria-label="Reviewers">
  <ui-avatar><ui-avatar-fallback>AL</ui-avatar-fallback></ui-avatar>
  <ui-avatar><ui-avatar-fallback>GH</ui-avatar-fallback></ui-avatar>
  <ui-avatar><ui-avatar-fallback>KJ</ui-avatar-fallback></ui-avatar>
  <ui-avatar-group-count>+3</ui-avatar-group-count>
</ui-avatar-group>
```

```html live
<ui-avatar-group aria-label="Customers">
  <ui-avatar size="lg"><ui-avatar-fallback>MR</ui-avatar-fallback></ui-avatar>
  <ui-avatar size="lg"><ui-avatar-fallback>WK</ui-avatar-fallback></ui-avatar>
  <ui-avatar size="lg"><ui-avatar-fallback>JD</ui-avatar-fallback></ui-avatar>
  <ui-avatar-group-count size="lg">+24k</ui-avatar-group-count>
</ui-avatar-group>
```

### In a list

```html live
<div class="demo-stack">
  <div class="demo-row-tight">
    <ui-avatar><ui-avatar-fallback>OM</ui-avatar-fallback></ui-avatar>
    <div>
      <p class="demo-text">Olivia Martin</p>
      <p class="demo-muted">olivia.martin@email.com</p>
    </div>
  </div>
  <div class="demo-row-tight">
    <ui-avatar><ui-avatar-fallback>JL</ui-avatar-fallback></ui-avatar>
    <div>
      <p class="demo-text">Jackson Lee</p>
      <p class="demo-muted">jackson.lee@email.com</p>
    </div>
  </div>
</div>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-avatar` | (root) | The circle (or rounded square) that clips its content. |
| `ui-avatar-image` | (default) | The `<img>`, hidden until it has loaded and removed when loading fails. |
| `ui-avatar-fallback` | (default) | Initials or an icon in `var(--muted-foreground)` on `var(--muted)`, shown until the image loads and when it fails. It keeps these colours on any background, such as a `--primary` panel. |
| `ui-avatar-group` | (root) | A row that overlaps its avatars, each with a ring in the background colour. |
| `ui-avatar-group-count` | (default) | A muted circle for a count such as "+3", inside `ui-avatar-group`. It is as tall as an avatar of the same `size` and widens into a pill for longer counts. |

The default slot of each part takes any content.

### Attributes

#### ui-avatar

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `"sm"` \| `"default"` \| `"lg"` | `"default"` | 24px, 32px or 40px square. |
| `shape` | `"circle"` \| `"square"` | `"circle"` | `square` uses `var(--radius-md)` corners. |

#### ui-avatar-group-count

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `"sm"` \| `"default"` \| `"lg"` | `"default"` | Matches the height and text size of `ui-avatar` at the same size. |

#### ui-avatar-image

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | string | | Image URL. |
| `alt` | string | `""` | Alternative text for the image. |

### CSS parts

| Part | Element | Description |
| --- | --- | --- |
| `image` | `ui-avatar-image` | The `<img>`. |
| `fallback` | `ui-avatar-fallback` | The `<span>` around the fallback content. |

### Accessibility

Give `alt` a name when the avatar is the only thing identifying a person. When the name is already shown next to
the avatar, leave `alt` empty so screen readers skip the image. The fallback text is read as normal text.
`ui-avatar-group` has `role="group"`. Name it with `aria-label` when the group needs a label.
