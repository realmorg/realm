---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: trigger-event
menuOrder: 1
title: "Flow: trigger-event"
author: Ribhararnus Pracutian
description: The `trigger-event` flow reference.
---

This element tag is used to invoke an action of any selectors that has `ref` attribute within custom element. Only live inside a <anchor-link href="/references/elements/element-flow">`<element-flow>`</anchor-link> tag.

<ref-section title="Attributes">
  <ref-item-def name="[...native event]">
    Only allowed one of native element event, e.g `click`, `input`, `change`, etc.
  </ref-item-def>
</ref-section>

<ref-section title="Example"></ref-section>

```html
<custom-element name="my-element">
  <element-state name="content" type="string"></element-state>
  <element-flow>
    <trigger-event input="Input">
      <set-state name="content" value="$.target.value" from="event"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    <input ref="Input" type="text" />
    <div>
      Content:
      <slot name="#content"></slot>
    </div>
  </template>
</custom-element>

<my-element></my-element>
```

<custom-element name="my-element">
  <element-state name="content" type="string"></element-state>
  <element-flow>
    <trigger-event input="Input">
      <set-state name="content" value="$.target.value" from="event"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    <input ref="Input" type="text" />
    <div>Content: <slot name="#content"></slot></div>
  </template>
</custom-element>

<realm-demo>
  <my-element></my-element>
</realm-demo>
