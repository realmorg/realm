---
"@realmorg/realm": patch
---

Fixes found while building integration examples:

- Components loaded with `<import-element>` no longer make Chrome log "Executing inline event handler violates … Content Security Policy" under a nonce policy. Chrome reports any `on*` attribute the moment it is parsed, even into an inert `DOMParser` document, so REALM now renames handlers to `realm:on…` in the file's text before parsing it. Definitions written in the page are parsed by the browser before REALM runs, so they still log one report per handler in Chrome and Firefox; write those handlers as `realm:onclick="…"`, load the definition from a file, or pre-assemble with `@realmorg/vite-plugin`. The security guide lists every case.
- `realm.css` no longer hides elements REALM never defines. Undefined elements are hidden only while the page still has an unread `<custom-element>`, before REALM starts, or while an `<import-element>` is loading, so an Angular `<app-root>` or another library's tags appear once REALM is done. `<import-element>` matches `:state(loading)` while it imports, and inline definitions stay in the page until they are defined.
- A bound `value` (or `checked`, `selected`, `indeterminate`) is no longer written back when it already matches, so a value the user typed keeps the browser's `tooShort`/`tooLong` checks and `minlength`/`maxlength` work on form-associated components.
