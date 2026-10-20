---
title: Fetching data
description: Make requests with attributes on the triggering element, load JSON into state, render server HTML, submit forms, and handle loadstart, load, error, abort, timeout and loadend.
group: Data
order: 20
nav: Fetching data
---

# Fetching data

Requests are attributes on the element that triggers them. The response goes into state (`into`) or into the page as HTML (`render`), and the element fires the browser's resource events (`load`, `error`, …) so you handle results with ordinary handlers.

Fetch attributes work on elements in a component's markup.

```html
<!-- load JSON into state when the component appears -->
<ul fetch="/api/todos" trigger="load" into="#todo.items" busy="#todo.loading">
  <li repeat="#todo.items" as="item" key="id"><slot name="#item.title"></slot></li>
</ul>

<!-- search as you type -->
<input type="search" name="q" fetch="/api/search" trigger="input" debounce="300ms" into="#search.results">

<!-- server-rendered HTML into an element -->
<button fetch="/partials/comments?page=2" render="comments" render-mode="append">Load more</button>
<div ref="comments"></div>

<!-- forms use their native action and method -->
<form action="/todos" method="post" into="#todo.items" into-mode="append" onload="clearDraft()">
  <input name="text" required>
  <button>Add</button>
</form>
```

## Loading JSON into state

This demo loads this site's search index when it appears and filters it as you type:

```html live
<custom-element name="page-finder">
  <script type="realm">
    const index = useState({
      pages: [],
      loading: false,
      query: "",
      get matches() {
        const query = this.query.trim().toLowerCase();
        return this.pages.filter((page) => page.title.toLowerCase().includes(query)).slice(0, 6);
      },
      get summary() {
        return `${this.matches.length} shown of ${this.pages.length} pages`;
      },
    });

    function search(field) {
      index.query = field.value;
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
      width: min(calc(var(--spacing) * 120), 100%);
    }
    ul {
      margin: 0;
      padding-left: calc(var(--spacing) * 5);
    }
    small {
      color: var(--muted-foreground);
    }
  </style>

  <div hidden fetch="{{root}}search-index.json" trigger="load" into="#index.pages" busy="#index.loading"></div>
  <ui-input type="search" aria-label="Filter pages" placeholder="Filter pages by title" oninput="search(this)" debounce="150ms"></ui-input>
  <is-visible when="#index.loading"><ui-spinner></ui-spinner></is-visible>
  <ul>
    <li repeat="#index.matches" as="page" key="url"><slot name="#page.title"></slot> <small><slot name="#page.section"></slot></small></li>
  </ul>
  <small><slot name="#index.summary"></slot></small>
</custom-element>

<page-finder></page-finder>
```

JSON responses (by `Content-Type`) are parsed. Anything else arrives as text.

## Refetching when state changes

A reference in `trigger` re-runs the request whenever that value changes. Here the forecast reloads as soon as a place is chosen, with no script:

```html
<form fetch="/api/forecast" trigger="change submit #place" params="lat:#place.latitude, lon:#place.longitude" into="#weather.data">
  …
</form>
```

The first value doesn't trigger a request (add `load` for that), and writes that leave the value unchanged are ignored. `debounce` and `throttle` apply.

## Updating one item in a list

After saving or deleting a record, `into-mode="update"` and `into-mode="remove"` change only that item in a list already in state:

```html
<form action="/api/contacts/7" method="put" into="#list.items" into-mode="update">…</form>
<form action="/api/contacts/7" method="delete" into="#list.items" into-mode="remove">…</form>
```

Items are matched by `id`, or by the property named in `into-key`.

## Rendering HTML

`render="name"` inserts the response into the element marked `ref="name"`. The HTML is sanitised first and never scanned for handlers or bindings. `render-select` keeps only the matching part of the response.

```html live
<custom-element name="partial-loader">
  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
      justify-items: start;
      width: min(calc(var(--spacing) * 120), 100%);
    }
    .target {
      justify-self: stretch;
      min-height: calc(var(--spacing) * 10);
      padding: calc(var(--spacing) * 3);
      border: 1px dashed var(--border);
      border-radius: var(--radius-md);
    }
  </style>

  <ui-button size="sm" fetch="{{root}}404.html" render="target" render-select=".not-found h1, .not-found p:first-of-type" render-mode="append">Append a fragment</ui-button>
  <div class="target" ref="target"></div>
</custom-element>

<partial-loader></partial-loader>
```

