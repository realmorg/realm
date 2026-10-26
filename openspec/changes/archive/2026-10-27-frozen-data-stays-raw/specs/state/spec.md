## MODIFIED Requirements

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
