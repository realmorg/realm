---
title: debounce and throttle
description: The debounce and throttle attributes, which delay or rate-limit event handlers and requests.
group: Attributes
order: 22
nav: debounce, throttle
---

# `debounce` and `throttle`

Delay or rate-limit the `on…` handlers of an element, or its request when the element has [fetch attributes](/reference/fetch/fetch/). Used in component markup.

```html
<input oninput="search(this.value)" debounce="300ms">
<div onpointermove="track(event)" throttle="100ms"></div>
<input name="q" fetch="/api/search" trigger="input" debounce="250ms" into="#results.items">
```

## Attributes

| Attribute | Type | Meaning |
| --- | --- | --- |
| `debounce` | [duration](/reference/syntax/#durations) | Run once the events stop for this long, with the last event |
| `throttle` | duration | Run at most once per period, on the leading edge. Events in between are dropped |

If both are present, `debounce` is used.

## What is timed

| Element | Timed |
| --- | --- |
| Element without fetch attributes | Every `on…` handler on it |
| Element with fetch attributes | Requests started by event-name and reference [triggers](/reference/fetch/trigger/). Its own `on…` handlers run immediately. `load`, `visible` and `poll` are not timed |

A pending debounced call is cancelled when the element is removed. An invalid duration logs a warning and counts as `0`.

## Example

```html live
<custom-element name="typing-echo">
  <script type="realm">
    const echo = useState({ text: "", runs: 0 });

    function copy(field) {
      echo.text = field.value;
      echo.runs++;
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      width: min(calc(var(--spacing) * 80), 100%);
    }
  </style>

  <input aria-label="Type here" placeholder="Type here" oninput="copy(this)" debounce="500ms">
  <p>Copied 500ms after you stop typing: <slot name="#echo.text"></slot></p>
  <p>Handler runs: <slot name="#echo.runs"></slot></p>
</custom-element>

<typing-echo></typing-echo>
```

## Related

- [Events: debounce and throttle](/docs/events/#debounce-and-throttle)
- [Fetching data](/docs/fetching/)
