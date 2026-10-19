## ADDED Requirements

### Requirement: Form value automation
A form-associated component's `value` or `checked` prop SHALL drive its form value, and form reset and restore SHALL return it to its attribute value or the restored state. Components without value props SHALL still reset.

#### Scenario: value and checked props drive the form value, reset and restore
- **WHEN** the prop changes, the form resets, or the browser restores state
- **THEN** the submitted value follows

#### Scenario: form-associated components without value props still reset
- **WHEN** the form resets
- **THEN** the reset hook runs

### Requirement: Control delegation
An inner element with `ref="control"` SHALL be kept in sync with the host's value and checked state, mirror its validity onto the host, re-dispatch its change event from the host, submit the outer form on Enter, and take its name from a native label around the host.

#### Scenario: a control ref syncs value, checked and numbers, mirrors validity and re-dispatches change
- **WHEN** the user edits the inner control
- **THEN** the host value, validity and change event follow

#### Scenario: Enter in a delegated text control submits the outer form
- **WHEN** Enter is pressed in the inner text control
- **THEN** the outer form submits

#### Scenario: a native label around a delegated field names its inner control
- **WHEN** a `<label>` wraps the host
- **THEN** the inner control gets the label text as its accessible name

### Requirement: focusgroup
Elements with the native `focusgroup` attribute SHALL move focus with arrow keys, Home and End across focusable items, including slotted items and hosts that delegate focus, honouring `inline`, `block`, `wrap` and right-to-left direction, and skipping disabled items.

#### Scenario: focusgroup moves focus with arrow keys, Home and End, across slotted items
- **WHEN** arrow, Home or End keys are pressed in a focusgroup
- **THEN** focus moves to the right item

#### Scenario: custom elements that delegate focus are focusgroup items
- **WHEN** a focusgroup contains hosts that delegate focus
- **THEN** arrow keys move between them
