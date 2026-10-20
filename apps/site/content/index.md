---
title: REALM
description: REALM builds native web components with one HTML tag. A component is a custom-element holding a script, a style and markup. No compiler and no build step.
layout: home
---


<section class="hero">
  <realm-logo size="48"></realm-logo>
  <h1>Native web components, written in plain HTML</h1>
  <p>A REALM component is one <code>&lt;custom-element&gt;</code> tag with a script, a style and markup. Values show through native slots, events use native <code>on*</code> handlers, and the browser does the rest. No compiler, no build step.</p>
  <div class="actions">
    <a class="action primary" href="docs/quick-start/">Get started</a>
    <a class="action outline" href="components/">Browse components</a>
  </div>
  <p class="install">npm install @realmorg/realm</p>
</section>

<h2>One tag, three parts</h2>

<p class="section-lead">The script is plain JavaScript. State changes update the slots and bindings that read them, and nothing else.</p>

```html live
<custom-element name="click-counter">
  <script type="realm">
    const props = defineProps({ step: prop.number().int().min(1).default(1) });

    const counter = useState({
      count: 0,
      get unit() {
        return this.count === 1 ? "time" : "times";
      },
    });

    function increment() {
      counter.count += props.step;
    }

    function reset() {
      counter.count = 0;
    }
  </script>

  <style type="realm">
    :host {
      display: inline-flex;
      gap: calc(var(--spacing) * 2);
    }
  </style>

  <ui-button onclick="increment()">Clicked <slot name="#counter.count"></slot> <slot name="#counter.unit"></slot></ui-button>
  <ui-button variant="outline" onclick="reset()">Reset</ui-button>
</custom-element>

<click-counter></click-counter>
<click-counter step="5"></click-counter>
```

<h2>What you get</h2>

<div class="features">
<ui-card><ui-card-header><ui-card-title>No build step</ui-card-title><ui-card-description>Load one module script. Components are assembled in the browser from HTML, without eval, new Function or blob URLs.</ui-card-description></ui-card-header></ui-card>
<ui-card><ui-card-header><ui-card-title>Native by default</ui-card-title><ui-card-description>Shadow DOM, slots, on* handlers, dispatchEvent, ElementInternals and forms work the way the platform defines them.</ui-card-description></ui-card-header></ui-card>
<ui-card><ui-card-header><ui-card-title>Fine-grained updates</ui-card-title><ui-card-description>useState, cached getters and observe. Changes are batched per microtask and only touch the slots and attributes that read them.</ui-card-description></ui-card-header></ui-card>
<ui-card><ui-card-header><ui-card-title>Requests as attributes</ui-card-title><ui-card-description>fetch, into, render, busy and trigger. Stale responses are cancelled, identical GETs are shared and inserted HTML is sanitised.</ui-card-description></ui-card-header></ui-card>
<ui-card><ui-card-header><ui-card-title>Real form fields</ui-card-title><ui-card-description>form-associated components submit, reset, validate and restore like built-in inputs, and can delegate to an inner control.</ui-card-description></ui-card-header></ui-card>
<ui-card><ui-card-header><ui-card-title>Cleans up after itself</ui-card-title><ui-card-description>Every listener, observer, timer and request is tied to the element's AbortSignal and stops when it is removed.</ui-card-description></ui-card-header></ui-card>
</div>

<h2>Where to go next</h2>

<div class="example-grid">
<a href="docs/"><ui-card><ui-card-header><ui-card-title>Docs</ui-card-title><ui-card-description>Start with the introduction, the quick start and the tutorial, then read the core concepts.</ui-card-description></ui-card-header></ui-card></a>
<a href="components/"><ui-card><ui-card-header><ui-card-title>Components</ui-card-title><ui-card-description>REALM UI: around sixty accessible ui-* components in the style of shadcn/ui, built with REALM itself.</ui-card-description></ui-card-header></ui-card></a>
<a href="examples/"><ui-card><ui-card-header><ui-card-title>Examples</ui-card-title><ui-card-description>A todo list, a kanban board, chess, a dashboard and sign-in blocks, all running on this site.</ui-card-description></ui-card-header></ui-card></a>
</div>
