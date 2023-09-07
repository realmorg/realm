---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: global-state
menuOrder: 6
title: "Element: global-state"
author: Ribhararnus Pracutian
description: The global state tag reference.
---

This element tag is used to define global state and can written anywhere in your HTML document, but the best practice is to put it in the top inside of `<web-app>` or `<body>` tag, so other developer can easily find it.

To render the state's value, use the `<slot>` tag with the attribute's name as the slot's name prefixed with `#` symbol and a `global` attribute without value.

<ref-section title="Attributes">
  <ref-item-def name="name">
    Global state's name
  </ref-item-def>
  <ref-item-def name="type">
    Global state's type (see supported types below)
  </ref-item-def>
  <ref-item-def name="type">
    Global state's storage (see supported storage below)
  </ref-item-def>
</ref-section>

<ref-section title="Supported Storage">
  <ref-item-def name="memory">
    Default storage, the value will be lost when the page is refreshed.
  </ref-item-def>
  <ref-item-def name="sessionStorage">
    The value will be saved in the browser's sessionStorage. It will persist until the user close the browser's tab.
  </ref-item-def>
  <ref-item-def name="localStorage">
    The value will be saved in the browser's localStorage. It will persist until the user clear the browser's localStorage.
  </ref-item-def>
</ref-section>

<ref-section title="Supported Types">
  <ref-item-def name="string">
    You can put any string inside the tag, as long as it's not contains any HTML tags.
  </ref-item-def>
  <ref-item-def name="number">
    Any integer or floating point number is allowed.
  </ref-item-def>
  <ref-item-def name="boolean">
    Only `true` or `false` is allowed.
  </ref-item-def>
  <ref-item-def name="array">
    The default value must be a valid JSON array.
  </ref-item-def>
  <ref-item-def name="object">
    The default value must be a valid JSON object.
  </ref-item-def>
</ref-section>

<ref-section title="Example">
  You can click the button in the <anchor-link href="/docs/learn/global-states">Global State</anchor-link> page, scroll down to the Storage section, and come back here.
</ref-section>

```html
<global-state
  name="cached-counter"
  type="number"
  storage="localStorage"></global-state>
<custom-element name="my-element">
  <template>
    Counter:
    <slot global name="#cached-counter"></slot>
  </template>
</custom-element>

<my-element></my-element>
```

<global-state name="cached-counter" type="number" storage="localStorage"></global-state>
<custom-element name="my-element">
<template>
Counter: <slot global name="#cached-counter"></slot>
</template>
</custom-element>

<realm-demo>
  <my-element></my-element>
</realm-demo>
