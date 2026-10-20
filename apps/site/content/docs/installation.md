---
title: Installation
description: Add REALM and REALM UI to an HTML page with tags from the jsDelivr CDN, pin a version, and serve the page.
group: Getting started
order: 2
nav: Installation
---

# Installation

REALM loads from a CDN, so there is nothing to install or build. You need a text editor and a web browser.

## Add REALM from the CDN

Put both tags in the `<head>` of your HTML file:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"></script>
```

`realm.js` starts REALM when it loads. It defines every `<custom-element>` already in the page, watches for new ones, and registers `<import-element>`.

`realm.css` should load before anything renders. It does three things:

- hides `<custom-element>` definitions and `<import-element>` tags,
- lays out `<is-visible>`, `<is-hidden>` and `<repeat-list>` with `display: contents`,
- hides custom elements until they are defined (`:not(:defined) { visibility: hidden }`), so a page never flashes unstyled component content.

## Add REALM UI

The `@realmorg/ui` package is a set of ready-made `ui-*` components and a theme. Load the theme once per page, after REALM itself. Then import the whole kit with one line:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/theme.css">

<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/ui.html"></import-element>
```

Or import only the components you use. Each one is a file in `components/`:

```html
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/button.html"></import-element>
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/card.html"></import-element>
```

Each file brings its own dependencies. `sheet.html`, for example, imports `dialog.html` for you. See [Components](/components/).

## A complete page

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My REALM page</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/theme.css">
  <script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"></script>
</head>
<body>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/ui.html"></import-element>

  <ui-button>Hello, REALM</ui-button>
</body>
</html>
```

Save it as `index.html` and open it in your browser.

## Pin a version

`@alpha` always points at the newest alpha release. In production, pin an exact version so a new release cannot change your pages:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@2.0.0-alpha.1/dist/realm.js"></script>
```

## Sharing JavaScript between components

Shared JavaScript, such as a [store](/docs/stores/), is a plain module file. Import it from a component script with a path the browser can load:

```html
<custom-element name="cart-badge">
  <script type="module">
    import { cart } from "/state/cart.js";
  </script>

  <span><slot name="#cart.items.length">0</slot></span>
</custom-element>
```

To write `import { defineStore } from "@realmorg/realm"` in a module the browser loads directly, add an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) that points at the same file the page loads, so there is one runtime:

```html
<script type="importmap">
  { "imports": { "@realmorg/realm": "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js" } }
</script>
```

## Serving pages

A page with inline definitions (a `<custom-element>` written directly in the page) works when you open the file straight from disk.

`<import-element>` loads component files with `fetch`, so pages that import your own component files must be served over HTTP rather than opened from `file://`. Any static file server works: your editor's live preview, `python3 -m http.server`, or the static hosting you deploy to.

## Optional: Vite plugin

Load REALM from the CDN in a Vite project too. Component files are plain HTML that REALM fetches at runtime, so serve them as static files from `public/`.

The [Vite plugin](/reference/tooling/vite-plugin/) is an optional dev tool. It pre-assembles components at build time for pages under a strict Content Security Policy, and writes a `custom-elements.json` manifest for editors.

## Next

Continue with the [Quick start](/docs/quick-start/).
