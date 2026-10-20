---
title: Carousel
description: A scroll-snapping slideshow with previous and next buttons, arrow-key navigation and swipe support.
group: Layout
order: 502
nav: Carousel
---

# Carousel

`ui-carousel` is a slideshow built on a native scroll container with CSS scroll snapping, so touch swiping,
trackpads and the scroll wheel work without script. Put the slides, one `ui-carousel-item` each, in a
`ui-carousel-content`. The optional `ui-carousel-previous` and `ui-carousel-next` buttons sit either side of the
track, scroll one slide at a time and are disabled at the ends. The carousel is as wide as its container, so size it
with a wrapper.

```html live
<div class="demo-narrow">
  <ui-carousel>
    <ui-carousel-content>
      <ui-carousel-item>
        <ui-card>
          <ui-card-content>
            <ui-aspect-ratio ratio="1"><div class="demo-tile">1</div></ui-aspect-ratio>
          </ui-card-content>
        </ui-card>
      </ui-carousel-item>
      <ui-carousel-item>
        <ui-card>
          <ui-card-content>
            <ui-aspect-ratio ratio="1"><div class="demo-tile">2</div></ui-aspect-ratio>
          </ui-card-content>
        </ui-card>
      </ui-carousel-item>
      <ui-carousel-item>
        <ui-card>
          <ui-card-content>
            <ui-aspect-ratio ratio="1"><div class="demo-tile">3</div></ui-aspect-ratio>
          </ui-card-content>
        </ui-card>
      </ui-carousel-item>
      <ui-carousel-item>
        <ui-card>
          <ui-card-content>
            <ui-aspect-ratio ratio="1"><div class="demo-tile">4</div></ui-aspect-ratio>
          </ui-card-content>
        </ui-card>
      </ui-carousel-item>
      <ui-carousel-item>
        <ui-card>
          <ui-card-content>
            <ui-aspect-ratio ratio="1"><div class="demo-tile">5</div></ui-aspect-ratio>
          </ui-card-content>
        </ui-card>
      </ui-carousel-item>
    </ui-carousel-content>
    <ui-carousel-previous></ui-carousel-previous>
    <ui-carousel-next></ui-carousel-next>
  </ui-carousel>
</div>
```

## Examples

### Vertical

`orientation="vertical"` snaps slides top to bottom and moves the buttons above and below the track, rotated. A
vertical carousel needs a height: set `height` in spacing units and the track fills what the buttons leave. Each
slide fills the track.

```html live
<div class="demo-narrow">
  <ui-carousel orientation="vertical" height="56">
    <ui-carousel-content>
      <ui-carousel-item><div class="demo-tile">1</div></ui-carousel-item>
      <ui-carousel-item><div class="demo-tile">2</div></ui-carousel-item>
      <ui-carousel-item><div class="demo-tile">3</div></ui-carousel-item>
    </ui-carousel-content>
    <ui-carousel-previous></ui-carousel-previous>
    <ui-carousel-next></ui-carousel-next>
  </ui-carousel>
</div>
```

### Without buttons

Leave out the previous and next parts for a carousel moved only by swiping, scrolling or the arrow keys.

```html live
<div class="demo-narrow">
  <ui-carousel label="Tips">
    <ui-carousel-content>
      <ui-carousel-item><div class="demo-tile">Swipe</div></ui-carousel-item>
      <ui-carousel-item><div class="demo-tile">Scroll</div></ui-carousel-item>
      <ui-carousel-item><div class="demo-tile">Arrow keys</div></ui-carousel-item>
    </ui-carousel-content>
  </ui-carousel>
</div>
```

### Slide counter

The carousel fires `change` with the index of the visible slide whenever scrolling settles, from the buttons, the
keyboard or a swipe.

```html live
<custom-element name="carousel-counter-demo">
  <script type="realm">
    const slides = useState({
      index: 0,
      get text() {
        return `Slide ${this.index + 1} of 3`;
      },
    });

    function changed(event) {
      slides.index = event.detail.index;
    }
  </script>
  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      width: min(100%, calc(var(--spacing) * 88));
    }
    .slide {
      display: grid;
      place-items: center;
      height: calc(var(--spacing) * 32);
      border-radius: var(--radius-lg);
      background: var(--muted);
      font-size: var(--text-sm);
    }
    p {
      margin: 0;
      text-align: center;
      font-size: var(--text-sm);
      color: var(--muted-foreground);
    }
  </style>
  <ui-carousel label="Product photos" onchange="changed(event)">
    <ui-carousel-content>
      <ui-carousel-item><div class="slide">Front</div></ui-carousel-item>
      <ui-carousel-item><div class="slide">Side</div></ui-carousel-item>
      <ui-carousel-item><div class="slide">Back</div></ui-carousel-item>
    </ui-carousel-content>
    <ui-carousel-previous></ui-carousel-previous>
    <ui-carousel-next></ui-carousel-next>
  </ui-carousel>
  <p><slot name="#slides.text"></slot></p>
</custom-element>
<carousel-counter-demo></carousel-counter-demo>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-carousel-content` | (default) | The scroll-snapping track (`part="track"`). It is focusable and the arrow keys move between slides. |
| `ui-carousel-item` | (default) of `ui-carousel-content` | One slide, the full width (or height) of the track, borders and padding included. |
| `ui-carousel-previous` | (default) | An outline icon button that scrolls to the previous slide. Left of the track, or above it when vertical. |
| `ui-carousel-next` | (default) | An outline icon button that scrolls to the next slide. Right of the track, or below it when vertical. |

The parts place themselves in the carousel's grid, so their source order does not matter. The default slot of
`ui-carousel-item` takes any content.

### Attributes

#### ui-carousel

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `"horizontal"` \| `"vertical"` | `"horizontal"` | Scroll and snap direction. A vertical carousel needs a `height`. |
| `label` | string | `"Carousel"` | Accessible name of the region. |
| `height` | number | none | Height in spacing units: `height="56"` is `calc(var(--spacing) * 56)`. Needed for a vertical carousel. |

`ui-carousel-content`, `ui-carousel-item`, `ui-carousel-previous` and `ui-carousel-next` have no attributes.

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `change` | `{ index: number }` | Fires on `ui-carousel` when scrolling of the track ends. `index` is the zero-based index of the slide in view. Bubbles. |

### CSS parts

| Part | Element | Description |
| --- | --- | --- |
| `track` | `ui-carousel-content` | The scroll container holding the slides. |

### Accessibility

- `ui-carousel` has `role="region"`, `aria-roledescription="carousel"` and the accessible name from `label`.
- Each `ui-carousel-item` has `role="group"` and `aria-roledescription="slide"`.
- The track is focusable. Left and Up arrows scroll to the previous slide, Right and Down arrows to the next.
- The buttons are labelled "Previous slide" and "Next slide" and are disabled on the first and last slide.
- Slides are not hidden from assistive technology, and there is no autoplay.
