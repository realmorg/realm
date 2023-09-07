---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 16. State Mutation
menuOrder: 16
title: Advanced State Mutation
author: Ribhararnus Pracutian
description: Learn how to mutate state in Realm.
---

First of all, congratulations on reaching the final section of the tutorial! You’ve made it this far.

Throughout the tutorial, you have gained a solid understanding of Realm's core concepts and functionalities. You have learned how to create custom elements, work with states, render lists, handle events, and even import elements from the web. By mastering these techniques, you are well-equipped to leverage Realm's capabilities and build your desired product.

Remember to continue exploring and experimenting with the framework to further enhance your skills and expand your product-building capabilities.

Well done on your achievements so far, and best of luck with your future endeavors in utilizing Realm and building your own remarkable products!


## What is State Mutation?

In the <anchor-link href="/docs/learn/flow">Element Flow</anchor-link> section, we have introduced you about state mutation. In this section, we will learn more about it.

State mutation is the process of changing the value of a state within a Custom Element. However, due to the nature of using HTML instead of JavaScript directly within Realm, the capabilities for directly mutating the state are limited.

It's important to note that state mutation is limited to state type `number` and `array`. When working with `number` type states, you can perform basic arithmetic operations to mutate their values. For instance, you can add, subtract, multiply, or divide the numbers to update the state.

On the other hand, when dealing with `array` type states, there are several methods available for mutation. You can use `push` to add new elements to the array, `pop` to remove the last element, `assign` to replace the item of the array with `index` attribute, `remove` to remove the item with specific `index`.

However, it's important to keep in mind that direct mutation of other data types or complex objects within the state is not supported in Realm. The framework primarily focuses on the manipulation of `number` and `array` states. By understanding these limitations and utilizing the available mutation methods, you can effectively update and modify the state values within your Custom Element.

## How to mutate a State?

The basic mutate value for state type `number` is basic arithmetic operation by performing the operation calculation with the value of state action.

Take a look at the following example:

```html
<custom-element name="number-mutation">
  <element-state name="number" type="number">0</element-state>
  <element-flow>
    <trigger-event click="+Button">
      <set-state name="number" value="1" mutate="+"></set-state>
    </trigger-event>
    <trigger-event click="-Button">
      <set-state name="number" value="1" mutate="-"></set-state>
    </trigger-event>
    <trigger-event click="*Button">
      <set-state name="number" value="2" mutate="*"></set-state>
    </trigger-event>
    <trigger-event click="/Button">
      <set-state name="number" value="2" mutate="/"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    Your number: <slot name="#number"></slot><br />
    <button ref="+Button">+</button>
    <button ref="-Button">-</button>
    <button ref="*Button">*</button>
    <button ref="/Button">/</button>
  </template>
</custom-element>

<number-mutation></number-mutation>
```

<custom-element name="number-mutation">
  <element-state name="number" type="number">0</element-state>
  <element-flow>
    <trigger-event click="+Button">
      <set-state name="number" value="1" mutate="+"></set-state>
    </trigger-event>
    <trigger-event click="-Button">
      <set-state name="number" value="1" mutate="-"></set-state>
    </trigger-event>
    <trigger-event click="*Button">
      <set-state name="number" value="2" mutate="*"></set-state>
    </trigger-event>
    <trigger-event click="/Button">
      <set-state name="number" value="2" mutate="/"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    Your number: <slot name="#number"></slot><br />
    <button ref="+Button">+</button>
    <button ref="-Button">-</button>
    <button ref="*Button">*</button>
    <button ref="/Button">/</button>
  </template>
</custom-element>

<realm-demo>
  <number-mutation></number-mutation>
</realm-demo>

## How to mutate an Array?
The state mutation for array-type state is a bit different. The different mutate operation has different behavior.

* `push` mutation will add new elements to the array. The `value` attribute should be a valid JSON array.
* `pop` mutation will remove the last element of the array. The `value` attribute is not needed.
* `assign` mutation will replace the item of the array with `index` attribute. The `value` attribute should be a valid JSON object / number / string.
* `remove` mutation will remove the item with specific `index`. The `value` attribute is not needed.

Example:

```html
<custom-element name="array-mutation">
  <element-state name="array" type="array">[]</element-state>
  <element-flow>
    <trigger-event click="PushArrayBtn">
      <set-state name="array" value="[0]" mutate="push"></set-state>
    </trigger-event>
    <trigger-event click="PopArrayBtn">
      <set-state name="array" mutate="pop"></set-state>
    </trigger-event>
    <trigger-event click="AssignArrayBtn">
      <set-state name="array" value="1" mutate="assign" index="0"></set-state>
    </trigger-event>
    <trigger-event click="RemoveArrayBtn">
      <set-state name="array" mutate="remove" index="2"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    Your array: <slot name="#array"></slot><br />
    <button ref="PushArrayBtn">push</button>
    <button ref="PopArrayBtn">pop</button>
    <button ref="AssignArrayBtn">assign</button>
    <button ref="RemoveArrayBtn">remove</button>
  </template>
</custom-element>

<array-mutation></array-mutation>
```
<custom-element name="array-mutation">
  <element-state name="array" type="array">[]</element-state>
  <element-flow>
    <trigger-event click="PushArrayBtn">
      <set-state name="array" value="[0]" mutate="push"></set-state>
    </trigger-event>
    <trigger-event click="PopArrayBtn">
      <set-state name="array" mutate="pop"></set-state>
    </trigger-event>
    <trigger-event click="AssignArrayBtn">
      <set-state name="array" value="1" mutate="assign" index="0"></set-state>
    </trigger-event>
    <trigger-event click="RemoveArrayBtn">
      <set-state name="array" mutate="remove" index="2"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    Your array: <slot name="#array"></slot><br />
    <button ref="PushArrayBtn">push</button>
    <button ref="PopArrayBtn">pop</button>
    <button ref="AssignArrayBtn">assign</button>
    <button ref="RemoveArrayBtn">remove</button>
  </template>
</custom-element>

<realm-demo>
  <array-mutation></array-mutation>
</realm-demo>
