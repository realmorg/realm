---
title: Best JavaScript Gantt chart libraries
description: Eight JavaScript Gantt chart libraries compared on scheduling, critical path, baselines, resources, export, licence and price, with the best use for each.
seoTitle: Best JavaScript Gantt chart libraries in 2026, compared
---

# Best JavaScript Gantt chart libraries

For full project scheduling (resources, working calendars, MS Project files), choose **Bryntum Gantt**, **DHTMLX Gantt PRO** or **SVAR Gantt PRO**. For a free editable Gantt with dependencies, use **DHTMLX Gantt Community** (MIT). For a project timeline with dependencies, critical path and baselines that works in any stack at a one-time price, use **REALM Pro's `ui-kit-gantt`**. If you already license a suite, **Syncfusion** or **DevExtreme** cover it. For a simple read-mostly chart, **Frappe Gantt**; if you already use Highcharts, **Highcharts Gantt**.

Facts below were checked in October 2026 against each vendor's own pricing page, docs, repository or npm package, linked in each section. Where a vendor does not publish something, we leave it out.

## What to compare

Gantt libraries differ most in their scheduling model, so check these first:

- **Scheduling.** Does moving a task move its successors? Are constraints, lags and working time respected?
- **Critical path and baselines.** Often the reason a team needs a Gantt at all, and often a paid feature.
- **Resources.** Assigning people to tasks and showing their load is a separate, larger feature.
- **Calendars.** Whether a five-day task skips weekends and holidays.
- **File exchange.** MS Project import and export, PDF for printouts.
- **Scale.** How many tasks it can scroll through, and whether it renders only what is visible.
- **Licence shape.** Per developer, per project, per year, or once.

## Comparison table

