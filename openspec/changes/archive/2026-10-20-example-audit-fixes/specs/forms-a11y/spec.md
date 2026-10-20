## ADDED Requirements

### Requirement: Disabled delegated controls
A delegated control that is barred from constraint validation (for example because it is disabled) SHALL report the host as valid.

#### Scenario: a disabled delegated control is valid, whatever its constraints
- **WHEN** a disabled delegated number input has contradictory constraints
- **THEN** no error is thrown and the host is not invalid
