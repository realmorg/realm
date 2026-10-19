# props Specification

## Purpose
Typed public attributes declared with defineProps and a zod-style builder.

## Requirements

### Requirement: Prop builder
prop.string, number, boolean, enum, array, object and date SHALL convert attribute text and validate values. Modifiers default, required, optional, reflect, attribute, min, max, int, pattern, email and url SHALL be supported. Booleans SHALL follow the native presence rule.

#### Scenario: string rules
- **WHEN** string rules are applied
- **THEN** valid text passes and invalid text reports a message

#### Scenario: number rules
- **WHEN** number rules are applied
- **THEN** numeric text converts and invalid values report a message

#### Scenario: boolean follows the native presence rule
- **WHEN** a boolean attribute is present or absent
- **THEN** presence means true

#### Scenario: enum
- **WHEN** an enum value is checked
- **THEN** only listed values pass

#### Scenario: date
- **WHEN** a date attribute is parsed
- **THEN** valid dates pass and invalid ones report

#### Scenario: array and object shapes
- **WHEN** JSON attributes are parsed
- **THEN** items and shapes are validated

#### Scenario: defaults, required and optional
- **WHEN** an attribute is missing
- **THEN** the default, a required error or undefined applies

#### Scenario: attribute name, reflection and serialisation
- **WHEN** a prop is reflected
- **THEN** its value serialises to attribute text

### Requirement: defineProps in components
defineProps SHALL return a reactive, read-only object fed by attributes and properties. Invalid values SHALL warn and use the default. Properties set before upgrade SHALL be kept. Calling defineProps twice SHALL be an error.

#### Scenario: parses attributes, falls back on invalid values and stays reactive
- **WHEN** attributes are set, changed or invalid
- **THEN** props follow them and invalid values fall back

#### Scenario: reflects to attributes and keeps properties set before upgrade
- **WHEN** a reflected prop is set, or a property is set before upgrade
- **THEN** attributes follow and early values are kept

#### Scenario: props written inside the component go through validation
- **WHEN** the component assigns to a declared prop
- **THEN** the value is validated, stored and reflected like an attribute or property write

#### Scenario: calling defineProps twice is an error
- **WHEN** defineProps is called twice
- **THEN** an error is reported

#### Scenario: removing an element removes its property accessors
- **WHEN** a component is removed
- **THEN** its prop accessors are removed

### Requirement: Undeclared props
Writing to a prop that `defineProps` did not declare SHALL warn.

#### Scenario: writing an undeclared prop warns
- **WHEN** the script assigns to an undeclared prop
- **THEN** REALM warns
