---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: web-app
menuOrder: 1
title: "Element: web-app"
author: Ribhararnus Pracutian
description: The `web-app` tag reference
---

The `web-app` tag is an optional tag, the main purpose of this element tag is to handle WebComponents glitch that sometimes happen when the page is loaded.

When the page is loaded, the `web-app` tag will adds `loaded` attribute, so you can use it to hide the page's content until the page is fully loaded.

<ref-section title="Example"></ref-section>

```html
<!DOCTYPE html>
<html>
  <head>
    ...
    <style>
      web-app:not([loaded]) {
        /* add your styles here for example filter or opacity = 0 */
      }
      web-app[loaded] {
        /* after loaded you can set the styles back to normal */
      }
    </style>
    ...
  </head>
</html>
```
