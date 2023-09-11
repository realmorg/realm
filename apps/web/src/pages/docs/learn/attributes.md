---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 02. Element Attributes
menuOrder: 2
title: Working with Element Attributes
author: Ribhararnus Pracutian
description: Define and render dynamic data from attributes.
---

## What is an Element Attribute?

An element attribute is a key-value pair that you can add to any HTML element. For example, `<my-element name="Ribhararnus"></my-element>`.

You can learn more about it here 👉 <anchor-link href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes" target="_blank">MDN: HTML Attributes</anchor-link>.

## Render Dynamic Data from Attributes

Let's add a new attribute to your custom element and render its value dynamically.

```html
<custom-element name="hello-world">
  <element-attr name="name" type="string">anonymous</element-attr>
  <template>
    <strong>
      Hello world, my name is
      <slot name="@name"></slot>
      !
    </strong>
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
  <template>
    <strong>Hello world, my name is <slot name="@name"></slot>!</strong>
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

## How does it work?

You define a new attribute using the `<element-attr>` tag. The name attribute specifies the name of the custom element's attribute, and the type indicates the data type. Defining the data type is important (you can find supported types in the <anchor-link href="/references/elements/element-attr">`element-attr`</anchor-link> reference).

You can render the attribute's value using the `<slot>` tag. The name attribute in `<slot>` corresponds to the attribute name, and the `@` prefix is required to distinguish it from state.

You can also set a default or fallback value inside the `<element-attr>` tag. If the attribute is not defined, it will use the default value.

## Isn't Your Custom Element a Bit Boring?

Let's add some excitement by exploring the fascinating world of reactivity using <anchor-link href="/docs/learn/states">states</anchor-link>.
