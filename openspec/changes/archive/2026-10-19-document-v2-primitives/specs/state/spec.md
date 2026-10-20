## ADDED Requirements

### Requirement: Observers and refs
Observers created at the top of a script SHALL first run after the markup exists, so they can read refs.

#### Scenario: observers written at the top of a script see refs once the markup exists
- **WHEN** an observer reads `refs.x` at the top of the script
- **THEN** it sees the element
