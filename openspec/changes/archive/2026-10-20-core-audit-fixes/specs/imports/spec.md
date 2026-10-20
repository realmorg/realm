## ADDED Requirements

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
