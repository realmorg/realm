---
title: Migrating from v1
description: Move REALM v1 components to v2, with a cheat sheet that maps each v1 tag to its v2 replacement.
group: Guides
order: 54
nav: Migrating from v1
---

# Migrating from v1

REALM v2 keeps v1's vocabulary where it worked (`<custom-element>`, `<slot name="#…">`, `@` and `#` references, `_` bindings, `<is-visible>`, `<repeat-list>`, `<import-element>`) and replaces the tag language for logic with a plain JavaScript `<script>`. Most migrations are mechanical.

Read [What's new in REALM v2](/blog/realm-v2/) for the reasons behind the changes.

## The same component in both versions

v1:

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

v2:

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

## Step by step

1. **Update the scripts.** Replace v1's `realm.production.min.js` and `realm.min.css` with v2's `realm.js` (a module script) and `realm.css`. See [Installation](/docs/installation/).
2. **Remove `<template>`.** Move its markup and `<style>` directly into `<custom-element>`.
3. **Turn `<element-attr>` into `defineProps`.** Each attribute becomes a prop with a type and default.
4. **Turn `<element-state>` into `useState`.** Group related states into one object. Update references from `#count` to `#counter.count`.
5. **Replace `<element-flow>`.** Each `<trigger-event>` becomes a native `on*` attribute on the element that had the `ref`, calling a function. Each `<set-state>` becomes an assignment in that function.
6. **Replace `<http-request>`** with fetch attributes (`fetch`, `into`, `render`, `busy`) and `onload`/`onerror`.
7. **Replace `<global-state>`** with parent state or `defineStore`.
8. **Mark inline definitions.** If you defined components directly in the page, give the script and style `type="realm"`.
9. **Check the console.** v2 warns about invalid references, props and duplicate definitions, naming the component.

## Cheat sheet

| v1 | v2 |
| --- | --- |
| `<template>` around markup and styles | No wrapper. `<script>`, `<style>` and markup sit directly in `<custom-element>` |
| `<element-attr name="count" type="number">0</element-attr>` | `defineProps({ count: prop.number().default(0) })` |
| `<element-state name="items" type="array">[]</element-state>` | `const todo = useState({ items: [] })` |
| `<set-state name="count" mutate="+" value="1">` | `counter.count++` in a function |
| `<set-state name="items" mutate="push" …>` | `todo.items.push(item)` |
| `<set-attr name="x" …>` | `attrs.x = value`, or a reflected prop |
| `<set-timer every="1000">` | `observe(() => { const id = setInterval(…); return () => clearInterval(id); })` |
| `<slot name="#count"></slot>` | `<slot name="#counter.count"></slot>`. Now a native slot that adds no element to the page |
| `<slot name="@label"></slot>` | Unchanged |
| `_href="#url"` | `_href="#link.url"`. References now include the state object |
| `<is-visible value="#x" eq="1">` | `<is-visible when="#state.x" eq="1">`. Hidden content is now removed, not hidden with CSS |
| `<repeat-list of="#items">` with `$.label` and `!.index` | `<repeat-list of="#todo.items" as="item" index="i" key="id">` with `#item.label` and `#i`. Inside lists and tables, use the `repeat` attribute |
| `<element-flow>` with `<trigger-event click="ref">` | `onclick="save()"` on the element |
| `debounce` on `<trigger-event>` | `debounce` on the element |
| `<listen-event mounted>` | `onConnected(() => …)` |
| `<listen-event on="name">` | `onname="handle(event)"` |
| `<listen-event statechanged="x">` | `observe(() => …)` or a getter |
| `<send-event name="x">` | `dispatch("x", detail)` or `host.dispatchEvent(new CustomEvent("x", …))` |
| `<script type="module/realm" use="localState, event">` | The component's `<script>` |
| `<http-request>` with `<response-ok>` and `<response-fail>` | `fetch`, `into`, `render` and `busy` attributes, with `onload` and `onerror` |
| `<global-state name="x" storage="localStorage">` | `defineStore("x", { … }, { persist: "local" })`. Values now keep their types |
| `<slot global name="#counter">` | `<slot name="#app.counter">` where `app` is a store imported into the component |
| `<import-script>`, `<import-style>` | `import` in the component script, `<link rel="stylesheet">` in the definition |
| `<web-app>` | Not needed |
| CSS `var(--attr-x)` | Unchanged |
| CSS `var(--state-x)` | `var(--state-theme-color)`, the reference path `#theme.color` with dashes |
| CSS `var(--global-x)` | Read the store in a getter and use `var(--state-…)` |
| CSS `:host([\@number][gt="5"])` | `:host(:state(attr-number-gt-5))` |
| CSS `:host([\#counter][eq="5"])` | `:host(:state(state-counter-count-is-5))` |

## Behaviour changes to watch for

- **Hidden content stops.** v1's `<is-visible>` hid content with CSS, so it kept running. v2 removes it, with its listeners and requests. Use `_hidden` when content must stay in the DOM.
- **Lists keep their rows.** v1 rebuilt lists on every change, which lost focus and typed text and stacked duplicate listeners. With `key`, v2 reuses and moves rows.
- **Stored values keep their types.** v1 returned numbers from storage as strings. Code that converted them back can drop the conversion.
- **Imports are shared.** v1 fetched a file once per `<import-element>` and could throw "already defined". v2 fetches each URL once and defines every component in the file, not only the first.
- **Requests cancel stale ones.** A slower, older response can no longer overwrite a newer one.
- **No globals.** v1 wrote `window.globalState`. v2 attaches nothing to `window`.
- **Inline scripts are not run through `blob:` URLs**, so v2 works under a nonce-based Content Security Policy.
- **Elements are set up on connect**, not in the constructor, so components created with `document.createElement` work.

## Getting help

If something from v1 has no equivalent here, open an issue on [GitHub](https://github.com/realmorg/realm/issues) with the v1 markup.
