---
title: REALM is dead, long live REALM
description: Why REALM v1 stopped, what changed in the REALM v2 rewrite, and how to start with it.
date: 2026-10-20
author: Ribhararnus Pracutian
nav: REALM is dead, long live REALM
---

# REALM is dead, long live REALM

*20 October 2026 · Ribhararnus Pracutian*

In June 2025 I put REALM into [maintenance mode](/blog/project-is-under-maintenance-mode/) and told anyone starting a new project to use something else. REALM is now back as v2, a rewrite. This post covers why v1 stopped, what changed, and how to start.

## Why v1 stopped

The maintenance post gave three reasons:

- Shadow DOM and the Web Component APIs kept changing across browsers. Keeping v1 working everywhere took more time than one person had.
- Good component libraries had appeared, with communities behind them.
- I no longer used REALM in anything I shipped, so I got no feedback from actual use.

There was a fourth reason I did not write down. v1 was built quickly and had no test suite. A later audit found 22 confirmed bugs, including the one that broke Unicons when a page imported many icons.

## Why v2 exists

Two things changed.

First, the platform settled. The APIs v2 depends on, such as `ElementInternals`, custom states (`:state()`), `adoptedStyleSheets` and `AbortSignal`, now behave the same in Chromium, Firefox and WebKit. v2 runs its full test suite in all three browsers on every change, so I find out when that stops being true.

Second, REALM's original goal still holds. You can build a working app with a browser, a text editor, HTML files and one script tag from a CDN. There is no npm, bundler or compiler. Most front-end tools assume a build step before anything shows on screen. REALM does not.

The design also suits code assistants. A REALM component is plain HTML with a short script, and each feature uses the platform's own names: `<slot>`, `onclick`, `fetch`, `action`, `method`. There are no template expressions or custom syntax to learn, so language models can read and write REALM code with few mistakes. The site supports this:

- [llms.txt](/llms.txt) lists every page, and [llms-full.txt](/llms-full.txt) holds the whole documentation in one file.
- Every page has a Markdown copy. Add `.md` to the address, or use the "View as Markdown" link at the bottom of each page.
- The runtime's behaviour is written down as [specifications](https://github.com/realmorg/realm/tree/main/openspec/specs). Every scenario in them is a test with the same name, so the specs and the code stay in sync.

## What changed from v1

### One tag, three parts

In v1, everything was a tag. Data lived in `<element-state>`, changes were `<set-state>`, clicks were `<trigger-event>` inside `<element-flow>`, requests were `<http-request>` with `<response-ok>` and `<response-fail>`, and markup sat inside a `<template>`. Simple components were pleasant to write, but anything unusual needed deep trees of tags.

In v2, a component is one `<custom-element>` with a `<script>`, a `<style>` and markup:

```html
<custom-element name="counter-button">
  <script type="realm">
    const counter = useState({ count: 0 });

    function increment() {
      counter.count++;
    }
  </script>

  <style type="realm">
    button { font-weight: bold; }
  </style>

  <button onclick="increment()">Clicked <slot name="#counter.count"></slot> times</button>
</custom-element>

<counter-button></counter-button>
```

The script is plain JavaScript with a few named helpers: `defineProps` for typed attributes, `useState` for state, `observe` for side effects. REALM builds each component in the browser.

### Native slots and handlers

- Values are shown with native `<slot name="#…">` and `<slot name="@…">` elements.
- Events are native `on*` attributes, such as `onclick="save(item)"`, that call functions from the script.
- Attributes are bound with v1's `_` prefix: `_href="#link.url"`.
- `<is-visible>`, `<is-hidden>` and `<repeat-list>` are still there. Lists take a `key`, so focus and typed text survive reordering, and the `repeat` attribute works inside tables and selects.

### Requests as attributes

`fetch`, `into`, `render`, `busy`, `trigger`, `poll` and a few others go on the element that starts the request. Forms use their native `action` and `method`. Stale requests are cancelled, so an older, slower response can no longer overwrite a newer one. Results fire the browser's own `load` and `error` events. See [Fetching data](/docs/fetching/).

### import-element

`<import-element from="…">` loads an HTML file and defines every component in it. In v2 each URL is fetched once, however many tags ask for it, and defining a component twice does no harm. This fixes the bug that broke Unicons. See [Importing components](/docs/importing/).

### Other changes

- **Fine-grained updates.** A change updates only the slots and bindings that read it.
- **Typed props.** `prop.number().int().min(0).default(0)`. Invalid values warn and fall back instead of crashing.
- **Form fields.** `form-associated` components submit, reset, validate and restore like built-in inputs.
- **Accessibility.** Default roles, `delegates-focus`, and arrow-key navigation through `focusgroup`.
- **Styling from state.** `:host(:state(attr-variant-is-outline))`, `var(--attr-*)` and `var(--state-*)` replace v1's regex-based CSS rewriting.
- **Stores.** `defineStore` shares state between components, with persistence that keeps value types.
- **Cleanup.** Every listener, timer, observer and request a component starts stops when the component is removed.
- **Security.** No `eval`, `new Function` or `blob:` URLs. HTML values are sanitised, and nonce-based Content Security Policies work.

### REALM UI

`@realmorg/ui` is a set of about sixty accessible `ui-*` components, such as buttons, dialogs, menus, tabs and data tables. They are written with REALM, and this website uses them. Browse them in [Components](/components/).

### Unicons v2

[Unicons](https://github.com/realmorg/unicons) is rebuilt on REALM v2. Instead of one file per icon, a single `<u-icon>` element renders any of about 50,000 icons in 31 sets, and each set loads once, only when a page uses it.

## How to start

Add two lines to any HTML page:

```html
<link rel="stylesheet" href="https://realm.js.org/dist/realm.css">
<script type="module" src="https://realm.js.org/dist/realm.js"></script>
```

Then write a `<custom-element>` in the page, or put components in their own files and load them with `<import-element>`. In production, [pin an exact version](/docs/installation/#pin-a-version) from npm.

- [Quick start](/docs/quick-start/)
- [Tutorial](/docs/tutorial/)
- [Examples](/examples/)
- [Migrating from v1](/docs/migrating-from-v1/), with a tag-by-tag cheat sheet

v2 is in alpha. Bug reports and feedback are welcome on [GitHub](https://github.com/realmorg/realm).
