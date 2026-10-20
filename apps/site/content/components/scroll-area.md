---
title: Scroll Area
description: A box with its own thin, themed scrollbar for content that is taller or wider than the space it is given.
group: Layout
order: 505
nav: Scroll Area
---

# Scroll Area

`ui-scroll-area` wraps its content in a native scrolling viewport with a thin scrollbar in the theme's border colour.
Scrolling, momentum and keyboard scrolling are the browser's own. Give it a `height` (or a `width` for horizontal
scrolling) in spacing units. The content scrolls inside it. `variant="outline"` adds a border.

```html live
<ui-scroll-area variant="outline" width="48" height="72">
  <ui-item-group aria-label="Tags">
    <ui-item size="sm">v1.2.0-beta.50</ui-item>
    <ui-separator></ui-separator>
    <ui-item size="sm">v1.2.0-beta.49</ui-item>
    <ui-separator></ui-separator>
    <ui-item size="sm">v1.2.0-beta.48</ui-item>
    <ui-separator></ui-separator>
    <ui-item size="sm">v1.2.0-beta.47</ui-item>
    <ui-separator></ui-separator>
    <ui-item size="sm">v1.2.0-beta.46</ui-item>
    <ui-separator></ui-separator>
    <ui-item size="sm">v1.2.0-beta.45</ui-item>
    <ui-separator></ui-separator>
    <ui-item size="sm">v1.2.0-beta.44</ui-item>
    <ui-separator></ui-separator>
    <ui-item size="sm">v1.2.0-beta.43</ui-item>
    <ui-separator></ui-separator>
    <ui-item size="sm">v1.2.0-beta.42</ui-item>
    <ui-separator></ui-separator>
    <ui-item size="sm">v1.2.0-beta.41</ui-item>
    <ui-separator></ui-separator>
    <ui-item size="sm">v1.2.0-beta.40</ui-item>
    <ui-separator></ui-separator>
    <ui-item size="sm">v1.2.0-beta.39</ui-item>
  </ui-item-group>
</ui-scroll-area>
```

## Examples

### Horizontal

`orientation="horizontal"` scrolls sideways and clips vertical overflow. The image below keeps its own `width`
and `height` attributes, so it is wider than the box, which fills a wrapper.

```html live
<div class="demo-medium">
  <ui-scroll-area orientation="horizontal" variant="outline">
    <img width="960" height="240" alt="A mountain range at sunset" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 240'%3E%3Crect width='960' height='240' fill='%23f4a261'/%3E%3Ccircle cx='720' cy='70' r='30' fill='%23e9c46a'/%3E%3Cpath d='M0 240 140 90l90 90 110-120 150 180 120-100 140 110 110-80 100 60v10z' fill='%23264653'/%3E%3C/svg%3E">
  </ui-scroll-area>
</div>
```

### Both directions

`orientation="both"` scrolls in both directions, for example to pan a large image or a wide table in a
fixed-size box.

```html live
<div class="demo-medium">
  <ui-scroll-area orientation="both" variant="outline" height="60">
    <img width="800" height="600" alt="A route drawn on a grid map" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3Cpattern id='g' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M40 0H0v40' fill='none' stroke='%23264653' stroke-opacity='.25'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='800' height='600' fill='%23e9f5f2'/%3E%3Crect width='800' height='600' fill='url(%23g)'/%3E%3Cpath d='M60 520C200 380 300 460 420 300S640 120 740 80' fill='none' stroke='%23f4a261' stroke-width='8' stroke-linecap='round'/%3E%3Ccircle cx='60' cy='520' r='14' fill='%23264653'/%3E%3Ccircle cx='740' cy='80' r='14' fill='%23e76f51'/%3E%3C/svg%3E">
  </ui-scroll-area>
</div>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-scroll-area` | (default) | A clipped box with a focusable scrolling viewport. Its default slot takes any content, which scrolls inside the viewport. |

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `"vertical"` \| `"horizontal"` \| `"both"` | `"vertical"` | Which directions scroll. Overflow in the other direction is clipped. |
| `width` | number | none | Width in spacing units (`calc(var(--spacing) * width)`). Without it the element fills its container. |
| `height` | number | none | Height in spacing units. Without it the element grows with its content and nothing scrolls vertically. |
| `variant` | `"default"` \| `"outline"` | `"default"` | `outline` adds a 1px border in `var(--border)` with `var(--radius-md)` corners. |

### CSS parts

| Part | Description |
| --- | --- |
| `viewport` | The scrolling container. Style `scrollbar-color` or `scrollbar-width` here to change the scrollbar. |

### Accessibility

- The viewport is focusable (`tabindex="0"`) and shows a focus ring, so keyboard users can scroll it with the arrow
  keys, Page Up, Page Down, Home and End.
- The viewport inherits the element's border radius, so the focus ring follows rounded corners, including the
  `outline` variant.
