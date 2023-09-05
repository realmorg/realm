---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 15. The Dot Notation
menuOrder: 15
title: The Dot notation
author: Ribhararnus Pracutian
description: Learn how to use the dot notation in Realm.
---

In our previous learn materials you've seen the dot notation in <anchor-link href="/docs/learn/states">Element States</anchor-link> or <anchor-link href="/docs/learn/list-rendering">List Rendering</anchor-link>, you may be wondering what is it and how to use it. 

The dot notation is similar to the dot notation in JavaScript, it's used to access the properties of an object.

## Accessing from the Data Source

When the `set-state`, `set-attr`, or `send-event` action tags are invoked in Realm, the behavior of the assigned value can be either static or dynamic, if there's `from` attribute in the tag, then the dot notation in `value` attribute will accessing the <anchor-link href="/references/misc/data-source">data source</anchor-link> (see the complete list in references).

In the following example, it'll accessing the data from an `event` object.

```html
<custom-element name="see-what-im-typing">
  <element-state name="data" type="string">Default Value</element-state>
  <element-flow>
    <trigger-event input="Input">
      <set-state name="data" value="$.target.value" from="event"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    <input ref="Input" _value="#data" />
    <slot name="#data"></slot>
  </template>
</custom-element>

<see-what-im-typing></see-what-im-typing>
```

<custom-element name="see-what-im-typing">
  <element-state name="data" type="string">Default Value</element-state>
  <element-flow>
    <trigger-event input="Input">
      <set-state name="data" value="$.target.value" from="event"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    <input ref="Input" _value="#data" />
    <slot name="#data"></slot>
  </template>
</custom-element>

<realm-demo>
  <see-what-im-typing></see-what-im-typing>
</realm-demo>

## Accessing the item of an Array
In Realm, the dot notation can also be used to access repeatable items within the `<repeat-list>` tag. This special feature allows you to use the `$.` notation to access the individual items being iterated over.

In the previous <anchor-link href="/docs/learn/list-rendering">List Rendering</anchor-link> tutorial, the dot notation provides a convenient way to access and manipulate properties of each repeated item within a `<repeat-list>` tag. You can use it to bind data to child element attributes, apply conditional logic, or perform other operations on each item.
