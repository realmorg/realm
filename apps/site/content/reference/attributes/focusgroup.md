---
title: focusgroup
description: The focusgroup attribute and its inline, block and wrap tokens for arrow-key, Home and End focus navigation.
group: Attributes
order: 25
nav: focusgroup
---

# `focusgroup`

Moves focus among the focusable items of a container with the arrow keys, Home and End. REALM implements the arrow-key behaviour of the [Open UI focusgroup proposal](https://open-ui.org/components/scoped-focusgroup.explainer/) in every browser. Used on a container in component markup.

```html
<div role="toolbar" aria-label="Formatting" focusgroup="toolbar inline wrap">…</div>
```

## Tokens

The value is a space-separated list. Tokens other than these are ignored, so the first word can name the widget (`toolbar`, `menu`, `tablist`, `listbox`, `radiogroup`) for readability.

| Token | Effect |
| --- | --- |
| `inline` | Only Left and Right move focus |
| `block` | Only Up and Down move focus |
| neither | All four arrows move focus |
| `wrap` | Moving past the last item goes to the first, and the other way round. Without it, focus stops at the ends |

Left and Right are mirrored when the container's computed `direction` is `rtl`. Home focuses the first item, End the last. Handled keys call `preventDefault()`. The tokens are read on every key press, so changing the attribute takes effect at once.

## Items

Items are found in the flat tree under the container: its children, content slotted into it, and the shadow roots of nested elements.

| Included | Skipped |
| --- | --- |
| `button`, `a[href]`, `input`, `select`, `textarea`, `[tabindex]` | `:disabled`, `[disabled]`, `[aria-disabled="true"]`, `[inert]`, `[hidden]` |
| Custom elements whose shadow root delegates focus (their insides are not searched) | `tabindex="-2"` |
| | Anything not rendered (`checkVisibility()` is false) |

The focusgroup only moves focus. It does not manage `tabindex`. To make the widget one Tab stop, set `tabindex="-1"` on the items that are not current.

## Example

```html live
<custom-element name="align-toolbar">
  <style type="realm">
    div {
      display: inline-flex;
      gap: calc(var(--spacing) * 1);
      padding: calc(var(--spacing) * 1);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
    }
  </style>

  <div role="toolbar" aria-label="Alignment" focusgroup="toolbar inline wrap">
    <ui-button variant="ghost" size="sm">Left</ui-button>
    <ui-button variant="ghost" size="sm">Center</ui-button>
    <ui-button variant="ghost" size="sm" disabled>Justify</ui-button>
    <ui-button variant="ghost" size="sm">Right</ui-button>
  </div>
</custom-element>

<align-toolbar></align-toolbar>
```

Click "Left", then use the arrow keys, Home and End. "Justify" is disabled and skipped.

## Related

- [Accessibility: arrow-key navigation](/docs/accessibility/#arrow-key-navigation-with-focusgroup)
