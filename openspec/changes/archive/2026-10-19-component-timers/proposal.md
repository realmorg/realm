## Why
Components tracked their own timers to clear them on removal, as AGENTS.md requires.

## What Changes
- setTimeout, setInterval, clearTimeout and clearInterval in a component script are bound to the element and cleared when it is removed.

## Impact
Runtime only.
