---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: set-timer
menuOrder: 3
title: "Action: set-timer"
author: Ribhararnus Pracutian
description: The `set-timer` action reference.
---

The `set-timer` action is used to set a timer to execute a function after a certain time. The `set-timer` action is useful for example to set a timer to hide a notification after a certain time.

Please use one of the following attributes:

<ref-section title="Attributes">
  <ref-item-def name="once">
    Time in milliseconds to execute the next actions. It's similar to `setTimeout` function in JavaScript.
  </ref-item-def>
  <ref-item-def name="every">
    Time in milliseconds to execute the next actions. It's similar to `setInterval` function in JavaScript.
  </ref-item-def>
</ref-section>

<ref-section title="Example">
  The following example below will enable the button after 3 seconds, and then disable the button again after the button is clicked. The counter will be increased every 50 milliseconds.
</ref-section>

```html
<custom-element name="my-element">
  <element-state name="is-disabled" type="boolean">true</element-state>
  <element-state name="counter" type="number">0</element-state>
  <element-flow>
    <listen-event mounted>
      <set-timer once="3000">
        <set-state name="is-disabled" value="false"></set-state>
      </set-timer>
    </listen-event>
    <trigger-event click="TheButton">
      <set-state name="is-disabled" value="true"></set-state>
      <set-timer every="50">
        <set-state name="counter" value="1" mutate="+"></set-state>
      </set-timer>
    </trigger-event>
  </element-flow>
  <template>
    <div>
      Counter:
      <slot name="#counter"></slot>
    </div>
    <button ref="TheButton" _disabled="#is-disabled">Click Me!</button>
  </template>
</custom-element>

<my-element></my-element>
```

<custom-element name="my-element">
  <element-state name="is-disabled" type="boolean">true</element-state>
  <element-state name="counter" type="number">0</element-state>
  <element-flow>
    <listen-event mounted>
      <set-timer once="3000">
        <set-state name="is-disabled" value="false"></set-state>
      </set-timer>
    </listen-event>
    <trigger-event click="TheButton">
      <set-state name="is-disabled" value="true"></set-state>
      <set-timer every="50">
        <set-state name="counter" value="1" mutate="+"></set-state>
      </set-timer>
    </trigger-event>
  </element-flow>
  <template>
    <div>Counter: <slot name="#counter"></slot></div>
    <button ref="TheButton" _disabled="#is-disabled">Click Me!</button>
  </template>
</custom-element>

<realm-demo>
  <my-element><my-element>
</realm-demo>
