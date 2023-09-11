---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 03. Element States
menuOrder: 3
title: Working with Element States
author: Ribhararnus Pracutian
description: Define and use element states.
---

## Bringing Engagement with Element States

We promise to make our custom elements more engaging and exciting.

Element states in custom elements enable us to create dynamic and interactive elements. By defining and manipulating states, we can introduce responsiveness to user interactions, data changes, or any other events that impact the behavior or appearance of our custom element.

With states, we can track and update specific values within our custom element, triggering automatic re-rendering whenever a state changes. This reactivity empowers us to build dynamic user interfaces that respond in real-time, providing a more engaging and interactive experience for our users.

## How to Define an Element State?

You can define an element's state using the `<element-state>` tag. It's similar to defining an element's attribute (you can find supported types in the <anchor-link href="/references/elements/element-state">`element-state reference`</anchor-link>).

```html
<custom-element name="hello-world">
  <element-attr name="name" type="string">anonymous</element-attr>
  <element-state name="age" type="number">100</element-state>
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
  <template>
    <strong>Hello world, my name is <slot name="@name"></slot>!</strong>
    <em>and, I'll live until <slot name="#age"></slot> years old</em>
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

To render the state's value, use the `<slot>` tag with the state's name, prefixed with a `#` symbol. The distinction between attributes and states is the prefix: attributes use the `@` prefix, and states use the `#` prefix.

We apologize for promising reactivity earlier, but it hasn't happened yet because our state is still static. Let's take it a step further and introduce reactivity using the <anchor-link href="/docs/learn/flow">Element's flow</anchor-link> feature.
