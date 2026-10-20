<p align="center">
  <a href="https://realm.js.org" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/realmorg/realm/HEAD/.github/dark-logo.png">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/realmorg/realm/HEAD/.github/light-logo.png">
      <img alt="REALM" src="https://raw.githubusercontent.com/realmorg/realm/HEAD/.github/light-logo.png" width="350" height="85" style="max-width: 100%;">
    </picture>
  </a>
</p>

<p align="center">Native web components, written in plain HTML. No compiler, no build step.</p>

## Install

Add two tags from the CDN to any HTML page:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"></script>
```

For the ready-made `ui-*` components, add the REALM UI theme and bundle:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/theme.css">
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/ui.html"></import-element>
```

Pin an exact version (for example `@realmorg/realm@2.0.0-alpha.1`) in production.

## A component

A REALM component is one `<custom-element>` tag holding a `<script>`, a `<style>` and markup:

```html

<custom-element name="click-counter">
  <script type="realm">
    const props = defineProps({ step: prop.number().default(1) });
    const counter = useState({ count: 0 });

    function add() {
      counter.count += props.step;
    }
  </script>

  <style>
    button { font: inherit; }
  </style>

  <button onclick="add()">Clicked <slot name="#counter.count">0</slot> times</button>
</custom-element>

<click-counter step="2"></click-counter>
```

- Values show through native `<slot name="#state.path">`. Attributes bind with `_href="#link.url"`. Events use native `onclick`.
- `fetch`, `into`, `render` and `busy` attributes make requests without code.
- Components can act as form fields, stop their listeners and requests when removed, and style themselves from reactive CSS states.
- About 16 KB gzipped. Works in current Chrome, Edge, Firefox and Safari.

## Packages

REALM and REALM UI load from the CDN. The Vite plugin is an optional dev tool installed from npm.

| Package | |
| --- | --- |
| `@realmorg/realm` | The runtime |
| `@realmorg/ui` | About 60 accessible components, built with REALM |
| `@realmorg/vite-plugin` | Optional, for projects that already use Vite: pre-assembles components for strict Content Security Policies and writes `custom-elements.json` |

Docs, a tutorial and live examples are at [realm.js.org](https://realm.js.org). [llms.txt](https://realm.js.org/llms.txt) lists the same docs in Markdown for code assistants.

## Development

The repository holds the runtime, the UI library, the Vite plugin, the website and example apps (a todo list, a kanban board, chess, a dashboard, a weather app and a contacts app). See `AGENTS.md` for the rules and commands, `PLAN.md` for the design, and `openspec/specs` for the specification. Every scenario in the specification has a test, and the runtime keeps 100% test coverage in Chromium, Firefox and WebKit.

```bash
pnpm install
pnpm build
pnpm --filter @realmorg/realm coverage
pnpm --filter site test
```

REALM v1 is archived under the `v1-final` tag.

## License

MIT
