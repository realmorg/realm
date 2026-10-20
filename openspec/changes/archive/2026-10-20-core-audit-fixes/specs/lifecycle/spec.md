## ADDED Requirements

### Requirement: Waiting for ancestors
A component inside an ancestor REALM component that is still being set up SHALL wait until that ancestor is defined before running its own setup, and SHALL NOT set up if it is removed while waiting.

#### Scenario: a part whose parent finishes setting up later waits for it and reads its state
- **WHEN** a part is defined before its parent finishes setting up
- **THEN** it renders the parent's state once the parent is ready, without warnings
