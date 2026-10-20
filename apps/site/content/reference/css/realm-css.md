---
title: realm.css
description: realm.css, the page stylesheet that hides definitions and undefined elements, and the base rules REALM adds to every component.
group: CSS
order: 90
nav: realm.css
---

# `realm.css`

A small page stylesheet. Load it in the `<head>`, before anything renders:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.css">
```

## Contents

```css
custom-element,
import-element {
  display: none;
}

is-visible,
is-hidden,
repeat-list {
  display: contents;
}

:not(:defined) {
  visibility: hidden;
}
```

| Rule | Why |
| --- | --- |
| `custom-element, import-element { display: none }` | Definitions and import tags never show |
| `is-visible, is-hidden, repeat-list { display: contents }` | Control-flow tags add no box, so they do not break flex or grid layouts |
| `:not(:defined) { visibility: hidden }` | Custom elements stay invisible until they are defined, so the page never shows unstyled component content. They keep their space, so layout does not jump |

## Added by REALM

Even without `realm.css`, REALM adds these rules itself.

| Where | Rules |
| --- | --- |
| The page, when [`start()`](/reference/javascript/start/) runs | `custom-element, import-element { display: none !important }` and the `display: contents` rule, as an adopted stylesheet |
| Every component's shadow root (first adopted sheet) | `is-visible, is-hidden, repeat-list { display: contents }` and `:host([hidden]) { display: none !important }` |

The `:host([hidden])` rule makes the `hidden` attribute hide a component even when its styles set `:host { display: flex }`. The `:not(:defined)` rule is only in `realm.css`, because it has to apply before any script runs.

## Related

- [Installation](/docs/installation/)
- [Styling](/docs/styling/)
