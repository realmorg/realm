---
title: untrack
description: Reference for untrack, which runs a function without subscribing the current observer to what it reads.
group: JavaScript API
order: 106
nav: untrack
---

# `untrack`

Runs a function and returns its result without subscribing the current observer to anything it reads.

```ts
untrack<T>(fn: () => T): T
```

```js
import { observe, untrack } from "https://realm.js.org/dist/index.js";

observe(() => {
  const query = search.query;
  const limit = untrack(() => settings.limit);
  run(query, limit);
});
```

The observer above re-runs when `search.query` changes, not when `settings.limit` changes.

## Notes

- Writes inside `fn` still notify other observers.
- In a component script, `untrack` is available as a helper, like `observe`. Outside components, import it from the module.

## Related

- [State and reactivity: reading without subscribing](/docs/state/#reading-without-subscribing)
