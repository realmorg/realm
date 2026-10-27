## Why
Integration examples hit three runtime problems:

- Under a nonce-based CSP, Chrome logged "Executing inline event handler violates … Content Security Policy" for every `on*` handler in component markup. Chrome reports as soon as an `on*` attribute is parsed into any document the page creates, including the inert `DOMParser` document REALM used for `<import-element>` files and for re-reading definitions. The handlers still ran through REALM, but strict "no console errors" checks failed.
- `realm.css` hid every `:not(:defined)` element forever, so tags REALM never defines (Angular's `<app-root>`, another library's elements, a typo) left whole apps invisible.
- A bound `value` was written back to the control that had just produced it. Browsers only report `tooShort`/`tooLong` for values the user typed, and the write-back cleared that flag, so `minlength`/`maxlength` were never enforced on form-associated components such as `ui-input`.

## What Changes
- Definitions are parsed from text in which handler attributes are already renamed to `realm:on…`, outside `<script>` content and attribute values. `<import-element>` files and `defineComponent` both go through it, so no `on*` attribute ever exists in a document REALM creates.
- Inline page definitions are still parsed by the browser first. The security guide states exactly which cases log a violation and recommends `<import-element>` files, the Vite plugin, or `realm:on…` in page definitions.
- `realm.css` hides undefined elements only while the page has an unread `<custom-element>`, while `<import-element>` is not yet defined, or while an `<import-element>` matches `:state(loading)`. `<import-element>` exposes that custom state while it fetches and defines its file. Inline definitions stay in the page until they are defined.
- Form properties (`value`, `checked`, …) are only written when they differ from the element's current value.

## Impact
Runtime (`sanitize.ts`, `definition.ts`, `loader.ts`, `start.ts`, `bindings.ts`), `realm.css`, docs. The runtime stays inside its 16 KB gzip budget (a few small rewrites pay for the new code).
