## ADDED Requirements

### Requirement: Parent lookups follow the flat tree
An explicit `lookup()` SHALL walk the flat tree: slotted content SHALL continue from its assigned slot, so components wrapping that slot in the host's shadow markup are parents of the content, before the host itself. Handler names and `#` references the component does not define SHALL skip slots and resolve from the component the content is placed in, so a component's shadow markup never captures names in its users' content.

#### Scenario: slotted content reads from a component that wraps its slot
- **WHEN** a component is slotted into a wrapper whose slot sits inside another component that defines `world`, and the page around the wrapper also defines `world`
- **THEN** the slotted component's `lookup("world")` returns the value from the component wrapping the slot

#### Scenario: handlers in slotted content resolve from the component they are placed in
- **WHEN** a part's handler calls `close()`, the part is placed in a component that defines `close`, and that component's slot sits inside another component that also defines `close`
- **THEN** the call reaches the component the part is placed in
