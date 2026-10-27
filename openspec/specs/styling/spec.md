# styling Specification

## Purpose
Reactive styling: CSS variables and custom states driven by attributes and state, stylesheet diagnostics and hiding undefined components.

## Requirements

### Requirement: Reactive CSS variables
A component's host SHALL expose `--attr-NAME` for every attribute or prop used in its styles and `--state-PATH` (dots become dashes) for every state path used in its styles, updated whenever the value changes.

#### Scenario: --attr-* and --state-* variables follow props, attributes and state
- **WHEN** a style uses `var(--attr-size)` and `var(--state-count)` and the values change
- **THEN** the host's custom properties follow them

### Requirement: Reactive custom states
A component's host SHALL expose `:state(attr-NAME)` and `:state(state-PATH)` for truthy values, and comparison states `-is-`, `-gt-`, `-gte-`, `-lt-`, `-lte-` that are named in its styles, through `CustomStateSet`.

#### Scenario: :state() selectors cover truthy values and comparisons
- **WHEN** styles use `:host(:state(attr-variant-is-outline))` and numeric comparisons
- **THEN** the states turn on and off as the values change

### Requirement: Stylesheet diagnostics
A linked stylesheet that fails to load SHALL produce a warning naming the component.

#### Scenario: broken stylesheet links warn
- **WHEN** a component links a stylesheet that returns an error
- **THEN** REALM warns

### Requirement: No flash of undefined components
`realm.css` SHALL hide `<custom-element>` and `<import-element>`. It SHALL hide elements that are not yet defined only while the page has a `<custom-element>`, while `<import-element>` is not defined, or while an `<import-element>` matches `:state(loading)`, so that tags REALM never defines are shown once REALM is done.

#### Scenario: realm.css keeps undefined components hidden until they are defined
- **WHEN** a page uses a component before its definition arrives
- **THEN** it is hidden until it is defined

#### Scenario: realm.css hides undefined elements only while REALM starts or imports
- **WHEN** a page has an undefined non-REALM element and REALM starts, imports and finishes
- **THEN** the element is hidden only while REALM starts or imports

#### Scenario: realm.css leaves undefined elements visible on a page without REALM work
- **WHEN** a page has no definitions and no imports
- **THEN** undefined elements are visible

### Requirement: Scoped attribute variables
When a component's attribute or prop is absent, its `--attr-*` variable SHALL be `initial`, so `var()` fallbacks apply and ancestors' values are not inherited.

#### Scenario: --attr-* variables do not leak into nested components
- **WHEN** a component without an attribute sits inside one with it
- **THEN** the inner component uses its fallback

### Requirement: No flash inside components
Inside a component's shadow root, custom elements that are not yet defined SHALL be hidden until they are defined. REALM's own `<is-visible>`, `<is-hidden>` and `<repeat-list>` are never hidden by this rule.

#### Scenario: custom elements inside a component stay hidden until they are defined
- **WHEN** a component renders a custom element whose definition has not arrived
- **THEN** that element is hidden until it is defined, while control-flow tags stay visible
