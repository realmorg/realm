---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 01. Hello world
menuOrder: 1
title: Create Your First Custom Element
author: Ribhararnus Pracutian
description: Learn how to create your first custom element with Realm.
---

Before we dive into learning Realm, please make sure you've already read the following sections: <anchor-link href="/docs">Introduction</anchor-link>, <anchor-link href="/docs/quick-start">Quick Start</anchor-link>, and <anchor-link href="/docs/mindset">Realm Mindset</anchor-link>.

If you're all set, let's start with our first tutorial. In this tutorial, you'll learn how to create your first custom element using Realm. But before we begin, let's understand what a custom element is.

## What is a Custom Element?

A custom element is a new HTML tag that you can create and use anywhere on your web page. It's similar to a `<div>` or `<span>` tag, but with a custom name. For example, `<my-custom-element></my-custom-element>`. You can find more information about it here 👉 <anchor-link href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components" target="_blank">MDN: Web Components</anchor-link>.

Creating a custom element can be quite complex. You need to create a class, extend it to `HTMLElement`, and register it with the browser. It's a lot of work. 😩

Fortunately, Realm simplifies the process of creating a custom element. You don't need to create a class, extend it to `HTMLElement`, or register it with the browser. You just need to create a new HTML file and define your custom element as an HTML tag 🎉.

## Your First Custom Element

Let's create a new HTML file and name it `hello-world.html`. Then, add the following code inside the `<body>` tag:

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

Now, open the file in your browser. In the address bar, you'll see `file:///path/to/hello-world.html` (replace `/path/to with your file path`). You don't need to set up a localhost to use Realm (see <anchor-link href="/docs/quick-start">Quick Start</anchor-link> for more details).

You'll see a blank page with the text `Hello world!`. That's your first custom element. 🎉

<custom-element name="hello-world">
  <template>
    <strong>Hello world!</strong>
  </template>
</custom-element>

<realm-demo>
  <hello-world></hello-world>
</realm-demo>

You can render it anywhere on your page, as many times as you want:

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

You might wonder why the element has a closing tag. It's because a custom element is not considered a <anchor-link href="https://developer.mozilla.org/en-US/docs/Glossary/Void_element" target="_blank">MDN: Void Element</anchor-link>.

Congratulations! You've successfully created your first custom element 🎉. Now, you know how to create a custom element. Let's move on to creating a more complex custom element: <anchor-link href="/docs/learn/attributes">Renders dynamic data from attributes</anchor-link>

Note: The `web-app` tag is optional, but it helps prevent glitches in the page.
