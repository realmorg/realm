---
title: Slider
description: A form-associated range slider built on a native range input, with a filled track and numeric value.
group: Forms
order: 113
nav: Slider
---

# Slider

`ui-slider` wraps a native `<input type="range">` and fills the track up to the thumb. Its `value` is a number, kept
in sync while the thumb moves. It is form-associated, so the value is submitted under its `name`, and it keeps the
native range input's keyboard support.

```html live
<div class="demo-narrow">
  <ui-slider aria-label="Volume" value="50"></ui-slider>
</div>
```

## Examples

### Range and step

`min`, `max` and `step` work as on the native input.

```html live
<div class="demo-narrow demo-stack">
  <ui-slider aria-label="Opacity" value="0.6" min="0" max="1" step="0.1"></ui-slider>
  <ui-slider aria-label="Temperature" value="21" min="16" max="28" step="0.5"></ui-slider>
</div>
```

### Showing the value

The slider does not print its value. Listen for `input` to show it while dragging.

```html live
<custom-element name="slider-value-demo">
  <script type="realm">
    const brightness = useState({ value: 70 });

    function moved(slider) {
      brightness.value = slider.value;
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
      width: 100%;
      max-width: calc(var(--spacing) * 72);
    }
    .row {
      display: flex;
      justify-content: space-between;
      font-size: var(--text-sm);
    }
    .value {
      color: var(--muted-foreground);
      font-variant-numeric: tabular-nums;
    }
  </style>

  <div class="row">
    <ui-label for="slider-brightness">Brightness</ui-label>
    <span class="value"><slot name="#brightness.value"></slot>%</span>
  </div>
  <ui-slider id="slider-brightness" value="70" oninput="moved(this)"></ui-slider>
</custom-element>
<slider-value-demo></slider-value-demo>
```

### Custom fill colour

The filled part of the track uses `--primary`. Override the token on an ancestor, for example with a class, to change it.

```html live
<style>
  .slider-risk {
    --primary: var(--destructive);
  }
</style>
<div class="demo-narrow slider-risk">
  <ui-slider aria-label="Risk" value="80"></ui-slider>
</div>
```

### Disabled

```html live
<div class="demo-narrow">
  <ui-slider aria-label="Locked" value="30" disabled></ui-slider>
</div>
```

### In a form

The value is submitted as a number string under `name`. Reset returns to the `value` attribute.

```html live
<custom-element name="slider-form-demo">
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
      width: 100%;
      max-width: calc(var(--spacing) * 80);
    }
    form {
      display: grid;
      gap: calc(var(--spacing) * 4);
    }
    .actions {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
    output {
      display: block;
      padding: calc(var(--spacing) * 3);
      border-radius: var(--radius-md);
      background: var(--muted);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      white-space: pre-wrap;
    }
  </style>

  <form onsubmit="submit(event)" onreset="reset()">
    <ui-slider name="budget" aria-label="Budget" value="400" min="0" max="1000" step="50"></ui-slider>
    <ui-slider name="quality" aria-label="Quality" value="3" min="1" max="5"></ui-slider>
    <div class="actions">
      <ui-button type="submit">Apply</ui-button>
      <ui-button type="reset" variant="outline">Reset</ui-button>
    </div>
  </form>
  <output><slot name="#result.text"></slot></output>
</custom-element>
<slider-form-demo></slider-form-demo>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | number | `0` | Current value. The attribute is the initial and reset value. |
| `min` | number | `0` | Lowest value. |
| `max` | number | `100` | Highest value. |
| `step` | number | `1` | Granularity of the value. |
| `disabled` | boolean | `false` | Disables the slider. Also true inside a disabled `<fieldset>`. |
| `aria-label` | string | | Accessible name, passed to the inner input. Property name: `label`. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `value` | number | Current value as a number. Updated while the thumb moves. Setting it moves the thumb. |

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `input` | none | The inner range input's native `input` event (composed), fired while dragging. |
| `change` | none | Dispatched from the element (bubbling) when the user releases the thumb or commits a key press. |

### CSS parts

| Part | Description |
| --- | --- |
| `control` | The inner native `<input type="range">`. |

### CSS custom properties

| Property | Description |
| --- | --- |
| `--state-range-percent` | Set on the host to the filled share of the track, for example `40%`. Read-only. Use it to draw a matching tooltip or label. |

### Forms

`ui-slider` is form-associated and submits `value` under its `name`. `form.reset()` restores the `value` attribute,
and a disabled `<fieldset>` disables it.

### Accessibility

The host delegates focus to the inner native range input, which has the `slider` role and native keyboard support.
The arrow keys change the value by `step`, Page Up and Page Down by larger amounts, and Home and End jump to `min`
and `max`.
