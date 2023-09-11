---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 08. Custom Script Flow
menuOrder: 8
title: Custom Element's Flow Using Script
author: Ribhararnus Pracutian
description: Learn how to create a custom element's flow using script.
---

The requirement of your product is more complex than just using the built-in flow. You need to create a custom flow. Realm provides a way to do this with `<script>` action tag. It's the dynamic action tag that allows you to do custom business logic.

Take a look at the following example:

```html
<global-state name="counter" type="number">0</global-state>

<custom-element name="complex-element">
  <element-state name="counter" type="number">0</element-state>
  <element-flow>
    <trigger-event click="ComplexLogicButton">
      <script type="module/realm" use="localState, globalState">
        // You can do modern JavaScript codes here
        // Maybe fetch things from API, or do some complex algorithm
        // It's support top-level await too
        localState.set('counter', localState.get('counter) + 1);
        globalState.set('counter', localState.get('counter') * 2);
      </script>
    </trigger-event>
  </element-flow>
  <template>
    <button ref="ComplexLogicButton">Click me!</button>
    <div>
      Local counter:
      <slot name="#counter"></slot>
    </div>
    <div>
      Global counter:
      <slot global name="#counter"></slot>
    </div>
  </template>
</custom-element>

<complex-element></complex-element>
```

<global-state name="counter" type="number">0</global-state>

<custom-element name="complex-element">
  <element-state name="counter" type="number">0</element-state>
  <element-flow>
    <trigger-event click="ComplexLogicButton">
      <script type="module/realm" use="localState, globalState">
        // You can do all of javascript functionalities here
        // Maybe fetch things from API, or do some complex logic
        // It's support top-level await
        localState.set('counter', localState.get('counter') + 1);
        globalState.set('counter', localState.get('counter') * 2);
      </script>
    </trigger-event>
  </element-flow>
  <template>
    <button ref="ComplexLogicButton">Click me!</button>
    <div>Local counter: <slot name="#counter"></slot></div>
    <div>Global counter: <slot global name="#counter"></slot></div>
  </template>
</custom-element>

<realm-demo>
  <complex-element></complex-element>
</realm-demo>

## How to use script?

To implement custom script flows, place them within a `<trigger-event>` or `<listen-event>` tag under the `<element-flow>` section, with the `type` attribute set to `module/realm`.

When working with script flows and needing access to various elements like states, attributes, element references, and events, you must define the `use` attribute. This attribute serves as a comma-separated list of variables that you intend to utilize within the script. Supported variables include `localState`, `globalState`, `attr`, and `ref`. You can find a comprehensive list of supported variables in the <anchor-link href="/references/actions/script">`script` reference</anchor-link>.

For instance, if your script requires access to an event and a local state, you can specify them as follows:

```html
<custom-element name="script-flow-demo">
  <element-state name="name" type="string"></element-state>
  <element-flow>
    <trigger-event input="NameInput">
      <script type="module/realm" use="localState, event">
        localState.set('name', (event.target.value ?? '').split``.reverse().join(``));
      </script>
    </trigger-event>
  </element-flow>
  <template>
    Hi my reversed name is
    <slot name="#name"></slot>
    !
    <br />
    <input ref="NameInput" />
  </template>
</custom-element>

<script-flow-demo></script-flow-demo>
```

<custom-element name="script-flow-demo">
  <element-state name="name" type="string"></element-state>
  <element-flow>
    <trigger-event input="NameInput">
      <script type="module/realm" use="localState, event">
        localState.set('name', (event.target.value ?? '').split``.reverse().join(``));
      </script>
    </trigger-event>
  </element-flow>
  <template>
    Hi my reversed name is <slot name="#name"></slot>!
    <br/>
    <input ref="NameInput" />
  </template>
</custom-element>

<realm-demo>
  <script-flow-demo></script-flow-demo>
</realm-demo>

Fantastic work! Within custom scripts, you have the flexibility to carry out a wide array of operations and implement custom logic, greatly enhancing the capabilities of your custom elements. With this knowledge, you've already grasped 80% of Realm's fundamental concepts.

## What's next?

Now, let's move on to the next tutorial, where we'll delve into the intriguing world of importing elements from the vast expanse of the web. This tutorial will demonstrate how you can harness the power of custom elements to import and utilize components from various websites and third-party sources. This capability will significantly expand the functionalities and possibilities of your Realm applications.

By importing elements from the web, you'll gain access to a rich ecosystem of pre-built components, saving you valuable time and effort that would otherwise be spent on developing everything from the ground up. The upcoming tutorial will provide a step-by-step guide on importing and seamlessly integrating external elements into your projects.

Prepare to unlock a world of opportunities as we embark on an exciting journey into the realm of <anchor-link href="/docs/learn/reusability">importing elements across the web</anchor-link> in our next tutorial!
