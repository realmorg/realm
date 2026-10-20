# REALM v2: Design and Delivery Plan

| | |
| --- | --- |
| **Status** | In progress: `2.0.0-alpha.0` (phases 0–8 done; release not started) |
| **Owner** | Ribhararnus Pracutian |
| **Last updated** | 19 October 2026 |
| **Branch** | `main` |
| **Current release** | `@realmorg/realm@0.0.19` (npm, September 2023) |
| **Target release** | `@realmorg/realm@2.0.0` |

---

## Summary

REALM lets you build web components by writing HTML, with no build step.

Version 1 described everything with special tags: `<element-state>` for data, `<set-state>` for changes, `<http-request>` for requests, and a `<template>` around the markup. It proved the idea, but it was built quickly. It has no real tests, 22 confirmed bugs (including the one that breaks Unicons), and simple tasks need deeply nested tags.

In version 2, a component is a single `<custom-element>` tag containing three parts:

- **A `<script>`** with the component's logic in plain JavaScript. Props are declared with `defineProps`, using typed definitions similar to zod. State is created with `useState`.
- **A `<style>`** with the component's CSS.
- **Plain HTML markup.**
  - Values are shown with the native `<slot>` tag: `<slot name="#todo.draft">`.
  - Attributes are bound with v1's underscore prefix: `_href="#link.url"`.
  - Events use native handlers such as `onclick="add()"`, which automatically call functions from the component's script.
  - Requests are made with attributes, in the spirit of htmx: `fetch="/api/todos" into="#todo.items"`.
  - Repetition and conditions use REALM tags: `<repeat-list>`, `<is-visible>`.

There is no compiler and no `<template>` tag, and markup attributes never contain script. The only exception is native event handlers, as in plain HTML. Components are always defined with `<custom-element>`, never through a JavaScript API.

The work is split into ten phases, from archiving v1 to the 2.0 release. Each phase is specified in OpenSpec before code is written and has to pass explicit tests before the next starts.

---

## Progress

### Phases

