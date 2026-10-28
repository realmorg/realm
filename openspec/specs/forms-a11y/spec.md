# forms-a11y Specification

## Purpose
Form-associated components and accessibility defaults.

## Requirements

### Requirement: Form association and roles
form-associated SHALL make a component a form field through ElementInternals with reset, disabled and restore hooks. role SHALL set a default role. delegates-focus SHALL delegate focus. The host SHALL expose validity, validationMessage, willValidate, checkValidity() and reportValidity() from its ElementInternals unless the component defines them.

#### Scenario: role, delegates-focus and form association
- **WHEN** a form-associated component is used in a form
- **THEN** its value submits and hooks run

#### Scenario: a form-associated component exposes validity like a native field
- **WHEN** a page calls checkValidity() or reads validity on a form-associated component
- **THEN** it gets the component's ElementInternals validity

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

### Requirement: Initial disabled state
A form-associated component SHALL read whether it is disabled (including by a disabled fieldset) when it connects.

#### Scenario: form-associated components created inside a disabled fieldset start disabled
- **WHEN** a component is created inside a disabled fieldset
- **THEN** `@disabled` is true from the first render

### Requirement: focusgroup in the flat tree
focusgroup SHALL find focusable items inside shadow roots that do not delegate focus, and SHALL skip items that are not rendered.

#### Scenario: focusgroup reaches into shadow roots and skips items that are not rendered
- **WHEN** a menubar holds links inside shadow roots and a closed menu
- **THEN** arrow keys move between the links and the menu trigger, skipping hidden items

### Requirement: Disabled delegated controls
A delegated control that is barred from constraint validation (for example because it is disabled) SHALL report the host as valid.

#### Scenario: a disabled delegated control is valid, whatever its constraints
- **WHEN** a disabled delegated number input has contradictory constraints
- **THEN** no error is thrown and the host is not invalid
