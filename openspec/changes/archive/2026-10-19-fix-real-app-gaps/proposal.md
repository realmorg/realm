## Why
Building Unicons v2 and the weather and contacts examples found six gaps in the runtime.

## What Changes
- `html` value slots inside SVG render SVG elements; the sanitiser also drops `javascript:` URLs in `to`, `from` and `values`.
- `--attr-*` variables are set to `initial` when absent, so nested components don't inherit an ancestor's value.
- A component script whose `import` fails warns and renders without the script instead of hanging.
- On a fetch element, `debounce` and `throttle` time the request only; handlers and `preventDefault` run immediately.
- Requests flush pending updates before reading form values.
- `hidden` hides every component regardless of its `:host` display.

## Impact
Runtime only. Each change has a test.
