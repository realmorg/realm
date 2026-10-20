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

REALM turns a `<custom-element>` tag into a native web component. You write its script, style and markup in one place, in plain HTML, and the browser runs exactly what you wrote. There is no compiler, no bundler and no config file. The runtime is about 16 KB gzipped and works in current Chrome, Edge, Firefox and Safari.

> REALM v2 is in alpha. Pin an exact version in production, such as `@realmorg/realm@2.0.0-alpha.2`.

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

A component file can import the files it depends on in the same way.

**Use ready-made components.** [REALM UI](https://realm.js.org/components/) has about 60 accessible components (buttons, dialogs, forms, tables, menus, charts) and a theme with dark mode. Load all of them, or one file per component:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/theme.css">
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/button.html"></import-element>

<ui-button variant="outline">Save draft</ui-button>
```

## Using a coding assistant

REALM ships an agent skill that teaches assistants such as Claude Code, Codex and Cursor its rules, the REALM UI components and the common mistakes:

```shell
npx skills add realmorg/realm
```

The docs are also available as Markdown for assistants at [realm.js.org/llms.txt](https://realm.js.org/llms.txt).

## Packages

| Package | What it is | Load it from |
| --- | --- | --- |
| [`@realmorg/realm`](https://github.com/realmorg/realm/tree/main/packages/realm) | The runtime | CDN or npm |
| [`@realmorg/ui`](https://github.com/realmorg/realm/tree/main/packages/ui) | About 60 components and the theme | CDN or npm |
| [`@realmorg/unicons`](https://github.com/realmorg/realm/tree/main/packages/unicons) | The `<u-icon>` element and 50,939 icons | CDN or npm |
| [`@realmorg/vite-plugin`](https://github.com/realmorg/realm/tree/main/packages/vite-plugin) | Optional build step for a strict CSP, and a `custom-elements.json` manifest | npm |

## Learn more

- [Docs](https://realm.js.org/docs/): a quick start, a tutorial, and guides for loading data, forms, shared state, styling and server-rendered pages
- [Unicons](https://realm.js.org/unicons/): one `<u-icon>` element for 50,939 icons
- [Reference](https://realm.js.org/reference/): every element, attribute and script helper
- [Examples](https://realm.js.org/examples/): complete apps, including a todo list, a kanban board, chess, a dashboard, a shop and a chat
- [Migrating from v1](https://realm.js.org/docs/migrating-from-v1/). v1 is archived under the `v1-final` tag.

## Contributing

See [CONTRIBUTING.md](https://github.com/realmorg/realm/blob/main/.github/CONTRIBUTING.md).

## License

[MIT](https://github.com/realmorg/realm/blob/main/LICENSE)
