## Why
Pages should be able to import single UI component files instead of the whole bundle, so each file must bring the components it uses.

## What Changes
- Top-level import-element tags in an imported file are imported too, relative to that file, once, with cycles ignored.

## Impact
Runtime only.
