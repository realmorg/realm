---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: set-attr
menuOrder: 1
title: "Action: set-attr"
author: Ribhararnus Pracutian
description: The `set-attr` action reference.
---

This action tag is used to set an attribute of Custom Element. It's rare case that we need to set an attribute. But in Realm it's possible to do that.

<ref-section title="Attributes">
  <ref-item-def name="name">
    Defined custom element attribute's name
  </ref-item-def>
  <ref-item-def name="value">
    It can be static or dynamic, if this element tag has `from` attribute, then the value will be dynamic and the value itself should be a selector prefixed with `$.` notation.
  </ref-item-def>
  <ref-item-def name="from">
    The data source selector, see the complete list on <anchor-link href="/references/misc/data-source">Data Source</anchor-link> page.
  </ref-item-def>
  <ref-item-def name="toggle">
    If it's present, then the state will be toggled between `true` and `false` based on the value of the state.
  </ref-item-def>
</ref-section>

<ref-section title="Example"></ref-section>
If you inspect the `<my-element>` from the devtools, you will see the `owner` attribute will changed once you click the button.

```html
<custom-element name="my-element">
  <element-attr name="owner" type="string">No Owner</element-attr>
  <element-flow>
    <trigger-event click="Button">
      <set-attr name="owner" value="New Owner"></set-attr>
    </trigger-event>
  </element-flow>
  <template>
    <slot name="@owner"></slot>
    <button ref="Button">Click me!</button>
  </template>
</custom-element>

<my-element></my-element>
<br />
<my-element owner="R. Pracutian"></my-element>
```

<custom-element name="my-element">
  <element-attr name="owner" type="string">No Owner</element-attr>
  <element-flow>
    <trigger-event click="Button">
      <set-attr name="owner" value="New Owner"></set-attr>
    </trigger-event>
  </element-flow>
  <template>
    <slot name="@owner"></slot>
    <button ref="Button">Click me!</button>
  </template>
</custom-element>

<realm-demo>
  <my-element></my-element>
  <br />
  <my-element owner="R. Pracutian"></my-element>
</realm-demo>
