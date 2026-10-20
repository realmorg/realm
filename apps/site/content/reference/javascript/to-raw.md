---
title: toRaw
description: Reference for toRaw, which returns the original object behind a reactive proxy.
group: JavaScript API
order: 105
nav: toRaw
---

# `toRaw`

Returns the original object behind a reactive proxy. Anything else is returned unchanged.

```ts
toRaw<T>(value: T): T
```

```js
import { toRaw } from "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/index.js";

const snapshot = structuredClone(toRaw(todo.items));
worker.postMessage(toRaw(settings));
```

## Use it for

| Case | Why |
| --- | --- |
| `structuredClone`, `postMessage`, IndexedDB | Proxies cannot be cloned |
| Identity checks against objects created outside REALM | `toRaw(proxy) === original` |
| Heavy read-only work | Reading the raw object does not subscribe |

Nested values of the raw object are raw too. Writing to the raw object does **not** notify observers.

## Related

- [`useState`](/reference/script/use-state/)
