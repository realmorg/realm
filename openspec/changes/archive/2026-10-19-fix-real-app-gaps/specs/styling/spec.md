## ADDED Requirements

### Requirement: Scoped attribute variables
When a component's attribute or prop is absent, its `--attr-*` variable SHALL be `initial`, so `var()` fallbacks apply and ancestors' values are not inherited.

#### Scenario: --attr-* variables do not leak into nested components
- **WHEN** a component without an attribute sits inside one with it
- **THEN** the inner component uses its fallback
