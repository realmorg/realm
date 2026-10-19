## ADDED Requirements

### Requirement: Handler-only definitions
The compiler SHALL produce a setup module for a definition that has handler attributes but no script, and `precompile` SHALL insert `<script type="realm" src>` for it, so compound parts work under `script-src 'self'`.

#### Scenario: writes a setup module per definition and points the script at it
- **WHEN** a directory with component files, handler-only parts and a page is precompiled
- **THEN** modules are written and every definition's script points at its module
