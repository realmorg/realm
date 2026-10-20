---
title: Message
description: A chat message row that lays out an avatar, header, content and footer, aligned to the start or end.
group: Chat and content
order: 605
nav: Message
---

# Message

`ui-message` is one row of a conversation. It places an avatar next to a column with an optional header (name), the
message content (usually one or more [`ui-bubble`](/components/bubble/) elements) and an optional footer (time or status).
`align="end"` mirrors the row for messages sent by the current user. The avatar moves to the end and the content
aligns right.

The avatar, header and footer are child parts: `ui-message-avatar`, `ui-message-header` and `ui-message-footer`. They
place themselves, so source order does not matter for them. Everything else is the message content.

```html live
<div class="demo-medium demo-stack">
  <ui-message>
    <ui-message-avatar>
      <ui-avatar><ui-avatar-fallback>OM</ui-avatar-fallback></ui-avatar>
    </ui-message-avatar>
    <ui-message-header>Olivia Martin</ui-message-header>
    <ui-bubble variant="muted">Hi, how can I help you today?</ui-bubble>
    <ui-message-footer>10:02</ui-message-footer>
  </ui-message>
  <ui-message align="end">
    <ui-message-avatar>
      <ui-avatar><ui-avatar-fallback>ME</ui-avatar-fallback></ui-avatar>
    </ui-message-avatar>
    <ui-bubble align="end">I cannot sign in to my account.</ui-bubble>
    <ui-message-footer>10:03 · Read</ui-message-footer>
  </ui-message>
</div>
```

## Examples

### Several bubbles in one message

The content column stacks its children with a gap, so consecutive bubbles from the same sender go in one
`ui-message`.

```html live
<div class="demo-medium">
  <ui-message>
    <ui-message-avatar>
      <ui-avatar><ui-avatar-fallback>JL</ui-avatar-fallback></ui-avatar>
    </ui-message-avatar>
    <ui-message-header>Jackson Lee</ui-message-header>
    <ui-bubble variant="muted">The new build is up.</ui-bubble>
    <ui-bubble variant="muted">Release notes are in the usual place.</ui-bubble>
    <ui-attachment name="release-notes.pdf" size="84 KB" href="data:text/plain,Release%20notes">
      <ui-attachment-media>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 3H6v18h12V7Z" /><path d="M14 3v4h4" /></svg>
      </ui-attachment-media>
    </ui-attachment>
  </ui-message>
</div>
```

### Assistant reply

A ghost bubble without an avatar suits long-form replies.

```html live
<div class="demo-medium">
  <ui-message>
    <ui-message-header>Assistant</ui-message-header>
    <ui-bubble variant="ghost">To reset your password, open Settings, choose Security and click Reset password. A link
      is sent to your email address and stays valid for one hour.</ui-bubble>
  </ui-message>
</div>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-message` | (root) | The row, with the avatar beside a column with header, content and footer. |
| `ui-message-avatar` | `avatar` | Wraps a [`ui-avatar`](/components/avatar/), aligned to the bottom of the row. |
| `ui-message-header` | `header` | A small muted line above the content, such as the sender name and time. |
| `ui-message-footer` | `footer` | A small muted line below the content, such as the time or a read receipt. |

The parts set their own `slot`, so they go directly inside `ui-message` with no attributes. Any other child (bubbles,
attachments, code blocks) is the message content. The default slot of each part takes any content.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `align` | `"start"` \| `"end"` | `"start"` | `end` reverses the row and aligns the content to the end. |

### CSS parts

| Part | Description |
| --- | --- |
| `content` | The column with the header, content and footer. |

### Accessibility

`ui-message` adds no roles. Screen readers read the header, content and footer in source order, so put the sender
name in `ui-message-header` rather than relying on the avatar.
