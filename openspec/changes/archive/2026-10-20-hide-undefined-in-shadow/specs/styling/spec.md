## ADDED Requirements

### Requirement: No flash inside components
Inside a component's shadow root, custom elements that are not yet defined SHALL be hidden until they are defined. REALM's own `<is-visible>`, `<is-hidden>` and `<repeat-list>` are never hidden by this rule.

#### Scenario: custom elements inside a component stay hidden until they are defined
- **WHEN** a component renders a custom element whose definition has not arrived
- **THEN** that element is hidden until it is defined, while control-flow tags stay visible
