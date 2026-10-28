## MODIFIED Requirements

### Requirement: untrack helper
Component scripts SHALL have `untrack`, which runs a function without subscribing the current observer to what it reads, and `toRaw`, which returns the plain object behind a reactive proxy.

#### Scenario: untrack lets an effect call other components without subscribing to them
- **WHEN** an observer reads other state inside untrack and that state changes
- **THEN** the observer does not run again

#### Scenario: toRaw gives component scripts the plain data behind a prop or state
- **WHEN** a component script calls toRaw on a prop or state value
- **THEN** it gets the original object, not the proxy
