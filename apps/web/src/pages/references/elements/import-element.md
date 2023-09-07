---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: import-element
menuOrder: 7
title: "Element: import-element"
author: Ribhararnus Pracutian
description: The `import-element` tag reference.
---

This element tag is used to import a custom element from another html file (accross the web). Please note that if you want to export your custom element to the web, you must enable CORS on the server that hosts the custom element.

The HTML file should have at least a <anchor-link href="/references/elements/custom-element">`<custom-element>`</anchor-link> tag inside it.

<ref-section title="Attributes">
  <ref-item-def name="from">
    A valid URL, relative or absolute path is allowed.
  </ref-item-def>
  <ref-item-def name="as">
    A custom name alias for the imported custom element.
  </ref-item-def>
  <ref-item-def name="automount">
    Automount the imported custom element (see example below). Default is `false`.
  </ref-item-def>
</ref-section>

<ref-section title="Example"></ref-section>

```html
<!-- Once imported, you can use the imported elements with original name from the document. -->
<import-element from="./relative-path/custom-element.html"></import-element>
<import-element from="/absolute-path/custom-element.html"></import-element>
<import-element
  from="https://thirdparty.domain/custom-element.html"></import-element>

<!-- Once imported, you can use the imported elements with an alias name. -->
<import-element
  from="./relative-path/custom-element.html"
  as="abc-xyz"></import-element>
<import-element
  from="/absolute-path/custom-element.html"
  as="my-element"></import-element>
<import-element
  from="https://thirdparty.domain/custom-element.html"
  as="element-from-xxx"></import-element>

<!-- These will be auto mounted, and will be replaced with the custom element name. -->
<import-element
  from="./relative-path/custom-element.html"
  automount></import-element>
<import-element from="/absolute-path/custom-element.html" automount>
  <strong>
    Can accept children if the custom element has slot children inside it.
  </strong>
</import-element>
<import-element
  from="https://thirdparty.domain/custom-dialog.html"
  automount
  can-accept-attribute="yes"
  is-open="true"></import-element>
```
