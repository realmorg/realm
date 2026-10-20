# Fetching data

Requests are attributes on the element that triggers them, in component markup. The response goes into state (`into`), into the page as HTML (`render`), or to a `load` handler. No script is needed for the common cases.

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

<!-- a form uses its own action and method -->
<form action="/api/todos" method="post" into="#todo.items" into-mode="append" onload="this.reset()">
  <input name="title" required>
  <button>Add</button>
</form>
```

## Which elements fetch

| Element | Fetches when it has | URL and method |
| --- | --- | --- |
| Any element | `fetch` | `fetch`, `method` |
| `<form>` | `fetch`, or any of `into`, `render`, `busy` | `action` and `method`, or `fetch`. A submit button's `formaction` and `formmethod` win |
| `<a>` | `fetch`, or any of `into`, `render`, `busy` | `href` |

A fetching `<form>` never submits natively and a fetching `<a>` never navigates.

## Attributes

| Attribute | Meaning | Default |
| --- | --- | --- |
| `fetch` | Request URL, resolved against the page. Bind it with `_fetch="#ref"` | form `action`, link `href` |
| `method` | `get`, `post`, `put`, `patch`, `delete` (any case) | `get` (a form's own `method`) |
| `trigger` | What sends the request (below) | `submit` on forms, `change` on inputs, selects and textareas, `click` elsewhere |
| `debounce` | Wait until triggers stop for this long | |
| `throttle` | At most one request per period | |
| `poll` | Also send every period while the element is on the page (`30s`). Does not send at once: combine with `trigger="load"` | |
| `params` | Extra fields read from state when sending: `q:#search.query, page:@page`. Objects are sent as JSON, `null`/`undefined` as `""` | |
| `headers` | A reference to a headers object, array of pairs or `Headers`: `headers="#auth.headers"` | |
| `into` | A writable state path for the response data: `#todo.items` | |
| `into-mode` | `replace`, `append`, `prepend`, `update`, `remove` | `replace` |
| `into-key` | Identity property for `update` and `remove` | `id` |
| `render` | The `ref` name of the element that receives the response as HTML | |
| `render-mode` | `replace`, `outer`, `append`, `prepend`, `before`, `after`, `merge`, `text`, `remove` | `replace` |
| `render-select` | CSS selector: insert only the matching parts of the response | |
| `busy` | A writable state path set to `true` while a request runs, `false` after | |
| `timeout` | Abort after this long and fire `timeout` (`10s`) | |

Durations accept `300`, `300ms`, `1.5s`, `2m`.

## trigger

A list separated by spaces or commas. Setting `trigger` replaces the default.

| Trigger | Sends | Timed by `debounce`/`throttle` |
| --- | --- | --- |
| an event name (`click`, `input`, `submit`, `mouseenter`, …) | when that event fires on the element | yes |
| `load` | once, right after the element is set up | no |
| `visible` | each time the element scrolls into view | no |
| `#state.path`, `@prop` | whenever that value changes (compared as JSON, nested values included). Not on the first read | yes |

```html
<!-- load once, then refetch whenever the filter changes -->
<section fetch="/api/items" trigger="load, #filters.category" params="category:#filters.category" into="#list.items"></section>

<!-- refresh a feed every 30 seconds -->
<div fetch="/api/feed" trigger="load" poll="30s" into="#feed.items"></div>
```

## What is sent

| Source | Fields |
| --- | --- |
| `<form>` | `new FormData(form, submitter)`, including form-associated components such as `ui-input` |
| `<input>`, `<select>`, `<textarea>` with a `name` | that one field |
| any element | the `params` fields, appended last |

`GET` puts the fields in the query string, and identical `GET`s in flight at the same time (same URL and headers) share one request. Other methods send `application/x-www-form-urlencoded`, or `multipart/form-data` when the form has `enctype="multipart/form-data"` (file uploads). Pending state changes are applied before the request is built, so a handler that changes state in the same event is seen.

## The response

`data` is the parsed JSON when the `Content-Type` contains `json`, otherwise the text. On a 2xx response, `into` is applied, then `render`, then `load` fires. Any other status fires `error` and changes nothing.

### into modes

For every mode except `replace`, the current value is treated as a list (`[]` if it is not an array) and `data` as a list of items (a single value becomes one item).

| `into-mode` | New value |
| --- | --- |
| `replace` | `data` |
| `append` | current items, then the new ones |
| `prepend` | the new items, then current ones |
| `update` | items whose `into-key` matches a new item are replaced in place. New items without a match are appended |
| `remove` | items whose `into-key` matches a new item are removed |

```html
<!-- after saving, replace that contact in the list -->
<form action="/api/contacts/7" method="put" into="#list.items" into-mode="update">…</form>

<!-- the server answers a delete with the removed record -->
<button fetch="/api/contacts/7" method="delete" into="#list.items" into-mode="remove">Delete</button>
```

The write replaces the array, so a `key` on the list keeps the unchanged rows. `into` and `busy` must be writable paths: `#list.items` works, `#list`, `@items` and `!#x` do not.

### render modes

`render` parses the response, sanitises it (no scripts, `on*` attributes or `javascript:` URLs) and inserts it into the element with that `ref`. Inserted HTML is never scanned for references or handlers, but custom elements in it upgrade.

| `render-mode` | Effect on the target |
| --- | --- |
| `replace` | Replaces its children |
| `outer` | Replaces the target itself |
| `append`, `prepend` | Adds inside, at the end or start |
| `before`, `after` | Adds next to the target |
| `merge` | Patches children in place: unchanged nodes stay, a focused element is left alone |
| `text` | Sets the raw text, no HTML |
| `remove` | Removes the target |

An `<a>` with `render` also updates the address bar with `history.pushState`:

```html
<a href="/inbox?page=2" render="main" render-select="main > *">Next page</a>
<main ref="main">…</main>
```

## Events

Fired on the fetching element. They do **not** bubble, so handle them on that element.

| Event | When | `event.detail` |
| --- | --- | --- |
| `loadstart` | Before sending. Cancelable: `return false` stops the request | `{ url, method }` |
| `load` | 2xx, after `into` and `render` | `{ status, data, headers, url }` |
| `error` | Non-2xx | `{ status, data, headers, url }` |
| `error` | Network failure | `{ status: 0, data: undefined, message, url }` |
| `abort` | Replaced by a newer request from the same element, or the element was removed | `{ url }` |
| `timeout` | `timeout` elapsed | `{ url }` |
| `loadend` | After every request that started | `{ url }` |

```html
<button fetch="/api/items/7" method="delete" into="#list.items" into-mode="remove"
  onloadstart="return confirm('Delete this item?')"
  onload="removed(event.detail)"
  onerror="failed(event.detail)">Delete</button>
```

## Loading states

- `busy="#list.loading"` is `true` while a request runs. With overlapping requests it stays `true` until the latest ends.
- The element gets `aria-busy="true"` while its request runs.
- The component's host matches `:state(loading)` while any of its fetch attributes run:

```css
:host(:state(loading)) .results {
  opacity: 0.5;
}
```

## Built-in safety

- A new request from the same element aborts the previous one, so a slow old response never overwrites a newer one. Search-as-you-type is correct with no extra code.
- Requests, polls and `visible` observers stop when the element is removed.
- `render` sanitises HTML. Data from `into` is shown as text by slots and bindings.

## In the script

For anything the attributes cannot express, use `fetch` with the component's `signal` so it is cancelled on removal:

```js
async function exportReport() {
  const response = await fetch("/api/report", { method: "POST", signal });
  report.url = URL.createObjectURL(await response.blob());
}
```
