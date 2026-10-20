---
title: Introduction
description: What REALM is, how a component is written, and the ideas behind it.
group: Getting started
order: 1
nav: Introduction
---

# Introduction

REALM is a small runtime for building native web components in HTML. A component is a single `<custom-element>` tag that holds three things: a `<script>` with plain JavaScript, a `<style>`, and markup. REALM turns it into a custom element with a shadow root. There is no compiler, no virtual DOM and no build step.

```html live stacked
<custom-element name="hello-card">
  <script type="realm">
    const props = defineProps({ name: prop.string().default("world") });
    const greeting = useState({ count: 0 });

    function wave() {
      greeting.count++;
    }
  </script>

  <style>
    :host {
      display: block;
    }
  </style>

  <p>Hello, <slot name="@name"></slot>!</p>
  <button onclick="wave()">Waved <slot name="#greeting.count"></slot> times</button>
</custom-element>

<hello-card name="Ana"></hello-card>
```

In this example:

- `defineProps` declares typed attributes. `useState` creates reactive state.
- `<slot name="#greeting.count">` shows a state value. `<slot name="@name">` shows a prop.
- `onclick="wave()"` is a native event handler. It can call functions from the component's script directly.
- The `<style>` is scoped to the component through shadow DOM.

## Why REALM

- REALM uses platform features under their native names: `<slot>` to show content, `on*` attributes for events, `dispatchEvent` to emit them, `ElementInternals` for forms and `:state()` for styling. What you know from plain HTML applies here.
- Markup has no expressions. Attributes and slots hold references such as `#todo.remaining` or `@heading`. Formatting, comparisons and combinations go in the script, usually as getters. The only code in markup is native event handlers, as in plain HTML.
- There is no build step. A page loads one module script from a CDN. Components live inline in the page or in their own `.html` files loaded with `<import-element>`.
- The runtime is about 15 KB gzipped. Updates are batched per microtask and only touch the slots and attributes that read the changed value. Everything a component starts stops when it is removed.

## What REALM is not

- It is not a server framework. It does not render on the server, and pages are not prerendered. See [Modern framework problems](/docs/framework-problems/) for what that means for SEO and first paint.
- It does not compile templates. Plain `let count = 0` does not update the page. Only values from `useState`, `defineProps` and stores do.
- It is not a JavaScript component API. Components are always defined with `<custom-element>`.

## Where to go next

- [Installation](/docs/installation/): two tags from the CDN.
- [Quick start](/docs/quick-start/): a working page in five minutes.
- [Tutorial](/docs/tutorial/): build a reading list app step by step.
- [Component anatomy](/docs/components/): the rules behind the three parts.
- [Components](/components/): REALM UI, a set of about sixty ready-made `ui-*` components.
