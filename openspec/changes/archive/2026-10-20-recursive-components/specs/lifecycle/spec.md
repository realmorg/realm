## ADDED Requirements

### Requirement: Recursive components
A component MAY render itself, directly or through other components. Nesting depth SHALL NOT be limited by the browser's call stack. A component nested more than 1000 components deep through shadow roots SHALL NOT be set up, and REALM SHALL warn that a component which renders itself needs a condition that stops it.

#### Scenario: a recursive component renders a tree deeper than the call stack allows
- **WHEN** a component renders itself inside `<is-visible>` until a prop reaches zero, starting from 300
- **THEN** all 301 levels are set up and rendered

#### Scenario: a component that renders itself without a stop warns and stops
- **WHEN** a component always renders itself
- **THEN** nesting stops after 1000 levels and REALM warns once that the component needs a condition that stops it
