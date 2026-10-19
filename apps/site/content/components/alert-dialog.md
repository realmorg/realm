---
title: Alert Dialog
description: A modal dialog with the alertdialog role that interrupts the user with a decision and only closes when an action is chosen.
group: Overlays
order: 301
nav: Alert Dialog
---

# Alert Dialog

`ui-alert-dialog` is a modal `<dialog>` with `role="alertdialog"` for confirmations that need an answer, such as
deleting data. Escape does nothing and there is no close button or backdrop dismissal: the dialog closes when the user
picks `ui-alert-dialog-cancel` or `ui-alert-dialog-action`. Each stores its `value` in `returnValue`.

`ui-alert-dialog-trigger` opens the dialog. The header holds the title and description; the footer holds the actions.

```html live
<ui-alert-dialog>
  <ui-alert-dialog-trigger><ui-button variant="outline">Delete account</ui-button></ui-alert-dialog-trigger>
  <ui-alert-dialog-header>
    <ui-alert-dialog-title>Are you absolutely sure?</ui-alert-dialog-title>
    <ui-alert-dialog-description>This permanently deletes your account and removes your data from our servers.</ui-alert-dialog-description>
  </ui-alert-dialog-header>
  <ui-alert-dialog-footer>
    <ui-alert-dialog-cancel>Cancel</ui-alert-dialog-cancel>
    <ui-alert-dialog-action value="delete" variant="destructive">Delete account</ui-alert-dialog-action>
  </ui-alert-dialog-footer>
</ui-alert-dialog>
```

## Examples

### Read the chosen action

The `close` event fires after the dialog closes. Read `returnValue` to find out which action was chosen:
`ui-alert-dialog-cancel` stores `"cancel"` and `ui-alert-dialog-action` stores `"action"` unless you set `value`.

```html live
<custom-element name="alert-dialog-result-demo">
  <script type="realm">
    const project = useState({ status: "Project \"Atlas\" is active." });

    const RESULTS = {
      archive: "Project \"Atlas\" was archived.",
      cancel: "Nothing changed.",
    };

    function closed() {
      project.status = RESULTS[refs.alert.returnValue] ?? project.status;
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

  <ui-alert-dialog ref="alert" onclose="closed()">
    <ui-alert-dialog-trigger><ui-button variant="outline">Archive project</ui-button></ui-alert-dialog-trigger>
    <ui-alert-dialog-header>
      <ui-alert-dialog-title>Archive this project?</ui-alert-dialog-title>
      <ui-alert-dialog-description>Archived projects are read-only. You can restore them from settings.</ui-alert-dialog-description>
    </ui-alert-dialog-header>
    <ui-alert-dialog-footer>
      <ui-alert-dialog-cancel>Cancel</ui-alert-dialog-cancel>
      <ui-alert-dialog-action value="archive">Archive</ui-alert-dialog-action>
    </ui-alert-dialog-footer>
  </ui-alert-dialog>
  <span><slot name="#project.status"></slot></span>
</custom-element>
<alert-dialog-result-demo></alert-dialog-result-demo>
```

### Open with a command

A button outside the dialog can open it with `commandfor` and `command="--show-modal"`. The `--close` command closes
it without changing `returnValue`.

```html live
<ui-button variant="outline" commandfor="alert-dialog-session" command="--show-modal">Sign out</ui-button>
<ui-alert-dialog id="alert-dialog-session">
  <ui-alert-dialog-header>
    <ui-alert-dialog-title>Your session will end</ui-alert-dialog-title>
    <ui-alert-dialog-description>Unsaved changes in open tabs will be lost.</ui-alert-dialog-description>
  </ui-alert-dialog-header>
  <ui-alert-dialog-footer>
    <ui-alert-dialog-cancel>Stay signed in</ui-alert-dialog-cancel>
    <ui-alert-dialog-action value="sign-out">Sign out</ui-alert-dialog-action>
  </ui-alert-dialog-footer>
</ui-alert-dialog>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-alert-dialog` | | The modal `<dialog>` with `role="alertdialog"`, a grid with a gap between the header, content and footer. |
| `ui-alert-dialog-trigger` | `trigger` | Its content, outside the dialog. A click on it focuses the element inside and opens the dialog. |
| `ui-alert-dialog-header` | `header` | A column for the title and description. |
| `ui-alert-dialog-title` | (default) | An `<h2>` in `var(--text-lg)` semibold. Its text becomes the dialog's accessible name. |
| `ui-alert-dialog-description` | (default) | A `<p>` in muted `var(--text-sm)`. Its text becomes the dialog's accessible description. |
| `ui-alert-dialog-footer` | `footer` | A row of actions, aligned to the end and wrapped on narrow screens. |
| `ui-alert-dialog-cancel` | (default) | An outline `ui-button`. Closes the dialog with its `value`. |
| `ui-alert-dialog-action` | (default) | A `ui-button` in the chosen `variant`. Closes the dialog with its `value`. |

Parts with a slot assign themselves to it, so you do not write `slot`. Other content goes between the header and the
footer.

### ui-alert-dialog attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | boolean | `false` | Whether the dialog is open. Setting it opens the dialog modally; reflects to the attribute. |

### ui-alert-dialog-action attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | string | `"action"` | Stored in `returnValue` when the action closes the dialog. |
| `variant` | `"default"` \| `"destructive"` | `"default"` | The button variant. |

### ui-alert-dialog-cancel attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | string | `"cancel"` | Stored in `returnValue` when the cancel button closes the dialog. |

### Properties and methods

| Name | Description |
| --- | --- |
| `showModal()` | Opens the dialog modally. |
| `show()` | Same as `showModal()`. |
| `close(value?)` | Closes the dialog. When `value` is given it becomes `returnValue`. |
| `returnValue` | Read-only. The `value` of the chosen action or cancel part, or the value passed to `close(value)`. |
| `open` | Boolean property mirroring the attribute. |

### Commands

| Command | Action |
| --- | --- |
| `--show-modal` | Opens the dialog. |
| `--close` | Closes the dialog. |
| `--request-close` | Same as `--close`: the alert dialog has no cancel step. |

`ui-button` also accepts the commands without the `--` prefix; a plain `<button>` needs the prefix.

### Events

| Event | Detail | Description |
| --- | --- | --- |
| `close` | none | Fired after the dialog has closed. Does not bubble. |

### CSS parts

| Element | Part | Description |
| --- | --- | --- |
| `ui-alert-dialog` | `dialog` | The native `<dialog>` element. |
| `ui-alert-dialog-title` | `title` | The `<h2>`. |
| `ui-alert-dialog-description` | `description` | The `<p>`. |
| `ui-alert-dialog-action`, `ui-alert-dialog-cancel` | `button` | The inner `ui-button`. |
| `ui-alert-dialog-trigger` | `trigger` | The wrapper that listens for clicks. |

### Accessibility

- The inner `<dialog>` has `role="alertdialog"` and is opened with `showModal()`, so the page behind it is inert.
- The text of the title and description parts becomes the dialog's `aria-label` and `aria-description`.
- On open, focus moves to the first action. Put the safe choice (Cancel) first.
- Escape is ignored and there is no backdrop dismissal, so the user must make a choice.
- On close, focus returns to the trigger.
