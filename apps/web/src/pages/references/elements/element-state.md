---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: element-state
menuOrder: 4
title: "Element: element-state"
author: Ribhararnus Pracutian
description: The element's state tag reference.
---

This element tag is used to define a custom element's state, and only allowed to be used inside a <anchor-link href="/references/elements/custom-element">`<custom-element>`</anchor-link> tag. The default value can be set using the HTML or content inside the tag.

To render the state's value, use the `<slot>` tag with the attribute's name as the slot's name prefixed with `#` symbol.

<ref-section title="Attributes">
  <ref-item-def name="name">
    Element state's name
  </ref-item-def>
  <ref-item-def name="type">
    Element state's type (see supported types below)
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
  <ref-item-def name="html">
    Similar to string but you can put any HTML tags inside the tag.
  </ref-item-def>
</ref-section>

<ref-section title="Example"></ref-section>

```html
<custom-element name="my-element">
  <element-state name="content" type="html">
    <strong>Hello World</strong>
  </element-state>
  <template>
    Content:
    <slot name="#content"></slot>
  </template>
</custom-element>

<my-element></my-element>
```

<custom-element name="my-element">
  <element-state name="content" type="html"><strong>Hello World</strong></element-state>
  <template>
    Content: <slot name="#content"></slot>
  </template>
</custom-element>

<realm-demo>
  <my-element></my-element>
</realm-demo>
