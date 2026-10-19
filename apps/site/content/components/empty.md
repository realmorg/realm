---
title: Empty
description: A placeholder for an empty list, search result or section, with an icon, a message and actions.
group: Display
order: 206
nav: Empty
---

# Empty

`ui-empty` fills the space where content would be when there is none yet. It is a dashed, centred box built from
parts: `ui-empty-header` holds optional `ui-empty-media`, a `ui-empty-title` and a `ui-empty-description`, and
`ui-empty-content` holds the actions underneath. It has no role of its own.

```html live
<div class="demo-full">
  <ui-empty>
    <ui-empty-header>
      <ui-empty-media variant="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
      </ui-empty-media>
      <ui-empty-title>No projects yet</ui-empty-title>
      <ui-empty-description>You have not created any projects. Get started by creating your first one.</ui-empty-description>
    </ui-empty-header>
    <ui-empty-content>
      <div class="demo-row-tight">
        <ui-button>Create project</ui-button>
        <ui-button variant="outline">Import project</ui-button>
      </div>
    </ui-empty-content>
  </ui-empty>
</div>
```

## Examples

### Without media

Leave out `ui-empty-media` for a text-only empty state.

```html live
<div class="demo-full">
  <ui-empty>
    <ui-empty-header>
      <ui-empty-title>No results</ui-empty-title>
      <ui-empty-description>Try a different search term or clear the filters.</ui-empty-description>
    </ui-empty-header>
    <ui-empty-content>
      <ui-button variant="outline" size="sm">Clear filters</ui-button>
    </ui-empty-content>
  </ui-empty>
</div>
```

### With an avatar

Without `variant`, `ui-empty-media` is a plain wrapper, so an avatar or an avatar group keeps its own look.

```html live
<div class="demo-full">
  <ui-empty>
    <ui-empty-header>
      <ui-empty-media>
        <ui-avatar size="lg"><ui-avatar-fallback>LR</ui-avatar-fallback></ui-avatar>
      </ui-empty-media>
      <ui-empty-title>User offline</ui-empty-title>
      <ui-empty-description>This user is currently offline. You can leave a message to notify them.</ui-empty-description>
    </ui-empty-header>
    <ui-empty-content>
      <ui-button size="sm">Leave a message</ui-button>
    </ui-empty-content>
  </ui-empty>
</div>
```

### With an input

`ui-empty-content` is a centred column capped at `calc(var(--spacing) * 96)`, so it also fits a search box and a
note.

```html live
<div class="demo-full">
  <ui-empty>
    <ui-empty-header>
      <ui-empty-title>404 - Not found</ui-empty-title>
      <ui-empty-description>The page you are looking for does not exist. Try searching for what you need.</ui-empty-description>
    </ui-empty-header>
    <ui-empty-content>
      <div class="demo-full">
        <ui-input type="search" aria-label="Search pages" placeholder="Search pages"></ui-input>
      </div>
      <p class="demo-muted">Need help? <a href="#">Contact support</a></p>
    </ui-empty-content>
  </ui-empty>
</div>
```

### Shown when a list is empty

Switch between the list and the empty state with `<is-visible>` and `<is-hidden>`.

```html live
<custom-element name="empty-inbox-demo">
  <script type="realm">
    const inbox = useState({
      messages: [
        { id: 1, subject: "Weekly report" },
        { id: 2, subject: "Invoice INV-204" },
      ],
      get empty() {
        return this.messages.length === 0;
      },
    });

    function archive(message) {
      inbox.messages = inbox.messages.filter((item) => item.id !== message.id);
    }

    function restore() {
      inbox.messages = [
        { id: 1, subject: "Weekly report" },
        { id: 2, subject: "Invoice INV-204" },
      ];
    }
  </script>
  <style type="realm">
    :host {
      display: block;
      width: 100%;
    }
    ul {
      display: grid;
      gap: calc(var(--spacing) * 2);
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
    }
  </style>
  <is-hidden when="#inbox.empty">
    <ul>
      <li repeat="#inbox.messages" as="message" key="id">
        <slot name="#message.subject"></slot>
        <ui-button size="sm" variant="ghost" onclick="archive(message)">Archive</ui-button>
      </li>
    </ul>
  </is-hidden>
  <is-visible when="#inbox.empty">
    <ui-empty>
      <ui-empty-header>
        <ui-empty-title>Inbox zero</ui-empty-title>
        <ui-empty-description>Every message has been archived.</ui-empty-description>
      </ui-empty-header>
      <ui-empty-content>
        <ui-button size="sm" variant="outline" onclick="restore()">Restore messages</ui-button>
      </ui-empty-content>
    </ui-empty>
  </is-visible>
</custom-element>
<empty-inbox-demo></empty-inbox-demo>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-empty` | | The dashed, centred box. A flex column with a gap between header and content. |
| `ui-empty-header` | (default) | A centred column for media, title and description, capped at `calc(var(--spacing) * 96)`. |
| `ui-empty-media` | (default) | A wrapper above the title for an icon, avatar or image. Place it in `ui-empty-header`. |
| `ui-empty-title` | (default) | A heading (level 3 unless `level` says otherwise) in `var(--text-lg)`. Place it in `ui-empty-header`. |
| `ui-empty-description` | (default) | Supporting text in muted `var(--text-sm)`. Place it in `ui-empty-header`. |
| `ui-empty-content` | (default) | Actions or inputs under the header, in a centred column capped at `calc(var(--spacing) * 96)`. |

Every part has a single default slot that takes any content.

### ui-empty-media attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"icon"` | | Shows the content in a muted, rounded `calc(var(--spacing) * 10)` square. Without it the media is a plain wrapper. |

A slotted `<svg>` is sized to `calc(var(--spacing) * 6)`.

### ui-empty-title attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `level` | number, 1–6 | `3` | The heading level, so the title fits the page outline. |

The other parts have no attributes.

### CSS parts

| Element | Part | Description |
| --- | --- | --- |
| `ui-empty-title` | `title` | The heading around the title text. |

### Accessibility

The element has no role. `ui-empty-title` is a heading with `aria-level` from `level` (3 by default). If the empty state appears after a user action
(such as a search), consider announcing it with a live region of your own.
