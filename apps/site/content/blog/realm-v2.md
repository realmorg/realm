---
title: What's new in REALM v2
description: REALM v2 replaces v1's tag language with one custom-element holding a plain JavaScript script, a style and markup, and rebuilds the runtime with tests, cleanup, forms, accessibility and a UI library.
order: 2
nav: What's new in REALM v2
---

# What's new in REALM v2

*19 October 2026*

REALM v2 is a rewrite. The idea is the same as in v1: build web components by writing HTML, with no build step. What changed is how a component describes its logic, and almost everything under the hood.

## A component is one tag with three parts

In v1, everything was a tag. Data lived in `<element-state>`, changes were `<set-state>`, clicks were `<trigger-event>` inside `<element-flow>`, requests were `<http-request>` with `<response-ok>` and `<response-fail>`, and markup sat inside a `<template>`. It proved that HTML-first components were pleasant to write, but anything slightly unusual needed deep trees of tags or a `<script type="module/realm">` escape hatch.

In v2, a component is a `<custom-element>` with a `<script>`, a `<style>` and markup:

```html
<custom-element name="counter-button">
  <script>
    const counter = useState({ count: 0 });

    function increment() {
      counter.count++;
    }
  </script>

  <style>
    button { font-weight: bold; }
  </style>

  <button onclick="increment()">Clicked <slot name="#counter.count"></slot> times</button>
</custom-element>
```

The script is plain JavaScript with a few named helpers: `defineProps` for typed attributes, `useState` for state, `observe` for side effects. Handlers are native `onclick` attributes that call script functions directly. There is still no compiler: REALM assembles each component in the browser.

## What we kept

v1's vocabulary was good, so v2 keeps it and implements it natively:

- `<slot name="#…">` and `<slot name="@…">` to show values, now real slots that add nothing to the page,
- the `_` prefix to bind attributes,
- `<is-visible>`, `<is-hidden>` and `<repeat-list>`,
- `<import-element>`,
- `var(--attr-…)` and `var(--state-…)` in CSS.

## What is new

- **Fine-grained reactivity.** Proxies with cached getters and batched updates. A change updates only the slots and bindings that read it.
- **Keyed lists.** `key="id"` reuses and moves rows, so focus and typed text survive reordering. The `repeat` attribute works inside tables and selects.
- **Requests as attributes.** `fetch`, `into`, `render`, `busy`, `trigger`, `poll` and friends, with stale requests cancelled and native `load` and `error` events.
- **Typed props.** A small zod-style builder: `prop.number().int().min(0).default(0)`. Invalid values warn and fall back instead of crashing.
- **Real form fields.** `form-associated` components submit, reset, validate and restore through `ElementInternals`.
- **Accessibility tools.** Default roles, `delegates-focus`, and an implementation of the `focusgroup` proposal for arrow-key navigation.
- **Reactive CSS states.** `:host(:state(attr-variant-is-outline))` replaces v1's regex-based CSS rewriting.
- **Stores.** `defineStore` with persistence that keeps value types.
- **REALM UI.** About sixty accessible `ui-*` components in the style of shadcn/ui, built with REALM itself. This website is built with them.

## What we fixed

An audit of v1 found 22 confirmed bugs. Some were the kind real projects hit every day:

- Two `<import-element>` tags loading the same file at the same time both fetched it and both tried to register it, throwing "already defined" inside a promise. This broke Unicons. v2 fetches each URL once and treats duplicate definitions as harmless.
- Listeners were never removed, so after a list re-rendered a click could run its action several times. Timers and observers kept running after their element was gone. In v2, everything a component starts is tied to an `AbortSignal` and stops on removal, and a memory test proves it.
- Values read back from `localStorage` came back as strings.
- HTML state was inserted without sanitising.
- Inline scripts ran through `blob:` URLs, which a Content Security Policy blocks. v2 never uses `eval`, `new Function` or `blob:` and supports nonce-based policies.
- An older, slower response could overwrite a newer one.

Every one of these has a regression test.

## How it was built

v2 was specified before it was written. Each capability has an OpenSpec specification, and every scenario in a specification is a test with the same name. The runtime keeps 100% test coverage and runs in Chromium, Firefox and WebKit on every change.

## Upgrading

The [migration guide](/docs/migrating-from-v1/) has a tag-by-tag cheat sheet. Most components move over mechanically: `<element-state>` becomes `useState`, `<trigger-event>` becomes an `on*` attribute, `<set-state>` becomes an assignment.

## Try it

- [Quick start](/docs/quick-start/)
- [Tutorial](/docs/tutorial/)
- [Components](/components/)
- [Examples](/examples/)

v2 is published as `2.0.0-alpha`. Feedback and bug reports are welcome on [GitHub](https://github.com/realmui/realm).
