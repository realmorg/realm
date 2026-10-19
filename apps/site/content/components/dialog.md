---
title: Dialog
description: A modal dialog built on the native dialog element, with a trigger, header, title, description, footer, close parts and optional side placement.
group: Overlays
order: 304
nav: Dialog
---

# Dialog

`ui-dialog` renders a native `<dialog>` in its shadow root and opens it with `showModal()`. The browser puts it in the
top layer, makes the rest of the page inert, moves focus into the dialog and returns focus to the trigger when it
closes. Escape, a click on the backdrop and the built-in close button all ask the dialog to close; a cancelable
`cancel` event lets you keep it open.

Build it from parts: `ui-dialog-trigger` opens it, `ui-dialog-header` holds the `ui-dialog-title` and
`ui-dialog-description`, the content goes in between, and `ui-dialog-footer` holds the actions. `ui-dialog-close`
closes the dialog when the element inside it is clicked.

```html live
<ui-dialog>
  <ui-dialog-trigger><ui-button variant="outline">Edit profile</ui-button></ui-dialog-trigger>
  <ui-dialog-header>
    <ui-dialog-title>Edit profile</ui-dialog-title>
    <ui-dialog-description>Make changes to your profile here. Click save when you are done.</ui-dialog-description>
  </ui-dialog-header>
  <ui-field>
    <ui-label for="dialog-profile-name">Name</ui-label>
    <ui-input id="dialog-profile-name" value="Pedro Duarte"></ui-input>
  </ui-field>
  <ui-dialog-footer>
    <ui-dialog-close><ui-button variant="outline">Cancel</ui-button></ui-dialog-close>
    <ui-dialog-close value="saved"><ui-button>Save changes</ui-button></ui-dialog-close>
  </ui-dialog-footer>
</ui-dialog>
```

## Examples

### Open and close with commands

The trigger part is the usual way to open the dialog. A button elsewhere on the page can open it too: `ui-dialog`
listens for the `command` event that `commandfor` buttons send. It understands `--show-modal`, `--close` and
`--request-close`, with or without the `--` prefix. `--close` closes straight away; `--request-close` fires `cancel`
first, like Escape does. `ui-button` accepts either form. On a plain `<button>`, use the `--` form: browsers with native
invoker commands only forward custom (`--`) commands to elements that are not a native `<dialog>`.

```html live
<ui-button commandfor="dialog-commands" command="--show-modal">Share</ui-button>
<ui-dialog id="dialog-commands">
  <ui-dialog-header>
    <ui-dialog-title>Share link</ui-dialog-title>
    <ui-dialog-description>Anyone with this link can view the document.</ui-dialog-description>
  </ui-dialog-header>
  <ui-input value="https://example.com/docs/a1b2c3" aria-label="Link" readonly></ui-input>
  <ui-dialog-footer>
    <ui-button variant="secondary" commandfor="dialog-commands" command="--request-close">Done</ui-button>
  </ui-dialog-footer>
</ui-dialog>
```

### Read the result

`ui-dialog-close value="…"` closes the dialog and stores the value in `returnValue`. From script, `close(value)` does
the same. The `close` event fires after the dialog has closed. Escape, the backdrop and the close button close it
without changing `returnValue`.

```html live
<custom-element name="dialog-script-demo">
  <script type="realm">
    const plan = useState({ current: "Free" });

    function closed() {
      plan.current = refs.dialog.returnValue || plan.current;
    }
  </script>

  <style type="realm">
    :host {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 4);
      font-size: var(--text-sm);
    }
  </style>

  <ui-dialog ref="dialog" onclose="closed()">
    <ui-dialog-trigger><ui-button variant="outline">Change plan</ui-button></ui-dialog-trigger>
    <ui-dialog-header>
      <ui-dialog-title>Choose a plan</ui-dialog-title>
      <ui-dialog-description>You can switch plans at any time.</ui-dialog-description>
    </ui-dialog-header>
    <ui-dialog-footer>
      <ui-dialog-close value="Free"><ui-button variant="outline">Free</ui-button></ui-dialog-close>
      <ui-dialog-close value="Pro"><ui-button>Pro</ui-button></ui-dialog-close>
    </ui-dialog-footer>
  </ui-dialog>
  <span>Current plan: <strong><slot name="#plan.current"></slot></strong></span>
</custom-element>
<dialog-script-demo></dialog-script-demo>
```

