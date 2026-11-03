---
title: Scheduler
seoTitle: JavaScript scheduler web component · REALM Pro
description: Month, week, day, list and resource timeline views with drag to move, resize and create, recurring events, time zones and iCalendar export.
group: Data
nav: Scheduler
---

# Scheduler

Month, week, day, list and resource timeline views with drag to move, resize and create, recurring events, time zones and iCalendar export.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-scheduler/light-desktop.png" alt="Scheduler, desktop, light mode" width="960" height="853" loading="lazy">
    <figcaption>Desktop, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-scheduler/dark-desktop.png" alt="Scheduler, desktop, dark mode" width="960" height="853" loading="lazy">
    <figcaption>Desktop, dark mode</figcaption>
  </figure>
</div>

## What it does

The scheduler is a calendar for teams, clinics, rooms and equipment. It shows the same events five ways: a month grid, a week or a single day with hours down the side, a plain list of what is coming up, and a resource timeline where each person or room is a row and time runs from left to right. A toolbar above the calendar holds Today, previous and next, the current date range as a title, the view switcher and an export button. On a phone it opens on the list view, which reads better on a narrow screen than seven squeezed columns, unless you choose a view yourself.

## Editing with the pointer

Drag an event to move it, drag its top or bottom edge to change when it starts or ends, and drag across empty time to book something new. Every drag snaps to the slot length you set, such as 15 or 30 minutes, and shows a preview with the new times while you move. In month view you drag events from day to day and stretch all-day events across several days. In the timeline you can drag an appointment to another row to give it to someone else, and Escape cancels a drag halfway through.

Nothing changes until your page agrees. Each edit sends an `eventchange` event with the old and new times and resources, and calling `preventDefault()` puts the event back where it was. A new booking sends `rangeselect` and then `eventcreate`, so you can refuse a slot, rename the new event, or open your own form first. A click sends `eventclick` and opens a small card with the time, the people involved, the place and any notes.

## Repeating events and time zones

Events can repeat daily, weekly, monthly or yearly using the rule format calendars already share: an interval, chosen weekdays, "the second Tuesday" or "the last Friday" of a month, chosen days of the month, and an end after a number of times or on a date. Skipped dates are listed as exceptions. Moving one meeting of a weekly series changes only that one and leaves the rest of the series alone.

Set `time-zone` to any time zone name and every event is shown at that zone's local time, including across daylight saving changes. A weekly 9:00 meeting in New York stays at 9:00 when the clocks change. Dates, times and the first day of the week follow the language of the page or the `locale` you set.

## Keyboard and screen readers

The calendar grid is a single stop in the tab order. Arrow keys move between days and time slots, Page Up and Page Down change the range, and Enter books the focused slot or opens the focused day. Focus an event and the arrow keys move it by one slot or one day, Shift with an arrow makes it longer or shorter, Enter opens it and Delete removes it. Every change is read out by screen readers, and each event has a full name with its title, time and people.

## Data, export and large teams

Pass events as an array, or set `src` and the scheduler asks your server for the visible dates with `start`, `end` and `timeZone` in the address, and asks again whenever the range changes. Business hours are shaded, a line marks the current time, and colours come from your theme's chart colours, from each resource, or from the event itself. The export button saves the visible range as an `.ics` file that Google Calendar, Outlook and Apple Calendar open. The timeline only builds the rows on screen, so a list of hundreds of staff or rooms scrolls smoothly.

```html
<ui-kit-scheduler view="timeline" time-zone="Europe/Lisbon" slot-minutes="15" src="/api/appointments"></ui-kit-scheduler>
```

<div class="pro-shots phone">
  <figure>
    <img src="/pro/components/ui-kit-scheduler/light-phone.png" alt="Scheduler, phone, light mode" width="390" height="833" loading="lazy">
    <figcaption>Phone, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-scheduler/dark-phone.png" alt="Scheduler, phone, dark mode" width="390" height="833" loading="lazy">
    <figcaption>Phone, dark mode</figcaption>
  </figure>
</div>


## Built from REALM UI

Scheduler is made from free REALM UI components, so it follows your theme and dark mode like the rest of your page:

- [`ui-button`](/components/button/)
- [`ui-popover`](/components/popover/)
- [`ui-toggle`](/components/toggle/)
- [`ui-toggle-group`](/components/toggle-group/)

## Use it

Scheduler is part of [REALM Pro](/pro/). Add it from REALM Pro Studio, or copy the file into your project and load it:

```html
<import-element from="/pro/components/ui-kit-scheduler.html"></import-element>
<ui-kit-scheduler></ui-kit-scheduler>
```
