---
layout: ../../layouts/Docs.astro
menuGroup: docs
menuTitle: Introduction
menuOrder: 1
title: Introduction
author: Ribhararnus Pracutian
description: What and Why is Realm? This page will give you a brief introduction to Realm.
---

## What is Realm?

Realm, short for Reactive-Lightweight Markup Language, is a cutting-edge HTML framework that uses Web Components to create dynamic web apps, making it ideal for rapidly building Minimum Viable Products (MVPs). The framework relies heavily on HTML, reducing the need for extensive JavaScript.

Let's explore a basic example to better understand Realm's capabilities:

```html
<custom-element name="my-element">
  <element-attr name="realm" type="string">world</element-attr>
  <template>
    I'm from the
    <strong>
      <slot name="@realm"></slot>
    </strong>
  </template>
</custom-element>

<!--
  Now you can use or reuse element anywhere in the page,
  as many as you want.
-->
<my-element></my-element>
<my-element realm="universe"></my-element>
```

The codes above will render:

<custom-element name="my-element">
  <element-attr name="realm" type="string">world</element-attr>
  <template>
    I'm from the
    <strong>
      <slot name="@realm"></slot>
    </strong>
  </template>
</custom-element>

<realm-demo>
  <my-element></my-element>,
  <my-element realm="universe"></my-element>,
  <my-element realm="multiverse"></my-element>
</realm-demo>

Realm empowers you with the simplicity of HTML, eliminating the need for additional tools, bundlers, or compilers. You can easily inspect the source code or elements to see how it works.

In the <anchor-link href="/docs/learn">Learn</anchor-link> sections, we will explore Realm's functionality, including its reactivity, reusability, styling options, and other notable features.

## Why Choose Realm?

Realm is tailor-made for indie makers seeking rapid prototyping capabilities. It's the perfect solution for quickly bringing your ideas to life. However, for complex applications, you might want to consider alternative options. 🤷🏻‍♂️

While Realm excels in enabling fast prototyping, it's also capable of supporting production-ready applications, as demonstrated by this website.

To gain insight into the motivations behind building this framework, I've written an article called the "<anchor-link href="https://dev.to/oknoorap/i-built-webcomponents-based-framework-i-am-html-developer-2jjb" target="_blank">HTML Developer Manifesto</anchor-link>," which delves into the principles that drove the creation of Realm.

## Need help?

If you have any questions or need assistance, please don't hesitate to start a discussion on
<anchor-link href="https://github.com/realmorg/realm/discussions" target="_blank">Github Discussions</anchor-link>.
