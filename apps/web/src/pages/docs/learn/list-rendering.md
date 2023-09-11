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

In Realm, you can use the `<repeat-list>` tag to display lists of items. Think of it like a simple loop in JavaScript, where you can go through a list of things and create content for each item.

With the `<repeat-list>` tag, you define how a single item should look. Then, magically, it repeats that template for each item in your list, showing all your content without you having to write lots of code.

This makes it super easy to create dynamic lists in your Realms apps. Whether it's products, comments, or anything that repeats, this handy feature helps you make interactive and flexible web pages without breaking a sweat.

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
    <div>
      <span>✅</span>
      <slot name="@label"></slot>
    </div>
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
      <set-state name="list" value='[{ "label": "$.input" }]' from="localState" mutate="push"></set-state>
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
    <div>
      <span>✅</span>
      <slot name="@label"></slot>
    </div>
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

To make the `<repeat-list>` tag work, we use something called the of attribute. But here's the catch: for now, it can only loop through a special thing called "local state."

In simpler terms, when you use `<repeat-list>`, you give it a list of items from your local state using the of attribute. It then goes through each item in that list and shows it using the template you've defined.

Now, here's the cool part. To work with each item in the list, we use a shortcut called $.. It's like a magic trick that lets you easily pick out individual items while looping through them. Whether you want to change an item's attributes, display it as a part of your content, or do fancy stuff with it, the $. notation makes it super simple.

In the next section, we'll dig deeper into how to use $. and do some advanced state tricks.

## Using `<slot>` Inside `<repeat-list>`

Guess what? You can use the `<slot>` tag right inside the` <repeat-list>` tag. When you do this, it becomes a child of each repeated item. This nifty trick lets you create dynamic content for every item in your list.

```html
<custom-element name="realm-belongs">
  <element-state name="array" type="array">[{ "realm": "world" }, { "realm": "universe" }, { "realm": "multiverse" }]</element-state>

  <template>
    <repeat-list of="#array">
      <p>
        Your Realm belongs to: the
        <slot name="$.realm"></slot>
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

## Understanding Array's meta in <repeat-list>

Within the `<repeat-list>` tag, there's an extra feature called "meta" This special data provides information about the current iteration of the list. It's particularly handy when you want to apply conditional logic to your repeated items.

To access the meta data, you can use the `!.` notation.

```html
<custom-element name="meta-demo">
  <element-state name="array" type="array">[{ "label": "human" }, { "label": "microbes" }]</element-state>

  <template>
    <repeat-list of="#array">
      <p>
        Index
        <slot name="!.index"></slot>
        of
        <slot name="!.length"></slot>
        species. Species:
        <slot name="$.label"></slot>
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
