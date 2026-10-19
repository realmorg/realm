---
title: Tabs
description: A set of panels shown one at a time, switched with a row or column of tab buttons.
group: Navigation
order: 408
nav: Tabs
---

# Tabs

`ui-tabs` holds a `ui-tabs-list` of `ui-tabs-trigger` buttons and one `ui-tabs-content` panel per trigger. A trigger
and a panel belong together when they share a `value`. Only the selected panel is visible; the others get the
`hidden` attribute. The tabs follow the ARIA tabs pattern with automatic activation, so moving focus with the arrow
keys also selects the tab.

The tabs fill the width of their container; the list itself is as wide as its triggers.

```html live
<div class="demo-narrow">
  <ui-tabs value="account">
    <ui-tabs-list>
      <ui-tabs-trigger value="account">Account</ui-tabs-trigger>
      <ui-tabs-trigger value="password">Password</ui-tabs-trigger>
    </ui-tabs-list>
    <ui-tabs-content value="account">
      <ui-card>
        <ui-card-header>
          <ui-card-title>Account</ui-card-title>
          <ui-card-description>Make changes to your account here.</ui-card-description>
        </ui-card-header>
        <ui-card-content>
          <ui-field><ui-label for="tabs-name">Name</ui-label><ui-input id="tabs-name" value="Pedro Duarte"></ui-input></ui-field>
        </ui-card-content>
      </ui-card>
    </ui-tabs-content>
    <ui-tabs-content value="password">
      <ui-card>
        <ui-card-header>
          <ui-card-title>Password</ui-card-title>
          <ui-card-description>Change your password here.</ui-card-description>
        </ui-card-header>
        <ui-card-content>
          <ui-field><ui-label for="tabs-password">Current password</ui-label><ui-input id="tabs-password" type="password"></ui-input></ui-field>
        </ui-card-content>
      </ui-card>
    </ui-tabs-content>
  </ui-tabs>
</div>
```

## Examples

### Disabled tab

A `disabled` trigger is dimmed, cannot be selected and is skipped by the arrow keys.

```html live
<div class="demo-narrow">
  <ui-tabs value="overview">
    <ui-tabs-list>
      <ui-tabs-trigger value="overview">Overview</ui-tabs-trigger>
      <ui-tabs-trigger value="analytics">Analytics</ui-tabs-trigger>
      <ui-tabs-trigger value="reports" disabled>Reports</ui-tabs-trigger>
    </ui-tabs-list>
    <ui-tabs-content value="overview"><p class="demo-text">Revenue is up 12% this month.</p></ui-tabs-content>
    <ui-tabs-content value="analytics"><p class="demo-text">Visitors by country and device.</p></ui-tabs-content>
    <ui-tabs-content value="reports"><p class="demo-text">Reports are being generated.</p></ui-tabs-content>
  </ui-tabs>
</div>
```

If `value` is missing, unknown or names a disabled trigger, the first enabled trigger is selected.

### Vertical

`orientation="vertical"` stacks the triggers in a column beside the panels. Up and Down arrows move between them.

```html live
<div class="demo-narrow">
  <ui-tabs orientation="vertical" value="general">
    <ui-tabs-list>
      <ui-tabs-trigger value="general">General</ui-tabs-trigger>
      <ui-tabs-trigger value="members">Members</ui-tabs-trigger>
      <ui-tabs-trigger value="billing">Billing</ui-tabs-trigger>
    </ui-tabs-list>
    <ui-tabs-content value="general"><p class="demo-text">General settings for the workspace.</p></ui-tabs-content>
    <ui-tabs-content value="members"><p class="demo-text">Invite people and manage roles.</p></ui-tabs-content>
    <ui-tabs-content value="billing"><p class="demo-text">Plan, invoices and payment method.</p></ui-tabs-content>
  </ui-tabs>
</div>
```

### Icons in triggers

Icons inside a trigger are sized to `calc(var(--spacing) * 4)`.

