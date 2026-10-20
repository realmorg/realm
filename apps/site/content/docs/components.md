---
title: Component anatomy
description: How a custom-element definition is split into a script, styles and markup, how it is assembled without a compiler, and the rules that follow.
group: Core concepts
order: 10
nav: Component anatomy
---

# Component anatomy

A component is defined by one `<custom-element>` tag. Its `name` must contain a dash, like every custom element name. Inside it there are three kinds of children, in any order:

| Part | What it holds | Rules |
| --- | --- | --- |
| `<script>` | The component's logic in plain JavaScript | At most one. It runs once per element instance |
| `<style>` and `<link rel="stylesheet">` | The component's CSS | Adopted into the component's shadow root, so it only applies inside |
| Everything else | Markup | Value slots, `_` bindings, native event handlers, fetch attributes and the REALM tags |

There is no `<template>` wrapper and no JavaScript definition API.

```html
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

## Attributes on the definition

| Attribute | Effect |
| --- | --- |
| `name` | The tag name. Required, must contain a dash |
| `form-associated` | Makes the element a form field through `ElementInternals`. See [Forms](/docs/forms/) |
| `role` | Default ARIA role for every instance, set through `ElementInternals.role` |
| `delegates-focus` | Creates the shadow root with `delegatesFocus: true`, so focusing the host focuses the first focusable element inside |

## Where definitions live

**In their own file** (recommended). A file such as `user-badge.html` can hold one or many `<custom-element>` definitions and is loaded with `<import-element from="user-badge.html">`. The file is parsed off-page with `DOMParser`, so nothing in it runs or renders until REALM assembles it. Use a plain `<script>` and `<style>`, or `<script type="module">` when the script uses `import`.

**Inline in the page**, for prototypes and demos. Write the definition anywhere in the page and give its script and style `type="realm"`:

```html
<custom-element name="hello-there">
  <script type="realm">
    const hello = useState({ who: "there" });
  </script>
  <style type="realm">
    p { font-weight: var(--font-weight-semibold); }
  </style>
  <p>Hello, <slot name="#hello.who"></slot></p>
</custom-element>

<hello-there></hello-there>
```

The browser ignores scripts and styles with an unknown `type`, so the script does not run in the page scope and the style does not apply to the page. A plain `<script>` in an inline definition has already run as page JavaScript by the time REALM sees it, so REALM warns about it. REALM removes inline definitions from the page once it has read them, including ones added to the page later.

So `type="realm"` belongs only on definitions written in a page. The live demos on this site define their components in the page so the preview runs in place, but their source tabs show each definition the recommended way: in its own file with a plain `<script>` and `<style>`, loaded from `index.html` with `<import-element>`.

## How it works without a compiler

You never write this yourself, but it explains several rules.

1. **Read.** REALM separates the script, styles and markup, and collects every native event handler in the markup.
2. **Assemble.** It builds one script for the component type. Your script becomes the body of a setup function, unchanged, and each event handler from the markup is placed inside that same function. That is why `onclick="save()"` can call `save` directly.
3. **Run.** The script is inserted as a normal `<script>` element (a module script when your script has `import` statements). If the page has a script with a CSP `nonce`, REALM copies it. REALM never uses `eval`, `new Function` or `blob:` URLs.
4. **Define.** REALM registers a native custom element. Each time one connects, it creates a shadow root, adopts the shared stylesheets, runs setup for that instance, then clones the markup and connects every slot, binding and handler.

Rules that follow:

| Rule | Why |
| --- | --- |
| The script runs once per instance | It is the body of the setup function. Code shared between instances goes in a module you import |
| `import` statements go at the top of the script | They are moved above the wrapper. Relative paths resolve against the component file |
| Only `useState`, `defineProps` and store values update the page | A plain `let count = 0; count++` changes a variable that nothing can observe |
| Markup that arrives later is never scanned | HTML from requests or `html` slots is data. It is sanitised and never gets handlers or bindings. See [Security](/docs/security/) |
| Top-level names are what markup can reference | `#todo.items` reads the top-level `todo` from the script. Names declared inside functions or blocks are not visible to markup |

## Helpers available in the script

These names are in scope in every component script without importing anything:

| Helper | Purpose |
| --- | --- |
| `defineProps(schema)` | Declare typed attributes. See [Props](/docs/props/) |
| `prop` | The prop type builder used with `defineProps` |
| `useState(object)` | Reactive state. See [State and reactivity](/docs/state/) |
| `observe(fn)` | Run code now and again whenever what it read changes |
| `tick()` | Wait until pending updates are applied to the DOM |
| `defineStore(name, initial, options)` | App-wide state, optionally persisted. See [Stores](/docs/stores/) |
| `defineMethods(object)` | Add public methods and getters to the element |
| `dispatch(type, detail, options)` | Emit a bubbling, composed, cancelable `CustomEvent` from the host |
| `listen(type, handler, target)` | `addEventListener` that stops when the element is removed |
| `attrs` | Reactive read and write access to any host attribute |
| `useChildren(selector, attributes)` | A reactive list of the host's light DOM children that match a selector |
| `onConnected`, `onDisconnected` | Lifecycle hooks. See [Lifecycle](/docs/lifecycle/) |
| `onFormReset`, `onFormDisabled`, `onFormStateRestore` | Form lifecycle hooks |
| `lookup(name)` | Find a name in parent components, then globals |
| `host` | The element itself |
| `refs` | Elements marked with `ref="name"` in the markup |
| `signal` | An `AbortSignal` that aborts when the element is removed |
| `internals` | The element's `ElementInternals` |

Write scripts in this order: `defineProps`, then `useState`, then functions, then `defineMethods`, `listen`, lifecycle hooks and `observe` last. Keep them short: logic that several components need belongs in a shared module or a store.

The [API reference](/reference/script/) lists every signature.

## Errors

- A syntax error in a script is reported once and the component renders its markup without the script.
- An error thrown while the script runs is reported, and the markup still renders.
- Defining the same source twice does nothing. A different definition for a name that already exists keeps the first one and warns, naming both files. A name already registered by another library is left alone, with a warning.
- More than one `<script>` in a definition: only the first is used, with a warning.

REALM warnings start with `[realm]` in the console and are shown once each.
