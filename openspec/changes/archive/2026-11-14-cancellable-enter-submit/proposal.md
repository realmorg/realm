## Why
Enter in a form-associated component's text field submitted the form at once, before keydown handlers on the page ran, so a page could not cancel it with `preventDefault()` the way it can for a native input. An invite dialog that adds an email on Enter submitted the whole form instead.

## What Changes
- Implicit submission waits until the keydown event has reached every listener, and is skipped when a listener cancelled it or the component was removed.

## Impact
Runtime (`forms.ts`).

