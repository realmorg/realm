## ADDED Requirements

### Requirement: untrack helper
Component scripts SHALL have `untrack`, which runs a function without subscribing the current observer to what it reads.

#### Scenario: untrack lets an effect call other components without subscribing to them
- **WHEN** an observer reads other state inside untrack and that state changes
- **THEN** the observer does not run again
