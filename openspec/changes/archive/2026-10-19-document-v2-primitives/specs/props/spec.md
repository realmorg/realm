## ADDED Requirements

### Requirement: Undeclared props
Writing to a prop that `defineProps` did not declare SHALL warn.

#### Scenario: writing an undeclared prop warns
- **WHEN** the script assigns to an undeclared prop
- **THEN** REALM warns
