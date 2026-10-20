---
title: busy and timeout
description: busy, which writes whether a request is running into state, and timeout, which aborts slow requests.
group: Fetch attributes
order: 34
nav: busy, timeout
---

# `busy` and `timeout`

Track a [fetch element](/reference/fetch/fetch/)'s request and set a time limit for it.

```html
<form fetch="/api/save" method="post" busy="#form.saving" timeout="10s">
  <ui-button type="submit" _disabled="#form.saving">Save</ui-button>
</form>
```

## Attributes

| Attribute | Type | Default | Meaning |
| --- | --- | --- | --- |
| `busy` | writable [reference](/reference/syntax/) | none | Set to `true` when a request starts and `false` when the latest one ends |
| `timeout` | [duration](/reference/syntax/#durations) | none | Abort the request after this long and fire `timeout` instead of `abort` |

## While a request runs

| What | Value |
| --- | --- |
| `busy` reference | `true` |
| `aria-busy` on the element | `"true"`, removed afterwards (with or without `busy`) |
| [`:state(loading)`](/reference/css/states/#loading) on the component host | Present while any request in the component runs |

When a newer request replaces a running one, `busy` stays `true` until the newer one ends.

## Example

```html live
<custom-element name="slow-save">
  <script type="realm">
    const form = useState({ saving: false, result: "" });
  </script>

  <style type="realm">
    :host {
      display: flex;
      gap: calc(var(--spacing) * 3);
      align-items: center;
    }
    :host(:state(loading)) output {
      color: var(--muted-foreground);
    }
  </style>

  <ui-button fetch="{{root}}search-index.json" busy="#form.saving" timeout="5s" _disabled="#form.saving" onload="form.result = 'Done'">Load</ui-button>
  <output><is-visible when="#form.saving">Loading…</is-visible><slot name="#form.result"></slot></output>
</custom-element>

<slow-save></slow-save>
```

## Related

- [Request events: timeout](/reference/events/request-events/)
- [Fetching data](/docs/fetching/)
