---
title: start
description: Reference for start, which adopts REALM's page stylesheet, registers import-element, defines every inline custom-element and watches for new ones.
group: JavaScript API
order: 101
nav: start
---

# `start`

Starts REALM in the current document. `realm.js` calls it for you.

```ts
start(): void
```

```html
<script type="module">
  import { start } from "https://realm.js.org/dist/index.js";

  start();
</script>
```

## What it does

1. Adopts a page stylesheet: `custom-element, import-element { display: none !important }` and `is-visible, is-hidden, repeat-list { display: contents }`.
2. Registers `<import-element>`, unless something already defined that name.
3. Defines every `<custom-element>` in the document and removes it from the page.
4. Watches the document with a `MutationObserver`: `<custom-element>` elements added later are defined too, and custom tags are noticed for [lazy imports](/reference/elements/import-element/#example-lazy-loading-and-the-load-event).

Inline definitions are resolved against `document.baseURI`.

## Notes

- Safe to call more than once. Later calls do nothing.
- Takes no arguments and returns nothing. Definitions are created asynchronously, and elements upgrade as their definitions arrive.

## Related

- [Installation: from a CDN](/docs/installation/#add-realm-from-the-cdn)
