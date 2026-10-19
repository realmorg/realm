---
title: Calendar
description: A month grid date picker that submits an ISO date with its form, with min and max limits, locale formatting and keyboard navigation.
group: Forms
order: 103
nav: Calendar
---

# Calendar

`ui-calendar` shows one month as a grid of day buttons. Clicking a day selects it, and the selected date is the
element's `value` in `YYYY-MM-DD` form. The calendar is form-associated: give it a `name` and the selected date is
submitted with its form, the same format a native `<input type="date">` uses.

Dates are handled as plain calendar days in UTC, so a value never shifts across time zones. Today is the user's
local date. Month and weekday names
come from `Intl.DateTimeFormat`, and weeks always start on Sunday.

```html live
<ui-calendar></ui-calendar>
```

## Examples

### Selected date

Set `value` to preselect a date. The calendar opens on that date's month.

```html live
<ui-calendar value="2026-03-14"></ui-calendar>
```

### Minimum and maximum

Days before `min` or after `max` are disabled and cannot be selected.

```html live
<ui-calendar value="2026-06-10" min="2026-06-05" max="2026-06-24"></ui-calendar>
```

### Starting month

`month` (`YYYY-MM`) sets the month shown first when there is no value to show.

```html live
<ui-calendar month="2026-12"></ui-calendar>
```

### Locale

`locale` is a BCP 47 language tag for the month title and weekday names. Without it the browser's default locale
is used.

```html live
<ui-calendar locale="fr-FR" value="2026-07-14"></ui-calendar>
<ui-calendar locale="ja-JP" value="2026-07-14"></ui-calendar>
```

### Listening for changes

The calendar fires `change` when a day is picked. Read the new date from `value`.

```html live
<custom-element name="calendar-change-demo">
  <script type="realm">
    const picked = useState({ date: "nothing yet" });

    function changed(calendar) {
      picked.date = calendar.value;
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
      justify-items: center;
    }
    p {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--muted-foreground);
    }
  </style>

  <ui-calendar month="2026-10" onchange="changed(this)"></ui-calendar>
  <p>Selected: <slot name="#picked.date"></slot></p>
</custom-element>
<calendar-change-demo></calendar-change-demo>
```

### In a form

The calendar submits its `value` under its `name`. Resetting the form returns it to the `value` attribute.

```html live
<custom-element name="calendar-form-demo">
  <script type="realm">
    const result = useState({ text: "Submit the form to see its data." });

    function submit(event) {
      event.preventDefault();
      result.text = [...new FormData(event.target)].map(([name, value]) => `${name}=${value}`).join("\n");
    }

    function reset() {
      result.text = "The form was reset.";
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 4);
      justify-items: start;
    }
    form {
      display: grid;
      gap: calc(var(--spacing) * 3);
      justify-items: start;
    }
    .actions {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
    output {
      display: block;
      box-sizing: border-box;
      width: 100%;
      padding: calc(var(--spacing) * 3);
      border-radius: var(--radius-md);
      background: var(--muted);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      white-space: pre-wrap;
    }
  </style>

  <form onsubmit="submit(event)" onreset="reset()">
    <ui-calendar name="checkin" value="2026-08-03" min="2026-08-01"></ui-calendar>
    <div class="actions">
      <ui-button type="submit">Book</ui-button>
      <ui-button type="reset" variant="outline">Reset</ui-button>
    </div>
  </form>
  <output><slot name="#result.text"></slot></output>
</custom-element>
<calendar-form-demo></calendar-form-demo>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | string | `""` | Selected date as `YYYY-MM-DD`. Empty means no selection. |
| `month` | string | | Month shown first, as `YYYY-MM`. Used when the calendar is created; otherwise the month of `value`, or the current month. |
| `min` | string | | Earliest selectable date, `YYYY-MM-DD`. |
| `max` | string | | Latest selectable date, `YYYY-MM-DD`. |
| `locale` | string | | Locale for the month title and weekday names. Defaults to the browser locale. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `value` | string | The selected date. Setting it updates the selection and the submitted value. |

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `change` | none | Fired after the user picks a day. |

### CSS parts

| Part | Description |
| --- | --- |
| `header` | The row with the previous and next month buttons and the month title. |
| `grid` | The `<table>` holding the weekday headings and days. |
| `day` | Each day `<button>`. It carries `data-date`, plus `data-outside` for days of the neighbouring months, `data-today` for today, `aria-selected="true"` for the selected day and `disabled` outside `min`/`max`. |

`::part(day)` accepts pseudo-classes such as `:hover` and `:disabled` but not attribute selectors, so the
selected, today and outside colours come from the theme tokens (`--primary`, `--accent`, `--muted-foreground`).

### Forms

`ui-calendar` is form-associated. With a `name`, the form submits `value` (`YYYY-MM-DD`), or nothing when no date is
selected. `form.reset()` restores the `value` attribute, and the browser's form state restore brings back a
selected date after navigation.

### Accessibility

The days are a table with `role="grid"`, and the selected day has `aria-selected="true"`. The month title is an
`aria-live="polite"` region, so month changes are announced. Only one day is in the tab order at a time: the
selected day, or today when nothing is selected.

| Key | Action |
| --- | --- |
| Arrow Left / Arrow Right | Move focus one day back or forward. |
| Arrow Up / Arrow Down | Move focus one week back or forward. Moving past the edge of the month shows the next or previous month. |
| Enter / Space | Select the focused day. |
| Tab | Leave the grid. The previous and next month buttons come before it in tab order. |
