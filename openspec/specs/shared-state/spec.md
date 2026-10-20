# shared-state Specification

## Purpose
App-wide stores shared by components, with optional persistence that keeps value types.

## Requirements

### Requirement: defineStore
defineStore(name, initial, { persist }) SHALL return one reactive store per name, persist to localStorage, sessionStorage or a custom adapter with types preserved, ignore corrupt stored values with a warning, and be usable from any component.

#### Scenario: returns the same store for the same name
- **WHEN** a store is defined twice
- **THEN** the same store is returned

#### Scenario: persists to localStorage and restores typed values
- **WHEN** a persisted store changes
- **THEN** values are saved and restored with types

#### Scenario: session storage, custom adapters and corrupt values
- **WHEN** other adapters or corrupt values are used
- **THEN** they work or warn

#### Scenario: components read and update stores imported from a module
- **WHEN** two components share a store
- **THEN** both see updates

### Requirement: Persisting data fields
A persisted store SHALL save only its data fields and SHALL NOT run its getters to save them.

#### Scenario: persisted stores save their data fields and never run getters
- **WHEN** a persisted store with a getter changes
- **THEN** storage holds only the data fields and the getter has not run