| `render-mode` | Effect on the target |
| --- | --- |
| `replace` (default) | Replaces its children |
| `outer` | Replaces the target itself |
| `append`, `prepend` | Adds inside, at the end or start |
| `before`, `after` | Adds next to the target |
| `merge` | Updates children in place: unchanged nodes stay, changed attributes and text are patched, and a focused element and its content are left alone, so typing is never interrupted |
| `text` | Sets the target's text, no HTML |
| `remove` | Removes the target |

A link with `render` loads the page into the target and updates the address bar with `history.pushState`:

```html
<a href="/inbox?page=2" render="main" render-select="main > *">Next page</a>
<main ref="main">…</main>
```

## Attributes

| Attribute | Meaning | Default |
| --- | --- | --- |
| `fetch="url"` | Make a request to this URL. Resolved against the page. `_fetch="#ref"` binds it | Forms use `action`, links use `href` |
| `method` | `get`, `post`, `put`, `patch` or `delete` | `get`, forms use their native `method` |
| `trigger` | Events that start the request, separated by spaces or commas. Any event name, plus `load` (when the element is connected), `visible` (when it scrolls into view) and references such as `#place` or `@city` (whenever that value changes, including nested values) | `submit` on forms, `change` on inputs, selects and textareas, `click` elsewhere |
| `debounce`, `throttle` | Delay or limit repeated triggers, such as `300ms` | |
| `poll` | Repeat on an interval while the element is on the page, such as `30s` | |
| `params` | Extra values to send: `page:#list.page, sort:@order`. Objects are sent as JSON | |
| `headers` | A reference to a headers object: `headers="#auth.headers"` | |
| `into` | A writable state path for the response, such as `#todo.items` | |
| `into-mode` | `replace`, `append`, `prepend`, `update` or `remove`. Append and prepend add to an array, wrapping single values. Update replaces items with the same `into-key` and appends new ones. Remove takes them out | `replace` |
| `into-key` | The property that identifies list items for `update` and `remove` | `id` |
| `render` | The `ref` name of the element that receives the response as HTML | |
| `render-mode` | See the table above | `replace` |
| `render-select` | A CSS selector. Only matching elements of the response are inserted | |
| `busy` | A writable state path set to `true` while the request runs and `false` after | |
| `timeout` | Abort the request after this long, firing `timeout` | |

### What is sent

- A `<form>` sends its fields as native `FormData`, including [form-associated components](/docs/forms/). The submit button's `formaction` and `formmethod` override the form's.
- An `<input>`, `<select>` or `<textarea>` sends its own `name` and value.
- `params` adds more values.
- `GET` requests put everything in the query string. Other methods send `application/x-www-form-urlencoded`, or `multipart/form-data` when the form has `enctype="multipart/form-data"` (for file uploads).

## Events

The element fires the native resource-loading event names. They do not bubble, so handle them on the element:

| Event | When | `event.detail` |
| --- | --- | --- |
| `loadstart` | Before sending. Cancelable: `return false` or `preventDefault()` stops the request | `{ url, method }` |
| `load` | After a 2xx response, once `into` and `render` are applied | `{ status, data, headers, url }` |
| `error` | A non-2xx response or a network failure. Nothing is inserted | `{ status, data, headers, url }`, or `{ status: 0, message, url }` for network errors |
| `abort` | The request was cancelled by a newer one or by removal | `{ url }` |
| `timeout` | The `timeout` elapsed | `{ url }` |
| `loadend` | Always, at the end | `{ url }` |

```html
<button fetch="/api/items/7" method="delete" onloadstart="return confirm('Delete this item?')" onload="removed(event.detail)" onerror="failed(event.detail)">Delete</button>
```

While a request runs, the element has `aria-busy="true"` and the component's host matches `:state(loading)`:

```css
:host(:state(loading)) .results {
  opacity: 0.5;
}
```

## Built-in safety

- **No stale responses.** A new request from the same element aborts the previous one, so a slow old response never overwrites a newer one. This is what makes search-as-you-type correct without extra code.
- **Shared GETs.** Identical `GET` requests (same URL and headers) in flight at the same time are sent once and shared.
- **Cleanup.** Requests, polls and `visible` observers stop when the element is removed.
- **Sanitised HTML.** `render` removes scripts, event handler attributes and unsafe URLs. See [Security](/docs/security/).

## In the script

For anything the attributes cannot express, use `fetch` with the component's `signal`, so the request is cancelled when the element is removed:

```js
async function exportReport() {
  const response = await fetch("/api/report", { method: "POST", signal });
  report.url = URL.createObjectURL(await response.blob());
}
```
