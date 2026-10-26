---
name: realm
description: Build pages and native web components with REALM (realm.js.org), its REALM UI kit (ui-* tags) and Unicons (u-icon). Use when writing or editing <custom-element> definitions, component files loaded with <import-element>, pages that load realm.js, ui-* markup, u-icon icons, or fetch attributes such as fetch, into and render. Also use when the user mentions REALM, @realmorg/realm, @realmorg/ui or @realmorg/unicons.
license: MIT
metadata:
  author: realmorg
  homepage: https://realm.js.org
---

# REALM

REALM builds native web components from one HTML tag. There is no compiler, no build step and no virtual DOM. A page loads REALM from a CDN, and each `<custom-element>` becomes a real custom element with a shadow root.

<!-- generated:versions -->
Written for REALM `2.0.0-alpha.5`, REALM UI `2.0.0-alpha.4` and Unicons `2.0.0-alpha.3`. The tags load the latest build from `realm.js.org/dist`.
<!-- /generated:versions -->

## When to use this skill

- Writing or changing a REALM component, a component file, or a page that loads `realm.js`.
- Building UI with REALM UI (`ui-button`, `ui-dialog`, `ui-sidebar-layout`, …) or icons with `<u-icon>`.
- Loading data with fetch attributes (`fetch`, `into`, `render`, `busy`, `trigger`).
- Fixing a REALM console warning (they start with `[realm]`).

REALM is not React, Vue, Svelte, Lit, Alpine or htmx. Do not bring their syntax. If you are about to write `{{ }}`, `{}`, `x-`, `v-`, `:attr`, `@click`, `className` or JSX, stop and use the REALM form below.

## The mental model

A component is one `<custom-element name="…">` with up to three kinds of children:

```html
<custom-element name="todo-counter">
  <script>
    const props = defineProps({ label: prop.string().default("Tasks") });
    const todo = useState({
      items: [],
      get remaining() {
        return this.items.filter((item) => !item.done).length;
      },
    });

    function add() {
      todo.items.push({ id: crypto.randomUUID(), done: false });
    }
  </script>

  <style>
    :host {
      display: inline-flex;
      gap: calc(var(--spacing) * 2);
    }
  </style>

  <span><slot name="@label"></slot>: <slot name="#todo.remaining">0</slot></span>
  <button type="button" onclick="add()">Add</button>
</custom-element>
```

- **Script**: plain JavaScript that runs once per element. Helpers such as `defineProps`, `useState`, `observe` and `dispatch` are in scope without imports. Top-level names (`todo`, `add`) are what the markup can use.
- **Style**: scoped to the component's shadow root. Use the theme tokens.
- **Markup**: everything else. It holds **references**, never expressions:
  - `<slot name="#todo.remaining">` shows a value from the script. `<slot name="@label">` shows a prop. The slot's children are the fallback while the value is empty.
  - `_attr="#ref"` binds an attribute or property: `_disabled="@disabled"`, `_hidden="!#panel.open"`, `_value="#form.email"`. `!` is the only operator.
  - `onclick="add()"` is a native handler attribute that calls a script function. `event`, `this` and loop variables are in scope.
  - `<is-visible when="#ref">`, `<is-hidden when="#ref">`, `<repeat-list of="#ref">` and the `repeat` attribute handle conditions and lists.
- Reactivity is fine-grained: only `useState`, props, stores and getters on them update the page. A plain `let count = 0` never does.

## Setup: CDN, no build

Recommend the CDN. Do not suggest `npm install` for REALM, REALM UI or Unicons, and do not add a bundler.

```html
<link rel="stylesheet" href="https://realm.js.org/dist/realm.css">
<link rel="stylesheet" href="https://realm.js.org/dist/ui/theme.css">
<script type="module" src="https://realm.js.org/dist/realm.js"></script>

<!-- REALM UI: the whole kit, or one file per component (see references/ui-components.md) -->
<import-element from="https://realm.js.org/dist/ui/ui.html"></import-element>
<!-- Unicons, only when the page uses <u-icon> -->
<import-element from="https://realm.js.org/dist/unicons/unicons.html"></import-element>
```

