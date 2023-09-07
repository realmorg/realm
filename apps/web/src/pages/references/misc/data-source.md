---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: Data Source
menuOrder: 3
title: Data Source
author: Ribhararnus Pracutian
description: List of Data Source.
---

These data sources are used in the <anchor-link href="/references/actions/set-state">`<set-state>`</anchor-link>, <anchor-link href="/references/actions/set-attr">`<set-attr>`</anchor-link>, and <anchor-link href="/references/actions/send-event">`<send-event>`</anchor-link> action tag.

<ref-section title="Source List">
  <ref-item-def name="localState">
    The value is taken from the current custom element's state.
  </ref-item-def>
  <ref-item-def name="attr">
    The value is taken from the current custom element's attribute.
  </ref-item-def>
  <ref-item-def name="globalState">
    The value is taken from the global state.
  </ref-item-def>
  <ref-item-def name="event">
    The value is taken from the event of current flow (<anchor-link href="/references/flows/listen-event">&lt;listen-event&gt;</anchor-link> or <anchor-link href="/references/flows/trigger-event">&lt;trigger-event&gt;</anchor-link>).
  </ref-item-def>
  <ref-item-def name="event:attr">
    The value is taken from the element's ref attribute.
  </ref-item-def>
</ref-section>
