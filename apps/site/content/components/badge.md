---
title: Badge
description: A small inline label for a status, a count or a category.
group: Display
order: 203
nav: Badge
---

# Badge

`ui-badge` is an inline label with a filled or outlined background. It has no behaviour of its own. Put it next to
the text it describes, or inside a link or button when it should be interactive.

```html live
<ui-badge>Badge</ui-badge>
<ui-badge variant="secondary">Secondary</ui-badge>
<ui-badge variant="destructive">Destructive</ui-badge>
<ui-badge variant="outline">Outline</ui-badge>
```

## Examples

### With an icon

A slotted `<svg>` is sized to `calc(var(--spacing) * 3)`.

```html live
<ui-badge variant="secondary">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
  Verified
</ui-badge>
<ui-badge variant="outline">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
  Pending
</ui-badge>
```

### Shapes

`shape="pill"` rounds the ends fully. `shape="round"` makes a 20px circle for counts, with tabular numbers so
the width stays steady as the count changes.

```html live
<ui-badge shape="pill">Pill</ui-badge>
<ui-badge variant="secondary" shape="pill">Beta</ui-badge>
<ui-badge shape="round">8</ui-badge>
<ui-badge variant="destructive" shape="round">99</ui-badge>
<ui-badge variant="outline" shape="round">20+</ui-badge>
```

### As a link

Wrap the badge in an `<a>` to make it a link. The badge itself has no interactive behaviour.

```html live
<a href="#badge"><ui-badge variant="outline">#release-notes</ui-badge></a>
```

### Status from state

Bind `variant` with `_variant` to pick the style from component state, using a lookup table.

```html live
<custom-element name="badge-status-demo">
  <script type="realm">
    const VARIANTS = { paid: "default", pending: "secondary", failed: "destructive" };

    const order = useState({
      status: "pending",
      get variant() {
        return VARIANTS[this.status];
      },
    });

    function cycle() {
      const statuses = Object.keys(VARIANTS);
      order.status = statuses[(statuses.indexOf(order.status) + 1) % statuses.length];
    }
  </script>
  <style type="realm">
    :host {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 3);
    }
  </style>
  <ui-badge _variant="#order.variant"><slot name="#order.status"></slot></ui-badge>
  <ui-button size="sm" variant="outline" onclick="cycle()">Next status</ui-button>
</custom-element>
<badge-status-demo></badge-status-demo>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-badge` | (default) | An inline label. Its default slot takes any content: text and an optional `<svg>` icon. |

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"default"` \| `"secondary"` \| `"destructive"` \| `"outline"` | `"default"` | Colour scheme of the badge. |
| `shape` | `"default"` \| `"pill"` \| `"round"` | `"default"` | `pill` is fully rounded. `round` is a 20px circle for counts, with tabular numbers. |

### CSS parts

None. The badge renders only a slot, so style the element itself.

### Accessibility

The badge has no role and is read as plain text. If the colour carries meaning (for example red for failed),
make sure the text says the same thing.
