## Why
A component waits while an ancestor's definition is still loading. Its descendants did not wait for it in turn: when the ancestor finished loading, a child defined in that same moment could set up before its waiting parent. On a slow connection (a phone, usually), a docs page's `ui-tabs-list` read `#tabs.orientation` before `ui-tabs` existed, and its tablist never got an orientation or arrow-key navigation. `ui-avatar-fallback` hit the same race with `#image.loaded`.

## What Changes
- A component also waits for an ancestor that is itself waiting to set up, and sets up right after it, so a parent always sets up before its children.

## Impact
Runtime only (`element.ts`). The runtime stays inside its 16 KB gzip budget.
