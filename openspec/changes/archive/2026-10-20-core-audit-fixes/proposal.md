## Why
The reference rewrite and the owner audit found runtime bugs: repeat on a top-level element broke on update, import-element inside inline definitions fetched early, re-importing a file warned, and compound parts could set up before their parent and logged lookup reports.

## What Changes
- repeat resolves its container at update time.
- import-element inside a custom-element definition stays inert.
- importDefinitions defines from copies, so cached files can be imported again.
- A component waits for an ancestor REALM component that is still setting up.
- Parent lookups are reported only for components nested through shadow markup, not for light-DOM parts.

## Impact
Runtime only, each with a test.
