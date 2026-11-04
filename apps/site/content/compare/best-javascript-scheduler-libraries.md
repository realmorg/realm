---
title: Best JavaScript scheduler and event calendar libraries
description: Eight JavaScript scheduler and event calendar libraries compared on views, resource timelines, recurrence, time zones, export, licence and price.
seoTitle: Best JavaScript scheduler and event calendar libraries in 2026
---

# Best JavaScript scheduler and event calendar libraries

For a calendar without resources (month, week, day, list), start with **FullCalendar Standard**: it is free, mature and has recurrence and time zones. For a free resource timeline, use **EventCalendar**. For bookings across people or rooms with recurrence, time zones, keyboard editing and calendar export at a one-time price in any stack, use **REALM Pro's `ui-kit-scheduler`**. For dense resource planning as the core of your product, pay for **Bryntum Scheduler** or **DHTMLX Scheduler PRO**. Inside a suite you already license, use **Syncfusion**'s scheduler.

Facts below were checked in October 2026 against each vendor's own pricing page, docs, npm package or repository, linked in each section. Where a vendor does not publish something, we leave it out.

## What separates a scheduler from a calendar

An event calendar shows events on dates. A scheduler adds **resources** (people, rooms, machines) and lets users book and move work between them. That split is also where most licences change: FullCalendar, DHTMLX and Schedule-X all keep the plain calendar free or open source and charge for resource views.

Check these before you choose:

- **Resource views.** A horizontal timeline (resources as rows), resource columns in a day or week view, or both.
- **Recurrence.** Whether the library expands iCalendar RRULE strings itself, and whether exceptions and single-occurrence edits work.
- **Time zones.** UTC offsets are not enough for recurring meetings across daylight saving changes. You need IANA zone names.
- **Editing control.** Can your code refuse a drag before it is saved?
- **Export.** `.ics` for calendar apps, PDF or print for the front desk.

## Comparison table

