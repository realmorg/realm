---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 13. List Rendering
menuOrder: 13
title: List Rendering
author: Ribhararnus Pracutian
description: Learn how to render list of arrays.
---

> This feature is still in beta phase, it maybe not stable yet.

In Realm, you can make use of the `<repeat-list>` tag to render list of arrays. This feature functions similarly to a for loop / map in JavaScript, allowing you to iterate over a collection or an array-like structure and generate dynamic content for each item.

By utilizing the `<repeat-list>` tag, you can define a template for an individual item within the list. The tag automatically repeats the template for each item in the specified collection, rendering the corresponding content. This approach streamlines the process of rendering lists and eliminates the need for manual iteration and element creation.

With the `<repeat-list>` tag, you can effortlessly generate dynamic lists in your Realms applications. It simplifies the task of rendering collections of data, such as a list of products, comments, or any other type of repeating content. This powerful feature enables you to create flexible and interactive UIs with ease.

```html
<custom-element name="todo-item">
  <element-attr name="label" type="string">Empty label</element-attr>
  <template>
    <style>
      :host {
        display: block;
        padding: 4px 8px;
        font-size: 1rem;
        border-left: 5px solid teal;
        margin-bottom: 10px;
      }
    </style>
    ✅ <slot name="@label"></slot>
  </template>
</custom-element>

<custom-element name="todo-list">
  <element-state name="input" type="string"></element-state>
  <element-state name="list" type="array">[]</element-state>
  <element-state name="is-btn-disabled" type="boolean">true</element-state>

  <element-flow>
    <trigger-event input="NewItemInput">
      <set-state name="input" value="$.target.value" from="event"></set-state>
    </trigger-event>
    <trigger-event click="AddToListBtn">
      <set-state
        name="list"
        value='[{ "label": "$.input" }]'
        from="localState"
        mutate="push">
      </set-state>
      <set-state name="input" value=""></set-state>
    </trigger-event>
    <listen-event statechanged="input">
      <script type="module/realm" use="localState, event">
        const [, value] = event;
        localState.set('is-btn-disabled', value === '');
      </script>
    </listen-event>
  </element-flow>

  <template>
    <repeat-list of="#list">
      <todo-item _label="$.label"></todo-item>
    </repeat-list>
    <input ref="NewItemInput" _value="#input" />
    <button ref="AddToListBtn" _disabled="#is-btn-disabled">Add to list</button>
  </template>
</custom-element>

<todo-list></todo-list>
```

<custom-element name="todo-item">
  <element-attr name="label" type="string">Empty label</element-attr>
  <template>
    <style>
      :host {
        display: block;
        padding: 4px 8px;
        font-size: 1rem;
        border-left: 5px solid teal;
        margin-bottom: 10px;
      }
    </style>
    ✅ <slot name="@label"></slot>
  </template>
</custom-element>

<custom-element name="todo-list">
  <element-state name="input" type="string"></element-state>
  <element-state name="list" type="array">[]</element-state>
  <element-state name="is-btn-disabled" type="boolean">true</element-state>

  <element-flow>
    <trigger-event input="NewItemInput">
      <set-state name="input" value="$.target.value" from="event"></set-state>
    </trigger-event>
    <trigger-event click="AddToListBtn">
      <set-state
        name="list"
        value='[{ "label": "$.input" }]'
        from="localState"
        mutate="push">
      </set-state>
      <set-state name="input" value=""></set-state>
    </trigger-event>
    <listen-event statechanged="input">
      <script type="module/realm" use="localState, event">
        const [, value] = event;
        localState.set('is-btn-disabled', value === '');
      </script>
    </listen-event>
  </element-flow>

  <template>
    <repeat-list of="#list">
      <todo-item _label="$.label"></todo-item>
    </repeat-list>
    <input ref="NewItemInput" _value="#input" />
    <button ref="AddToListBtn" _disabled="#is-btn-disabled">Add to list</button>
  </template>
</custom-element>

<realm-demo>
  <todo-list></todo-list>
</realm-demo>

## The `of` attribute

The `<repeat-list>` tag uses the `of` attribute to specify the array that will be iterated over. However, it's important to note that at the moment, the of attribute only supports iterating over the local state.

In other words, when using `<repeat-list>`, you can provide an array-type from the local state as the value for the of attribute. This array will be iterated over, and the specified template will be repeated for each item in the array.

When it comes to rendering repeated items, we are using: the `$.` notation. This notation allows us to efficiently select an item from array.

It provides a concise and convenient way to reference individual elements during the iteration process. It's either you need to bind item to child element's attributes, render as children, or apply conditional logic to each repeated item, the `$.` notation enables you to do so seamlessly.

In the upcoming section, we will dive deeper into the `$.` notation and advanced state mutation.

## `<slot>` inside list

The `<slot>` tag can be used inside the `<repeat-list>` tag. It will be rendered as a child of the repeated item. This allows you to render dynamic content for each item in the list.

```html
<custom-element name="realm-belongs">
  <element-state name="array" type="array">[{ "realm": "world" }, { "realm": "universe" }, { "realm": "multiverse" }]</element-state>

  <template>
    <repeat-list of="#array">
      <p>
        Your Realm belongs to: the <slot name="$.realm"></slot>
      </p>
    </repeat-list>
  </template>
</custom-element>

<realm-belongs></realm-belongs>
```

<custom-element name="realm-belongs">
  <element-state name="array" type="array">[{ "realm": "world" }, { "realm": "universe" }, { "realm": "multiverse" }]</element-state>

  <template>
    <repeat-list of="#array">
      <p>
        Your Realm belongs to: the <slot name="$.realm"></slot>
      </p>
    </repeat-list>
  </template>
</custom-element>

<realm-demo>
  <realm-belongs>
</realm-demo>

## The meta data

There is an additional feature in the `<repeat-list>` tag, which is the meta data of the list. The meta data is an object that contains information about the current iteration. It's useful for applying conditional logic to repeated items.

The meta data is accessible via the `!.` notation.

```html
<custom-element name="meta-demo">
  <element-state name="array" type="array">
    [{ "label": "human" }, { "label": "microbes" }]
  </element-state>

  <template>
    <repeat-list of="#array">
      <p>
        Index <slot name="!.index"></slot> of <slot name="!.length"></slot> species.
        Species: <slot name="$.label"></slot>
      </p>
    </repeat-list>
  </template>
</custom-element>

<meta-demo></meta-demo>
```

<custom-element name="meta-demo">
  <element-state name="array" type="array">
    [{ "label": "human" }, { "label": "microbes" }]
  </element-state>

  <template>
    <repeat-list of="#array">
      <p>
        Index <slot name="!.index"></slot> of <slot name="!.length"></slot> species.
        Species: <slot name="$.label"></slot>
      </p>
    </repeat-list>
  </template>
</custom-element>

<realm-demo>
  <meta-demo></meta-demo>
</realm-demo>
