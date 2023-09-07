---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: trigger-element
menuOrder: 7
title: "Action: trigger-element"
author: Ribhararnus Pracutian
description: The `trigger-element` action reference.
---

The `trigger-element` action tag is used to trigger an element's action, it's useful when we want to trigger an element's action from another element by using `ref` as the selector.

<ref-section title="Attributes">
  <ref-item-def name="[...native event]">
    The native event name, with the value of the `ref` attribute as the selector.
  </ref-item-def>
</ref-section>

<ref-section title="Examples"></ref-section>

```html
<custom-element name="my-element">
  <element-state name="number" type="number">0</element-state>
  <element-flow>
    <trigger-event click="ProxyButton">
      <trigger-element click="Button"></trigger-element>
    </trigger-event>
    <trigger-event click="Button">
      <set-state name="number" value="1" mutate="+"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    <div><slot name="#number"></slot></div>
    <button ref="ProxyButton">Proxy button</button>
    <button ref="Button">Click me!</button>
  </template>
</custom-element>
```

<custom-element name="my-element">
  <element-state name="number" type="number">0</element-state>
  <element-flow>
    <trigger-event click="ProxyButton">
      <trigger-element click="Button"></trigger-element>
    </trigger-event>
    <trigger-event click="Button">
      <set-state name="number" value="1" mutate="+"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    <div><slot name="#number"></slot></div>
    <button ref="ProxyButton">Proxy button</button>
    <button ref="Button">Click me!</button>
  </template>
</custom-element>

<realm-demo>
  <my-element></my-element>
</realm-demo>
