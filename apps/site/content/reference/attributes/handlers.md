---
title: on… handlers
description: on-event handler attributes in component markup and on plain pages, the names in scope, and return false.
group: Attributes
order: 21
nav: on… handlers
---

# `on…` handlers

Native-style `on<event>` attributes. Inside component markup they work for **every** event name, native or custom. On a plain page, REALM adds handler attributes and properties for the custom events its components send.

```html
<button onclick="save(item)">Save</button>
<rating-stars onrate="saveRating(event.detail.value)"></rating-stars>
```

## In component markup

The attribute value is JavaScript, compiled together with the component script (no `eval` at event time). It runs as a listener on that element.

| Name | Value |
| --- | --- |
| `event` | The event object |
| `this` | The element the attribute is on |
| Loop variables | The `as` and `index` names of every enclosing `repeat` / `<repeat-list>` |
| Script names | Every top-level name of the component script |
| Helpers | The [script helpers](/reference/script/) (`host`, `dispatch`, `refs`, …) |
| Any other name | Looked up when the handler runs: parent components first, then `globalThis` |

- Returning `false` calls `event.preventDefault()`.
- Listeners are added with the element's [`signal`](/reference/script/signal/) and removed with it.
- [`debounce` and `throttle`](/reference/attributes/debounce-throttle/) on the same element time the handler, except on elements with [fetch attributes](/reference/fetch/fetch/), where they time the request instead.
- A component compiles its handler code once per definition, not per instance.

## On a plain page

Browsers only support handler attributes for native event names. For each REALM component, REALM finds the custom events it sends and adds:

- an `on<name>` **attribute** whose value is JavaScript, compiled when the element connects and recompiled when the attribute changes, and
- an `on<name>` **property** that accepts a function (or `null`) and stays in sync with the attribute.

```html
<rating-stars onrate="console.log(event.detail.value)"></rating-stars>
<script>
  document.querySelector("rating-stars").onrate = (event) => {
    if (event.detail.value < 2) return false;
  };
</script>
```

| Detail | Behaviour |
| --- | --- |
| Event names | Read from the component script: `dispatch("name"`, `new CustomEvent("name"` and `new Event("name"` |
| Native names | Names that already have an `on…` property on `HTMLElement` (`change`, `input`, `toggle`, `close`, …) are left to the browser |
| `this` | The element |
| `return false` | Calls `preventDefault()` |
| Syntax errors | The attribute is ignored |
| Attributes set before the element was defined | Compiled when it connects |

Page handler attributes run in the page scope, so a strict Content Security Policy blocks them like any inline handler.

## Example

```html live
<custom-element name="like-button">
  <script type="realm">
    const likes = useState({ count: 0 });

    function like() {
      likes.count++;
      dispatch("like", { count: likes.count });
    }
  </script>

  <ui-button variant="outline" onclick="like()">Like (<slot name="#likes.count"></slot>)</ui-button>
</custom-element>

<like-button onlike="document.getElementById('like-log').value = 'Liked ' + event.detail.count + ' times'"></like-button>
<output id="like-log">No likes yet.</output>
```

## Related

- [Events](/docs/events/)
- [Component events](/reference/events/component-events/)
