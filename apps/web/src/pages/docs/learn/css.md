---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 10. Dynamic Styles
menuOrder: 10
title: Dynamic CSS Styling inside Custom Element
author: Ribhararnus Pracutian
description: Learn how to style your custom elements dynamically with custom selector.
---

One of the enjoyable aspects of Realm is the ability to style your custom elements and access attributes, states, and global states as CSS variables. This feature adds a layer of flexibility and convenience to your styling process. By treating these dynamic values as CSS variables, you can easily incorporate them into your stylesheets and create dynamic, responsive designs.

Additionally, Realm allows you to utilize custom CSS selectors to implement logic within your stylesheets. This empowers you to apply specific styles based on the element's attributes, states, or global states. By leveraging custom CSS selectors, you can achieve more advanced and nuanced styling behaviors, making your custom elements even more versatile and adaptable.

```html
<custom-element name="color-box">
  <element-attr name="color" type="string">hotpink</element-attr>
  <template>
    <style>
      :host {
        display: inline-flex;
        width: 100px;
        height: 100px;
        background-color: var(--attr-color);
      }
    </style>

    <slot name="@color"></slot>
  </template>
</custom-element>

<color-box color="teal"></color-box>
<color-box color="red"></color-box>
<color-box color="#00c"></color-box>
```

<custom-element name="color-box">
  <element-attr name="color" type="string">hotpink</element-attr>
  <template>
    <style>
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 100px;
        background-color: var(--attr-color);
      }
    </style>
    <slot name="@color"></slot>
  </template>
</custom-element>

<realm-demo>
  <color-box color="teal"></color-box>
  <color-box color="red"></color-box>
  <color-box color="#00c"></color-box>
</realm-demo>

## Why `style` tag should be placed inside `template` tag?

When working with custom elements inside `<body>` tag (not using `<import-element>` tag), it's important to ensure that your HTML document remains valid and adheres to the HTML5 standard. Placing the `<style>` tag outside the `<template>` tag in your document would result in an invalid HTML5 structure.

According to the HTML5 specifications, the `<style>` tag is only allowed within the `<head>` or `<template>` tags. If you place the `<style>` tag outside the `<template>` tag, it will deviate from the standard and render your document invalid.

## CSS Variables

Realm allows you to access attributes, states, and global states as CSS variables. This feature is useful for creating dynamic, responsive designs. You can access these values by using the `--attr-`, `--state-`, and `--global-` prefixes.

```html
<custom-element name="my-favorite-color">
  <element-state name="color" type="string">hotpink</element-state>

  <element-flow>
    <trigger-event change="ColorSelector">
      <set-state name="color" value="$.target.value" from="event"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <style>
      :host {
        display: block;
        background-color: var(--state-color);
      }
    </style>

    My favorite color is:
    <select ref="ColorSelector">
      <option value="red">Red</option>
      <option value="blue">Blue</option>
      <option value="green">Green</option>
    </select>
  </template>
</custom-element>

<my-favorite-color></my-favorite-color>
```

<custom-element name="my-favorite-color">
  <element-state name="color" type="string">hotpink</element-state>

  <element-flow>
    <trigger-event change="ColorSelector">
      <set-state name="color" value="$.target.value" from="event"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <style>
      :host {
        display: block;
        padding: 20px;
        background-color: var(--state-color);
      }
    </style>
    My favorite color is:
    <select ref="ColorSelector">
      <option value="hotpink">hotpink</option>
      <option value="blue">Blue</option>
      <option value="green">Green</option>
    </select>
  </template>
</custom-element>

<realm-demo>
  <my-favorite-color></my-favorite-color>
</realm-demo>

## CSS Logic

Realm allows you to use custom CSS selectors to implement logic within your stylesheets. This empowers you to apply specific styles based on the element's attributes, states, or global states.

We are adding a new hacky features to CSS selector (powered by CSSOM). You can use `gt`, `lt`, `eq`, and more to compare the value of the attribute, state, or global state. See the complete list of comparison operators in <anchor-link href="/references/misc/comparison-operators">Comparison Operators reference</anchor-link>.

The attribute selector is used to apply styles based on the element's attribute value. The attribute selector is denoted by the `\@` symbol for attributes, `\#` symbol for states.

The following example demonstrates how to use custom CSS selectors to apply different styles based on the element's attribute value.

```html
<custom-element name="colorful-number">
  <element-attr name="number" type="number">0</element-attr>
  <element-state name="counter" type="number">0</element-state>

  <element-flow>
    <trigger-event click="AddCounterBtn">
      <set-state name="counter" value="1" mutate="+"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <style>
      :host .colorbox {
        width: 20px;
        height: 20px;
        display: inline-block;
      }
      /* Conditional compares from attribute */
      :host([\@number][gt="5"]) .attribute {
        background: teal;
      }
      :host([\@number][eq="5"]) .attribute {
        background: blue;
      }
      :host([\@number][lt="5"]) .attribute {
        background: hotpink;
      }
      /* Conditional compares from state */
      :host([\#counter][gt="5"]) .state {
        background: teal;
      }
      :host([\#counter][eq="5"]) .state {
        background: blue;
      }
      :host([\#counter][lt="5"]) .state {
        background: hotpink;
      }
    </style>
    <div class="colorbox attribute"></div>
    <div class="colorbox state"></div>
    <div>
      <button ref="AddCounterBtn">
        Add Counter
        <slot name="#counter"></slot>
      </button>
    </div>
  </template>
</custom-element>

<colorful-number number="2"></colorful-number>
<colorful-number number="3"></colorful-number>
<colorful-number number="5"></colorful-number>
<colorful-number number="8"></colorful-number>
<colorful-number number="11"></colorful-number>
```

