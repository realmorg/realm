## Why
The weather example needed requestSubmit() to refetch when a place was chosen, and the contacts example needed handlers to update or remove one list item after a save or delete.

## What Changes
- trigger accepts references (trigger="#place"): the request re-runs when the value changes, deeply.
- into-mode="update" replaces items with the same into-key (default id) and appends new ones; into-mode="remove" removes them.

## Impact
Runtime only.
