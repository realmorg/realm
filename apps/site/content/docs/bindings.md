---
title: Values and bindings
description: Show values with native slots, bind attributes and properties with the _ prefix, and understand references, negation, fallback content and how values are applied.
group: Core concepts
order: 13
nav: Values and bindings
---

# Values and bindings

Markup never contains expressions. It contains **references** to values from the script or props, and REALM keeps them up to date.

## References

| Reference | Reads |
| --- | --- |
| `#todo.draft` | `draft` on the top-level script name `todo` (state, a store, a getter, any top-level `const`, `let`, `function` or import) |
| `#item.title` | A loop variable inside `repeat` or `<repeat-list>` |
| `#todo.items.length` | Any property path, including `length` |
| `@heading` | The prop `heading` from `defineProps` |
| `!#panel.open` | The negation of a reference. `!` is the only operator |

A reference is resolved in the component whose markup contains it first, then in its parent components. See [Nested components and scope](/docs/scope/). An unknown name logs a warning and shows the slot's fallback content.

Only reactive values update. A top-level `const filters = [...]` can be referenced, but changes to a plain array are not seen. Put changing values in `useState`.

## Showing values: slots

A `<slot>` whose name starts with `#` or `@` shows that value as its content:

```html
<p>Hello, <slot name="@name"></slot></p>
<p><slot name="#todo.remaining"></slot> left</p>
<p><slot name="#user.name">Guest</slot></p>
```

- The value is shown as **text**. Numbers, `0` and `false` are shown as they are.
- While the value is `""`, `null` or `undefined`, the slot shows its own children, `Guest` above. This is the native fallback content of `<slot>`.
- The slot stays a real `<slot>` inside the shadow root. Nothing is added outside the component.
- Slots without `#` or `@`, such as `<slot>` and `<slot name="footer">`, are ordinary native slots for content placed inside the component.

### HTML values

Add `html` to show the value as HTML. It is sanitised first: `<script>`, `<style>`, `<iframe>`, `<object>`, `<embed>`, `<link>`, `<meta>`, `<base>`, `<template>` and `<noscript>` are removed, along with every `on*` attribute, `srcdoc`, and `javascript:`, `vbscript:` and `data:text/html` URLs.

```html
<div><slot name="#post.body" html></slot></div>
```

`html-unsafe` inserts the value without sanitising. Only use it for HTML you produced yourself. Inserted HTML is never scanned for handlers, references or bindings.

```html live
<custom-element name="html-preview">
  <script type="realm">
    const post = useState({
      body: '<p>Some <strong>bold</strong> text and <a href="javascript:alert(1)" onclick="alert(2)">a link</a>.</p><script>alert(3)<\/script>',
    });

    function edit(field) {
      post.body = field.value;
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
      width: min(calc(var(--spacing) * 120), 100%);
    }
    .output {
      padding: calc(var(--spacing) * 3);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
    }
  </style>

  <ui-textarea aria-label="HTML source" _value="#post.body" oninput="edit(this)"></ui-textarea>
  <div class="output"><slot name="#post.body" html></slot></div>
</custom-element>

<html-preview></html-preview>
```

The `javascript:` URL, the `onclick` attribute and the `<script>` never reach the page.

### Values in SVG

A value slot inside `<svg>` is replaced with a text node, so `<text><slot name="#chart.label"></slot></text>` works.

## Binding attributes: the _ prefix

`_` followed by an attribute name binds that attribute to a reference:

```html
<a _href="#link.url">Open</a>
<section _hidden="!#panel.open">…</section>
<button _disabled="@disabled">Save</button>
<li _data-done="#item.done" _aria-selected="#item.selected">…</li>
<input _value="#form.email">
<user-card _user="#session.user"></user-card>
<div _--progress="#upload.percent"></div>
```

How each value is applied:

| Target | Rule |
| --- | --- |
| Any attribute | `true` adds it with an empty value, `false`, `null` and `undefined` remove it, anything else is written as text |
| `aria-*`, `draggable`, `spellcheck`, `contenteditable` | Booleans are written as `"true"` and `"false"` |
| `value`, `checked`, `selected`, `indeterminate` on elements that have that property | Sets the **property**, so the field's current value changes, not only its default |
| A custom element (any tag with a dash) with an object or array value | Sets the property (`_user-data` sets `userData`), so the object arrives intact |
| `--name` | Sets a CSS custom property on the element's inline style |
| SVG attributes | Case is restored for attributes such as `viewBox` |

### Changes come back through events

Bindings are one-way. To update state from a field, handle its native event:

```html
<input _value="#todo.draft" oninput="updateDraft(this)">
```

```js
function updateDraft(field) {
  todo.draft = field.value;
}
```

There is no hidden two-way binding, so it is always clear where a value is written.

### The class attribute

`_class="#theme.className"` replaces the whole `class` value. To toggle a single class, prefer a data attribute (`_data-active="#tab.active"`) and select it in CSS, or use a [reactive CSS state](/docs/styling/#reactive-states).

## References in other attributes

The same reference syntax is used by:

- `<is-visible when>` and `<is-hidden when>`: [Control flow](/docs/control-flow/)
- `repeat` and `<repeat-list of>`: [Lists and keys](/docs/lists/)
- `into`, `busy`, `headers` and `params`: [Fetching data](/docs/fetching/)

`ref="name"` is not a reference. It registers the element in the script's `refs` object.
