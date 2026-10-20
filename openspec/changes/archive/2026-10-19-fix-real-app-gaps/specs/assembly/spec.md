## ADDED Requirements

### Requirement: Failed imports
When a component script's `import` fails, REALM SHALL warn and render the component without its script.

#### Scenario: a script whose import fails warns and renders the markup without it
- **WHEN** a component script imports a missing module
- **THEN** REALM warns and the markup renders
