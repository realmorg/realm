---
title: defineComponent
description: Reference for defineComponent, the low-level function that defines a component from a custom-element element you already have.
group: JavaScript API
order: 103
nav: defineComponent
---

# `defineComponent`

Defines a component from a `<custom-element>` element you already have. `start()` and `<import-element>` use it. Most pages never call it directly.

```ts
defineComponent(element: Element, base: string, inline: boolean): Promise<void>
```

```js
import { defineComponent } from "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/index.js";

const doc = new DOMParser().parseFromString(html, "text/html");
for (const definition of doc.querySelectorAll("custom-element")) {
  await defineComponent(definition, sourceUrl, false);
}
```

## Parameters

| Parameter | Type | Meaning |
| --- | --- | --- |
| `element` | `Element` | A `<custom-element>` element. It is read, not inserted. Its non-script, non-style children are moved into the definition |
| `base` | `string` | URL that relative `<link href>`, `<script src>` and `import` specifiers resolve against. Also shown in duplicate-definition warnings |
| `inline` | `boolean` | `true` for definitions that were written in the page. REALM then warns if the script is not `type="realm"` |

## Returns

A promise that resolves once the element class is registered with `customElements.define` (after the script has been assembled or loaded). It resolves without defining anything when the name has no dash, is already defined by REALM, or is owned by another library. Each of these cases logs a warning, except an identical re-definition.

## Related

- [`<custom-element>`](/reference/elements/custom-element/)
- [Component anatomy: how it works without a compiler](/docs/components/#how-it-works-without-a-compiler)
