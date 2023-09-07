---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 03. Element States
menuOrder: 3
title: Working with Element States
author: Ribhararnus Pracutian
description: Define and use element states.
---

We are promised you, to making our custom element more engaging and exciting.

States in custom elements allow us to create dynamic and interactive element. By defining and manipulating states, we can introduce responsiveness to user interactions, data changes, or any other events that impact the behavior or appearance of our custom element.

With states, we can track and update specific values within our custom element, triggering automatic re-rendering whenever a state changes. This reactivity enables us to create dynamic user interfaces that respond in real-time, providing a more engaging and interactive experience for our users.

## How to define an Element State?

You can define an element's state with `<element-state>` tag. It's similar with Element's attribute (you can see supported types in <anchor-link href="/references/elements/element-state">`element-state reference`</anchor-link>).

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

To render the state's value, use the `<slot>` tag with the attribute's name as the state's name prefixed with `#` symbol. The distinction between attribute and state is the prefix. Attribute uses `@` prefix, and state uses `#` prefix.

Sorry for promising you about reactivity, but it didn't happen yet. Because our state is still static. Then let's make it reactive. We'll take it a step further and introduce reactivity using the <anchor-link href="/docs/learn/flow">Element's flow</anchor-link> feature.
