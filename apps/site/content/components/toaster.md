---
title: Toaster
description: A live region that shows short, auto-dismissing notifications triggered by a document event or a method call.
group: Overlays
order: 310
nav: Toaster
---

# Toaster

`ui-toaster` shows toasts: brief notifications stacked in a corner of the viewport. Place one `<ui-toaster>` per
page, usually at the end of `<body>`. It listens for a `toast` event on `document`, so any script or component can
show a toast without a reference to the toaster:

```js
document.dispatchEvent(new CustomEvent("toast", { detail: { title: "Saved" } }));
```

The toast list is a `popover="manual"` element in the top layer with `aria-live="polite"`, so screen readers announce
new toasts. Each toast closes after `duration` milliseconds or when its dismiss button is clicked.

This page already has a `ui-toaster`, so the demos below only send `toast` events or call its methods.

```html live
<ui-button variant="outline" onclick="document.dispatchEvent(new CustomEvent('toast', { detail: { title: 'Event created', description: 'Sunday, December 3 at 9:00 AM' } }))">Show toast</ui-button>
```

## Examples

### Destructive

`variant: "destructive"` colours the toast for errors.

```html live
<ui-button variant="outline" onclick="document.dispatchEvent(new CustomEvent('toast', { detail: { title: 'Upload failed', description: 'The file is larger than 10 MB.', variant: 'destructive' } }))">Show error</ui-button>
```

### From a component

Inside a component, dispatch the same event from a script function.

```html live
<custom-element name="toaster-save-demo">
  <script type="realm">
    const draft = useState({ saves: 0 });

    function save() {
      draft.saves++;
      document.dispatchEvent(
        new CustomEvent("toast", { detail: { title: "Draft saved", description: `Version ${draft.saves}` } }),
      );
    }
  </script>

  <ui-button onclick="save()">Save draft</ui-button>
</custom-element>
<toaster-save-demo></toaster-save-demo>
```

### Sticky toasts and dismissing from script

`duration` in the detail overrides the toaster's default for one toast; `0` keeps it open until it is dismissed. The
`toast()` method returns an id that you can pass to `dismiss()`.

```html live
<custom-element name="toaster-sticky-demo">
  <script type="realm">
    const upload = useState({ id: 0 });

    function start() {
      if (upload.id) return;
      upload.id = document.querySelector("ui-toaster").toast({ title: "Uploading...", description: "Keep this tab open.", duration: 0 });
    }

    function finish() {
      if (!upload.id) return;
      document.querySelector("ui-toaster").dismiss(upload.id);
      upload.id = 0;
      document.dispatchEvent(new CustomEvent("toast", { detail: { title: "Upload complete" } }));
    }
  </script>

  <style type="realm">
    :host {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
  </style>

  <ui-button variant="outline" onclick="start()">Start upload</ui-button>
  <ui-button variant="outline" onclick="finish()">Finish upload</ui-button>
</custom-element>
<toaster-sticky-demo></toaster-sticky-demo>
```

### Position and duration

Set `position` and `duration` on the page's toaster. Toasts stack from the chosen corner or edge.

```html
<ui-toaster position="top-center" duration="6000"></ui-toaster>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-toaster` | | The fixed toast list. Each toast is rendered from the data passed to `toast()` or the `toast` event, so there are no toast parts to write. |

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `"bottom-right"` \| `"bottom-left"` \| `"bottom-center"` \| `"top-right"` \| `"top-left"` \| `"top-center"` | `"bottom-right"` | Where toasts appear. |
| `duration` | number | `4000` | Default milliseconds before a toast closes. `0` keeps toasts open until dismissed. Minimum `0`. |

### Toast options

The `detail` of a `toast` event and the argument of `toast()` take the same fields. All are optional.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | string | `""` | Bold first line. |
| `description` | string | `""` | Muted second line. Hidden when empty. |
| `variant` | `"default"` \| `"destructive"` | `"default"` | Destructive toasts use the destructive colour. |
| `duration` | number | the `duration` attribute | Milliseconds before this toast closes; `0` keeps it open. |

### Properties and methods

| Name | Description |
| --- | --- |
| `toast(options?)` | Shows a toast and returns its numeric id. |
| `dismiss(id)` | Removes the toast with that id. Unknown ids are ignored. |

### Events

| Event | Target | Detail | Description |
| --- | --- | --- | --- |
| `toast` | `document` | toast options | Listened for, not dispatched. Every connected `ui-toaster` shows a toast for each event. |

### CSS parts

| Part | Description |
| --- | --- |
| `region` | The `<ol>` that holds the toasts (`popover="manual"`, `aria-live="polite"`). |
| `toast` | Each toast `<li>`. Destructive toasts have `data-variant="destructive"`. |

### Accessibility

- The list is a polite live region, so new toasts are announced without moving focus.
- Each toast has a dismiss button with `aria-label="Dismiss"`.
- Toasts close on their own. Do not put the only copy of important information or actions in a toast.
