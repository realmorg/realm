---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: Mutation Operators
menuOrder: 2
title: Mutation Operators
author: Ribhararnus Pracutian
description: List of mutation operators.
---

These operators are used in the <anchor-link href="/references/actions/set-state">`<set-state>`</anchor-link>, and <anchor-link href="/references/actions/set-attr">`<set-attr>`</anchor-link> action tag.

<ref-section title="Operator List">
  <ref-item-def name="+">
    Add the value to the current state value. Only allowed for `number` type.
  </ref-item-def>
  <ref-item-def name="-">
    Subtract the value to the current state value. Only allowed for `number` type.
  </ref-item-def>
  <ref-item-def name="*">
    Multiply the value to the current state value. Only allowed for `number` type.
  </ref-item-def>
  <ref-item-def name="/">
    Divide the value to the current state value. Only allowed for `number` type.
  </ref-item-def>
  <ref-item-def name="push">
    Push the value to the current state value. Only allowed for `array` type.
  </ref-item-def>
  <ref-item-def name="pop">
    Pop the value from the current state value. Only allowed for `array` type.
  </ref-item-def>
  <ref-item-def name="assign">
    Assign the value to the current state value based on `index` attribute. Only allowed for `array` type.
  </ref-item-def>
  <ref-item-def name="remove">
    Remove the value from the current state value based on `index` attribute. Only allowed for `array` type.
  </ref-item-def>
</ref-section>
