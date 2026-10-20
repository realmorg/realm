---
title: Styling
description: Scoped shadow styles, :host and ::part, reactive CSS with --attr-* and --state-* variables and :state() selectors, design tokens, theming and dark mode.
group: Guides
order: 30
nav: Styling
---

# Styling

A component's `<style>` and `<link rel="stylesheet">` children become constructable stylesheets adopted by its shadow root. They apply inside the component only, and one stylesheet is shared by every instance of the component.

```html
<custom-element name="info-note">
  <style>
    :host {
      display: block;
      padding: calc(var(--spacing) * 4);
      border-radius: var(--radius-lg);
      background: var(--muted);
    }
    :host([hidden]) {
      display: none;
    }
    ::slotted(a) {
      font-weight: var(--font-weight-medium);
    }
  </style>

  <slot></slot>
</custom-element>
```

The usual shadow DOM tools apply:

| Selector | Styles |
| --- | --- |
| `:host` | The element itself. Give it a `display`. Custom elements are `inline` by default |
| `:host([attr])`, `:host(.class)` | The element when it has an attribute or class |
| `::slotted(selector)` | Top-level elements placed into a `<slot>` from outside |
| `::part(name)` (from outside) | Inner elements marked with `part="name"` |
| `:host(:state(name))` | The element when it has a custom state |

Inherited properties (`color`, `font-*`, CSS custom properties) still flow in from the page.

## Shadow DOM and utility CSS

Every component renders into a shadow root, and the page's stylesheets do not reach inside it. That is what stops a component's styles from leaking out and the page's styles from leaking in. It also means utility-class frameworks such as Tailwind CSS, UnoCSS or Bootstrap's utility classes do not work in a component's markup. Their classes live in the page's stylesheet, so this gets no padding and no font size:

```html
<custom-element name="info-note">
  <!-- p-4 and text-sm are defined in the page, not in this shadow root -->
  <div class="p-4 text-sm"><slot></slot></div>
</custom-element>
```

The Tailwind Play CDN script has the same limit: it writes its styles into the document `<head>` only.

What works instead:

