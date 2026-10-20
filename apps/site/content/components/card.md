---
title: Card
description: A bordered container with a header, body and footer for grouping related content and actions.
group: Display
order: 204
nav: Card
---

# Card

`ui-card` is a bordered, rounded panel. You build it from parts: `ui-card-header` (with `ui-card-title`,
`ui-card-description` and an optional `ui-card-action`), `ui-card-content` and `ui-card-footer`. Every part goes in
the default slot, in source order, and takes any content.

```html live
<div class="demo-narrow">
  <ui-card>
    <ui-card-header>
      <ui-card-title>Create project</ui-card-title>
      <ui-card-description>Deploy your new project in one click.</ui-card-description>
    </ui-card-header>
    <ui-card-content>
      <ui-field>
        <ui-label for="card-project-name">Name</ui-label>
        <ui-input id="card-project-name" placeholder="Name of your project"></ui-input>
      </ui-field>
    </ui-card-content>
    <ui-card-footer justify="between">
      <ui-button variant="outline">Cancel</ui-button>
      <ui-button>Deploy</ui-button>
    </ui-card-footer>
  </ui-card>
</div>
```

## Examples

### Header action

`ui-card-action` holds a button, badge or menu. It sits to the right of the title and description and spans both
rows.

```html live
<div class="demo-narrow">
  <ui-card>
    <ui-card-header>
      <ui-card-title>Notifications</ui-card-title>
      <ui-card-description>You have 3 unread messages.</ui-card-description>
      <ui-card-action><ui-button variant="ghost" size="sm">Mark all read</ui-button></ui-card-action>
    </ui-card-header>
    <ui-card-content>
      <p class="demo-text">Your call has been confirmed for Friday at 10:00.</p>
    </ui-card-content>
  </ui-card>
</div>
```

### Stat card

A card does not need a title. Use only a description and the content for a compact metric.

```html live
<div class="demo-narrow">
  <ui-card>
    <ui-card-header>
      <ui-card-description>Total revenue</ui-card-description>
      <ui-card-action><ui-badge variant="outline">+20.1%</ui-badge></ui-card-action>
    </ui-card-header>
    <ui-card-content>
      <p class="demo-value">$45,231.89</p>
    </ui-card-content>
  </ui-card>
</div>
```

### Login form

The content can hold a whole form. `orientation="vertical"` on the footer stacks its children and stretches them to
the full width, which suits a single submit button.

```html live
<div class="demo-narrow">
  <ui-card>
    <ui-card-header>
      <ui-card-title>Log in to your account</ui-card-title>
      <ui-card-description>Enter your email below to log in.</ui-card-description>
      <ui-card-action><ui-button variant="link">Sign up</ui-button></ui-card-action>
    </ui-card-header>
    <ui-card-content>
      <form id="card-login" onsubmit="event.preventDefault()">
        <ui-field-group>
          <ui-field>
            <ui-label for="card-email">Email</ui-label>
            <ui-input id="card-email" name="email" type="email" placeholder="m@example.com"></ui-input>
          </ui-field>
          <ui-field>
            <ui-label for="card-password">Password</ui-label>
            <ui-input id="card-password" name="password" type="password"></ui-input>
          </ui-field>
        </ui-field-group>
      </form>
    </ui-card-content>
    <ui-card-footer orientation="vertical">
      <ui-button type="submit" form="card-login">Login</ui-button>
      <ui-button variant="outline">Login with Google</ui-button>
    </ui-card-footer>
  </ui-card>
</div>
```

### Repeated from state

Cards are often rendered from a list with `<repeat-list>`.

```html live
<custom-element name="card-stats-demo">
  <script type="realm">
    const dashboard = useState({
      stats: [
        { id: "revenue", label: "Revenue", value: "$45,231", change: "+20.1% from last month" },
        { id: "subscriptions", label: "Subscriptions", value: "+2,350", change: "+180.1% from last month" },
        { id: "active", label: "Active now", value: "+573", change: "+201 since last hour" },
      ],
    });
  </script>
  <style type="realm">
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(calc(var(--spacing) * 48), 1fr));
      gap: calc(var(--spacing) * 4);
      width: 100%;
    }
    .value {
      margin: 0;
      font-size: var(--text-2xl);
      font-weight: var(--font-weight-bold);
    }
    .change {
      margin: calc(var(--spacing) * 1) 0 0;
      font-size: var(--text-xs);
      color: var(--muted-foreground);
    }
  </style>
  <repeat-list of="#dashboard.stats" as="stat" key="id">
    <ui-card>
      <ui-card-header>
        <ui-card-description><slot name="#stat.label"></slot></ui-card-description>
      </ui-card-header>
      <ui-card-content>
        <p class="value"><slot name="#stat.value"></slot></p>
        <p class="change"><slot name="#stat.change"></slot></p>
      </ui-card-content>
    </ui-card>
  </repeat-list>
</custom-element>
<card-stats-demo></card-stats-demo>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-card` | | The bordered panel. A flex column with a gap between its parts. Fills its container's width. |
| `ui-card-header` | (default) | A grid for the title, description and action, with horizontal padding. |
| `ui-card-title` | (default) | A heading (level 3 unless `level` says otherwise) in `var(--text-base)` semibold. Place it in `ui-card-header`. |
| `ui-card-description` | (default) | Supporting text in muted `var(--text-sm)`. Place it in `ui-card-header`. |
| `ui-card-action` | (default) | Content in the header's second column, aligned to the end and spanning the title and description rows. |
| `ui-card-content` | (default) | The body, with horizontal padding. |
| `ui-card-footer` | (default) | A row of actions at the bottom, with a gap and horizontal padding. |

Every part has a single default slot that takes any content.

### ui-card-title attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `level` | number (1 to 6) | `3` | The heading level. Use `1` for a card that is the page's main content and `2` for cards directly under the page heading. |

### ui-card-footer attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `justify` | `"between"` \| `"end"` | | Spreads the children apart, or pushes them to the end. Without it they start at the left. |
| `orientation` | `"vertical"` | | Stacks the children and stretches them to the full width. |

The other parts have no attributes.

### CSS parts

| Element | Part | Description |
| --- | --- | --- |
| `ui-card-title` | `title` | The heading element (`role="heading"` with `aria-level`) around the title text. |

### Accessibility

The card has no role. `ui-card-title` renders a heading, level 3 by default, so the card shows up in the document
outline. Set `level` so the heading follows the page's outline without skipping levels. Wrap the
card in `<article>` or `<section>` when it represents a standalone item.
