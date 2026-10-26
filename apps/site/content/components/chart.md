---
title: Chart
description: A small SVG bar, line or area chart drawn from a list of data objects, with one or more series.
group: Display
order: 205
nav: Chart
---

# Chart

`ui-chart` draws a responsive SVG chart from `data`, a list of plain objects. `x` names the field used for the
category labels along the bottom, and `y` names one or more numeric fields to plot. It supports bars, lines and
filled areas, a value grid on rounded steps (such as 0, 10K, 20K, 30K), and a legend when there is more than one
series. Series colours come from the theme tokens `--chart-1` to `--chart-5`. The chart is as wide as its container
and redraws when that width changes, so labels and lines keep the same size on a phone and on a wide screen.

```html live
<ui-chart x="month" y="desktop" label="Desktop visitors per month"
  data='[{"month":"Jan","desktop":186},{"month":"Feb","desktop":305},{"month":"Mar","desktop":237},{"month":"Apr","desktop":73},{"month":"May","desktop":209},{"month":"Jun","desktop":214}]'>
</ui-chart>
```

## Examples

### Several series

List several fields in `y`, separated by commas. Bars are grouped per category and a legend appears under the
chart.

```html live
<ui-chart x="month" y="desktop,mobile" label="Visitors per month by device"
  data='[{"month":"Jan","desktop":186,"mobile":80},{"month":"Feb","desktop":305,"mobile":200},{"month":"Mar","desktop":237,"mobile":120},{"month":"Apr","desktop":73,"mobile":190},{"month":"May","desktop":209,"mobile":130},{"month":"Jun","desktop":214,"mobile":140}]'>
</ui-chart>
```

### Line

```html live
<ui-chart type="line" x="month" y="desktop,mobile" label="Visitors per month by device"
  data='[{"month":"Jan","desktop":186,"mobile":80},{"month":"Feb","desktop":305,"mobile":200},{"month":"Mar","desktop":237,"mobile":120},{"month":"Apr","desktop":73,"mobile":190},{"month":"May","desktop":209,"mobile":130},{"month":"Jun","desktop":214,"mobile":140}]'>
</ui-chart>
```

### Area

`type="area"` draws the line with a translucent fill underneath.

```html live
<ui-chart type="area" x="month" y="desktop" label="Desktop visitors per month"
  data='[{"month":"Jan","desktop":186},{"month":"Feb","desktop":305},{"month":"Mar","desktop":237},{"month":"Apr","desktop":73},{"month":"May","desktop":209},{"month":"Jun","desktop":214}]'>
</ui-chart>
```

### Height

`height` sets the height of the chart in pixels. The width always follows the container.

```html live
<ui-chart height="120" label="Weekly sales"
  data='[{"label":"Mon","value":12},{"label":"Tue","value":18},{"label":"Wed","value":9},{"label":"Thu","value":22},{"label":"Fri","value":30}]'>
</ui-chart>
```

The last example also relies on the defaults `x="label"` and `y="value"`.

### Sparkline

`variant="sparkline"` draws only the series, edge to edge, with no axes, grid, labels, legend or padding. Use it
with a small `height` inside a stat card.

```html live
<ui-card>
  <ui-card-header>
    <ui-card-description>Revenue</ui-card-description>
    <ui-card-title>$45,231</ui-card-title>
  </ui-card-header>
  <ui-card-content>
    <ui-chart variant="sparkline" type="area" height="48" y="revenue" label="Revenue over the last 7 days"
      data='[{"revenue":3200},{"revenue":4100},{"revenue":3800},{"revenue":5200},{"revenue":4900},{"revenue":6100},{"revenue":6800}]'>
    </ui-chart>
  </ui-card-content>
</ui-card>
```

### Data from component state

Bind `data`, `y` or `type` from state with `_data`, `_y` and `_type`. The chart redraws when the state changes.
This card switches the series and the chart type with lookup tables, and generates new data on demand.