- **Inside a component**, write CSS with the [design tokens](#design-tokens): `padding: calc(var(--spacing) * 4)`, `font-size: var(--text-sm)`.
- **In the page**, use any CSS you like, utility classes included. Content you pass into a component's `<slot>` stays in the page, so page classes style it.
- **Across the boundary**, inherited properties and custom properties do flow in. Tokens you set on `:root` reach every component.
- **For REALM UI components**, use their attributes, `::part()` and `:state()`, described in [Styling components from outside](#styling-components-from-outside).

A component can load a compiled utility stylesheet with `<link rel="stylesheet">`, but every component then carries the whole file and you need a build step to generate it. REALM does not recommend it.

## Reactive CSS

REALM reads the component's CSS for two patterns and keeps them in sync with props and state. Nothing needs to be declared in the script.

### Variables: --attr-* and --state-*

`var(--attr-name)` is the value of the prop or attribute `name`. `var(--state-todo-count)` is the value of `#todo.count`, with dots written as dashes. REALM sets these as custom properties on the host, so they work anywhere in the component's styles, including `calc()`:

```html live
<custom-element name="meter-bar">
  <script type="realm">
    const props = defineProps({ value: prop.number().min(0).max(100).default(40), hue: prop.number().default(150) });
    const meter = useState({
      get width() {
        return `${props.value}%`;
      },
    });

    function nudge(amount) {
      props.value = Math.min(100, Math.max(0, props.value + amount));
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      width: calc(var(--spacing) * 72);
    }
    .track {
      height: calc(var(--spacing) * 3);
      border-radius: var(--radius-full);
      background: var(--muted);
    }
    .fill {
      width: var(--state-meter-width);
      height: 100%;
      border-radius: inherit;
      background: oklch(0.65 0.15 var(--attr-hue));
      transition: width var(--default-transition-duration);
    }
    .actions {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
  </style>

  <div class="track"><div class="fill"></div></div>
  <div class="actions">
    <ui-button size="sm" variant="outline" onclick="nudge(-10)">-10</ui-button>
    <ui-button size="sm" variant="outline" onclick="nudge(10)">+10</ui-button>
  </div>
</custom-element>

<meter-bar></meter-bar>
<meter-bar value="75" hue="30"></meter-bar>
```

Objects, arrays, `null` and `undefined` remove the variable. For a variable on an inner element instead of the host, bind it: `<div _--width="#meter.width">`.

### States: :state(attr-…) and :state(state-…)

`:state(attr-open)` matches while the prop or attribute `open` is truthy. `:state(state-todo-isEmpty)` matches while `#todo.isEmpty` is truthy. Add a comparison to match a specific value:

| Selector | Matches when |
| --- | --- |
| `:state(attr-variant-is-outline)` | `variant` equals `"outline"` |
| `:state(state-cart-count-gt-0)` | `cart.count > 0` |
| `:state(state-cart-count-gte-10)` | `cart.count >= 10` |
| `:state(state-stock-left-lt-5)` | `stock.left < 5` |
| `:state(state-stock-left-lte-0)` | `stock.left <= 0` |

This is how REALM UI styles its variants without any script:

```css
:host(:state(attr-variant-is-destructive)) button {
  background: var(--destructive);
  color: var(--destructive-foreground);
}
:host(:state(attr-size-is-sm)) button {
  height: calc(var(--spacing) * 8);
}
```

```html live
<custom-element name="stock-label">
  <script type="realm">
    const props = defineProps({ left: prop.number().int().min(0).default(0) });
  </script>

  <style type="realm">
    :host {
      display: inline-flex;
      padding: calc(var(--spacing) * 1) calc(var(--spacing) * 3);
      border-radius: var(--radius-full);
      background: var(--secondary);
      font-size: var(--text-sm);
    }
    :host(:state(attr-left-lt-5)) {
      background: color-mix(in oklab, var(--chart-4) 30%, transparent);
    }
    :host(:state(attr-left-lte-0)) {
      background: color-mix(in oklab, var(--destructive) 10%, transparent);
      color: var(--destructive);
    }
  </style>

  <slot name="@left"></slot>&nbsp;left
</custom-element>

<stock-label left="12"></stock-label>
<stock-label left="3"></stock-label>
<stock-label left="0"></stock-label>
```

State names follow the reference path with dashes, so the names in a path should not themselves contain dashes. These states are custom states (`CustomStateSet`), so they are also visible from outside: `ui-button:state(attr-variant-is-outline)`.

### Your own states

Set states from the script with `internals.states`:

```js
observe(() => {
  if (menu.open) internals.states.add("open");
  else internals.states.delete("open");
});
```

REALM adds `:state(loading)` to a component's host while one of its [fetch attributes](/docs/fetching/) is running.

## Design tokens

REALM UI's `theme.css` defines the tokens its components use. Use them in your own components so they match REALM UI and follow theme changes:

| Group | Tokens |
| --- | --- |
| Colour | `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive` (each with a `-foreground` pair where it makes sense), `--border`, `--input`, `--ring`, `--chart-1` to `--chart-5`, `--sidebar*` |
| Spacing | `--spacing` (0.25rem). Write sizes as `calc(var(--spacing) * 4)` |
| Type | `--text-xs` to `--text-4xl`, `--font-weight-normal` to `--font-weight-bold`, `--leading-tight`, `--leading-normal`, `--tracking-tight`, `--font-sans`, `--font-mono` |
| Radius | `--radius`, `--radius-xs` to `--radius-2xl`, `--radius-full` |
| Shadow | `--shadow-xs` to `--shadow-lg`, `--focus-ring` |
| Motion | `--default-transition-duration`, `--default-transition-timing-function` |

Custom properties inherit through shadow roots, so a token set on `:root` reaches every component.

## Theming and dark mode

Override tokens on `:root`, or on any element to theme a subtree:

```css
:root {
  --radius: 0.375rem;
  --primary: oklch(0.55 0.2 260);
  --primary-foreground: oklch(0.98 0 0);
}

.marketing {
  --font-sans: "Inter", system-ui, sans-serif;
}
```

`theme.css` switches to dark colours when the system prefers a dark scheme, unless the page sets `data-theme="light"` on `<html>`. Setting `data-theme="dark"` forces dark mode. A theme toggle sets that attribute:

```js
document.documentElement.dataset.theme = "dark";
```

## Styling components from outside

Shadow styles are encapsulated, so page CSS cannot reach inside a component by accident. Components choose what to expose:

- `part="name"` on inner elements, styled from outside with `ui-dialog::part(dialog)`,
- CSS custom properties they read, such as tokens,
- custom states, styled with `ui-button:state(attr-variant-is-ghost)`.

Each REALM UI component page lists its parts and states.
