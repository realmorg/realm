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
It's a key-value pair that you can add to any element. For example, `<my-element name="Ribhararnus"></my-element>`. You can read more about it here: <anchor-link href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes" target="_blank">MDN: HTML Attributes</anchor-link>.

But right now we want to learn how to render dynamic data from attributes.

## Render Dynamic Data from Attributes
Let's adds a new attribute to your custom element, and render it.

```html
<custom-element name="hello-world">
  <element-attr name="name" type="string">anonymous</element-attr>
  <template>
    <strong>Hello world, my name is <slot name="@name"></slot>!</strong>
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
You're defining a new attribute with `<element-attr>` tag. The `name` attribute is defining the name of custom element's attribute, and the `type` is the data type, you need to define it because it's important (you can see supported types in <anchor-link href="/references/elements/element-attr">`element-attr reference`</anchor-link>).

Then, you can render the attribute value with `<slot>` tag. The `name` attribute is the name of the attribute, and the `@` prefix is required. The `@` prefix is used to distinguish between attribute and state (we'll learn about slot name's prefix after this).

You can also set default value or fallback value inside `<element-attr>` tag. If the attribute is not defined, it will use the default value.

## Isn't your custom element little bit boring?
Let's add some excitement by diving into the fascinating world of reactivity <anchor-link href="/docs/learn/states">using states</anchor-link>.
