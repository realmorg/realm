## Why
Frozen objects and arrays crashed on read inside state or props. A reactive proxy must return the exact value of a non-writable, non-configurable property, but REALM wrapped nested objects in their own proxy, so reading `rows[0]` from `Object.freeze`d data threw "Proxy handler's 'get' result of a non-configurable and non-writable property should be the same value". A data grid that freezes its rows for speed hit this.

## What Changes
- Frozen objects and arrays are not made reactive. They are read as they are, in state, in props and nested inside reactive data. They cannot change, so there is nothing to track.

## Impact
Runtime only (`reactivity.ts`). The runtime stays inside its 16 KB gzip budget.

## Also
- A repeat loop variable named `event` broke every handler in its loop: handlers are compiled with `event` as their first parameter, and a second `event` parameter is a syntax error in strict mode. The loop variable now takes the name inside its handlers.
