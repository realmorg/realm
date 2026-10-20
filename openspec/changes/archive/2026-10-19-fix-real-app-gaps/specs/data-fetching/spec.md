## ADDED Requirements

### Requirement: Timing on fetch elements
On an element with fetch attributes, `debounce` and `throttle` SHALL apply only to the request. Handlers and the prevention of form submission or link navigation SHALL run immediately.

#### Scenario: debounce on a fetch element times the request, not its handlers
- **WHEN** a debounced search form is typed in and submitted
- **THEN** submission is prevented at once and one request is sent after the delay

### Requirement: Current form values
A request SHALL apply pending reactive updates before reading form values.

#### Scenario: requests read form values changed in the same task
- **WHEN** a form-associated value changes and the form submits in the same task
- **THEN** the request carries the new value
