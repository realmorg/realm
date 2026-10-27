## MODIFIED Requirements

### Requirement: Form value automation
A form-associated component's `value` or `checked` prop SHALL drive its form value, and form reset and restore SHALL return it to its attribute value or the restored state. Other props SHALL keep their values on reset. Components without value props SHALL still reset.

#### Scenario: value and checked props drive the form value, reset and restore
- **WHEN** the prop changes, the form resets, or the browser restores state
- **THEN** the submitted value follows

#### Scenario: form-associated components without value props still reset
- **WHEN** the form resets
- **THEN** the reset hook runs

#### Scenario: a form reset keeps props that are not the form value
- **WHEN** a page sets data props as properties and the form resets
- **THEN** value returns to its attribute and the data props are kept
