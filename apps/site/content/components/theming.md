---
title: Theming
description: Change the colours, radius and font of REALM UI with CSS custom properties, and build a theme for light and dark mode in the browser.
group: Overview
order: 2
nav: Theming
layout: wide
---

# Theming

<p class="lead">REALM UI reads its colours, radius, type, spacing and shadows from CSS custom properties in <code>theme.css</code>. Change a token and every component that uses it follows.</p>

## Theme builder

Pick a preset, then change any colour for light and dark mode. The preview uses the real components. The Contrast tab checks each text colour against the surface it sits on, and the CSS tab holds the stylesheet to copy. Your theme is saved in this browser.

<div class="wide-block">
<import-element from="{{root}}components/theme-builder.html"></import-element>
<theme-builder></theme-builder>
</div>

## Using a theme

Load your theme after `theme.css`, so your values replace the defaults:

```html
<link rel="stylesheet" href="https://realm.js.org/dist/ui/theme.css">
<link rel="stylesheet" href="/my-theme.css">
```

You only need the tokens you change. To make the corners square and the brand colour blue:

```css
:root {
  --radius: 0;
  --primary: oklch(0.52 0.19 258);
  --ring: oklch(0.6 0.17 255);
}
```

Tokens can be set on any element, not only `:root`. Everything inside it uses the new values:

```css
.billing {
  --primary: oklch(0.5 0.13 152);
}
```

A few tokens are calculated from others where `theme.css` declares them, on `:root`. `--radius-sm` to `--radius-2xl` come from `--radius`, and `--focus-ring` comes from `--ring`. When you change `--radius` or `--ring` on an element instead of `:root`, declare those again on the same element:

```css
.compact {
  --radius: 0.25rem;
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
}
```

## Dark mode

Dark values apply when the system is set to dark. `data-theme="dark"` on `<html>` forces dark mode and `data-theme="light"` forces light mode. A theme sets the dark values in both places:

```css
:root[data-theme="dark"] {
  --primary: oklch(0.7 0.15 250);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --primary: oklch(0.7 0.15 250);
  }
}
```

The theme builder writes both blocks for you.

## Colour tokens

Each surface colour has a `-foreground` partner for the text and icons on it. Keep each pair at a contrast of at least 4.5:1.

| Token | Used for |
| --- | --- |
| `--background`, `--foreground` | The page and its text |
| `--card`, `--card-foreground` | Cards |
| `--popover`, `--popover-foreground` | Popovers, menus, tooltips and dialogs |
| `--primary`, `--primary-foreground` | Default buttons, checked controls, links and the brand colour |
| `--secondary`, `--secondary-foreground` | Secondary buttons and badges |
| `--muted`, `--muted-foreground` | Quiet backgrounds, descriptions and placeholder text |
| `--accent`, `--accent-foreground` | Hovered and highlighted items in lists and menus |
| `--destructive`, `--destructive-foreground` | Delete buttons, errors and invalid fields |
| `--border` | Borders and separators |
| `--input` | Borders of text fields, checkboxes and other controls |
| `--ring` | The focus ring |
| `--chart-1` to `--chart-5` | Chart series |
| `--sidebar`, `--sidebar-*` | The sidebar, with its own foreground, primary, accent, border and ring |

## Other tokens

| Token | Default | Used for |
| --- | --- | --- |
| `--radius` | `0.625rem` | Corner radius. `--radius-xs` to `--radius-2xl` are based on it, and `--radius-full` makes pills |
| `--spacing` | `0.25rem` | The spacing unit. Components use multiples of it, such as `calc(var(--spacing) * 4)` |
| `--font-sans`, `--font-mono` | System fonts | Text and code |
| `--text-xs` to `--text-4xl` | `0.75rem` to `2.25rem` | Font sizes |
| `--font-weight-normal` to `--font-weight-bold` | `400` to `700` | Font weights |
| `--shadow-xs` to `--shadow-lg` | | Shadows |
| `--default-transition-duration` | `150ms` | Hover and state transitions |

To use the tokens in your own styles, read them with `var()`:

```css
.note {
  padding: calc(var(--spacing) * 4);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--muted);
  color: var(--muted-foreground);
}
```