```html live
<custom-element name="chart-visitors-demo">
  <script type="realm">
    const SERIES = { all: "desktop,mobile", desktop: "desktop", mobile: "mobile" };
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    const visitors = useState({
      series: "all",
      type: "bar",
      months: MONTHS.map((month, index) => ({ month, desktop: 120 + index * 30, mobile: 200 - index * 20 })),
      get y() {
        return SERIES[this.series];
      },
    });

    function pickSeries(event) {
      visitors.series = event.target.value;
    }

    function pickType(event) {
      visitors.type = event.target.value;
    }

    function shuffle() {
      visitors.months = MONTHS.map((month) => ({
        month,
        desktop: Math.round(50 + Math.random() * 300),
        mobile: Math.round(50 + Math.random() * 300),
      }));
    }
  </script>
  <style type="realm">
    :host {
      display: block;
      width: 100%;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: calc(var(--spacing) * 2);
      margin-bottom: calc(var(--spacing) * 4);
    }
  </style>
  <ui-card>
    <ui-card-header>
      <ui-card-title>Visitors</ui-card-title>
      <ui-card-description>January to June</ui-card-description>
      <ui-card-action><ui-button size="sm" variant="outline" onclick="shuffle()">New data</ui-button></ui-card-action>
    </ui-card-header>
    <ui-card-content>
      <div class="controls">
        <select aria-label="Series" onchange="pickSeries(event)">
          <option value="all">Desktop and mobile</option>
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
        </select>
        <select aria-label="Chart type" onchange="pickType(event)">
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="area">Area</option>
        </select>
      </div>
      <ui-chart x="month" _y="#visitors.y" _type="#visitors.type" _data="#visitors.months" label="Visitors per month"></ui-chart>
    </ui-card-content>
  </ui-card>
</custom-element>
<chart-visitors-demo></chart-visitors-demo>
```

### Custom colours

Each series uses `var(--chart-1)`, `var(--chart-2)` and so on, cycling after five. Override the tokens on a
wrapping element to recolour the chart.

```html live
<div class="demo-full" style="--chart-1: var(--primary); --chart-2: var(--muted-foreground)">
<ui-chart x="quarter" y="revenue,costs" label="Revenue and costs per quarter"
  data='[{"quarter":"Q1","revenue":420,"costs":310},{"quarter":"Q2","revenue":510,"costs":330},{"quarter":"Q3","revenue":480,"costs":360},{"quarter":"Q4","revenue":620,"costs":390}]'>
</ui-chart>
</div>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `"bar"` \| `"line"` \| `"area"` | `"bar"` | How the series are drawn. |
| `data` | array of objects | `[]` | The data points, one object per category. Accepts JSON in the attribute, or an array through the `data` property or a `_data` binding. |
| `x` | string | `"label"` | Field used for the category labels on the horizontal axis. |
| `y` | string | `"value"` | Field, or comma-separated fields, plotted as series. Non-numeric values count as `0`. |
| `variant` | `"default"` \| `"sparkline"` | `"default"` | `sparkline` hides the axes, grid, labels and legend and drops the padding. Lines and areas then run edge to edge. |
| `height` | number | `240` | Height of the chart in pixels, minimum `16`. The width follows the container. |
| `label` | string | `"Chart"` | Accessible name of the chart image. |

### Parts

`ui-chart` has no child parts and no slots. It draws everything from its attributes.

### CSS parts

| Part | Description |
| --- | --- |
| `svg` | The chart `<svg>`. |
| `legend` | The legend under the chart. It has content only when `y` names more than one series. |

### CSS custom properties

| Property | Description |
| --- | --- |
| `--chart-1` … `--chart-5` | Series colours, in order. Defined in `theme.css`. Override them on an ancestor, such as a wrapping `<div>`. |

The axis labels use the element's `color` (muted foreground by default) and the grid lines use `var(--border)`.
Value labels are shortened with the browser's compact number format, so 20000 reads as "20K".

### Accessibility

The SVG has `role="img"` and its accessible name comes from `label`, so describe what the chart shows. Each bar
has a `<title>` with its category, series and value, shown as a native tooltip on hover. The data is not
available as a table to screen readers. When the numbers matter, put a `ui-table` with the same data next to the
chart.
