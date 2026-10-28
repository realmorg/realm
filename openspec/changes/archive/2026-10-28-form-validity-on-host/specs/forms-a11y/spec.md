## MODIFIED Requirements

### Requirement: Form association and roles
form-associated SHALL make a component a form field through ElementInternals with reset, disabled and restore hooks. role SHALL set a default role. delegates-focus SHALL delegate focus. The host SHALL expose validity, validationMessage, willValidate, checkValidity() and reportValidity() from its ElementInternals unless the component defines them.

#### Scenario: role, delegates-focus and form association
- **WHEN** a form-associated component is used in a form
- **THEN** its value submits and hooks run

#### Scenario: a form-associated component exposes validity like a native field
- **WHEN** a page calls checkValidity() or reads validity on a form-associated component
- **THEN** it gets the component's ElementInternals validity
