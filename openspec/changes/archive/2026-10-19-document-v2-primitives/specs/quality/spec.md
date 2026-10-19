## ADDED Requirements

### Requirement: No memory leaks
Removed components and removed keyed list items SHALL be garbage collectable.

#### Scenario: components mounted and removed 1,000 times are garbage collected
- **WHEN** a component is mounted and removed 1,000 times
- **THEN** the instances are collected

#### Scenario: list items removed from a keyed list are garbage collected
- **WHEN** rows are removed from a keyed list
- **THEN** their nodes are collected

### Requirement: Performance budget
Keyed list operations from js-framework-benchmark SHALL stay within the benchmark budgets.

#### Scenario: keyed rows stay within the benchmark budgets
- **WHEN** rows are created, updated, swapped and cleared
- **THEN** each operation is within budget
