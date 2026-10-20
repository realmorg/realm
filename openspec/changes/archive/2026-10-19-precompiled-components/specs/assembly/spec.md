## ADDED Requirements

### Requirement: Pre-assembled setup modules
A definition whose `<script>` has a `src` SHALL import that module, use its default export as the setup function and its `names` export as the script's top-level names, and SHALL NOT insert any script. If the module fails to load, REALM SHALL warn and render the markup without a script. Handler attributes MAY be written as `realm:on<event>`, which is equivalent to `on<event>` but never compiled by the browser.

#### Scenario: a definition script with src loads a pre-assembled setup module
- **WHEN** a definition's script points at a module produced by the compiler
- **THEN** the component works without any inserted script

#### Scenario: a script src that fails to load warns and renders the markup
- **WHEN** the module cannot be loaded
- **THEN** REALM warns and the markup still renders

### Requirement: Compiler
`@realmorg/realm/compiler` SHALL turn a `<custom-element>` into an ES module that exports the setup function as default and the top-level names as `names`, keeping `import` statements and their relative paths.

#### Scenario: the compiler turns a definition into a setup module with its names and handlers
- **WHEN** a definition with imports, state and handlers is compiled
- **THEN** the module contains the imports, the names and every handler
