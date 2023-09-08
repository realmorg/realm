---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: listen-event
menuOrder: 2
title: "Flow: listen-event"
author: Ribhararnus Pracutian
description: The `listen-event` flow reference.
elements: ["custom-event-demo"]
---

This element tag is used to listen the custom element's lifecycle or a custom event sent by <anchor-link href="/references/actions/send-event">`<send-event>`</anchor-link>, this element tag only allowed to be used inside a <anchor-link href="/references/elements/element-flow">`<element-flow>`</anchor-link> tag.

Please note that you only can use one of these attributes.

<ref-section title="Attributes">
  <ref-item-def name="mounted">
    Listen to the custom element's lifecycle when it's mounted
  </ref-item-def>
  <ref-item-def name="attrchanged">
    Listen to the custom element's lifecycle when its attribute changed. If the
    attribute's value is not provided, it will listen to all attributes.
  </ref-item-def>
  <ref-item-def name="statechanged">
    Listen to the custom element's lifecycle when its state / global state
    changed. If the attribute's value is not provided, it will listen to all
    states.
  </ref-item-def>
  <ref-item-def name="on">
    Listen to the custom event. The attribute's value is the event's name.
  </ref-item-def>
</ref-section>

<ref-section title="Example"></ref-section>

```html
<!-- On mounted set `is-mounted` state to `yes` -->
<custom-element name="on-mounted-demo">
  <element-state name="is-mounted" type="string">no</element-state>
  <element-flow>
    <listen-event mounted>
      <set-state name="is-mounted" value="yes"></set-state>
    </listen-event>
  </element-flow>
  <template>
    <div>
      Is mounted?
      <slot name="#is-mounted"></slot>
    </div>
  </template>
</custom-element>

<mounted-event-demo></mounted-event-demo>
```

<custom-element name="mounted-event-demo">
  <element-state name="is-mounted" type="string">
    no
  </element-state>
  <element-flow>
    <listen-event mounted>
      <set-state name="is-mounted" value="yes"></set-state>
    </listen-event>
  </element-flow>
  <template>
    <div>
      Is mounted? <slot name="#is-mounted"></slot>
    </div>
  </template>
</custom-element>

<realm-demo>
  <mounted-event-demo></mounted-event-demo>
</realm-demo>

```html
<custom-element name="statechanged-event-demo">
  <element-state name="updated-content" type="number"></element-state>
  <element-state name="count" type="number">0</element-state>
  <element-state name="content" type="string"></element-state>
  <element-flow>
    <trigger-event input="Input">
      <set-state name="content" value="$.target.value" from="event"></set-state>
    </trigger-event>
    <listen-event statechanged="content">
      <set-state name="updated-content" value="1" mutate="+"></set-state>
    </listen-event>
  </element-flow>
  <template>
    <div>
      Content state changed
      <slot name="#updated-content"></slot>
      x times.
    </div>
    <div><input ref="Input" /></div>
  </template>
</custom-element>

<statechanged-event-demo></statechanged-event-demo>
```

<custom-element name="statechanged-event-demo">
  <element-state name="updated-content" type="number"></element-state>
  <element-state name="count" type="number">
    0
  </element-state>
  <element-state name="content" type="string"></element-state>
  <element-flow>
    <trigger-event input="Input">
      <set-state name="content" value="$.target.value" from="event"></set-state>
    </trigger-event>
    <listen-event statechanged="content">
      <set-state name="updated-content" value="1" mutate="+"></set-state>
    </listen-event>
  </element-flow>
  <template>
    <div>
      Content state changed <slot name="#updated-content"></slot>x times.
    </div>
    <div>
      <input ref="Input" />
    </div>
  </template>
</custom-element>

<realm-demo>
  <statechanged-event-demo></statechanged-event-demo>
</realm-demo>

```html
<custom-element name="custom-event-demo">
  <element-state name="color" type="string"></element-state>
  <element-flow>
    <listen-event on="change-color">
      <set-state name="color" from="event"></set-state>
    </listen-event>
    <trigger-event click="DynamicColorBtn">
      <send-event
        name="change-color"
        type="string"
        value="$.color"
        from="event:attr"></send-event>
    </trigger-event>
    <trigger-event click="StaticColorBtn">
      <send-event name="change-color" type="string" value="red"></send-event>
    </trigger-event>
  </element-flow>

  <template>
    <style>
      :host {
        display: block;
        background-color: var(--state-color);
        padding: 5px;
      }
    </style>
    <div>
      Selected Color:
      <slot name="#color"></slot>
    </div>
    <button color="teal" ref="DynamicColorBtn">Teal</button>
    <button color="hotpink" ref="DynamicColorBtn">Hotpink</button>
    <button ref="StaticColorBtn">Static color</button>
  </template>
</custom-element>

<custom-event-demo></custom-event-demo>
```

<realm-demo>
  <custom-event-demo></custom-event-demo>
</realm-demo>
