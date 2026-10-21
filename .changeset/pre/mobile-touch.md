---
"@realmorg/ui": patch
---

Mobile fixes:

- `ui-dialog`, `ui-sheet` and `ui-drawer` focus the dialog itself when they open, unless an element inside has `autofocus`. A tap no longer leaves a focus ring on the close button, the keyboard does not pop up uninvited, and `autofocus` on a field inside now works in Firefox and Safari too.
- The theme sets `touch-action: manipulation` on `html`, so a double tap does not zoom the page. Pinch zoom still works.
