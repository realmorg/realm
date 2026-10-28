---
"@realmorg/realm": patch
---

- A bound `value` on a component, such as `<ui-input _value="#state.query" oninput="search(this.value)" debounce="200ms">`, no longer puts the old state value back while the user types.
- A form reset returns only form state (`value`, `checked`, `selected`, `indeterminate`) to its attribute. Data a page set as a property, such as an options array or a loader, is kept.
