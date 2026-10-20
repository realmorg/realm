## ADDED Requirements

### Requirement: Host attributes
`attrs` SHALL read any host attribute reactively and writing to it SHALL set or remove the attribute.

#### Scenario: attrs reads and writes any host attribute reactively
- **WHEN** the script reads and writes `attrs.name`
- **THEN** reads track the attribute and writes update it

### Requirement: Dispatching events
`dispatch(type, detail, options)` SHALL send a bubbling, composed, cancelable `CustomEvent` from the host and return whether it was not cancelled.

#### Scenario: dispatch sends a bubbling, composed, cancelable event and reports cancellation
- **WHEN** a listener calls preventDefault
- **THEN** dispatch returns false

### Requirement: Listening
`listen(type, handler, target)` SHALL listen on the host, or on the given target, until the element is removed.

#### Scenario: listens on the host or another target until the element is removed
- **WHEN** the element is removed
- **THEN** the listener stops

### Requirement: Element methods
`defineMethods(object)` SHALL expose the object's methods and getters on the host element and remove them on teardown.

#### Scenario: exposes methods and getters on the element and removes them on teardown
- **WHEN** a component defines methods and is removed
- **THEN** they are callable while connected and gone afterwards

### Requirement: Children
`useChildren(selector, attributes)` SHALL return a reactive list of light-DOM children matching the selector, refreshed when children are added, removed, upgraded, or when a watched attribute changes.

#### Scenario: useChildren tracks matching children and watched attributes
- **WHEN** matching children or watched attributes change
- **THEN** the list updates

#### Scenario: useChildren refreshes when a child component mounts, so parents read child props
- **WHEN** a child component upgrades after the parent
- **THEN** the parent re-reads it and sees its props
