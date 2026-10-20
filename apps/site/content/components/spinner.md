---
title: Spinner
description: A rotating loading indicator with the status role and an accessible label.
group: Display
order: 212
nav: Spinner
---

# Spinner

`ui-spinner` is a small rotating arc that shows work in progress. It has the role `status` and an accessible
name taken from `label`, which defaults to "Loading". By default it inherits the current text colour. `variant`
picks a theme colour instead.

```html live
<ui-spinner></ui-spinner>
```

## Examples

### Sizes

`size` is the width and height in pixels, at least `8`.

```html live
<ui-spinner size="12"></ui-spinner>
<ui-spinner size="16"></ui-spinner>
<ui-spinner size="24"></ui-spinner>
<ui-spinner size="32"></ui-spinner>
```

### Colour

`variant` sets the colour of the arc. The `default` variant uses `currentColor`, so it matches the surrounding
text.

```html live
<ui-spinner size="24"></ui-spinner>
<ui-spinner size="24" variant="primary"></ui-spinner>
<ui-spinner size="24" variant="muted"></ui-spinner>
<ui-spinner size="24" variant="destructive"></ui-spinner>
```

### In a button

Show a spinner inside a disabled button while a request runs.

```html live
<custom-element name="spinner-button-demo">
  <script type="realm">
    const request = useState({ busy: false });

    function save() {
      request.busy = true;
      const timer = setTimeout(() => {
        request.busy = false;
      }, 1500);
      signal.addEventListener("abort", () => clearTimeout(timer), { once: true });
    }
  </script>
  <ui-button _disabled="#request.busy" onclick="save()">
    <is-visible when="#request.busy"><ui-spinner size="14" label="Saving"></ui-spinner></is-visible>
    Save changes
  </ui-button>
</custom-element>
<spinner-button-demo></spinner-button-demo>
```

### With a badge

```html live
<ui-badge variant="secondary"><ui-spinner size="12" label="Syncing"></ui-spinner> Syncing</ui-badge>
<ui-badge variant="outline"><ui-spinner size="12" label="Processing"></ui-spinner> Processing</ui-badge>
```

### Custom label

Change `label` to describe the work. It becomes the spinner's accessible name.

```html live
<div class="demo-row-tight demo-muted">
  <ui-spinner label="Loading messages"></ui-spinner>
  Loading messages…
</div>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-spinner` | (default) | A rotating arc drawn with an inline `<svg>`. It has no slot and takes no content. |

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | number | `16` | Width and height in pixels. Minimum `8`. |
| `label` | string | `"Loading"` | Accessible name of the spinner. |
| `variant` | `"default"` \| `"primary"` \| `"muted"` \| `"destructive"` | `"default"` | Colour of the arc. `default` uses `currentColor`. |

### CSS parts

None. Set `color` on the element to use a colour outside the variants.

### Accessibility

The element has the role `status` and its `aria-label` comes from `label`, both through `ElementInternals`. The
SVG is hidden from assistive technology. With reduced motion preferred, the rotation slows to a third of its
normal speed instead of stopping, so the indicator still shows that something is happening.
