# data-fetching Specification

## Purpose
Requests driven by attributes on the triggering element.

## Requirements

### Requirement: Fetch attributes
fetch, method, trigger, debounce, throttle, poll, params, headers, into, into-mode, render, render-mode, render-select, busy and timeout SHALL work on any element, and native forms and links SHALL use action, method, formaction and href.

#### Scenario: loads JSON into state on load and tracks busy state
- **WHEN** an element loads on start
- **THEN** data lands in state and busy state is shown

#### Scenario: forms post url-encoded or multipart data and honour the submitter
- **WHEN** forms submit
- **THEN** the native encoding and submitter overrides are used

#### Scenario: into modes append and prepend single values onto any existing value
- **WHEN** into-mode is append or prepend
- **THEN** values are added to lists

#### Scenario: headers, default triggers, visible and poll triggers
- **WHEN** requests use headers and trigger kinds
- **THEN** each trigger fires as documented

#### Scenario: links with render update the address bar; warnings for bad targets
- **WHEN** a link renders into a ref
- **THEN** the address bar updates; bad targets warn

### Requirement: Rendering responses
render SHALL insert sanitised HTML in replace, outer, append, prepend, before, after, text, merge or remove mode. merge SHALL keep existing nodes and the focused element.

#### Scenario: render inserts sanitised HTML with every mode
- **WHEN** every render mode is used
- **THEN** HTML is sanitised and inserted

#### Scenario: merge keeps existing nodes and the focused input
- **WHEN** merge updates focused content
- **THEN** nodes and focus are kept

#### Scenario: merge appends new nodes and leaves identical ones alone
- **WHEN** merge adds content
- **THEN** identical nodes stay

### Requirement: Safety
A new request from an element SHALL cancel its previous one. Identical GETs SHALL be shared. loadstart SHALL be cancelable. Errors, timeouts and aborts SHALL fire native-named events and never render.

#### Scenario: search as you type: params, debounce, cancelled stale requests
- **WHEN** requests overlap
- **THEN** older responses never overwrite newer ones

#### Scenario: identical GET requests are shared
- **WHEN** two elements request the same URL
- **THEN** one request is sent

#### Scenario: error, network failure, timeout and cancelled loadstart
- **WHEN** requests fail or are cancelled
- **THEN** the right event fires and nothing renders

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

### Requirement: Fetch elements own their native action
A `<form>` or `<a>` with fetch attributes SHALL always prevent its native submission or navigation, whatever its trigger.

#### Scenario: a fetch form never submits natively, whatever its trigger
- **WHEN** a fetch form triggered by input is submitted, or a fetch link triggered by mouseenter is clicked
- **THEN** the browser neither submits nor navigates, and no request is sent

### Requirement: State triggers
A `trigger` token that is a reference (`#state.path` or `@prop`) SHALL re-run the request whenever the referenced value changes, comparing nested values, and SHALL honour `debounce` and `throttle`. It SHALL NOT run for the initial value or for writes that leave the value unchanged.

#### Scenario: a reference trigger re-runs the request when the state changes
- **WHEN** the referenced state changes twice within the debounce delay
- **THEN** one request is sent with the latest value

### Requirement: Keyed into modes
`into-mode="update"` SHALL replace list items whose `into-key` (default `id`) matches an item in the response and append the rest. `into-mode="remove"` SHALL remove list items whose key matches. Unknown modes SHALL append.

#### Scenario: into modes update and remove list items by key
- **WHEN** responses are written with update, remove, a custom key and an unknown mode
- **THEN** the list is updated in place, shrinks, and appends
