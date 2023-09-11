---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 06. Data Bindings
menuOrder: 6
title: Custom Element's Bindings
author: Ribhararnus Pracutian
description: Learn how to bind data from an element's attributes, states, and global states to the custom elements.
---

## Data Binding in Realm

Data binding is a powerful feature in Realm that enables you to connect data from element attributes, states, and global states to custom elements. It's a feature you might already be familiar with if you've used popular frameworks like Vue, React, or Svelte.

## How to Bind Data

In Realm, you can easily bind data from attributes, states, and global states by using a simple prefix notation. Here's how it works:

- To bind data from an attribute, use the `@` prefix, e.g., `_attribute="@attr-name"`.
- To bind data from a state, use the `#` prefix, e.g., `_attribute="#state-name"`.
- To bind data from a global state, use the `:global` prefix followed by the attribute or state name, e.g., `attribute:global="#state-name"`.

Let's take a look at some examples:

```html
<custom-element name="person-identity">
  <element-attr name="name" type="string">anonymous</element-attr>
  <element-attr name="age" type="number">10</element-attr>
  <template>
    Hi, my name is
    <slot name="@name"></slot>
    , and I'm
    <slot name="@age"></slot>
    years old.
  </template>
</custom-element>

<custom-element name="define-person">
  <element-state name="name" type="string">no name</element-state>
  <element-state name="age" type="number">0</element-state>

  <element-flow>
    <trigger-event input="NameInput">
      <set-state name="name" value="$.target.value" from="event"></set-state>
    </trigger-event>
    <trigger-event click="AddAgeButton">
      <set-state name="age" value="1" mutate="+"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <!-- We're giving person-identity's attributes with _ prefix -->
    <person-identity _name="#name" _age="#age"></person-identity>
    <input ref="NameInput" />
    <button ref="AddAgeButton">Increment Age</button>
  </template>
</custom-element>

<div><define-person></define-person></div>
<div><define-person></define-person></div>
```

<custom-element name="person-identity">
  <element-attr name="name" type="string">anonymous</element-attr>
  <element-attr name="age" type="number">10</element-attr>
  <template>
    Hi, my name is <slot name="@name"></slot>, and I'm <slot name="@age"></slot> years old.
  </template>
</custom-element>

<custom-element name="define-person">
  <element-state name="name" type="string">no name</element-state>
  <element-state name="age" type="number">0</element-state>

  <element-flow>
    <trigger-event input="NameInput">
      <set-state name="name" value="$.target.value" from="event"></set-state>
    </trigger-event>
    <trigger-event click="AddAgeButton">
      <set-state name="age" value="1" mutate="+"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <person-identity _name="#name" _age="#age"></person-identity>
    <input ref="NameInput" /> <button ref="AddAgeButton">Increment Age</button>
  </template>
</custom-element>

<realm-demo>
  <div><define-person></define-person></div>
  <div><define-person></define-person></div>
</realm-demo>

## Binding Element Attributes to Child Elements

Similar to other frameworks, you can pass data to child elements in Realm. This is often referred to as "props drilling" in other frameworks.

```html
<custom-element name="favorite-color">
  <element-attr name="color" type="string">red</element-attr>
  <template>
    My favorite color is
    <slot name="@color"></slot>
  </template>
</custom-element>

<custom-element name="ui-designer">
  <element-attr name="name" type="string">anonymous</element-attr>
  <element-attr name="color" type="string">red</element-attr>
  <template>
    Hi my name is
    <slot name="@name"></slot>
    , and my favorite color is
    <favorite-color _color="@color"></favorite-color>
  </template>
</custom-element>

<ui-designer name="Rick" color="teal"></ui-designer>
<br />
<ui-designer name="Morty" color="hotpink"></ui-designer>
```

<custom-element name="favorite-color">
  <element-attr name="color" type="string">red</element-attr>
  <template>
    My favorite color is <slot name="@color"></slot>
  </template>
</custom-element>

<custom-element name="ui-designer">
  <element-attr name="name" type="string">anonymous</element-attr>
  <element-attr name="color" type="string">red</element-attr>
  <template>
    Hi my name is <slot name="@name"></slot>. <favorite-color _color="@color"></favorite-color>
  </template>
</custom-element>

<realm-demo>
  <ui-designer name="Rick" color="teal"></ui-designer>
  <br />
  <ui-designer name="Morty" color="hotpink"></ui-designer>
</realm-demo>

## Binding Data from Global State

Binding data from a global state follows a similar pattern as binding from an element's state. However, you need to use the `:global` prefix along with the attribute or state name when binding from a global state:

```html
<global-state name="counter" type="number">0</global-state>

<custom-element name="age-render">
  <element-attr name="age" type="number">0</element-attr>
  <template>
    <h1>
      My age is
      <slot name="@age"></slot>
    </h1>
  </template>
</custom-element>

<custom-element name="micro-app">
  <template>
    <age-render _age:global="#counter"></age-render>
  </template>
</custom-element>

<micro-app></micro-app>
```

<global-state name="counter" type="number">0</global-state>

<custom-element name="age-render">
  <element-attr name="age" type="number">0</element-attr>
  <template>
    <h1>My age is <slot name="@age"></slot></h1>
  </template>
</custom-element>

<custom-element name="micro-app">
  <element-flow>
    <trigger-event click="AddCounterButton">
      <set-state global name="counter" value="1" mutate="+"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <age-render _age:global="#counter"></age-render>
    <button ref="AddCounterButton">Add counter</button>
  </template>
</custom-element>

<realm-demo>
  <micro-app></micro-app>
</realm-demo>

That's how data binding works in Realm, allowing you to create dynamic and interactive web components effortlessly.

Feeling curious about rendering children in custom elements? Don't worry; we'll cover that in the next tutorial on <anchor-link href="/docs/learn/children">Children Rendering</anchor-link>.
