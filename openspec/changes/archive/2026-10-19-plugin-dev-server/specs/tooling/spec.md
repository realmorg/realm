## ADDED Requirements

### Requirement: Dev server
In Vite dev, the plugin SHALL serve `.html` files requested without `text/html` in `Accept` (as `<import-element>` does) exactly as they are on disk, and leave page navigations to Vite.

#### Scenario: component files fetched by import-element are served untransformed in dev
- **WHEN** a component file is fetched and a page is navigated to on the dev server
- **THEN** the component file is unchanged and the page gets Vite's client
