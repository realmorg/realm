---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: script
menuOrder: 6
title: "Action: script type module/realm"
author: Ribhararnus Pracutian
description: The `script type module/realm` action reference.
---

Realm allowed you to write custom flow business logic in JavaScript, you can write it in the `<script type="module/realm">` tag, it's similar to the `<script type="module">` tag, but it's only allowed to be used inside flow tag.

The script tag will be added to the runtime once the custom element is mounted, and will be executed once the flow is triggered.

It's top level await, so you can use `await` keyword inside the script tag.

<ref-section title="Attributes">
  <ref-item-def name="use">
    Comma separated list of variables that can be used inside the script tag (see below).
  </ref-item-def>
</ref-section>

<ref-section title="Variables">
  <ref-item-def name="localState">
    The state of current element, it's an object function that has `get` and `set` method.
  </ref-item-def>
  <ref-item-def name="globalState">
    Similar to `localState`, but it's global.
  </ref-item-def>
  <ref-item-def name="$">
    The current element instance.
  </ref-item-def>
  <ref-item-def name="attr">
    The current element's attribute. It's an object function that has `get` and `set` method.
  </ref-item-def>
  <ref-item-def name="attrs">
    The current element's attribute list in key-value pair.
  </ref-item-def>
  <ref-item-def name="ref">
    It's a utility to get the element by its `ref` attribute value.
  </ref-item-def>
  <ref-item-def name="refs">
    Similar to `ref` but it will return an array of elements.
  </ref-item-def>
  <ref-item-def name="event">
    It's an object that contains the event's data. It depends on the event type. If the flow is triggering an element, then the event will be the element's event (see the event below).
  </ref-item-def>
</ref-section>

<ref-section title="Event">
  <ref-item-def name="Element">
    The event object will be the element's event, it's an object function that has `preventDefault` method.
  </ref-item-def>
  <ref-item-def name="Value">
    If it's sent by <anchor-link href="/references/actions/send-event">&lt;send-event&gt;</anchor-link> then the event object will be the value of the event.
  </ref-item-def>
  <ref-item-def name="attrchanged">
    If the script tag is inside <anchor-link href="/references/flows/listen-event">&lt;listen-event attrchanged&gt;</anchor-link> then the event object will be the attribute's name that changed. It will returning `[attribute name, new value, old value]`
  </ref-item-def>
  <ref-item-def name="statechanged">
    If the script tag is inside <anchor-link href="/references/flows/listen-event">&lt;listen-event statechanged&gt;</anchor-link> then the event object will be the state's name that changed. It will returning `[state name, new value, old value, is global state]`
  </ref-item-def>
</ref-section>

<ref-section title="Example">
  See how to use script tag on <anchor-link href="/docs/learn/script">Custom Flow Script</anchor-link> page.
</ref-section>
