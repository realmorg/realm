# control-flow Specification

## Purpose
Conditional and repeated content written with the REALM tags is-visible, is-hidden and repeat-list.

## Requirements

### Requirement: Conditional content
<is-visible when> and <is-hidden when> SHALL mount and unmount their content, with comparators eq, neq, gt, gte, lt, lte and contains. Unmounted content SHALL have no running bindings or listeners.

#### Scenario: comparators
- **WHEN** values are compared
- **THEN** each comparator behaves as documented

#### Scenario: is-visible and is-hidden mount and unmount content
- **WHEN** conditions change
- **THEN** content mounts and unmounts

#### Scenario: hidden content stops its bindings and listeners
- **WHEN** content is unmounted
- **THEN** its listeners and bindings stop

### Requirement: Lists
<repeat-list of as index key> and the repeat attribute SHALL render one block per item, reuse blocks by key, move them without re-creating, warn on duplicate keys and render nothing for non-arrays.

#### Scenario: keyed lists reuse, move and remove nodes
- **WHEN** a keyed list is reordered and edited
- **THEN** nodes are reused and moved

#### Scenario: unkeyed lists, duplicate keys, nested loops and non-arrays
- **WHEN** lists are unkeyed, duplicated, nested or not arrays
- **THEN** each case renders correctly

#### Scenario: the repeat attribute works inside tables
- **WHEN** rows repeat inside a table
- **THEN** the parser keeps them in place

### Requirement: Top-level repeat
The `repeat` attribute SHALL keep updating when the repeated element is a direct child of the definition.

#### Scenario: the repeat attribute on a top-level element keeps updating after the markup is mounted
- **WHEN** a list rendered by a top-level `repeat` element grows
- **THEN** the new item renders
