---
title: Console messages
description: Every warning and error REALM writes to the console, what causes it and what to do.
group: Overview
order: 3
nav: Console messages
---

# Console messages

REALM writes to the console with the prefix `[realm]`. Warnings use `console.warn` and each distinct message is shown once per page. Errors thrown by your code use `console.error`.

## Definitions

| Message | Cause |
| --- | --- |
| `<custom-element name="x"> needs a name that contains a dash, like "todo-app".` | The `name` has no dash. Nothing is defined |
| `<x-a> is defined twice with different sources (a.html and b.html). Keeping the first.` | Two different definitions use the same name. An identical second definition is ignored silently |
| `<x-a> is already defined by another library.` | `customElements` already has that name |
| `<x-a> has more than one <script>. Only the first is used.` | Extra direct `<script>` children |
| `<x-a> is defined in the page, so its <script> needs type="realm". A plain <script> already ran in the page scope.` | An inline definition uses a plain `<script>` |
| `<x-a> has an error in its <script>. The component renders without it.` | The script has a syntax error, or one of its imports failed |
| `<x-a> could not load its script URL: message` | `<script src>` failed to load |
| `Could not load stylesheet URL: message` | A `<link rel="stylesheet">` in a definition failed |

## Imports

| Message | Cause |
| --- | --- |
| `<import-element> needs a from attribute.` | `from` is missing |
| `<import-element from="…" loading="lazy"> needs a for attribute listing the tags it defines.` | Lazy import without `for`. It loads immediately |
| `Could not import URL (HTTP 404)` | The file failed. `(HTTP …)` is left out for network errors |

## Props

| Message | Cause |
| --- | --- |
| `<x-a> prop "amount" must be at least 0. Using the default.` | An attribute or property value failed a [`prop`](/reference/script/prop/) rule. The text after the prop name describes the rule |
| `<x-a> "name" is not a declared prop.` | Writing a key that `defineProps` did not declare |
| `<x-a> called defineProps more than once.` | Thrown as an error from the script |

## References and markup

| Message | Cause |
| --- | --- |
| `<x-a> attribute="…" must be a reference like "#state.path" or "@prop".` | A reference attribute holds something else |
| `<x-a> "#todo.itmes" is not defined in this component or its parents.` | The first name of a reference is unknown |
| `<x-a> reads "session" from <app-shell>.` | A reference or handler name was found in a parent component. Pass it as a prop to make the dependency explicit |
| `<x-a> repeat has a duplicate key "3".` | Two items share a `key` value. The duplicate gets its own row |
| `"…" is not a duration. Use values like "300ms", "2s" or "1m".` | A bad `debounce`, `throttle`, `poll` or `timeout` |

## Fetch attributes

| Message | Cause |
| --- | --- |
| `<x-a> render-mode="…" is not supported.` | Unknown `render-mode`. `replace` is used |
| `<x-a> render="…" does not match any ref.` | No element has that `ref` |
| `<x-a> "#todo" can't be written. Use a state property like "#todo.items".` | `into` or `busy` is a prop, a negation, or a bare name |
| `<x-a> "#a.b" can't be written because its parent is not an object.` | `#a` is not an object when the response arrives |

## Stores and reactivity

| Message | Cause |
| --- | --- |
| `Stored value for store "cart" is not valid JSON and was ignored.` | Corrupt persisted data. The initial values are kept |
| `Update loop detected: an observer keeps changing state it depends on.` | An error: observers re-ran 100 times in one flush. The queue is cleared |

Errors thrown inside a component script, an observer or a getter are reported with `console.error` and do not stop other components or observers.
