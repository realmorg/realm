# events Specification

## Purpose
Handling custom events with native-style on<event> attributes and properties, in components and on plain pages.

## Requirements

### Requirement: Custom event handlers
Components SHALL emit events with native dispatchEvent. Parent markup SHALL handle them with on<name> attributes. On plain pages, REALM elements SHALL support on<name> attributes containing JavaScript and on<name> properties kept in sync, alongside addEventListener. Native handler names SHALL not be redefined.

#### Scenario: parent components handle a child's custom event by name
- **WHEN** a child dispatches a custom event
- **THEN** the parent's handler runs and can cancel it

#### Scenario: on a plain page the attribute holds JavaScript and stays in sync with the property
- **WHEN** page markup uses on<name>
- **THEN** attribute and property stay in sync

#### Scenario: handler attributes set before connection are compiled on connect
- **WHEN** the attribute is set before connection
- **THEN** it works once connected

#### Scenario: a handler attribute with a syntax error is ignored
- **WHEN** the attribute has a syntax error
- **THEN** no handler is set

#### Scenario: native handler names are not redefined
- **WHEN** a component emits events
- **THEN** only non-native names are observed

### Requirement: Page handlers for dispatched events
Custom event names sent with `dispatch("name")` SHALL get page handler attributes and properties, like names created with `new CustomEvent("name")`.

#### Scenario: page handler attributes work for events sent with dispatch
- **WHEN** a page element has `onping="…"` and the component calls `dispatch("ping")`
- **THEN** the attribute's code runs
