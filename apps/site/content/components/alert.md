---
title: Alert
description: A callout box with an optional icon, a title and a description, for messages that need the reader's attention.
group: Display
order: 201
nav: Alert
---

# Alert

`ui-alert` shows a short message in a bordered box, with an optional icon on the left and `ui-alert-title` and
`ui-alert-description` stacked beside it. The element has the ARIA role `alert`, so screen readers
announce it when it is added to the page. It fills the width of its container.

```html live
<div class="demo-medium">
  <ui-alert>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
    <ui-alert-title>Changes saved</ui-alert-title>
    <ui-alert-description>Your profile was updated. It can take a minute to show everywhere.</ui-alert-description>
  </ui-alert>
</div>
```

## Examples

### Destructive

Use `variant="destructive"` for errors. The title and icon switch to the destructive colour and the description
takes a tint of it.

```html live
<div class="demo-medium">
  <ui-alert variant="destructive">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
    <ui-alert-title>Payment failed</ui-alert-title>
    <ui-alert-description>Your card was declined. Check the card details and try again.</ui-alert-description>
  </ui-alert>
</div>
```

### Without an icon

The icon is optional. The title and description keep their column.

```html live
<div class="demo-medium">
  <ui-alert>
    <ui-alert-title>Scheduled maintenance</ui-alert-title>
    <ui-alert-description>The dashboard will be read-only on Sunday from 02:00 to 03:00 UTC.</ui-alert-description>
  </ui-alert>
</div>
```

### Title only

```html live
<div class="demo-medium">
  <ui-alert>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
    <ui-alert-title>A new version is available. Reload to update.</ui-alert-title>
  </ui-alert>
</div>
```

### Rich description

`ui-alert-description` is a grid, so paragraphs and lists inside it stack with a small gap.

```html live
<div class="demo-medium">
  <ui-alert variant="destructive">
    <ui-alert-title>Unable to process your payment</ui-alert-title>
    <ui-alert-description>
      <p class="demo-text">Please verify your billing information:</p>
      <ul>
        <li>Check the card number</li>
        <li>Make sure the billing address matches</li>
      </ul>
    </ui-alert-description>
  </ui-alert>
</div>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-alert` | | The bordered box. A two-column grid: a leading `<svg>` icon in the first column, everything else in the second. |
| `<svg>` | (default) | Optional icon as a direct child of `ui-alert`. Sized to `calc(var(--spacing) * 4)` and spans the title and description rows. |
| `ui-alert-title` | (default) | The heading line, in medium weight. |
| `ui-alert-description` | (default) | Muted text under the title (tinted destructive in the destructive variant). A grid, so `<p>` and `<ul>` stack. |

Each part has a single default slot that takes any content.

### ui-alert attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"default"` \| `"destructive"` | `"default"` | Colour scheme of the alert. |

### Accessibility

The element has the implicit role `alert` (set through `ElementInternals`), which makes it a live region.
Screen readers read its content when it is inserted. This is usually harmless for content present on page load, but
avoid putting many alerts on one page.
