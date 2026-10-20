---
title: CSS
description: Reference for realm.css and the reactive CSS hooks REALM provides inside components, including --attr-* and --state-* variables, :state() selectors with comparisons, and :state(loading).
group: Reference
order: 5
nav: CSS
---

# CSS

## realm.css

```css
custom-element,
import-element {
  display: none;
}

is-visible,
is-hidden,
repeat-list {
  display: contents;
}

:not(:defined) {
  visibility: hidden;
}
```

`start()` also adopts the first two rules into the page, and every component's shadow root gets the `display: contents` rule.

## Reactive variables

Written in a component's `<style>`; REALM finds them by scanning the stylesheet text and sets them as inline custom properties on the host.

| Variable | Value |
| --- | --- |
| `var(--attr-name)` | The prop whose attribute is `name`, or else the host attribute `name` |
| `var(--state-a-b-c)` | The reference `#a.b.c` |

`null`, `undefined`, objects and arrays remove the property. Use `_--name="#ref"` to set a custom property on an inner element instead.

## Reactive states

Matched with `:host(:state(…))` inside the component, or `tag:state(…)` outside.

| State | Present when |
| --- | --- |
| `:state(attr-name)` | the prop or attribute `name` is truthy |
| `:state(attr-name-is-value)` | it equals `value` (as text) |
| `:state(attr-name-gt-n)`, `-gte-`, `-lt-`, `-lte-` | numeric comparison with `n` |
| `:state(state-a-b)` | `#a.b` is truthy |
| `:state(state-a-b-is-value)` | `#a.b` equals `value` |
| `:state(state-a-b-gt-n)`, `-gte-`, `-lt-`, `-lte-` | numeric comparison |
| `:state(loading)` | a fetch attribute request in the component is running |

Path segments are separated by dashes, so state and prop names used here must not contain dashes themselves (camelCase works: `state-todo-isEmpty`).

Set any other custom state from the script with `internals.states.add("name")` and match it with `:state(name)`.

## REALM UI tokens

The `@realmorg/ui` theme defines colour, spacing, type, radius, shadow and motion tokens as custom properties on `:root`, with a dark set applied by `data-theme="dark"` or the system preference. See [Styling](/docs/styling/#design-tokens).