### Side placement

`side` turns the dialog into a panel attached to an edge of the viewport: `top`, `right`, `bottom` or `left`. The
default is `center`. [Sheet](/components/sheet/) is a shorthand for this.

```html live
<custom-element name="dialog-side-demo">
  <script type="realm">
    const panel = useState({ side: "right" });

    function open(side) {
      panel.side = side;
      refs.dialog.showModal();
    }
  </script>

  <style type="realm">
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: calc(var(--spacing) * 2);
    }
  </style>

  <ui-button variant="outline" onclick="open('top')">Top</ui-button>
  <ui-button variant="outline" onclick="open('right')">Right</ui-button>
  <ui-button variant="outline" onclick="open('bottom')">Bottom</ui-button>
  <ui-button variant="outline" onclick="open('left')">Left</ui-button>
  <ui-dialog ref="dialog" _side="#panel.side">
    <ui-dialog-header>
      <ui-dialog-title>Notifications</ui-dialog-title>
      <ui-dialog-description>Choose what you want to be notified about.</ui-dialog-description>
    </ui-dialog-header>
    <ui-dialog-footer>
      <ui-dialog-close><ui-button>Close</ui-button></ui-dialog-close>
    </ui-dialog-footer>
  </ui-dialog>
</custom-element>
<dialog-side-demo></dialog-side-demo>
```

### Persistent

`persistent` ignores Escape and backdrop clicks, so the dialog only closes through its own buttons. Combine it with
`hide-close` to remove the close button in the corner.

```html live
<ui-dialog persistent hide-close>
  <ui-dialog-trigger><ui-button variant="outline">Accept terms</ui-button></ui-dialog-trigger>
  <ui-dialog-header>
    <ui-dialog-title>Terms of service</ui-dialog-title>
    <ui-dialog-description>Please accept the updated terms to continue.</ui-dialog-description>
  </ui-dialog-header>
  <ui-dialog-footer>
    <ui-dialog-close value="declined"><ui-button variant="outline">Decline</ui-button></ui-dialog-close>
    <ui-dialog-close value="accepted"><ui-button>Accept</ui-button></ui-dialog-close>
  </ui-dialog-footer>
</ui-dialog>
```

### Keep it open on cancel

Escape, a backdrop click, the close button, `requestClose()` and the `--request-close` command fire a cancelable
`cancel` event before closing. Call `preventDefault()` to keep the dialog open, for example while a form has unsaved
changes. `close()`, `--close` and `ui-dialog-close` skip this step.

```html live
<custom-element name="dialog-cancel-demo">
  <script type="realm">
    function cancelled(event) {
      if (!refs.note.value) return;
      event.preventDefault();
      document.dispatchEvent(new CustomEvent("toast", { detail: { title: "Save or clear your note first" } }));
    }

    function save() {
      refs.note.value = "";
    }
  </script>

  <ui-dialog oncancel="cancelled(event)">
    <ui-dialog-trigger><ui-button variant="outline">Write a note</ui-button></ui-dialog-trigger>
    <ui-dialog-header>
      <ui-dialog-title>New note</ui-dialog-title>
      <ui-dialog-description>Type something, then try Escape or the close button.</ui-dialog-description>
    </ui-dialog-header>
    <ui-textarea ref="note" aria-label="Note" placeholder="Remember to..."></ui-textarea>
    <ui-dialog-footer>
      <ui-dialog-close value="saved"><ui-button onclick="save()">Save</ui-button></ui-dialog-close>
    </ui-dialog-footer>
  </ui-dialog>
</custom-element>
<dialog-cancel-demo></dialog-cancel-demo>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-dialog` | | The modal `<dialog>`, a grid with a gap between the header, content and footer, plus the close button. |
| `ui-dialog-trigger` | `trigger` | Its content, outside the dialog. A click on it focuses the element inside and opens the dialog. |
| `ui-dialog-header` | `header` | A column for the title and description at the top of the dialog. |
| `ui-dialog-title` | (default) | An `<h2>` in `var(--text-lg)` semibold. Its text becomes the dialog's accessible name. |
| `ui-dialog-description` | (default) | A `<p>` in muted `var(--text-sm)`. Its text becomes the dialog's accessible description. |
| `ui-dialog-footer` | `footer` | A row of actions at the bottom, aligned to the end and wrapped on narrow screens. |
| `ui-dialog-close` | (default) | Its content. A click on it closes the dialog without firing `cancel`. |

