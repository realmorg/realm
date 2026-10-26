---
"@realmorg/ui": patch
---

Accordion items now slide open and closed instead of jumping, using the theme's `--default-transition-duration` and `--default-transition-timing-function`. In Safari a closing item's content disappears at once while the space it took still slides shut. With `prefers-reduced-motion: reduce`, items open and close without animation.
