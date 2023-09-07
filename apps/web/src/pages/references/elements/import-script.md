---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: import-script
menuOrder: 8
title: "Element: import-script"
author: Ribhararnus Pracutian
description: The `import-script` tag reference.
---

This element tag is used to import a JavaScript file, it similar with `<script type="module">` tag, but it's only allowed to be used inside `<custom-element>` tag.

The script tag then will be added in the `<head>` tag, and will be executed once the Custom element is defined.

<ref-section title="Attributes">
  <ref-item-def name="from">
    The JavaScript file's URL
  </ref-item-def>
</ref-section>

<ref-section title="Example"></ref-section>

```html
<custom-element name="my-element">
  <import-script
    from="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0"></import-script>
  <element-flow>
    <trigger-event click="ShowConfettiBtn">
      <script type="module/realm">
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      </script>
    </trigger-event>
  </element-flow>
  <template>
    <button ref="ShowConfettiBtn">Yay! 🎉</button>
  </template>
</custom-element>

<my-element></my-element>
```

<custom-element name="my-element">
  <import-script from="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0"> </import-script>
  <element-flow>
    <trigger-event click="ShowConfettiBtn">
      <script type="module/realm">
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      </script>
    </trigger-event>
  </element-flow>
  <template>
    <button ref="ShowConfettiBtn">Yay! 🎉</button>
  </template>
</custom-element>

<realm-demo>
  <my-element></my-element>
</realm-demo>
