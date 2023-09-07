---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: send-event
menuOrder: 4
title: "Action: send-event"
author: Ribhararnus Pracutian
description: The `send-event` action reference.
---

The `send-event` action tag is used to send an event to the <anchor-link href="/references/flows/listen-event">`<listen-event>`</listen-event>.

<ref-section title="Attributes">
  <ref-item-def name="name">
    The event's name.
  </ref-item-def>
  <ref-item-def name="type">
    The event's type is the same as <anchor-link href="/references/elements/element-state">&lt;element-state&gt;</anchor-link> or <anchor-link href="/references/elements/element-attr">&lt;element-attr&gt;</anchor-link> type.
  </ref-item-def>
  <ref-item-def name="value">
    The event's data value.  It can be static or dynamic, if this element tag has `from` attribute, then the value will be dynamic and the value itself should be a selector prefixed with `$.` notation. The value has the same behavior with <anchor-link href="/references/actions/set-state">&lt;set-state&gt;</anchor-link>.
  </ref-item-def>
  <ref-item-def name="from">
    The data source selector, see the complete list on <anchor-link href="/references/misc/data-source">Data Source</anchor-link> page.
  </ref-item-def>
</ref-section>

<ref-section title="Examples">
See example on <anchor-link href="/references/flows/listen-event">&lt;listen-event&gt;</anchor-link> page.
</ref-section>
