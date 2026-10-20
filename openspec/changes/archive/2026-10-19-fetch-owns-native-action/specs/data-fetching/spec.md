## ADDED Requirements

### Requirement: Fetch elements own their native action
A `<form>` or `<a>` with fetch attributes SHALL always prevent its native submission or navigation, whatever its trigger.

#### Scenario: a fetch form never submits natively, whatever its trigger
- **WHEN** a fetch form triggered by input is submitted, or a fetch link triggered by mouseenter is clicked
- **THEN** the browser neither submits nor navigates, and no request is sent
