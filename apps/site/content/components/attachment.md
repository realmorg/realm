---
title: Attachment
description: A compact file chip with a preview area, a downloadable file name, its size and optional actions.
group: Chat and content
order: 601
nav: Attachment
---

# Attachment

`ui-attachment` shows a file attached to a message or a form, with a small preview area, the file name, its size and
room for actions such as remove. The name is a link with the `download` attribute, so clicking it downloads the file from
`href` under that name. Long names are truncated with an ellipsis.

The preview goes in a `ui-attachment-media` child and the buttons in a `ui-attachment-actions` child. Both place
themselves before and after the name, whatever their position in the source.

```html live
<ui-attachment name="quarterly-report.pdf" size="1.2 MB" href="data:text/plain,Quarterly%20report">
  <ui-attachment-media>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 3H6v18h12V7Z" /><path d="M14 3v4h4" /></svg>
  </ui-attachment-media>
</ui-attachment>
```

## Examples

### With actions

Put buttons in `ui-attachment-actions`. Give icon buttons an `aria-label` that says what they do to which file.

```html live
<custom-element name="attachment-list-demo">
  <script type="realm">
    const files = useState({
      list: [
        { id: 1, name: "design-review.fig", size: "4.8 MB", remove: "Remove design-review.fig" },
        { id: 2, name: "meeting-notes.md", size: "6 KB", remove: "Remove meeting-notes.md" },
      ],
    });

    function remove(file) {
      files.list.splice(files.list.indexOf(file), 1);
    }
  </script>

  <style type="realm">
    ul {
      display: flex;
      flex-wrap: wrap;
      gap: calc(var(--spacing) * 2);
      margin: 0;
      padding: 0;
      list-style: none;
    }
    ui-button svg {
      width: calc(var(--spacing) * 4);
      height: calc(var(--spacing) * 4);
    }
  </style>

  <ul>
    <li repeat="#files.list" as="file" key="id">
      <ui-attachment _name="#file.name" _size="#file.size">
        <ui-attachment-media>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 3H6v18h12V7Z" /><path d="M14 3v4h4" /></svg>
        </ui-attachment-media>
        <ui-attachment-actions>
          <ui-button variant="ghost" size="icon-xs" _aria-label="#file.remove" onclick="remove(file)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </ui-button>
        </ui-attachment-actions>
      </ui-attachment>
    </li>
  </ul>
</custom-element>
<div class="demo-medium"><attachment-list-demo></attachment-list-demo></div>
```

### Image preview

`ui-attachment-media` is a rounded square with hidden overflow, and an `<img>` inside it covers the square, so it
works as a thumbnail.

```html live
<ui-attachment name="sunset.svg" size="1 KB" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23f59e0b'/%3E%3Ccircle cx='16' cy='20' r='8' fill='%23f97316'/%3E%3C/svg%3E">
  <ui-attachment-media>
    <img alt="" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23f59e0b'/%3E%3Ccircle cx='16' cy='20' r='8' fill='%23f97316'/%3E%3C/svg%3E">
  </ui-attachment-media>
</ui-attachment>
```

### In a message

```html live
<div class="demo-medium">
  <ui-message align="end">
    <ui-message-avatar>
      <ui-avatar><ui-avatar-fallback>ME</ui-avatar-fallback></ui-avatar>
    </ui-message-avatar>
    <ui-bubble align="end">Here is the contract.</ui-bubble>
    <ui-attachment name="contract-final.pdf" size="320 KB" href="data:text/plain,Contract">
      <ui-attachment-media>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 3H6v18h12V7Z" /><path d="M14 3v4h4" /></svg>
      </ui-attachment-media>
    </ui-attachment>
  </ui-message>
</div>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-attachment` | (root) | The chip with the file name link and size. |
| `ui-attachment-media` | `media` | A muted rounded square before the name for a file icon (`<svg>`, 16px) or a thumbnail `<img>`. |
| `ui-attachment-actions` | `actions` | A row of buttons after the name, such as remove or open. |

The parts set their own `slot`, so they go directly inside `ui-attachment` with no attributes. The default slot of
each part takes any content.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | string | | File name. Shown as the link text and used as the `download` file name. |
| `size` | string | | Human-readable size, such as `1.2 MB`. Hidden when empty. |
| `href` | string | | URL of the file. Without it the name is not a link. |

### CSS parts

| Part | Description |
| --- | --- |
| `content` | The column with the name and size. |
| `title` | The file name link. |

### Accessibility

The file name is a native link with `download`, so it is focusable and announced as a link when `href` is set. The
attachment shows a focus ring when anything inside it has focus. Mark icons in `ui-attachment-media` with
`aria-hidden="true"` and give thumbnails an empty `alt` when the file name already says what they are.
