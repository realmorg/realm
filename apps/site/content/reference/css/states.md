---
title: ":state()"
description: The reactive custom states REALM sets on a component host: :state(attr-…), :state(state-…), their comparisons, :state(loading) and your own states.
group: CSS
order: 92
nav: ":state()"
---

# `:state()`

Write `:state(attr-…)` or `:state(state-…)` in a component's `<style>` and REALM adds or removes that custom state on the host, through `internals.states`. Match it with `:host(:state(…))` inside the component, or `tag-name:state(…)` from the page.

```css
:host(:state(attr-variant-is-outline)) {
  border: 1px solid var(--border);
}
:host(:state(state-todo-remaining-gt-0)) .clear {
  display: none;
}
```

## States

| State | Present while |
| --- | --- |
| `attr-name` | The prop or attribute `name` is truthy |
| `attr-name-is-value` | It equals `value` (compared as text) |
| `attr-name-gt-n` | It is greater than `n` (as numbers) |
| `attr-name-gte-n` | Greater than or equal to `n` |
| `attr-name-lt-n` | Less than `n` |
| `attr-name-lte-n` | Less than or equal to `n` |
| `state-a-b` | The reference `#a.b` is truthy |
| `state-a-b-is-value`, `-gt-n`, `-gte-n`, `-lt-n`, `-lte-n` | The same comparisons on `#a.b` |
| `loading` | A fetch attribute request in the component is running |

`attr-…` reads the prop's value when a prop uses that attribute, otherwise the attribute text (an absent attribute is `null`, so it is falsy). As with [`--state-*`](/reference/css/variables/), dashes separate path segments in `state-…`, so use camelCase names.

REALM finds these states by scanning the text of the component's `<style>` and `<link rel="stylesheet">` elements. Only names written there are maintained.

## loading

`:state(loading)` is present while at least one request started by [fetch attributes](/reference/fetch/fetch/) in the component's markup is running. The fetch element itself also gets `aria-busy="true"`.

```css
:host(:state(loading)) .results {
  opacity: 0.5;
}
```

## Your own states

Add any other state from the script and match it the same way:

```js
internals.states.add("expanded");
internals.states.delete("expanded");
```

```css
:host(:state(expanded)) .details {
  display: block;
}
```

## Example

```html live
<custom-element name="level-badge">
  <script type="realm">
    const props = defineProps({ level: prop.number().int().min(0).max(10).default(0) });
  </script>

  <style type="realm">
    :host {
      display: inline-block;
      padding: calc(var(--spacing) * 1) calc(var(--spacing) * 3);
      border-radius: var(--radius-full);
      background: var(--muted);
      font-size: var(--text-sm);
    }
    :host(:state(attr-level-gte-5)) {
      background: var(--chart-4);
      color: var(--primary);
    }
    :host(:state(attr-level-gte-8)) {
      background: var(--destructive);
      color: var(--primary-foreground);
    }
  </style>

  Level <slot name="@level"></slot>
</custom-element>

<level-badge level="2"></level-badge>
<level-badge level="6"></level-badge>
<level-badge level="9"></level-badge>
```

## Related

- [Styling: states](/docs/styling/#states-state-attr-and-state-state)
- [`internals`](/reference/script/internals/)