<custom-element name="colorful-number">
  <element-attr name="number" type="number">0</element-attr>
  <element-state name="counter" type="number">0</element-state>

  <element-flow>
    <trigger-event click="AddCounterBtn">
      <set-state name="counter" value="1" mutate="+"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <style>
      :host .colorbox {
        width: 20px;
        height: 20px;
        display: inline-block;
      }
      /* Conditional compares from attribute */
      :host([\@number][gt="5"]) .attribute {
        background: teal;
      }
      :host([\@number][eq="5"]) .attribute {
        background: blue;
      }
      :host([\@number][lt="5"]) .attribute {
        background: hotpink;
      }
      /* Conditional compares from state */
      :host([\#counter][gt="5"]) .state {
        background: teal;
      }
      :host([\#counter][eq="5"]) .state {
        background: blue;
      }
      :host([\#counter][lt="5"]) .state {
        background: hotpink;
      }
    </style>
    <div class="colorbox attribute"></div>
    <div class="colorbox state"></div>
    <div>
      <button ref="AddCounterBtn">Add Counter <slot name="#counter"></slot></button>
    </div>
  </template>
</custom-element>

<realm-demo>
  <colorful-number number="2"></colorful-number>
  <colorful-number number="3"></colorful-number>
  <colorful-number number="5"></colorful-number>
  <colorful-number number="8"></colorful-number>
  <colorful-number number="11"></colorful-number>
</realm-demo>

To catch value for global state, you can use `global` keyword. For example:

```html
<global-state name="counter" type="number">0</global-state>
<global-state name="color" type="string">hotpink</global-state>

<custom-element name="global-colorful-box">
  <element-flow>
    <trigger-event input="AddCounter">
      <set-state global name="counter" value="1" mutate="+"></set-state>
    </trigger-event>
    <trigger-event input="ColorInput">
      <set-state
        global
        name="color"
        value="$.target.value"
        from="event"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    <style>
      :host .colorbox {
        width: 20px;
        height: 20px;
        display: inline-block;
      }
      :host([\#counter][global][gt="5"]) .colorbox {
        background: teal;
      }
      :host([\#counter][global][eq="5"]) .colorbox {
        background: blue;
      }
      :host([\#counter][global][lt="5"]) .colorbox {
        background: hotpink;
      }
      :host .global-color {
        width: 20px;
        height: 20px;
        display: inline-block;
        background: var(--global-color);
      }
    </style>
    <div class="colorbox"></div>
    <button ref="AddCounter">
      Add
      <slot global name="#counter"></slot>
    </button>
    <div class="colorbox global-color"></div>
    <div>
      Set global color to:
      <input ref="ColorInput" />
    </div>
  </template>
</custom-element>

<global-colorful-box></global-colorful-box>
<global-colorful-box></global-colorful-box>
```

<global-state name="counter" type="number">0</global-state>
<global-state name="color" type="string">hotpink</global-state>

<custom-element name="global-colorful-box">
  <element-flow>
    <trigger-event click="AddCounter">
      <set-state global name="counter" value="1" mutate="+"></set-state>
    </trigger-event>
    <trigger-event input="ColorInput">
      <set-state global name="color" value="$.target.value" from="event"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    <style>
      :host .colorbox {
        width: 20px;
        height: 20px;
        display: inline-block;
      }
      :host([\#counter][global][gt="5"]) .colorbox {
        background: teal;
      }
      :host([\#counter][global][eq="5"]) .colorbox {
        background: blue;
      }
      :host([\#counter][global][lt="5"]) .colorbox {
        background: hotpink;
      }
      :host .global-color {
        width: 20px;
        height: 20px;
        display: inline-block;
        background: var(--global-color);
      }
    </style>
    <div>
      <div class="colorbox"></div>
      <button ref="AddCounter">Add <slot global name="#counter"></slot></button>
    <div>
    <div>
      <div class="colorbox global-color"></div>
      Set global color to: <input ref="ColorInput" _value:global="#color" />
    </div>
  </template>
</custom-element>

<realm-demo>
  <global-colorful-box></global-colorful-box>
  <br />
  <global-colorful-box></global-colorful-box>
</realm-demo>

## Awesome, let's continue to the next one

Congratulations on making it this far! That's awesome! Now, let's keep the momentum going and move on to the next topic. There's still more exciting information and learning ahead, in the upcoming section, we will learn about <anchor-link href="/docs/learn/events">Events and Communication between Elements</anchor-link>.

We will explore how various events are triggered and how elements communicate with each other. This includes events such as when an element is mounted, when attributes / states are updated, or sending event from child to parent element.

By understanding these event mechanisms and communication patterns, you will gain valuable insights into the dynamic behavior and interactions between elements in Realm. This knowledge will empower you to build more interactive and responsive web applications.
