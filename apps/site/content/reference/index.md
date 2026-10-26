---
title: API reference
description: Index of every REALM element, attribute, script helper, event, CSS hook and JavaScript export.
group: Overview
order: 1
nav: Overview
---

# API reference

Exact names, types and defaults for everything in REALM. New to REALM? Start with the [Docs](/docs/).

All examples load REALM from the CDN:

```html
<link rel="stylesheet" href="https://realm.js.org/dist/realm.css">
<script type="module" src="https://realm.js.org/dist/realm.js"></script>
```

## Elements

| Element | Purpose |
| --- | --- |
| [`<custom-element>`](/reference/elements/custom-element/) | Defines a component |
| [`<import-element>`](/reference/elements/import-element/) | Loads a file of component definitions |
| [`<repeat-list>`](/reference/elements/repeat-list/) | Repeats its content for each item of an array |
| [`<is-visible>`](/reference/elements/is-visible/) | Mounts its content while a condition is true |
| [`<is-hidden>`](/reference/elements/is-hidden/) | Mounts its content while a condition is false |
| [Value slots](/reference/elements/value-slots/) | `<slot name="#…">` and `<slot name="@…">` show a value |

## Attributes

| Attribute | Purpose |
| --- | --- |
| [`_name`](/reference/attributes/bindings/) | Binds an attribute, property or CSS variable to a reference |
| [`on…`](/reference/attributes/handlers/) | Event handlers in component markup and on plain pages |
| [`debounce`, `throttle`](/reference/attributes/debounce-throttle/) | Delay or rate-limit handlers and requests |
| [`ref`](/reference/attributes/ref/) | Names an element for `refs` and `render` |
| [`repeat`](/reference/attributes/repeat/) | Repeats one element per item |
| [`focusgroup`](/reference/attributes/focusgroup/) | Arrow-key focus navigation |
| [`fetch`, `method`, `params`, `headers`](/reference/fetch/fetch/) | Send a request from markup |
| [`trigger`, `poll`](/reference/fetch/trigger/) | When the request is sent |
| [`into`, `into-mode`, `into-key`](/reference/fetch/into/) | Write the response into state |
| [`render`, `render-mode`, `render-select`](/reference/fetch/render/) | Insert the response as HTML |
| [`busy`, `timeout`](/reference/fetch/busy-timeout/) | Track a request and set a time limit |

## Script

Names available in every component `<script>` without importing. See [Component script](/reference/script/) for how scripts run.

| Props and state | Element | Lifecycle |
| --- | --- | --- |
| [`defineProps`](/reference/script/define-props/) | [`host`](/reference/script/host/) | [`onConnected`](/reference/script/on-connected/) |
| [`prop`](/reference/script/prop/) | [`refs`](/reference/script/refs/) | [`onDisconnected`](/reference/script/on-disconnected/) |
| [`useState`](/reference/script/use-state/) | [`signal`](/reference/script/signal/) | [`onFormReset`](/reference/script/on-form-reset/) |
| [`observe`](/reference/script/observe/) | [`internals`](/reference/script/internals/) | [`onFormDisabled`](/reference/script/on-form-disabled/) |
| [`tick`](/reference/script/tick/) | [`attrs`](/reference/script/attrs/) | [`onFormStateRestore`](/reference/script/on-form-state-restore/) |
| [`defineStore`](/reference/script/define-store/) | [`useChildren`](/reference/script/use-children/) | |
| | [`defineMethods`](/reference/script/define-methods/) | |
| | [`dispatch`](/reference/script/dispatch/) | |
| | [`listen`](/reference/script/listen/) | |
| | [`lookup`](/reference/script/lookup/) | |
| | [Timers](/reference/script/timers/) | |

## Events, CSS and JavaScript

| Page | Covers |
| --- | --- |
| [Request events](/reference/events/request-events/) | `loadstart`, `load`, `error`, `abort`, `timeout`, `loadend` from fetch attributes |
| [Import events](/reference/events/import-events/) | `load` and `error` from `<import-element>` |
| [Component events](/reference/events/component-events/) | Events your components send, and `change` from delegated controls |
| [realm.css](/reference/css/realm-css/) | The page and shadow root stylesheet |
| [`--attr-*` and `--state-*`](/reference/css/variables/) | Reactive CSS custom properties |
| [`:state()`](/reference/css/states/) | Reactive custom states, including `:state(loading)` |
| [Design tokens](/reference/css/design-tokens/) | The REALM UI theme variables |
| [Entry points](/reference/javascript/entry-points/) | `realm.js`, `index.js`, `compiler.js` and what each exports |
| [`start`](/reference/javascript/start/), [`importDefinitions`](/reference/javascript/import-definitions/), [`defineComponent`](/reference/javascript/define-component/) | Start REALM and define components from JavaScript |
| [`flush`](/reference/javascript/flush/), [`toRaw`](/reference/javascript/to-raw/), [`untrack`](/reference/javascript/untrack/) | Reactivity utilities |
| [Compiler](/reference/javascript/compiler/) | `compileDefinition` and `tokenize` |
| [Vite plugin](/reference/tooling/vite-plugin/) | Assemble components at build time for a strict Content Security Policy |

[References and durations](/reference/syntax/) covers the value syntax all attributes share. [Console messages](/reference/console/) lists every warning REALM prints.
