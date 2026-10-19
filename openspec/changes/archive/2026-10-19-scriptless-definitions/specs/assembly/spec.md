## ADDED Requirements

### Requirement: Nothing to assemble
A definition with no script text and no handler attributes SHALL get an empty setup without inserting any script.

#### Scenario: definitions without a script or handlers insert no script
- **WHEN** a definition has only markup and styles
- **THEN** no script element is inserted and the markup renders
