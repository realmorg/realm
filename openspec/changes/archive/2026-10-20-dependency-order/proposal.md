## Why
With per-component imports, a component could become interactive before the components it uses were defined (the dashboard command palette called a dialog method that did not exist yet).

## What Changes
- A file's own components are defined only after the files it depends on are defined.

## Impact
Runtime only.
