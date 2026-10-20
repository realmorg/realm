---
title: Design tokens
description: The design tokens in the REALM UI theme.css, their values, and how dark mode switches them.
group: CSS
order: 93
nav: Design tokens
---

# Design tokens

The `@realmorg/ui` theme defines colour, spacing, type, radius, shadow and motion tokens as custom properties on `:root`. REALM UI components use them. Use them in your own components too, so sizes and colours match and theming works.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/theme.css">
```

Custom properties inherit through shadow roots, so a token on `:root` reaches every component.

```css
:host {
  padding: calc(var(--spacing) * 4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  box-shadow: var(--shadow-sm);
  color: var(--card-foreground);
  background: var(--card);
}
```

## Spacing

| Token | Value | Use |
| --- | --- | --- |
| `--spacing` | `0.25rem` | Base unit. Write sizes as `calc(var(--spacing) * n)` |

## Type

| Token | Value |
| --- | --- |
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
| `--font-sans` | `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` |
| `--font-mono` | `ui-monospace, "SF Mono", Menlo, monospace` |

## Radius

| Token | Value |
| --- | --- |
| `--radius` | `0.625rem` (the base the others derive from) |
| `--radius-xs` | `calc(var(--radius) - 6px)` |
| `--radius-sm` | `calc(var(--radius) - 4px)` |
| `--radius-md` | `calc(var(--radius) - 2px)` |
| `--radius-lg` | `var(--radius)` |
| `--radius-xl` | `calc(var(--radius) + 4px)` |
| `--radius-2xl` | `calc(var(--radius) + 8px)` |
| `--radius-full` | `9999px` |

## Shadow and focus

| Token | Value |
| --- | --- |
| `--shadow-xs` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `--shadow-sm` | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` |
| `--focus-ring` | `0 0 0 3px` of `--ring` at 50%. Use as `box-shadow` on `:focus-visible` |

## Motion

| Token | Value |
| --- | --- |
| `--default-transition-duration` | `150ms` |
| `--default-transition-timing-function` | `cubic-bezier(0.4, 0, 0.2, 1)` |

## Colour

Each surface colour has a matching `-foreground` for text on it.

| Token | Use |
| --- | --- |
| `--background`, `--foreground` | Page |
| `--card`, `--card-foreground` | Cards and panels |
| `--popover`, `--popover-foreground` | Popovers, menus, tooltips |
| `--primary`, `--primary-foreground` | Main actions |
| `--secondary`, `--secondary-foreground` | Secondary actions |
| `--muted`, `--muted-foreground` | Subdued surfaces and text |
| `--accent`, `--accent-foreground` | Hover and selected states |
| `--destructive`, `--destructive-foreground` | Dangerous actions and errors |
| `--border` | Borders and separators |
| `--input` | Form field borders |
| `--ring` | Focus rings |
| `--chart-1` … `--chart-5` | Data series |
| `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring` | Sidebar navigation |

Colours are written in `oklch()`. The values differ between light and dark mode. See `theme.css` for the exact numbers.

## Dark mode

| Condition | Colours |
| --- | --- |
| `<html data-theme="dark">` | Dark |
| `<html data-theme="light">` | Light |
| no `data-theme`, system prefers dark | Dark |
| otherwise | Light |

`theme.css` also sets `color-scheme` and gives `body` the `--background`, `--foreground` and `--font-sans` values.

## Example

```html live
<custom-element name="token-swatches">
  <style type="realm">
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: calc(var(--spacing) * 2);
    }
    span {
      padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      box-shadow: var(--shadow-xs);
    }
    .primary { background: var(--primary); color: var(--primary-foreground); }
    .secondary { background: var(--secondary); color: var(--secondary-foreground); }
    .muted { background: var(--muted); color: var(--muted-foreground); }
    .accent { background: var(--accent); color: var(--accent-foreground); }
    .destructive { background: var(--destructive); color: var(--destructive-foreground); }
  </style>

  <span class="primary">primary</span>
  <span class="secondary">secondary</span>
  <span class="muted">muted</span>
  <span class="accent">accent</span>
  <span class="destructive">destructive</span>
</custom-element>

<token-swatches></token-swatches>
```

## Related

- [Styling: design tokens](/docs/styling/#design-tokens)
- [Styling: theming and dark mode](/docs/styling/#theming-and-dark-mode)
