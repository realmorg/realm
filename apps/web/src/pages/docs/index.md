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
Realm, short for Reactive-Lightweight Markup Language, is a cutting-edge HTML framework that leverages Web Components to create dynamic web apps for building MVP. The framework approach is heavily uses HTML, minimizing the reliance on JavaScript.

Realm has been specifically designed to facilitate the rapid development of Minimum Viable Products (MVPs). To provide a clearer understanding of its capabilities, let's explore basic example:

```html
<custom-element name="your-custom-element-name">
  <element-attr name="realm" type="string">world</element-attr>
  <template>
    <strong>Hello <slot name="@realm"></slot>!</strong>
  </template>
</custom-element>

<!--
  Now you can use or reuse element anywhere in the page,
  as many as you want.
-->
<your-custom-element-name></your-custom-element-name>,
<your-custom-element-name realm="universe"></your-custom-element-name>,
<your-custom-element-name realm="multiverse"></your-custom-element-name>
```

The codes above will render:

<custom-element name="your-custom-element-name">
  <element-attr name="realm" type="string">world</element-attr>
  <template>
    <strong>Hello <slot name="@realm"></slot>!</strong>
  </template>
</custom-element>

<realm-demo>
  <your-custom-element-name></your-custom-element-name>,
  <your-custom-element-name realm="universe"></your-custom-element-name>,
  <your-custom-element-name realm="multiverse"></your-custom-element-name>
</realm-demo>

All you need is HTML, no tooling, no bundler, no compiler. You can view source or inspect element to see how it works.

In the <anchor-link href="/docs/learn">Learn</anchor-link> sections, we will dive into the functionality of Realm, including its reactivity, styling options, and other notable features.

## Why Realm?
Realm is specifically designed with indie makers in mind. If your goal is to rapidly prototype your ideas, Realm is the perfect solution. However, it may not be the ideal choice for developing complex applications. 🤷🏻‍♂️

While Realm excels in enabling fast prototyping, it is still capable of supporting production-ready applications. Take, for instance, this website as an example.

To understand the motivations behind building this framework, I have written an article called "HTML Developer Manifesto." It delves into the reasons and principles that drove the creation of Realm.

## Need help?
Please feel free to setup a new discussion with me at any time via 
<anchor-link href="https://github.com/realmorg/realm/discussions" target="_blank">Github Discussions</anchor-link>.
