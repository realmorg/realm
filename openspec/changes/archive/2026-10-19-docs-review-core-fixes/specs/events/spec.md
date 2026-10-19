## ADDED Requirements

### Requirement: Page handlers for dispatched events
Custom event names sent with `dispatch("name")` SHALL get page handler attributes and properties, like names created with `new CustomEvent("name")`.

#### Scenario: page handler attributes work for events sent with dispatch
- **WHEN** a page element has `onping="…"` and the component calls `dispatch("ping")`
- **THEN** the attribute's code runs
