# security Specification

## Purpose
What REALM treats as code and what it treats as data, and how inserted HTML is sanitised.

## Requirements

### Requirement: Sanitising
HTML from requests or html slots SHALL be sanitised: blocked elements removed, on* and srcdoc attributes removed, and javascript:, vbscript: and data:text/html URLs removed. Such HTML SHALL never be scanned for handlers or references.

#### Scenario: durations and the sanitiser
- **WHEN** unsafe HTML is sanitised
- **THEN** dangerous parts are removed

### Requirement: Handler attributes are never parsed as handlers
REALM SHALL rename `on<event>` attributes in definition source text to `realm:on<event>` before parsing it, outside `<script>` content and quoted attribute values, so that no document REALM creates holds an `on*` attribute. Definitions loaded with `<import-element>`, and page definitions whose handlers are written as `realm:on<event>`, SHALL run under `script-src 'nonce-…' 'strict-dynamic'` without any `securitypolicyviolation`.

#### Scenario: imported definitions with handlers log no violation under a strict nonce policy
- **WHEN** a page with a strict nonce policy imports a definition whose markup has on* handlers
- **THEN** the handlers run and no violation is reported

#### Scenario: page definitions with realm:on handlers log no violation under a strict nonce policy
- **WHEN** a page definition writes its handlers as realm:on…
- **THEN** the handlers run and no violation is reported

#### Scenario: handler attributes are renamed before parsing, outside scripts and attribute values
- **WHEN** source text with handlers, quoted values containing "on", text and a script is parsed
- **THEN** only the handler attributes are renamed
