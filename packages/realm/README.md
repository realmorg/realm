<p align="center">
  <a href="https://realmui.github.io" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/realmui/realm/HEAD/.github/dark-logo.png">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/realmui/realm/HEAD/.github/light-logo.png">
      <img alt="REALM" src="https://raw.githubusercontent.com/realmui/realm/HEAD/.github/light-logo.png" width="350" height="85" style="max-width: 100%;">
    </picture>
  </a>
</p>

<p align="center">Native web components, written in plain HTML. No compiler, no build step.</p>

A REALM component is one `<custom-element>` tag holding a `<script>`, a `<style>` and markup:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.css">

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

- Values show through native `<slot name="#state.path">`, attributes bind with `_href="#link.url"`, events use native `onclick`.
- `fetch`, `into`, `render` and `busy` attributes make requests without code.
- Components are real form fields, clean up after themselves, and style themselves with reactive CSS states.
- About 15 KB gzipped. Works in current Chrome, Edge, Firefox and Safari.

## Packages

| Package | |
| --- | --- |
| `@realmorg/realm` | The runtime |
| `@realmorg/ui` | About 60 accessible components in the style of shadcn/ui, built with REALM |
| `@realmorg/vite-plugin` | Pre-assembles components for strict Content Security Policies and writes `custom-elements.json` |

Documentation, a tutorial and live examples are at [realmui.github.io](https://realmui.github.io), and in Markdown for language models at [llms.txt](https://realmui.github.io/llms.txt).

## Development

The repository holds the runtime, the UI library, the Vite plugin, the website and example apps (a todo list, a Trello-like board, chess, a dashboard, a weather app and a contacts app). See `AGENTS.md` for the rules and commands, `PLAN.md` for the design, and `openspec/specs` for the specification. Every scenario in the specification has a test, and the runtime keeps 100% test coverage in Chromium, Firefox and WebKit.

```bash
pnpm install
pnpm build
pnpm --filter @realmorg/realm coverage
pnpm --filter site test
```

REALM v1 is archived under the `v1-final` tag.

## License

MIT
