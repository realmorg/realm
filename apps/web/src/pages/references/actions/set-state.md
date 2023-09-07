---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: set-state
menuOrder: 2
title: "Action: set-state"
author: Ribhararnus Pracutian
description: The `set-state` action reference.
---

This action tag is used to update the state's value within Custom Element or <anchor-link href="/references/elements/global-state">Global State</anchor-link>.

<ref-section title="Attributes">
  <ref-item-def name="name">
    Custom element's state or global state name.
  </ref-item-def>
  <ref-item-def name="value">
    It can be static or dynamic, if this element tag has `from` attribute, then the value will be dynamic and the value itself should be a selector prefixed with `$.` notation. If the state's type is `html` then this attribute is unnecessary and the value can be any HTML inside the tags.
  </ref-item-def>
  <ref-item-def name="from">
    The data source selector, see the complete list on <anchor-link href="/references/misc/data-source">Data Source</anchor-link> page.
  </ref-item-def>
  <ref-item-def name="mutate">
    The mutation operator, if it's present, then it will mutate the value before set it to the state. See the complete list on <anchor-link href="/references/misc/mutation-operators">Mutation Operators</anchor-link> page.
  </ref-item-def>
  <ref-item-def name="index">
    It's used to set the value to the specific index of the array or object and only used if the state's type is `array`, and the `mutate` attribute is `assign` or `remove`.
  </ref-item-def>
  <ref-item-def name="global">
    If it's present, then the state will be set the <anchor-link href="/references/elements/global-state">Global State</anchor-link> value.
  </ref-item-def>
  <ref-item-def name="toggle">
    If it's present, then the state will be toggled between `true` and `false` based on the value of the state.
  </ref-item-def>
</ref-section>

<ref-section title="Example"></ref-section>

```html
<custom-element name="set-state-demo">
  <element-state name="state" type="string"></element-state>
  <element-flow>
    <trigger-event click="StaticBtn">
      <set-state name="state" value="Hello World!"></set-state>
    </trigger-event>
    <trigger-event click="DynamicBtn">
      <set-state
        name="state"
        value="$.data-state"
        from="event:attr"></set-state>
    </trigger-event>
    <trigger-event input="DynamicInput">
      <set-state name="state" value="$.target.value" from="event"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <div>
      State:
      <slot name="#state"></slot>
    </div>
    <button ref="StaticBtn">Update static value!</button>
    <button data-state="Universe!" ref="DynamicBtn">
      Update dynamic value!
    </button>
    <div><input ref="DynamicInput" /></div>
  </template>
</custom-element>
```

<custom-element name="set-state-demo">
  <element-state name="state" type="string"></element-state>
  <element-flow>
    <trigger-event click="StaticBtn">
      <set-state name="state" value="Hello World!"></set-state>
    </trigger-event>
    <trigger-event click="DynamicBtn">
      <set-state name="state" value="$.data-state" from="event:attr"></set-state>
    </trigger-event>
    <trigger-event input="DynamicInput">
      <set-state name="state" value="$.target.value" from="event"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <div>State: <slot name="#state"></slot></div>
    <button ref="StaticBtn">Update static value!</button>
    <button data-state="Universe!" ref="DynamicBtn">Update dynamic value!</button>
    <div><input ref="DynamicInput" /></div>
  </template>
</custom-element>

<realm-demo>
  <set-state-demo></set-state-demo>
</realm-demo>

```html
<custom-element name="set-state-array-demo">
  <element-state name="array" type="array"></element-state>
  <element-flow>
    <trigger-event click="PushBtn">
      <set-state
        name="array"
        value='[{ "item": "Hello World" }]'
        mutate="push"></set-state>
    </trigger-event>
    <trigger-event click="PopBtn">
      <set-state name="array" mutate="pop"></set-state>
    </trigger-event>
    <trigger-event click="AssignBtn">
      <set-state
        name="array"
        value='[{ "item": "Hello Universe" }]'
        index="0"
        mutate="assign"></set-state>
    </trigger-event>
    <trigger-event click="RemoveBtn">
      <set-state name="array" index="2" mutate="remove"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <div>
      Array State:
      <slot name="#array"></slot>
    </div>
    <button ref="PushBtn">Push!</button>
    <button ref="PopBtn">Pop!</button>
    <button ref="AssignBtn">Assign!</button>
    <button ref="RemoveBtn">Remove!</button>
  </template>
</custom-element>
```

<custom-element name="set-state-array-demo">
  <element-state name="array" type="array"></element-state>
  <element-flow>
    <trigger-event click="PushBtn">
      <set-state name="array" value='[{ "item": "Hello World" }]' mutate="push"></set-state>
    </trigger-event>
    <trigger-event click="PopBtn">
      <set-state name="array" mutate="pop"></set-state>
    </trigger-event>
    <trigger-event click="AssignBtn">
      <set-state name="array" value='[{ "item": "Hello Universe" }]' index="0" mutate="assign"></set-state>
    </trigger-event>
    <trigger-event click="RemoveBtn">
      <set-state name="array" index="2" mutate="remove"></set-state>
    </trigger-event>
  </element-flow>

  <template>
    <div>Array State: <slot name="#array"></slot></div>
    <button ref="PushBtn">Push!</button>
    <button ref="PopBtn">Pop!</button>
    <button ref="AssignBtn">Assign!</button>
    <button ref="RemoveBtn">Remove!</button>
  </template>
</custom-element>

<realm-demo>
  <set-state-array-demo></set-state-array-demo>
</realm-demo>
