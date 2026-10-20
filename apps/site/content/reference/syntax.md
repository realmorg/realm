---
title: References and durations
description: The reference syntax (#name.path, @prop, !) and duration syntax shared by every REALM attribute, and how names are resolved.
group: Overview
order: 2
nav: References and durations
---

# References and durations

REALM attributes never hold expressions. They hold a **reference** to a value, or a **duration**.

## References

```text
#name.path.to.value
@prop.path
!#name.path
```

| Form | Reads |
| --- | --- |
| `#name` | A top-level name of the component script (`const`, `let`, `var`, `function`, `class` or an import), or a loop variable from `repeat` / `<repeat-list>` |
| `#name.a.b` | A property path on that value. Missing steps give `undefined` instead of throwing |
| `@prop` | A prop declared with [`defineProps`](/reference/script/define-props/). A path may follow: `@user.name` |
| `!#…`, `!@…` | The negation of the value. `!` is the only operator |

The first segment must be a valid JavaScript identifier. Later segments may contain letters, digits, `_`, `$` and `-`, so `#list.0.title` reads the first item.

### Where references are used

| Attribute | Reference |
| --- | --- |
| [`<slot name>`](/reference/elements/value-slots/) | `#…`, `@…`, `!…` |
| [`_name`](/reference/attributes/bindings/) | `#…`, `@…`, `!…` |
| [`<is-visible when>`, `<is-hidden when>`](/reference/elements/is-visible/) | `#…`, `@…`, `!…` |
| [`<repeat-list of>`, `repeat`](/reference/elements/repeat-list/) | `#…`, `@…` |
| [`trigger`](/reference/fetch/trigger/) | `#…`, `@…` among event names |
| [`params`](/reference/fetch/fetch/#params) | `name:#…` pairs |
| [`headers`](/reference/fetch/fetch/#headers) | `#…`, `@…` |
| [`into`](/reference/fetch/into/), [`busy`](/reference/fetch/busy-timeout/) | A **writable** `#name.path` with at least one property: `#todo.items`, not `#todo`, not `@prop`, not negated |

An attribute that needs a reference and gets something else logs `<tag> attribute="…" must be a reference like "#state.path" or "@prop".` and is ignored.

### Resolution order

A `#name` reference is looked up in this order:

1. Loop variables, innermost first.
2. The top-level names of the component whose markup contains the reference.
3. The top-level names of parent components, nearest first (through shadow roots). Each such lookup logs `<child> reads "name" from <parent>.` once, unless the child is a [compound part](/reference/elements/custom-element/#slot).

If nothing defines the name, REALM logs `"#name" is not defined in this component or its parents.` and the value is `undefined`. Handler code uses the same order and finally falls back to `globalThis`. See [Nested components and scope](/docs/scope/).

### Reactivity

A reference updates when the value it reads is reactive: state from [`useState`](/reference/script/use-state/), a [store](/reference/script/define-store/), a prop, a loop variable or a getter on reactive state. A plain top-level `const list = []` can be read, but changes to it are not seen.

## Durations

`debounce`, `throttle`, `poll` and `timeout` take a duration:

| Text | Milliseconds |
| --- | --- |
| `300`, `300ms` | 300 |
| `1.5s` | 1500 |
| `2m` | 120000 |

The pattern is a non-negative number followed by `ms` (default), `s` or `m`. Anything else logs `"…" is not a duration. Use values like "300ms", "2s" or "1m".` and counts as `0`.