`realm.css` hides definitions and undefined elements, so nothing flashes. `theme.css` holds the design tokens, and your own components should use it too. `realm.js.org/dist` always serves the latest build. To pin an exact version in production, load the npm package from jsDelivr instead (`https://cdn.jsdelivr.net/npm/@realmorg/realm@2.0.0-alpha.1/dist/realm.js`). Pages that use `<import-element>` must be served over HTTP (`python3 -m http.server`), not opened from `file://`.

## Quick start

A complete page with an inline definition. Inline definitions use `type="realm"` on the script and style:

```html runnable
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Greeting</title>
  <link rel="stylesheet" href="https://realm.js.org/dist/realm.css">
  <link rel="stylesheet" href="https://realm.js.org/dist/ui/theme.css">
  <script type="module" src="https://realm.js.org/dist/realm.js"></script>
</head>
<body>
  <import-element from="https://realm.js.org/dist/ui/components/button.html"></import-element>
  <import-element from="https://realm.js.org/dist/ui/components/input.html"></import-element>
  <import-element from="https://realm.js.org/dist/ui/components/label.html"></import-element>

  <custom-element name="greeting-form">
    <script type="realm">
      const greeting = useState({
        name: "",
        get message() {
          return this.name.trim() ? `Hello, ${this.name.trim()}!` : "";
        },
      });

      function updateName(field) {
        greeting.name = field.value;
      }

      function clear() {
        greeting.name = "";
      }
    </script>

    <style type="realm">
      :host {
        display: grid;
        gap: calc(var(--spacing) * 2);
        max-width: calc(var(--spacing) * 80);
      }
    </style>

    <ui-label for="name">Your name</ui-label>
    <ui-input id="name" _value="#greeting.name" oninput="updateName(this)"></ui-input>
    <p><slot name="#greeting.message">Type your name.</slot></p>
    <ui-button variant="outline" _disabled="!#greeting.name" onclick="clear()">Clear</ui-button>
  </custom-element>

  <greeting-form></greeting-form>
</body>
</html>
```

In an app, move each definition into its own file (`greeting-form.html`) with a plain `<script>` and `<style>`, and load it with `<import-element from="greeting-form.html">`. See [references/imports.md](references/imports.md).

## Hard rules

