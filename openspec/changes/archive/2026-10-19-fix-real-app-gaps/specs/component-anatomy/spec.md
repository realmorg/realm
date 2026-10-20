## ADDED Requirements

### Requirement: Hidden components
The `hidden` attribute SHALL hide any component, whatever display its styles give the host.

#### Scenario: the hidden attribute hides a component whatever its display
- **WHEN** a component with `:host { display: flex }` gets `hidden`
- **THEN** it is not displayed
