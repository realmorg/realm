---
"@realmorg/ui": minor
---

Fixes and additions found while building blocks on REALM UI:

- `ui-toggle` and `ui-toggle-group` fire `change` like a native control: it bubbles but no longer leaves the shadow root that contains them. A toggle group fires one `change` per click, with its new `value`, instead of passing on the toggle's own `change` first.
- `ui-input-otp` updates its form value and validity before `change` and `complete` fire, so a `complete` handler can call `form.requestSubmit()`. With `separator`, each group of boxes has its own rounded outer corners.
- Form controls (`ui-input`, `ui-textarea`, `ui-input-group`, `ui-input-otp`, `ui-select`, `ui-combobox`, `ui-checkbox`, `ui-switch`, `ui-radio-group`, `ui-slider`, `ui-calendar`, `ui-toggle-group` and `ui-button`) have a `name` property that mirrors the `name` attribute.
- `ui-input`, `ui-textarea` and `ui-input-group` take `title`, which the browser uses in its pattern mismatch message, and have `setCustomValidity(message)`, which makes the field and its form invalid like the native method.
- `ui-input-group` forwards the same input attributes as `ui-input`: `autocomplete`, `inputmode`, `pattern`, `min`, `max`, `step`, `minlength`, `maxlength`, `readonly` and `invalid`.
- `ui-tabs-list stretch` fills its container and shares the width equally between the triggers.
- `ui-alert-dialog-action` takes `disabled`, for a "type the name to confirm" dialog.
- `ui-button` activates on `click()` from script like a native button, so a submit button submits its form. A disabled `ui-button` no longer passes clicks to handlers on it.
- `ui-chart` draws in CSS pixels at its container's width, so labels and lines keep their size on any screen, and `height` is now in pixels. Value ticks fall on rounded steps such as 0, 10K, 20K. `variant="sparkline"` draws only the series, edge to edge, for stat cards.
- `ui-code-block` moves the code below its language label and copy button when it is narrower than `40rem`, so they no longer cover the first line.
- `ui-avatar-group` overlaps avatars by an amount that suits their size and keeps the initials of covered avatars visible. `ui-avatar-group-count` takes `size` and widens to fit counts such as "+24k". `ui-avatar-fallback` uses its own muted colours, so initials stay readable on a coloured panel.
