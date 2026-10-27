## MODIFIED Requirements

### Requirement: Import element
Each URL SHALL be fetched once and shared by every importer, every definition in the file SHALL be registered, failures SHALL fire error and warn, detached importers SHALL stay quiet, at most six requests per origin SHALL run at once, loading=lazy SHALL wait for a listed tag, and an importer SHALL match `:state(loading)` from the start of its request until the file's definitions are defined or the import fails.

#### Scenario: racing imports of the same file fetch once and define every component in it
- **WHEN** two importers load the same bundle
- **THEN** one request defines every component

#### Scenario: failed imports fire error and warn, removed importers stay quiet
- **WHEN** imports fail
- **THEN** error fires on connected importers only

#### Scenario: an importer removed before its file arrives does not fire load
- **WHEN** an importer is removed mid-request
- **THEN** load does not fire

#### Scenario: missing from attribute warns; reconnecting does not import twice
- **WHEN** from is missing or the importer moves
- **THEN** REALM warns once and imports once

#### Scenario: lazy imports wait until a listed tag is used
- **WHEN** loading=lazy is used
- **THEN** the request waits for the tag

#### Scenario: document tags are noticed as they are added
- **WHEN** tags appear in the page
- **THEN** lazy imports start

#### Scenario: at most six requests per origin run at once
- **WHEN** many files load from one origin
- **THEN** six run at a time

#### Scenario: an importer is in the loading state until its definitions are defined
- **WHEN** an importer waits for its file
- **THEN** it matches :state(loading) until the definitions are defined
