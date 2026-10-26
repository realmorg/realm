# state Specification

## Purpose
Reactive state with useState, cached derived values through getters, and observers that clean up after themselves.

## Requirements

### Requirement: useState
useState SHALL return a reactive proxy. Property writes, array mutations, added and deleted keys SHALL notify readers. Getters SHALL be cached derived values. Updates SHALL be batched per microtask. Frozen objects and arrays SHALL NOT be made reactive and SHALL be read as they are, also when nested inside reactive data.

#### Scenario: returns the same proxy for the same object
- **WHEN** an object is made reactive twice
- **THEN** the same proxy is returned

#### Scenario: leaves non-plain objects untouched
- **WHEN** a non-plain object is passed
- **THEN** it is returned unchanged

#### Scenario: frozen data is read as it is
- **WHEN** state holds a frozen array of frozen objects, or is itself frozen
- **THEN** reading any item returns the frozen value without errors

#### Scenario: batches several changes into one run
- **WHEN** several values change in one task
- **THEN** observers run once

#### Scenario: does not run when the value is the same
- **WHEN** a value is set to itself
- **THEN** observers do not run

#### Scenario: tracks nested objects lazily
- **WHEN** a nested property changes
- **THEN** readers update

#### Scenario: tracks added and deleted keys
- **WHEN** keys are added or deleted
- **THEN** key readers update

#### Scenario: getters are cached derived values
- **WHEN** a getter is read twice
- **THEN** it computes once until inputs change

#### Scenario: diamond dependencies update once and never see stale values
- **WHEN** two derived values share an input
- **THEN** observers see consistent values once

#### Scenario: a derived value invalidated twice before it is read recomputes once
- **WHEN** two inputs change before a read
- **THEN** the getter recomputes once

#### Scenario: setters run with the proxy as this
- **WHEN** a setter is called
- **THEN** its writes are reactive

#### Scenario: a getter that throws reports the error and recovers
- **WHEN** a getter throws then its input changes
- **THEN** the error is reported and later reads recover

### Requirement: Arrays
Array mutation methods SHALL notify without self-triggering. Shrinking length SHALL notify readers of removed indexes. Search methods SHALL find raw and reactive members.

#### Scenario: push, splice and index writes notify
- **WHEN** an array is mutated
- **THEN** readers update

#### Scenario: push inside an observer does not loop on its own length
- **WHEN** an observer pushes to an array
- **THEN** no update loop happens

#### Scenario: shrinking length notifies readers of removed indexes
- **WHEN** length shrinks
- **THEN** readers of removed indexes update

#### Scenario: length writes without index readers still notify iteration
- **WHEN** length changes
- **THEN** iterators update

#### Scenario: search methods find raw and reactive members
- **WHEN** includes or indexOf is used
- **THEN** raw and reactive members are found

### Requirement: observe
observe SHALL run immediately and again when anything it read changes, with no dependency list. A returned function SHALL run before the next run and on stop. Errors SHALL be reported without stopping other observers. Update loops SHALL be detected.

#### Scenario: runs cleanup before the next run and on stop
- **WHEN** an observer returns a cleanup
- **THEN** it runs before reruns and on stop

#### Scenario: a stopped effect queued for a run does not run
- **WHEN** an observer is stopped while queued
- **THEN** it does not run

#### Scenario: an observer stopped by another during the same flush does not run
- **WHEN** one observer stops another in the same flush
- **THEN** the stopped one does not run

#### Scenario: errors are reported and do not stop other observers
- **WHEN** an observer throws
- **THEN** others still run

#### Scenario: detects update loops
- **WHEN** an observer keeps changing its own input
- **THEN** REALM stops and reports a loop

#### Scenario: untrack reads without subscribing
- **WHEN** a read is untracked
- **THEN** it does not subscribe

#### Scenario: nested observers keep their own dependencies
- **WHEN** observers are nested
- **THEN** each reruns only for its own reads

### Requirement: Observers and refs
Observers created at the top of a script SHALL first run after the markup exists, so they can read refs.

#### Scenario: observers written at the top of a script see refs once the markup exists
- **WHEN** an observer reads `refs.x` at the top of the script
- **THEN** it sees the element
