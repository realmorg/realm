## Why
Components should be composed from child elements (compound parts) rather than slot attributes, with no inline style needed in usage.

## What Changes
- A definition may declare slot="name"; its elements default to that slot of their parent.
- Compound parts resolve handlers and values from their parent component (existing scope rule, now specified for parts).

## Impact
Runtime: a few bytes. UI library moves to compound parts.
