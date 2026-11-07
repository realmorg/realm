---
title: Highcharts alternatives
description: Looking for a Highcharts alternative? Per-seat licences compared with REALM Pro charts, ECharts, Chart.js, amCharts and ApexCharts. Checked October 2026.
seoTitle: Highcharts alternative with candlestick, sankey and treemap
---

# Highcharts alternatives

If you need maps, a full stock charting toolkit with technical indicators, sonification, PDF export or a support contract, [Highcharts](https://www.highcharts.com/) is hard to beat and worth its price. If you need the common business and finance charts (donut, heatmap, treemap, sankey, gauge, scatter, candlestick with volume and a navigator) with keyboard access and a data table built in, and you would rather pay once than per developer seat each year, use `ui-kit-chart` from [REALM Pro](/pro/). If you want free and open source, **Apache ECharts** covers the most chart types and **Chart.js** is the simplest.

Facts about Highcharts were checked in October 2026 against the [licence page](https://shop.highcharts.com/license), the [shop pricing](https://shop.highcharts.com/pricing), the [accessibility module docs](https://www.highcharts.com/docs/accessibility/accessibility-module), the [export docs](https://www.highcharts.com/docs/export-module/export-module-overview), the [integrations page](https://www.highcharts.com/integrations/) and the [npm registry](https://www.npmjs.com/package/highcharts). The current release is 13.1.1, published 20 September 2026.

## Why people look for an alternative

- **Commercial use always needs a licence.** Highcharts is free for personal, non-commercial projects and for education. Company, client and internal work needs a commercial licence, and any use on a public website needs a SaaS licence.
- **It is priced per developer seat.** The shop sells Internal and SaaS licences, each annual or perpetual. For a SaaS product, Highcharts Core is $366 per seat per year, or $839 per seat perpetual. Adding Stock, Maps and Gantt takes that to $876 a year or $2,010 perpetual per seat. A team of five pays five times.
- **Annual licences stop.** The shop's FAQ says you must stop using Highcharts when an annual subscription ends. Perpetual licences avoid that, at a higher price.
- **Features live in modules.** Heatmaps, sankey and treemaps need their own module files, accessibility is a separate script, and PDF export needs extra libraries or the export server. None of this is hard, but it adds setup.

## What ui-kit-chart does instead

`ui-kit-chart` draws the chart types the free [REALM UI chart](/components/chart/) leaves out. Pick a type with the `type` attribute and pass data as JSON in `data`, as a property, or from a URL in `src`.

```html
<ui-kit-chart
  type="candlestick"
  label="Share price"
  format="currency"
  averages="[20,50]"
  navigator
  zoom
  downloadable
  src="/api/prices/acme">
</ui-kit-chart>
```

What it covers:

- **Thirteen types.** Pie, donut, radar, matrix heatmap, calendar heatmap, treemap, sankey, radial gauge, scatter, bubble, candlestick, OHLC, and combinations of bars, lines and areas on two y axes. Bar, line and area charts on their own are in the free `ui-chart`.
- **Price charts.** Candlestick and OHLC show volume in a pane below the prices and can overlay moving averages. Range buttons jump to the last month, quarter, half year, year to date or year. The navigator shows the full history with a window you drag, and its handles work with the arrow keys. When a zoomed-out view has more candles than pixels, days merge into weekly or monthly candles.
- **Zoom and large data.** With `zoom`, drag to pan, Ctrl or Command with the wheel to zoom, pinch on touch screens, double click to reset. Line and area series with 100,000 points stay smooth because the chart keeps only the points that shape the visible line, about two per pixel.
- **Accessibility built in.** Each chart is an image with a written summary of totals, largest values and trend, and a data table with all values sits behind it for assistive technology. Tab focuses the chart, the arrow keys move from point to point, Up and Down change series, and each move is announced. Animations are skipped for people who ask for reduced motion.
- **Export and theming.** The menu downloads PNG or SVG with title and legend, and the data as CSV. `exportImage("png")` returns a Blob for your own code. Colours come from the `--chart-1` to `--chart-5` theme tokens, so charts follow your brand and dark mode. It draws SVG and redraws for its width, so text stays the same size on a phone.

## Highcharts and ui-kit-chart side by side

| | Highcharts 13 | ui-kit-chart (REALM Pro) |
| --- | --- | --- |
| Licence | Commercial, free for non-commercial and education use | Commercial, part of REALM Pro |
| Price model | Per developer seat. SaaS Core $366 a year or $839 perpetual per seat. Stock, Maps and Gantt cost extra | $149 once for one developer, $499 once for up to 10 developers, for the whole kit |
| Chart types | Very wide: line, bar, area, pie, heatmap, sankey, treemap, organization and many more, plus Stock, Maps and Gantt products | Pie, donut, radar, heatmap, calendar heatmap, treemap, sankey, gauge, scatter, bubble, candlestick, OHLC, combo. Bar, line and area in the free `ui-chart` |
| Maps | Highcharts Maps | Not included |
| Stock tools | Highcharts Stock, with a navigator, 40+ technical indicators and annotation tools | Candlestick and OHLC with volume, moving averages, range buttons and a navigator |
| Rendering | SVG | SVG |
| Accessibility | Accessibility module (separate script): keyboard navigation, ARIA, follows WCAG 2.2. Sonification module | Built in: written summary, hidden data table, keyboard navigation, announcements, reduced motion |
| Export | PNG, JPEG, SVG, PDF, CSV, XLS, HTML table | PNG, SVG, CSV, and a Blob from `exportImage()` |
| Frameworks | Official React, Angular, Vue, Svelte wrappers, plus Python and Flutter | A standard custom element, used in plain HTML or inside React, Vue or Angular |
| Theming | Options objects and CSS styled mode | REALM UI theme tokens, light and dark |
| Dependencies | None at runtime. PDF export uses optional `jspdf` and `svg2pdf.js` | The REALM runtime (about 16 KB gzipped) and a few REALM UI parts. The component file is about 36 KB gzipped as shipped |

## Where Highcharts is the better choice

- **Maps.** `ui-kit-chart` has no geographic maps. Highcharts Maps, amCharts or ECharts do.
- **Serious stock charting.** [Highcharts Stock](https://www.highcharts.com/products/stock/) has more than 40 technical indicators, such as MACD, RSI and Bollinger Bands, and Stock Tools for annotations. `ui-kit-chart` covers the price chart most apps need, not a trading terminal.
- **Breadth.** Highcharts has many more series types, plus Dashboards and Grid products. If your product is the chart, that range matters.
- **Sonification and PDF.** Highcharts can play a chart as sound and export PDF. `ui-kit-chart` does neither.
- **Other platforms and support.** Highcharts has wrappers for Python and Flutter and sells support plans. REALM Pro is web only and in early access.
- **Older browsers.** REALM needs Chrome or Edge 125, Firefox 126 or Safari 17.4 and newer. See [Browser support](/docs/browser-support/).

## Other Highcharts alternatives

| Library | Licence and price model | Best for |
| --- | --- | --- |
| [Apache ECharts](https://echarts.apache.org/) | Apache 2.0, free | The widest free set of types, including sankey, candlestick, maps and treemaps, on canvas or SVG |
| [Chart.js](https://www.chartjs.org/) | MIT, free | Simple canvas charts (bar, line, pie, radar, scatter) with a small API. Screen reader access is up to you |
| [amCharts 5](https://www.amcharts.com/) | Free with the amCharts logo shown, or paid per seat, annual or perpetual, to remove it | Maps, stock and many types, with official React, Vue, Angular and Svelte support |
| [ApexCharts](https://apexcharts.com/) | Free Community licence under $2M annual revenue or funding, paid Pro and Premium per developer per year above it | Attractive SVG charts with keyboard support on by default. No longer MIT since version 5.2 |
| [Plotly.js](https://plotly.com/javascript/) | MIT, free | Scientific charts and 3D, mostly SVG with WebGL for 3D |

ApexCharts is worth a note: older articles call it MIT, but from version 5.2.0 its licence changed. Read the [licence page](https://apexcharts.com/license/) before you rely on the free tier.

## Moving from Highcharts

| Highcharts | ui-kit-chart |
| --- | --- |
| `Highcharts.chart("container", options)` | `<ui-kit-chart type="…" data='…'>` |
| `chart.type: "pie"` with `innerSize` | `type="donut"` |
| `modules/heatmap.js`, `modules/sankey.js`, `modules/treemap.js` | Nothing to load; set `type` |
| `Highcharts.stockChart` with `navigator` | `type="candlestick"` with `navigator` and `zoom` |
| `rangeSelector` | Built-in range buttons |
| SMA indicator | `averages="[20,50]"` |
| `accessibility.js` | Built in |
| `exporting` module | `downloadable`, or `exportImage("png")` |
| `colors` option | `--chart-1` to `--chart-5` in your theme |

## Frequently asked questions

<ui-accordion type="multiple" class="faq">
  <ui-accordion-item>
    <ui-accordion-trigger>Is Highcharts free for commercial use?</ui-accordion-trigger>
    <ui-accordion-content>No. Highcharts is free for personal, non-commercial projects and for students and teachers. Work for a company, a client or an internal tool needs a commercial licence, and public websites need a SaaS licence.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>What is the best free alternative to Highcharts?</ui-accordion-trigger>
    <ui-accordion-content>Apache ECharts covers the most chart types under the Apache 2.0 licence. Chart.js is simpler and MIT, but its canvas output is not readable by screen readers without your own work.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Does ui-kit-chart draw candlestick charts?</ui-accordion-trigger>
    <ui-accordion-content>Yes, candlestick and OHLC, with a volume pane, moving averages, range buttons, a draggable navigator, zoom and pan, and automatic merging into weekly or monthly candles when zoomed out.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Can screen reader users read the charts?</ui-accordion-trigger>
    <ui-accordion-content>Yes. Each chart has a written summary and a data table behind it for assistive technology, and keyboard users can move from point to point with each value announced.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Is REALM Pro a subscription?</ui-accordion-trigger>
    <ui-accordion-content>No. Personal is $149 and Team is $499, paid once, for unlimited projects including SaaS and client work, with 1.x updates and a 14-day refund.</ui-accordion-content>
  </ui-accordion-item>
</ui-accordion>

## Next

- [Charts](/pro/components/ui-kit-chart/): screenshots and the full feature list for `ui-kit-chart`.
- [REALM Pro](/pro/): charts plus the data grid, scheduler, editor and more, for one payment.
- [Chart](/components/chart/): the free bar, line and area chart in REALM UI.
