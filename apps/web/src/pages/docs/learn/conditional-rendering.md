---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 12. Conditional Rendering
menuOrder: 12
title: Conditional Rendering
author: Ribhararnus Pracutian
description: Learn how to conditionally render elements in Realm.
---

In Realm, HTML takes the spotlight over JavaScript, especially in the realm of user interface (UI) development. One of the key features we have at our disposal for UI manipulation is conditional rendering. Unlike some other frameworks that rely on a Virtual DOM, Realm takes a different approach when it comes to handling DOM manipulation.

Rather than performing complex operations to add, remove, or update DOM elements, we have a straightforward and intuitive tool at our disposal: the `display: none` property. This basic property allows us to hide or show elements with ease based on specific conditions or user interactions.

By harnessing the power of it, we can effortlessly toggle the visibility of elements, eliminating the need for intricate DOM manipulations. This approach not only simplifies our code but also enhances performance, making UI management a breeze and enabling the creation of dynamic and responsive user experiences.

In Realm, conditional rendering using the `display: none` property is a simple yet powerful technique that empowers you to control element visibility in your UI without the overhead of Virtual DOM operations.

```html
<custom-element name="magic-element">
  <element-state name="state" type="string"></element-state>

  <element-flow>
    <trigger-event input="MagicInput">
      <set-state name="state" value="$.target.value" from="event"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <is-visible value="#state" eq="abracadabra">Kaboom, magic 🦄 is real!</is-visible>

    Please type &quot;abracadabra&quot; to see the magic 🦄
    <input ref="MagicInput" />
  </template>
</custom-element>

<magic-element></magic-element>
```

<custom-element name="magic-element">
  <element-state name="state" type="string"></element-state>

  <element-flow>
    <trigger-event input="MagicInput">
      <set-state name="state" value="$.target.value" from="event"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <is-visible value="#state" eq="abracadabra">
      <div>Kaboom, magic 🦄 is real!</div>
    </is-visible>
    Please type &quot;abracadabra&quot; to see the magic 🦄
    <input ref="MagicInput" />
  </template>
</custom-element>

<realm-demo>
  <magic-element></magic-element>
</realm-demo>

## Conditional Rendering Tags: `is-visible` and `is-hidden`

Realm offers two tags for handling conditional rendering: `is-visible` and `is-hidden`. Both tags accept the same attributes, but they exhibit different behaviors.

The `is-visible` tag will render its content if the specified condition evaluates to true. If the condition is false, it will render nothing. On the other hand, the `is-hidden` tag will hide its content when the condition is true.

## Comparison Operators

In the previous section on <anchor-link href="/docs/learn/css">Dynamic styles</anchor-link>, you explored CSS logic, and interestingly, the comparison operators used for CSS logic closely resemble those used for conditional rendering. You can find a comprehensive list of these comparison operators in the <anchor-link href="/references/misc/comparison-operators">Comparison Operators reference</anchor-link>, providing a detailed overview.
