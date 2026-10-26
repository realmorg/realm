# @realmorg/ui

## 2.0.0-alpha.4

### Minor Changes

- 999e223: `ui-button` takes `href`, `target` and `rel`. With `href` it renders a link that looks like a button, for navigation such as "Get started" or "View pricing".

### Patch Changes

- a2e91c9: Accordion items now slide open and closed instead of jumping, using the theme's `--default-transition-duration` and `--default-transition-timing-function`. In Safari a closing item's content disappears at once while the space it took still slides shut. With `prefers-reduced-motion: reduce`, items open and close without animation.
- 7c712c3: Dropdown menus, menubar menus, popovers, hover cards, tooltips and the combobox list keep the side they opened on. Before, scrolling on a phone could flip them above and below their trigger, because iOS Safari's toolbar changes the viewport height mid-scroll. They still flip sideways when needed. Opening a menu no longer scrolls the page to its first item.
- 42e8119: The READMEs load REALM, REALM UI and Unicons from `https://realm.js.org/dist/`, which serves the latest build. Pin an exact version from npm (or jsDelivr) in production.
- Updated dependencies [0205693]
- Updated dependencies [42e8119]
- Updated dependencies [7c712c3]
  - @realmorg/realm@2.0.0-alpha.5

## 2.0.0-alpha.3

### Patch Changes

- b4fd5bc: Mobile fixes:
  
  - `ui-dialog`, `ui-sheet` and `ui-drawer` focus the dialog itself when they open, unless an element inside has `autofocus`. A tap no longer leaves a focus ring on the close button, the keyboard does not pop up uninvited, and `autofocus` on a field inside now works in Firefox and Safari too.
  - The theme sets `touch-action: manipulation` on `html`, so a double tap does not zoom the page. Pinch zoom still works.
- db1f8bd: Overlays keep a steady size on phones:
  
  - `ui-dialog`, `ui-alert-dialog` and `ui-drawer` set their height to fit their content instead of relying on the browser default, which could stretch a dialog to full screen height. Their maximum height uses `svh`, so it no longer changes while a phone's address bar shows and hides.
  - Popovers, dropdown menus, menubar menus, hover cards, tooltips, navigation menus and combobox lists also fit their content and never grow past the screen.
  - An empty `ui-dialog` or `ui-drawer` body no longer adds a gap between the header and the footer.
  - The sidebar uses `svh`, so it does not resize while the page scrolls.
  - On touch screens the theme sets `cursor: pointer` on the page, so in iOS Safari a tap outside an open popover or menu closes it.
  - Text fields (`ui-input`, `ui-textarea`, `ui-select`, `ui-command`, `ui-combobox`, `ui-input-otp`, `ui-input-group`) use 16px text on touch screens, so iOS Safari no longer zooms in when one is focused.
  - Every component sets `touch-action: manipulation` inside its shadow root, so tapping a button quickly does not zoom the page in iOS Safari.
  - Dialogs, alert dialogs, drawers and popovers pack their grid rows at the start. Mobile Safari otherwise stretches them to their maximum height, even with `height: fit-content`.
  - `ui-slider` sets `touch-action: none` on its control, so iOS never turns a drag into a page pan, and its thumb is 24px on touch screens.
  - `ui-slider` writes to its native input only when its value really changes, for example when code sets it. Rewriting the value Safari had just set during a finger drag made the thumb jump around.
- Updated dependencies [e4f8d9b]
- Updated dependencies [3b98631]
  - @realmorg/realm@2.0.0-alpha.3

## 2.0.0-alpha.2

### Patch Changes

- b21e827: - Theme colours meet WCAG AA in light and dark mode, with a new `--destructive-foreground` token and a solid focus ring.
  - Filled buttons keep 4.5:1 text contrast on hover.
  - Each component file imports the files it depends on, so a single file works on its own.
  - The carousel tracks the current slide correctly.
- Updated dependencies [b21e827]
  - @realmorg/realm@2.0.0-alpha.2

## 2.0.0-alpha.1

### Major Changes

- 8d1c45d: REALM UI: about 60 accessible components built with REALM. Components are composed from parts (`ui-card-header`, `ui-dialog-trigger`, …), styled from the design tokens in `theme.css`, and need no inline styles.

### Patch Changes

- Updated dependencies [8d1c45d]
- Updated dependencies [8d1c45d]
  - @realmorg/realm@2.0.0-alpha.1
