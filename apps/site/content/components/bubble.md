---
title: Bubble
description: A rounded chat bubble for message text, with colour variants, start or end alignment and a reactions row.
group: Chat and content
order: 602
nav: Bubble
---

# Bubble

`ui-bubble` is the rounded box around the text of a chat message. It sizes to its content up to 80% of the
container's width, wraps long words, and can align to the end of a flex column for messages sent by the current user.
A `ui-bubble-reactions` child adds a row below the bubble for reaction chips or small actions.

Use it inside [`ui-message`](/components/message/) together with an avatar and a timestamp, or on its own in a flex column.

```html live
<div class="demo-medium demo-stack-tight">
  <ui-message>
    <ui-bubble variant="muted">Did the deploy go out?</ui-bubble>
  </ui-message>
  <ui-message align="end">
    <ui-bubble align="end">Yes, about ten minutes ago. Everything is green.</ui-bubble>
  </ui-message>
</div>
```

## Examples

### Variants

`variant` is `default` (primary colour), `secondary`, `muted`, `outline` or `ghost`. Ghost removes the box and lets
the text use the full width, which suits long assistant replies.

```html live
<div class="demo-medium demo-stack-tight">
  <ui-bubble>Default</ui-bubble>
  <ui-bubble variant="secondary">Secondary</ui-bubble>
  <ui-bubble variant="muted">Muted</ui-bubble>
  <ui-bubble variant="outline">Outline</ui-bubble>
  <ui-bubble variant="ghost">Ghost bubbles have no background or padding, so longer text reads like a normal paragraph.</ui-bubble>
</div>
```

### Alignment

`align="end"` sets `align-self: flex-end`, which pushes the bubble to the end of a flex column such as the content
column of `ui-message`. Set `align` on the message as well so the avatar moves to the other side.

```html live
<div class="demo-medium">
  <ui-message>
    <ui-bubble variant="secondary">Start</ui-bubble>
    <ui-bubble align="end">End</ui-bubble>
  </ui-message>
</div>
```

### Reactions

Put reactions or small actions in `ui-bubble-reactions`. It places itself below the bubble.

```html live
<div class="demo-medium">
  <ui-bubble variant="muted">
    Lunch at noon?
    <ui-bubble-reactions>
      <ui-badge variant="outline" shape="pill">+1 2</ui-badge>
      <ui-badge variant="outline" shape="pill">Yes 1</ui-badge>
    </ui-bubble-reactions>
  </ui-bubble>
</div>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-bubble` | (root) | The rounded box around the message content. |
| `ui-bubble-reactions` | `reactions` | A wrapping row below the bubble for reactions or actions. |

`ui-bubble-reactions` sets its own `slot`, so it goes directly inside `ui-bubble` with no attributes. Everything
else in `ui-bubble` is the message content. The default slot of each part takes any content.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"default"` \| `"secondary"` \| `"muted"` \| `"outline"` \| `"ghost"` | `"default"` | Background and text colour. |
| `align` | `"start"` \| `"end"` | `"start"` | `end` sets `align-self: flex-end` on the bubble. |

### CSS parts

| Part | Description |
| --- | --- |
| `content` | The rounded box around the message content. |

### Accessibility

`ui-bubble` adds no roles, and the reading order is the source order. Put the conversation in a
[`ui-message-scroller`](/components/message-scroller/) so new messages are announced.
