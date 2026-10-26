---
title: Importing components
description: Load REALM component files with import-element, bundle several components in one file, lazy-load them, handle load errors and import JavaScript modules.
group: Data
order: 21
nav: Importing components
---

# Importing components

`<import-element>` loads an HTML file and defines every `<custom-element>` in it.

```html
<import-element from="/components/todo-app.html"></import-element>

<todo-app></todo-app>
```

`from` is resolved against the page, like `href`. Elements used before their definition arrives are upgraded when it arrives. Until then, `realm.css` keeps them hidden.

## Behaviour

| Behaviour | What REALM does |
| --- | --- |
| Fetching | Each URL is fetched once. Every `<import-element>` with the same URL, and `importDefinitions(url)`, share that request |
| Bundles | A file can hold any number of `<custom-element>` definitions. All of them are defined |
| Duplicates | Importing the same component twice is harmless. A different definition for a name that already exists keeps the first and warns, naming both files |
| Errors | A failed request fires `error` on the `<import-element>` and logs a warning. The rest of the page keeps working |
| Removal | An `<import-element>` removed before its file arrives stays quiet: it fires no events |
| Throttling | At most six files are fetched at once per origin. The rest wait in a queue |
| Moving | Moving or reinserting an `<import-element>` does not import again |

## Bundles

Group components that are used together in one file. REALM UI ships every component in one `ui.html`:

```html
<import-element from="https://realm.js.org/dist/ui/ui.html"></import-element>
```

Smaller bundles load faster, but one file per component makes more requests. A file per feature area is a good default.

## Lazy loading

`loading="lazy"` waits until one of the tags listed in `for` appears in the page (or in any component's markup) before fetching:

```html
<import-element from="/components/charts.html" loading="lazy" for="sales-chart usage-chart"></import-element>
```

Without `for`, a lazy import cannot know what to wait for, so REALM warns.

## Events

`<import-element>` fires `load` when every definition in the file is defined and `error` when the file cannot be loaded:

```html
<import-element
  from="/components/map.html"
  onload="console.info('map ready', event.detail.url)"
  onerror="console.warn('map failed', event.detail.url, event.detail.status)"
></import-element>
```

| Event | `event.detail` |
| --- | --- |
| `load` | `{ url }` |
| `error` | `{ url, status }` (`status` is `0` for network errors) |

## Imports inside component scripts

A component script can import JavaScript modules. Use `<script type="module">` for clarity, and put the imports first:

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

Relative paths (`./`, `../`) resolve against the component file, not the page, so a component folder can be moved as a whole. Imported names are available to markup and handlers like any top-level name.

## Stylesheets

A definition can link a stylesheet. Its URL also resolves against the component file, and it applies inside the component only:

```html
<custom-element name="fancy-table">
  <link rel="stylesheet" href="./fancy-table.css">
  <table>…</table>
</custom-element>
```

## From JavaScript

`importDefinitions(url)` does the same as `<import-element>` and returns a promise:

```js
import { importDefinitions } from "@realmorg/realm";

await importDefinitions("/components/editor.html");
document.body.append(document.createElement("rich-editor"));
```

## Trust

A component file is code, like a `<script src>`. Importing a component from another origin runs that origin's code in your page. Only import from sources you trust, and pin exact versions in production (see [Pin a version](/docs/installation/#pin-a-version)).
