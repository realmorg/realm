---
layout: ../../layouts/Post.astro
title: Introducing Unicons by Realm
author: Ribhararnus Pracutian
description: Universal Web Component Icons (Unicons) is a collection of icons ported from React Icons to be used as web components. It's designed to be used accross the web, so you can use icons from any website not limited to framework or library.
tags: [release, announcement]
date: 2023-29-09
---

The web is a visual medium. Icons are a big part of how we communicate. They’re also a big part of how we interact with the web. Icons are everywhere, and they’re used for everything.

All frameworks have their own icon set, but they’re all different. To import them, you have to use a different syntax. And they’re all different sizes, so you have to use a different syntax to import them.

So, we decided to create a universal icon set that works across all frameworks. It’s called Unicons, stands for Universal Web Component Icons, is a collection of icons ported from [React Icons](https://react-icons.github.io/react-icons/) to be used as web components. It's designed to be used accross the web, so you can use icons from any website not limited to framework or library.

The website can be found at [https://unicons.realm.codes](https://unicons.realm.codes/).

## Installation

You can use unicons in your project by installing Realm. And then you can copy the icon you want to use from [https://unicons.realm.codes](https://unicons.realm.codes/).

```html
<!DOCTYPE html>
<html>
  <head>
    ...
    <script
      src="https://cdn.jsdelivr.net/npm/@realmorg/realm/dist/realm.production.min.js"
      type="module"></script>
    <link
      href="https://cdn.jsdelivr.net/npm/@realmorg/realm/dist/realm.min.css"
      rel="stylesheet" />
    ...
  </head>

  <body>
    <import-element
      from="https://unicons.realm.codes/ICON-NAME.html"></import-element>

    <!-- You can use icon custom element's tag in your web page or framework -->
    <icon-name-element></icon-name-element>
  </body>
</html>
```

## Example #1

Basic usage of Unicons, you can copy the icon you want to use from [https://unicons.realm.codes](https://unicons.realm.codes/).

```html
<import-element
  from="https://unicons.realm.codes/fc-landscape.html"></import-element>
<icon-fc-landscape></icon-fc-landscape>
```

<realm-demo>
  <import-element from="https://unicons.realm.codes/fc-landscape.html"></import-element>
  <icon-fc-landscape></icon-fc-landscape>
</realm-demo>

## Example #2

Import icon inside a custom element.

```html
<custom-element name="save-button">
  <template>
    <style>
      :host {
        display: inline-block;
      }
      button {
        display: inline-flex;
        place-items: center;
        padding: 8px 12px;
        background: teal;
        font-weight: 900;
        border: 0;
        border-radius: 4px;
        cursor: pointer;
        gap: 4px;
      }
    </style>
    <button>
      <import-element
        from="https://unicons.realm.codes/fc-flash-on.html"></import-element>
      <icon-fc-flash-on size="20px"></icon-fc-flash-on>
      <span>
        <slot children></slot>
      </span>
    </button>
  </template>
</custom-element>

<save-button onclick="alert('Save mutation to API')">Save changes</save-button>
```

<custom-element name="save-button">
  <template>
    <style>
      :host {
        display: inline-block;
      }
      button {
        display: inline-flex;
        place-items: center;
        padding: 8px 12px;
        background: teal;
        font-weight: 900;
        border: 0;
        border-radius: 4px;
        cursor: pointer;
        gap: 4px;
      }
    </style>
    <button>
      <import-element from="https://unicons.realm.codes/fc-flash-on.html"></import-element>
      <icon-fc-flash-on size="20px"></icon-fc-flash-on>
      <span>
        <slot children></slot>
      </span>
    </button>
  </template>
</custom-element>
<save-button onclick="alert('Save mutation to API')">Save changes</save-button>

## Final words

The website is still in beta, so there are bug related with `import-element` network request, but overall, it's working as expected, if you don't import multiple icon (hundred of icons) in the same page.
