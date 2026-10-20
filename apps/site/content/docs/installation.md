---
title: Installation
description: Add REALM to a page from a CDN or install @realmorg/realm from npm, with or without a bundler.
group: Getting started
order: 2
nav: Installation
---

# Installation

REALM is one module script and one small stylesheet. Use a CDN for plain HTML pages, or npm when your project already has a bundler.

## From a CDN

Add both lines to the `<head>`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/realm@2.0.0-alpha.0/dist/realm.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@2.0.0-alpha.0/dist/realm.js"></script>
```

`realm.js` starts REALM as soon as it loads: it defines every `<custom-element>` already in the page, watches for new ones, and registers `<import-element>`. Pin an exact version in production URLs.

`realm.css` should load before anything renders. It does three things:

- hides `<custom-element>` definitions and `<import-element>` tags,
- lays out `<is-visible>`, `<is-hidden>` and `<repeat-list>` with `display: contents`,
- hides custom elements until they are defined (`:not(:defined) { visibility: hidden }`), so a page never flashes unstyled component content.

## Adding REALM UI

The `@realmorg/ui` package is a set of ready-made `ui-*` components and a theme. Load the theme and import the bundle once per page:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/ui@2.0.0-alpha.0/theme.css">

<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@2.0.0-alpha.0/dist/ui.html"></import-element>
```

`ui.html` contains every component. You can also import single files from `components/`, for example `components/button.html`. See [Components](/components/).

## From npm

```bash
npm install @realmorg/realm
```

The package has three entry points:

| Import | What it gives you |
| --- | --- |
| `@realmorg/realm/auto` | Starts REALM when imported, and re-exports the API |
| `@realmorg/realm` | The API without starting: `start`, `useState`, `observe`, `defineStore`, `prop`, `flush`, `toRaw`, `untrack`, `importDefinitions`, `defineComponent` |
| `@realmorg/realm/realm.css` | The stylesheet described above |

In your app entry:

```js
import "@realmorg/realm/realm.css";
import "@realmorg/realm/auto";
```

Or start it yourself, for example after other setup:

```js
import { start } from "@realmorg/realm";

start();
```

`start()` is safe to call more than once.

### Component files with a bundler

Component files are HTML that REALM fetches at runtime, so they must be served as static files. With Vite, put them in `public/`:

```text
public/
  components/
    todo-app.html
index.html
src/main.js
```

```html
<import-element from="/components/todo-app.html"></import-element>
<todo-app></todo-app>
```

Shared JavaScript, such as a [store](/docs/stores/), is a normal module. Import it from a component script with a path the browser can load:

```html
<custom-element name="cart-badge">
  <script type="module">
    import { cart } from "/state/cart.js";
  </script>

  <span><slot name="#cart.items.length">0</slot></span>
</custom-element>
```

A bare specifier like `import { defineStore } from "@realmorg/realm"` inside a module that the browser loads directly needs an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap). Point it at the same file the page uses to start REALM, so there is one runtime:

```html
<script type="importmap">
  { "imports": { "@realmorg/realm": "https://cdn.jsdelivr.net/npm/@realmorg/realm@2.0.0-alpha.0/dist/realm.js" } }
</script>
```

## Serving pages

`<import-element>` loads files with `fetch`, so pages that import component files must be served over HTTP, not opened from `file://`. Any static server works:

```bash
npx serve .
```

Inline definitions (a `<custom-element>` written directly in the page) work without a server.

## Next

Continue with the [Quick start](/docs/quick-start/).
