---
title: Components
description: About sixty accessible ui-* web components built with REALM, plus a theme of design tokens with dark mode.
group: Overview
order: 1
nav: Introduction
---

# Components

REALM UI (`@realmorg/ui`) is a set of accessible components built with REALM and native HTML. Every component is a plain `<custom-element>` file you can read, copy and change. This site is built with them.

```html live
<div class="demo-narrow">
  <ui-card>
    <ui-card-header>
      <ui-card-title level="2">Create project</ui-card-title>
      <ui-card-description>Deploy your new project in one click.</ui-card-description>
    </ui-card-header>
    <ui-card-content>
      <ui-field>
        <ui-label for="project-name">Name</ui-label>
        <ui-input id="project-name" placeholder="Name of your project"></ui-input>
      </ui-field>
    </ui-card-content>
    <ui-card-footer justify="between">
      <ui-button variant="outline">Cancel</ui-button>
      <ui-button>Deploy</ui-button>
    </ui-card-footer>
  </ui-card>
</div>
```

## Installation

REALM UI needs no installation. Load REALM, the theme and the component bundle from realm.js.org, once per page:

```html
<link rel="stylesheet" href="https://realm.js.org/dist/realm.css">
<link rel="stylesheet" href="https://realm.js.org/dist/ui/theme.css">
<script type="module" src="https://realm.js.org/dist/realm.js"></script>

<import-element from="https://realm.js.org/dist/ui/ui.html"></import-element>
```

To load less, import only the components you use instead of the bundle:

```html
<import-element from="https://realm.js.org/dist/ui/components/button.html"></import-element>
<import-element from="https://realm.js.org/dist/ui/components/card.html"></import-element>
```

Each file imports the files it depends on, so `sheet.html` also loads `dialog.html`. A file is fetched once, however many files import it.

Pin an exact version (currently `@realmorg/ui@{{version:ui}}`) in production, as described in [Installation](/docs/installation/#pin-a-version). The package contains:

| File | Contents |
| --- | --- |
| `dist/theme.css` | Design tokens (colours, spacing, type, radius, shadows) with light and dark values |
| `dist/ui.html` | Every component in one file |
| `components/<name>.html` | One component (or a small family, such as tabs and tab panels) per file, with its dependencies imported at the top |

To own a component, copy its file from `components/` into your project and import your copy instead. Components depend on REALM, the theme tokens and the files they import at the top, such as `button.html`.

## Conventions

- **Native first.** Components wrap native elements: `ui-button` renders a `<button>`, `ui-select` a `<select>`, `ui-dialog` a `<dialog>`, popovers use the Popover API.
- **Attributes are props.** Every attribute is declared with `defineProps`, typed and validated. Variants and sizes are attributes: `<ui-button variant="outline" size="sm">`.
- **Forms.** Inputs are form-associated: they submit with their `name`, reset, validate, and follow `<fieldset disabled>`.
- **Events.** Components emit native-named events where one fits (`change`, `input`, `toggle`, `select`, `close`, `cancel`), so `onchange` works on any page.
- **Styling.** Inner elements are exposed with `part`, and every component reads the theme tokens. Variants are reactive CSS states you can also target from outside, such as `ui-button:state(attr-variant-is-ghost)`.
- **Accessibility.** Roles, labels, keyboard support and focus management follow the WAI-ARIA patterns. Each page lists them.

## Theming

Override tokens on `:root` or any element. Dark mode follows the system, `data-theme="dark"` on `<html>` forces it, and `data-theme="light"` turns it off. [Theming](/components/theming/) lists every token and has a theme builder.

```css
:root {
  --radius: 0.375rem;
  --primary: oklch(0.55 0.2 260);
  --primary-foreground: oklch(0.98 0 0);
}
```

## All components

### Forms

[Button](/components/button/) · [Button Group](/components/button-group/) · [Calendar](/components/calendar/) · [Checkbox](/components/checkbox/) · [Combobox](/components/combobox/) · [Field](/components/field/) · [Input](/components/input/) · [Input Group](/components/input-group/) · [Input OTP](/components/input-otp/) · [Label](/components/label/) · [Radio Group](/components/radio-group/) · [Select](/components/select/) · [Slider](/components/slider/) · [Switch](/components/switch/) · [Textarea](/components/textarea/) · [Toggle](/components/toggle/) · [Toggle Group](/components/toggle-group/)

### Display

[Alert](/components/alert/) · [Avatar](/components/avatar/) · [Badge](/components/badge/) · [Card](/components/card/) · [Chart](/components/chart/) · [Empty](/components/empty/) · [Item](/components/item/) · [Kbd](/components/kbd/) · [Progress](/components/progress/) · [Separator](/components/separator/) · [Skeleton](/components/skeleton/) · [Spinner](/components/spinner/) · [Table](/components/table/)

### Overlays

[Alert Dialog](/components/alert-dialog/) · [Command](/components/command/) · [Context Menu](/components/context-menu/) · [Dialog](/components/dialog/) · [Drawer](/components/drawer/) · [Dropdown Menu](/components/dropdown-menu/) · [Hover Card](/components/hover-card/) · [Popover](/components/popover/) · [Sheet](/components/sheet/) · [Toaster](/components/toaster/) · [Tooltip](/components/tooltip/)

### Navigation

[Accordion](/components/accordion/) · [Breadcrumb](/components/breadcrumb/) · [Collapsible](/components/collapsible/) · [Menubar](/components/menubar/) · [Navigation Menu](/components/navigation-menu/) · [Pagination](/components/pagination/) · [Sidebar](/components/sidebar/) · [Tabs](/components/tabs/)

### Layout

[Aspect Ratio](/components/aspect-ratio/) · [Carousel](/components/carousel/) · [Direction](/components/direction/) · [Resizable](/components/resizable/) · [Scroll Area](/components/scroll-area/)

### Chat and content

[Attachment](/components/attachment/) · [Bubble](/components/bubble/) · [Code Block](/components/code-block/) · [Marker](/components/marker/) · [Message](/components/message/) · [Message Scroller](/components/message-scroller/)
