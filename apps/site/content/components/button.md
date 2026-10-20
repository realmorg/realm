---
title: Button
description: A form-associated button with variants and sizes that can submit or reset a form, open popovers and invoke commands on dialogs.
group: Forms
order: 101
nav: Button
---

# Button

`ui-button` wraps a native `<button>` in its shadow root and adds visual variants and sizes. It is form-associated:
with `type="submit"` or `type="reset"` it submits or resets the form it sits in, even though the inner button lives
in a shadow root. It also forwards the native invoker attributes `popovertarget`, `commandfor` and `command`, so it
can open popovers and dialogs without script.

Unlike a native `<button>`, the default `type` is `button`, so a `ui-button` inside a form does nothing until you
set `type="submit"` or `type="reset"`.

```html live
<ui-button>Button</ui-button>
```

## Examples

### Variants

Set `variant` to `default`, `destructive`, `outline`, `secondary`, `ghost` or `link`.

```html live
<ui-button>Default</ui-button>
<ui-button variant="secondary">Secondary</ui-button>
<ui-button variant="destructive">Destructive</ui-button>
<ui-button variant="outline">Outline</ui-button>
<ui-button variant="ghost">Ghost</ui-button>
<ui-button variant="link">Link</ui-button>
```

### Sizes

Text buttons come in `xs`, `sm`, `default` and `lg`.

```html live
<ui-button size="xs">Extra small</ui-button>
<ui-button size="sm">Small</ui-button>
<ui-button>Default</ui-button>
<ui-button size="lg">Large</ui-button>
```

### Icon buttons

The `icon`, `icon-xs`, `icon-sm` and `icon-lg` sizes make a square button. A slotted `<svg>` is sized to the button
text automatically. Give icon-only buttons an accessible name with `aria-label`.

```html live
<ui-button variant="outline" size="icon-xs" aria-label="Add">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
</ui-button>
<ui-button variant="outline" size="icon-sm" aria-label="Add">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
</ui-button>
<ui-button variant="outline" size="icon" aria-label="Add">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
</ui-button>
<ui-button variant="outline" size="icon-lg" aria-label="Add">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
</ui-button>
```

### With an icon

Put an `<svg>` before or after the label. The button adds a gap between them.

```html live
<ui-button>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12v8h16v-8M12 3v12M7 8l5-5 5 5" /></svg>
  Upload
</ui-button>
<ui-button variant="outline">
  Next
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
</ui-button>
```

### Loading

Combine `disabled` with a `ui-spinner` while work is in progress.

```html live
<ui-button disabled><ui-spinner size="14"></ui-spinner> Saving</ui-button>
```

### Disabled

`disabled` disables the inner button and reflects to the host, so `ui-button[disabled]` can be styled from outside.

```html live
<ui-button disabled>Disabled</ui-button>
<ui-button variant="outline" disabled>Disabled</ui-button>
```

### In a form

`type="submit"` submits the surrounding form and `type="reset"` resets it. Buttons inside a disabled `<fieldset>` are
disabled too.

```html live
<custom-element name="button-form-demo">
  <script type="realm">
    const result = useState({ text: "Submit the form to see its data." });

    function submit(event) {
      event.preventDefault();
      const entries = [...new FormData(event.target)].map(([name, value]) => `${name}=${value}`);
      result.text = entries.join("\n") || "(no fields)";
    }

    function reset() {
      result.text = "The form was reset.";
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 4);
      width: 100%;
      max-width: calc(var(--spacing) * 80);
    }
    form {
      display: grid;
      gap: calc(var(--spacing) * 3);
    }
    .actions {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
    output {
      display: block;
      padding: calc(var(--spacing) * 3);
      border-radius: var(--radius-md);
      background: var(--muted);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      white-space: pre-wrap;
    }
  </style>

  <form onsubmit="submit(event)" onreset="reset()">
    <ui-input name="title" value="Quarterly report" aria-label="Title"></ui-input>
    <div class="actions">
      <ui-button type="submit">Save</ui-button>
      <ui-button type="reset" variant="outline">Reset</ui-button>
    </div>
  </form>
  <output><slot name="#result.text"></slot></output>
</custom-element>
<button-form-demo></button-form-demo>
```