Parts with a slot assign themselves to it, so you do not write `slot`. Everything else goes in the default slot, the
dialog body, in source order.

### ui-dialog attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | boolean | `false` | Whether the dialog is open. Setting it opens the dialog modally; reflects to the attribute. |
| `side` | `"center"` \| `"top"` \| `"right"` \| `"bottom"` \| `"left"` | `"center"` | Where the dialog sits. Any value other than `center` attaches it to that edge as a full-height or full-width panel. |
| `hide-close` | boolean | `false` | Hides the close button in the top corner. Property name: `hideClose`. |
| `persistent` | boolean | `false` | Ignores Escape and backdrop clicks. The close button and `requestClose()` still work. |
| `label` | string | | Accessible name when there is no `ui-dialog-title`. |
| `description` | string | | Accessible description when there is no `ui-dialog-description`. |

### ui-dialog-close attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | string | | Stored in the dialog's `returnValue` when it closes. Leave it out to keep the previous value. |

### Properties and methods

| Name | Description |
| --- | --- |
| `showModal()` | Opens the dialog modally. |
| `show()` | Same as `showModal()`; the dialog is always modal. |
| `close(value?)` | Closes the dialog. When `value` is given it becomes `returnValue`. Does not fire `cancel`. |
| `requestClose(value?)` | Fires `cancel`; closes with `value` unless the event was cancelled. |
| `returnValue` | Read-only. The value passed to the last `close(value)` or `ui-dialog-close`, or `""`. |
| `open` | Boolean property mirroring the attribute. |

### Commands

| Command | Action |
| --- | --- |
| `--show-modal` | Opens the dialog. |
| `--close` | Closes the dialog. |
| `--request-close` | Same as `requestClose()`. |

`ui-button` also accepts `show-modal`, `close` and `request-close` without the prefix.

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `cancel` | none | Fired before the dialog closes from Escape, a backdrop click, the close button, `requestClose()` or `--request-close`. Cancelable; does not bubble. |
| `close` | none | Fired after the dialog has closed, however it was closed. Does not bubble. |

### CSS parts

| Element | Part | Description |
| --- | --- | --- |
| `ui-dialog` | `dialog` | The native `<dialog>` element. Style the backdrop with `ui-dialog::part(dialog)::backdrop`. |
| `ui-dialog` | `body` | Wrapper around the default slot. |
| `ui-dialog` | `close` | The close button in the top corner. |
| `ui-dialog-title` | `title` | The `<h2>`. |
| `ui-dialog-description` | `description` | The `<p>`. |
| `ui-dialog-trigger` | `trigger` | The wrapper that listens for clicks. |
| `ui-dialog-close` | `close` | The wrapper that listens for clicks. |

### Accessibility

- The inner `<dialog>` is opened with `showModal()`, so the page behind it is inert and focus is trapped inside.
- On open, focus moves to the first focusable element, or to an element with `autofocus`. On close it returns to the
  trigger.
- The text of `ui-dialog-title` and `ui-dialog-description` becomes the dialog's `aria-label` and
  `aria-description`, and updates when it changes. The title is also an `<h2>` heading.
- Escape closes the dialog unless `persistent` is set or the `cancel` event is cancelled.
- The close button has `aria-label="Close"`.
