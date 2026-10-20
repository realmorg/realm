# Imports and component files

## `<import-element>`

Loads an HTML file and defines every `<custom-element>` in it. Works in a page and inside component markup.

```html
<import-element from="/components/todo-app.html"></import-element>
<todo-app></todo-app>
```

| Attribute | Meaning |
| --- | --- |
| `from` | The file, resolved against the page like `href`. Required |
| `loading="lazy"` | Wait until one of the tags in `for` appears in the page or in any component's markup |
| `for` | Space-separated tags the file defines. Required with `loading="lazy"`, otherwise REALM warns and loads at once |

```html
<import-element from="/components/charts.html" loading="lazy" for="sales-chart usage-chart"></import-element>
```

| Event | `event.detail` | When |
| --- | --- | --- |
| `load` | `{ url }` | Every definition in the file is defined |
| `error` | `{ url, status }` (`0` for network errors) | The file could not be loaded. Also logs `Could not import URL (HTTP 404)` |

The events do not bubble, and neither fires if the element was removed first. `onload` and `onerror` are native handler attributes, so they work on a plain page.

Behaviour:

- Each URL is fetched once per page. Every `<import-element>` and `importDefinitions()` call for that URL shares the request.
- At most six files load at once per origin.
- The file is parsed with `DOMParser`, never executed or rendered. Only its `<custom-element>` elements and top-level `<import-element>` tags are used.
- Elements used before their definition arrives upgrade when it does. Until then `realm.css` keeps them hidden.
- Importing the same component twice is harmless. A different definition for an existing name keeps the first and warns with both file names.
- Files are loaded with `fetch`, so the page must be served over HTTP. `file://` pages can only use inline definitions.

## Component files

A file holds one or more definitions. Its scripts are plain `<script>` (or `type="module"` when they import), and its styles are plain `<style>`, because the file is parsed, not run.

```html
<!-- components/user-badge.html -->
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/avatar.html"></import-element>

<custom-element name="user-badge">
  <script>
    const props = defineProps({ name: prop.string().default("Guest") });
    const badge = useState({
      get initials() {
        return props.name.split(" ").map((part) => part[0]).join("");
      },
    });
  </script>

  <style>
    :host {
      display: inline-flex;
      gap: calc(var(--spacing) * 2);
      align-items: center;
    }
  </style>

  <ui-avatar><ui-avatar-fallback><slot name="#badge.initials"></slot></ui-avatar-fallback></ui-avatar>
  <span><slot name="@name"></slot></span>
</custom-element>
```

```html
<import-element from="components/user-badge.html"></import-element>
<user-badge name="Ada Lovelace"></user-badge>
```

- **Dependencies** go at the top of the file as `<import-element>` tags outside the definitions. Their paths resolve against the file, and they are loaded before the file's own definitions are defined. A component that uses `ui-button` imports `button.html` itself, so pages only import what they use directly.
- Relative paths inside a file (`<import-element from>`, `<link rel="stylesheet" href>`, `import` in scripts) resolve against **that file**, not the page, so a component folder can move as a whole.
- Group components that are used together. One file per feature area is a good default. REALM UI ships one file per component plus `dist/ui.html` with everything.

## Modules and shared state

A component script can import modules. Put the imports first. Relative specifiers resolve against the component file.

```html
<custom-element name="cart-badge">
  <script type="module">
    import { cart } from "../state/cart.js";
    import { formatMoney } from "../lib/format.js";

    const badge = useState({
      get total() {
        return formatMoney(cart.total);
      },
    });
  </script>

  <span><slot name="#badge.total"></slot></span>
</custom-element>
```

Imported names are top-level names, so markup can reference them (`<slot name="#cart.count">`).

A store shared by several components lives in a module. Import REALM from the same CDN version the page loads (`index.js` and `realm.js` share one runtime):

```js
// state/cart.js
import { defineStore } from "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/index.js";

export const cart = defineStore(
  "cart",
  {
    items: [],
    get count() {
      return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },
  },
  { persist: "local" },
);
```

To write `import { defineStore } from "@realmorg/realm"` instead, add an import map to the page that points at the file the page loads:

```html
<script type="importmap">
  { "imports": { "@realmorg/realm": "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js" } }
</script>
```

For a small app, calling `defineStore("cart", …)` with the same name in two component scripts also gives both the same store, with no module.

## From JavaScript

```js
import { importDefinitions } from "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/index.js";

await importDefinitions(new URL("components/editor.html", document.baseURI).href);
document.body.append(document.createElement("rich-editor"));
```

It rejects on failure without logging, so handle the error.

## Trust

A component file is code, like `<script src>`. Import only from origins you trust, and pin versions on CDNs in production (`@realmorg/ui@2.0.0-alpha.1`).

## Optional tooling

REALM needs no build step. In a Vite project, load REALM from the CDN too and serve component files as static files from `public/`. The optional `@realmorg/vite-plugin` pre-assembles component scripts for a strict `script-src 'self'` Content Security Policy and writes a `custom-elements.json` manifest. Without it, REALM works under a nonce-based CSP: give the page's REALM `<script>` a `nonce` and REALM copies it to the scripts it inserts.
