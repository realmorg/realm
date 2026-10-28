---
"@realmorg/realm": minor
---

- Form-associated components have `validity`, `validationMessage`, `willValidate`, `checkValidity()` and `reportValidity()` like native fields, read from their `ElementInternals`. A component that defines its own with `defineMethods` keeps them.
- A value a page sets on an element before its definition loads, such as `tree.loader = fetchChildren`, now reaches the `defineMethods` setter of the same name, as it already did for props.
- The runtime budget is now under 17 KB gzip.
