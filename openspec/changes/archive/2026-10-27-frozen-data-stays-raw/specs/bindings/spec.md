## MODIFIED Requirements

### Requirement: Event handlers in markup
Native on<event> attributes in component markup SHALL run in the component's script scope with event and this. return false SHALL cancel. debounce and throttle attributes SHALL time handlers, and timers SHALL be cleared on removal. A repeat loop variable named event SHALL be the item inside the handlers of its loop.

#### Scenario: debounce and throttle on handlers
- **WHEN** events fire rapidly
- **THEN** handlers run once per window

#### Scenario: debounced handlers are cancelled when the element is removed
- **WHEN** an element is removed mid-debounce
- **THEN** the handler never runs

#### Scenario: invalid durations warn and fire immediately
- **WHEN** a duration is invalid
- **THEN** REALM warns and runs without delay

#### Scenario: a loop variable named event is the item in its handlers
- **WHEN** a repeat uses as="event" and an item's handler passes event to a function
- **THEN** the function receives the item
