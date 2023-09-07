---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: element-attr
menuOrder: 3
title: "Element: element-attr"
author: Ribhararnus Pracutian
description: The element's attribute tag reference.
---

This element tag is used to define a custom element's attributes, and only allowed to be used inside a <anchor-link href="/references/elements/custom-element">`<custom-element>`</anchor-link> tag. The default value can be set inside the tag.

To render the attribute's value, use the `<slot>` tag with the attribute's name as the slot's name prefixed with `@` symbol.

<ref-section title="Attributes">
  <ref-item-def name="name">
    Custom Element's name
  </ref-item-def>
  <ref-item-def name="type">
    Custom Element's type (see supported types below)
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
</ref-section>

<ref-section title="Example"></ref-section>

```html
<custom-element name="my-element">
  <element-attr name="name" type="string">Default Value</element-attr>
  <template>
    My name is
    <slot name="@name"></slot>
  </template>
</custom-element>

<my-element name="R. Pracutian"></my-element>
```

<custom-element name="my-element">
  <element-attr name="name" type="string">Default Value</element-attr>
  <template>
    My name is <slot name="@name"></slot>
  </template>
</custom-element>

<realm-demo>
  <my-element name="R. Pracutian"></my-element>
</realm-demo>
