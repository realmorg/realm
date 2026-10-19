---
title: Item
description: A flexible row with media, a title, a description and actions, for lists of people, files, settings or notifications.
group: Display
order: 207
nav: Item
---

# Item

`ui-item` lays out one row of content from parts, in source order: optional `ui-item-media` on the left,
`ui-item-content` (with `ui-item-title` and `ui-item-description`) filling the middle, and `ui-item-actions` on the
right. `ui-item-group` stacks items in a column and gives the group the ARIA role `list`.

```html live
<div class="demo-medium">
  <ui-item variant="outline">
    <ui-item-content>
      <ui-item-title>Basic item</ui-item-title>
      <ui-item-description>A simple item with a title and a description.</ui-item-description>
    </ui-item-content>
    <ui-item-actions>
      <ui-button variant="outline" size="sm">Action</ui-button>
    </ui-item-actions>
  </ui-item>
</div>
```

## Examples

### Variants

`default` has no border or background, `outline` adds a border, `muted` a subtle background.

```html live
<div class="demo-medium demo-stack">
  <ui-item>
    <ui-item-content>
      <ui-item-title>Default</ui-item-title>
      <ui-item-description>Transparent background and border.</ui-item-description>
    </ui-item-content>
  </ui-item>
  <ui-item variant="outline">
    <ui-item-content>
      <ui-item-title>Outline</ui-item-title>
      <ui-item-description>A visible border.</ui-item-description>
    </ui-item-content>
  </ui-item>
  <ui-item variant="muted">
    <ui-item-content>
      <ui-item-title>Muted</ui-item-title>
      <ui-item-description>A muted background.</ui-item-description>
    </ui-item-content>
  </ui-item>
</div>
```

### Small

`size="sm"` reduces the padding and gap. An `<svg>` in `ui-item-media` is sized to `calc(var(--spacing) * 4)`.

```html live
<div class="demo-medium">
  <ui-item variant="outline" size="sm">
    <ui-item-media>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
    </ui-item-media>
    <ui-item-content>
      <ui-item-title>Your profile has been verified.</ui-item-title>
    </ui-item-content>
    <ui-item-actions>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    </ui-item-actions>
  </ui-item>
</div>
```

### Icon media

`variant="icon"` puts the icon in a small bordered, muted box.

```html live
<div class="demo-medium">
  <ui-item variant="outline">
    <ui-item-media variant="icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
    </ui-item-media>
    <ui-item-content>
      <ui-item-title>Security alert</ui-item-title>
      <ui-item-description>New login detected from an unknown device.</ui-item-description>
    </ui-item-content>
    <ui-item-actions>
      <ui-button variant="outline" size="sm">Review</ui-button>
    </ui-item-actions>
  </ui-item>
</div>
```

### Image media

`variant="image"` crops an `<img>` into a rounded square.

```html live
<div class="demo-medium">
  <ui-item variant="outline">
    <ui-item-media variant="image">
      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%236366f1'/%3E%3Ccircle cx='44' cy='20' r='8' fill='%23e0e7ff'/%3E%3Cpath d='M0 64 22 30l18 22 10-12 14 24z' fill='%23c7d2fe'/%3E%3C/svg%3E" alt="">
    </ui-item-media>
    <ui-item-content>
      <ui-item-title>Midnight City Lights</ui-item-title>
      <ui-item-description>Neon Dreams</ui-item-description>
    </ui-item-content>
    <ui-item-actions>
      <span class="demo-muted">3:45</span>
    </ui-item-actions>
  </ui-item>
</div>
```

### With an avatar and several actions

Without `variant`, `ui-item-media` is a plain wrapper, so an avatar keeps its own look.

```html live
<div class="demo-medium">
  <ui-item variant="outline">
    <ui-item-media>
      <ui-avatar><ui-avatar-fallback>ER</ui-avatar-fallback></ui-avatar>
    </ui-item-media>
    <ui-item-content>
      <ui-item-title>Evil Rabbit</ui-item-title>
      <ui-item-description>Last seen 5 months ago</ui-item-description>
    </ui-item-content>
    <ui-item-actions>
      <ui-button variant="outline" size="sm">Message</ui-button>
      <ui-button size="sm">Invite</ui-button>
    </ui-item-actions>
  </ui-item>
</div>
```

### Extra content

`ui-item-content` is a flex column, so anything after the description stacks under it.

```html live
<div class="demo-medium">
  <ui-item variant="muted">
    <ui-item-content>
      <ui-item-title>Storage</ui-item-title>
      <ui-item-description>7.2 GB of 10 GB used</ui-item-description>
      <ui-progress value="72" aria-label="Storage used"></ui-progress>
    </ui-item-content>
  </ui-item>
</div>
```

### Header and footer

`ui-item-header` and `ui-item-footer` take a full row above or below the media, content and actions, with their
children spread apart.

