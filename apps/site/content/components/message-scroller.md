---
title: Message Scroller
description: A scrolling chat log that sticks to the newest message and offers a jump-to-latest button when the user scrolls up.
group: Chat and content
order: 606
nav: Message Scroller
---

# Message Scroller

`ui-message-scroller` is the scrolling area of a chat. It starts scrolled to the bottom and stays pinned there as
messages are added, but only while the user is already at (or within `threshold` pixels of) the bottom. When the user
scrolls up to read history, new messages no longer move the view and a "Jump to latest" button appears. Clicking it
scrolls smoothly back down.

Give the scroller a height with the `height` attribute (in spacing units, `height="60"` is
`calc(var(--spacing) * 60)`) or let a flex or grid layout size it. It is always 100% wide. The viewport has
`role="log"` and `aria-live="polite"`.

```html live
<custom-element name="message-scroller-demo">
  <script type="realm">
    const chat = useState({
      next: 6,
      messages: [
        { id: 1, align: "start", text: "Are we still on for the launch review?" },
        { id: 2, align: "end", text: "Yes, 3pm in the big room." },
        { id: 3, align: "start", text: "Great. Can you bring the metrics?" },
        { id: 4, align: "end", text: "Already in the deck." },
        { id: 5, align: "start", text: "Perfect, see you there." },
      ],
    });

    const REPLIES = ["On my way.", "Running five minutes late.", "Room changed to 4B.", "Starting now."];

    function send() {
      const text = REPLIES[chat.next % REPLIES.length];
      chat.messages.push({ id: chat.next, align: chat.next % 2 ? "start" : "end", text });
      chat.next++;
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
      width: 100%;
      max-width: calc(var(--spacing) * 112);
    }
    ui-message-scroller {
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
    }
    .messages {
      display: flex;
      flex-direction: column;
      gap: calc(var(--spacing) * 2);
      padding: calc(var(--spacing) * 4);
    }
  </style>

  <ui-message-scroller height="60">
    <div class="messages">
      <repeat-list of="#chat.messages" as="message" key="id">
        <ui-bubble variant="muted" _align="#message.align"><slot name="#message.text"></slot></ui-bubble>
      </repeat-list>
    </div>
  </ui-message-scroller>
  <ui-button variant="outline" onclick="send()">Receive a message</ui-button>
</custom-element>
<message-scroller-demo></message-scroller-demo>
```

Scroll up in the log and click "Receive a message". The view stays where it is and "Jump to latest" appears.

## Examples

### Threshold

`threshold` is how close to the bottom, in pixels, still counts as "at the bottom" (default `48`). Use `0` to only
follow new messages when the view is exactly at the end.

```html live
<div class="demo-medium">
  <ui-message-scroller threshold="0" height="40">
    <div class="demo-stack">
      <ui-marker variant="separator">Monday</ui-marker>
      <ui-message>
        <ui-message-avatar><ui-avatar><ui-avatar-fallback>AL</ui-avatar-fallback></ui-avatar></ui-message-avatar>
        <ui-bubble variant="muted">Morning! Standup moved to 9:30.</ui-bubble>
      </ui-message>
      <ui-message align="end">
        <ui-message-avatar><ui-avatar><ui-avatar-fallback>ME</ui-avatar-fallback></ui-avatar></ui-message-avatar>
        <ui-bubble align="end">Thanks for the heads-up.</ui-bubble>
      </ui-message>
      <ui-marker variant="separator">Today</ui-marker>
      <ui-message>
        <ui-message-avatar><ui-avatar><ui-avatar-fallback>AL</ui-avatar-fallback></ui-avatar></ui-message-avatar>
        <ui-bubble variant="muted">Release is tagged.</ui-bubble>
      </ui-message>
      <ui-message align="end">
        <ui-message-avatar><ui-avatar><ui-avatar-fallback>ME</ui-avatar-fallback></ui-avatar></ui-message-avatar>
        <ui-bubble align="end">Shipping it.</ui-bubble>
      </ui-message>
    </div>
  </ui-message-scroller>
</div>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `threshold` | number | `48` | Distance from the bottom, in pixels, within which the scroller stays pinned to new content. Minimum `0`. |
| `height` | number | | Height in spacing units, so `height="60"` is `calc(var(--spacing) * 60)`. Without it, size the scroller from its layout. |

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-message-scroller` | (root) | The scrolling log and the "Jump to latest" button. |

The default slot takes the messages and any other content. Any change inside (added nodes, text changes) scrolls to
the bottom while pinned.

### CSS parts

| Part | Description |
| --- | --- |
| `viewport` | The scrolling element (`role="log"`, `aria-live="polite"`). |

### CSS states and custom properties

| Name | Description |
| --- | --- |
| `:state(attr-height)` | Matches while `height` is set. The height comes from `var(--attr-height)`. |
| `:state(state-scroll-pinned)` | Matches while the view is within `threshold` of the bottom. The "Jump to latest" button is hidden in this state. |

### Accessibility

- The viewport has `role="log"` and `aria-live="polite"`, so screen readers announce new messages.
- The "Jump to latest" button is a regular `ui-button`, reachable with Tab while it is shown.
