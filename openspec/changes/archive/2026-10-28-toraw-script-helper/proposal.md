## Why
Components that take large data as props (the Pro pivot table, spreadsheet and charts) read every item through the reactive proxy. Reading 100,000 rows that way took about 300 ms against about 10 ms for the plain array. `toRaw` is exported from `@realmorg/realm`, but component scripts could not reach it.

## What Changes
- `toRaw` is a script helper, like `untrack`.

## Impact
Runtime (`assemble.ts`, `element.ts`, `types.ts`) and docs. A few bytes.

