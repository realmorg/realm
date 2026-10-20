---
title: Aspect Ratio
description: A box that keeps its content at a fixed width-to-height ratio, for images, video and embeds.
group: Layout
order: 501
nav: Aspect Ratio
---

# Aspect Ratio

`ui-aspect-ratio` is a block that sizes its height from its width with the CSS `aspect-ratio` property and clips
anything that overflows. It fills the width of its container, so size it with a wrapper. A slotted `<img>`,
`<video>` or `<iframe>` is stretched to fill the box with `object-fit: cover`. Put the radius and background on
the content, not on the box.

```html live
<div class="demo-medium">
  <ui-aspect-ratio ratio="16 / 9">
    <div class="demo-tile">16 / 9</div>
  </ui-aspect-ratio>
</div>
```

## Examples

### Ratios

`ratio` takes any value the CSS `aspect-ratio` property accepts, such as `1 / 1`, `4 / 3` or `2.35`.

```html live
<div class="demo-narrow demo-stack">
  <ui-aspect-ratio ratio="21 / 9">
    <div class="demo-tile">21 / 9</div>
  </ui-aspect-ratio>
  <ui-aspect-ratio ratio="4 / 3">
    <div class="demo-tile">4 / 3</div>
  </ui-aspect-ratio>
  <ui-aspect-ratio ratio="1 / 1">
    <div class="demo-tile">1 / 1</div>
  </ui-aspect-ratio>
</div>
```

### Image

A slotted image covers the whole box and is cropped to the ratio.

```html live
<div class="demo-narrow">
  <ui-aspect-ratio ratio="4 / 3">
    <img class="demo-image" alt="A mountain range at sunset" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f4a261'/%3E%3Cpath d='M0 200 120 70l70 80 60-50 150 100z' fill='%23264653'/%3E%3Ccircle cx='300' cy='60' r='28' fill='%23e9c46a'/%3E%3C/svg%3E">
  </ui-aspect-ratio>
</div>
```

### Video embed

```html
<ui-aspect-ratio ratio="16 / 9">
  <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Product tour" allowfullscreen></iframe>
</ui-aspect-ratio>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-aspect-ratio` | (default) | A full-width block at the given ratio that clips overflow. Its default slot takes any content. `<img>`, `<video>` and `<iframe>` fill the box and use `object-fit: cover`. |

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `ratio` | string | `"16 / 9"` | Width-to-height ratio, as a CSS `aspect-ratio` value. |

### CSS parts

None. The box renders only a slot.

### CSS states and custom properties

The ratio is applied through the reactive custom property `--attr-ratio`, which mirrors the `ratio` attribute.

### Accessibility

The element adds no semantics. Give images an `alt` text and iframes a `title`.
