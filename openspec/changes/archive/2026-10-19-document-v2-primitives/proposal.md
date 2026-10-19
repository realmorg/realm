## Why
Several primitives were added while building the UI library and examples (reactive CSS, attrs, dispatch, listen, defineMethods, useChildren, form control delegation, focusgroup, SVG bindings) and are tested but not specified.

## What Changes
- New `styling` capability: reactive CSS variables and custom states, stylesheet warnings, hiding undefined components.
- New `component-api` capability: attrs, dispatch, listen, defineMethods, useChildren.
- New `quality` capability: memory and performance budgets.
- `forms-a11y`: value/checked form automation, control delegation, implicit submission, label forwarding, focusgroup.
- `bindings`: SVG attribute case and SVG value slots.
- `props`: writing an undeclared prop warns.
- `state`: observers at the top of a script see refs.

## Impact
Specs only. Behaviour already exists and is covered by tests whose titles equal the scenarios.
