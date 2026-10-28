# component-api Specification

## Purpose
Script helpers for host attributes, events, element methods and children.

## Requirements

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
`defineMethods(object)` SHALL expose the object's methods and getters on the host element and remove them on teardown. A value the page set on the host before upgrade SHALL be passed to the setter of the same name.

#### Scenario: exposes methods and getters on the element and removes them on teardown
- **WHEN** a component defines methods and is removed
- **THEN** they are callable while connected and gone afterwards

#### Scenario: a value set before upgrade reaches a defineMethods setter
- **WHEN** a page sets a property before the component is defined and the component defines a setter with that name
- **THEN** the setter receives the value

### Requirement: Children
`useChildren(selector, attributes)` SHALL return a reactive list of light-DOM children matching the selector, refreshed when children are added, removed, upgraded, or when a watched attribute changes.

#### Scenario: useChildren tracks matching children and watched attributes
- **WHEN** matching children or watched attributes change
- **THEN** the list updates

#### Scenario: useChildren refreshes when a child component mounts, so parents read child props
- **WHEN** a child component upgrades after the parent
- **THEN** the parent re-reads it and sees its props

### Requirement: Element-bound timers
Inside a component script, `setTimeout`, `setInterval`, `clearTimeout` and `clearInterval` SHALL behave like the native functions, and every timer still pending SHALL be cleared when the element is removed.

#### Scenario: timers started by a component stop when it is removed
- **WHEN** a component starts timeouts and intervals and is removed
- **THEN** they ran while it was connected and stop afterwards

### Requirement: untrack helper
Component scripts SHALL have `untrack`, which runs a function without subscribing the current observer to what it reads, and `toRaw`, which returns the plain object behind a reactive proxy.

#### Scenario: untrack lets an effect call other components without subscribing to them
- **WHEN** an observer reads other state inside untrack and that state changes
- **THEN** the observer does not run again

#### Scenario: toRaw gives component scripts the plain data behind a prop or state
- **WHEN** a component script calls toRaw on a prop or state value
- **THEN** it gets the original object, not the proxy
