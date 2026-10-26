# Styling

A component's `<style>` and `<link rel="stylesheet">` children become constructable stylesheets adopted by its shadow root. They apply inside the component only and are shared by every instance.

```html
<custom-element name="info-note">
  <style>
    :host {
      display: block;
      padding: calc(var(--spacing) * 4);
      border-radius: var(--radius-lg);
      background: var(--muted);
      color: var(--muted-foreground);
      font-size: var(--text-sm);
    }
    ::slotted(a) {
      font-weight: var(--font-weight-medium);
    }
  </style>

  <slot></slot>
</custom-element>
```

| Selector | Styles |
| --- | --- |
| `:host` | The element. Give it a `display`: custom elements are `inline` by default |
| `:host([attr])`, `:host(.class)` | The element with that attribute or class |
| `:host(:state(name))` | The element with that custom state |
| `::slotted(selector)` | Top-level elements placed into a `<slot>` from outside |
| `::part(name)` (from outside) | Inner elements marked `part="name"` |

Inherited properties (`color`, `font-*`, custom properties) flow in from the page. Page CSS cannot reach inside a component. The `hidden` attribute always hides a component.

## Reactive CSS

REALM reads the component's CSS for two patterns and keeps them in sync with props and state. Nothing is declared in the script. Only names written in the component's own `<style>` or linked stylesheet are maintained.

### `var(--attr-*)` and `var(--state-*)`

| Variable | Value |
| --- | --- |
| `var(--attr-name)` | The prop whose attribute is `name` (its typed value), or the plain host attribute `name` |
| `var(--state-todo-count)` | The reference `#todo.count`. Dashes separate path segments |

REALM sets these as custom properties on the host, so they work anywhere in the styles, including `calc()`. Objects, arrays, `null` and `undefined` set `initial`, so a fallback applies: `var(--attr-size, 1)`.

```css
.fill {
  width: calc(var(--state-upload-percent, 0) * 1%);
  background: oklch(0.65 0.15 var(--attr-hue));
}
```

Because dashes separate segments, script names and state keys used in `--state-*` must not contain dashes. Use camelCase: `var(--state-todo-doneCount)`. Attribute names in `--attr-*` can contain dashes: `var(--attr-max-items)`.

For a variable on an inner element instead of the host, bind it: `<div _--width="#meter.width">`.

### `:state(attr-…)` and `:state(state-…)`

| State | Present while |
| --- | --- |
| `attr-name` | The prop or attribute `name` is truthy (an absent attribute is `null`) |
| `attr-name-is-value` | It equals `value` (as text) |
| `attr-name-gt-n`, `-gte-n`, `-lt-n`, `-lte-n` | Numeric comparison |
| `state-a-b` | `#a.b` is truthy |
| `state-a-b-is-value`, `-gt-n`, `-gte-n`, `-lt-n`, `-lte-n` | The same comparisons on `#a.b` |
| `loading` | A fetch attribute request in the component is running |

Variants without script, the way REALM UI does it:

```css
:host(:state(attr-variant-is-destructive)) button {
  background: var(--destructive);
  color: var(--primary-foreground);
}
:host(:state(attr-size-is-sm)) button {
  height: calc(var(--spacing) * 8);
}
:host(:state(state-cart-count-gt-0)) .badge {
  display: inline-flex;
}
```

These are real custom states (`CustomStateSet`), so the page can match them too: `ui-button:state(attr-variant-is-outline)`.

```html runnable
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
      background: color-mix(in oklab, var(--destructive) 20%, transparent);
      color: var(--destructive);
    }
  </style>

  <slot name="@left"></slot>&nbsp;left
</custom-element>

<stock-label left="12"></stock-label>
<stock-label left="3"></stock-label>
<stock-label left="0"></stock-label>
```

### Your own states

```js
observe(() => {
  if (menu.open) internals.states.add("open");
  else internals.states.delete("open");
});
```

```css
:host(:state(open)) .panel {
  display: block;
}
```

To toggle a style on an inner element, prefer a data attribute (`_data-active="#tab.active"` with `[data-active]` in CSS) or a state over `_class`, which replaces the whole class list.

## Utility CSS frameworks

Page stylesheets do not reach into shadow roots, so utility classes from Tailwind CSS, UnoCSS, Bootstrap and similar frameworks do nothing in a component's markup (the Tailwind Play CDN also writes to `<head>` only). Inside components, write CSS with the theme tokens. Utility classes still work in page markup and on content passed into a component's `<slot>`, because that content stays in the page. Do not add a utility stylesheet to each component.

## Design tokens

Load `https://realm.js.org/dist/ui/theme.css` once per page and use its tokens for every size, space, radius, shadow and colour. Custom properties inherit through shadow roots, so tokens on `:root` reach every component.

```css
:host {
  padding: calc(var(--spacing) * 4);
  gap: calc(var(--spacing) * 2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  background: var(--card);
  color: var(--card-foreground);
  font-size: var(--text-sm);
  transition: background var(--default-transition-duration) var(--default-transition-timing-function);
}
button:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}
```

- Spacing: `calc(var(--spacing) * n)`, where `--spacing` is `0.25rem`. Never write raw `px` or `rem` sizes.
- Colours come in pairs: a surface (`--primary`, `--secondary`, `--muted`, `--accent`, `--card`, `--popover`, `--destructive`) and its `-foreground` for text on it. Keep each pair at 4.5:1 contrast or more.
- 1px borders (`1px solid var(--border)`) are the one common literal.

