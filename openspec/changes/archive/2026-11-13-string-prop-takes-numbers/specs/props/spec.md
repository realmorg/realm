## MODIFIED Requirements

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

#### Scenario: a number given to a string prop becomes its text
- **WHEN** a finite number is given to a string prop
- **THEN** the prop holds its text, and other types still fail
