---
"@realmorg/ui": patch
---

Overlays keep a steady size on phones:

- `ui-dialog`, `ui-alert-dialog` and `ui-drawer` set their height to fit their content instead of relying on the browser default, which could stretch a dialog to full screen height. Their maximum height uses `svh`, so it no longer changes while a phone's address bar shows and hides.
- Popovers, dropdown menus, menubar menus, hover cards, tooltips, navigation menus and combobox lists also fit their content and never grow past the screen.
- An empty `ui-dialog` or `ui-drawer` body no longer adds a gap between the header and the footer.
- The sidebar uses `svh`, so it does not resize while the page scrolls.
- On touch screens the theme sets `cursor: pointer` on the page, so in iOS Safari a tap outside an open popover or menu closes it.
- Text fields (`ui-input`, `ui-textarea`, `ui-select`, `ui-command`, `ui-combobox`, `ui-input-otp`, `ui-input-group`) use 16px text on touch screens, so iOS Safari no longer zooms in when one is focused.
- Every component sets `touch-action: manipulation` inside its shadow root, so tapping a button quickly does not zoom the page in iOS Safari.
- Dialogs, alert dialogs, drawers and popovers pack their grid rows at the start. Mobile Safari otherwise stretches them to their maximum height, even with `height: fit-content`.
- `ui-slider` sets `touch-action: none` on its control, so iOS never turns a drag into a page pan, and its thumb is 24px on touch screens.