| Library | Licence and price | Resource timeline | Recurrence | Named time zones | Export |
| --- | --- | --- | --- | --- | --- |
| [FullCalendar](https://fullcalendar.io/pricing) | Standard MIT. Premium from $480 a year for 1 to 10 developers | Premium | RRULE plugin (MIT) | Yes | iCal import only; print is Premium |
| [REALM Pro scheduler](/pro/components/ui-kit-scheduler/) | One-time: $149 one developer, $499 up to 10, whole kit | Yes, up to 14 days | RRULE, built in | Yes | `.ics` |
| [EventCalendar](https://github.com/vkurko/calendar) | MIT | Free | Not found | UTC offsets | Not found |
| [Schedule-X](https://schedule-x.dev/premium) | MIT core. Premium €479/year or €999 lifetime, plus VAT | Premium | RRULE plugin (MIT) | Yes | iCal import only |
| [Bryntum Scheduler](https://bryntum.com/store/scheduler/) | Perpetual from $680 per developer, yearly support renewal | Yes | Yes | Yes | PDF, PNG, Excel, ICS, print |
| [DHTMLX Scheduler](https://dhtmlx.com/docs/products/dhtmlxScheduler/) | Standard GPL v2. PRO from $599, perpetual | PRO | RRULE since v7.1 | Not found | iCal, PDF, PNG |
| [Syncfusion Scheduler](https://www.syncfusion.com/javascript-ui-controls/js-scheduler) | $959 per developer per year, or free community licence | Day to year | Yes, with exceptions | Yes | ICS, Excel, print |
| [Mobiscroll](https://mobiscroll.com/event-calendar-scheduler) | Perpetual, per project | Hour to year | Yes | Yes, with a date library | Print module |

## The libraries

### 1. FullCalendar: best free event calendar

[FullCalendar](https://fullcalendar.io/) 7.1 is the default answer for good reason. The MIT Standard edition has month, week, day, list and multi-month views, drag and resize, recurring events through the [`@fullcalendar/rrule`](https://fullcalendar.io/docs/rrule-plugin) plugin, named time zones through Temporal, and adapters for React, Vue, Angular, Preact and a web component. [Accessibility docs](https://fullcalendar.io/docs/accessibility) cover WAI-ARIA and keyboard support. Premium adds timeline and resource views, resource grouping and print, from $480 a year for up to 10 developers.

**Pick it when** you need a calendar without resources, or you want the widest community and are fine with a yearly Premium renewal for resources.

### 2. REALM Pro scheduler: best one-time price for resource bookings

[`ui-kit-scheduler`](/pro/components/ui-kit-scheduler/) is part of [REALM Pro](/pro/). It has month, week, day, list and resource timeline views; drag to move, resize and create, snapped to your slot length; reassigning by dragging to another row; and cancellable `eventchange`, `rangeselect` and `eventcreate` events so your code can refuse a change. Recurrence follows RRULE with weekdays, "last Friday" style rules, counts, end dates and exceptions, and moving one occurrence leaves the series alone. `time-zone` takes any IANA name. With `src` it fetches the visible range from your API. It exports the visible range as `.ics`, and the keyboard can book, move, resize and delete events with screen reader announcements. The timeline only builds visible rows, so hundreds of resources scroll smoothly.

It has no year view, no print layout, no iCalendar import and no grouped resource rows, and the timeline shows up to 14 days at a time. REALM Pro is in early access.

**Pick it when** you build booking for clinics, salons, rooms or field teams, want it to follow your design tokens, and would rather pay once for the scheduler, data grid, charts and the rest of the kit.

### 3. EventCalendar: best free resource timeline

[EventCalendar](https://github.com/vkurko/calendar) 5.18 is MIT, follows FullCalendar's API style, and includes resource time grid and resource timeline views (day to year) at no cost, with drag, resize and select. Its time zone option accepts `local`, `UTC` or an offset. Recurrence, export and accessibility are not in its documentation.

**Pick it when** you need resources on a zero budget and can expand recurring events on the server.

### 4. Schedule-X: best modern open-core calendar

[Schedule-X](https://schedule-x.dev/) 4.9 has an MIT core with day, week, month, agenda, year and list views, RRULE recurrence and Temporal time zones, for React, Vue, Angular, Svelte, Preact and plain JavaScript. Since v4, [drag and drop](https://schedule-x.dev/docs/calendar/plugins/drag-and-drop), drag to create and the resource view are premium plugins.

**Pick it when** you like its design and API and either do not need dragging or will buy Premium.

### 5. Bryntum Scheduler: best for complex resource planning

[Bryntum Scheduler](https://bryntum.com/products/scheduler/) 7.3 covers resource grouping, virtual rendering, recurring events, time zones, export to PDF, PNG, Excel and ICS, and printing, for JavaScript, React, Angular and Vue. Licences are perpetual with source and a year of updates; the support subscription renews at the original price unless cancelled.

**Pick it when** the schedule is your product, such as dispatch, manufacturing or workforce planning.

### 6. DHTMLX Scheduler: best GPL option

[DHTMLX Scheduler](https://dhtmlx.com/docs/products/dhtmlxScheduler/) 7.2 has a GPL v2 Standard edition with day, week, month, year, agenda and map views, recurrence, iCal and PDF export, and WAI-ARIA on by default. The [editions comparison](https://docs.dhtmlx.com/scheduler/guides/editions-comparison/) puts timeline, units and grid views in PRO, a perpetual licence starting at $599.

**Pick it when** your project is open source under GPL, or you want many view types under a perpetual licence.

### 7. Syncfusion Scheduler: best inside a suite

[Syncfusion's scheduler](https://www.syncfusion.com/javascript-ui-controls/js-scheduler) has day, week, work week, month, agenda and year views, timeline views from day to year, multilevel resource grouping, ICS import and export, Excel export, printing and virtual scrolling. It is $959 per developer per year, or free under the [community licence](https://www.syncfusion.com/products/communitylicense) for companies under $1 million in revenue with five or fewer developers.

**Pick it when** you already use Syncfusion components or qualify for the community licence.

### 8. Mobiscroll Event Calendar: best for mobile-first apps

[Mobiscroll](https://mobiscroll.com/event-calendar-scheduler) sells a perpetual licence per project. Its timeline runs from hour to year resolution with nested resources and virtual scrolling on by default, and time zones need luxon, moment-timezone or day.js. Its pricing pages list different figures for the calendar alone, so ask before you budget.

**Pick it when** you also want Mobiscroll's mobile pickers and form controls.

[Toast UI Calendar](https://github.com/nhn/tui.calendar) still appears in older lists, but its repository was archived in September 2026 and its last release was in 2022.

## Which one should you choose?

| Your situation | Choose |
| --- | --- |
| Calendar with no resources | FullCalendar Standard |
| Resource timeline, free | EventCalendar |
| Bookings with recurrence, time zones and `.ics`, paid once | REALM Pro scheduler |
| Resource planning is the product | Bryntum Scheduler |
| Open-source project under GPL | DHTMLX Scheduler Standard |
| Already on a component suite | Syncfusion or DevExtreme |

## Frequently asked questions

<ui-accordion type="multiple" class="faq">
  <ui-accordion-item>
    <ui-accordion-trigger>What is a resource timeline?</ui-accordion-trigger>
    <ui-accordion-content>A view where each resource (a person, room or machine) is a row and time runs from left to right, so you can see who is free and drag work between rows.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Which scheduler supports recurring events?</ui-accordion-trigger>
    <ui-accordion-content>FullCalendar and Schedule-X through MIT RRULE plugins, REALM Pro built in, DHTMLX since 7.1, and Bryntum, Syncfusion and Mobiscroll in their paid editions.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Can users add events to Google Calendar or Outlook?</ui-accordion-trigger>
    <ui-accordion-content>With an <code>.ics</code> export, yes. REALM Pro, Bryntum, DHTMLX and Syncfusion export iCal. FullCalendar and Schedule-X import it only.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Is there a scheduler web component?</ui-accordion-trigger>
    <ui-accordion-content>REALM Pro's <code>ui-kit-scheduler</code> is a custom element that works without a framework. FullCalendar also ships a web component package.</ui-accordion-content>
  </ui-accordion-item>
</ui-accordion>

## Next

- [Try the REALM Pro scheduler](/pro/components/ui-kit-scheduler/) in all five views.
- [Get REALM Pro](/pro/): the scheduler, data grid, charts and more for $149, once.
- [Quick start](/docs/quick-start/): REALM in a page in five minutes.
