---
title: Charts
seoTitle: JavaScript charts web component · REALM Pro
description: Pie, donut, radar, heatmap, treemap, sankey, gauge, scatter, bubble, candlestick and mixed charts with zoom, a navigator, export and data tables.
group: Data
nav: Charts
---

# Charts

Pie, donut, radar, heatmap, treemap, sankey, gauge, scatter, bubble, candlestick and mixed charts with zoom, a navigator, export and data tables.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-chart/light-desktop.png" alt="Charts, desktop, light mode" width="960" height="5432" loading="lazy">
    <figcaption>Desktop, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-chart/dark-desktop.png" alt="Charts, desktop, dark mode" width="960" height="5432" loading="lazy">
    <figcaption>Desktop, dark mode</figcaption>
  </figure>
</div>

## What it does

The charts component draws the chart types that the free REALM UI chart leaves out: pie and donut, radar, matrix and calendar heatmaps, treemaps, sankey diagrams, radial gauges, scatter and bubble plots, candlestick and OHLC price charts, and combinations of bars, lines and areas on two y axes. You pick one with the `type` attribute and pass the data as JSON in `data`, as a property from your script, or from a URL in `src`. With no data it shows a realistic sample, so you can see a type before wiring it up.

```html
<ui-kit-chart type="candlestick" label="Share price" format="currency" averages="[20,50]" navigator zoom downloadable></ui-kit-chart>
```

## Price charts and long time series

Candlestick and OHLC charts put volume in a pane under the prices and can overlay moving averages. Range buttons jump to the last month, quarter, half year, year to date or year. The navigator under the chart shows the whole history with a window you can drag, and its two handles are sliders that also work with the arrow keys. With `zoom`, dragging the chart pans, Ctrl or Command with the mouse wheel zooms around the pointer, a pinch zooms on touch screens and a double click resets the view. When a zoomed-out view holds more candles than there are pixels for them, neighbouring days are merged into weekly or monthly candles.

Line and area series with a hundred thousand points stay smooth. Before drawing, the chart keeps only the points that shape the visible part of the line, about two per pixel, so peaks and dips survive while the page draws a few thousand points instead of a hundred thousand. Pass large series as typed arrays and the first render takes tens of milliseconds.

## Reading the chart

Hovering a slice, tile, cell, bar or point opens a tooltip next to the pointer with the exact values. On a time axis the tooltip lists every series at that date, and a crosshair marks the spot. In a donut the centre shows the total, or the hovered slice. The legend turns series and categories on and off. A treemap opens a department when you click it, and Escape takes you back.

## Accessibility

Each chart is an image with a written summary that states the totals, the largest values and the overall trend, so a screen reader user gets the point without exploring. A data table with every value sits behind the chart for assistive technology, and the menu can show it on screen. The chart can be focused with Tab. The arrow keys then move from point to point, Up and Down change series or rows, Home and End jump to the ends, and Enter selects. Each move is announced. Animations are skipped when the system asks for reduced motion.

## Export and theming

The menu downloads the chart as PNG or SVG with its title and legend, and the data as CSV. The `exportImage("png")` method returns the image as a Blob for your own code. Colours come from the `--chart-1` to `--chart-5` tokens of your REALM UI theme, with further shades worked out from them, so the charts follow your brand and dark mode. Text and lines stay the same size at any width, because the chart redraws itself for the space it has instead of scaling a picture.

<div class="pro-shots phone">
  <figure>
    <img src="/pro/components/ui-kit-chart/light-phone.png" alt="Charts, phone, light mode" width="390" height="7460" loading="lazy">
    <figcaption>Phone, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-chart/dark-phone.png" alt="Charts, phone, dark mode" width="390" height="7460" loading="lazy">
    <figcaption>Phone, dark mode</figcaption>
  </figure>
</div>


## Built from REALM UI

Charts is made from free REALM UI components, so it follows your theme and dark mode like the rest of your page:

- [`ui-button`](/components/button/)
- [`ui-dropdown-menu`](/components/dropdown-menu/)
- [`ui-toggle`](/components/toggle/)
- [`ui-toggle-group`](/components/toggle-group/)

## Use it

Charts is part of [REALM Pro](/pro/). Add it from REALM Pro Studio, or copy the file into your project and load it:

```html
<import-element from="/pro/components/ui-kit-chart.html"></import-element>
<ui-kit-chart></ui-kit-chart>
```
