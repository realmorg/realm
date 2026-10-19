## ADDED Requirements

### Requirement: HTML value slots in SVG
A value slot with `html` or `html-unsafe` inside SVG SHALL render the value as SVG elements, sanitised in `html` mode.

#### Scenario: html value slots inside SVG render sanitised SVG elements
- **WHEN** an SVG value slot in html mode receives markup
- **THEN** SVG elements render and unsafe parts are removed
