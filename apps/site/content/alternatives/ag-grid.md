---
title: AG Grid alternatives
description: Looking for an AG Grid alternative? When AG Grid is still the right call, and when a lighter grid such as REALM Pro, Tabulator or RevoGrid fits better.
seoTitle: AG Grid alternatives for 2026, compared honestly
---

# AG Grid alternatives

If you use AG Grid Enterprise for row grouping, pivoting, Excel export or the server-side row model, stay on it: few alternatives match that set, and the ones that do (Syncfusion, DevExtreme, Kendo UI) cost about as much. If you mainly need a fast, sortable, filterable, editable table and the Enterprise licence feels like a lot for that, look at REALM Pro's [`ui-kit-data-grid`](/pro/components/ui-kit-data-grid/) (one-time price, no framework), [Tabulator](https://tabulator.info/) (free, MIT, with grouping and XLSX) or [RevoGrid](https://rv-grid.com/) (MIT core, paid Pro). React-only teams should also compare MUI X.

Facts about AG Grid and the other products were checked in October 2026 against each vendor's own site, docs and npm package, linked below.

## What AG Grid gives you, and what it costs

[AG Grid](https://www.ag-grid.com/) comes in two editions. Community is MIT and free in production. Enterprise is a commercial, perpetual licence per developer with one year of updates, and [the pricing page](https://www.ag-grid.com/license-pricing/) says each front-end developer on the project needs one. You can buy 1 to 10 developer licences online for internal applications. Customer-facing applications, and teams of more than 10, go through sales. The page does not show a price until you configure a licence, so we do not quote one here. The current release is 36.2.0.

The [Community vs Enterprise page](https://www.ag-grid.com/javascript-data-grid/community-vs-enterprise/) lists what the paid edition adds: the server-side row model, row grouping, aggregation, pivoting, tree data, master/detail, Excel and PDF export, clipboard and range selection, set and advanced filters, and integrated charts (which need the Enterprise Bundle with AG Charts). Community keeps the client-side row model, CSV export, the basic filters and editors, and undo/redo.

That is a lot of grid, and it is why people search for alternatives. The common reasons:

- **The features you use are in Community, but you want more than Community.** A team that needs one Enterprise feature, such as clipboard paste, pays for all of them.
- **Per-developer licensing.** Each front-end developer who touches the grid needs a seat.
- **Customer-facing apps need a sales conversation.** Online purchase covers internal apps only.
- **Weight and API surface.** AG Grid is configured through a large options object. AG Grid publishes [modules](https://www.ag-grid.com/javascript-data-grid/modules/) to cut bundle size but no size figures.

## What REALM Pro's data grid does

[`ui-kit-data-grid`](/pro/components/ui-kit-data-grid/) is one of the components in [REALM Pro](/pro/). It is a custom element written with REALM, so it works in a plain HTML page, in a server-rendered app, or next to React, Vue or Angular as an ordinary tag.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-data-grid/light-desktop.png" alt="REALM Pro data grid component, desktop, light mode" width="960" height="645" loading="lazy">
    <figcaption>REALM Pro data grid. <a href="/pro/components/ui-kit-data-grid/">See it in dark mode and on a phone</a>.</figcaption>
  </figure>
</div>

```html
<ui-kit-data-grid
  name="orders"
  label="Orders"
  src="/api/orders"
  columns='[
    { "field": "id", "header": "Order", "pinned": "left" },
    { "field": "status", "header": "Status", "type": "badge" },
    { "field": "total", "header": "Total", "type": "number", "format": "currency" },
    { "field": "notes", "header": "Notes", "editable": true }
  ]'
></ui-kit-data-grid>
```

What it covers:

- **Large data in the browser.** It renders only the rows on screen plus a few around them and reuses them as you scroll, and stays smooth with 100,000 rows.
- **Server data.** With `src`, it requests blocks of rows as people scroll and sends the sort, filters, search text, offset and limit. Your server returns the rows and the total.
- **Sorting and filtering.** Click to sort, Shift-click to sort by several columns. Text columns filter by "contains", numbers and dates by a range, badge columns by a list of values. A search box looks through all visible columns.
- **Columns.** Resize, drag to reorder, pin left or right, hide and show.
- **Editing.** Editable columns open an input on Enter or double click. The grid sends a cancellable `celledit` event, so your code can reject a value.
- **Selection and forms.** Select rows with checkboxes, Shift-click for a range. Inside a `<form>`, the selected row ids are submitted under the grid's `name`, and a form reset clears them.
- **CSV export** of exactly what is on screen: visible columns, current order, filters and sort.
- **Keyboard and screen readers.** It follows the ARIA grid pattern with one tab stop, arrow keys, Home/End, Page Up/Down, and keyboard column resizing and moving. Screen readers hear the real row count.
- **Theming** from your REALM UI tokens, with dark mode.

The component is a single HTML file you can read and change: 57 KB of source, about 14 KB gzipped, plus the REALM runtime and the REALM UI parts it uses.

What it does not do, so you can rule it out quickly: row grouping, aggregation, pivoting, tree data, master/detail rows, Excel export, range selection with clipboard copy and paste, and charts inside the grid. If you need any of those, keep reading the table below.

## Side by side

Checked October 2026 against [AG Grid pricing](https://www.ag-grid.com/license-pricing/), [Tabulator](https://tabulator.info/), [RevoGrid pricing](https://rv-grid.com/pricing), [MUI pricing](https://mui.com/pricing/) and [Syncfusion pricing](https://www.syncfusion.com/sales/pricing).

| | REALM Pro data grid | AG Grid Enterprise | Tabulator | RevoGrid | MUI X Data Grid |
| --- | --- | --- | --- | --- | --- |
| Licence | Commercial, one-time | Commercial, perpetual per developer, 1 year of updates. Community is MIT | MIT | MIT core, Pro by annual subscription | MIT Community, Pro and Premium per developer |
| Price | $149 one developer, $499 up to 10 (early access), all Pro components included | Shown after configuring a licence | Free | Pro Lite $199/year, Pro Advanced $499/year, per developer | Pro $299, Premium $599 per year per developer |
| Frameworks | Any: it is a custom element | JavaScript, React, Angular, Vue | Plain JavaScript, works in any framework | JavaScript, React, Vue, Angular, Svelte | React only |
| Virtual scrolling | Rows | Rows and columns | Yes | Rows and columns | Yes |
| Server data | Block loading with sort, filter, search | Server-side row model (Enterprise) | Ajax loading, remote pagination | Pro "server-side analytics contracts" | Data Source (free); lazy loading (Pro) |
| Grouping and aggregation | No | Enterprise | Grouping, column calculations | Totals, aggregations (Pro Advanced) | Premium |
| Pivoting | No | Enterprise | No | Pro Advanced | Premium |
| Tree data | No | Enterprise | Yes | Tree view (Pro Lite) | Pro |
| Excel export | No (CSV) | Enterprise | XLSX export and import | Pro Lite | Premium |
| Clipboard | No | Enterprise | Copy and paste | Guide published, tier not stated | Copy free, paste Premium |
| Form submission | Built in | No | No | No | No |
| Accessibility statement | ARIA grid pattern, full keyboard | Follows WCAG and ARIA, tested with JAWS and VoiceOver, no level stated | "Aria tags are used on all elements" | Aims at WCAG 2.1 AA | Aims at AA, WAI-ARIA grid pattern |
| Theming | Your design tokens, light and dark | Theming API, four built-in themes | Five themes plus CSS | CSS variables, built-in themes | MUI theme |

## The alternatives, one by one

### REALM Pro data grid

Pick it when you want a grid that loads with one tag, follows your site's design tokens, submits a selection with a form, and costs one payment for the whole kit (the same licence includes the [scheduler](/pro/), charts, editor and the rest). It suits admin screens, back offices and server-rendered apps where the grid is a large table with sorting, filters and edits, not an analysis tool. REALM Pro is in early access, and REALM itself is in alpha, so weigh that against AG Grid's years in production.

### Tabulator

[Tabulator](https://tabulator.info/) is MIT, free, has no dependencies, and is at 6.7.1 on npm. It has row grouping, tree data, column calculations, clipboard, and XLSX import and export, which covers several AG Grid Enterprise features at no cost. It ships no official framework wrappers; you use it as a plain JavaScript library. Choose it if you want free grouping and Excel export and are happy to style it yourself.

### RevoGrid

[RevoGrid](https://rv-grid.com/) has an MIT core with virtualised rows and columns, editing, range selection and tree data. Its [Pro plans](https://rv-grid.com/guide/licensing) add Excel export, formulas, merged cells and charts (Lite), and pivoting, aggregation and drill-down (Advanced). It is the closest open-core match to AG Grid's split, at a lower annual price.

### MUI X Data Grid

If your app is React and already uses MUI, [MUI X](https://mui.com/x/react-data-grid/) fits in naturally. The MIT edition includes virtualisation, CSV and print export, and a server-side data source. Tree data and master/detail need Pro; grouping, aggregation, pivoting and Excel export need Premium.

### Handsontable

[Handsontable](https://handsontable.com/) is the choice when users expect a spreadsheet: formulas through HyperFormula, merged cells, comments and Excel-style editing. It is commercial and priced by quote, with a free key for non-commercial use only. For a spreadsheet with formulas and XLSX export under a one-time price, REALM Pro also includes [`ui-kit-spreadsheet`](/pro/).

### Syncfusion, DevExtreme and Kendo UI

These suites match AG Grid Enterprise feature for feature: grouping, aggregates, master/detail, Excel and PDF export. They are annual subscriptions: Syncfusion's Grid SDK is $959 per developer per year, DevExtreme Complete is $899.99, and Kendo UI starts at $799. Syncfusion has a free community licence for companies under $1 million in revenue with five or fewer developers. Pick a suite when you want one vendor for grids, charts, schedulers and support contracts.

### TanStack Table

[TanStack Table](https://tanstack.com/table/latest) is MIT and headless: it handles sorting, filtering, grouping and aggregation logic, and you write all the markup and styles. Good for teams that want full control and have time to build the UI and accessibility themselves.

## When AG Grid is still the better choice

- **Analysis inside the grid.** Grouping, aggregation, pivoting and integrated charts are mature in AG Grid Enterprise. REALM Pro's grid has none of them.
- **Server-side row model with grouping.** AG Grid can group and pivot on the server as people expand rows. Our `src` mode loads flat blocks only.
- **Excel round trips.** Excel export with styles, plus range selection and clipboard paste from Excel, are Enterprise features with no match in our grid.
- **Framework-native cells.** In React or Angular, AG Grid renders your framework components as cells and editors.
- **Support and longevity.** A large user base, a long release history and a vendor sales team matter for some buyers.

## Moving a simple AG Grid setup across

Most AG Grid column definitions map directly:

| AG Grid | REALM Pro data grid |
| --- | --- |
| `columnDefs: [{ field, headerName }]` | `columns='[{ "field": …, "header": … }]'` |
| `rowData` | `rows` property |
| `pinned: 'left'` | `"pinned": "left"` |
| `editable: true` | `"editable": true` |
| `onCellValueChanged` | `celledit` event, cancellable |
| `onSortChanged`, `onFilterChanged` | `sortchange`, `filterchange` events |
| `rowSelection` | `selection="single"` or `"multiple"` |
| `exportDataAsCsv()` | Export CSV button |
| Infinite row model with a datasource | `src` with offset and limit |

Grouping, aggregation and value getters have no equivalent. Compute those values on the server or before you set `rows`.

## Frequently asked questions

<ui-accordion type="multiple" class="faq">
  <ui-accordion-item>
    <ui-accordion-trigger>Is AG Grid free?</ui-accordion-trigger>
    <ui-accordion-content>AG Grid Community is MIT and free, including in production. Grouping, pivoting, Excel export, clipboard and the server-side row model need an Enterprise licence.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>What is the best free alternative to AG Grid Enterprise?</ui-accordion-trigger>
    <ui-accordion-content>Tabulator is MIT and includes row grouping, tree data, clipboard and XLSX export. RevoGrid's MIT core is a good choice if you need very large virtualised grids and may later want its paid Pro features.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Does the REALM Pro data grid work with React?</ui-accordion-trigger>
    <ui-accordion-content>Yes, as a custom element. Set <code>columns</code> as an attribute and <code>rows</code> as a property, and listen for its events. It does not render React components inside cells.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Can it load millions of rows?</ui-accordion-trigger>
    <ui-accordion-content>In the browser it stays smooth with 100,000 rows. For larger tables, set <code>src</code> and let your server return blocks of rows with the total count.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Is there a refund if it does not fit?</ui-accordion-trigger>
    <ui-accordion-content>Yes. REALM Pro has a 14-day refund, no questions asked.</ui-accordion-content>
  </ui-accordion-item>
</ui-accordion>

## Next

- [See the data grid with 100,000 rows](/pro/components/ui-kit-data-grid/): the live showcase.
- [Get REALM Pro](/pro/): $149 once for all components, including the data grid, scheduler and charts.
- [Quick start](/docs/quick-start/): REALM in a page in five minutes.
