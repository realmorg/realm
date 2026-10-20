## ADDED Requirements

### Requirement: Indeterminate progress
Binding `value` on `<progress>` or `<meter>` to an absent value SHALL remove the attribute.

#### Scenario: an absent value leaves progress and meter indeterminate
- **WHEN** the bound value is null
- **THEN** the element has no value attribute until a value arrives
