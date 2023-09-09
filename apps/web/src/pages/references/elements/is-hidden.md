---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: is-hidden
menuOrder: 11
title: "Element: is-hidden"
author: Ribhararnus Pracutian
description: The `is-hidden` tag reference.
---

This element tag is reversed version of <anchor-link href="/references/elements/is-visible">`<is-visible>`</anchor-link> tag. It will hide its content if the condition is true.

<ref-section title="Attributes">
  <ref-item-def name="value">
    Must be custom element's attribute or state name.
  </ref-item-def>
  <ref-item-def name="[...logic ops]">
    Only allowed one of logic operators (see supported in
    <anchor-link href="/references/misc/comparison-operators">Comparison Operators</anchor-link> page).
  </ref-item-def>
</ref-section>

<ref-section title="Example"></ref-section>

```html
<custom-element name="my-element">
  <element-state name="count" type="number">0</element-state>
  <element-flow>
    <trigger-event click="TheButton">
      <set-state name="count" value="2" mutate="+"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    <is-hidden value="#count" gt="10">
      <div>You'll always see me until you click me 6 times 😢.</div>
    </is-hidden>
    <slot name="#count"></slot>
    <button ref="TheButton">Add!</button>
  </template>
</custom-element>

<my-element></my-element>
```

<custom-element name="my-element">
  <element-state name="count" type="number">0</element-state>
  <element-flow>
    <trigger-event click="TheButton">
      <set-state name="count" value="2" mutate="+"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    <is-hidden value="#count" gt="10">
      <div>You'll always see me until you click me 6 times 😢.</div>
    </is-hidden>
    <slot name="#count"></slot>
    <button ref="TheButton">Add!</button>
  </template>
</custom-element>

<realm-demo>
  <my-element></my-element>
</realm-demo>
