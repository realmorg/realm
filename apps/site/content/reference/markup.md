---
title: Tags and attributes
description: Reference for every REALM tag and markup attribute, including custom-element, import-element, is-visible, is-hidden, repeat-list, value slots, bindings, handlers and fetch attributes.
group: Reference
order: 3
nav: Tags and attributes
---

# Tags and attributes

## References

Wherever an attribute takes a reference, it has this form:

| Form | Meaning |
| --- | --- |
| `#name.path.to.value` | A top-level script name, or a loop variable, followed by a property path |
| `@prop` | A prop declared with `defineProps` (a path may follow: `@user.name`) |
| `!#…`, `!@…` | Negation |

Names resolve in loop variables, then the owning component, then parent components. `into` and `busy` need a writable path with at least one property (`#todo.items`, not `#todo`).

## Tags

### custom-element

Defines a component. Hidden by `realm.css`.

| Attribute | Value | Meaning |
| --- | --- | --- |
| `name` | tag name with a dash | Required |
| `form-associated` | boolean | Make the element a form field |
| `role` | ARIA role | Default role, set through `ElementInternals` |
| `delegates-focus` | boolean | Shadow root with `delegatesFocus` |

Children: at most one `<script>`; any number of `<style>` and `<link rel="stylesheet">`; everything else is markup. In a page, use `<script type="realm">` and `<style type="realm">`.

### import-element

Loads a file of definitions.

| Attribute | Value | Meaning |
| --- | --- | --- |
| `from` | URL | File to load, resolved against the page. Required |
| `loading` | `lazy` | Wait until a tag in `for` is used |
| `for` | space-separated tag names | Tags that trigger a lazy import |

Events: `load` (`detail: { url }`), `error` (`detail: { url, status }`).

### is-visible and is-hidden

Mount their content while the condition is true (`is-visible`) or false (`is-hidden`). `display: contents`.

| Attribute | Meaning |
| --- | --- |
| `when` | Reference to test. Required |
| `eq`, `neq` | Compare as strings |
| `gt`, `gte`, `lt`, `lte` | Compare as numbers |
| `contains` | Array has an equal item, or string includes the text |

At most one comparison attribute is used.

### repeat-list

Repeats its content for each item of an array. `display: contents`.

| Attribute | Meaning | Default |
| --- | --- | --- |
| `of` | Reference to an array. Required | |
| `as` | Item variable name | `item` |
| `index` | Index variable name | none |
| `key` | Item property used as identity | position |

### Value slots

A `<slot>` whose `name` is a reference shows the value. Its children are shown while the value is `""`, `null` or `undefined`.

| Attribute | Meaning |
| --- | --- |
| `html` | Show the value as sanitised HTML |
| `html-unsafe` | Show the value as HTML without sanitising |

## Markup attributes

| Attribute | On | Meaning |
| --- | --- | --- |
| `_name="#ref"` | any element | Bind attribute or property `name` to a reference. See [Values and bindings](/docs/bindings/) for how values are applied |
| `_--name="#ref"` | any element | Bind a CSS custom property |
| `on<event>="code"` | any element in component markup | Native-style handler. Runs with `event`, `this`, loop variables, and the script's names in scope. `return false` cancels |
| `debounce="300ms"` | element with handlers or fetch | Delay handlers until events stop for this long |
| `throttle="100ms"` | element with handlers or fetch | Run handlers at most once per period |
| `ref="name"` | any element | Register the element in `refs.name`. `ref="control"` in a form-associated component delegates to that control |
| `repeat="#ref"` | any element | Repeat this element per item. Takes `as`, `index` and `key` like `<repeat-list>` |
| `focusgroup="kind [inline\|block] [wrap]"` | container | Arrow-key focus navigation among focusable descendants. See [Accessibility](/docs/accessibility/) |

Durations are a number with an optional unit: `ms` (default), `s` or `m`.

## Fetch attributes

On any element in component markup. A `<form>` or `<a>` also activates with `into`, `render` or `busy` alone, using its `action`/`method` or `href`.

| Attribute | Value | Default |
| --- | --- | --- |
| `fetch` | URL | form `action`, link `href` |
| `method` | `get`, `post`, `put`, `patch`, `delete` | `get`, or the form's `method` |
| `trigger` | event names, `load`, `visible`, references (`#state.path`, `@prop`); space or comma separated | `submit` (form), `change` (input, select, textarea), `click` |
| `debounce`, `throttle` | duration | |
| `poll` | duration | |
| `params` | `name:#ref, name:@prop` | |
| `headers` | reference to an object of headers | |
| `into` | writable reference | |
| `into-mode` | `replace`, `append`, `prepend`, `update`, `remove` | `replace` |
| `into-key` | property matching list items for `update` and `remove` | `id` |
| `render` | a `ref` name | |
| `render-mode` | `replace`, `outer`, `append`, `prepend`, `before`, `after`, `merge`, `text`, `remove` | `replace` |
| `render-select` | CSS selector | |
| `busy` | writable reference | |
| `timeout` | duration | |

Submit buttons' `formaction` and `formmethod` override a form's. See [Fetching data](/docs/fetching/).

## Page-level handler attributes

On a plain page, a REALM element's `on<name>` attribute for a custom event holds JavaScript and stays in sync with the `on<name>` property, as native handlers do. The names come from `new CustomEvent("name"` and `new Event("name"` in the component's script. See [Events](/docs/events/#on-a-plain-page).