| Library | Licence and price | Critical path | Baselines | Resources | Calendars | Export |
| --- | --- | --- | --- | --- | --- | --- |
| [Bryntum Gantt](https://bryntum.com/store/gantt/) | Perpetual, from $900 to $940 per developer; OEM for SaaS | Yes | Yes | Yes, with histograms | Yes | PDF, PNG, Excel, MS Project |
| [DHTMLX Gantt](https://dhtmlx.com/docs/products/dhtmlxGantt/) | Community MIT. PRO perpetual from $799 | PRO | PRO | PRO | PRO | PDF, PNG, Excel, iCal, MS Project |
| [SVAR Gantt](https://svar.dev/react/gantt/pricing/) | Core MIT. PRO perpetual from $749 | PRO | PRO | PRO | PRO | PRO: PDF, PNG, Excel, MS Project |
| [REALM Pro Gantt](/pro/components/ui-kit-gantt/) | One-time: $149 one developer, $499 up to 10, whole kit | Yes | Yes | No | No, calendar days | PNG, SVG, CSV |
| [Syncfusion Gantt](https://www.syncfusion.com/sales/teamlicense) | $959 per developer per year, or free community licence | Yes | Yes | Yes | Holidays | Excel, PDF, CSV |
| [DevExtreme Gantt](https://js.devexpress.com/Buy/) | From $899.99 per developer, 12-month subscription | Not found | Not found | Yes | Not found | PDF |
| [Highcharts Gantt](https://shop.highcharts.com/) | Per seat: $510 perpetual or $222 a year for internal use | Not found | Not found | Not found | Not found | PNG, JPG, PDF, SVG |
| [Frappe Gantt](https://github.com/frappe/gantt) | MIT | No | No | No | Holidays to skip | Not found |

## The libraries

### 1. Bryntum Gantt: best scheduling engine

[Bryntum Gantt](https://bryntum.com/products/gantt/) 7.3 has a [scheduling engine](https://bryntum.com/products/gantt/docs/guide/Gantt/basics/scheduling) that follows Microsoft Project's logic, with calendars for projects, tasks and resources. Its examples cover four link types with lag, critical paths, baselines, resource histograms and utilisation, undo and redo, MS Project and Primavera import, and PDF, PNG and Excel export, for JavaScript, React, Angular and Vue. Licences are perpetual per developer with a year of updates and source; SaaS and redistribution need an OEM quote.

**Pick it when** the Gantt is the centre of a planning product and you need MS Project-grade behaviour.

### 2. DHTMLX Gantt: best free editable Gantt, with a deep PRO tier

[DHTMLX Gantt](https://dhtmlx.com/docs/products/dhtmlxGantt/) 10.0 has a Community edition under MIT with the grid, timeline, four link types, drag and drop and an export service. [PRO](https://github.com/DHTMLX/gantt) adds auto-scheduling, critical path, resources, baselines, constraints, calendars, undo and more. PRO is perpetual and priced per number of developers and projects, from $799. WAI-ARIA attributes are on by default.

**Pick it when** you want to start free and know which PRO features you may grow into.

### 3. SVAR Gantt: best for Svelte, React and Vue teams

[SVAR Gantt](https://svar.dev/svelte/gantt/) 2.8 has an MIT core with editing, drag and drop and time scales. PRO adds auto-scheduling, critical path, baselines, calendars, resources, MS Project, undo, split tasks and grouping, and SVAR shows a 100,000-task demo. PRO is perpetual from $749; SaaS needs the Application plan or higher.

**Pick it when** you build in Svelte, React or Vue and want DHTMLX-level features with a newer API.

### 4. REALM Pro Gantt: best one-time price for project timelines

[`ui-kit-gantt`](/pro/components/ui-kit-gantt/) is part of [REALM Pro](/pro/). It has a task tree with summary tasks that roll up dates and weighted progress, milestones, four link types with lag created by dragging, loop detection, and automatic pushing of successors when a task moves. Critical path and baselines are built in, with day, week, month and quarter zoom. Only visible rows, bars and arrows are drawn, and it stays smooth with 5,000 tasks. The task list is an ARIA tree grid with full keyboard editing and announcements. Changes fire cancellable events, and the plan exports to PNG, SVG or CSV.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-gantt/light-desktop.png" alt="REALM Pro gantt chart component, desktop, light mode" width="960" height="708" loading="lazy">
    <figcaption>REALM Pro gantt chart. <a href="/pro/components/ui-kit-gantt/">See it in dark mode and on a phone</a>.</figcaption>
  </figure>
</div>

It has no resources, working calendars, constraints, undo, MS Project exchange, or PDF and Excel export. REALM Pro is in early access.

**Pick it when** you need dependencies, critical path and baselines for delivery plans, roadmaps or client projects, in any stack, styled by your design tokens, and want to pay once for the Gantt, scheduler, data grid and the rest of the kit.

### 5. Syncfusion Gantt: best inside a component suite

[Syncfusion's Gantt](https://www.syncfusion.com/javascript-ui-controls/js-gantt-chart) covers four link types with lag, auto and manual scheduling, critical path, baselines, resources, holidays, undo and redo, virtualisation, and Excel, PDF and CSV export, for JavaScript, React, Angular, Vue and Blazor. It is $959 per developer per year, or free under the community licence for small companies. Its [accessibility page](https://ej2.syncfusion.com/documentation/gantt/accessibility) rates WCAG 2.2 support as "Intermediate".

**Pick it when** you already use Syncfusion or qualify for its community licence.

### 6. DevExtreme Gantt: best if you already pay for DevExpress

[DevExtreme's Gantt](https://js.devexpress.com/jQuery/Documentation/Guide/UI_Components/Gantt/Overview/) has four link types, resources, sorting and filtering, zoom, undo and redo in the toolbar, and PDF export, for Angular, React, Vue and jQuery. It comes with DevExtreme's 12-month subscription. We did not find critical path or baselines in its docs.

**Pick it when** your app is already built on DevExtreme.

### 7. Highcharts Gantt: best for charts-first dashboards

[Highcharts Gantt](https://www.highcharts.com/products/gantt/) draws dependencies and milestones with drag and drop, plus image and PDF export and an accessibility module, on top of Highcharts. A perpetual internal-use seat for Core plus Gantt is $510; SaaS seats cost more.

**Pick it when** your dashboards already use Highcharts and the Gantt is a view, not an editor.

### 8. Frappe Gantt: best minimal free chart

[Frappe Gantt](https://github.com/frappe/gantt) 1.2 is MIT and small. It draws bars, progress and dependency arrows, supports drag and resize, view modes and holidays.

**Pick it when** you need a simple, read-mostly timeline.

## Which one should you choose?

| Your situation | Choose |
| --- | --- |
| MS Project-grade scheduling with resources | Bryntum Gantt |
| Start free, upgrade later | DHTMLX Gantt |
| Svelte, React or Vue with PRO features | SVAR Gantt |
| Critical path and baselines, any stack, paid once | REALM Pro Gantt |
| Already on a component suite | Syncfusion or DevExtreme |
| Gantt view inside Highcharts dashboards | Highcharts Gantt |
| Simple free timeline | Frappe Gantt |

## Frequently asked questions

<ui-accordion type="multiple" class="faq">
  <ui-accordion-item>
    <ui-accordion-trigger>What is the best free JavaScript Gantt chart?</ui-accordion-trigger>
    <ui-accordion-content>DHTMLX Gantt Community (MIT) is the most complete free option for editing with dependencies. SVAR Gantt's MIT core suits Svelte, React and Vue. Frappe Gantt is the simplest.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Which Gantt libraries show a critical path?</ui-accordion-trigger>
    <ui-accordion-content>Bryntum, DHTMLX PRO, SVAR PRO, Syncfusion and REALM Pro.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Do I need resource management?</ui-accordion-trigger>
    <ui-accordion-content>Only if the chart decides who does the work and must show when people are overloaded. If tasks just need owners shown as text, a Gantt without resources is enough, and for booking people or rooms by the hour a scheduler fits better.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Is there a Gantt chart web component?</ui-accordion-trigger>
    <ui-accordion-content>REALM Pro's <code>ui-kit-gantt</code> is a custom element that works without a framework or build step.</ui-accordion-content>
  </ui-accordion-item>
</ui-accordion>

## Next

- [Try the REALM Pro Gantt chart](/pro/components/ui-kit-gantt/) with 5,000 tasks.
- [Get REALM Pro](/pro/): the Gantt chart, [scheduler](/pro/components/ui-kit-scheduler/), data grid and more for $149, once.
- [Quick start](/docs/quick-start/): REALM in a page in five minutes.
