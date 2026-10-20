<p align="center">
  <a href="https://realm.js.org" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/realmorg/realm/HEAD/.github/dark-logo.png">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/realmorg/realm/HEAD/.github/light-logo.png">
      <img alt="REALM" src="https://raw.githubusercontent.com/realmorg/realm/HEAD/.github/light-logo.png" width="350" height="85" style="max-width: 100%;">
    </picture>
  </a>
</p>

<p align="center">Write web components in plain HTML. Load one script from a CDN and open the file.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@realmorg/realm"><img alt="npm" src="https://img.shields.io/npm/v/@realmorg/realm/alpha?label=%40realmorg%2Frealm"></a>
  <a href="https://github.com/realmorg/realm/blob/main/LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-blue"></a>
</p>

REALM turns a `<custom-element>` tag into a native web component. You write its script, style and markup in one place, in plain HTML, and the browser runs exactly what you wrote. There is no compiler, no bundler and no config file, so View Source shows your code and there is nothing to install before you start.

> REALM v2 is in alpha. The API is settling, so pin an exact version in production and read the changelog when you update.

## Try it

Save this as `index.html` and open it in a browser:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.css">
  <script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"></script>
</head>
<body>
  <custom-element name="click-counter">
    <script type="realm">
      const props = defineProps({ step: prop.number().default(1) });
      const counter = useState({ count: 0 });

      function add() {
        counter.count += props.step;
      }
    </script>

    <style type="realm">
      button {
        font: inherit;
      }
    </style>

    <button onclick="add()">Clicked <slot name="#counter.count">0</slot> times</button>
  </custom-element>

  <click-counter step="2"></click-counter>
</body>
</html>
```

What each part does:

- `defineProps` declares the attributes the component accepts, with types and defaults. `step="2"` arrives as the number `2`.
- `useState` holds reactive state. Changing `counter.count` updates every place that shows it, and nothing else.
- `<slot name="#counter.count">` shows a value. Markup holds references like this, never expressions, so logic stays in the script where you can read and debug it.
- `onclick="add()"` is a normal event handler attribute that can call the component's functions.
- The `<style>` applies inside the component only, through shadow DOM.

## Building an app

**Put each component in its own file.** In a file, the script and style are plain `<script>` and `<style>`, and a page loads the file with one tag:

```html
<import-element from="./todo-list.html"></import-element>
<todo-list></todo-list>
```

A component file imports the files it depends on, every file is fetched once, and `loading="lazy"` waits until the tag appears in the page.

**Use ready-made components.** [REALM UI](https://realm.js.org/components/) has about 60 accessible components (buttons, dialogs, forms, tables, menus, charts) and a theme with dark mode. Load all of them, or one file per component:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/theme.css">
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/button.html"></import-element>

<ui-button variant="outline">Save draft</ui-button>
```

**Load data without writing fetch code.** `fetch`, `into`, `render` and `busy` attributes send requests and put the response into state or markup. They abort when the component is removed.

**Build forms.** Components can be real form fields: they submit with their `name`, reset, validate and follow `<fieldset disabled>`.

**Share state.** `defineStore("cart", { items: [] }, { persist: "local" })` gives every component the same store, saved to `localStorage` if you ask for it.

**Add icons.** [Unicons](https://realm.js.org/unicons/) is one `<u-icon>` element for 50,939 icons from 31 sets, loaded in small chunks as the page uses them.

**Render on your server.** PHP, Rails, Django, Go or a static site generator can write the tags. The HTML that search engines receive already contains your content, and REALM upgrades the tags in the browser.

## When something goes wrong

REALM checks your markup as it runs and logs a `[realm]` warning that names the component and the problem, for example:

```
[realm] <todo-list> _hidden="#todo.items.length === 0" must be a reference like "#state.path" or "@prop".
```

Every message is listed with its cause in the [console reference](https://realm.js.org/reference/console/).

Everything a component starts (listeners, timers, observers, requests) stops when it is removed from the page.

## Using a coding assistant

REALM ships an agent skill that teaches assistants such as Claude Code, Codex and Cursor its rules, the REALM UI components and the common mistakes:

```shell
npx skills add realmorg/realm
```

The docs are also available as Markdown for assistants at [realm.js.org/llms.txt](https://realm.js.org/llms.txt).

## Shipping

- **Pin versions.** `@alpha` always points at the newest alpha, and jsDelivr can cache it for up to 12 hours. In production, use an exact version such as `@realmorg/realm@2.0.0-alpha.2`.
- **Content Security Policy.** REALM never uses `eval`, `new Function` or `blob:` URLs. It works under a nonce policy with `'strict-dynamic'`. For a policy of only `script-src 'self'`, the optional [Vite plugin](https://github.com/realmorg/realm/tree/main/packages/vite-plugin) assembles component scripts into files at build time.
- **Size and browsers.** The runtime is about 16 KB gzipped and works in current Chrome, Edge, Firefox and Safari.

## Packages

| Package | What it is | Load it from |
| --- | --- | --- |
| [`@realmorg/realm`](https://github.com/realmorg/realm/tree/main/packages/realm) | The runtime | CDN or npm |
| [`@realmorg/ui`](https://github.com/realmorg/realm/tree/main/packages/ui) | About 60 components and the theme | CDN or npm |
| [`@realmorg/unicons`](https://github.com/realmorg/realm/tree/main/packages/unicons) | The `<u-icon>` element and 50,939 icons | CDN or npm |
| [`@realmorg/vite-plugin`](https://github.com/realmorg/realm/tree/main/packages/vite-plugin) | Optional build step for a strict CSP, and a `custom-elements.json` manifest | npm |

## Learn more

- [Docs](https://realm.js.org/docs/): a quick start, a tutorial and guides for state, events, forms, fetching, styling and security
- [Reference](https://realm.js.org/reference/): every element, attribute and script helper
- [Examples](https://realm.js.org/examples/): complete apps (a todo list, a kanban board, chess, a dashboard, a shop, chat, notes and more), each with a button that shows its source
- [Migrating from v1](https://realm.js.org/docs/migrating-from-v1/). v1 is archived under the `v1-final` tag.

## Contributing

We use AI coding assistants to build REALM, and you are welcome to use one too. [CONTRIBUTING.md](https://github.com/realmorg/realm/blob/main/.github/CONTRIBUTING.md) covers the setup, how changes are proposed and the checks to run. To get started:

```shell
pnpm install
pnpm build
pnpm --filter @realmorg/realm coverage
```

The behaviour of REALM is specified in `openspec/specs`, and every scenario there has a test. The runtime keeps 100% test coverage in Chromium, Firefox and WebKit.

## License

[MIT](https://github.com/realmorg/realm/blob/main/LICENSE)
