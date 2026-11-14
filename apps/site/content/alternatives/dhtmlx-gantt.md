---
title: DHTMLX Gantt alternatives
description: DHTMLX Gantt alternatives: which PRO features you can get elsewhere, from REALM Pro's one-time Gantt to Bryntum, SVAR and Syncfusion. Prices checked.
seoTitle: DHTMLX Gantt alternatives, Community vs PRO and other options
---

# DHTMLX Gantt alternatives

Start by checking which edition you need. DHTMLX Gantt's Community edition is now MIT, so if an editable chart with dependencies is enough, it costs nothing and you may not need an alternative. The question usually comes up when a project needs a PRO feature such as critical path, baselines or auto-scheduling. For those three, plus an accessible keyboard-driven task tree and a design-token theme, REALM Pro's [`ui-kit-gantt`](/pro/components/ui-kit-gantt/) costs $149 once for the whole kit. If you need resources, working calendars or MS Project files, the real alternatives are [Bryntum Gantt](https://bryntum.com/products/gantt/) and [SVAR Gantt PRO](https://svar.dev/svelte/gantt/), or DHTMLX PRO itself.

Facts about DHTMLX and the other products were checked in October 2026 against each vendor's own site, docs, repository and npm package, linked below.

## DHTMLX Gantt editions in 2026

[DHTMLX Gantt](https://dhtmlx.com/docs/products/dhtmlxGantt/) 10.0 ships a new scheduling engine. The free edition is no longer GPL: the [repository](https://github.com/DHTMLX/gantt) and the npm package both say MIT, and the Community edition includes the grid, the timeline, all four dependency types, drag and drop, the lightbox editor, and export through DHTMLX's export service.

The README lists what stays in PRO:

- auto-scheduling, critical path and slack
- resource management
- baselines and deadlines, constraints
- split tasks, rollups, WBS codes and grouping
- dynamic loading
- undo and redo, multi-task selection
- markers and the today line, unscheduled tasks
- working-time calendars

PRO is a perpetual licence with a year of updates. On the [product page](https://dhtmlx.com/docs/products/dhtmlxGantt/#licensing), Individual is $799 for one developer and one project, Commercial $1,599 for five developers and one project, Enterprise $2,999 for 20 developers and five projects, and Ultimate $5,999. SaaS use is available on Commercial and Enterprise for an extra fee. DHTMLX supports JavaScript, React, Angular, Vue, Svelte and Salesforce, and its [accessibility guide](https://docs.dhtmlx.com/gantt/guides/accessibility/) says WAI-ARIA attributes are on by default, with keyboard navigation and high-contrast skins.

Why people compare:

- **One PRO feature, full PRO price.** A critical path or a today line is a PRO feature.
- **Per-project licences.** Individual and Commercial cover one project. Agencies with several clients look at Enterprise or Ultimate.
- **SaaS costs extra.** It is "upon request for a fee".
- **Look and feel.** DHTMLX skins need overriding to match a design system.

## What REALM Pro's Gantt chart does

[`ui-kit-gantt`](/pro/components/ui-kit-gantt/) is a custom element in [REALM Pro](/pro/). The licence covers unlimited projects, including client work.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-gantt/light-desktop.png" alt="REALM Pro gantt chart component, desktop, light mode" width="960" height="708" loading="lazy">
    <figcaption>REALM Pro gantt chart. <a href="/pro/components/ui-kit-gantt/">See it in dark mode and on a phone</a>.</figcaption>
  </figure>
</div>

```html
<ui-kit-gantt label="Store rollout" zoom="month" critical baselines></ui-kit-gantt>
```

Against the DHTMLX PRO list, it has:

- **Critical path**, highlighted with the arrows that drive it.
- **Baselines**, drawn under each task and turned red when a task finishes later than planned.
- **Automatic rescheduling** of successors when a task moves (switch it off with `manual-scheduling`).
- **The today line**, plus weekend shading in day and week views.
- **WBS numbers** as a task list column.
- **Large plans**: only visible rows, bars and arrows are drawn, and it stays smooth with 5,000 tasks.

It also has summary tasks that roll up dates and weighted progress, milestones, four link types with lag, drag to link, loop detection, drag to move, resize and set progress, day to quarter zoom, cancellable `taskchange`, `taskadd`, `taskremove`, `dependencyadd` and `dependencyremove` events, and export to PNG, SVG or CSV (predecessors written as `1.2FS+2`). The task list is an ARIA tree grid: rename, move, resize, change progress, link, insert and delete from the keyboard, with each change announced.

It does not have resources, working-time calendars, constraints, deadlines, split tasks, grouping, undo and redo, multi-task selection, MS Project import or export, or PDF and Excel export.

The file is 98 KB of source, about 24 KB gzipped, plus the REALM runtime and the REALM UI parts it uses.

## Side by side

Checked October 2026 against [DHTMLX Gantt](https://dhtmlx.com/docs/products/dhtmlxGantt/), [Bryntum's store](https://bryntum.com/store/gantt/), [SVAR Gantt pricing](https://svar.dev/react/gantt/pricing/) and [Syncfusion pricing](https://www.syncfusion.com/sales/teamlicense).

| | DHTMLX Community | DHTMLX PRO | REALM Pro Gantt | Bryntum Gantt | SVAR Gantt PRO | Syncfusion Gantt |
| --- | --- | --- | --- | --- | --- | --- |
| Price | Free, MIT | $799 to $5,999, perpetual | $149 one developer, $499 up to 10, one-time | From $900 to $940 per developer, perpetual | From $749, perpetual | $959 per developer per year |
| Projects covered | Any | 1, 1, 5, or more on Ultimate | Unlimited | Per licence terms; OEM for SaaS | 1 on Developer and Application, unlimited on Team | Per developer |
| Four link types | Yes | Yes | Yes, with lag | Yes, with lag | Yes | Yes, with lag |
| Auto-scheduling | No | Yes | Successors pushed forward | Full engine | Yes | Auto and manual modes |
| Critical path | No | Yes | Yes | Yes | Yes | Yes |
| Baselines | No | Yes | Yes | Yes | Yes | Yes |
| Resources | No | Yes | No | Yes | Yes | Yes |
| Working calendars | No | Yes | No | Yes | Yes | Holidays |
| Undo and redo | No | Yes | No | Yes | Yes | Yes |
| Export | Export service | PDF, PNG, Excel, iCal, MS Project | PNG, SVG, CSV | PDF, PNG, Excel, MS Project | PDF, PNG, Excel, MS Project | Excel, PDF, CSV |
| Theming | Skins with CSS variables | Same | Your design tokens, light and dark | Five themes or custom | Light and dark | Fluent, Material, Bootstrap, Tailwind |

## The alternatives

### REALM Pro Gantt chart

Pick it when the PRO features you were going to pay for are critical path, baselines, auto-scheduling and the today line, and your plan is counted in calendar days. It suits agencies (unlimited projects), back offices and server-rendered apps. The same licence also includes the [scheduler](/pro/components/ui-kit-scheduler/), the [data grid](/pro/components/ui-kit-data-grid/), charts and the rest of the kit. REALM Pro is in early access and REALM is in alpha.

### Bryntum Gantt

[Bryntum Gantt](https://bryntum.com/products/gantt/) has the deepest engine here: Microsoft Project-style scheduling, calendars for projects, tasks and resources, resource histograms, undo, MS Project and Primavera import, and PDF, PNG and Excel export. End-user licences are perpetual per developer for apps whose users do not pay for access; SaaS needs an OEM quote.

### SVAR Gantt

[SVAR Gantt](https://svar.dev/svelte/gantt/) is the newest of the group, with an MIT core for Svelte, React and Vue and a PRO tier that closely mirrors DHTMLX PRO: auto-scheduling, critical path, baselines, calendars, resources, MS Project, undo and split tasks. It shows a 100,000-task demo. Its Team plan covers unlimited projects for five developers.

### Syncfusion Gantt

[Syncfusion's Gantt](https://www.syncfusion.com/javascript-ui-controls/js-gantt-chart) has most PRO features (critical path, baselines, resources, holidays, undo) as part of a yearly subscription, and is free under the [community licence](https://www.syncfusion.com/sales/communitylicense) for companies under $1 million in revenue with five or fewer developers.

### Frappe Gantt

[Frappe Gantt](https://github.com/frappe/gantt) is MIT and minimal: bars, progress, dependency arrows, drag and resize, and holidays. A good fit only if DHTMLX Community already feels like more than you need.

## When DHTMLX Gantt is the better choice

- **The Community edition is enough.** It is free and MIT; no alternative beats free for an editable chart with dependencies.
- **You need resources or working calendars.** PRO has both. REALM Pro's Gantt has neither.
- **MS Project or Primavera P6 files** go in and out through DHTMLX's export modules.
- **Undo, multi-select, split tasks and grouping** are in PRO and not in ours.
- **Framework coverage.** React, Angular, Vue, Svelte and Salesforce LWC are documented.

## Frequently asked questions

<ui-accordion type="multiple" class="faq">
  <ui-accordion-item>
    <ui-accordion-trigger>Is DHTMLX Gantt free for commercial use?</ui-accordion-trigger>
    <ui-accordion-content>The Community edition is MIT, so yes. Features such as auto-scheduling, critical path, resources and baselines need a PRO licence.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Is DHTMLX Gantt still GPL?</ui-accordion-trigger>
    <ui-accordion-content>No. The repository and the npm package for version 10 list the MIT licence for the Community edition.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Which Gantt chart has a critical path without a yearly subscription?</ui-accordion-trigger>
    <ui-accordion-content>REALM Pro (one-time), DHTMLX PRO, SVAR PRO and Bryntum (perpetual licences, with optional support renewals) all include a critical path.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Can I import my DHTMLX tasks into REALM Pro's Gantt?</ui-accordion-trigger>
    <ui-accordion-content>Map each task to an id, name, start date, duration, progress and parent, and each link to <code>from</code>, <code>to</code>, a <code>type</code> of FS, SS, FF or SF, and a lag in days. Then set the <code>tasks</code> and <code>dependencies</code> arrays. Optional <code>baselineStart</code> and <code>baselineEnd</code> fields carry the planned dates.</ui-accordion-content>
  </ui-accordion-item>
</ui-accordion>

## Next

- [See the Gantt chart with 5,000 tasks](/pro/components/ui-kit-gantt/).
- [Get REALM Pro](/pro/): the Gantt chart and the rest of the kit for $149, once, with a 14-day refund.
- [Quick start](/docs/quick-start/): REALM in a page in five minutes.
