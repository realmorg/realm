---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 06. Data Bindings
menuOrder: 6
title: Custom Element's Bindings
author: Ribhararnus Pracutian
description: Learn how to bind data from an element's attributes, states, and global states to the custom elements.
---

The data binding feature allows you to bind data from the element's attributes, states, and global states to the custom elements. It's similar feature like popular frameworks (Vue, React, and Svelte).

## How to bind data?

You can bind data from attributes, state and global state by using `_` prefix follows with the name of element's attribute. And the value of the attribute is using prefix that we learn in the previous tutorial. If it's an attribute, use `@` prefix, if it's a state, use `#` prefix.


```html
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
    <!-- We're giving person-identity's attributes with _ prefix -->
    <person-identity _name="#name" _age="#age"></person-identity>
    <input ref="NameInput" /> <button ref="AddAgeButton">Increment Age</button>
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

## Passes element's attributes to child element

In other frameworks it's called props drilling. In realm you can do the same thing.

```html
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
    Hi my name is <slot name="@name"></slot>,
    and my favorite color is <favorite-color _color="@color"></favorite-color>
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

## Bind data from global state
The process is similar to binding data from an element's state, but with global states, you need to use the `:global` prefix after the attribute's name binding. It's worth noting that you can render data from the global state without explicitly binding it. However, in some cases, your element may be atomic, meaning it remains pure and unrelated to business logic.

```html
<global-state name="counter" type="number">0</global-state>

<custom-element name="age-render">
  <element-attr name="age" type="number">0</element-attr>
  <template>
    <h1>My age is <slot name="@age"></slot></h1>
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

That's how the data binding feature works in Realm.

Do you feel strange? something is missing in our tutorial, how do we render a children in our custom element? Don't worry, we'll learn about it in the next tutorial, let's learn about <anchor-link href="/docs/learn/children">Children Rendering</anchor-link>.