1. **No interpolation.** Never write `{{x}}`, `${x}` or `{x}` in markup. Show values with `<slot name="#state.path">` or `<slot name="@prop">`.
2. **References only in attributes.** `_attr`, `when`, `of`, `repeat`, `into`, `busy`, `headers` and `params` take a reference (`#name.path`, `@prop`, `!#name.path`), never an expression. `_hidden="!#cart.isEmpty"` is fine. `_hidden="#cart.items.length === 0"` is not: put the logic in a getter (`get isEmpty()`) and reference it. Comparisons in conditions use `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `contains`.
3. **Script `type` depends on where the definition lives.** Inline in a page: `<script type="realm">` and `<style type="realm">`, even when the script has `import` lines. In a component file loaded by `<import-element>`: a plain `<script>`, or `<script type="module">` when it uses `import`. Never `<script type="module">` inline in a page (it runs as page code).
4. **Bindings are one-way.** `_value="#form.email"` only writes the field. Send changes back with a handler: `oninput="setEmail(this.value)"`.
5. **Handlers call functions.** Keep `on…` attributes to one call (`onclick="remove(item)"`). Logic goes in the script.
6. **Lists inside `<ul>`, `<ol>`, `<table>`, `<tbody>`, `<tr>`, `<select>` and `<datalist>` use the `repeat` attribute** on the item (`<li repeat="#todo.items" as="item" key="id">`). `<repeat-list>` and `<is-visible>` are moved out of those elements by the HTML parser. Give lists that change a `key`.
7. **Use compound parts.** Build REALM UI from its parts (`<ui-card-header>`, `<ui-dialog-trigger>`, `<ui-select>` with `<option>` children). Parts place themselves, so do not add `slot="…"` to them.
8. **No inline `style` on `ui-*` elements.** Use their attributes (`variant`, `size`, `side`), a class styled in your component's `<style>`, `::part()`, or tokens.
9. **Design tokens, not raw values.** Sizes, spacing, radii, shadows and colours come from `theme.css`: `calc(var(--spacing) * 4)`, `var(--text-sm)`, `var(--radius-md)`, `var(--shadow-sm)`, `var(--muted-foreground)`.
10. **Lookup tables, not `else if` chains.** Map a case to data (`const VIEWS = { loading: …, error: … }`) and read it in a getter, or choose with `<is-visible when="#status.state" eq="error">`.
11. **Script order:** `defineProps`, then `useState` (and `defineStore`), then functions, then `defineMethods`, `listen` and lifecycle hooks, and `observe` last. Call `defineProps` at most once.
12. **Tie everything to the element.** Use `listen()` for listeners on `window` or `document`, the script's `setTimeout`/`setInterval` (cleared on removal), and `{ signal }` for your own `fetch` and `addEventListener`. Nothing goes on `window`.
13. **Native HTML first.** Use `<button>`, `<form>`, `<dialog>`, `hidden`, `required`, `FormData` and native events before inventing anything. Name custom events like native ones: lowercase, no dashes (`dispatch("rate", { value })`, handled with `onrate`).
14. **Component names contain a dash** (`todo-app`). Tags are written with a closing tag: `<todo-app></todo-app>`, never `<todo-app />`.

## Workflow

1. **Plan the pieces.** Check [references/ui-components.md](references/ui-components.md) for a ready component before writing one. Read only the sections you need.
2. **Write the component.** Props for inputs, `useState` for internal state, getters for anything derived, functions for actions. Follow the patterns in [references/recipes.md](references/recipes.md).
3. **Check the markup** against the hard rules above, and [references/pitfalls.md](references/pitfalls.md) when something does not update.
4. **Run it in a browser** and read the console. Every `[realm]` warning names the component and the problem. See [references/testing.md](references/testing.md).

## Reference files

Read a file when the task needs it. They are written to be read on their own.

| File | Read it when |
| --- | --- |
| [references/api.md](references/api.md) | You need a script helper: `defineProps` and `prop` rules, `useState`, `observe`, `tick`, `attrs`, `dispatch`, `listen`, `defineMethods`, `useChildren`, lifecycle hooks, `defineStore`, `lookup`, `host`, `refs`, `signal`, `internals`, timers, or the module exports |
| [references/markup.md](references/markup.md) | You write markup: definition attributes, references, value slots and their modes, `_` bindings, handlers (also on plain pages), control flow, lists and keys, `ref`, `focusgroup`, compound parts |
| [references/fetching.md](references/fetching.md) | A component loads or sends data: every fetch attribute, `trigger` (including state triggers), `into` modes (`update`, `remove`), `render` modes, request events, `busy`, `timeout` |
| [references/imports.md](references/imports.md) | You split components into files, import dependencies, share modules or stores, lazy-load with `for`, or use `importDefinitions` |
| [references/styling.md](references/styling.md) | You style a component: `:host`, reactive CSS (`--attr-*`, `--state-*`, `:state()`), custom states, theme tokens, dark mode, styling `ui-*` from outside |
| [references/forms-a11y.md](references/forms-a11y.md) | You build a form, a form-associated component, or need roles, focus, labels and keyboard support |
| [references/ui-components.md](references/ui-components.md) | You use any `ui-*` component. Long: use the index and read one section |
| [references/unicons.md](references/unicons.md) | You show icons with `<u-icon>` |
| [references/recipes.md](references/recipes.md) | You start a common feature: todo list, fetched list with loading and error states, validated form, dialog, dashboard layout, multi-page app without a router |
| [references/pitfalls.md](references/pitfalls.md) | Something does not render or update, or the console shows a `[realm]` message |
| [references/testing.md](references/testing.md) | You need to check a page in a real browser |

The full docs are at https://realm.js.org, with a Markdown copy of every page (`https://realm.js.org/docs/state.md`) and an index at https://realm.js.org/llms.txt.
