---
title: Pagination
description: Page navigation with previous and next controls, numbered pages and ellipses, driven by a page number and a page count.
group: Navigation
order: 406
nav: Pagination
---

# Pagination

`ui-pagination` renders a `<nav>` with Previous, Next and numbered page controls from two numbers: the current
`page` and the `total` number of pages. It always shows the first and last page, the pages within `siblings` of the
current one, and an ellipsis for each gap. It works in two modes:

- Without `href`, Previous, Next and the page numbers are native buttons. Clicking one (or pressing Enter or Space)
  updates the `page` attribute in place and fires `change`. Use this for client-side lists.
- With `href`, Previous, Next and every page number are real links built from the pattern, for example
  `?page={page}`.

```html live
<ui-pagination page="5" total="10"></ui-pagination>
```

## Examples

### Siblings

`siblings` sets how many pages are shown on each side of the current page. The default is `1`.

```html live
<div class="demo-stack">
  <ui-pagination page="10" total="20" siblings="0"></ui-pagination>
  <ui-pagination page="10" total="20"></ui-pagination>
  <ui-pagination page="10" total="20" siblings="2"></ui-pagination>
</div>
```

### Few pages

When every page fits, no ellipsis is shown. Previous is disabled on the first page and Next on the last.

```html live
<ui-pagination page="1" total="3"></ui-pagination>
```

### Links

With `href`, `{page}` in the pattern is replaced by each page number, so the numbers are crawlable links and work
without script. The component does not change `page` itself in this mode: the next page load sets it.

```html
<ui-pagination page="2" total="5" href="/invoices?page={page}"></ui-pagination>
```

### Controlled from state

Bind `page` and `total` from state and read the new page from `event.detail.page`. Call `event.preventDefault()`
on `change` to cancel the move, for example while data is still loading.

```html live
<custom-element name="pagination-state-demo">
  <script type="realm">
    const list = useState({
      page: 1,
      total: 12,
      get range() {
        const start = (this.page - 1) * 10 + 1;
        return `Showing ${start} to ${start + 9} of 120 invoices`;
      },
    });

    function paged(event) {
      list.page = event.detail.page;
    }
  </script>
  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
      justify-items: center;
    }
    p {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--muted-foreground);
    }
  </style>
  <p><slot name="#list.range"></slot></p>
  <ui-pagination _page="#list.page" _total="#list.total" onchange="paged(event)"></ui-pagination>
</custom-element>
<pagination-state-demo></pagination-state-demo>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | number | `1` | The current page. Integer, at least 1. Updated by the component when `href` is not set. |
| `total` | number | `1` | Number of pages. Integer, at least 1. |
| `siblings` | number | `1` | Pages shown on each side of the current page. Integer, at least 0. |
| `href` | string | | URL pattern for page links. `{page}` is replaced by the page number. When not set, the controls are buttons that update `page`. |
| `label` | string | `"Pagination"` | Accessible name of the `<nav>` landmark. |

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `change` | `{ page: number }` | Fires before the page changes, from Previous, Next or a page number. Bubbles and is cancelable: `preventDefault()` keeps the current page and, in `href` mode, stops the link from navigating. Not fired for the current page or a page out of range. |

### CSS parts

| Part | Description |
| --- | --- |
| `list` | The `<ul>` that lays out the controls. |
| `previous` | The Previous control: a `<button>`, or an `<a>` in `href` mode. |
| `next` | The Next control: a `<button>`, or an `<a>` in `href` mode. |
| `page` | Each page number: a `<button>`, or an `<a>` in `href` mode. The current one has `aria-current="page"`. |

### Accessibility

- The component is a `<nav>` landmark named by `label`, containing a list.
- The current page has `aria-current="page"`. Ellipses are hidden from assistive technology.
- Without `href` every control is a native `<button>`: Tab reaches it and Enter or Space activates it. Previous and
  Next are `disabled` at the first and last page.
- In `href` mode every control is a link reached with Tab. At the first and last page, Previous and Next have no
  `href` and `aria-disabled="true"`.
