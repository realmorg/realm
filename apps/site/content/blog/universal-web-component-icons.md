---
title: Introducing Unicons by Realm
description: Universal Web Component Icons (Unicons) is a collection of icons ported from React Icons to be used as web components. It's designed to be used accross the web, so you can use icons from any website not limited to framework or library.
date: 2023-09-29
author: Ribhararnus Pracutian
nav: Introducing Unicons
---

# Introducing Unicons by Realm

*29 September 2023 · Ribhararnus Pracutian*

> This post is about REALM v1 and Unicons v1. Its code uses v1 syntax, and unicons.realm.codes is offline. See [Migrating from v1](/docs/migrating-from-v1/) and [realmorg/unicons](https://github.com/realmorg/unicons).

The web is a visual medium. Icons are a big part of how we communicate. They’re also a big part of how we interact with the web. Icons are everywhere, and they’re used for everything.

All frameworks have their own icon set, but they’re all different. To import them, you have to use a different syntax. And they’re all different sizes, so you have to use a different syntax to import them.

So, we decided to create a universal icon set that works across all frameworks. It’s called Unicons, stands for Universal Web Component Icons, is a collection of icons ported from [React Icons](https://react-icons.github.io/react-icons/) to be used as web components. It's designed to be used accross the web, so you can use icons from any website not limited to framework or library.

The website can be found at [realm.js.org/unicons](/unicons/).

## Installation

You can use unicons in your project by installing Realm. And then you can copy the icon you want to use from [https://github.com/realmorg/unicons](https://github.com/realmorg/unicons).

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

Basic usage of Unicons, you can copy the icon you want to use from [https://github.com/realmorg/unicons](https://github.com/realmorg/unicons).

```html
<import-element
  from="https://unicons.realm.codes/fc-landscape.html"></import-element>
<icon-fc-landscape></icon-fc-landscape>
```

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

## Final words

The website is still in beta, so there are bug related with `import-element` network request, but overall, it's working as expected, if you don't import multiple icon (hundred of icons) in the same page.
