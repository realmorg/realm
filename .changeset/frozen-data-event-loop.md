---
"@realmorg/realm": patch
---

Frozen objects and arrays in state or props are read as they are instead of throwing. A `repeat` loop variable named `event` no longer breaks the handlers in its loop; inside them, `event` is the item.
