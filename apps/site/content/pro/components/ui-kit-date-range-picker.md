---
title: Date range picker
seoTitle: JavaScript date range picker web component · REALM Pro
description: Pick a start and end date on a two-month calendar with presets, full keyboard support, locale-aware formatting, min and max dates, and a form value.
group: Forms
nav: Date range picker
---

# Date range picker

Pick a start and end date on a two-month calendar with presets, full keyboard support, locale-aware formatting, min and max dates, and a form value.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-date-range-picker/light-desktop.png" alt="Date range picker, desktop, light mode" width="960" height="788" loading="lazy">
    <figcaption>Desktop, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-date-range-picker/dark-desktop.png" alt="Date range picker, desktop, dark mode" width="960" height="788" loading="lazy">
    <figcaption>Desktop, dark mode</figcaption>
  </figure>
</div>

## What it does

The date range picker lets people choose a start and an end date in two clicks. It looks like a form field showing the chosen range, such as "Oct 1 – 14, 2026". Opening it shows a calendar with two months side by side and a short list of presets: today, the last 7 days, the last 30 days, this month, last month and this year. The first click sets the start. As the pointer moves, the days up to it are shaded, so people can see the range before they commit to it. The second click sets the end and closes the calendar. Clicking an earlier day second simply swaps the two, so nobody has to start over.

On a phone the calendar shows one month and the presets wrap into a row of chips above it, so the whole picker fits on a 390 pixel screen without sideways scrolling. With the `inline` attribute the calendar sits in the page instead of opening over it, which suits booking pages and report filters that are always visible.

## Keyboard and screen readers

The calendar follows the date picker dialog pattern from the WAI-ARIA Authoring Practices. The arrow keys move by a day or a week, Page Up and Page Down move by a month, Shift with Page Up or Page Down moves by a year, and Home and End jump to the first and last day of the week. Enter or Space picks the focused day, and Escape closes the calendar and puts focus back on the field. Each day is a real button whose accessible name is the full date, today is marked as the current date, and the chosen days are announced as selected.

## Your language and your rules

Month names, weekday names and the text in the field come from the browser's `Intl` API, using the `locale` attribute or the language of the page. The week starts on the day the locale expects where the browser can tell, and `week-start` sets it by hand. `min` and `max` limit the range; days outside it, and any days listed in `disabled-dates`, are struck through and cannot be picked, and presets are trimmed to fit. Preset labels and the list itself are set with the `presets` attribute, so a booking page can offer "Next 7 days" instead.

## In a form

The picker is a real form field. With a `name`, it submits one value in the ISO 8601 interval format, `period=2026-10-01/2026-10-14`, which splits on the slash on the server. `required` blocks an empty submit, a form reset restores the starting value, and every change sends a `change` event with the `start` and `end` dates.

```html
<form>
  <label for="period">Report period</label>
  <ui-kit-date-range-picker id="period" name="period" value="2026-10-01/2026-10-14" required></ui-kit-date-range-picker>
  <button>Apply</button>
</form>
```

Colours, spacing and radii come from the REALM UI theme tokens, so the picker follows your theme and dark mode.

<div class="pro-shots phone">
  <figure>
    <img src="/pro/components/ui-kit-date-range-picker/light-phone.png" alt="Date range picker, phone, light mode" width="390" height="854" loading="lazy">
    <figcaption>Phone, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-date-range-picker/dark-phone.png" alt="Date range picker, phone, dark mode" width="390" height="854" loading="lazy">
    <figcaption>Phone, dark mode</figcaption>
  </figure>
</div>


## Built from REALM UI

Date range picker is made from free REALM UI components, so it follows your theme and dark mode like the rest of your page:

- [`ui-button`](/components/button/)

## Use it

Date range picker is part of [REALM Pro](/pro/). Add it from REALM Pro Studio, or copy the file into your project and load it:

```html
<import-element from="/pro/components/ui-kit-date-range-picker.html"></import-element>
<ui-kit-date-range-picker></ui-kit-date-range-picker>
```
