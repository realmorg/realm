---
title: Collapsible
description: A single section that shows and hides its content when its trigger is activated, built on native details and summary.
group: Navigation
order: 403
nav: Collapsible
---

# Collapsible

`ui-collapsible` wraps a native `<details>` element. Its `ui-collapsible-trigger` becomes the `<summary>`, and its
`ui-collapsible-content` is shown when it opens. The trigger lays out its content in a row with the ends pushed
apart, so a label and an icon need no extra markup. For a group of sections where only one is open at a time, use
[Accordion](/components/accordion/).

```html live
<div class="demo-narrow">
  <ui-collapsible>
    <ui-collapsible-trigger>
      3 starred repositories
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m7 15 5 5 5-5M7 9l5-5 5 5" /></svg>
    </ui-collapsible-trigger>
    <ui-collapsible-content>
      <ui-item variant="outline" size="sm">realm/core</ui-item>
      <ui-item variant="outline" size="sm">realm/ui</ui-item>
      <ui-item variant="outline" size="sm">realm/site</ui-item>
    </ui-collapsible-content>
  </ui-collapsible>
</div>
```

## Examples

### Open by default

Add `open` to start expanded. The attribute reflects, so it also tracks the current state.

```html live
<div class="demo-narrow">
  <ui-collapsible open>
    <ui-collapsible-trigger>Release notes</ui-collapsible-trigger>
    <ui-collapsible-content>
      <p class="demo-muted">Faster startup, smaller bundle and a new sidebar.</p>
    </ui-collapsible-content>
  </ui-collapsible>
</div>
```

### Disabled

`disabled` stops the user from toggling it. The trigger is dimmed.

```html live
<div class="demo-narrow">
  <ui-collapsible disabled>
    <ui-collapsible-trigger>Advanced options (locked)</ui-collapsible-trigger>
    <ui-collapsible-content>Only administrators can change these.</ui-collapsible-content>
  </ui-collapsible>
</div>
```

### Controlled from state

Bind `open` with `_open` and listen for `toggle` to keep state in sync.

```html live
<custom-element name="collapsible-state-demo">
  <script type="realm">
    const panel = useState({ open: false });

    function toggled(event) {
      panel.open = event.target.open;
    }

    function flip() {
      panel.open = !panel.open;
    }
  </script>
  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
      width: min(100%, calc(var(--spacing) * 80));
    }
  </style>
  <ui-button variant="outline" size="sm" onclick="flip()">Toggle from outside</ui-button>
  <ui-collapsible _open="#panel.open" ontoggle="toggled(event)">
    <ui-collapsible-trigger>Filters</ui-collapsible-trigger>
    <ui-collapsible-content>Status, owner and date range.</ui-collapsible-content>
  </ui-collapsible>
</custom-element>
<collapsible-state-demo></collapsible-state-demo>
```

## API

### Parts

| Element | Fills | Renders |
| --- | --- | --- |
| `ui-collapsible` | | A native `<details>`. Fills its container's width. |
| `ui-collapsible-trigger` | the `<summary>` of `ui-collapsible` | A row with its content spread to both ends, in small semibold text. Icons are sized to `calc(var(--spacing) * 4)`. |
| `ui-collapsible-content` | the body of `ui-collapsible` | A column with `calc(var(--spacing) * 2)` gaps, shown when open. |

### Attributes

#### ui-collapsible

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | boolean | `false` | Whether the content is shown. Reflects. |
| `disabled` | boolean | `false` | Stops the user from toggling. Setting `open` from script still works. |

`ui-collapsible-trigger` and `ui-collapsible-content` have no attributes.

### Events

| Event | Element | Description |
| --- | --- | --- |
| `toggle` | `ui-collapsible` | Fires when the user opens or closes it. Bubbles. Read `event.target.open`. Not fired when `open` is set from script. |

### CSS parts

| Part | Element | Description |
| --- | --- | --- |
| `trigger` | `ui-collapsible` | The native `<summary>`. |

### Accessibility

- The trigger is a native `<summary>`, announced as a button with its expanded state.
- Tab focuses the trigger. Enter or Space toggles it.
- Do not put other interactive elements in the trigger. The summary is already the button.
