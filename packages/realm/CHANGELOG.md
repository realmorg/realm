# @realmorg/realm

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
