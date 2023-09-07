---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 05. Global States
menuOrder: 5
title: Working with Global States
author: Ribhararnus Pracutian
description: Share data between elements using global states.
---

Sometimes you need to share data between elements. Realm provides a way to do this with global states. States management in Realm is straightforward and easy to use.

## How to define a Global State?

You can define a global state with `<global-state>` tag. It's similar with <anchor-link href="/docs/learn/states">Element's State</anchor-link> but this time it's global. State that can be accessed from anywhere.

## Use case: Global Counter

Let's create a global counter that can be incremented and decremented, and display it in two different elements.

```html
<global-state name="counter" type="number">0</global-state>

<custom-element name="counter-tool">
  <element-flow>
    <trigger-event click="DecrementButton">
      <set-state global name="counter" value="1" mutate="-"></set-state>
    </trigger-event>
    <trigger-event click="IncrementButton">
      <set-state global name="counter" value="1" mutate="+"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <button ref="DecrementButton">-</button>
    <span>
      Counter:
      <slot global name="#counter"></slot>
    </span>
    <button ref="IncrementButton">+</button>
  </template>
</custom-element>

<custom-element name="counter-view">
  <template>
    <h1><slot global name="#counter"></slot></h1>
  </template>
</custom-element>

<counter-view></counter-view>
<counter-tool></counter-tool>
<counter-tool></counter-tool>
```

<global-state name="counter" type="number">0</global-state>

<custom-element name="counter-tool">
  <element-flow>
    <trigger-event click="DecrementButton">
      <set-state global name="counter" value="1" mutate="-"></set-state>
    </trigger-event>
    <trigger-event click="IncrementButton">
      <set-state global name="counter" value="1" mutate="+"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    <button ref="DecrementButton">-</button>
    <span>Counter: <slot global name="#counter"></slot></span>
    <button ref="IncrementButton">+</button>
  </template>
</custom-element>

<custom-element name="counter-view">
  <template>
    <h1><slot global name="#counter"></slot></h1>
  </template>
</custom-element>

<realm-demo>
  <counter-view></counter-view>
  <counter-tool></counter-tool>
  <counter-tool></counter-tool>
</realm-demo>

Pretty neat, right? You can increment and decrement the counter value, and it's shared between different elements.

## Storage

One of the cool things about global states is that it can be stored in local storage or session storage.

Global states are stored in memory by default, but you can store it in local storage (`localStorage`) or session storage (`sessionStorage`) by adding `storage` attribute to `<global-state>` tag.

```html
<global-state name="cached-counter" type="number" storage="localStorage">
  0
</global-state>

<custom-element name="local-storage-counter">
  <element-flow>
    <trigger-event click="IncrementButton">
      <set-state global name="cached-counter" value="1" mutate="+"></set-state>
    </trigger-event>
    <trigger-event click="DecrementButton">
      <set-state global name="cached-counter" value="1" mutate="-"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    <button ref="DecrementButton">-</button>
    <span>
      Counter:
      <slot global name="#cached-counter"></slot>
    </span>
    <button ref="IncrementButton">+</button>
  </template>
</custom-element>

<local-storage-counter></local-storage-counter>
```

<global-state name="cached-counter" type="number" storage="localStorage">0</global-state>

<custom-element name="local-storage-counter">
  <element-flow>
    <trigger-event click="IncrementButton">
      <set-state global name="cached-counter" value="1" mutate="+"></set-state>
    </trigger-event>
    <trigger-event click="DecrementButton">
      <set-state global name="cached-counter" value="1" mutate="-"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    <button ref="DecrementButton">-</button>
    <span>Counter: <slot global name="#cached-counter"></slot></span>
    <button ref="IncrementButton">+</button>
  </template>
</custom-element>

<realm-demo>
  <local-storage-counter></local-storage-counter>
</realm-demo>

Please click the button, and refresh this page. You will see that the counter value is remain the same. That's because the counter value is stored in local storage.

Since you already have a grasp of the concept of global states, there's no need for me to explain it more. Let's move on to the next tutorial, <anchor-link href="/docs/learn/bindings">how to binds dynamic data to element's attributes</anchor-link>.
