---
"@realmorg/unicons": patch
---

`<u-icon>` sets `touch-action: manipulation` inside its shadow root, so quickly tapping an icon button does not zoom the page in iOS Safari.
