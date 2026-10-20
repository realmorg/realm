## ADDED Requirements

### Requirement: Persisting data fields
A persisted store SHALL save only its data fields and SHALL NOT run its getters to save them.

#### Scenario: persisted stores save their data fields and never run getters
- **WHEN** a persisted store with a getter changes
- **THEN** storage holds only the data fields and the getter has not run
