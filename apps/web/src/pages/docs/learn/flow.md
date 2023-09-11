---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 04. Element Flow
menuOrder: 4
title: Custom Element's Flow (Reactivity)
author: Ribhararnus Pracutian
description: Define and use element flow.
---

## The Evolution of DOM Manipulation

In the era of jQuery, manipulating the DOM was a common practice. However, with modern frameworks like React, Vue, and Svelte, DOM manipulation is generally discouraged due to its performance limitations.

The reason behind this is its inherent slowness, as the browser needs to parse the HTML, convert it to the DOM, and then render it on the screen. This process involves a significant amount of computation.

Unlike React, Vue, or Svelte, Realm takes a different approach. It doesn't rely on a Virtual DOM but instead embraces the native DOM. Realm utilizes slots to render content.

Let's recall <anchor-link href="/docs/mindset">our mindset</anchor-link>: Realm is designed for developers who prioritize fast product delivery. Hence, we don't need to overly concern ourselves with microsecond-level frontend performance. Instead, our primary focus is on delivering an exceptional product.

Back to our custom element, let's make our custom element's age state reactive as we determine the user's age.

```html
<custom-element name="hello-world">
  <element-attr name="name" type="string">anonymous</element-attr>
  <element-state name="age" type="number">100</element-state>

  <element-flow>
    <trigger-event click="SetAgeButton">
      <set-state name="age" value="102"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <strong>
      Hello world, my name is
      <slot name="@name"></slot>
      !
    </strong>
    <em>
      and, I'll live until
      <slot name="#age"></slot>
      years old
    </em>
    <button ref="SetAgeButton">Maybe 102?</button>
  </template>
</custom-element>

<div>
  <hello-world></hello-world>
</div>

<div>
  <hello-world name="R. Pracutian"></hello-world>
</div>
```

<custom-element name="hello-world">
  <element-attr name="name" type="string">anonymous</element-attr>
  <element-state name="age" type="number">100</element-state>

  <element-flow>
    <trigger-event click="SetAgeButton">
      <set-state name="age" value="102"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <strong>Hello world, my name is <slot name="@name"></slot>!</strong>
    <em>and, I'll live until <slot name="#age"></slot> years old</em>
    <button ref="SetAgeButton">Maybe 102?</button>
  </template>
</custom-element>

<realm-demo>
  <div>
    <hello-world></hello-world>
  </div>

  <div>
    <hello-world name="R. Pracutian"></hello-world>
  </div>
</realm-demo>

## Breaking Down the Code

What's inside the `<element-flow>` tag is called a flow. It's a set of instructions that will be executed when the flow is triggered. In this case, the flow will be triggered when the button is clicked.

Currently, there are only two flows: `<trigger-event>` and `<listen-event>`. We will learn more about them later on.

## Introducing the `ref` Attribute

You may have noticed the `ref` attribute in the button tag. It's used to reference the button element. You can use it to reference any element in your custom element.

The `<trigger-event>` tag uses the `ref` attribute to reference the button element. It's used to listen to the button's click event.

We use the `ref` attribute instead of the `id` attribute because the `id` attribute is unique on the page, and we don't want to limit the number of custom elements on the page. Also, we avoid using the `class` or `data-*` attribute for semantic reasons. The `class` attribute is for styling, and the `data-*` attribute is for data. The `ref` attribute is specifically used for referencing elements.

You can put spaces in the `ref` attribute value, e.g., `My Button`. However, it's recommended to use `camelCase` or `dash-separated` strings, like `SetAgeButton` or `set-age-button`. Please remember that you can also reference multiple elements with the ref attribute.

## Actions tag

Inside the `<trigger-event>` tag, there's a `<set-state>` tag. It's called an action. You can see all available action tags in the <anchor-link href="/references">`reference`</anchor-link>.

An action is a set of instructions that will be executed when a flow is triggered. In this case, the action will be triggered when the button is clicked.

The current action is the `<set-state>` action, which is used to set the state value.

## State mutation

Before we continue, let's learn about state mutation. State mutation is the process of changing the state value. It's a common practice in other frameworks.

Okay, let's try to increment the age state value by 1 every time the button is clicked. Add the mutate attribute to the `<set-state>` tag. The mutate value can be arithmetic operations, `+` is used to increment the state value, and `-` is used to decrement the state value, and so on. It also supports mutations for array operations like push, pop, remove, and assign. You can read more about it in the <anchor-link href="/references/actions/set-state">`set-state reference`</anchor-link> page.

```html
<custom-element name="hello-world">
  <element-attr name="name" type="string">anonymous</element-attr>
  <element-state name="age" type="number">100</element-state>

  <element-flow>
    <trigger-event click="SetAgeButton">
      <set-state name="age" value="1" mutate="+"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <strong>
      Hello world, my name is
      <slot name="@name"></slot>
      !
    </strong>
    <em>
      and, I'll live until
      <slot name="#age"></slot>
      years old
    </em>
    <button ref="SetAgeButton">Increment my age</button>
  </template>
</custom-element>

<div>
  <hello-world></hello-world>
</div>

<div>
  <hello-world name="R. Pracutian"></hello-world>
</div>
```

<custom-element name="hello-world-mutate">
  <element-attr name="name" type="string">anonymous</element-attr>
  <element-state name="age" type="number">100</element-state>

  <element-flow>
    <trigger-event click="SetAgeButton">
      <set-state name="age" value="1" mutate="+"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <strong>Hello world, my name is <slot name="@name"></slot>!</strong>
    <em>and, I'll live until <slot name="#age"></slot> years old</em>
    <button ref="SetAgeButton">Increment my age</button>
  </template>
</custom-element>

<realm-demo>
  <div>
    <hello-world-mutate></hello-world-mutate>
  </div>

  <div>
    <hello-world-mutate name="R. Pracutian"></hello-world-mutate>
  </div>
</realm-demo>

We will learn more about <anchor-link href="/docs/learn/state-mutation">state mutation</anchor-link> in the last learning section. It will provide you with further insights and knowledge on how to manipulate states effectively within your custom element.

Understanding state mutation is essential for building dynamic interactivity. It involves updating or modifying the state values of your custom elements, enabling you to reflect changes in the user interface based on different cases.

## Congratulations!

Tada 🎉, congrats! You have acquired the fundamental knowledge of creating custom elements and understanding how reactivity works.

Because we have already fulfilled our promises, let's learn more about something else in the next tutorial: <anchor-link href="/docs/learn/global-states">global states</anchor-link>.
