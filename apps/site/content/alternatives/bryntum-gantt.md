---
title: Bryntum Gantt alternatives
description: Alternatives to Bryntum Gantt: when its scheduling engine is worth it, and when REALM Pro, DHTMLX, SVAR or Frappe Gantt is the better fit. Prices checked.
seoTitle: Bryntum Gantt alternatives, compared on features and price
---

# Bryntum Gantt alternatives

If your plans depend on resources, working-time calendars, MS Project files or constraint-based scheduling, Bryntum Gantt is hard to beat, and the realistic alternatives are DHTMLX Gantt PRO and SVAR Gantt PRO, which cover much of the same ground under perpetual licences. If you need a fast, accessible project timeline with dependencies, critical path and baselines, without the resource and calendar machinery, REALM Pro's [`ui-kit-gantt`](/pro/components/ui-kit-gantt/) costs a one-time $149 for the whole kit and works in any stack. For a simple free chart, use [Frappe Gantt](https://github.com/frappe/gantt).

Facts about Bryntum and the other products were checked in October 2026 against each vendor's own site, docs and npm package, linked below.

## What Bryntum Gantt costs and includes

[Bryntum Gantt](https://bryntum.com/products/gantt/) 7.3 is a commercial component for JavaScript, React, Angular and Vue. The [store](https://bryntum.com/store/gantt/) lists the Small Team licence from $940 per developer for three or more developers, and the Large Team licence from $900 per developer for ten. Prices for one or two developers are higher and are not shown on the page. These end-user licences are perpetual, include source code and a year of upgrades and support, and the support subscription renews at the original price unless cancelled. According to [Bryntum's licensing page](https://bryntum.com/licensing/), they cover apps whose end users do not pay for access. SaaS, commercial resale and redistribution need an OEM licence, priced by quote.

What that buys is a full project scheduling engine. The [scheduling guide](https://bryntum.com/products/gantt/docs/guide/Gantt/basics/scheduling) describes it as matching Microsoft Project's logic, with calendars for projects, tasks and resources. The [examples](https://bryntum.com/products/gantt/examples/) show all four dependency types with lag, critical paths, baselines, resource assignment, resource histograms and utilisation views, undo and redo, MS Project import and export, and export to PDF, PNG and Excel. We found no Gantt-specific accessibility statement or WCAG level on Bryntum's site.

People look elsewhere when:

- **The price is per developer and the app is customer-facing.** A SaaS product needs the OEM licence and a sales quote.
- **They use a fraction of the engine.** A team showing a delivery plan with dependencies does not need resource histograms or MS Project round trips.
- **They want something lighter to theme.** Bryntum has its own theme system; matching a design system takes work.

## What REALM Pro's Gantt chart does

[`ui-kit-gantt`](/pro/components/ui-kit-gantt/) is a custom element in [REALM Pro](/pro/).

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-gantt/light-desktop.png" alt="REALM Pro gantt chart component, desktop, light mode" width="960" height="708" loading="lazy">
    <figcaption>REALM Pro gantt chart. <a href="/pro/components/ui-kit-gantt/">See it in dark mode and on a phone</a>.</figcaption>
  </figure>
</div>

```html
<ui-kit-gantt label="Website relaunch" zoom="week" baselines critical></ui-kit-gantt>
```

- **Task tree.** Summary tasks take their dates from their children, with progress weighted by length. Milestones show as diamonds. Columns for WBS number, name, start, end, duration and progress.
- **Large plans.** Only visible rows and bars are built, and weekend shading, scale labels and arrows are drawn for the visible stretch of time. It stays smooth with 5,000 tasks.
- **Dependencies.** Finish to start, start to start, finish to finish and start to finish, each with a lag in days. Drag from a bar's start or end circle to link. Loops and links to a task's own summary are refused.
- **Scheduling.** Moving a task pushes its successors later when a link would break, and theirs in turn. `manual-scheduling` turns this off.
- **Editing.** Drag to move, drag an end to resize, drag the triangle to set progress, with a tooltip showing the new dates. Escape puts it back.
- **Keyboard.** The task list is an ARIA tree grid. Rename, move by a day, change length and progress, link two tasks, insert and delete, all from the keyboard, with each change announced.
- **Views.** Day, week, month and quarter scales, a today line, critical path highlighting, and baselines that turn red when a task now finishes later than planned.
- **Your code decides.** `taskchange`, `taskadd`, `taskremove`, `dependencyadd` and `dependencyremove` are cancellable.
- **Export.** PNG or SVG with your theme colours, or CSV with outline numbers, dates, durations, progress, predecessors as `1.2FS+2`, baselines and critical flags.

The file is 98 KB of source, about 24 KB gzipped, plus the REALM runtime and the REALM UI parts it uses.

What it does not have: resources and assignments, working-time calendars and holidays (durations are calendar days), constraints, undo and redo, MS Project import or export, and PDF or Excel export.

## Side by side

Checked October 2026 against [Bryntum's store](https://bryntum.com/store/gantt/), [DHTMLX Gantt](https://dhtmlx.com/docs/products/dhtmlxGantt/), [SVAR Gantt pricing](https://svar.dev/react/gantt/pricing/), [Syncfusion pricing](https://www.syncfusion.com/sales/teamlicense) and [Frappe Gantt](https://github.com/frappe/gantt).

| | REALM Pro Gantt | Bryntum Gantt | DHTMLX Gantt PRO | SVAR Gantt PRO | Syncfusion Gantt | Frappe Gantt |
| --- | --- | --- | --- | --- | --- | --- |
| Licence | Commercial, one-time | Perpetual per developer, yearly support renewal; OEM for SaaS | Perpetual. Community edition is MIT | Perpetual. Core is MIT | Yearly subscription, or free community licence | MIT |
| Price | $149 one developer, $499 up to 10 (early access), whole kit | From $900 to $940 per developer | Individual $799, Commercial $1,599 | Developer $749, Application $1,899 | $959 per developer per year | Free |
| Frameworks | Any, as a custom element | JS, React, Angular, Vue | JS, React, Angular, Vue, Svelte | Svelte, React, Vue | JS, React, Angular, Vue, Blazor | Plain JS |
| Four link types with lag | Yes | Yes | Yes | PRO | Yes | Not stated |
| Auto-scheduling | Pushes successors forward | Full engine | PRO | PRO | Auto and manual modes | No |
| Critical path | Yes | Yes | PRO | PRO | Yes | No |
| Baselines | Yes | Yes | PRO | PRO | Yes | No |
| Resources | No | Yes, with histograms | PRO | PRO | Yes | No |
| Working calendars | No | Yes | PRO | PRO | Holidays | Holidays to skip |
| Undo and redo | No | Yes | PRO | PRO | Yes | No |
| MS Project | No | Import and export | Import and export | PRO | Not found | No |
| Export | PNG, SVG, CSV | PDF, PNG, Excel | PDF, PNG, Excel, iCal | PRO: PDF, PNG, Excel | Excel, PDF, CSV | Not found |
| Accessibility statement | ARIA tree grid, full keyboard editing | None found for Gantt | WAI-ARIA on by default | Not found | WCAG 2.2 "Intermediate" | Not found |

## The alternatives

### REALM Pro Gantt chart

Pick it for delivery plans, roadmaps, rollouts and client project views where dependencies, a critical path and baselines matter, but resource levelling does not. It suits server-rendered apps and teams not using React, and it follows your design tokens in light and dark mode. The licence also covers the [scheduler](/pro/components/ui-kit-scheduler/) for people and rooms, the [data grid](/pro/components/ui-kit-data-grid/) and the rest of the kit. REALM Pro is in early access and REALM is in alpha.

### DHTMLX Gantt

[DHTMLX Gantt](https://dhtmlx.com/docs/products/dhtmlxGantt/) 10.0 has a free Community edition under MIT with the grid, timeline, four link types, drag and drop and an export service. Its [README](https://github.com/DHTMLX/gantt) lists what PRO adds: auto-scheduling, critical path, resources, baselines, constraints, working-time calendars, undo and redo, and more. PRO is perpetual, from $799 for one developer and one project. It is the closest feature match to Bryntum.

### SVAR Gantt

[SVAR Gantt](https://svar.dev/svelte/gantt/) 2.8 has an MIT core for Svelte, React and Vue with drag and drop, editing and time scales. PRO adds auto-scheduling, critical path, baselines, calendars, resources, MS Project import and export, and undo. PRO is perpetual from $749 for one developer and one project; SaaS starts with the $1,899 Application plan.

### Syncfusion Gantt

[Syncfusion's Gantt](https://www.syncfusion.com/javascript-ui-controls/js-gantt-chart) covers four link types, auto and manual scheduling, critical path, baselines, resources, holidays, undo and redo, and Excel, PDF and CSV export, at $959 per developer per year. Small companies can use the free community licence. Its [accessibility page](https://ej2.syncfusion.com/documentation/gantt/accessibility) rates WCAG 2.2 support as "Intermediate".

### Highcharts Gantt

[Highcharts Gantt](https://www.highcharts.com/products/gantt/) suits teams that already use Highcharts. It draws dependencies and milestones with drag and drop and image or PDF export. A perpetual internal-use seat for Core plus Gantt is $510 on the [Highcharts shop](https://shop.highcharts.com/); SaaS use costs more.

### Frappe Gantt

[Frappe Gantt](https://github.com/frappe/gantt) 1.2 is MIT, small, and does drag, resize, progress, dependency arrows and holidays. It has no critical path, baselines, resources or export. Use it for a read-mostly view of a short plan.

## When Bryntum Gantt is the better choice

- **Resource management.** Assignments, histograms and utilisation views. Our Gantt has no resources.
- **Real calendars.** Working hours, holidays and per-resource calendars change how durations are counted. Ours counts calendar days.
- **MS Project and Primavera users.** Import and export of their files.
- **PDF output** for printed plans and reports.
- **Undo and redo** across complex edits.
- **Framework depth.** First-party React, Angular and Vue wrappers, and Salesforce support.

## Frequently asked questions

<ui-accordion type="multiple" class="faq">
  <ui-accordion-item>
    <ui-accordion-trigger>Is Bryntum Gantt free?</ui-accordion-trigger>
    <ui-accordion-content>No. Bryntum offers a trial on npm. End-user licences are perpetual per developer, and SaaS or redistribution needs an OEM licence.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>What is the best free alternative to Bryntum Gantt?</ui-accordion-trigger>
    <ui-accordion-content>DHTMLX Gantt's MIT Community edition gives you an editable Gantt with all four link types. SVAR Gantt's MIT core is a good option for Svelte, React and Vue. Frappe Gantt is the simplest.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Can the REALM Pro Gantt chart save changes to my server?</ui-accordion-trigger>
    <ui-accordion-content>Yes. Listen for <code>taskchange</code> and the other events and send the change to your API. Each event fires before the change is kept, so call <code>preventDefault()</code> to refuse one your rules do not allow.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Does it support milestones and summary tasks?</ui-accordion-trigger>
    <ui-accordion-content>Yes. Milestones are tasks with no length. Summary tasks take their dates and progress from the tasks inside them, and dragging a summary moves its children.</ui-accordion-content>
  </ui-accordion-item>
</ui-accordion>

## Next

- [See the Gantt chart with 5,000 tasks](/pro/components/ui-kit-gantt/).
- [Get REALM Pro](/pro/): the Gantt chart, scheduler, data grid and more for $149, once, with a 14-day refund.
- [Quick start](/docs/quick-start/): REALM in a page in five minutes.
