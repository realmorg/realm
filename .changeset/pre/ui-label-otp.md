---
"@realmorg/ui": patch
---

- `ui-label for` no longer adds `aria-label` to its target's host. It names the inner control (or a native control) through `aria-labelledby`, so Phoenix LiveView and React hydration no longer strip or warn about it, and the name follows the label text.
- `ui-input` (and every control with a bound `value`) enforces `minlength` and `maxlength` on typed values; this needs `@realmorg/realm` with the matching fix.
- `ui-input-otp` spreads a code typed or filled into one box (SMS autofill) across the boxes, like a paste. Its `inputmode` follows `pattern` (`numeric` only for `[0-9]` or `\d`) and can be set with an `inputmode` attribute.
