## MODIFIED Requirements

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

#### Scenario: a keydown handler on the page can cancel Enter's submission
- **WHEN** a page keydown handler calls preventDefault on Enter in a delegated text control
- **THEN** the form is not submitted
