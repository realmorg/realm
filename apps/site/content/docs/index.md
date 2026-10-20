---
title: Introduction
description: What REALM is, how a component is written, and the ideas behind it.
group: Getting started
order: 1
nav: Introduction
---

# Introduction

REALM is a small runtime for building native web components in HTML. A component is a single `<custom-element>` tag that holds three things: a `<script>` with plain JavaScript, a `<style>`, and markup. REALM turns it into a real custom element with a shadow root. There is no compiler, no virtual DOM and no build step.

```html
<custom-element name="hello-card">
  <script>
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

That is the whole model:

- `defineProps` declares typed attributes. `useState` creates reactive state.
- `<slot name="#greeting.count">` shows a state value. `<slot name="@name">` shows a prop.
- `onclick="wave()"` is a native event handler. It can call functions from the component's script directly.
- The `<style>` is scoped to the component through shadow DOM.

## Why REALM

**Native HTML first.** If the platform has a feature, REALM uses it under its native name: `<slot>` to show content, `on*` attributes for events, `dispatchEvent` to emit them, `ElementInternals` for forms, `:state()` for styling. What you learn carries over to plain HTML and back.

**No expressions in markup.** Attributes and slots hold references such as `#todo.remaining` or `@heading`, never calculations. Formatting, comparisons and combinations live in the script, usually as getters. The only code in markup is native event handlers, exactly as in plain HTML.

**No toolchain.** A page loads one module script. Components can live inline in the page or in their own `.html` files loaded with `<import-element>`. You can still use npm and a bundler for the rest of your app.

**Small and predictable.** The runtime is about 15 KB gzipped. Updates are batched per microtask and only touch the slots and attributes that read the changed value. Everything a component starts stops when it is removed.

## What REALM is not

- It is not a server framework. It does not render on the server, and pages are not prerendered. See [Modern framework problems](/docs/framework-problems/) for what that means for SEO and first paint.
- It does not compile templates. Plain `let count = 0` does not update the page; only values from `useState`, `defineProps` and stores do.
- It is not a JavaScript component API. Components are always defined with `<custom-element>`.

## Where to go next

- [Installation](/docs/installation/): CDN or npm.
- [Quick start](/docs/quick-start/): a working page in five minutes.
- [Tutorial](/docs/tutorial/): build a reading list app step by step.
- [Component anatomy](/docs/components/): the rules behind the three parts.
- [Components](/components/): REALM UI, a set of about sixty ready-made `ui-*` components.
