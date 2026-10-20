## Why
Issue #57: a component that renders itself had no clear failure. Setting up a component connects the components in its markup synchronously, so every nesting level grows the call stack, and nesting stopped with "Maximum call stack size exceeded" at about 45 levels. That limit also broke legitimate recursive components, such as a file tree deeper than 44 levels, and a component that renders itself without a stop gave no `[realm]` message.

## What Changes
- Components nested deeper than 32 levels in one synchronous pass finish setting up in a microtask, so deep recursive trees render.
- A component nested more than 1000 components deep through shadow roots is not set up, and REALM warns that a component which renders itself needs a condition that stops it.

## Impact
Runtime only (`element.ts`). Documented in Lifecycle and Control flow.
