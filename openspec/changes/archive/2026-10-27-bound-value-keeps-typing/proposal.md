## Why
A `_value` binding on a component, such as `<ui-input _value="#grid.quick" oninput="search(this.value)" debounce="200ms">`, threw away what the user typed. Before writing, the binding compared the new value with the element's current `value`. On a component that property is a prop, so the comparison subscribed the binding to the component's own value. Each keystroke reran the binding, which wrote the old state value back before the debounced handler saw the new one. The Pro data grid search and several Pro form components hit this.

## What Changes
- The binding reads the element's current form property untracked, so it reruns only when the bound reference changes.

## Impact
Runtime (`bindings.ts`), one line. No API change.
