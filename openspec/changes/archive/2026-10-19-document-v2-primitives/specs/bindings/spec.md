## ADDED Requirements

### Requirement: SVG bindings
Bindings on SVG elements SHALL keep the SVG attribute case (`_viewBox` sets `viewBox`) and value slots inside SVG SHALL render as text nodes.

#### Scenario: bindings keep SVG attribute case and value slots render as text
- **WHEN** a component binds SVG attributes and shows values inside `<text>`
- **THEN** the SVG renders correctly
