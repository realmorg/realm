# imports Specification

## Purpose
Loading component files with <import-element>: shared requests, bundles, errors, throttling and lazy loading.

## Requirements

### Requirement: Import element
Each URL SHALL be fetched once and shared by every importer, every definition in the file SHALL be registered, failures SHALL fire error and warn, detached importers SHALL stay quiet, at most six requests per origin SHALL run at once, and loading=lazy SHALL wait for a listed tag.

#### Scenario: racing imports of the same file fetch once and define every component in it
- **WHEN** two importers load the same bundle
- **THEN** one request defines every component

#### Scenario: failed imports fire error and warn, removed importers stay quiet
- **WHEN** imports fail
- **THEN** error fires on connected importers only

#### Scenario: an importer removed before its file arrives does not fire load
- **WHEN** an importer is removed mid-request
- **THEN** load does not fire

#### Scenario: missing from attribute warns; reconnecting does not import twice
- **WHEN** from is missing or the importer moves
- **THEN** REALM warns once and imports once

#### Scenario: lazy imports wait until a listed tag is used
- **WHEN** loading=lazy is used
- **THEN** the request waits for the tag

#### Scenario: document tags are noticed as they are added
- **WHEN** tags appear in the page
- **THEN** lazy imports start

#### Scenario: at most six requests per origin run at once
- **WHEN** many files load from one origin
- **THEN** six run at a time

### Requirement: Inert imports in definitions
An `<import-element>` inside a `<custom-element>` definition SHALL NOT import; the copies rendered by components do.

#### Scenario: an import-element inside a component definition does not import until the component renders it
- **WHEN** a page has an inline definition containing an import-element
- **THEN** nothing is fetched until an import-element outside a definition asks for the file

### Requirement: Repeated imports
Importing a file that was already imported SHALL define nothing again and warn about nothing.

#### Scenario: importing an already loaded file again defines nothing twice and warns about nothing
- **WHEN** the same file is imported twice
- **THEN** its components are defined once and no warning is logged

### Requirement: File dependencies
An `<import-element>` at the top level of an imported file (not inside a `<custom-element>`) SHALL import that file too, resolved relative to the importing file. Each file is fetched once, and a file that imports one of its importers SHALL NOT import it again. A file's own components SHALL be defined only after the files it depends on are defined, so a component never runs while the components it uses are still missing.

#### Scenario: a component file imports the files it depends on, once, even when they import it back
- **WHEN** card.html imports button.html at top level and button.html imports card.html back
- **THEN** both components are defined, each file is fetched once, and an import-element inside a definition is not treated as a dependency

#### Scenario: a component file is defined only after the files it depends on
- **WHEN** shell.html depends on a dialog.html that arrives late
- **THEN** the shell component is not defined until the dialog component is
