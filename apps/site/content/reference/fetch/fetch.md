---
title: fetch, method, params and headers
description: The fetch, method, params and headers attributes, which elements send requests, and what each request sends.
group: Fetch attributes
order: 30
nav: fetch, method, params, headers
---

# `fetch`, `method`, `params` and `headers`

Any element in component markup can send a request with attributes alone. The response goes [into state](/reference/fetch/into/), is [rendered as HTML](/reference/fetch/render/), or is handled in a [`load` event](/reference/events/request-events/).

```html
<button fetch="/api/items" into="#list.items">Load</button>
<form fetch="/api/items" method="post" into="#list.items" into-mode="append">…</form>
<a href="/page/2" render="content">Next</a>
```

## Which elements fetch

| Element | Becomes a fetch element when it has |
| --- | --- |
| Any element | `fetch` |
| `<form>` | `fetch`, or any of `into`, `render`, `busy` (uses `action` and the form's `method`) |
| `<a>` | `fetch`, or any of `into`, `render`, `busy` (uses `href`) |

A fetch `<form>` never submits natively and a fetch `<a>` never navigates. Their `submit` and `click` default actions are always prevented.

## Attributes

| Attribute | Type | Default | Meaning |
| --- | --- | --- | --- |
| `fetch` | URL | form `action`, link `href` | Request URL, resolved against the element's base URL |
| `method` | `get`, `post`, `put`, `patch`, `delete` (any case) | `get` | HTTP method. On a `<form>` this is the form's own `method` attribute |
| `params` | `name:#ref, name:@prop, …` | none | Extra fields read from state when the request is sent |
| `headers` | [reference](/reference/syntax/) to a headers object | none | Request headers (`Record<string, string>`, an array of pairs, or `Headers`) |

A submit button's `formaction` and `formmethod` override the form's URL and method. Other request attributes are [`trigger` and `poll`](/reference/fetch/trigger/), [`debounce` and `throttle`](/reference/attributes/debounce-throttle/), and [`busy` and `timeout`](/reference/fetch/busy-timeout/).

### params

A comma-separated list of `name:reference` pairs. Each value is read when the request is sent. Objects and arrays are sent as JSON text, `null` and `undefined` as `""`.

```html
<button fetch="/api/search" params="q:#search.query, page:#search.page" into="#search.results">Search</button>
```

### headers

```js
const auth = useState({ headers: { Authorization: "Bearer …" } });
```

```html
<button fetch="/api/me" headers="#auth.headers" into="#user.profile">Load profile</button>
```

## What is sent

| Source | Fields |
| --- | --- |
| `<form>` | `new FormData(form, submitter)`, so the clicked submit button's `name` and `value` are included |
| `<input>`, `<select>`, `<textarea>` with a `name` | That one field |
| Any element | The `params` fields, appended last |

| Method | Body |
| --- | --- |
| `GET` | Fields are appended to the URL query string. Identical GET requests (same URL and headers) that are in flight at the same time share one network request |
| Others | `application/x-www-form-urlencoded`, or `multipart/form-data` when the form has `enctype="multipart/form-data"` |

Pending state updates are applied before the request is built, so a handler that changes a field in the same event is seen by the request.

## Response

| Response | Result |
| --- | --- |
| `Content-Type` contains `json` | `data` is the parsed JSON (the text if parsing fails) |
| Anything else | `data` is the text |
| 2xx | `into` and `render` are applied, then `load` fires |
| Other status | `error` fires. `into` and `render` are not applied |

A new request from the same element aborts the previous one (`abort` fires). Removing the element aborts its requests. While any request in a component runs, its host matches [`:state(loading)`](/reference/css/states/#loading), and the element has `aria-busy="true"`.

## Example

```html live
<custom-element name="page-count">
  <script type="realm">
    const site = useState({ pages: [], status: "" });

    function done(event) {
      site.status = `${event.detail.status}, ${site.pages.length} pages`;
    }
  </script>

  <style type="realm">
    :host {
      display: flex;
      gap: calc(var(--spacing) * 3);
      align-items: center;
    }
  </style>

  <ui-button fetch="{{root}}search-index.json" into="#site.pages" onload="done(event)">Load the search index</ui-button>
  <output><slot name="#site.status">Not loaded</slot></output>
</custom-element>

<page-count></page-count>
```

## Related

- [Fetching data](/docs/fetching/)
- [Request events](/reference/events/request-events/)
- [Security](/docs/security/)
