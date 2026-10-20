---
title: Import events
description: The load and error events fired by import-element, with their detail objects.
group: Events
order: 81
nav: Import events
---

# Import events

Fired on [`<import-element>`](/reference/elements/import-element/). They do not bubble.

| Event | When | `detail` |
| --- | --- | --- |
| `load` | Every `<custom-element>` in the file has been defined | `{ url: string }` |
| `error` | The file could not be fetched (non-2xx or network failure) | `{ url: string, status: number }` |

- `url` is the absolute URL of the file.
- `status` is the HTTP status, or `0` for a network error.
- Neither event fires if the element was removed before the file arrived.
- A failure also logs `Could not import URL (HTTP status)`.

```html
<import-element from="/components/charts.html" onload="console.log('ready', event.detail.url)" onerror="showFallback(event.detail.status)"></import-element>
```

`onload` and `onerror` are native handler attributes, so they work on a plain page too.

See the live example on [`<import-element>`](/reference/elements/import-element/#example-lazy-loading-and-the-load-event).

## Related

- [Importing components: events](/docs/importing/#events)
