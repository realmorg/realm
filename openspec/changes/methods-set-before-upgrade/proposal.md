## Why
A page can set a property on an element before its definition loads, for example `tree.loader = fetchChildren` or `chat.loader = …`. REALM keeps such early values for declared props, but not for members added with `defineMethods`, so the component's setter never sees them. The Pro tree, notification center and chat recover them by hand.

## What Changes
- When `defineMethods` adds a setter whose name is already an own property of the host, the early value is removed from the host and passed to the setter, as props already do.

## Impact
Runtime (`element.ts` / `defineMethods`). Same size-budget note as `form-validity-on-host`: there are about 4 bytes left.