```html live
<div class="demo-medium">
  <ui-item variant="outline">
    <ui-item-header>
      <span class="demo-muted">Deployment</span>
      <ui-badge variant="secondary">Ready</ui-badge>
    </ui-item-header>
    <ui-item-content>
      <ui-item-title>realm-site</ui-item-title>
      <ui-item-description>Production build from main, commit b6042d1.</ui-item-description>
    </ui-item-content>
    <ui-item-footer>
      <span class="demo-muted">2 minutes ago</span>
      <ui-button variant="ghost" size="sm">View logs</ui-button>
    </ui-item-footer>
  </ui-item>
</div>
```

### Group

`ui-item-group` stacks items. Put a `ui-separator` between them for a divided list.

```html live
<div class="demo-medium">
  <ui-item-group>
    <ui-item>
      <ui-item-media>
        <ui-avatar><ui-avatar-fallback>SC</ui-avatar-fallback></ui-avatar>
      </ui-item-media>
      <ui-item-content>
        <ui-item-title>shadcn</ui-item-title>
        <ui-item-description>shadcn@vercel.com</ui-item-description>
      </ui-item-content>
      <ui-item-actions>
        <ui-button variant="ghost" size="sm">Remove</ui-button>
      </ui-item-actions>
    </ui-item>
    <ui-separator></ui-separator>
    <ui-item>
      <ui-item-media>
        <ui-avatar><ui-avatar-fallback>ML</ui-avatar-fallback></ui-avatar>
      </ui-item-media>
      <ui-item-content>
        <ui-item-title>maxleiter</ui-item-title>
        <ui-item-description>maxleiter@vercel.com</ui-item-description>
      </ui-item-content>
      <ui-item-actions>
        <ui-button variant="ghost" size="sm">Remove</ui-button>
      </ui-item-actions>
    </ui-item>
  </ui-item-group>
</div>
```

### From state

Repeat items from a list with the `repeat` attribute, so each `ui-item` stays a direct child of the group and keeps
the `listitem` role.

```html live
<custom-element name="item-files-demo">
  <script type="realm">
    const folder = useState({
      files: [
        { id: "a", name: "invoice-march.pdf", size: "182 KB" },
        { id: "b", name: "team-photo.jpg", size: "2.4 MB" },
        { id: "c", name: "roadmap.md", size: "6 KB" },
      ],
    });

    function remove(file) {
      folder.files = folder.files.filter((item) => item.id !== file.id);
    }
  </script>
  <style type="realm">
    :host {
      display: block;
      width: min(100%, calc(var(--spacing) * 112));
    }
  </style>
  <ui-item-group>
    <ui-item size="sm" repeat="#folder.files" as="file" key="id">
      <ui-item-content>
        <ui-item-title><slot name="#file.name"></slot></ui-item-title>
        <ui-item-description><slot name="#file.size"></slot></ui-item-description>
      </ui-item-content>
      <ui-item-actions>
        <ui-button variant="ghost" size="sm" onclick="remove(file)">Delete</ui-button>
      </ui-item-actions>
    </ui-item>
  </ui-item-group>
</custom-element>
<item-files-demo></item-files-demo>
```

## API

### Parts

| Part | Slot | Renders |
| --- | --- | --- |
| `ui-item` | | One row: a wrapping flex container with a gap. |
| `ui-item-group` | | A column of items with the role `list`. |
| `ui-item-media` | (default) | A non-shrinking box for an icon, image or avatar. Slotted `<svg>` is sized to `calc(var(--spacing) * 4)`. |
| `ui-item-content` | (default) | A flex column that fills the space between media and actions. |
| `ui-item-title` | (default) | The main line, in medium weight. Place it in `ui-item-content`. |
| `ui-item-description` | (default) | Secondary text in muted colour, clamped to two lines. Place it in `ui-item-content`. |
| `ui-item-actions` | (default) | A row of buttons or icons with a small gap. |
| `ui-item-header` | (default) | A full-width row above the rest, children spread apart. |
| `ui-item-footer` | (default) | A full-width row below the rest, children spread apart. |

`ui-item` lays its parts out in source order: put media first, then content, then actions. Every part has a single
default slot that takes any content.

### ui-item attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"default"` \| `"outline"` \| `"muted"` | `"default"` | Border and background style. |
| `size` | `"default"` \| `"sm"` | `"default"` | Padding and gap. |

### ui-item-media attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"default"` \| `"icon"` \| `"image"` | `"default"` | `icon` is a `calc(var(--spacing) * 8)` bordered, muted box. `image` is a `calc(var(--spacing) * 10)` rounded box whose `<img>` covers it. `default` is a plain wrapper. |

The other parts have no attributes.

### Accessibility

`ui-item-group` has the role `list`, and a `ui-item` directly inside a group has the role `listitem`, so screen
readers report the list size. A standalone `ui-item` has no role. An item is not focusable or clickable by
itself; put interactive elements in `ui-item-actions`, or wrap the item in an `<a>` to make the whole row a link.
Give an image in `ui-item-media` an `alt` text, or `alt=""` when the title already describes it.
