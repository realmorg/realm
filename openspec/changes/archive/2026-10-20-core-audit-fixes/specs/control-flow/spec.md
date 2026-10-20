## ADDED Requirements

### Requirement: Top-level repeat
The `repeat` attribute SHALL keep updating when the repeated element is a direct child of the definition.

#### Scenario: the repeat attribute on a top-level element keeps updating after the markup is mounted
- **WHEN** a list rendered by a top-level `repeat` element grows
- **THEN** the new item renders
