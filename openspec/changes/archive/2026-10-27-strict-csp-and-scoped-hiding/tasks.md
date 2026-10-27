## 1. Handler attributes under a strict CSP

- [x] 1.1 `parseSource` renames `on*` attributes to `realm:on*` in the source text before parsing
- [x] 1.2 `<import-element>` and `defineComponent` parse through it; the DOM renaming loop is gone
- [x] 1.3 Tests: "imported definitions with handlers log no violation under a strict nonce policy", "page definitions with realm:on handlers log no violation under a strict nonce policy", "handler attributes are renamed before parsing, outside scripts and attribute values"
- [x] 1.4 Security guide lists what does and does not log a violation

## 2. Scoped hiding in realm.css

- [x] 2.1 `<import-element>` matches `:state(loading)` while it imports
- [x] 2.2 `realm.css` hides undefined elements only while REALM starts or imports
- [x] 2.3 Inline definitions are removed once defined
- [x] 2.4 Tests: "realm.css hides undefined elements only while REALM starts or imports", "realm.css leaves undefined elements visible on a page without REALM work", "an importer is in the loading state until its definitions are defined"

## 3. Typed values keep their length limits

- [x] 3.1 Form properties are written only when they change
- [x] 3.2 Test: "a typed value is not written back, so length limits still apply"