| Phase | Status |
| --- | --- |
| 0. Archive v1 | Done locally (tags `v1-final`, `unicons-v1-final`, tarballs). Pushing waits for the new GitHub remote |
| 1. Foundation and spikes | Done. Spike results in [section 23](#23-roadmap) |
| 2–6. Runtime | Done. 137 OpenSpec scenarios, each with a test; 100% coverage; Chromium, Firefox and WebKit |
| 7. Website and docs | Done. 94 pages (docs, reference, one page per component, examples, blog), built in CI and served at https://realmui.github.io/ by the `realmui/realmui.github.io` repository, which rebuilds when `main` changes. Every page is tested in three browsers |
| 8. Unicons v2 | Done in `realmui/unicons` (branch `feat/v2`): one `<u-icon>`, 50,939 icons in 31 sets, per-chunk lazy loading |
| 9. Release | Not started |
| After 2.0: REALM UI | Pulled forward. `@realmorg/ui` ports shadcn/ui to about 60 native components |

### Primitives added during implementation

Building REALM UI and the examples showed where component scripts grew complicated. Each case became a core primitive rather than component code:

| Primitive | What it replaces |
| --- | --- |
| `attrs` | Reading and writing host attributes by hand |
| `dispatch(type, detail)` | `host.dispatchEvent(new CustomEvent(…, { bubbles, composed }))` |
| `listen(type, handler, target)` | `addEventListener` plus manual cleanup |
| `defineMethods({ … })` | `Object.defineProperty` on the host |
| `useChildren(selector, attributes)` | `MutationObserver` over light-DOM children |
| `tick()` | Waiting for the DOM to update after a state change |
| Writable props | Separate state mirroring a prop |
| Reactive CSS: `var(--attr-x)`, `var(--state-a-b)`, `:state(attr-variant-is-outline)` | Class toggling and inline style plumbing (v1's reactive CSS, now on `CustomStateSet`) |
| `ref="control"` delegation | Syncing value, validity, `change`, Enter-to-submit and label text between a host and its inner input |
| `focusgroup` polyfill | Hand-written roving tabindex |
| SVG bindings | Attribute case fixes and text rendering inside SVG |

Specs: `styling`, `component-api`, `forms-a11y`, `bindings` in `openspec/specs`.

### Requirements checklist

| Requirement | Status |
| --- | --- |
| Native HTML first; no syntax copied from other frameworks | Done |
| Latest Chrome, Edge, Firefox and Safari | Done. Every test runs in Chromium, Firefox and WebKit |
| Very small runtime | 15 KB gzip, 13.5 KB brotli, budget 16 KB gzip. The original 14 KB estimate was raised after the primitives above were added; lazy-loading `fetch` would get under 14 KB at the cost of a request waterfall |
| No loading glitch | Done. `realm.css` hides undefined components; definitions never flash |
| Fast | Done. js-framework-benchmark operations have budgets in the `perf` test project |
| No memory leaks | Done. GC tests in the `memory` project; every listener, timer, observer and request stops on removal |
| Turing complete, complex apps | Done: todo, kanban (Trello-like), chess (with an engine), dashboard, weather (Open-Meteo), contacts (CRUD over a service-worker API), login/signup/OTP blocks |
| Reactive styling | Done (reactive CSS above) |
| Real imports, no embedded copies | Done. Examples and docs load components through `<import-element>` |
| Website built purely with REALM, in CI, not committed | Done: `apps/site`, built and deployed by `realmui/realmui.github.io` (triggered from `.github/workflows/website.yml`) |
| `llms.txt` | Done: `llms.txt`, `llms-full.txt` and a Markdown copy of every page |
| shadcn/ui ported to native HTML with `:host` styling | Done: `@realmorg/ui`, Tailwind-style tokens in `theme.css`. Compound parts (`ui-card-header`, `ui-dialog-trigger`, …) instead of `slot=` attributes, and no `style=` needed in usage |
| Test coverage | 100% everywhere: runtime and Vite plugin (V8 via Vitest), and every component script in the UI library, examples and site (V8 block coverage mapped to each component's script and handlers, `scripts/component-coverage.mjs`) |
| Accessibility | Done. axe-core runs on every example and the main site pages in all three browsers |
| Unicons built purely with REALM | Done |
| Vite plugin (pre-assembled components for strict CSP) and `custom-elements.json` | Done: `@realmorg/vite-plugin`, tested under `script-src 'self'` in all three browsers |

---

## Table of contents

**Part I: Context**

1. [Background](#1-background)
2. [Current state of v1](#2-current-state-of-v1)

**Part II: Design**

3. [Design principles](#3-design-principles)
4. [Anatomy of a component](#4-anatomy-of-a-component)
5. [How it works without a compiler](#5-how-it-works-without-a-compiler)
6. [Props](#6-props)
7. [State and observers](#7-state-and-observers)
8. [Showing values and binding attributes](#8-showing-values-and-binding-attributes)
9. [Nested components and scope](#9-nested-components-and-scope)
10. [Conditional and list rendering](#10-conditional-and-list-rendering)
11. [Events](#11-events)
12. [Data fetching](#12-data-fetching)
13. [Importing components](#13-importing-components)
14. [Shared state](#14-shared-state)
15. [Forms and accessibility](#15-forms-and-accessibility)
16. [Security model](#16-security-model)
17. [Runtime internals](#17-runtime-internals)
18. [Unicons](#18-unicons)
19. [Website and documentation](#19-website-and-documentation)

**Part III: Delivery**

20. [Repository and toolchain](#20-repository-and-toolchain)
21. [Specification workflow](#21-specification-workflow)
22. [Testing strategy](#22-testing-strategy)
23. [Roadmap](#23-roadmap)
24. [Risks](#24-risks)
25. [After 2.0](#25-after-20)
26. [Decisions needed](#26-decisions-needed)

**Appendices**

- [A. Bug audit of v1](#appendix-a-bug-audit-of-v1)
- [B. v1 to v2 cheat sheet](#appendix-b-v1-to-v2-cheat-sheet)
- [C. References studied](#appendix-c-references-studied)

---

# Part I: Context

## 1. Background

REALM ("Reactive Lightweight Markup Language") is a framework for building websites and small apps without a JavaScript toolchain. A page loads one script, and components are written in HTML. Two real projects use it: the REALM website itself and Unicons, an icon library with more than 44,000 icons.

A v1 component:

```html
<custom-element name="counter-button">
  <element-state name="count" type="number">0</element-state>
  <element-flow>
    <trigger-event click="button">
      <set-state name="count" mutate="+" value="1"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    <style>
      button { font-weight: bold; }
    </style>
    <button ref="button">Clicked <slot name="#count"></slot> times</button>
  </template>
</custom-element>
```

The same component in v2:

```html
<custom-element name="counter-button">
  <script>
    const counter = useState({ count: 0 });

    function increment() {
      counter.count++;
    }
  </script>

  <style>
    button { font-weight: bold; }
  </style>

  <button onclick="increment()">Clicked <slot name="#counter.count"></slot> times</button>
</custom-element>
```

**Why a v2?**

- The runtime has bugs that real projects hit. Unicons can't load a large icon set without errors.
- There is effectively no test suite.
- Simple tasks need deep trees of special tags. Anything slightly unusual needs a workaround.
- The internals can't support form controls, accessibility or theming, which a UI component library needs.

## 2. Current state of v1

### 2.1 What's in the repository

| Path | What it is | Plan for v2 |
| --- | --- | --- |
| `packages/realm` | The runtime: about 4,500 lines of TypeScript, built with tsup and terser | Rewritten |
| `packages/realm/tests` | One placeholder test (`expect(true).eq(true)`) | Replaced with a real suite |
| `packages/realm/playground` | Hand-made demo pages, the only thing that exercises the runtime | Rewritten as end-to-end test fixtures |
| `packages/astro-libs` | Shared Astro layouts for the website and blog | Merged into the new site |
| `apps/web` | Website and docs (Astro 2). Examples are embedded from CodeSandbox | Rebuilt |
| `apps/blog` | Separate blog (Astro 2) | Merged into the website at `/blog` |
| `../unicons` | 44,131 generated files, one full component per icon | Re-architected ([section 18](#18-unicons)) |

Versions are inconsistent. npm and `package.json` say `0.0.19`, but git tags go up to `0.1.4`. v2 will publish as `2.0.0-alpha.N`, and the mismatch will be recorded in the v1 archive notes.

### 2.2 Confirmed bugs

The audit found 22 real bugs, each traced to a file and line. The full list is in [Appendix A](#appendix-a-bug-audit-of-v1). The most important ones:

- **The Unicons error.** When two `<import-element>` tags load the same file at the same time, both fetch it and both try to register the same component. The second registration throws `Element "x" has invalid name or already defined` inside a promise, where nothing catches it (A1–A6).
- **Listeners are never removed.** Every time a list re-renders, another copy of each listener is added, so a click can run its action several times (A7).
- **Timers and observers leak.** They keep running after the element is removed (A8, A10).
- **Stored state comes back as a string.** A number saved to `localStorage` is read back as text (A12).
- **HTML state is inserted without sanitising**, which is an XSS risk (A19).
- **Inline scripts break under a Content Security Policy**, because they are executed through `blob:` URLs (A18).

Every bug gets a regression test before it's fixed.

### 2.3 Design problems

- **Every operation is a tag.** Changing a value, reacting to a click and making a request each need nested tags. Anything else needs a `<script type="module/realm">` escape hatch.
- **Behaviour lives far from the element.** A button and its click handler are joined only by a `ref` name.
- **Value slots leak.** `<slot name="#count">` works by creating extra elements in the page.
- **Hidden content is still alive.** `<is-visible>` hides content with CSS, so hidden parts keep running.
- **No reactivity model.** No batching, no derived values, and every change searches the whole component.
- **Not ready for a UI library.** No form participation, no accessibility defaults, no styling hooks, no component manifest.

---

# Part II: Design

## 3. Design principles

1. **`<custom-element>` is the only way to define a component.** There is no JavaScript definition API.
2. **One tag, three parts.** A `<script>`, a `<style>` and markup, with no `<template>` wrapper.
3. **Logic lives in the script, as plain JavaScript.** REALM provides a small set of named helpers (`defineProps`, `useState`, `observe`, …), not a tag language.
4. **Markup holds no script, except native event handlers.** Values and attributes are bound by *reference* (`#todo.draft`, `@heading`), never by expression. `onclick="…"` and other native handlers work as they do in HTML.
5. **Behave like native HTML.** If the browser has a feature, REALM uses it with its native name and meaning: `<slot>` to show content, `onclick` for events, `dispatchEvent` to emit, `hidden`, `<form>`, `onload` and `onerror`.
6. **Build on v1's vocabulary.** The `_` binding prefix, the `#` and `@` references, value slots, `<repeat-list>`, `<is-visible>`, `<is-hidden>` and `<import-element>` all come from v1.
7. **No compiler.** The browser parses the HTML, and REALM assembles the component at runtime. An optional build step can pre-assemble components, but it's never required.
8. **Other frameworks are references.** We learn from them, especially their test suites, but don't copy their syntax ([Appendix C](#appendix-c-references-studied)).
9. **Clean up after yourself.** Everything a component starts stops when it's removed.
10. **Specify first, then test, then build.**

## 4. Anatomy of a component

### How v1 does it

A `<custom-element>` holds declaration tags (`<element-attr>`, `<element-state>`), behaviour tags (`<element-flow>`, `<trigger-event>`, `<set-state>`), and a `<template>` containing markup and styles.

### Proposal

A `<custom-element>` contains three parts, in any order:

| Part | What it holds | Rules |
| --- | --- | --- |
| `<script>` | The component's logic, in plain JavaScript | At most one. Runs once **per element instance** |
| `<style>` and `<link rel="stylesheet">` | The component's CSS | Scoped to the component through shadow DOM |
| Everything else | The markup | Value slots, `_` bindings, native event handlers, fetch attributes, REALM tags |

### Example: a todo list

```html
<custom-element name="todo-app">
  <script>
    const props = defineProps({
      heading: prop.string().default("Todos"),
    });

    const todo = useState({
      items: [],
      draft: "",
      get remaining() {
        return this.items.filter((item) => !item.done).length;
      },
      get isEmpty() {
        return this.items.length === 0;
      },
    });

    function add(event) {
      event.preventDefault();
      todo.items.push({ id: crypto.randomUUID(), text: todo.draft, done: false });
      todo.draft = "";
    }

    function updateDraft(input) {
      todo.draft = input.value;
    }

    function toggle(item) {
      item.done = !item.done;
    }
  </script>

  <style>
    :host { display: block; }
    li[data-done] { text-decoration: line-through; }
  </style>

  <h1><slot name="@heading"></slot></h1>

  <form onsubmit="add(event)">
    <input name="draft" _value="#todo.draft" oninput="updateDraft(this)" placeholder="What needs doing?">
  </form>

  <ul>
    <repeat-list of="#todo.items" as="item" key="id">
      <li _data-done="#item.done" onclick="toggle(item)">
        <slot name="#item.text"></slot>
      </li>
    </repeat-list>
  </ul>

  <is-hidden when="#todo.isEmpty">
    <p><slot name="#todo.remaining"></slot> left</p>
  </is-hidden>

  <slot></slot>
</custom-element>

<todo-app heading="Groceries"></todo-app>
```

### Where components live

| Style | How | Recommended for |
| --- | --- | --- |
| **In their own file** | `todo-app.html`, loaded with `<import-element from="/components/todo-app.html">` | Everything real. The file is parsed off-page, so nothing in it runs or loads until REALM assembles it |
| **Inline in the page** | The `<custom-element>` written in the page body | Prototypes and demos. Its script is `<script type="realm">` ([section 5](#5-how-it-works-without-a-compiler)) |

## 5. How it works without a compiler

You never write or see any of this, but it explains several rules in later sections.

### Step by step

1. **Read.** REALM reads the `<custom-element>`. It collects the script, styles and markup, plus every reference (`#…`, `@…`) and every native event handler in the markup.
2. **Assemble.** REALM builds one JavaScript module for the component. Your script runs inside a per-instance setup function, unchanged. Each event handler from the markup is placed inside that same function, which is why `onclick="add(event)"` can call your `add` function directly. For each `#` reference, REALM adds a small reader for that variable.
3. **Run.** The module is inserted as a normal `<script type="module">`. If the page uses a Content Security Policy nonce, REALM copies it, so the script is allowed.
4. **Define.** REALM registers a native custom element. Each time one is added to the page, REALM:
   - creates its shadow root and adopts the shared stylesheet
   - clones the markup and runs setup for that instance
   - connects every slot, binding and handler

REALM never uses `eval`, `new Function` or `blob:` URLs. Your code isn't rewritten. It's only placed inside a fixed wrapper.

### Rules that follow from this

| Rule | Reason |
| --- | --- |
| The script runs once per instance | It's the body of the setup function. Shared code goes in a separate JavaScript file you import |
| `import` statements go at the top of the script | They're moved above the wrapper. Relative paths resolve against the component's file |
| Only values from `useState`, `defineProps` and stores update the page | Without a compiler, a plain `let count = 0; count++` changes a variable that nothing can observe |
| Only definition markup is assembled | HTML that arrives later (from a request, or an `html` slot) is never scanned for handlers ([section 16](#16-security-model)) |

### Inline definitions

A plain `<script>` written directly in the page runs immediately in the global scope, before REALM sees it. Spike S1 tested whether a small bootstrap script in `<head>` could hold it back. It worked in Chromium but not in Firefox or WebKit, so inline definitions mark their script with a type the browser doesn't run:

```html
<custom-element name="hello-world">
  <script type="realm">
    const greeting = useState({ name: "world" });
  </script>
  <p>Hello, <slot name="#greeting.name"></slot></p>
</custom-element>
```

REALM warns when an inline definition uses a plain `<script>`. Components in their own files, loaded with `<import-element>`, use a plain `<script>` (or `type="module"` when it has `import` statements), because fetched HTML never runs scripts.

## 6. Props

### How v1 does it

```html
<element-attr name="count" type="number">0</element-attr>
```

The only types are `string`, `number`, `boolean`, `array`, `object` and `html`. There's no validation, and unexpected input can crash the element (A13).

### Proposal

`defineProps` declares the component's public attributes with a typed builder, in the style of zod. Each definition controls:
- how the attribute text is converted (`"5"` becomes `5`)
- validation
- the default value
- whether the property is reflected back to the attribute
- the generated documentation and TypeScript types

```js
const props = defineProps({
  heading: prop.string().default("Todos"),
  count: prop.number().int().min(0).default(0),
  variant: prop.enum(["primary", "ghost", "danger"]).default("primary"),
  disabled: prop.boolean(),
  tags: prop.array(prop.string()).default([]),
  user: prop.object({ name: prop.string(), email: prop.string().email() }).optional(),
  href: prop.string().url().required(),
  size: prop.number().attribute("data-size").reflect(),
});
```

| Builder | Converts from attribute text |
| --- | --- |
| `prop.string()` | As-is. Rules: `.min()`, `.max()`, `.pattern()`, `.email()`, `.url()` |
| `prop.number()` | Numeric text. Rules: `.int()`, `.min()`, `.max()` |
| `prop.boolean()` | Native rule: present means `true`, absent means `false` |
| `prop.enum([...])` | One of the listed strings |
| `prop.array(item)`, `prop.object(shape)` | JSON text, validated against the item or shape. Usually set as a property or through `_` bindings rather than written by hand |
| `prop.date()` | ISO date text |

| Modifier | Meaning |
| --- | --- |
| `.default(value)` | Used when the attribute is missing or invalid |
| `.required()` | Missing value is reported during development |
| `.optional()` | Allows `undefined` |
| `.reflect()` | Setting the property also updates the attribute |
| `.attribute("name")` | Use a different attribute name |

The returned `props` object is reactive and read-only inside the component. In markup, props are referenced with `@`: `<slot name="@heading">`, `_disabled="@disabled"`.

Invalid values never crash a component. During development, REALM logs a warning naming the component, the prop and the rule, then uses the default.

## 7. State and observers

### How v1 does it

```html
<element-state name="items" type="array">[]</element-state>
<set-state name="items" mutate="push" from="localState" value='[{ "label": "$.task-label" }]'></set-state>
<listen-event statechanged="items">…</listen-event>
```

### Proposal

| Helper | Purpose |
| --- | --- |
| `useState(initial)` | Creates reactive state. Changing a property, including array methods like `push` and `splice`, updates every slot and binding that uses it. Getters act as derived values and are cached until their inputs change |
| `observe(fn)` | Runs `fn` now, then again whenever any state it read changes. No dependency list: REALM tracks what was read. It may return a clean-up function. Stops automatically when the element is removed |
| `onConnected(fn)` / `onDisconnected(fn)` | Run code when the element is added to or removed from the page. Named after the native `connectedCallback` and `disconnectedCallback` |
| `host` | The element itself |
| `refs` | Elements marked with `ref="name"` in the markup |
| `signal` | An `AbortSignal` that fires when the element is removed. Pass it to `fetch`, `addEventListener` and timers |
| `internals` | The element's `ElementInternals`, for form components ([section 15](#15-forms-and-accessibility)) |

These helpers are available in every component script without importing. They can also be imported from `@realmorg/realm` for editor support.

### Example

```html
<custom-element name="stop-watch">
  <script>
    const props = defineProps({
      interval: prop.number().min(10).default(1000),
      autostart: prop.boolean(),
    });

    const watch = useState({ elapsed: 0, running: props.autostart });

    observe(() => {
      if (!watch.running) return;
      const id = setInterval(() => watch.elapsed++, props.interval);
      return () => clearInterval(id);
    });

    function toggle() {
      watch.running = !watch.running;
    }
  </script>

  <p><slot name="#watch.elapsed">0</slot> ticks</p>
  <button onclick="toggle()">Start / stop</button>
</custom-element>
```

### Why not `useEffect`

`observe` has no dependency array to keep in sync, and it doesn't run after every render. It runs once, then only when something it actually read has changed. Clean-up happens automatically on removal.

## 8. Showing values and binding attributes

### How v1 does it

```html
<slot name="#count"></slot>     <!-- show a state value -->
<slot name="@label"></slot>     <!-- show an attribute -->
<a _href="#url">Link</a>        <!-- bind an attribute -->
```

v1's value slots worked by adding hidden elements to the page and copying values into them.

### Proposal

Keep v1's syntax, and implement it natively.

**Showing a value: `<slot>`.** A slot whose name starts with `#` (state) or `@` (prop) shows that value as its content.

| You write | What appears |
| --- | --- |
| `<slot name="#todo.remaining"></slot>` | The value, as text |
| `<slot name="@heading"></slot>` | The prop value, as text |
| `<slot name="#user.name">Guest</slot>` | `Guest` while the value is empty, `null` or `undefined`. This is the native fallback-content behaviour of `<slot>` |
| `<slot name="#post.body" html></slot>` | The value as HTML, sanitised first. `html-unsafe` skips sanitising and must be chosen explicitly |
| `<slot></slot>`, `<slot name="footer"></slot>` | Native slots for content placed inside the component, unchanged |

REALM writes the value into the slot's fallback content inside the shadow root. Nothing is added to the page outside the component, and the slot stays a real slot.

**Binding an attribute: `_` prefix.** `_` followed by an attribute name binds that attribute to a reference.

| You write | What happens |
| --- | --- |
| `_href="#link.url"` | Sets `href` |
| `_hidden="#panel.closed"` | Native boolean rule: `true` adds the attribute, `false`/`null` removes it |
| `_hidden="!#panel.open"` | A leading `!` negates the reference. This is the only operator |
| `_disabled="@disabled"` | Binds to a prop |
| `_data-done="#item.done"`, `_aria-expanded="#menu.open"` | Any `data-*` or `aria-*` attribute |
| `_class="#theme.className"` | The whole `class` value |
| `_value="#todo.draft"`, `_checked="#item.done"` | On form fields, sets the **current** value (the property), not only the default |
| `_user="#session.user"` on a REALM component | Passes the value as a property, so objects and arrays arrive intact ([section 9](#9-nested-components-and-scope)) |

**References, not expressions.** Bindings and slots accept a reference (with an optional leading `!`), never a calculation. Comparisons, formatting and combinations belong in the script, usually as getters:

```js
const cart = useState({
  items: [],
  get total() { return this.items.reduce((sum, item) => sum + item.price, 0); },
  get totalLabel() { return `$${this.total.toFixed(2)}`; },
  get isEmpty() { return this.items.length === 0; },
});
```

```html
<p _hidden="#cart.isEmpty">Total: <slot name="#cart.totalLabel"></slot></p>
```

Changes come back through native events, for example `oninput="updateDraft(this)"`. There is no hidden two-way binding.

## 9. Nested components and scope

Components can be nested freely. References resolve by **owner first, then up through the parents**.

### Rule 1: a reference belongs to the component whose markup it's written in

Content you place inside a child component is still yours. In this example, `#todo.remaining` is written in `todo-app`'s markup, so it reads `todo-app`'s state, even though it's displayed inside `ui-card`:

```html
<custom-element name="todo-app">
  <script>
    const todo = useState({ items: [], get remaining() { return this.items.length; } });
  </script>

  <ui-card>
    <slot name="#todo.remaining"></slot> items left
  </ui-card>
</custom-element>
```

This works natively: the value slot lives in `todo-app`'s shadow tree and is projected into `ui-card` through `ui-card`'s own `<slot>`.

### Rule 2: if the owner doesn't have it, look at the parents

When a name isn't defined in the owning component, REALM looks in the component that contains it, then that component's parent, and so on up to the page. A deeply nested component can read shared values without passing them down at every level:

```html
<custom-element name="app-shell">
  <script>
    const session = useState({ user: { name: "Ana" } });
  </script>

  <nav-bar></nav-bar>
</custom-element>

<custom-element name="nav-bar">
  <p>Signed in as <slot name="#session.user.name">Guest</slot></p>
</custom-element>
```

`nav-bar` has no `session`, so the slot finds the one in `app-shell`. The same lookup applies to `_` bindings and to function names in event handlers.

### Rule 3: pass data explicitly when you want a clear contract

A child component's props are its public interface. Pass values with `_` bindings:

```html
<user-card _user="#session.user" _compact="@compact"></user-card>
```

### Guard rails

- A name found in a parent is reported once during development ("`nav-bar` reads `session` from `app-shell`"), so implicit sharing is never a surprise.
- A component's own names always win over a parent's.
- If no component has the name, REALM reports it during development and shows the slot's fallback content.

## 10. Conditional and list rendering

### How v1 does it

```html
<is-visible value="#is-loading" eq="true">Loading…</is-visible>

<repeat-list of="#todos">
  <div><slot name="$.label"></slot> (item <slot name="!.index"></slot>)</div>
</repeat-list>
```

### Problems

- `<is-visible>` hides content with CSS, so hidden content keeps running.
- `<repeat-list>` rebuilds the whole list on every change, losing focus and typed text and stacking duplicate listeners (A7, A21).

### Proposal

Keep the tags, keep v1's comparison attributes, and fix how they work.

| Tag | Behaviour |
| --- | --- |
| `<is-visible when="#ref">` | Adds its content when the value is truthy, and **removes** it otherwise. Removed content has no running bindings, listeners or requests |
| `<is-hidden when="#ref">` | The opposite |
| `<repeat-list of="#ref" as="item" index="i" key="id">` | One copy of its content per item. `#item` and `#i` work inside it, and `item` and `i` are available in event handlers. With `key` (a property name of each item), only changed items are touched, and moved items keep their focus and input |

Comparison attributes from v1 still work for simple cases: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `contains`.

```html
<is-visible when="#order.status" eq="shipped">On its way!</is-visible>
<is-visible when="#cart.count" gt="0">…</is-visible>
```

Both tags lay out as if they weren't there (`display: contents`). To hide without removing, use `_hidden`.

**Tables and selects.** The browser moves unknown tags out of `<table>`, `<tr>` and `<select>` while parsing. In those places only, put the loop on the native element:

```html
<tbody>
  <tr repeat="#report.rows" as="row" key="id">
    <td><slot name="#row.name"></slot></td>
  </tr>
</tbody>
```

## 11. Events

### How v1 does it

```html
<element-flow>
  <trigger-event click="save-button" debounce="300">…</trigger-event>
  <listen-event on="item-added">…</listen-event>
</element-flow>
```

### Proposal

**Handling events: native `on<event>` attributes.** They work as in plain HTML, with one addition: function names resolve to the component's script automatically.

```html
<button onclick="save()">Save</button>
<input oninput="updateQuery(this.value)">
<li onclick="toggle(item)">…</li>
```

- `event` is the event and `this` is the element, as in native handlers.
- Functions are looked up in the owning component's script, then in its parents (same rule as [section 9](#9-nested-components-and-scope)).
- Inside `<repeat-list>`, the loop variables (`item`, `i`) are in scope.
- `return false` cancels the event, as it does natively.

Keep handlers to a function call. Logic belongs in the script.

**Emitting events: native `dispatchEvent`.** No new API:

```html
<custom-element name="r-dialog">
  <script>
    function close() {
      const allowed = host.dispatchEvent(
        new CustomEvent("requestclose", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: { source: "close-button" },
        }),
      );
      if (allowed) host.removeAttribute("open");
    }
  </script>

  <button onclick="close()">×</button>
  <slot></slot>
</custom-element>
```

Event names are lowercase without dashes, so `on` + name reads like a native handler.

**Handling a component's own events.** Browsers don't support `on<name>` attributes for custom events, so REALM adds that for its components:
- **Inside another component,** `onrequestclose="keepOpen(event)"` calls the parent's `keepOpen`.
- **On a plain page,** the attribute holds ordinary JavaScript, or you assign a function to the property, as with any native handler:

```html
<r-dialog id="dialog" onrequestclose="console.log(event.detail.source)"></r-dialog>
<script>
  dialog.onrequestclose = (event) => event.preventDefault();
</script>
```

The attribute and property stay in sync, the handler runs in the native position among listeners, and `addEventListener` keeps working alongside.

**Debounce and throttle** are attributes on the element that fires the event, matching v1:

```html
<input oninput="search(this.value)" debounce="300ms">
```

## 12. Data fetching

### How v1 does it

```html
<trigger-event click="fetch-button">
  <http-request url="/api/items" method="GET">
    <response-ok><set-state name="content" from="event"></set-state></response-ok>
    <response-fail><set-state name="error" value="$.message" from="event"></set-state></response-fail>
  </http-request>
</trigger-event>
```

### Problems

- Four levels of nesting for one request.
- An older, slower response can overwrite a newer one (A15).
- No loading state, no cancelling, and no way to load data when a component appears.

### Proposal

Requests are made with attributes on the element that triggers them, in the spirit of htmx but with REALM's own names. The `<http-request>` family of tags is removed.

```html
<!-- load on start, into state -->
<ul fetch="/api/todos" trigger="load" into="#todo.items" busy="#todo.loading">
  <repeat-list of="#todo.items" as="item" key="id">
    <li><slot name="#item.title"></slot></li>
  </repeat-list>
</ul>

<!-- search as you type -->
<input type="search" name="q"
       fetch="/api/search" trigger="input" debounce="300ms"
       into="#search.results" busy="#search.loading">

<!-- server-rendered HTML into an element -->
<button fetch="/partials/comments" render="comments" render-mode="append">Load more</button>
<div ref="comments"></div>

<!-- forms: native action and method -->
<form action="/todos" method="post" into="#todo.items" into-mode="append" onload="clearDraft()">
  <input name="text" required>
  <button>Add</button>
</form>
```

### Attributes

| Attribute | Meaning | Default |
| --- | --- | --- |
| `fetch="url"` | Make a request. On `<form>`, the native `action` is used instead | |
| `method` | `get`, `post`, `put`, `patch`, `delete` | `get` (forms use their native `method`) |
| `trigger` | Event that starts the request: any event name, plus `load` (when added) and `visible` (when scrolled into view) | `click`; `submit` for forms; `change` for inputs |
| `debounce`, `throttle` | Delay or limit repeated triggers | |
| `poll="30s"` | Repeat on an interval while the element is on the page | |
| `params="page:#list.page, sort:@order"` | Extra values sent with the request | |
| `headers="#auth.headers"` | Request headers, from a state object | |
| `into="#ref"` | Put the response into state. JSON is parsed automatically | |
| `into-mode` | `replace`, `append` or `prepend` (for arrays) | `replace` |
| `render="refName"` | Insert response HTML into the element with that `ref`. Sanitised | |
| `render-mode` | `replace`, `outer`, `append`, `prepend`, `before`, `after`, `remove`, `text`, or `merge` (keeps focus and typed input) | `replace` |
| `render-select="css"` | Insert only the matching part of the returned HTML | |
| `busy="#ref"` | Set this state to `true` while the request runs | |

**What is sent:**
- A form sends its fields, as natively, including REALM form components.
- An input or select sends its own `name` and value.
- `params` adds more values.

### Events and states

Requests fire the browser's resource-loading events, so results are handled with familiar handlers that call your script:

| Event | When | Typical use |
| --- | --- | --- |
| `loadstart` | Before sending. Cancelable | `onloadstart="return confirmDelete()"` |
| `load` | 2xx response, after `into`/`render` | `onload="clearDraft()"` |
| `error` | Network failure or non-2xx response. Nothing is inserted | `onerror="showError(event.detail)"` |
| `abort`, `timeout` | Cancelled or timed out | |
| `loadend` | Always, at the end | |

`event.detail` holds `status`, `data`, `headers` and `url`.

While a request runs, the element also gets the native `aria-busy="true"`, and the component gets the CSS state `:state(loading)`.

### Built-in safety

- A new request from the same element cancels its previous one, so a slow old response can never overwrite a newer one.
- Requests stop when the element is removed.
- Identical GET requests made at the same moment by different elements are sent once.

### Links (later in Phase 4)

`<a href="/page" render="main">` loads the page into the `main` ref and updates the address bar. Links without `render` behave normally.

### In the script

For anything the attributes can't express, use the native `fetch` with the component's `signal`:

```js
const res = await fetch("/api/report", { signal });
```

### Future browser features to adopt

- **Invoker buttons** (`<button commandfor="dialog" command="show-modal">`) work with REALM dialogs.
- **Declarative partial updates** (`<template for>`, shipping in Chrome) are used for `render` when available.
- **Streaming** (Server-Sent Events) through `fetch` attributes comes after 2.0.

## 13. Importing components

### How v1 does it

```html
<import-element from="/elements/counter.element.html"></import-element>
```

### Problems

This is where the Unicons failure comes from (A1–A6):
- the same file is fetched once per tag
- racing imports register the same component twice, and the error goes uncaught
- failures are silent
- only the first component in a file is used
- a removed import still changes the page

### Proposal

The syntax stays the same. The implementation is rewritten:

| Behaviour | v2 |
| --- | --- |
| Fetching | Each URL is fetched at most once, and every importer waits on the same request |
| Registration | Importing the same component twice is harmless. A real conflict (same name, different source) logs one clear warning naming both files |
| Errors | Failed imports fire `error` on the `<import-element>`, so `onerror` works, and are logged |
| Bundles | One file may contain many `<custom-element>` definitions |
| Removal | An import removed mid-request stops cleanly |
| Throttling | At most six requests per server at a time |
| Lazy loading | `loading="lazy"` waits until a matching tag appears on the page |
| Script imports | `import` statements inside a component resolve relative to the component's file |

```html
<import-element from="/components/ui-bundle.html"></import-element>
<import-element from="/components/charts.html" loading="lazy"></import-element>
<import-element from="/components/map.html" onerror="console.warn(event.detail.url)"></import-element>
```

`<import-script>` and `<import-style>` are removed. Use `import` in the component script, or `<link rel="stylesheet">` in the component.

## 14. Shared state

### How v1 does it

```html
<global-state name="counter" type="number" storage="localStorage">0</global-state>
```

### Problems

- Values come back from storage as strings (A12).
- The store lives on `window.globalState` (A22).

### Proposal

There are two ways to share state:

1. **Parent state** is visible to nested components automatically ([section 9](#9-nested-components-and-scope)). This covers most page-level sharing.
2. **App-wide state** that outlives any component lives in a store, defined in a normal JavaScript module:

```js
// /state/cart.js
import { defineStore } from "@realmorg/realm";

export const cart = defineStore("cart", { items: [] }, { persist: "local" });
```

```html
<custom-element name="cart-badge">
  <script>
    import { cart } from "/state/cart.js";
  </script>

  <span><slot name="#cart.items.length">0</slot></span>
</custom-element>
```

- A store is reactive, like `useState`.
- `persist` can be `"local"`, `"session"` or a custom adapter, and values keep their types.
- Nothing is attached to `window`.

## 15. Forms and accessibility

### How v1 does it

There is no support.

### Proposal

- **Form components.** `form-associated` on the `<custom-element>` makes it behave like a built-in field. `internals` sets its value and validity.

  ```html
  <custom-element name="r-switch" form-associated role="switch">
    <script>
      const props = defineProps({ checked: prop.boolean().reflect() });

      observe(() => internals.setFormValue(props.checked ? "on" : null));

      function toggle() {
        host.toggleAttribute("checked");
      }
    </script>

    <button _aria-checked="@checked" onclick="toggle()"><slot></slot></button>
  </custom-element>

  <form action="/settings" method="post">
    <r-switch name="notifications">Notifications</r-switch>
  </form>
  ```

  Form components take part in submission, `FormData`, reset, `disabled`, validation, and back/forward restore.
- **Accessibility.** `role` on the definition sets a default role for every instance, and focus can be delegated to an inner element. Every future REALM UI component needs an accessibility scenario in its specification.
- **Styling hooks for consumers:**
  - `part="…"` exposes inner elements to outside CSS
  - component states are available as `:state(open)` and `:state(loading)`
  - CSS custom properties act as theme tokens
- **Component manifest.** REALM's tooling generates a standard `custom-elements.json` from component files. It covers props (with their types and rules from `defineProps`), events (found in `dispatchEvent` calls), slots, parts and CSS properties. The documentation, TypeScript types and editor autocompletion are built from it.

## 16. Security model

| Source | Treated as |
| --- | --- |
| Component definitions (inline, or loaded with `<import-element>`) | **Code**, like `<script src>`. Importing a component from another server means running that server's code |
| Markup attributes other than `on<event>` | **References only.** No expressions are evaluated |
| Markup inserted later (`html` slots, `render`, request responses) | **Data.** Sanitised, and never scanned for handlers or references |
| Value slots | Text, unless `html` is set |

**Content Security Policy:**
- **No policy, or a nonce-based policy:** works out of the box. REALM copies the page's nonce onto the module scripts it inserts, and `'strict-dynamic'` needs no extra setup.
- **Hash-only policies:** these can't allow scripts assembled at runtime. Use the Vite plugin, which pre-assembles components at build time ([section 20](#20-repository-and-toolchain)).

REALM never uses `eval`, `new Function` or `blob:` URLs.

## 17. Runtime internals

This section is for contributors.

- **Reactivity.**
  - `useState`, `defineProps` and stores are built on a Proxy backed by signals.
  - Changes are batched and applied once per microtask.
  - Getters are cached until their inputs change.
  - `observe` tracks what it reads.
- **One analysis per component type.** The first use of a component collects its markup and records where each slot, binding, handler and fetch attribute sits. Later instances clone the markup and connect only those positions. The contents of `<is-visible>`, `<is-hidden>` and `<repeat-list>` are set aside at this point, so they stay inert without a `<template>`.
- **Reference resolution.** Each reference is resolved once per instance: the owning component first, then the parent chain. The result is cached, and re-resolved only when an element moves.
- **Lifecycle that follows browser rules.**
  - The constructor does almost nothing.
  - Setup runs when the element is added to the page.
  - Each time it's added, the element gets a fresh `signal`. Removing it aborts the signal, which stops every listener, observer, timer and request together.
  - Moving an element restarts it cleanly.
- **Styles.** One constructable stylesheet per component type, shared by all instances. `:state()` replaces v1's regex-based CSS rewriting and browser detection.
- **Internal module format.** The assembled module and the Vite plugin's output share an internal format. It isn't a public API, and users always define components with `<custom-element>`.

## 18. Unicons

### How it works today

Each of the 44,131 icons is a complete component in its own file, with its own copy of the same styles. To show an icon set, the website writes `<import-element>` tags into state in batches of seven, then clears that state while many requests are still running.

### Problems

Together with bugs A1–A6, this causes:
- duplicate requests
- "already defined" errors
- the browser refusing requests on large sets

### Proposal

1. **One icon component.** `<u-icon set="lu" name="zap" size="24">` renders any icon. Each set is one data file (JSON or an SVG sprite), loaded once with `fetch` attributes and cached.
2. **Copy-paste still works.** The build also produces one bundle per set, and single-icon files are kept for existing users.
3. **Only visible icons render** on the website grid.
4. **Configurable colours.** `fill` and `stroke` can be set through props and CSS variables (open issue realmui/unicons#2). The default stays `currentColor`.
5. **Tests.** Playwright tests cover:
   - loading a full set with no console errors
   - switching sets quickly
   - copying a snippet
   - working offline from cache

## 19. Website and documentation

### Today

- An Astro 2 site.
- Examples are embedded from CodeSandbox, which is slow, external and untested.
- The blog is a separate app.

### Proposal

- **Built with REALM.** Astro 5 is kept only for page generation, Markdown, sitemap and search (Pagefind). Every visible piece is a REALM component: navigation, theme switcher, code tabs, copy buttons, the docs sidebar and the live playground.
- **Our own playground.** A `<realm-playground>` component (editor plus live preview) replaces CodeSandbox. It works offline, and every example on the site is run by the test suite.
- **Documentation in four parts:**

| Part | Purpose | Contents |
| --- | --- | --- |
| Tutorial | Learn by doing | Build the todo app step by step |
| Guides | Solve a task | Props, state, fetching, nested components, forms, styling, shared state, migrating from v1, using REALM inside other frameworks |
| Reference | Look something up | Every helper, tag, attribute and event, generated from the specifications and the manifest |
| Explanation | Understand why | How components are assembled without a compiler, how references resolve, the security model |

- **The blog** moves to `/blog`, starting with a v2 announcement.
- **Quality bar:**
  - every page loads with no console errors
  - no serious accessibility violations
  - every example runs
  - Lighthouse 95 or more on the home and docs pages

---

# Part III: Delivery

## 20. Repository and toolchain

### Layout

```
openspec/                 Specifications: the source of truth for behaviour
packages/
  realm/                  @realmorg/realm, the runtime
    src/
      assemble/           reads <custom-element> and assembles its module
      props/              defineProps and the prop builder
      reactivity/         useState, observe, defineStore, batching
      references/         # and @ resolution through owners and parents
      slots/              value slots
      bindings/           _ attribute bindings, refs, on<event>
      control-flow/       <is-visible>, <is-hidden>, <repeat-list>, repeat attribute
      fetch/              fetch attributes, render, request sharing
      define/             custom element registration and lifecycle
      loader/             <import-element>
      forms/              form-associated components
    test/
  vite-plugin-realm/      optional: pre-assembles component files at build time
  tsconfig/               shared TypeScript settings
apps/
  site/                   website, docs and blog
  examples/               example apps, each with its own end-to-end tests
e2e/                      shared Playwright setup
```

### Tools

| Purpose | Tool |
| --- | --- |
| Build | **Latest Vite** in library mode. Produces an ES module build, a single-file CDN build and type definitions |
| Optional user build step | `vite-plugin-realm`, for strict security policies and faster start-up |
| Language | TypeScript in strict mode |
| Workspace | pnpm and Turborepo |
| Unit and component tests | Vitest 5, in Node and in real browsers (Chromium, Firefox, WebKit) |
| End-to-end tests | Playwright |
| Linting and formatting | ESLint and Prettier (or Biome, decided in Phase 1) |
| Releases | Changesets |
| Package checks | `size-limit`, `publint`, `@arethetypeswrong/cli` |

Node 22 or newer is required. Exact versions are pinned at the start of Phase 1.

### Code rules

- Write comments only where the code can't explain itself (a browser quirk, a performance trick).
- Use clear names. The minifier shortens them.
- Nothing runs at import time except in the CDN build.
- Nothing is attached to `window`.
- Every listener, timer, observer and request is tied to its element's signal.

These rules go into `openspec/project.md` and `AGENTS.md`.

## 21. Specification workflow

Behaviour is written down in OpenSpec before it's built. Code follows the specification, and tests follow its scenarios.

```
openspec/
  project.md            conventions, code rules, budgets
  specs/                what REALM does today, one folder per area:
                        component-anatomy, assembly, props, state,
                        value-slots, bindings, scope, control-flow,
                        events, data-fetching, imports, shared-state,
                        forms-a11y, security, tooling
  changes/              proposed changes, one folder each
    v2-foundation/      proposal.md, design.md, tasks.md, spec changes
    …
  changes/archive/      finished changes
```

How a change moves:
1. **Propose.** Write `proposal.md`, `tasks.md` and the spec changes. Add `design.md` whenever new syntax is introduced, recording the alternatives considered.
2. **Review.** The owner approves before work starts.
3. **Build.** Each scenario gets at least one test, and the test's title names the scenario. CI checks this.
4. **Archive.** When merged, the change is archived, so `specs/` always describes what REALM does.

Specs use OpenSpec's format: requirements with "SHALL", and scenarios written as Given / When / Then. The website's reference pages are generated from the specs.

## 22. Testing strategy

### Test layers

| Layer | Runs in | When | What it covers |
| --- | --- | --- | --- |
| Unit | Node | Every push | Assembly, prop builder and validation, reactivity, storage |
| Component | Chromium, Firefox, WebKit | Every push | Real components: lifecycle, slots, bindings, handlers, forms, styles |
| Scope | Chromium, Firefox, WebKit | Every push | Owner-first and parent lookup, slotted content in nested components, shadowing, moving elements between parents |
| Parser hazards | Chromium, Firefox, WebKit | Every push | Tables and selects, inline definitions with `type="realm"` |
| Regression | Real browsers | Every push | One test per bug in Appendix A, written before the fix |
| Security | Real browsers | Every push | Nonce and `'strict-dynamic'` pages, a hash-only page with the Vite plugin, sanitising, inserted HTML never scanned |
| End-to-end | Playwright | Pull requests and `main` | Example apps, website, Unicons, accessibility checks, a mock server for requests |
| Performance | Playwright | `main` and nightly | Create 1,000 rows, update every tenth, swap, clear. Fails on a regression of more than 10% |
| Memory | Chromium | Nightly | Add and remove a component 1,000 times. Nothing may remain |
| Size | `scripts/check-size.mjs` | Every push | Runtime at most 16 KB gzip |

Line and branch coverage of the runtime must stay at or above 90%.

### Learning from other frameworks' test suites

We read their test suites, rewrite the relevant cases against REALM, and credit the source in each test file.

| Source | What we check | Why |
| --- | --- | --- |
| Vue reactivity tests | Batching, cached getters, nested observers, clean-up, array mutation tracking, infinite-loop protection | `useState`, `observe` |
| zod test suite (behaviour only) | Coercion, defaults, optional and required, nested shapes, error reporting | `defineProps` |
| Svelte runtime tests (behaviour only) | Keyed list updates, lifecycle order, slotted content scope | `<repeat-list>`, setup, scope |
| Vue and Inferno list tests | Inserting, removing, reversing and shuffling keyed items | `<repeat-list>` |
| React input tests | Cursor position, IME typing, multi-select, checkbox states | `_value`, `_checked` |
| React attribute tests | Boolean attributes, removal on `false`/`null`, SVG, `aria-*` | `_` bindings |
| React event tests | Event order, crossing shadow roots, removing during dispatch | `on<event>` |
| Web Platform Tests, slots and event handlers | Fallback content, nested slot projection, handler attribute/property sync, `return false` | Value slots, custom event handlers |
| React and Vue escaping tests | Text vs HTML, `javascript:` links | Security |
| custom-elements-everywhere.com | Working with plain DOM and with third-party components | Interoperability |
| Web Platform Tests, custom elements | Constructor rules, upgrade order, moving between documents | Lifecycle |
| htmx test suite | Triggers, debounce, cancellation, partial rendering, form serialisation | `fetch` attributes |
| TanStack Query / SWR behaviour | Shared requests, out-of-order responses, cancellation | `fetch` attributes |

## 23. Roadmap

| Phase | Name | Delivers | Done when |
| --- | --- | --- | --- |
| 0 | Archive v1 | Tagged and downloadable v1 source | Release asset is published |
| 1 | Foundation | Toolchain, CI, specifications, regression tests, five spikes | CI green, specs approved, spikes answered |
| 2 | Core runtime | Assembly, `defineProps`, `useState`, `observe`, value slots, `_` bindings, scope, control flow, styles, lifecycle | Reactivity, prop, list, input and scope tests pass; size budget met |
| 3 | Events | Script-scoped handlers, custom event handler attributes, debounce/throttle | Event and interoperability tests pass |
| 4 | Data fetching | `fetch` attributes, `into`, `render`, `busy`, load events, then links | Race-condition and rendering tests pass |
| 5 | Imports and shared state | New `<import-element>`, bundles, `defineStore` | 500 imports of 50 files make exactly 50 requests and no errors |
| 6 | Forms and hardening | Form components, accessibility, manifest, Vite plugin, performance, memory, security | Budgets met; all security pages pass |
| 7 | Website and docs | New site built with REALM | Deployed to `realmui.github.io` |
| 8 | Unicons v2 | New icon component and site | Full-set load with no errors |
| 9 | Release | Beta, release candidate, 2.0 | Migration guide complete |

### Phase 0: Archive v1

```bash
git tag -a v1-final -m "REALM v1 final (npm 0.0.19)" b6042d1
git archive --format=tar.gz --prefix=realm-v1/ -o ../realm-v1-final.tar.gz v1-final
git push origin v1-final
gh release create v1-final ../realm-v1-final.tar.gz \
  --title "REALM v1 (archived)" --notes "Last v1 source. npm @realmorg/realm@0.0.19."
```

Do the same for Unicons (`unicons-v1-final`, now at `github.com/realmui/unicons`). Before pushing, update the git remote: it still points to the `realmorg` organisation, which no longer exists on GitHub. All later work happens on `main`.

### Phase 1: Foundation and spikes

- Remove the old build, tests and Astro library setup. Set up the toolchain and CI.
- Initialise OpenSpec and write all specifications. Review the syntax in sections 4 to 12 with the owner.
- Write regression tests for every bug in Appendix A, marked as expected failures.
- Answer five technical questions with small prototypes, each tested in Chromium, Firefox and WebKit:

| Spike | Question | If the answer is no | Result |
| --- | --- | --- | --- |
| S1 | Can the bootstrap reliably stop a plain `<script>` inside an inline `<custom-element>` from running in the page scope? | Inline definitions use `<script type="realm">`. Files are unaffected | **No** (Firefox and WebKit). `type="realm"` adopted; bootstrap dropped |
| S2 | Do assembled module scripts run under nonce and `'strict-dynamic'` policies? | Document the Vite plugin as the only strict-policy path | **Yes.** Assembled scripts carry the page nonce |
| S3 | Can relative `import` paths in a component file be resolved by rewriting only the leading import statements? | Require absolute paths or an import map | **Yes** |
| S4 | Does writing values into slot fallback content render correctly through nested slot projection in all three engines? | Render value slots as text nodes beside an empty marker slot | **Yes.** SVG is the exception and uses text nodes |
| S5 | Is Proxy-based reactivity fast enough for the 1,000-row benchmark? | Use explicit signals internally behind the same `useState` API | **Yes**, within the `perf` budgets |

### Phases 2 to 6: The runtime

Each phase implements the matching sections of Part II, in this order:
- core (sections 4–10 and 17)
- events (11)
- fetching (12)
- imports and shared state (13–14)
- forms, security and the Vite plugin (15–16)

A phase is complete when its tests, ported suites and regression tests pass in CI.

### Phases 7 to 9: Real use and release

The website, Unicons and example apps are rebuilt on the beta. Anything they reveal is fixed before the release candidate. The migration guide ships with 2.0. An automatic v1-to-v2 converter is a stretch goal.

## 24. Risks

| Risk | Mitigation |
| --- | --- |
| Inline `<script>` can't be held back reliably (S1) | Happened. `<script type="realm">` for inline definitions only |
| Parent lookup makes it unclear where a value comes from | Owner always wins, every parent lookup is reported once during development, and explicit `_` props stay the recommended contract for reusable components |
| Users expect plain `let` variables to update the page | Say so on the first docs page, and show `useState` in every example |
| References-only bindings feel limiting | Getters cover comparisons and formatting. v1's comparison attributes cover simple conditions |
| Hash-only security policies | The Vite plugin pre-assembles components |
| Fetch attributes grow into a large language | Phase 4 ships the attributes in section 12 only. Anything more needs its own proposal |
| The rewrite drifts from real needs | The website, Unicons and example apps must run on v2 before the release candidate |

## 25. After 2.0

1. **REALM UI.** A component library in the spirit of shadcn/ui: you copy each component's file into your project (`realm add button`) and own it.
   - Built on CSS variables for theming.
   - First set: Button, Input, Label, Checkbox, Switch, Select, Dialog, Popover, Tooltip, Tabs, Accordion, Toast, Card, Table and Command.
   - Every component works in forms where it applies, has an accessibility specification, and is documented from the manifest.
2. **Example apps:**
   - a todo list (shared state)
   - a CRUD app (forms and `fetch` attributes)
   - a weather app (`trigger="load"`, `poll`)
   - a chat (streaming)
   - a dashboard (REALM UI)
3. **Tooling:**
   - editor support for component files (autocompletion of references and props from the manifest)
   - server-side rendering with Declarative Shadow DOM

## 26. Decisions needed

All seven are decided. The last column records the decision.

| # | Question | Options | Decision |
| --- | --- | --- | --- |
| 1 | Helper names ([section 7](#7-state-and-observers)) | `useState` / `observe` / `onConnected`, or an all-`define` family (`defineState`, `defineObserver`) | `useState`, `observe`, `onConnected`/`onDisconnected` |
| 2 | Name of the prop builder ([section 6](#6-props)) | `prop.string()`, or a short alias like `p.string()` | `prop.string()` |
| 3 | Parent lookup ([section 9](#9-nested-components-and-scope)) | Automatic for all names, or only for names marked as shared (for example `useState({…}, { shared: true })`) | Automatic, with development reporting |
| 4 | Emitting events ([section 11](#11-events)) | Native `dispatchEvent` only, or also a typed `defineEvents` declaration for docs and validation | `dispatch(type, detail)`, a thin wrapper over native `dispatchEvent` (no declaration) |
| 5 | Inline definitions ([section 5](#5-how-it-works-without-a-compiler)) | Plain `<script>` with the bootstrap, or `<script type="realm">` | `<script type="realm">` (S1 failed) |
| 6 | Website generator ([section 19](#19-website-and-documentation)) | Astro as a thin shell, or a REALM-only generator | REALM-only generator (`apps/site/scripts/build.mjs`), built in CI |
| 7 | Unicons single-icon files ([section 18](#18-unicons)) | Keep all 44,000, or only per-set bundles | Keep for one major version, then drop |

---

# Appendices

## Appendix A: Bug audit of v1

All paths are relative to `packages/realm/src/`. Every bug gets a regression test before its fix. Several disappear entirely with the new design, but the tests stay to prevent them from returning.

| # | Location | Problem | Effect |
| --- | --- | --- | --- |
| A1 | `elements/import-element.ts:18` | The cache lookup reads a single character of the cached HTML | The cache only works by accident |
| A2 | `elements/import-element.ts:16-35` | No sharing of requests in progress | The same file is fetched many times; large pages run out of connections |
| A3 | `import-element.ts` with `utils/element.ts:108` | Racing imports register the same component twice; the error is thrown inside a promise | `Uncaught (in promise) … already defined`, the Unicons error |
| A4 | `elements/import-element.ts:27` | An error object is created but never thrown or logged | Failed imports fail silently |
| A5 | `elements/import-element.ts:31` | Only the first component in a file is read | One request per component |
| A6 | `elements/import-element.ts` | An import removed during its request still changes the page | Unexpected registrations |
| A7 | `flows/listen-event.ts:32`, `flows/trigger-event.ts:65` | Removing a listener passes a new function, so nothing is removed | Actions run multiple times after list updates; memory grows |
| A8 | `actions/set-timer.ts:49` | Intervals are never cleared | Timers keep running after removal |
| A9 | `utils/element.ts:567` | `return` used instead of `continue` | Some attribute changes are ignored |
| A10 | `libs/RealmElement.class.ts` | The attribute observer is never disconnected | Duplicate callbacks after an element moves |
| A11 | `libs/RealmElement.class.ts:56-59` | Rendering happens in the constructor | Breaks browser rules; fails for elements created in JavaScript |
| A12 | `libs/RealmState.class.ts:63` | Stored values are never parsed | Numbers and arrays from storage come back as strings |
| A13 | `utils/json.ts` | The "safe" JSON parser throws on plain text | Bad input crashes the component |
| A14 | `actions/http-request.ts:158` | Operator precedence error in the error message | The fallback message is never shown |
| A15 | `actions/http-request.ts` | Requests can't be cancelled | Older responses overwrite newer ones |
| A16 | `actions/script-flow.ts:12` | Overwrites the global `window.event` | Side effects on other code |
| A17 | `actions/script-flow.ts:30` | Polls every animation frame forever if a script never registers | Constant CPU use |
| A18 | `utils/script.ts` | Inline scripts are run via `blob:` URLs | Blocked by Content Security Policies |
| A19 | `utils/dom.ts:39` | HTML is inserted without sanitising | XSS risk |
| A20 | `constants/regx.ts:5` | Detects Safari from the user-agent string | Fragile; fails in test environments |
| A21 | `elements/repeat-list.ts` | Lists are fully rebuilt on every change | Lost focus and input; slow on long lists |
| A22 | `elements/global-state.ts:22`, `utils/flow.ts:119` | Writes to `window.globalState` and another global | Two copies of REALM interfere with each other |

## Appendix B: v1 to v2 cheat sheet

| v1 | v2 |
| --- | --- |
| `<template>` around markup and styles | No wrapper. `<script>`, `<style>` and markup sit directly in `<custom-element>` |
| `<element-attr name="count" type="number">0</element-attr>` | `defineProps({ count: prop.number().default(0) })` |
| `<element-state name="items" type="array">[]</element-state>` | `const todo = useState({ items: [] })` |
| `<set-state name="items" mutate="push" …>` | `todo.items.push(item)` in a script function |
| `<set-attr name="x" …>` | `attrs.x = value` |
| `<set-timer every="1000">` | `observe(() => { const id = setInterval(…); return () => clearInterval(id); })` |
| `<slot name="#count"></slot>` | `<slot name="#counter.count"></slot>` (same idea, now native and leak-free) |
| `<slot name="@label"></slot>` | `<slot name="@label"></slot>` (unchanged) |
| `_href="#url"` | `_href="#link.url"` (unchanged idea) |
| `<is-visible value="#x" eq="1">` | `<is-visible when="#state.x" eq="1">` |
| `<repeat-list of="#items">` with `$.label`, `!.index` | `<repeat-list of="#todo.items" as="item" index="i" key="id">` with `#item.label`, `#i` |
| `<element-flow>` + `<trigger-event click="ref">` | `onclick="save()"` on the element |
| `debounce` on `<trigger-event>` | `debounce` on the element |
| `<listen-event mounted>` | `onConnected(() => …)` |
| `<listen-event on="name">` | `onname="handle(event)"` |
| `<send-event name="x">` | `dispatch("x", detail)` |
| `<script type="module/realm">` | The component's `<script>` |
| `<http-request>` + `<response-ok>` / `<response-fail>` | `fetch`, `into`, `render` and `busy` attributes, with `onload` / `onerror` |
| `<global-state>` | Parent state, or `defineStore` in a shared module |
| `<import-script>`, `<import-style>` | `import` in the script, `<link rel="stylesheet">` |
| `<web-app>` | Not needed |

## Appendix C: References studied

These projects were studied to understand common problems. Their test suites are used as checklists of real-world bugs.

| Reference | What we learned from it | What we don't adopt |
| --- | --- | --- |
| Svelte | Script, style and markup together in one component | Its compiler, `{}` markup expressions, reactive `let`, runes, `{#each}`/`{#if}` blocks, `bind:` |
| htmx (version 4) | Requests driven by attributes on the triggering element; cancelling stale requests; partial updates | The `hx-` attribute language and its inheritance rules |
| zod | A readable, chainable way to describe types, defaults and validation | Its full schema library; REALM's builder only covers props |
| React | The `useState` name, familiar to most developers | `useEffect` and dependency arrays, JSX, re-running components on every change |
| Shoelace / Web Awesome | How component libraries document and dispatch events; that HTML can't bind custom events | Prefixed event names, library-specific base classes |
| Vue, Inferno | Their test suites ([section 22](#22-testing-strategy)) | Their syntax |
| fixi.js, Datastar | How small a request layer can be; streaming patterns for later | Their attribute syntax |
| TanStack Query, SWR | Expected behaviour for shared and out-of-order requests | Their APIs |
| WHATWG HTML and Web Platform Tests | The native behaviour REALM aims to match | Nothing; this is the target |
| OpenSpec | The specification workflow ([section 21](#21-specification-workflow)) | Nothing; used as-is |
