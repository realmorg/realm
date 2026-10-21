## Why
Parent lookups walked from an element to its parent node, or from a shadow root to its host. Slotted content skipped the `<slot>` it is shown in, so it could not reach components that wrap that slot inside the host's shadow markup. ToyKit hit this twice: a game's sprites slotted into a wrapper whose slot sits inside a `<scene-object>` attached to the wrong object, and so did layout parts that wrap author content. The docs already said lookups work through slots.

## What Changes
- Explicit `lookup()` calls follow the flat tree: slotted content continues from its assigned slot, through any components wrapping that slot, then up to the host.
- Handler names and `#` references keep skipping slots. Otherwise a library's shadow markup would capture names in its users' content: `ui-sheet-close` calling `close()` reached the `ui-dialog` inside `ui-sheet` instead of the sheet.
- A component waits for flat-tree ancestors that are still setting up, so the components wrapping its slot run their scripts first.
- Content a component owns still resolves in its owner first, and the warning rule is unchanged: reads from a parent that does not contain the reader in its light DOM are reported.

## Impact
Runtime only (`element.ts`, `scope.ts`). Documented in the `lookup` reference and Nested components and scope.
