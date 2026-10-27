## MODIFIED Requirements

### Requirement: No flash of undefined components
`realm.css` SHALL hide `<custom-element>` and `<import-element>`. It SHALL hide elements that are not yet defined only while the page has a `<custom-element>`, while `<import-element>` is not defined, or while an `<import-element>` matches `:state(loading)`, so that tags REALM never defines are shown once REALM is done.

#### Scenario: realm.css keeps undefined components hidden until they are defined
- **WHEN** a page uses a component before its definition arrives
- **THEN** it is hidden until it is defined

#### Scenario: realm.css hides undefined elements only while REALM starts or imports
- **WHEN** a page has an undefined non-REALM element and REALM starts, imports and finishes
- **THEN** the element is hidden only while REALM starts or imports

#### Scenario: realm.css leaves undefined elements visible on a page without REALM work
- **WHEN** a page has no definitions and no imports
- **THEN** undefined elements are visible
