## MODIFIED Requirements

### Requirement: Waiting for ancestors
A component inside an ancestor REALM component that is still being set up SHALL wait until that ancestor is defined before running its own setup, and SHALL NOT set up if it is removed while waiting. A component SHALL also wait for an ancestor component that is itself waiting, so a parent always sets up before its children.

#### Scenario: a part whose parent finishes setting up later waits for it and reads its state
- **WHEN** a part is defined before its parent finishes setting up
- **THEN** it renders the parent's state once the parent is ready, without warnings

#### Scenario: a child added while its parent waits for an ancestor sets up after the parent
- **WHEN** a parent waits for an ancestor that is still loading, the ancestor finishes, and a child is added to the parent before the parent sets up
- **THEN** the child sets up after the parent and renders the parent's state, without warnings
