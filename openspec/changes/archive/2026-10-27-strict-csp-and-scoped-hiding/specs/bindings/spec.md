## MODIFIED Requirements

### Requirement: Attribute bindings
_name="#ref" SHALL bind an attribute to a reference, with an optional leading !. true SHALL add, and false or null SHALL remove, the attribute. aria-* SHALL receive "true"/"false". value/checked/selected/indeterminate SHALL set properties, and SHALL NOT write a property that already has the value, so a value the user typed keeps its `tooShort`/`tooLong` validity. Objects on custom elements SHALL be passed as properties. --name SHALL set a CSS custom property.

#### Scenario: covers every value rule
- **WHEN** values of every kind are applied
- **THEN** each follows its rule

#### Scenario: bindings follow state, including css variables
- **WHEN** state changes
- **THEN** bound attributes and CSS variables update

#### Scenario: parse and write rules
- **WHEN** references are parsed or written
- **THEN** valid paths work and invalid writes warn

#### Scenario: a typed value is not written back, so length limits still apply
- **WHEN** a typed value flows into state and back into the bound input
- **THEN** the input is not rewritten and reports tooShort