```html live
<ui-tabs value="preview">
  <ui-tabs-list>
    <ui-tabs-trigger value="preview">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
      Preview
    </ui-tabs-trigger>
    <ui-tabs-trigger value="code">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></svg>
      Code
    </ui-tabs-trigger>
  </ui-tabs-list>
</ui-tabs>
```

### Tabs as a filter

A `ui-tabs` without `ui-tabs-content` works as a segmented control: listen for `change` and read `value`. The
dashboard example uses this to switch the data of a chart.

```html live
<custom-element name="tabs-filter-demo">
  <script type="realm">
    const filter = useState({ range: "7d" });

    function changed(tabs) {
      filter.range = tabs.value;
    }
  </script>
  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      justify-items: center;
    }
    p {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--muted-foreground);
    }
  </style>
  <ui-tabs value="7d" onchange="changed(this)">
    <ui-tabs-list>
      <ui-tabs-trigger value="24h">24 hours</ui-tabs-trigger>
      <ui-tabs-trigger value="7d">7 days</ui-tabs-trigger>
      <ui-tabs-trigger value="30d">30 days</ui-tabs-trigger>
    </ui-tabs-list>
  </ui-tabs>
  <p>Showing data for: <slot name="#filter.range"></slot></p>
</custom-element>
<tabs-filter-demo></tabs-filter-demo>
```

## API

### Parts

| Element | Fills | Renders |
| --- | --- | --- |
| `ui-tabs` | | A flex container for the list and the panels. Fills its container's width. |
| `ui-tabs-list` | the default slot of `ui-tabs` | A `role="tablist"` pill around the triggers, with `aria-orientation` and arrow-key navigation. |
| `ui-tabs-trigger` | the default slot of `ui-tabs-list` | A `<button role="tab">` with `aria-selected` and a roving `tabindex`. |
| `ui-tabs-content` | the default slot of `ui-tabs` | The panel, with `role="tabpanel"`. Hidden unless its `value` is selected. |

### Attributes

#### ui-tabs

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | string | | The `value` of the selected trigger. If it is missing, unknown or names a disabled trigger, the first enabled trigger is selected. Updated when the user selects a tab. |
| `orientation` | `"horizontal"` \| `"vertical"` | `"horizontal"` | Lays the list out as a row above the panels or a column beside them, and sets which arrow keys move between tabs. |

#### ui-tabs-trigger

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | string | | Identifies the tab. Selecting it shows the `ui-tabs-content` with the same `value`. |
| `disabled` | boolean | `false` | Disables the tab. |

#### ui-tabs-content

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | string | | The `value` of the trigger that shows this panel. |

`ui-tabs-list` has no attributes.

### Events

| Event | Element | Description |
| --- | --- | --- |
| `change` | `ui-tabs` | Fires when the user selects a different tab, by click or keyboard. Read the new `value` from the element. Bubbles. |

### Child elements

`ui-tabs` watches its `ui-tabs-list` and `ui-tabs-content` children and the `value` and `disabled` attributes of
the triggers and panels, so tabs can be added, removed or renamed at any time.

### CSS parts

| Part | Element | Description |
| --- | --- | --- |
| `list` | `ui-tabs-list` | The `role="tablist"` container. |
| `trigger` | `ui-tabs-trigger` | The tab button. The selected one has `aria-selected="true"`. |

### Accessibility

- The list has `role="tablist"` and `aria-orientation`. Each trigger renders a `<button role="tab">` with
  `aria-selected`.
- Each `ui-tabs-content` has `role="tabpanel"` and is labelled by its trigger.
- Only the selected tab is in the Tab order. Tab moves from it into the visible panel.
- Left and Right arrows (Up and Down when vertical) move to the previous or next tab and select it, wrapping at the
  ends. Home and End select the first and last tab. Disabled tabs are skipped.
- In a right-to-left context, such as inside [Direction](/components/direction/) with `dir="rtl"`, Left and Right
  are swapped.
