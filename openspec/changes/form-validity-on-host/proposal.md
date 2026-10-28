## Why
Form-associated Pro components (select, tag input, colour picker, file upload, wizard and others) each add `validity`, `validationMessage`, `checkValidity()` and `reportValidity()` to their host by hand, because REALM sets validity on `ElementInternals` but does not expose it on the element. Native form fields have these members, and pages and form libraries call them.

## What Changes
- A form-associated component's host gets `validity`, `validationMessage`, `willValidate`, `checkValidity()` and `reportValidity()`, forwarding to its `ElementInternals`, unless the component defines its own.

## Impact
Runtime (`element.ts`). The runtime has about 4 bytes left in its 16 KB gzip budget, so this needs either a matching saving elsewhere or a budget decision before it is built.
