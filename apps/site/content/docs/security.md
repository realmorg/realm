---
title: Security
description: What REALM treats as code and what it treats as data, how inserted HTML is sanitised, and how to run REALM under a Content Security Policy with a nonce.
group: Guides
order: 50
nav: Security
---

# Security

REALM treats some sources as code and everything else as data.

| Source | Treated as |
| --- | --- |
| Component definitions, inline or loaded with `<import-element>` | **Code**, like a `<script src>` |
| Native `on*` handler attributes in definition markup | **Code**, compiled with the component's script |
| Every other attribute in markup | **References only.** No expression is ever evaluated |
| Value slots | **Text**, unless the slot has `html` |
| HTML inserted later: `html` slots, `render` responses | **Data.** Sanitised, and never scanned for handlers, references or bindings |
| Responses loaded with `into` | **Data.** Shown as text by slots and bindings |

## Sanitising

`<slot name="#x" html>` and the `render` fetch attribute parse the HTML with `DOMParser` and remove:

- the elements `script`, `style`, `iframe`, `frame`, `frameset`, `object`, `embed`, `link`, `meta`, `base`, `template` and `noscript`,
- every attribute that starts with `on`, and `srcdoc`,
- `href`, `src`, `action`, `formaction`, `xlink:href` and `poster` values that start with `javascript:`, `vbscript:` or `data:text/html`.

The sanitiser is deliberately small. It blocks script execution, but it does not limit layout or styling attributes, and it does not stop a `<form>` in untrusted HTML from posting somewhere. For user-generated rich text, sanitise on the server with an allow-list as well.

`html-unsafe` skips sanitising. Only use it for HTML you produced yourself.

Text values are always inserted as text nodes, and attribute bindings use `setAttribute`, so state values cannot inject markup. A bound URL attribute such as `_href="#link.url"` is set as given. Validate URLs that come from users before putting them in state.

## No eval

REALM never uses `eval`, `new Function` or `blob:` URLs. Component scripts and their handlers are assembled into a script element and inserted into the page. Handler attributes on plain pages for custom events are compiled the same way.

## Content Security Policy

REALM works under a nonce-based policy. Give the page's REALM `<script>` tag a nonce. REALM copies the nonce from the first `script[nonce]` in the document onto every script it inserts:

```html
<meta http-equiv="Content-Security-Policy" content="script-src 'nonce-r4nd0m' 'strict-dynamic'; style-src 'self' 'unsafe-inline'">
<script type="module" nonce="r4nd0m" src="/realm/realm.js"></script>
```

- Send the policy as an HTTP header in production, and generate a new nonce for every response.
- `'strict-dynamic'` lets scripts loaded by trusted scripts run, which covers module imports from component scripts.
- Event handlers in component markup run through REALM, not as inline handler attributes: REALM compiles them into the component's script, so they work without `'unsafe-inline'` or `'unsafe-hashes'`. Whether the browser also logs a violation depends on where the definition is written (see below).
- Component styles are constructable stylesheets. REALM itself also sets inline `style` custom properties for `--attr-*`, `--state-*` and `_--name` bindings. Allow inline styles if you use those.

### Handler attributes and violation reports

Chrome and Firefox report a `script-src-attr` violation (a console error and a `securitypolicyviolation` event) as soon as the HTML parser puts an `on*` attribute on an element of the page. Chrome reports it for any document the page creates, including `DOMParser` documents and `<template>` contents. The handler is not blocked, because REALM never lets the browser run it, but a strict "no CSP errors" check fails.

| Definition | Violation logged? |
| --- | --- |
| Loaded with `<import-element>` | **No.** REALM renames `onclick` to `realm:onclick` in the file's text before parsing it, so no `on*` attribute ever exists |
| Written in the page (`<custom-element>` in the HTML) | **Yes, once per handler** in Chrome and Firefox. The browser parses the page before REALM runs. WebKit logs nothing |
| Written in the page with `realm:onclick="add()"` | **No.** `realm:on…` is the same handler under a name the browser does not treat as code |
| Pre-assembled with `@realmorg/vite-plugin` | **No.** The build renames handlers to `realm:on…` |
| `on*` attributes in sanitised HTML (`html` slots, `render`) | Chrome reports them while parsing. They are removed and never run |

So under a strict policy, keep definitions in files loaded with `<import-element>`, pre-assemble them, or write handlers in page definitions as `realm:on…`.

Limits:

- **Hash-only policies** (`script-src 'sha256-…'` without a nonce) cannot allow scripts that are assembled at runtime. Use a nonce.
- **Trusted Types** (`require-trusted-types-for 'script'`) is not supported yet, because REALM assigns the assembled script's text directly.

## Imported components

`<import-element from="https://…">` runs code from that origin in your page, like a `<script src>`. Only import from origins you trust, [pin exact versions](/docs/installation/#pin-a-version), and restrict them with `script-src` and `connect-src`.

## Checklist

- Keep untrusted HTML out of `html-unsafe`.
- Sanitise rich text on the server too.
- Validate user-provided URLs before binding them to `href` or `src`.
- Use a nonce-based CSP with `'strict-dynamic'`.
- Import components only from trusted, pinned sources.
