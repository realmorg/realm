## MODIFIED Requirements

### Requirement: Element methods
`defineMethods(object)` SHALL expose the object's methods and getters on the host element and remove them on teardown. A value the page set on the host before upgrade SHALL be passed to the setter of the same name.

#### Scenario: exposes methods and getters on the element and removes them on teardown
- **WHEN** a component defines methods and is removed
- **THEN** they are callable while connected and gone afterwards

#### Scenario: a value set before upgrade reaches a defineMethods setter
- **WHEN** a page sets a property before the component is defined and the component defines a setter with that name
- **THEN** the setter receives the value
