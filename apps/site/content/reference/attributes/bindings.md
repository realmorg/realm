---
title: _ bindings
description: The _ prefix that binds an attribute, property or CSS custom property to a reference, and how each value type is applied.
group: Attributes
order: 20
nav: _ bindings
---

# `_` bindings

`_` followed by an attribute name binds that attribute to a [reference](/reference/syntax/). The binding is one-way: it follows the value whenever it changes. Used on any element in component markup.

```html
<element _name="#ref"></element>
<element _name="!#ref"></element>
<element _--custom-property="#ref"></element>
```

```html
<a _href="#link.url">Open</a>
<section _hidden="!#panel.open">…</section>
<button _disabled="@disabled">Save</button>
<input _value="#form.email">
<user-card _user="#session.user"></user-card>
<div _--progress="#upload.percent"></div>
```

The `_name` attribute itself is removed when the markup is processed. The value must be a reference. Anything else logs a warning and the binding is skipped.

## How values are applied

The first matching rule wins:

| Target | Value | Result |
| --- | --- | --- |
| `_--name` | `null`, `undefined`, `false` | `style.removeProperty("--name")` |
| `_--name` | anything else | `style.setProperty("--name", String(value))` |
| `value` on `<progress>` or `<meter>` | `null`, `undefined` | Attribute removed, so the element stays indeterminate |
| `value`, `checked`, `selected`, `indeterminate` on an element with that property | any | Sets the **property**. `value` gets `value ?? ""`. The others get `Boolean(value)` |
| Any attribute of a custom element (tag with a dash) | object or array | Sets the camelCase **property** (`_user-data` sets `userData`), so the object arrives intact |
| `aria-*`, `draggable`, `spellcheck`, `contenteditable` | `true`, `false` | Attribute set to `"true"` or `"false"` |
| Any attribute | `true` | Attribute set to `""` |
| Any attribute | `false`, `null`, `undefined` | Attribute removed |
| Any attribute | anything else | Attribute set to `String(value)` |

On SVG elements, the attribute name's case is restored for camelCase SVG attributes such as `viewBox`, `preserveAspectRatio`, `gradientTransform`, `stdDeviation` and `textLength`, so `_viewbox` and `_viewBox` both work.

## Changes come back through events

Bindings never write back to state. Update state from a handler:

```html
<input _value="#todo.draft" oninput="todo.draft = this.value">
```

## class

`_class` replaces the whole `class` attribute. To toggle one style, bind a data attribute and select it in CSS (`_data-active="#tab.active"`), or use a [reactive `:state()`](/reference/css/states/).

## Example

```html live
<custom-element name="volume-meter">
  <script type="realm">
    const level = useState({
      value: 40,
      get loud() {
        return this.value > 70;
      },
    });
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      width: min(calc(var(--spacing) * 80), 100%);
    }
    .bar {
      height: calc(var(--spacing) * 2);
      width: calc(var(--level) * 1%);
      border-radius: var(--radius-full);
      background: var(--primary);
    }
    .bar[data-loud] {
      background: var(--destructive);
    }
  </style>

  <input type="range" min="0" max="100" aria-label="Volume" _value="#level.value" oninput="level.value = Number(this.value)">
  <div class="bar" _--level="#level.value" _data-loud="#level.loud" _aria-label="#level.value" role="img"></div>
</custom-element>

<volume-meter></volume-meter>
```

## Related

- [Values and bindings](/docs/bindings/)
- [Value slots](/reference/elements/value-slots/)
