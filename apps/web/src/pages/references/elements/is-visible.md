---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: is-visible
menuOrder: 10
title: "Element: is-visible"
author: Ribhararnus Pracutian
description: The `is-visible` tag reference.
---

This element tag is used to adds visibility logic inside a custom element. It will render its content if the condition is true.

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
  <element-attr name="is-attr-true" type="boolean">false</element-attr>
  <element-state name="is-state-true" type="boolean">false</element-state>
  <element-flow>
    <trigger-event click="TheButton">
      <set-state toggle name="is-state-true" value="$.is-state-true" from="localState">
    </trigger-event>
  </element-flow>
  <template>
    <is-visible value="@is-attr-true" eq="true">
      It's attribute visible.
    </is-visible>
    <is-visible value="#is-state-true" eq="true">
      It's state visible.
    </is-visible>
    <button ref="TheButton">Toggle Me!</button>
  </template>
</custom-element>

<my-element is-attr-true="true"></my-element>
<br />
<my-element></my-element>
```

<custom-element name="my-element">
  <element-attr name="is-attr-true" type="boolean">false</element-attr>
  <element-state name="is-state-true" type="boolean">false</element-state>
  <element-flow>
    <trigger-event click="TheButton">
      <set-state toggle name="is-state-true" value="$.is-state-true" from="localState">
    </trigger-event>
  </element-flow>
  <template>
    <is-visible value="@is-attr-true" eq="true">
      It's attribute visible.
    </is-visible>
    <is-visible value="#is-state-true" eq="true">
      It's state visible.
    </is-visible>
    <button ref="TheButton">Toggle Me!</button>
  </template>
</custom-element>

<realm-demo>
  <my-element is-attr-true="true"></my-element>
  <br />
  <my-element></my-element>
</realm-demo>
