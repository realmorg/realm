---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: element-flow
menuOrder: 5
title: "Element: element-flow"
author: Ribhararnus Pracutian
description: The element's flow tag reference.
---

This element tag is used to define a custom element's behaviors, and only allowed to be used inside a <anchor-link href="/references/elements/custom-element">`<custom-element>`</anchor-link> tag. Under this element tag, currently there only 2 tags allowed: <anchor-link href="/references/flows/trigger-event">`<trigger-event>`</anchor-link> and <anchor-link href="/references/flows/listen-event">`<listen-event>`</anchor-link>, which is used to trigger and listen to events.

<ref-section title="Allowed Children">
  <ref-item-def name="trigger-event">
    Reference link: <anchor-link href="/references/flows/trigger-event">&lt;trigger-event&gt;</anchor-link>
  </ref-item-def>
  <ref-item-def name="listen-event">
    Reference link: <anchor-link href="/references/flows/listen-event">&lt;listen-event&gt;</anchor-link>
  </ref-item-def>
</ref-section>

<ref-section title="Example"></ref-section>

```html
<custom-element name="my-element">
  <element-state name="count" type="number">0</element-state>
  <element-state name="content" type="html"></element-state>

  <element-flow>
    <trigger-event click="TheButton">
      <set-state name="count" value="1" mutate="+"></set-state>
      <set-state name="content" from="localState">
        New Value
        <strong>$.count</strong>
      </set-state>
    </trigger-event>
  </element-flow>

  <template>
    <button ref="TheButton">Click Me!</button>
    <br />
    <slot name="#content"></slot>
  </template>
</custom-element>

<my-element></my-element>
```

<custom-element name="my-element">
  <element-state name="count" type="number">0</element-state>
  <element-state name="content" type="html"></element-state>

  <element-flow>
    <trigger-event click="TheButton">
      <set-state name="count" value="1" mutate="+"></set-state>
      <set-state name="content" from="localState">
        New Value <strong>$.count</strong>
      </set-state>
    </trigger-event>
  </element-flow>

  <template>
    <button ref="TheButton">Click Me!</button><br />
    <slot name="#content"></slot>
  </template>
</custom-element>

<realm-demo>
  <my-element></my-element>
</realm-demo>
