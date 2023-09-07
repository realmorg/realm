---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 01. Hello world
menuOrder: 1
title: Create Your First Custom Element
author: Ribhararnus Pracutian
description: Learn how to create your first custom element with Realm.
---

Make sure you already read the <anchor-link href="/docs">Intro</anchor-link>, <anchor-link href="/docs/quick-start">Quick Start</anchor-link>, and <anchor-link href="/docs/mindset">Realm Mindset</anchor-link> before we start to learn Realm.

If you're ready, let's start to our first tutorial. In this tutorial, you will learn how to create your first custom element with Realm. But before we start, let's learn what is a custom element.

## What is a Custom Element?
It's a new HTML tag that you can create and use anywhere in your page. It's like a `<div>` or `<span>` tag, but with a custom name. For example, `<my-custom-element></my-custom-element>`. You can read more about it here: <anchor-link href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components" target="_blank">MDN: Web Components</anchor-link>.

But it's complicated to create a custom element. You need to create a class, extend it to `HTMLElement`, and register it to the browser. It's a lot of work. 😩

Luckily, Realm makes it easy to create a custom element. You don't need to create a class, extend it to `HTMLElement`, and register it to the browser. You just need to create a new HTML file, write your custom element in HTML tag 🎉.

## Your First Custom Element
Let's create a new HTML file and name it `hello-world.html`. Then, write this code inside the `<body>` tag:

```html
<web-app>
  <custom-element name="hello-world">
    <template>
      <strong>Hello world!</strong>
    </template>
  </custom-element>

  <hello-world></hello-world>
</web-app>
```

Open the file in your browser. In address bar, you'll see `file:///path/to/hello-world.html` (replace `/path/to` with your file path). You don't need to setup a localhost to use Realm (read <anchor-link href="/docs/quick-start">Quick Start</anchor-link> page).

You'll see a blank page with a text `Hello world!`. That's your first custom element. 🎉

<custom-element name="hello-world">
  <template>
    <strong>Hello world!</strong>
  </template>
</custom-element>

<realm-demo>
  <hello-world></hello-world>
</realm-demo>

You can render it anywhere in your page, as many as you want:

```html
<hello-world></hello-world>

<p>
  Lorem ipsum dolor sit amet consectetur adipisicing elit. <hello-world>
</p>
```

<realm-demo>
<hello-world></hello-world>

<p>
  Lorem ipsum dolor sit amet consectetur adipisicing elit. <hello-world>
</p>
</realm-demo>

Okay cool, but why is the element have a closed-tag? It's because a custom element is not part of <anchor-link href="https://developer.mozilla.org/en-US/docs/Glossary/Void_element" target="_blank">MDN: Void Element</anchor-link>.

Congratulations! You just created your first custom element 🎉. Now you know how to create a custom element. Let's create a more complex custom element.

Let's make your element <anchor-link href="/docs/learn/attributes">renders dynamic data from attributes</anchor-link>.

P.S: The `web-app` tag is optional, but you need to use it to avoid glitch in the page.
