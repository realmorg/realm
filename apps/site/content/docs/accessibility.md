---
title: Accessibility
description: Give components default roles, delegate focus, move focus with arrow keys using the focusgroup attribute, bind ARIA state, and label form fields.
group: Forms and accessibility
order: 41
nav: Accessibility
---

# Accessibility

REALM components are native elements with shadow roots, so the usual rules apply: use real `<button>`, `<a>`, `<input>` and `<dialog>` elements inside, keep a logical focus order, and expose state with ARIA. REALM adds a few tools that make this easier.

## Default roles

`role` on the definition gives every instance a default role through `ElementInternals`. Pages can still override it with a `role` attribute on the element.

```html
<custom-element name="status-pill" role="status">
  <slot></slot>
</custom-element>
```

Because the role lives in `ElementInternals`, it does not appear as an attribute. Some testing tools, including older versions of axe-core, do not read it.

## Delegating focus

`delegates-focus` on the definition creates the shadow root with `delegatesFocus: true`. Focusing the host, clicking it, or pointing a `<label>` at it moves focus to the first focusable element inside, and the host matches `:focus`:

```html
<custom-element name="search-box" delegates-focus>
  <input type="search" aria-label="Search">
</custom-element>
```

Every REALM UI control that wraps a native control delegates focus.

## Arrow-key navigation with focusgroup

Toolbars, menus, tab lists and radio groups move focus with the arrow keys instead of Tab. Add a `focusgroup` attribute to the container in a component's markup:

```html
<div role="toolbar" aria-label="Formatting" focusgroup="toolbar inline wrap">
  <button>Bold</button>
  <button>Italic</button>
  <button>Underline</button>
</div>
```

REALM implements the arrow-key behaviour of the [Open UI focusgroup proposal](https://open-ui.org/components/scoped-focusgroup.explainer/) in every browser, including those without native support:

| Token | Effect |
| --- | --- |
| `inline` | Only Left and Right arrows move focus (mirrored in right-to-left text) |
| `block` | Only Up and Down arrows move focus |
| neither | All four arrows move focus |
| `wrap` | Moving past the last item goes to the first, and the other way round |

Home and End move to the first and last item. Items are the focusable descendants (buttons, links with `href`, form controls, elements with `tabindex`, and custom elements that delegate focus), including content slotted in from outside. Disabled, `hidden`, `inert` and `aria-disabled="true"` items are skipped, and so is anything with `tabindex="-2"`. The first token describes the widget (`toolbar`, `menu`, `tablist`, `listbox`, …) and is there for readability.

```html live
<custom-element name="text-toolbar">
  <style type="realm">
    div {
      display: inline-flex;
      gap: calc(var(--spacing) * 1);
      padding: calc(var(--spacing) * 1);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
    }
  </style>

  <div role="toolbar" aria-label="Formatting" focusgroup="toolbar inline wrap">
    <ui-toggle aria-label="Bold"><b>B</b></ui-toggle>
    <ui-toggle aria-label="Italic"><i>I</i></ui-toggle>
    <ui-toggle aria-label="Underline"><u>U</u></ui-toggle>
  </div>
</custom-element>

<text-toolbar></text-toolbar>
```

Click the first button, then use the Left and Right arrows, Home and End.

The focusgroup moves focus. It does not manage `tabindex` for you; when a widget should be a single Tab stop, set `tabindex="-1"` on the items that are not current, as REALM UI's tabs and calendar do.

## ARIA state from data

Bind ARIA attributes like any other attribute. Booleans become `"true"` and `"false"`, which is what ARIA expects:

```html
<button _aria-expanded="#menu.open" aria-controls="menu" onclick="toggle()">Menu</button>
<li repeat="#list.items" as="item" key="id" role="option" _aria-selected="#item.selected">…</li>
<section _aria-busy="#feed.loading">…</section>
```

Elements with [fetch attributes](/docs/fetching/) get `aria-busy="true"` automatically while their request runs.

## Labelling form fields

For [form-associated](/docs/forms/) components that delegate to an inner control with `ref="control"`, a native `<label>` around the component, or one whose `for` points at it, names the inner control. Without a label, pass `aria-label` through to the control with a prop:

```js
defineProps({ label: prop.string().attribute("aria-label") });
```

```html
<input ref="control" _aria-label="@label">
```

## Content that appears and disappears

`<is-visible>` and `<is-hidden>` remove content from the DOM, so assistive technology does not see hidden content. When content changes in place and users should hear it, put it in a live region (`role="status"` or `aria-live="polite"`) that stays in the DOM.

## Checklist for your own components

- Use native interactive elements inside; never make a `<div>` clickable.
- Give icon-only buttons an accessible name.
- Show focus: style `:focus-visible` (REALM UI uses `box-shadow: var(--focus-ring)`).
- Respect `prefers-reduced-motion` for animations.
- Test with the keyboard only, and with a screen reader.

Each REALM UI component page lists its roles and keyboard support.
