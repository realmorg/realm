## ADDED Requirements

### Requirement: Explicit parent lookups
A `lookup()` call in a component script SHALL read the nearest parent that defines the name without being reported, because the author asked for it. Names a handler uses without the script defining them SHALL still be reported when read from a parent through its shadow markup.

#### Scenario: an explicit lookup through a shadow root reads the parent without a warning
- **WHEN** a component nested through another component's shadow markup calls `lookup("world")` and a parent defines `world`
- **THEN** it gets the parent's value and nothing is reported

#### Scenario: a handler that reads an undeclared name from a parent still warns
- **WHEN** a component's handler calls `save()`, which only its parent defines, across a shadow root
- **THEN** the call works and REALM reports that the component reads `save` from the parent
