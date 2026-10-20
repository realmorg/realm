---
title: Performance and memory
description: How REALM keeps updates small and stops listeners, timers, observers and requests when an element is removed.
group: Guides
order: 51
nav: Performance and memory
---

# Performance and memory

REALM has no virtual DOM and never re-runs a component. Each slot, binding, condition and loop subscribes to the values it reads, and only those update.

## Updates

- **Fine-grained.** Changing `todo.items[3].done` updates the bindings that read that field, not the component.
- **Batched.** Writes are collected and applied once per microtask, so ten writes in a row cost one update per affected binding.
- **Cached derived values.** Getters on state recompute only after an input changed, and only once even when several inputs changed.
- **Same value, no work.** Writing the value a property already has notifies nobody.
- **Loop protection.** An observer that keeps changing its own input is stopped after 100 rounds with an error, instead of freezing the tab.

## Lists

Keyed lists (`key="id"`) reuse rows for items that stay, move rows instead of re-creating them, and only build rows for new items. Without a key, rows are matched by position. Set a key on long lists that are often reordered.

## Components

- **One definition per type.** A component's markup, handlers and styles are prepared once. Each instance clones the prepared markup and connects bindings.
- **Shared stylesheets.** Styles are constructable stylesheets adopted by every instance. Nothing is parsed per instance.
- **No work in the constructor.** Setup runs when the element connects, following the custom element rules.

## Loading

- The runtime is about 15 KB gzipped, plus 1 KB of CSS.
- `<import-element>` fetches each URL once, however many tags or components ask for it, and runs at most six requests per origin at a time.
- `loading="lazy"` with `for` defers a file until one of its tags is used.
- Identical `GET` requests from fetch attributes made at the same time are sent once.
- `realm.css` hides undefined custom elements, so nothing flashes unstyled while files load.

## Memory and cleanup

Everything a component starts is tied to its `AbortSignal`, which aborts when the element is removed (one microtask after removal, so moving an element does not trigger cleanup):

| Started by | Stopped on removal |
| --- | --- |
| `observe` in a component | The observer and its cleanup function |
| Event handlers in markup, `listen()` | The listeners, including ones on `document` and `window` |
| `debounce` timers | Pending calls are cancelled |
| Fetch attributes | In-flight requests are aborted. `poll` intervals and `visible` observers stop |
| `useChildren`, prop and attribute watchers | Their mutation observers disconnect |
| `onConnected` | The returned cleanup function runs |
| `defineMethods`, `defineProps` | The added properties and methods are removed from the element |
| Content removed by `<is-visible>`/`<is-hidden>` or a list update | All of the above for that content |

Then the shadow root is emptied, so detached elements hold no subtree.

REALM cannot clean up what you start yourself without the signal. Use the helpers instead:

```js
// Leaks: nothing removes these
window.addEventListener("resize", measure);
setInterval(refresh, 5000);

// Cleaned up on removal
listen("resize", measure, window);
observe(() => {
  const id = setInterval(refresh, 5000);
  return () => clearInterval(id);
});
fetch(url, { signal });
```

Stores are never cleaned up. They live as long as the page.

## Measuring

The runtime has memory and performance test suites in Chromium. The memory suite mounts and removes a component with observers, timers, window listeners, debounced handlers, conditions, lists and a polling fetch 1,000 times. It then forces garbage collection and checks that every instance was collected. It does the same for rows removed from keyed lists. The performance suite holds keyed list operations to time budgets.

In your app, use the browser's Performance panel and heap snapshots. Detached REALM elements should not appear in retained trees after removal.
