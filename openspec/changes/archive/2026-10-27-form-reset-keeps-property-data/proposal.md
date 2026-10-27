## Why
A form reset re-read every prop of a form-associated component from its attribute. Data a page set as a property, such as an options array, a tree's nodes or a loader, fell back to its default, so a Reset button emptied select, tree, transfer list and query builder components. A native form reset only restores the control's value and checked state.

## What Changes
- On reset, only the `value` and `checked` props go back to their attribute values. Other props keep what was set.

## Impact
Runtime (`props-runtime.ts`). No API change.
