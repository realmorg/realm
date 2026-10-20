---
title: Breadcrumb
description: A trail of links showing where the current page sits in the site hierarchy.
group: Navigation
order: 402
nav: Breadcrumb
---

# Breadcrumb

`ui-breadcrumb` renders a `<nav>` landmark. Inside it, `ui-breadcrumb-list` renders the ordered list, each step is a
`ui-breadcrumb-item` holding a `ui-breadcrumb-link` or, for the current page, a `ui-breadcrumb-page`. Put a
`ui-breadcrumb-separator` between items; it draws a chevron unless you give it other content.

```html live
<ui-breadcrumb>
  <ui-breadcrumb-list>
    <ui-breadcrumb-item><ui-breadcrumb-link href="#">Home</ui-breadcrumb-link></ui-breadcrumb-item>
    <ui-breadcrumb-separator></ui-breadcrumb-separator>
    <ui-breadcrumb-item><ui-breadcrumb-link href="#">Components</ui-breadcrumb-link></ui-breadcrumb-item>
    <ui-breadcrumb-separator></ui-breadcrumb-separator>
    <ui-breadcrumb-item><ui-breadcrumb-page>Breadcrumb</ui-breadcrumb-page></ui-breadcrumb-item>
  </ui-breadcrumb-list>
</ui-breadcrumb>
```

## Examples

### Custom separator

Content inside `ui-breadcrumb-separator` replaces the chevron.

```html live
<ui-breadcrumb>
  <ui-breadcrumb-list>
    <ui-breadcrumb-item><ui-breadcrumb-link href="#">Home</ui-breadcrumb-link></ui-breadcrumb-item>
    <ui-breadcrumb-separator>/</ui-breadcrumb-separator>
    <ui-breadcrumb-item><ui-breadcrumb-link href="#">Components</ui-breadcrumb-link></ui-breadcrumb-item>
    <ui-breadcrumb-separator>/</ui-breadcrumb-separator>
    <ui-breadcrumb-item><ui-breadcrumb-page>Breadcrumb</ui-breadcrumb-page></ui-breadcrumb-item>
  </ui-breadcrumb-list>
</ui-breadcrumb>
```

### Collapsed middle

Long trails can hide the middle steps. `ui-breadcrumb-ellipsis` draws three dots with a hidden "More" label; put it
in a dropdown menu trigger to reveal the hidden pages.

```html live
<ui-breadcrumb>
  <ui-breadcrumb-list>
    <ui-breadcrumb-item><ui-breadcrumb-link href="#">Home</ui-breadcrumb-link></ui-breadcrumb-item>
    <ui-breadcrumb-separator></ui-breadcrumb-separator>
    <ui-breadcrumb-item>
      <ui-dropdown-menu>
        <ui-dropdown-menu-trigger>
          <ui-button variant="ghost" size="icon"><ui-breadcrumb-ellipsis>Show hidden pages</ui-breadcrumb-ellipsis></ui-button>
        </ui-dropdown-menu-trigger>
        <ui-dropdown-menu-content>
          <ui-menu-item value="docs">Documentation</ui-menu-item>
          <ui-menu-item value="guides">Guides</ui-menu-item>
        </ui-dropdown-menu-content>
      </ui-dropdown-menu>
    </ui-breadcrumb-item>
    <ui-breadcrumb-separator></ui-breadcrumb-separator>
    <ui-breadcrumb-item><ui-breadcrumb-link href="#">Components</ui-breadcrumb-link></ui-breadcrumb-item>
    <ui-breadcrumb-separator></ui-breadcrumb-separator>
    <ui-breadcrumb-item><ui-breadcrumb-page>Breadcrumb</ui-breadcrumb-page></ui-breadcrumb-item>
  </ui-breadcrumb-list>
</ui-breadcrumb>
```

### Custom label

The `<nav>` is labelled "Breadcrumb" by default. Change it with `label`, for example on a localized page.

