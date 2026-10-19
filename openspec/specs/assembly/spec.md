# assembly Specification

## Purpose
How REALM turns a definition into a native custom element at runtime without a compiler.

## Requirements

### Requirement: Runtime assembly
REALM SHALL place the component script and every event handler from the markup inside one generated script, so handlers can call script functions directly. REALM SHALL NOT use eval, new Function or blob: URLs.

#### Scenario: scripts with imports are assembled as modules
- **WHEN** a component script imports from a module
- **THEN** it is assembled as a module script and the imports are usable

#### Scenario: assembled scripts carry the page nonce
- **WHEN** the page has a script with a nonce
- **THEN** assembled scripts carry the same nonce

### Requirement: Script errors
A syntax error in a component script SHALL be reported once, and the component SHALL render its markup without the script. An error thrown while running setup SHALL be reported and the markup SHALL still render.

#### Scenario: a script with a syntax error warns and renders the markup without it
- **WHEN** a component script has a syntax error
- **THEN** REALM warns and the markup renders

#### Scenario: setup errors are reported and the markup still renders
- **WHEN** setup throws
- **THEN** the error is reported and the markup renders

### Requirement: Script scanning
REALM SHALL find top-level names, hoist leading import statements, and resolve relative import paths against the component file.

#### Scenario: strings, templates, comments, numbers and regex
- **WHEN** a script contains every literal kind
- **THEN** they are tokenized correctly

#### Scenario: regex is recognised after keywords and at the start
- **WHEN** a slash follows a keyword, an operator or the start
- **THEN** it is read as a regular expression

#### Scenario: unterminated template expressions and a trailing dot
- **WHEN** a template or member access is cut short
- **THEN** tokenizing does not fail

#### Scenario: unterminated comments and multi-character punctuation
- **WHEN** a comment is not closed or operators are combined
- **THEN** tokens are still produced

#### Scenario: declarations of every kind
- **WHEN** a script declares variables, functions and classes
- **THEN** all top-level names are found

#### Scenario: destructuring patterns
- **WHEN** a declaration destructures objects and arrays
- **THEN** every bound name is found

#### Scenario: initialisers spanning lines and statements without semicolons
- **WHEN** statements rely on automatic semicolon insertion
- **THEN** declarations are still separated correctly

#### Scenario: ignores nested and expression positions
- **WHEN** names are declared in blocks or expressions
- **THEN** they are not treated as top-level

#### Scenario: collects identifiers except properties and keywords
- **WHEN** handler code is scanned
- **THEN** only free identifiers are collected

#### Scenario: looks inside template literal expressions
- **WHEN** handler code uses template literals
- **THEN** identifiers inside ${} are collected

#### Scenario: hoists leading imports and resolves relative paths
- **WHEN** a script starts with import statements
- **THEN** they are hoisted and relative paths resolved

#### Scenario: leaves scripts without imports untouched
- **WHEN** a script has no imports
- **THEN** it is not changed

### Requirement: Public entry points
The package SHALL export start, defineComponent, importDefinitions, prop, useState, observe, defineStore, flush, toRaw and untrack. Importing the auto entry SHALL start REALM.

#### Scenario: public API
- **WHEN** the package is imported
- **THEN** exactly the documented names are exported

#### Scenario: start keeps an import-element that is already defined
- **WHEN** another library already defined import-element
- **THEN** start leaves it alone

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

### Requirement: Failed imports
When a component script's `import` fails, REALM SHALL warn and render the component without its script.

#### Scenario: a script whose import fails warns and renders the markup without it
- **WHEN** a component script imports a missing module
- **THEN** REALM warns and the markup renders

### Requirement: Nothing to assemble
A definition with no script text and no handler attributes SHALL get an empty setup without inserting any script.

#### Scenario: definitions without a script or handlers insert no script
- **WHEN** a definition has only markup and styles
- **THEN** no script element is inserted and the markup renders
