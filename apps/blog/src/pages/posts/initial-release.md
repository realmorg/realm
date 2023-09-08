---
layout: ../../layouts/Post.astro
title: Initial Release 🎉
author: Ribhararnus Pracutian
description: Introducing Realm, a new way to build web application. HTML Framework for building MVP.
tags: [release, announcement]
date: 2023-09-09
---

Realm is a new way to build web apps using native Web Components. With no bundler or compiler required, it offers a straightforward HTML framework that relies less on JavaScript dependencies.

After initial iteration, we are happy to announce that Realm is now available for public use. We are excited to see what you will build with it!

## Mindset

Realm is designed for indie-techpreunership, build an MVP as fast as possible, without worrying about the complexity of build process and tooling. We only need: HTML, CSS, maybe with a little bit of JavaScript.

We're so back to the basic, we're using HTML as our main language, we're using CSS as our main styling language, and we're using JavaScript (if it become complex and needed).

If you have a Browser and Text Editor, you can build your web app. Just install CDN to your HTML document, and you're ready to go.

## Features

There are several features that Realm offers:

- **No bundler or compiler required**. Realm is designed to be used without any bundler or compiler, it's live inside your HTML document.
- **Reactivity without JavaScript**. Realm is using HTML as its main language, so you can use HTML to define your custom element's state. We also offers a global state by default.
- **Reusability accross the web**. Realm is designed to be used accross the web, so you can use any pre-defined or existing custom element from any website (by enabling CORS).

There's more features that Realm offers, please check our <anchor-link href="https://realm.codes/docs">Documentations</anchor-link> to learn more.

## Examples

```html
<custom-element name="initial-release-element">
  <element-attr name="message" type="string">Default message</element-attr>
  <template>
    <div>
      Announcement:
      <slot name="@message"></slot>
    </div>
  </template>
</custom-element>

<initial-release-element message="Initial Release 🎉"></initial-release-element>
```

<custom-element name="initial-release-element">
  <element-attr name="message" type="string">Default message</element-attr>
  <template>
    <div>Announcement: <slot name="@message"></slot></div>
  </template>
</custom-element>

<realm-demo>
  <initial-release-element message="Initial Release 🎉"></initial-release-element>
</realm-demo>

As you can see we can define a native custom element using `<custom-element>` tag, and we can define its attribute using `<element-attr>` tag, and finally we're render our custom element inside `<template>` tag.

That's so simple right?, we don't need JavaScript to define our custom element, we don't need to use any bundler or compiler, we're just using simple HTML tag to define our custom element.

## Give it a try!

Please give it a try and let us know what you think! We are looking forward to your feedback.
