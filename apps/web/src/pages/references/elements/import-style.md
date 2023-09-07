---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: import-style
menuOrder: 9
title: "Element: import-style"
author: Ribhararnus Pracutian
description: The `import-style` tag reference.
---

This element tag is used to import a Stylesheets (CSS) document, it similar with `<link rel="stylesheet">` tag, but it's only allowed to be used inside `<custom-element>` tag.

The `link` tag then will be added in the `<head>` tag, and will be executed once the Custom element is defined.

Because the default behavior of Shadow DOM, the imported CSS will not affect the styles inside of custom element, unless the `local` attribute is set to make the styles inside the Shadow DOM works. Except, if the CSS file(s) has defined CSS variables, you can uses the variables directly, without `local` attribute.

<ref-section title="Attributes">
  <ref-item-def name="from">
    The Cascading Style Sheets (CSS) file's URL
  </ref-item-def>
  <ref-item-def name="local">
    Mount the CSS file inside Shadow DOM
  </ref-item-def>
</ref-section>

<ref-section title="Example"></ref-section>

```css
// CSS from styles.css
.wrapper {
  color: red;
}
```

```html
<custom-element name="my-element">
  <import-syle local from="./path-to/style.css"></import-style>
  <template>
    <!--
      This wrapper class won't be affected if you don't set `local` attribute,
      it's because the behaviors of Shadow DOM by default.

      Please always set `local` attribute if you want to use the imported CSS,
      Or use CSS variables instead.
    -->
    <div class="wrapper">
      <slot children></slot>
    </div>
  </template>
</custom-element>
```
