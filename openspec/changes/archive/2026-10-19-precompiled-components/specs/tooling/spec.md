## ADDED Requirements

### Requirement: Pre-assembling build output
`precompile(dir)` SHALL write a setup module next to every HTML file that contains definitions, replace each inline script with `<script src>` (keeping `type="realm"` for page definitions), rename handler attributes inside definitions to `realm:on…`, skip `node_modules`, and leave files without definitions untouched. Running it twice SHALL change nothing.

#### Scenario: writes a setup module per definition and points the script at it
- **WHEN** a directory with component files and a page is precompiled
- **THEN** modules are written and scripts point at them

#### Scenario: a file without definitions is left untouched
- **WHEN** a file has no definitions
- **THEN** nothing is written

### Requirement: Strict Content Security Policy
Pre-assembled components SHALL work, without console errors, on a page whose policy is `script-src 'self'`.

#### Scenario: pre-assembled components run under script-src 'self'
- **WHEN** a precompiled page is served with `script-src 'self'`
- **THEN** components render, handle events and log no errors

#### Scenario: without pre-assembly the same page is blocked by the policy
- **WHEN** the same page is served without precompiling
- **THEN** the policy blocks the assembled scripts

### Requirement: Custom elements manifest
The plugin SHALL write `custom-elements.json` (schema 2.1.0) describing each component's attributes (from `defineProps`, with type, default and attribute name), events (from `dispatch` and `new CustomEvent`), slots, CSS parts and CSS states.

#### Scenario: describes attributes, events, slots, parts and states
- **WHEN** a component with props, events, slots, parts and states is described
- **THEN** the manifest lists them

#### Scenario: components without props, or with unbalanced props, have no attributes
- **WHEN** a component has no props or unparseable props
- **THEN** it has no attributes

### Requirement: Vite plugin
`realm()` SHALL run only for builds, precompile the output directory after the bundle is written, and write the manifest under a configurable name, or not at all when `manifest` is `false`.

#### Scenario: precompiles the build output and writes the manifest
- **WHEN** a build finishes
- **THEN** the output is precompiled and the manifest is written