```html live
<ui-breadcrumb label="Fil d'Ariane">
  <ui-breadcrumb-list>
    <ui-breadcrumb-item><ui-breadcrumb-link href="#">Accueil</ui-breadcrumb-link></ui-breadcrumb-item>
    <ui-breadcrumb-separator></ui-breadcrumb-separator>
    <ui-breadcrumb-item><ui-breadcrumb-page>Paramètres</ui-breadcrumb-page></ui-breadcrumb-item>
  </ui-breadcrumb-list>
</ui-breadcrumb>
```

### Bound to state

Inside a component, bind the current page with a value slot.

```html live
<custom-element name="breadcrumb-state-demo">
  <script type="realm">
    const view = useState({ title: "Overview" });

    function show(title) {
      view.title = title;
    }
  </script>
  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
      justify-items: center;
    }
  </style>
  <ui-breadcrumb>
    <ui-breadcrumb-list>
      <ui-breadcrumb-item><ui-breadcrumb-link href="#">Acme</ui-breadcrumb-link></ui-breadcrumb-item>
      <ui-breadcrumb-separator></ui-breadcrumb-separator>
      <ui-breadcrumb-item><ui-breadcrumb-page><slot name="#view.title"></slot></ui-breadcrumb-page></ui-breadcrumb-item>
    </ui-breadcrumb-list>
  </ui-breadcrumb>
  <ui-button-group>
    <ui-button variant="outline" size="sm" onclick="show('Overview')">Overview</ui-button>
    <ui-button variant="outline" size="sm" onclick="show('Invoices')">Invoices</ui-button>
  </ui-button-group>
</custom-element>
<breadcrumb-state-demo></breadcrumb-state-demo>
```

## API

### Parts

| Element | Fills | Renders |
| --- | --- | --- |
| `ui-breadcrumb` | | A `<nav>` landmark named by `label`. |
| `ui-breadcrumb-list` | the `<nav>` of `ui-breadcrumb` | An `<ol>` that lays out items and separators in a wrapping row of small muted text. |
| `ui-breadcrumb-item` | the `<ol>` of `ui-breadcrumb-list` | A list item (`role="listitem"`). |
| `ui-breadcrumb-link` | a `ui-breadcrumb-item` | An `<a>` that turns the foreground colour on hover. |
| `ui-breadcrumb-page` | a `ui-breadcrumb-item` | The current page: a `<span>` with `aria-current="page"` in the foreground colour. |
| `ui-breadcrumb-separator` | the `<ol>`, between items | A chevron, or its own content. Hidden from assistive technology. |
| `ui-breadcrumb-ellipsis` | a `ui-breadcrumb-item` or a button | Three dots with a visually hidden label (default "More"). |

### Attributes

#### ui-breadcrumb

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | string | `"Breadcrumb"` | Accessible name of the `<nav>` landmark. |

#### ui-breadcrumb-link

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | string | | Link target. |

The other parts have no attributes.

### Slots

| Slot | Element | Description |
| --- | --- | --- |
| (default) | `ui-breadcrumb-separator` | Replaces the chevron, for example with `/`. |
| (default) | `ui-breadcrumb-ellipsis` | The visually hidden label. Defaults to "More". |

### CSS parts

| Part | Element | Description |
| --- | --- | --- |
| `list` | `ui-breadcrumb-list` | The `<ol>`. |
| `link` | `ui-breadcrumb-link` | The `<a>`. |
| `page` | `ui-breadcrumb-page` | The `<span>` with `aria-current="page"`. |
| `label` | `ui-breadcrumb-ellipsis` | The visually hidden label. |

### Accessibility

- `ui-breadcrumb` is a `<nav>` landmark named by `label`, containing an `<ol>`.
- Each `ui-breadcrumb-item` has `role="listitem"`. Separators have `role="presentation"` and `aria-hidden`, so they
  are not announced.
- Links are reached with Tab. The current page has `aria-current="page"` and is not focusable.
