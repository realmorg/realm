# @realmorg/realm

## 2.0.0-alpha.6

### Minor Changes

- 03aa3a7: - Form-associated components have `validity`, `validationMessage`, `willValidate`, `checkValidity()` and `reportValidity()` like native fields, read from their `ElementInternals`. A component that defines its own with `defineMethods` keeps them.
  - A value a page sets on an element before its definition loads, such as `tree.loader = fetchChildren`, now reaches the `defineMethods` setter of the same name, as it already did for props.
  - The runtime budget is now under 17 KB gzip.

### Patch Changes

- 473cd13: - A bound `value` on a component, such as `<ui-input _value="#state.query" oninput="search(this.value)" debounce="200ms">`, no longer puts the old state value back while the user types.
  - A form reset returns only form state (`value`, `checked`, `selected`, `indeterminate`) to its attribute. Data a page set as a property, such as an options array or a loader, is kept.
- 511b8a2: Fixes found while building integration examples:
  
  - Components loaded with `<import-element>` no longer make Chrome log "Executing inline event handler violates … Content Security Policy" under a nonce policy. Chrome reports any `on*` attribute the moment it is parsed, even into an inert `DOMParser` document, so REALM now renames handlers to `realm:on…` in the file's text before parsing it. Definitions written in the page are parsed by the browser before REALM runs, so they still log one report per handler in Chrome and Firefox; write those handlers as `realm:onclick="…"`, load the definition from a file, or pre-assemble with `@realmorg/vite-plugin`. The security guide lists every case.
  - `realm.css` no longer hides elements REALM never defines. Undefined elements are hidden only while the page still has an unread `<custom-element>`, before REALM starts, or while an `<import-element>` is loading, so an Angular `<app-root>` or another library's tags appear once REALM is done. `<import-element>` matches `:state(loading)` while it imports, and inline definitions stay in the page until they are defined.
  - A bound `value` (or `checked`, `selected`, `indeterminate`) is no longer written back when it already matches, so a value the user typed keeps the browser's `tooShort`/`tooLong` checks and `minlength`/`maxlength` work on form-associated components.

## 2.0.0-alpha.5

### Patch Changes

- 0205693: Frozen objects and arrays in state or props are read as they are instead of throwing. A `repeat` loop variable named `event` no longer breaks the handlers in its loop; inside them, `event` is the item.
- 42e8119: The READMEs load REALM, REALM UI and Unicons from `https://realm.js.org/dist/`, which serves the latest build. Pin an exact version from npm (or jsDelivr) in production.
- 7c712c3: A parent component now always sets up before its children. On a slow connection, a child could set up while its parent was still waiting for an ancestor to load, and then miss the parent's state: a `ui-tabs-list` lost its orientation and arrow-key navigation, for example.

## 2.0.0-alpha.4

### Patch Changes

- 41bc927: `lookup()` follows the flat tree. Slotted content now reads from components that wrap its slot inside the host's shadow markup, before the host itself. Handler names and `#` references still resolve from the component the content is placed in, so a component's shadow markup never captures them.

## 2.0.0-alpha.3

### Patch Changes

- e4f8d9b: Recursive components (issue #57): a component can render itself as deep as its data goes. Nesting past 32 levels in one pass finishes in a microtask instead of overflowing the call stack, which used to stop trees at about 45 levels. A component nested more than 1000 deep is not set up, and REALM warns that its recursion needs a condition that stops it.
- 3b98631: An explicit `lookup()` call in a component script no longer logs `<child> reads "name" from <parent>.`. Handler names and `#` references that a component reads from a parent without declaring them still log it.

## 2.0.0-alpha.2

### Patch Changes

- b21e827: Fixes from auditing the examples and the website:
  
  - An imported file's top-level `<import-element>` tags are imported too, relative to that file, once, with cycles ignored. A file's own components are defined only after the files it depends on.
  - `<import-element>` inside a `<custom-element>` definition stays inert, and a file can be imported again after it was cached.
  - A component waits for an ancestor REALM component that is still setting up, and `repeat` resolves its container at update time.
  - Shadow roots hide custom elements that are not defined yet, and `hidden` hides elements inside components whatever their `display`.
  - Disabled delegated form controls are valid.
  - Persisted stores save data fields only and never run getters.
  - `untrack` is available as a script helper.

## 2.0.0-alpha.1

### Major Changes

- 8d1c45d: REALM v2: components are single `<custom-element>` tags holding a `<script>`, `<style>` and markup, assembled at runtime without a compiler. Adds `defineProps` with a typed prop builder, `useState`, `observe`, native value slots, `_` attribute bindings, native `on<event>` handlers for custom events, attribute-driven fetching, a rewritten `<import-element>`, and `defineStore`. See the migration guide for v1 changes.

### Minor Changes

- 8d1c45d: Pre-assembled components for strict Content Security Policies: a definition's `<script src>` loads a setup module, `@realmorg/realm/compiler` produces one, and `@realmorg/vite-plugin` precompiles build output and writes `custom-elements.json`.

## 0.0.19

### Patch Changes

- 818371c: Updated fix `set-attr` boolean parsed issue

## 0.0.18

### Patch Changes

- c9fc5d7: Update improvements:

  - Fix Duplicate import element
  - Remove these states as css vars: array, object, and html

## 0.0.17

### Patch Changes

- 406002c: Update fix `event.target.value` loss

## 0.0.16

### Patch Changes

- f6a6143: Update event loses after runtime tick

## 0.0.15

### Patch Changes

- b2d62c2: Update fix http response handling

## 0.0.14

### Patch Changes

- 317982d: Update fix array toggle impl and event issue

## 0.0.13

### Patch Changes

- e5cd928: Update fix missing `send-event` value

## 0.0.12

### Patch Changes

- 7baab6c: Update fix array type event

## 0.0.11

### Patch Changes

- b4a532f: Reverts wait script flow implementation

## 0.0.10

### Patch Changes

- d05ad3a: Update fix event target persist

## 0.0.9

### Patch Changes

- 2f4668b: Update correct css prop value for `is-visible` element

## 0.0.8

### Patch Changes

- 616dfbd: - Update fix error css selector regex on Safari
  - Update fix early return in attr bind reducer

## 0.0.7

### Patch Changes

- 594960f: Update refactor `styleMap` compat in firefox

## 0.0.6

### Patch Changes

- d0ea778: Add non custom `listen-event` filter name

## 0.0.5

### Patch Changes

- 43bd3ee: Update css, reverts to the most makes sense transition
- 43bd3ee: Update fix mounted event when using script flow

## 0.0.4

### Patch Changes

- 0e6f78c: Update fix css selector regex support alphanumeric and - (dash), . (dot), and \_ (underscore)

## 0.0.3

### Patch Changes

- 3fd22b9: Update global states flow

## 0.0.2

### Patch Changes

- 4d33787: Update fix global states storage getter issue

## 0.0.1

### Patch Changes

- e532cfe: Initial release
