## ADDED Requirements

### Requirement: Parent lookups follow the flat tree
When a name is resolved from parent components, the walk SHALL follow the flat tree: slotted content SHALL continue from its assigned slot, so components wrapping that slot in the host's shadow markup are parents of the content, before the host itself.

#### Scenario: slotted content reads from a component that wraps its slot
- **WHEN** a component is slotted into a wrapper whose slot sits inside another component that defines `world`, and the page around the wrapper also defines `world`
- **THEN** the slotted component's `lookup("world")` returns the value from the component wrapping the slot
