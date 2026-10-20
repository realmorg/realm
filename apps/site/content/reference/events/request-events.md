---
title: Request events
description: The loadstart, load, error, abort, timeout and loadend events fired by elements with fetch attributes, with their detail objects.
group: Events
order: 80
nav: Request events
---

# Request events

Fired on the element that has the [fetch attributes](/reference/fetch/fetch/). They do **not** bubble, so handle them on that element: `onload="…"` in component markup, or `addEventListener`.

```html
<button fetch="/api/items" into="#list.items" onload="notify(event.detail.status)" onerror="fail(event.detail)">Load</button>
```

## Events

| Event | Cancelable | When | `detail` |
| --- | --- | --- | --- |
| `loadstart` | yes | Before the request is sent. `preventDefault()` (or `return false` in a handler) stops it | `{ url: string, method: string }` |
| `load` | no | A 2xx response, after `into` and `render` were applied | `{ status: number, data: unknown, headers: Headers, url: string }` |
| `error` | no | A non-2xx response | `{ status: number, data: unknown, headers: Headers, url: string }` |
| `error` | no | A network failure | `{ status: 0, data: undefined, message: string, url: string }` |
| `abort` | no | A newer request from the same element replaced this one, or the element was removed | `{ url: string }` |
| `timeout` | no | The [`timeout`](/reference/fetch/busy-timeout/) elapsed | `{ url: string }` |
| `loadend` | no | After every request that started, whatever the outcome | `{ url: string }` |

`data` is the parsed JSON when the response's `Content-Type` contains `json`, otherwise the response text. `url` in `load` and `error` is the final response URL after redirects. In the other events it is the request URL including the query string.

## Order

```text
loadstart → (load | error | abort | timeout) → loadend
```

A cancelled `loadstart` sends nothing and fires nothing else.

## Example

```html live
<custom-element name="event-log">
  <script type="realm">
    const log = useState({ lines: [] });

    function note(event) {
      log.lines.push(`${event.type}${event.detail.status ? ` ${event.detail.status}` : ""}`);
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      justify-items: start;
    }
    ol {
      margin: 0;
    }
  </style>

  <ui-button fetch="{{root}}search-index.json" onloadstart="note(event)" onload="note(event)" onloadend="note(event)">Send a request</ui-button>
  <ol><li repeat="#log.lines" as="line"><slot name="#line"></slot></li></ol>
</custom-element>

<event-log></event-log>
```

## Related

- [Fetching data: events](/docs/fetching/#events)
