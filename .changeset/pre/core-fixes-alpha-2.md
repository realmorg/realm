---
"@realmorg/realm": patch
---

Fixes from auditing the examples and the website:

- An imported file's top-level `<import-element>` tags are imported too, relative to that file, once, with cycles ignored. A file's own components are defined only after the files it depends on.
- `<import-element>` inside a `<custom-element>` definition stays inert, and a file can be imported again after it was cached.
- A component waits for an ancestor REALM component that is still setting up, and `repeat` resolves its container at update time.
- Shadow roots hide custom elements that are not defined yet, and `hidden` hides elements inside components whatever their `display`.
- Disabled delegated form controls are valid.
- Persisted stores save data fields only and never run getters.
- `untrack` is available as a script helper.
