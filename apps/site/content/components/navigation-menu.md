---
title: Navigation Menu
description: A site navigation bar of links and triggers that open popover panels of further links on hover or click.
group: Navigation
order: 405
nav: Navigation Menu
---

# Navigation Menu

`ui-navigation-menu` renders a `<nav>` landmark around a `ui-navigation-menu-list`. Each `ui-navigation-menu-item`
holds either a `ui-navigation-menu-link`, or a `ui-navigation-menu-trigger` with a `ui-navigation-menu-content`. The
content goes in a native `popover="auto"` panel anchored below the trigger. Panels open on click and after a short
hover delay, and close when the pointer leaves, on Escape or on a click outside.

```html live
<ui-navigation-menu>
  <ui-navigation-menu-list>
    <ui-navigation-menu-item>
      <ui-navigation-menu-trigger>Getting started</ui-navigation-menu-trigger>
      <ui-navigation-menu-content width="72">
        <ui-navigation-menu-link href="#">
          <strong>Introduction</strong>
          <span>What REALM is and how it works.</span>
        </ui-navigation-menu-link>
        <ui-navigation-menu-link href="#">
          <strong>Installation</strong>
          <span>Add REALM to a page or a build.</span>
        </ui-navigation-menu-link>
      </ui-navigation-menu-content>
    </ui-navigation-menu-item>
    <ui-navigation-menu-item>
      <ui-navigation-menu-trigger>Components</ui-navigation-menu-trigger>
      <ui-navigation-menu-content width="80" columns="2">
        <ui-navigation-menu-link href="#">Alert Dialog</ui-navigation-menu-link>
        <ui-navigation-menu-link href="#">Hover Card</ui-navigation-menu-link>
        <ui-navigation-menu-link href="#">Progress</ui-navigation-menu-link>
        <ui-navigation-menu-link href="#">Tabs</ui-navigation-menu-link>
      </ui-navigation-menu-content>
    </ui-navigation-menu-item>
    <ui-navigation-menu-item>
      <ui-navigation-menu-link href="#" current>Docs</ui-navigation-menu-link>
    </ui-navigation-menu-item>
  </ui-navigation-menu-list>
</ui-navigation-menu>
```

## Examples

### Links only

Use only links for a flat bar. Mark the active one with `current`.

```html live
<ui-navigation-menu label="Account">
  <ui-navigation-menu-list>
    <ui-navigation-menu-item><ui-navigation-menu-link href="#" current>Profile</ui-navigation-menu-link></ui-navigation-menu-item>
    <ui-navigation-menu-item><ui-navigation-menu-link href="#">Billing</ui-navigation-menu-link></ui-navigation-menu-item>
    <ui-navigation-menu-item><ui-navigation-menu-link href="#">Team</ui-navigation-menu-link></ui-navigation-menu-item>
  </ui-navigation-menu-list>
</ui-navigation-menu>
```

### Simple list

Without `width` or `columns`, the content is a single column at least `calc(var(--spacing) * 64)` wide.

```html live
<ui-navigation-menu>
  <ui-navigation-menu-list>
    <ui-navigation-menu-item>
      <ui-navigation-menu-trigger>Resources</ui-navigation-menu-trigger>
      <ui-navigation-menu-content>
        <ui-navigation-menu-link href="#">Blog</ui-navigation-menu-link>
        <ui-navigation-menu-link href="#">Changelog</ui-navigation-menu-link>
      </ui-navigation-menu-content>
    </ui-navigation-menu-item>
    <ui-navigation-menu-item><ui-navigation-menu-link href="#">Pricing</ui-navigation-menu-link></ui-navigation-menu-item>
  </ui-navigation-menu-list>
</ui-navigation-menu>
```

## API

### Parts

| Element | Fills | Renders |
| --- | --- | --- |
| `ui-navigation-menu` | | A `<nav>` landmark named by `label`. |
| `ui-navigation-menu-list` | the `<nav>` of `ui-navigation-menu` | A `<ul>` laying out the items in a row, with arrow-key navigation. |
| `ui-navigation-menu-item` | the `<ul>` of `ui-navigation-menu-list` | A list item (`role="listitem"`) and, when it has content, the popover panel. |
| `ui-navigation-menu-trigger` | a `ui-navigation-menu-item` | A `<button>` with a chevron and `aria-expanded` that opens the item's panel. |
| `ui-navigation-menu-content` | the popover panel of its `ui-navigation-menu-item` | A grid of links inside the panel. |
| `ui-navigation-menu-link` | a `ui-navigation-menu-item` or a `ui-navigation-menu-content` | An `<a>`. At the top level it looks like a trigger; inside content it is a block row, where a first child is the title and a last child the muted description. |

### Attributes

#### ui-navigation-menu

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | string | `"Main"` | Accessible name of the `<nav>` landmark. |

#### ui-navigation-menu-content

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | number | | Width of the content in spacing units: `width="72"` is `calc(var(--spacing) * 72)`. |
| `columns` | number | `1` | Number of equal grid columns for the links. |

#### ui-navigation-menu-link

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | string | | Link target. |
| `current` | boolean | `false` | Highlights the link and sets `aria-current="page"`. |

`ui-navigation-menu-list`, `ui-navigation-menu-item` and `ui-navigation-menu-trigger` have no attributes.

### CSS parts

| Part | Element | Description |
| --- | --- | --- |
| `list` | `ui-navigation-menu-list` | The `<ul>`. |
| `panel` | `ui-navigation-menu-item` | The popover panel around the content. |
| `trigger` | `ui-navigation-menu-trigger` | The `<button>`. |
| `link` | `ui-navigation-menu-link` | The `<a>`. |

### Accessibility

- `ui-navigation-menu` is a `<nav>` landmark named by `label`. Each `ui-navigation-menu-item` has `role="listitem"`.
- Links are native `<a>` elements. Triggers are native `<button>` elements with `aria-expanded`: Enter or Space
  opens and closes the panel.
- With the panel open, Tab moves into the panel's links. Escape closes the panel and, when focus was inside it,
  returns focus to the trigger.
- Hover opens a panel after 150 ms and closes it 200 ms after the pointer leaves both the trigger and the panel,
  so moving the pointer from trigger to panel does not close it.
- The list declares `focusgroup="toolbar inline"`, so Left and Right arrows move between the top-level items.
