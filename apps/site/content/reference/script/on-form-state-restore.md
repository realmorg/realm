---
title: onFormStateRestore
description: Reference for onFormStateRestore, which runs when the browser restores a form-associated component's value after navigation or autofill.
group: Lifecycle hooks
order: 74
nav: onFormStateRestore
---

# `onFormStateRestore`

Runs when the browser restores the element's state, after back/forward navigation or autofill. For components defined with [`form-associated`](/reference/elements/custom-element/#form-associated).

```ts
onFormStateRestore(fn: (state: unknown, mode: string) => void): void
```

```js
onFormStateRestore((state, mode) => {
  editor.text = String(state ?? "");
});
```

## Parameters

| Parameter | Type | Meaning |
| --- | --- | --- |
| `fn` | `(state, mode) => void` | Runs from the element's `formStateRestoreCallback` |
| `state` | `unknown` | The value saved with `setFormValue` (a string, `File`, `FormData` or `null`) |
| `mode` | `"restore"` or `"autocomplete"` | Why the state is restored |

When the component declares a `value` prop, REALM already writes `state` to it (or sets `checked` to `state !== null` when it declares `checked`) before your hooks run.

## Related

- [Forms](/docs/forms/)
- [`internals`](/reference/script/internals/)
