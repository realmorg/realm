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
- The runtime is about 16 KB gzipped. Updates are batched per microtask and only touch the slots and attributes that read the changed value. Everything a component starts stops when it is removed.

## What REALM is not

- It is not a server framework. It does not render on the server, and pages are not prerendered. See [Modern framework problems](/docs/framework-problems/) for what that means for SEO and first paint.
- It does not compile templates. Plain `let count = 0` does not update the page. Only values from `useState`, `defineProps` and stores do.
- It is not a JavaScript component API. Components are always defined with `<custom-element>`.

## Frequently asked questions

<ui-accordion type="multiple" class="faq">
  <ui-accordion-item>
    <ui-accordion-trigger>What is REALM?</ui-accordion-trigger>
    <ui-accordion-content>REALM is an open source framework for writing web components in plain HTML. Each component is one <code>&lt;custom-element&gt;</code> tag with a script, a style and markup, and REALM turns it into a native custom element in the browser. It needs no compiler and no build step: a page loads one script and the components work.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Is REALM free?</ui-accordion-trigger>
    <ui-accordion-content>Yes. REALM, the REALM UI component library and the Unicons icon component are free and open source under the MIT licence, including for commercial projects.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Does REALM need a build step?</ui-accordion-trigger>
    <ui-accordion-content>No. A page loads REALM with one <code>&lt;script type="module"&gt;</code> tag, and components are written inline or loaded from <code>.html</code> files with <code>&lt;import-element&gt;</code>. A <a href="/reference/tooling/vite-plugin/">Vite plugin</a> is available for sites that want components assembled at build time, for example to run under a strict Content Security Policy.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>How big is REALM?</ui-accordion-trigger>
    <ui-accordion-content>The runtime is about 16 KB gzipped. CI fails any change that takes it to 17 KB or more.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Which browsers does REALM support?</ui-accordion-trigger>
    <ui-accordion-content>Current Chrome, Edge, Firefox and Safari: Chrome and Edge 125, Firefox 126 and Safari 17.4 or newer, on desktop and iOS. Every test runs in Chromium, Firefox and WebKit. See <a href="/docs/browser-support/">Browser support</a>.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Can I use REALM with React, Vue, Rails or Django?</ui-accordion-trigger>
    <ui-accordion-content>Yes. A REALM component is a standard custom element, so it works anywhere HTML does: in pages rendered by Rails, Django, Laravel or any other server, and inside apps built with React, Vue or other frameworks that support custom elements.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Is REALM good for SEO?</ui-accordion-trigger>
    <ui-accordion-content>Content you write inside a component's tags stays in the page's HTML, where search engines can read it. Content a component creates in its shadow root is rendered with JavaScript, so only crawlers that run JavaScript see it. REALM has no server-side rendering yet. See <a href="/docs/framework-problems/">Modern framework problems</a>.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>How is REALM different from Lit?</ui-accordion-trigger>
    <ui-accordion-content>Lit components are JavaScript classes with templates written in JavaScript. REALM components are written in HTML, with logic in a plain script and no JavaScript definition API. Markup in REALM holds references to values, never expressions.</ui-accordion-content>
  </ui-accordion-item>
</ui-accordion>

## Where to go next

- [Installation](/docs/installation/): two tags from the CDN.
- [Quick start](/docs/quick-start/): a working page in five minutes.
- [Tutorial](/docs/tutorial/): build a reading list app step by step.
- [Component anatomy](/docs/components/): the rules behind the three parts.
- [Components](/components/): REALM UI, a set of about sixty ready-made `ui-*` components.
