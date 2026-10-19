# security Specification

## Purpose
What REALM treats as code and what it treats as data, and how inserted HTML is sanitised.

## Requirements

### Requirement: Sanitising
HTML from requests or html slots SHALL be sanitised: blocked elements removed, on* and srcdoc attributes removed, and javascript:, vbscript: and data:text/html URLs removed. Such HTML SHALL never be scanned for handlers or references.

#### Scenario: durations and the sanitiser
- **WHEN** unsafe HTML is sanitised
- **THEN** dangerous parts are removed
