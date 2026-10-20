---
title: flush
description: Reference for flush, which applies pending reactive updates synchronously.
group: JavaScript API
order: 104
nav: flush
---

# `flush`

Runs every queued observer and binding update now, instead of at the end of the microtask.

```ts
flush(): void
```

```js
import { flush } from "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/index.js";

state.items.push(item);
flush();
// the DOM shows the new item here
```

## Behaviour

- Updates run in rounds until nothing is queued. After 100 rounds, the queue is cleared and `Update loop detected: an observer keeps changing state it depends on.` is reported.
- Calling it with nothing queued does nothing.
- Inside a component script, prefer `await tick()`, which waits a microtask and then flushes. `flush` is not one of the script helpers.
- Fetch attributes call `flush()` before building a request, so a request sees state changed earlier in the same event.

## Related

- [`tick`](/reference/script/tick/)
- [State and reactivity: updates are batched](/docs/state/#updates-are-batched)
