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

Custom script flow is live under flow tag (`<trigger-event>` or `<listen-event>`) and the `type` is `module/realm`.

If you want to use state, attributes, element's reference, event, you need to define `use` attribute. The `use` attribute is a comma-separated list of variables that you want to use inside the script. You can use `localState`, `globalState`, `attr`, `ref` (see all supported variables in <anchor-link href="/references/actions/script">`script` reference</anchor-link>).

For example if you only need an event and a local state, you can define it like this:

```html
<custom-element name="script-flow-demo">
  <element-state name="name" type="string"></element-state>
  <element-flow>
    <trigger-event input="NameInput">
      <script type="module/realm" use="localState, event">
        localState.set('name', (event.target.value ?? '').split``.reverse().join``);
      </script>
    </trigger-event>
  </element-flow>
  <template>
    Hi my name is
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

Great job! Inside the script, you have the freedom to perform various operations and implement custom logic to enhance your custom elements. With this knowledge, you have now covered 80% of Realm's core concepts.

Now, let's move on to the next tutorial, where we will explore how to import elements from across the web. And it will demonstrate how you can leverage the power of custom elements to import and use elements from different website or 3rd-parties, expanding the capabilities and functionality of your Realm apps.

By importing elements from the web, you can tap into a vast ecosystem of pre-built elements saving you time and effort in developing everything from scratch. This tutorial will guide you through the process of importing and integrating external elements seamlessly into your projects.

Get ready to unlock a world of possibilities as we delve into the exciting realm of <anchor-link href="/docs/learn/reusability">importing elements across the web</anchor-link> in the next tutorial!