All tokens defined on `:root` (light values; `theme.css` has dark values for the colours):

<!-- generated:tokens -->
| Token | Light value |
| --- | --- |
| `--radius` | `0.625rem` |
| `--spacing` | `0.25rem` |
| `--text-xs` | `0.75rem` |
| `--text-sm` | `0.875rem` |
| `--text-base` | `1rem` |
| `--text-lg` | `1.125rem` |
| `--text-xl` | `1.25rem` |
| `--text-2xl` | `1.5rem` |
| `--text-3xl` | `1.875rem` |
| `--text-4xl` | `2.25rem` |
| `--leading-tight` | `1.25` |
| `--leading-normal` | `1.5` |
| `--font-weight-normal` | `400` |
| `--font-weight-medium` | `500` |
| `--font-weight-semibold` | `600` |
| `--font-weight-bold` | `700` |
| `--tracking-tight` | `-0.025em` |
| `--radius-xs` | `calc(var(--radius) - 6px)` |
| `--radius-sm` | `calc(var(--radius) - 4px)` |
| `--radius-md` | `calc(var(--radius) - 2px)` |
| `--radius-lg` | `var(--radius)` |
| `--radius-xl` | `calc(var(--radius) + 4px)` |
| `--radius-2xl` | `calc(var(--radius) + 8px)` |
| `--radius-full` | `9999px` |
| `--shadow-xs` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `--shadow-sm` | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` |
| `--default-transition-duration` | `150ms` |
| `--default-transition-timing-function` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--focus-ring` | `0 0 0 2px var(--ring)` |
| `--background` | `oklch(1 0 0)` |
| `--foreground` | `oklch(0.145 0 0)` |
| `--card` | `oklch(1 0 0)` |
| `--card-foreground` | `oklch(0.145 0 0)` |
| `--popover` | `oklch(1 0 0)` |
| `--popover-foreground` | `oklch(0.145 0 0)` |
| `--primary` | `oklch(0.56 0.21 347)` |
| `--primary-foreground` | `oklch(0.985 0 0)` |
| `--secondary` | `oklch(0.97 0 0)` |
| `--secondary-foreground` | `oklch(0.205 0 0)` |
| `--muted` | `oklch(0.97 0 0)` |
| `--muted-foreground` | `oklch(0.5 0 0)` |
| `--accent` | `oklch(0.97 0 0)` |
| `--accent-foreground` | `oklch(0.205 0 0)` |
| `--destructive` | `oklch(0.54 0.22 27)` |
| `--destructive-foreground` | `oklch(0.985 0 0)` |
| `--border` | `oklch(0.89 0 0)` |
| `--input` | `oklch(0.62 0 0)` |
| `--ring` | `oklch(0.6 0.2 347)` |
| `--chart-1` | `oklch(0.56 0.21 347)` |
| `--chart-2` | `oklch(0.58 0.17 5)` |
| `--chart-3` | `oklch(0.455 0.13 333)` |
| `--chart-4` | `oklch(0.43 0.17 260)` |
| `--chart-5` | `oklch(0.55 0.1 226)` |
| `--sidebar` | `oklch(0.985 0 0)` |
| `--sidebar-foreground` | `oklch(0.145 0 0)` |
| `--sidebar-primary` | `oklch(0.56 0.21 347)` |
| `--sidebar-primary-foreground` | `oklch(0.985 0 0)` |
| `--sidebar-ring` | `oklch(0.6 0.2 347)` |
| `--sidebar-accent` | `oklch(0.97 0 0)` |
| `--sidebar-border` | `oklch(0.89 0 0)` |
| `--font-sans` | `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` |
| `--font-mono` | `ui-monospace, "SF Mono", Menlo, monospace` |
<!-- /generated:tokens -->

## Theming and dark mode

Override tokens on `:root`, or on any element to theme a subtree:

```css
:root {
  --radius: 0.375rem;
  --primary: oklch(0.55 0.2 260);
  --primary-foreground: oklch(0.98 0 0);
}
```

`theme.css` follows the system colour scheme. `data-theme="dark"` on `<html>` forces dark, `data-theme="light"` forces light:

```js
document.documentElement.dataset.theme = "dark";
```

`theme.css` also sets `color-scheme` and gives `body` the background, foreground and sans font.

A custom theme sets its dark values in both places, so the system setting and `data-theme` agree:

```css
:root[data-theme="dark"] { --primary: oklch(0.7 0.15 250); }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --primary: oklch(0.7 0.15 250); }
}
```

Tokens calculated from other tokens are resolved where `theme.css` declares them, on `:root`. `--radius-xs` to `--radius-2xl` come from `--radius`, and `--focus-ring` from `--ring`. When you change `--radius` or `--ring` on an element instead of `:root`, declare the derived tokens again on that element.

People can build a full theme for light and dark mode, with contrast checks, at https://realm.js.org/components/theming/ and paste the CSS it gives them after `theme.css`.

## Styling REALM UI from outside

- Use the component's attributes first: `variant`, `size`, `side`, `orientation`.
- Then its parts: `ui-dialog::part(dialog)`, `ui-input::part(input)`. ui-components.md lists every part and state.
- Then layout from your own stylesheet with a class or element selector: `.toolbar ui-button { flex: 1; }`.
- Never `style="…"` on a `ui-*` element, and never reach into its shadow root.