### Open a popover

`popovertarget` and `popovertargetaction` work as on a native button. The target is looked up by id in the same
document or shadow root.

```html live
<ui-button variant="outline" popovertarget="button-popover">Toggle popover</ui-button>
<div id="button-popover" popover>Opened from a ui-button.</div>
```

### Invoke a command

`commandfor` and `command` are the native invoker commands. Browsers without native support get the same
behaviour: the button dispatches a cancelable `command` event on the target and then calls `showModal()`, `close()`,
`requestClose()`, `togglePopover()`, `showPopover()` or `hidePopover()`. When the target is a component such as
`ui-dialog` rather than a native `<dialog>`, `show-modal`, `close` and `request-close` are sent as `--show-modal`,
`--close` and `--request-close`, because browsers only deliver built-in dialog commands to native dialogs.

```html live
<ui-button commandfor="button-dialog" command="show-modal">Open dialog</ui-button>
<dialog id="button-dialog">
  <p>This dialog was opened with commandfor.</p>
  <ui-button variant="outline" commandfor="button-dialog" command="close">Close</ui-button>
</dialog>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"default"` \| `"destructive"` \| `"outline"` \| `"secondary"` \| `"ghost"` \| `"link"` | `"default"` | Visual style. |
| `size` | `"default"` \| `"xs"` \| `"sm"` \| `"lg"` \| `"icon"` \| `"icon-xs"` \| `"icon-sm"` \| `"icon-lg"` | `"default"` | Height and padding. The `icon` sizes make a square button. |
| `type` | `"button"` \| `"submit"` \| `"reset"` | `"button"` | What the button does in its form. |
| `disabled` | boolean | `false` | Disables the button. Reflects to the attribute. Also true while the button is inside a disabled `<fieldset>`. |
| `aria-label` | string | | Accessible name, passed to the inner button. Use it for icon-only buttons. Property name: `label`. |
| `aria-description` | string | | Accessible description, passed to the inner button. `ui-tooltip` sets it from its content. Property name: `description`. |
| `popovertarget` | string | | Id of a popover element to toggle. |
| `popovertargetaction` | `"toggle"` \| `"show"` \| `"hide"` | | Action taken on the popover target. |
| `commandfor` | string | | Id of the element that receives `command`. |
| `command` | string | | Command to invoke, such as `show-modal`, `close`, `request-close`, `toggle-popover`, `show-popover`, `hide-popover` or a custom `--command`. |

### Events

`ui-button` dispatches no events of its own. Listen for `click` as on any element. When native invoker commands are
not supported, the button dispatches a cancelable `command` event on the `commandfor` target with `command` and
`source` properties; calling `preventDefault()` stops the built-in action.

### Slots

| Slot | Description |
| --- | --- |
| (default) | The label and any icons. Slotted `<svg>` elements are sized to `calc(var(--spacing) * 4)`. |

### CSS parts

| Part | Description |
| --- | --- |
| `button` | The inner native `<button>`. |

### CSS states and custom properties

| Name | Description |
| --- | --- |
| `--ui-radius-start` | Overrides the start corner radii. `ui-button-group` sets it to `0` to join buttons. |
| `--ui-radius-end` | Overrides the end corner radii. |
| `:state(attr-variant-is-*)`, `:state(attr-size-is-*)` | Set for the current variant and size, for example `ui-button:state(attr-variant-is-outline)`. |

### Forms

`ui-button` is form-associated through `ElementInternals`, so it finds its form even across shadow roots.
`type="submit"` calls `requestSubmit()` on the form, which runs constraint validation and fires `submit`.
`type="reset"` calls `reset()`. The button itself adds no name or value to the submitted data, and the `submit`
event's `submitter` is `null`.

### Accessibility

The host delegates focus to the inner native `<button>`, which keeps native keyboard behaviour: Enter and Space
activate it. `aria-label` is passed to the inner button. A disabled button is removed from the tab order.
