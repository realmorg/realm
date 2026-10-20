---
title: Marker
description: A small muted line of text with an optional icon, for day separators, system notices and section labels in a conversation.
group: Chat and content
order: 604
nav: Marker
---

# Marker

`ui-marker` is a full-width row of small, muted text with an optional leading icon. Use it in a conversation for
things that are not messages: a date separator, "Ana joined the channel", or a label above a group of items. An
icon is a leading `<svg>` child, sized to `calc(var(--spacing) * 4)`.

```html live
<div class="demo-medium demo-stack">
  <ui-marker variant="separator">Today</ui-marker>
  <ui-marker>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-8 0v2" /><circle cx="12" cy="7" r="4" /></svg>
    Ana joined the channel
  </ui-marker>
</div>
```

## Examples

### Variants

`default` is plain text. `separator` draws a line on both sides of the text. `border` adds a line underneath.

```html live
<div class="demo-medium demo-stack">
  <ui-marker>Default marker</ui-marker>
  <ui-marker variant="separator">Separator marker</ui-marker>
  <ui-marker variant="border">Border marker</ui-marker>
</div>
```

### In a conversation

```html live
<div class="demo-medium demo-stack">
  <ui-marker variant="separator">Yesterday</ui-marker>
  <ui-message>
    <ui-message-avatar><ui-avatar><ui-avatar-fallback>AL</ui-avatar-fallback></ui-avatar></ui-message-avatar>
    <ui-bubble variant="muted">Can someone review my pull request?</ui-bubble>
  </ui-message>
  <ui-marker variant="separator">Today</ui-marker>
  <ui-message align="end">
    <ui-message-avatar><ui-avatar><ui-avatar-fallback>ME</ui-avatar-fallback></ui-avatar></ui-message-avatar>
    <ui-bubble align="end">Approved, merging now.</ui-bubble>
  </ui-message>
</div>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"default"` \| `"separator"` \| `"border"` | `"default"` | `separator` draws lines on both sides. `border` draws a line below. |

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-marker` | (root) | A full-width row of small muted text. |

The default slot takes the text and an optional leading `<svg>` icon.

### CSS parts

None. The shadow root is a single slot. Style the host.

### Accessibility

`ui-marker` adds no role. The separator lines are drawn with CSS and are not announced. Mark a decorative icon with
`aria-hidden="true"`.
