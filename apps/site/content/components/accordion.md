---
title: Accordion
description: A vertically stacked set of collapsible sections built on native details and summary, with one or several sections open at a time.
group: Navigation
order: 401
nav: Accordion
---

# Accordion

`ui-accordion` groups `ui-accordion-item` elements. Each item renders a native `<details>` and `<summary>` in its
shadow root, so the browser handles opening and closing, keyboard activation and find-in-page. Put a
`ui-accordion-trigger` and a `ui-accordion-content` inside each item. The trigger becomes the summary row, and the
content shows when the item is open. In the default `single` mode, opening one item closes the others. With
`type="multiple"` items open and close independently.

The accordion fills the width of its container.

```html live
<div class="demo-narrow">
  <ui-accordion>
    <ui-accordion-item open>
      <ui-accordion-trigger>Is it accessible?</ui-accordion-trigger>
      <ui-accordion-content>
        Yes. Each item is a native details element, so it works with the keyboard and screen readers.
      </ui-accordion-content>
    </ui-accordion-item>
    <ui-accordion-item>
      <ui-accordion-trigger>Is it styled?</ui-accordion-trigger>
      <ui-accordion-content>
        Yes. It uses the theme tokens, so it follows your colours, radii and dark mode.
      </ui-accordion-content>
    </ui-accordion-item>
    <ui-accordion-item>
      <ui-accordion-trigger>Is it animated?</ui-accordion-trigger>
      <ui-accordion-content>The chevron rotates when an item opens.</ui-accordion-content>
    </ui-accordion-item>
  </ui-accordion>
</div>
```

## Examples

### Multiple open items

Set `type="multiple"` to let several items stay open at once.

```html live
<div class="demo-narrow">
  <ui-accordion type="multiple">
    <ui-accordion-item open>
      <ui-accordion-trigger>Shipping</ui-accordion-trigger>
      <ui-accordion-content>Orders ship within two working days.</ui-accordion-content>
    </ui-accordion-item>
    <ui-accordion-item open>
      <ui-accordion-trigger>Returns</ui-accordion-trigger>
      <ui-accordion-content>Return any item within 30 days of delivery.</ui-accordion-content>
    </ui-accordion-item>
    <ui-accordion-item>
      <ui-accordion-trigger>Warranty</ui-accordion-trigger>
      <ui-accordion-content>Every product has a two-year warranty.</ui-accordion-content>
    </ui-accordion-item>
  </ui-accordion>
</div>
```

### Disabled item

A `disabled` item cannot be opened or closed by the user. Its summary is dimmed.

```html live
<div class="demo-narrow">
  <ui-accordion>
    <ui-accordion-item>
      <ui-accordion-trigger>Account</ui-accordion-trigger>
      <ui-accordion-content>Manage your account details.</ui-accordion-content>
    </ui-accordion-item>
    <ui-accordion-item disabled>
      <ui-accordion-trigger>Billing (admins only)</ui-accordion-trigger>
      <ui-accordion-content>Billing settings.</ui-accordion-content>
    </ui-accordion-item>
    <ui-accordion-item>
      <ui-accordion-trigger>Notifications</ui-accordion-trigger>
      <ui-accordion-content>Choose which emails you receive.</ui-accordion-content>
    </ui-accordion-item>
  </ui-accordion>
</div>
```

### Rich trigger

The trigger takes any inline markup, such as a badge.

```html live
<div class="demo-narrow">
  <ui-accordion>
    <ui-accordion-item>
      <ui-accordion-trigger>Plan <ui-badge variant="secondary">Pro</ui-badge></ui-accordion-trigger>
      <ui-accordion-content>Your plan renews on the first of every month.</ui-accordion-content>
    </ui-accordion-item>
    <ui-accordion-item>
      <ui-accordion-trigger>Usage <ui-badge variant="outline">82%</ui-badge></ui-accordion-trigger>
      <ui-accordion-content>You have used 82% of this month's quota.</ui-accordion-content>
    </ui-accordion-item>
  </ui-accordion>
</div>
```

### Reacting to changes

Each item emits a bubbling `toggle` event when the user opens or closes it, and reflects its state to the `open`
attribute.

```html live
<custom-element name="accordion-events-demo">
  <script type="realm">
    const log = useState({ last: "Nothing toggled yet" });

    function toggled(event) {
      const item = event.target;
      log.last = `${item.dataset.name} is ${item.open ? "open" : "closed"}`;
    }
  </script>
  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
      width: min(100%, calc(var(--spacing) * 96));
    }
    p {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--muted-foreground);
    }
  </style>
  <ui-accordion type="multiple" ontoggle="toggled(event)">
    <ui-accordion-item data-name="General">
      <ui-accordion-trigger>General</ui-accordion-trigger>
      <ui-accordion-content>General settings.</ui-accordion-content>
    </ui-accordion-item>
    <ui-accordion-item data-name="Privacy">
      <ui-accordion-trigger>Privacy</ui-accordion-trigger>
      <ui-accordion-content>Privacy settings.</ui-accordion-content>
    </ui-accordion-item>
  </ui-accordion>
  <p><slot name="#log.last"></slot></p>
</custom-element>
<accordion-events-demo></accordion-events-demo>
```

## API

### Parts

| Element | Fills | Renders |
| --- | --- | --- |
| `ui-accordion` | | The container. Fills its container's width. |
| `ui-accordion-item` | the default slot of `ui-accordion` | A native `<details>` with a `<summary>` row and a chevron. |
| `ui-accordion-trigger` | the `<summary>` of its `ui-accordion-item` | The summary row's content. Accepts inline markup. |
| `ui-accordion-content` | the body of its `ui-accordion-item` | The content shown when the item is open, with bottom padding. |

### Attributes

#### ui-accordion

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `"single"` \| `"multiple"` | `"single"` | In `single` mode, opening an item closes every other open item in the accordion. |

#### ui-accordion-item

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | boolean | `false` | Whether the item is open. Reflects. |
| `disabled` | boolean | `false` | Stops the user from opening or closing the item. Setting `open` from script still works. |

`ui-accordion-trigger` and `ui-accordion-content` have no attributes.

### Events

| Event | Element | Description |
| --- | --- | --- |
| `toggle` | `ui-accordion-item` | Fires when the user opens or closes the item. Bubbles. Read `event.target.open`. Setting `open` from script, including the automatic closing in `single` mode, does not fire it. |

### CSS parts

| Part | Element | Description |
| --- | --- | --- |
| `summary` | `ui-accordion-item` | The native `<summary>` row. |

### Accessibility

- Each item is a native `<details>`/`<summary>` pair, so the summary is announced as a button with its expanded
  state. The trigger's text is the button's name.
- Tab moves between summaries. Enter or Space opens or closes the focused item.
- A disabled item's summary stays focusable but does not toggle.
- Do not put links or buttons inside `ui-accordion-trigger`. The summary is already the button.
