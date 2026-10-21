## Why
REALM reports a parent lookup during development when the reader is nested through the owner's shadow markup. That report exists to show implicit sharing: a handler or binding using a name its component never declared. An explicit `lookup("name")` in a script is a deliberate dependency, but it went through the same path and was reported too. Libraries that pass context down the DOM on purpose, such as ToyKit's scene graph (`lookup("toykit")`), printed a warning for every nested object.

## What Changes
- The `lookup()` script helper no longer reports parent reads.
- Handler names a script does not define, and `#` references in markup, still report reads that cross a shadow root.

## Impact
Runtime only (`element.ts`, `assemble.ts`, `scope.ts`). Documented in the `lookup` reference and Nested components and scope.
