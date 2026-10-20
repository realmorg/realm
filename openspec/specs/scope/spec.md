# scope Specification

## Purpose
How names in markup resolve across nested components.

## Requirements

### Requirement: Owner first, then parents
A reference SHALL resolve in the component whose markup contains it, then in each parent component. Reading from a parent SHALL be reported once in development. Missing names SHALL warn and show fallback content. Handler names nobody defines SHALL fall back to globals.

#### Scenario: values resolve in the owner first, then in parent components
- **WHEN** a child reads a name its parent defines
- **THEN** it resolves through the parent and slotted content stays with its owner

#### Scenario: handler names that no component defines fall back to globals
- **WHEN** a handler calls a global function
- **THEN** the global is called
