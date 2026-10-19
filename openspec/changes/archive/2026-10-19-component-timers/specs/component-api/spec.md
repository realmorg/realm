## ADDED Requirements

### Requirement: Element-bound timers
Inside a component script, `setTimeout`, `setInterval`, `clearTimeout` and `clearInterval` SHALL behave like the native functions, and every timer still pending SHALL be cleared when the element is removed.

#### Scenario: timers started by a component stop when it is removed
- **WHEN** a component starts timeouts and intervals and is removed
- **THEN** they ran while it was connected and stop afterwards
