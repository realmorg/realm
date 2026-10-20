## ADDED Requirements

### Requirement: File dependencies
An `<import-element>` at the top level of an imported file (not inside a `<custom-element>`) SHALL import that file too, resolved relative to the importing file. Each file is fetched once, and a file that imports one of its importers SHALL NOT import it again.

#### Scenario: a component file imports the files it depends on, once, even when they import it back
- **WHEN** card.html imports button.html at top level and button.html imports card.html back
- **THEN** both components are defined, each file is fetched once, and an import-element inside a definition is not treated as a dependency
