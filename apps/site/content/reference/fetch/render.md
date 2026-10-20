---
title: render, render-mode and render-select
description: render, which inserts a response as sanitised HTML into a ref, with render-mode and render-select.
group: Fetch attributes
order: 33
nav: render, render-mode, render-select
---

# `render`, `render-mode` and `render-select`

Insert a successful response into an element named with [`ref`](/reference/attributes/ref/). The response text is parsed as HTML and sanitised first.

```html
<a href="/articles/2" render="article">Next article</a>
<article ref="article"></article>

<button fetch="/fragments/comments" render="comments" render-mode="append" render-select=".comment">More</button>
<div ref="comments"></div>
```

## Attributes

| Attribute | Type | Default | Meaning |
| --- | --- | --- | --- |
| `render` | a `ref` name in the same component | none | The target. If no element has that ref, REALM warns |
| `render-mode` | see below | `replace` | Where the HTML goes |
| `render-select` | CSS selector | none | Keep only the elements of the response that match |

## Modes

| `render-mode` | Effect on the target |
| --- | --- |
| `replace` | Replaces its children |
| `outer` | Replaces the target itself |
| `append` | Adds after its last child |
| `prepend` | Adds before its first child |
| `before` | Inserts before the target |
| `after` | Inserts after the target |
| `merge` | Updates its children in place: matching nodes keep their identity, attributes and text are patched, extra nodes are removed, new ones appended. A focused element is left alone |
| `text` | Sets `textContent` to the raw response text (not parsed) |
| `remove` | Removes the target. The response body is ignored |

An unknown mode warns and uses `replace`.

## Sanitising

The parsed HTML has `<script>`, `<style>`, `<iframe>`, `<frame>`, `<frameset>`, `<object>`, `<embed>`, `<link>`, `<meta>`, `<base>`, `<template>` and `<noscript>` removed, along with every `on*` attribute, `srcdoc`, and `javascript:`, `vbscript:` and `data:text/html` URLs. Inserted HTML is not scanned for REALM references, bindings or handlers. Custom elements in it upgrade as usual.

## Links

When an `<a>` with `render` loads, the address bar is updated with `history.pushState` to the request URL.

## Example

```html live
<custom-element name="fragment-loader">
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

  <ui-button fetch="{{root}}404.html" render="target" render-select=".not-found h1" render-mode="append">Append the 404 heading</ui-button>
  <div class="target" ref="target"></div>
</custom-element>

<fragment-loader></fragment-loader>
```

## Related

- [Fetching data: rendering HTML](/docs/fetching/#rendering-html)
- [Security](/docs/security/)
