---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: custom-element
menuOrder: 2
title: "Element: custom-element"
author: Ribhararnus Pracutian
description: The `custom-element` tag reference.
---

The main or core Realm framework is the custom element definition tag. It is used to define a custom element without using JavaScript `customElements.define()` and the complexity. The `template` tag is required to render the custom element's content.

<ref-section title="Attributes">
  <ref-item-def name="name">
    Custom Element's name
  </ref-item-def>
</ref-section>

<ref-section title="Allowed Children">
  <ref-item-def name="element-attr">
    Reference link: <anchor-link href="/references/elements/element-attr">&lt;element-attr&gt;</anchor-link>
  </ref-item-def>
  <ref-item-def name="element-state">
    Reference link: <anchor-link href="/references/elements/element-state">&lt;element-state&gt;</anchor-link>
  </ref-item-def>
  <ref-item-def name="element-flow">
    Reference link: <anchor-link href="/references/elements/element-flow">&lt;element-flow&gt;</anchor-link>
  </ref-item-def>
  <ref-item-def name="import-script">
    Reference link: <anchor-link href="/references/elements/import-script">&lt;import-script&gt;</anchor-link>
  </ref-item-def>
  <ref-item-def name="import-style">
    Reference link: <anchor-link href="/references/elements/import-style">&lt;import-style&gt;</anchor-link>
  </ref-item-def>
  <ref-item-def name="is-visible">
    Reference link: <anchor-link href="/references/elements/is-visible">&lt;is-visible&gt;</anchor-link>
  </ref-item-def>
  <ref-item-def name="is-hidden">
    Reference link: <anchor-link href="/references/elements/is-hidden">&lt;is-hidden&gt;</anchor-link>
  </ref-item-def>
  <ref-item-def name="template">
    Native element
  </ref-item-def>
</ref-section>

<ref-section title="Example"></ref-section>
```html
<custom-element name="my-element">
  <template>
    <h1>Hello World</h1>
  </template>
</custom-element>
```


