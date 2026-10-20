---
title: "<import-element>"
description: The import-element tag, which loads an HTML file of component definitions, with its attributes and events.
group: Elements
order: 11
nav: "<import-element>"
---

# `<import-element>`

Loads an HTML file and defines every `<custom-element>` in it. Works in a page and inside component markup. `realm.css` hides it.

```html
<import-element from="URL" [loading="lazy" for="tag-a tag-b"]></import-element>
```

```html
<import-element from="components/todo-app.html"></import-element>
<todo-app></todo-app>
```

## Attributes

| Attribute | Type | Default | Meaning |
| --- | --- | --- | --- |
| `from` | URL | required | File to load, resolved against the element's base URL (the page). Without it REALM warns and does nothing |
| `loading` | `lazy` | eager | With `lazy`, wait until one of the tags in `for` appears in the page or in a component's markup |
| `for` | space-separated tag names | none | The tags the file defines. Required for `loading="lazy"`. Without it the import starts at once with a warning |

The attributes are read once, when the element first connects. Reconnecting does not import again.

## Events

Fired on the `<import-element>`. They do not bubble. See [Import events](/reference/events/import-events/).

| Event | `detail` | When |
| --- | --- | --- |
| `load` | `{ url: string }` | Every definition in the file is defined |
| `error` | `{ url: string, status: number }` | The file could not be loaded. `status` is `0` for network errors |

Neither fires if the element was removed before the file arrived. Handle them with `onload` / `onerror` attributes or `addEventListener`.

## Behaviour

- Each URL is fetched once per page. Several `<import-element>` tags, or [`importDefinitions`](/reference/javascript/import-definitions/) calls, for the same file share one request.
- At most six imports per origin load at once. The rest wait in order.
- The file is parsed as an HTML document, never executed. Only its `<custom-element>` elements are used. Other content is ignored.
- Relative URLs inside definitions (`<link rel="stylesheet">`, `import` in scripts) resolve against the imported file, not the page.
- Files must be served over HTTP. `file://` pages cannot fetch them.

## Example: lazy loading and the load event

```html live
<import-element from="{{root}}examples/todo/todo-app.html" loading="lazy" for="todo-app" onload="document.getElementById('lazy-status').value = 'Loaded ' + event.detail.url"></import-element>

<ui-button onclick="document.getElementById('lazy-target').replaceChildren(document.createElement('todo-app'))">Show a todo-app</ui-button>
<p><output id="lazy-status">todo-app.html is not loaded yet.</output></p>
<div id="lazy-target"></div>
```

`todo-app.html` is fetched only when the button adds a `<todo-app>` to the page. `onload` is a native handler attribute, so it works on a plain page.

## Related

- [Importing components](/docs/importing/)
- [Installation](/docs/installation/)
