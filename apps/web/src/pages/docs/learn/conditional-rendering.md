---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 12. Conditional Rendering
menuOrder: 12
title: Conditional Rendering
author: Ribhararnus Pracutian
description: Learn how to conditionally render elements in Realm.
---

In Realm, HTML takes the spotlight over JavaScript, and when it comes to the user interface (UI), we have a nifty feature called conditional rendering. Since we don't rely on a Virtual DOM, we have a different approach to handling DOM manipulation.

Instead of removing, adding, or updating DOM elements, we can simply use the hidden attribute to hide or show elements as needed. It's a straightforward and intuitive way to control the visibility of elements based on certain conditions or user interactions.

By leveraging the hidden attribute, we can easily toggle the display of elements without the need for complex DOM manipulations. This approach simplifies the code and enhances performance, making it easier to manage the UI and create dynamic user experiences.

So, in Realm, conditional rendering using the hidden attribute is a simple yet powerful technique that allows you to control the visibility of elements in your UI without the overhead of Virtual DOM operations.

```html
<custom-element name="magic-element">
  <element-state name="state" type="string"></element-state>

  <element-flow>
    <trigger-event input="MagicInput">
      <set-state name="state" value="$.target.value" from="event"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <is-visible value="#state" eq="abracadabra">
      Kaboom, magic 🦄 is real!
    </is-visible>

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

## Available tags: `is-visible` and `is-hidden`

Realm provides two tags to handle conditional rendering: `is-visible` and `is-hidden`. Both tags accept the same attributes, but they have different behaviors.

The `is-visible` tag will render its content if the condition is true. Otherwise, it will render nothing. On the other hand, the `is-hidden` tag will hide its content if the condition is true.

## Logic operators


In the<anchor-link href="/docs/learn/css">Dynamic styles</anchor-link> section, you learned about CSS logic, and it turns out that the logic operators used for CSS logic and conditional rendering are quite similar. You can find a list of these logic operators in the <anchor-link href="/references/misc/logic-operators">Logic Operators reference</anchor-link>, which provides a comprehensive overview.
