## ADDED Requirements

### Requirement: Compound parts
A definition with a `slot` attribute SHALL give each of its elements that slot unless the element sets its own. A part's handlers and values SHALL resolve from the parent component it is placed in when the part does not define them.

#### Scenario: a definition's slot attribute places its elements in that slot of their parent
- **WHEN** a part declared with `slot="title"` is placed in a parent with a title slot
- **THEN** it is assigned to that slot, unless it sets its own

#### Scenario: compound parts call their parent's functions and show its state without a script
- **WHEN** a part without a script calls a parent function and shows parent state
- **THEN** the call reaches the parent and the value updates
