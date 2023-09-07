---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: repeat-list
menuOrder: 12
title: "Element: repeat-list"
author: Ribhararnus Pracutian
description: The `repeat-list` tag reference.
---

This element tag is used to render a list of items from an array. You can bind the item's value as custom element's attribute or render it using the `<slot>` tag. The item's value can be accessed using the `$.` prefix.

<ref-section title="Attributes">
  <ref-item-def name="of">
    Data source (must be an array) from the local state.
  </ref-item-def>
</ref-section>

You can also access the meta of the current item using the `!.` prefix.

<ref-section title="Meta">
  <ref-item-def name="index">
    Index of the current item.
  </ref-item-def>
  <ref-item-def name="length">
    Length of the array.
  </ref-item-def>
</ref-section>

<ref-section title="Example"></ref-section>

```html
<custom-element name="nested-element">
  <element-attr name="content" type="string"></element-attr>
  <template>
    <style>
      :host {
        display: block;
        background: red;
        padding: 10px;
      }
    </style>
    <slot name="@content"></slot>
  </template>
</custom-element>

<custom-element name="my-element">
  <element-state name="array" type="array">
    [{ "label": "Hello" }, { "label": "World" }]
  </element-state>
  <template>
    <repeat-list of="#array">
      <slot name="!.index"></slot>
      is
      <slot name="$.label"></slot>
      <nested-element _content="$.label"></nested-element>
    </repeat-list>
  </template>
</custom-element>

<my-element></my-element>
```

<custom-element name="nested-element">
  <element-attr name="content" type="string"></element-attr>
  <template>
    <style>
      :host {
        display: block;
        background: hotpink;
        padding: 10px;
      }
    </style>
    <slot name="@content"></slot>
  </template>
</custom-element>

<custom-element name="my-element">
  <element-state name="array" type="array">
    [{ "label": "Hello" }, { "label": "World" }]
  </element-state>
  <template>
    <repeat-list of="#array">
      <slot name="!.index"></slot>
      is
      <slot name="$.label"></slot>
      <nested-element _content="$.label"></nested-element>
    </repeat-list>
  </template>
</custom-element>

<realm-demo>
  <my-element></my-element>
</realm-demo>
