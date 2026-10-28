---
"@realmorg/realm": patch
---

`toRaw` is a script helper, like `untrack`, so a component can read a large prop as `toRaw(props.rows)` without going through the reactive proxy for every item.
