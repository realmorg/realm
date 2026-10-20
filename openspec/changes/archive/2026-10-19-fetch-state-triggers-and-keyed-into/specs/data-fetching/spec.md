## ADDED Requirements

### Requirement: State triggers
A `trigger` token that is a reference (`#state.path` or `@prop`) SHALL re-run the request whenever the referenced value changes, comparing nested values, and SHALL honour `debounce` and `throttle`. It SHALL NOT run for the initial value or for writes that leave the value unchanged.

#### Scenario: a reference trigger re-runs the request when the state changes
- **WHEN** the referenced state changes twice within the debounce delay
- **THEN** one request is sent with the latest value

### Requirement: Keyed into modes
`into-mode="update"` SHALL replace list items whose `into-key` (default `id`) matches an item in the response and append the rest. `into-mode="remove"` SHALL remove list items whose key matches. Unknown modes SHALL append.

#### Scenario: into modes update and remove list items by key
- **WHEN** responses are written with update, remove, a custom key and an unknown mode
- **THEN** the list is updated in place, shrinks, and appends
