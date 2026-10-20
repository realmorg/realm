---
title: Value slots
description: Slot elements whose name is a reference (#state.path or @prop), with text, html and html-unsafe modes, fallback content and SVG.
group: Elements
order: 15
nav: <slot name="#…">
---

# Value slots

A native `<slot>` whose `name` is a [reference](/reference/syntax/) shows that value. It stays a `<slot>` element in the shadow root and updates when the value changes.

```html
<slot name="#state.path" [html | html-unsafe]>fallback</slot>
<slot name="@prop">fallback</slot>
<slot name="!#state.flag"></slot>
```

A slot whose name does not start with `#`, `@` or `!` (`<slot>`, `<slot name="footer">`) is an ordinary slot for light DOM content.

## Attributes

| Attribute | Type | Default | Meaning |
| --- | --- | --- | --- |
| `name` | reference | required | The value to show |
| `html` | boolean | absent | Show the value as sanitised HTML |
| `html-unsafe` | boolean | absent | Show the value as HTML without sanitising. Only for HTML you produced yourself |

When both are present, `html-unsafe` wins.

## Modes

| Mode | How the value is shown |
| --- | --- |
| text (default) | `String(value)` as a text node. `0`, `false` and numbers are shown as they are |
| `html` | Parsed and cleaned, then inserted. Removed: `<script>`, `<style>`, `<iframe>`, `<frame>`, `<frameset>`, `<object>`, `<embed>`, `<link>`, `<meta>`, `<base>`, `<template>`, `<noscript>`, every `on*` attribute, `srcdoc`, and `javascript:`, `vbscript:` and `data:text/html` URLs in `href`, `src`, `action`, `formaction`, `xlink:href`, `poster`, `to`, `from` and `values` |
| `html-unsafe` | Assigned to `innerHTML` as is |

Inserted HTML is never scanned for references, bindings or handlers.

## Fallback

While the value is `""`, `null` or `undefined`, the slot shows its own children, the same as native slot fallback content:

```html
<p>Signed in as <slot name="#user.name">guest</slot></p>
```

## Inside SVG

A text-mode value slot inside `<svg>` is replaced with a text node, so `<text><slot name="#chart.label"></slot></text>` works. With `html` or `html-unsafe`, the slot becomes a `<g>` holding the parsed SVG elements (sanitised for `html`).

## Example

```html live
<custom-element name="greeting-card">
  <script type="realm">
    const props = defineProps({ name: prop.string() });
    const note = useState({ body: "<em>Welcome</em> back. <a href='javascript:alert(1)' onclick='alert(2)'>Unsafe link</a>" });
  </script>

  <p>Hello, <slot name="@name">stranger</slot>.</p>
  <p><slot name="#note.body" html></slot></p>
  <p><code><slot name="#note.body"></slot></code></p>
</custom-element>

<greeting-card name="Ada"></greeting-card>
<greeting-card></greeting-card>
```

## Related

- [Values and bindings](/docs/bindings/)
- [Security](/docs/security/)
