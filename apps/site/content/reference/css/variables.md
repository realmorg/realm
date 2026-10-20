---
title: "--attr-* and --state-*"
description: The reactive CSS custom properties --attr-name and --state-path that REALM sets on a component host from props, attributes and state.
group: CSS
order: 91
nav: --attr-* and --state-*
---

# `--attr-*` and `--state-*`

Write `var(--attr-…)` or `var(--state-…)` in a component's `<style>` and REALM keeps that custom property set on the host, from a prop, an attribute or state.

```css
:host {
  --size: var(--attr-size, 1);
  width: calc(var(--spacing) * 10 * var(--size));
}
.bar {
  width: calc(var(--state-upload-percent, 0) * 1%);
}
```

## Names

| Variable | Value |
| --- | --- |
| `var(--attr-name)` | The prop whose attribute is `name` (its current value, not the attribute text), or the host attribute `name` when no prop uses it |
| `var(--state-a-b-c)` | The reference `#a.b.c`. Dashes separate path segments |

Because dashes separate segments, script and state names used in `--state-*` cannot contain dashes. camelCase works: `var(--state-todo-doneCount)`. Attribute names in `--attr-*` can contain dashes: `var(--attr-max-items)`.

## Values

| Value | Set to |
| --- | --- |
| string, number, boolean | `String(value)` |
| `null`, `undefined`, object, array | `initial`, so `var(--attr-x, fallback)` uses the fallback |

## Behaviour

- REALM finds the variables by scanning the text of the component's `<style>` and `<link rel="stylesheet">` elements, so only names written there are set.
- They are set as inline custom properties on the host and update when the value changes.
- Each component sets its own variables on its own host, so `--attr-*` values do not leak into nested components that use the same names.
- To set a custom property on an inner element instead, bind it: `_--progress="#upload.percent"`. See [`_` bindings](/reference/attributes/bindings/).

## Example

```html live
<custom-element name="progress-pill">
  <script type="realm">
    const props = defineProps({ tone: prop.enum(["primary", "destructive"]).default("primary") });
    const upload = useState({ percent: 30 });
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      width: min(calc(var(--spacing) * 80), 100%);
    }
    .track {
      height: calc(var(--spacing) * 3);
      border-radius: var(--radius-full);
      background: var(--muted);
    }
    .fill {
      height: 100%;
      width: calc(var(--state-upload-percent, 0) * 1%);
      border-radius: inherit;
      background: var(--primary);
    }
    :host(:state(attr-tone-is-destructive)) .fill {
      background: var(--destructive);
    }
  </style>

  <div class="track"><div class="fill"></div></div>
  <input type="range" aria-label="Percent" min="0" max="100" _value="#upload.percent" oninput="upload.percent = Number(this.value)">
</custom-element>

<progress-pill></progress-pill>
<progress-pill tone="destructive"></progress-pill>
```

## Related

- [Styling: reactive CSS](/docs/styling/#reactive-css)
- [`:state()`](/reference/css/states/)
