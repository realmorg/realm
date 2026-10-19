---
title: Progress
description: A horizontal bar showing how far a task has got, built on the native progress element.
group: Display
order: 209
nav: Progress
---

# Progress

`ui-progress` renders a native `<progress>` element styled as a thin rounded bar. Set `value`, and optionally
`max`, to show how much of a task is done. The bar is as wide as its container, so size it with a wrapper.

```html live
<div class="demo-narrow">
  <ui-progress value="60" aria-label="Progress"></ui-progress>
</div>
```

## Examples

### Custom maximum

`max` defaults to `100`. Use the real total so `value` can be the real count.

```html live
<div class="demo-narrow demo-stack-tight">
  <p class="demo-text">3 of 8 steps</p>
  <ui-progress value="3" max="8" aria-label="Steps completed"></ui-progress>
</div>
```

### With a label

Show the task name and percentage as text next to the bar.

```html live
<div class="demo-narrow demo-stack-tight">
  <div class="demo-row-tight">
    <p class="demo-text">Uploading report.pdf</p>
    <p class="demo-muted">45%</p>
  </div>
  <ui-progress value="45" aria-label="Uploading report.pdf"></ui-progress>
</div>
```

### Driven by state

Bind `value` with `_value`. The bar animates between values.

```html live
<custom-element name="progress-upload-demo">
  <script type="realm">
    const upload = useState({ percent: 13 });

    function advance() {
      upload.percent = upload.percent >= 100 ? 0 : Math.min(100, upload.percent + 22);
    }
  </script>
  <style type="realm">
    :host {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 4);
      width: 70%;
    }
    ui-progress {
      flex: 1;
    }
    span {
      min-width: calc(var(--spacing) * 10);
      font-size: var(--text-sm);
      font-variant-numeric: tabular-nums;
    }
  </style>
  <ui-progress _value="#upload.percent"></ui-progress>
  <span><slot name="#upload.percent"></slot>%</span>
  <ui-button size="sm" variant="outline" onclick="advance()">Advance</ui-button>
</custom-element>
<progress-upload-demo></progress-upload-demo>
```

### Custom colour

The bar uses `var(--primary)`. Set `--primary` on a wrapping element to recolour the bar and its track.

```html live
<div class="demo-narrow demo-stack">
  <div style="--primary: var(--chart-2)">
    <ui-progress value="80" aria-label="Storage used"></ui-progress>
  </div>
  <div style="--primary: var(--destructive)">
    <ui-progress value="30" aria-label="Battery"></ui-progress>
  </div>
</div>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | number | none | Current value, minimum `0`. When it is left out the bar is indeterminate. |
| `max` | number | `100` | Value that means complete, minimum `1`. |
| `aria-label` | string | | Accessible name, passed to the inner `<progress>`. Property name: `label`. |

### Parts

`ui-progress` has no child parts. Its default slot takes fallback text inside the native `<progress>`, for example
`45%`, which browsers that support `<progress>` do not render.

### CSS parts

| Part | Description |
| --- | --- |
| `bar` | The native `<progress>` element. Its height is `calc(var(--spacing) * 2)`. |

### Accessibility

The inner `<progress>` has the native `progressbar` role, with its value and maximum exposed to assistive
technology. Name it with `aria-label` on `ui-progress`, which is passed to the inner bar; a `<label for>` outside
cannot reach into the shadow root. Without `value` the bar is indeterminate and exposes no value.
