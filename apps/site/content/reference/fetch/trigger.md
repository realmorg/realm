---
title: trigger and poll
description: The trigger and poll attributes, which decide when a fetch element sends its request.
group: Fetch attributes
order: 31
nav: trigger, poll
---

# `trigger` and `poll`

Decide when a [fetch element](/reference/fetch/fetch/) sends its request.

```html
<div fetch="/api/stats" trigger="load visible" into="#stats.data"></div>
<input name="q" fetch="/api/search" trigger="input" debounce="250ms" into="#search.results">
<section fetch="/api/items" trigger="#filters.category, @user" into="#list.items"></section>
<div fetch="/api/feed" trigger="load" poll="30s" into="#feed.items"></div>
```

## trigger

A list of triggers separated by spaces or commas. Each one sends the request:

| Trigger | Sends when | Timed by `debounce`/`throttle` |
| --- | --- | --- |
| an event name (`click`, `input`, `mouseenter`, `my-event`, …) | That event fires on the element | yes |
| `load` | Once, right after the element is set up | no |
| `visible` | The element enters the viewport (`IntersectionObserver`), each time it does | no |
| `#state.path`, `@prop` | The referenced value changes (compared as JSON). Not on the first read | yes |

Default when `trigger` is absent:

| Element | Default trigger |
| --- | --- |
| `<form>` | `submit` |
| `<input>`, `<select>`, `<textarea>` | `change` |
| anything else | `click` |

Setting `trigger` replaces the default, so `<form trigger="input">` no longer sends on submit (and still never submits natively).

## poll

| Attribute | Type | Meaning |
| --- | --- | --- |
| `poll` | [duration](/reference/syntax/#durations) | Also send the request every period, until the element is removed. Not timed by `debounce`/`throttle` |

`poll` does not send immediately. Combine it with `trigger="load"` to load first and then refresh.

## Example

```html live
<custom-element name="section-filter">
  <script type="realm">
    const filter = useState({ section: "Docs", pages: [] });
    const view = useState({
      get matches() {
        return filter.pages.filter((page) => page.section === filter.section).length;
      },
    });
  </script>

  <style type="realm">
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: calc(var(--spacing) * 2);
      align-items: center;
    }
  </style>

  <select aria-label="Section" onchange="filter.section = this.value">
    <option>Docs</option>
    <option>Components</option>
    <option>Reference</option>
  </select>
  <span fetch="{{root}}search-index.json" trigger="load, #filter.section" into="#filter.pages"></span>
  <output><slot name="#view.matches"></slot> pages in <slot name="#filter.section"></slot></output>
</custom-element>

<section-filter></section-filter>
```

The request runs on load and again whenever `#filter.section` changes.

## Related

- [Fetching data: refetching when state changes](/docs/fetching/#refetching-when-state-changes)
