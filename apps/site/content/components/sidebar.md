---
title: Sidebar
description: An application shell with a collapsible side navigation, grouped menus, a toggle button, a keyboard shortcut and an off-canvas mode on small screens.
group: Navigation
order: 407
nav: Sidebar
---

# Sidebar

The sidebar is a set of parts that build an application shell:

- `ui-sidebar-layout` places the `ui-sidebar` next to a `ui-sidebar-inset`, collapses the sidebar to an icon rail,
  and turns it into an off-canvas drawer on screens narrower than 768px.
- `ui-sidebar` is the panel itself. `ui-sidebar-header` and `ui-sidebar-footer` stick to its ends and
  `ui-sidebar-content` scrolls between them.
- `ui-sidebar-group` groups a `ui-sidebar-group-label` and a `ui-sidebar-menu`.
- `ui-sidebar-menu` is a list of `ui-sidebar-menu-item` elements, each holding a `ui-sidebar-menu-button` and an
  optional `ui-sidebar-menu-badge`.
- `ui-sidebar-trigger` is the button that collapses or opens the sidebar.
- `ui-sidebar-inset` is the main content area.

The layout is designed to fill the viewport (`min-height: 100dvh`). The demos on this page are placed in a box with
a fixed height. The `ui-sidebar-layout::part(sidebar)` rule shown in the code makes the sidebar follow that box
instead of the viewport.

```html live
<style>
  .sidebar-demo {
    width: min(calc(var(--spacing) * 160), calc(100vw - var(--spacing) * 28));
    height: calc(var(--spacing) * 96);
    overflow: hidden;
    contain: layout paint;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
  }
  .sidebar-demo ui-sidebar-layout {
    height: 100%;
    min-height: 0;
  }
  .sidebar-demo ui-sidebar-layout::part(sidebar) {
    height: 100%;
  }
  .sidebar-demo header {
    display: flex;
    align-items: center;
    gap: calc(var(--spacing) * 2);
    padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);
    border-bottom: 1px solid var(--border);
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
  }
  .sidebar-demo .brand {
    display: flex;
    align-items: center;
    gap: calc(var(--spacing) * 2);
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    white-space: nowrap;
    overflow: hidden;
  }
  .sidebar-demo .logo {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: calc(var(--spacing) * 8);
    height: calc(var(--spacing) * 8);
    border-radius: var(--radius-md);
    background: var(--primary);
    color: var(--primary-foreground);
  }
  .sidebar-demo .body {
    padding: calc(var(--spacing) * 4);
    font-size: var(--text-sm);
    color: var(--muted-foreground);
  }
</style>
<div class="sidebar-demo">
  <ui-sidebar-layout>
    <ui-sidebar>
      <ui-sidebar-header>
        <div class="brand"><span class="logo">A</span><span>Acme Inc</span></div>
      </ui-sidebar-header>
      <ui-sidebar-content>
        <ui-sidebar-group>
          <ui-sidebar-group-label>Platform</ui-sidebar-group-label>
          <ui-sidebar-menu>
            <ui-sidebar-menu-item>
              <ui-sidebar-menu-button href="#dashboard" current label="Dashboard">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V21H3z" /></svg>
                Dashboard
              </ui-sidebar-menu-button>
            </ui-sidebar-menu-item>
            <ui-sidebar-menu-item>
              <ui-sidebar-menu-button href="#inbox" label="Inbox">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13L22 12v7H2v-7z" /></svg>
                Inbox
              </ui-sidebar-menu-button>
              <ui-sidebar-menu-badge>12</ui-sidebar-menu-badge>
            </ui-sidebar-menu-item>
            <ui-sidebar-menu-item>
              <ui-sidebar-menu-button href="#calendar" label="Calendar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 10h18M8 2v4M16 2v4" /></svg>
                Calendar
              </ui-sidebar-menu-button>
            </ui-sidebar-menu-item>
          </ui-sidebar-menu>
        </ui-sidebar-group>
        <ui-sidebar-group>
          <ui-sidebar-group-label>Settings</ui-sidebar-group-label>
          <ui-sidebar-menu>
            <ui-sidebar-menu-item>
              <ui-sidebar-menu-button href="#team" label="Team">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 14 0M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3" /></svg>
                Team
              </ui-sidebar-menu-button>
            </ui-sidebar-menu-item>
            <ui-sidebar-menu-item>
              <ui-sidebar-menu-button href="#billing" label="Billing">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
                Billing
              </ui-sidebar-menu-button>
            </ui-sidebar-menu-item>
          </ui-sidebar-menu>
        </ui-sidebar-group>
      </ui-sidebar-content>
      <ui-sidebar-footer>
        <ui-dropdown-menu>
          <ui-dropdown-menu-trigger>
            <ui-button variant="ghost" size="sm"><ui-avatar><ui-avatar-fallback>JD</ui-avatar-fallback></ui-avatar> Jane Doe</ui-button>
          </ui-dropdown-menu-trigger>
          <ui-dropdown-menu-content placement="top-start">
            <ui-menu-item value="profile">Profile</ui-menu-item>
            <ui-menu-item value="logout" variant="destructive">Log out</ui-menu-item>
          </ui-dropdown-menu-content>
        </ui-dropdown-menu>
      </ui-sidebar-footer>
    </ui-sidebar>
    <ui-sidebar-inset>
      <header>
        <ui-sidebar-trigger></ui-sidebar-trigger>
        Dashboard
      </header>
      <div class="body">Press the trigger, or Ctrl+B (⌘B on macOS), to collapse the sidebar to icons.</div>
    </ui-sidebar-inset>
  </ui-sidebar-layout>
</div>
```

## Examples

### Collapsed by default

Add `collapsed` to start with the icon rail. Menu buttons shrink to their icon, and labels and badges are hidden.
The `label` attribute of each menu button becomes its tooltip (`title`). `collapsed` reflects, so you can style or
read the current state.

```html live
<div class="sidebar-demo">
  <ui-sidebar-layout collapsed>
    <ui-sidebar>
      <ui-sidebar-header>
        <div class="brand"><span class="logo">A</span><span>Acme Inc</span></div>
      </ui-sidebar-header>
      <ui-sidebar-content>
        <ui-sidebar-group>
          <ui-sidebar-group-label>Platform</ui-sidebar-group-label>
          <ui-sidebar-menu>
            <ui-sidebar-menu-item>
              <ui-sidebar-menu-button href="#dashboard" current label="Dashboard">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V21H3z" /></svg>
                Dashboard
              </ui-sidebar-menu-button>
            </ui-sidebar-menu-item>
            <ui-sidebar-menu-item>
              <ui-sidebar-menu-button href="#inbox" label="Inbox">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13L22 12v7H2v-7z" /></svg>
                Inbox
              </ui-sidebar-menu-button>
              <ui-sidebar-menu-badge>12</ui-sidebar-menu-badge>
            </ui-sidebar-menu-item>
          </ui-sidebar-menu>
        </ui-sidebar-group>
      </ui-sidebar-content>
    </ui-sidebar>
    <ui-sidebar-inset>
      <header>
        <ui-sidebar-trigger></ui-sidebar-trigger>
        Overview
      </header>
      <div class="body">The sidebar starts collapsed.</div>
    </ui-sidebar-inset>
  </ui-sidebar-layout>
</div>
```

### Handling navigation

Each menu button fires a bubbling, cancelable `select` event when clicked, and its link then navigates as usual
unless a listener calls `preventDefault()`. Listen once on `ui-sidebar` and keep the current item in state. Hash
links like `#projects` keep the page in place. This is how the [dashboard example](/examples/dashboard/) switches
views without reloading.

```html live
<custom-element name="sidebar-select-demo">
  <script type="realm">
    const view = useState({
      page: "home",
      get items() {
        return [
          { id: "home", href: "#home", label: "Home", current: this.page === "home" },
          { id: "projects", href: "#projects", label: "Projects", current: this.page === "projects" },
          { id: "reports", href: "#reports", label: "Reports", current: this.page === "reports" },
        ];
      },
    });

    function pick(event) {
      view.page = event.target.dataset.id;
    }
  </script>
  <style type="realm">
    :host {
      display: block;
      width: min(calc(var(--spacing) * 160), calc(100vw - var(--spacing) * 28));
      height: calc(var(--spacing) * 64);
      overflow: hidden;
      contain: layout paint;
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
    }
    ui-sidebar-layout {
      height: 100%;
      min-height: 0;
    }
    ui-sidebar-layout::part(sidebar) {
      height: 100%;
    }
    p {
      margin: 0;
      padding: calc(var(--spacing) * 4);
      font-size: var(--text-sm);
    }
  </style>
  <ui-sidebar-layout>
    <ui-sidebar onselect="pick(event)">
      <ui-sidebar-content>
        <ui-sidebar-group>
          <ui-sidebar-group-label>Workspace</ui-sidebar-group-label>
          <ui-sidebar-menu>
            <ui-sidebar-menu-item repeat="#view.items" as="item" key="id">
              <ui-sidebar-menu-button _href="#item.href" _current="#item.current" _label="#item.label" _data-id="#item.id">
                <slot name="#item.label"></slot>
              </ui-sidebar-menu-button>
            </ui-sidebar-menu-item>
          </ui-sidebar-menu>
        </ui-sidebar-group>
      </ui-sidebar-content>
    </ui-sidebar>
    <ui-sidebar-inset>
      <p>Current page: <slot name="#view.page"></slot></p>
    </ui-sidebar-inset>
  </ui-sidebar-layout>
</custom-element>
<sidebar-select-demo></sidebar-select-demo>
```

### Remembering the state

Set `persist` to a `localStorage` key. The layout saves `collapsed` under that key on every change and restores it
on the next page load.

```html
<ui-sidebar-layout persist="app-sidebar">
  …
</ui-sidebar-layout>
```

## API

### Parts

| Element | Fills | Renders |
| --- | --- | --- |
| `ui-sidebar-layout` | | The shell, with an `<aside>` for the sidebar, the inset beside it, and a backdrop on small screens. |
| `ui-sidebar` | the `<aside>` of `ui-sidebar-layout` | The panel, a full-height column. |
| `ui-sidebar-header` | the top of `ui-sidebar` | A padded column for a logo or team switcher. |
| `ui-sidebar-content` | the middle of `ui-sidebar` | A scrolling `<nav>` around the groups. |
| `ui-sidebar-footer` | the bottom of `ui-sidebar` | A padded column for a user menu. |
| `ui-sidebar-group` | `ui-sidebar-content` | A `role="group"` section, named by its label. |
| `ui-sidebar-group-label` | `ui-sidebar-group` | The small muted heading. Hidden when collapsed. |
| `ui-sidebar-menu` | `ui-sidebar-group` | A `<ul>` of menu items with Up and Down arrow navigation. |
| `ui-sidebar-menu-item` | the `<ul>` of `ui-sidebar-menu` | A list item (`role="listitem"`). |
| `ui-sidebar-menu-button` | `ui-sidebar-menu-item` | The item's `<a>`, with icon and text. Icons are sized to `calc(var(--spacing) * 4)`. When collapsed, only the icon shows. |
| `ui-sidebar-menu-badge` | `ui-sidebar-menu-item` | Short text, such as a count, at the end of the item. Hidden when collapsed. |
| `ui-sidebar-trigger` | anywhere inside `ui-sidebar-layout` | A ghost icon `ui-button` labelled "Toggle sidebar". |
| `ui-sidebar-inset` | the main area of `ui-sidebar-layout` | A `<main>` panel with rounded corners next to the sidebar. |

### Attributes

#### ui-sidebar-layout

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `collapsed` | boolean | `false` | Collapses the sidebar to an icon rail (`calc(var(--spacing) * 12)` wide) and hides labels, badges and group labels. Reflects. Ignored on small screens, where the sidebar is off-canvas instead. |
| `persist` | string | | A `localStorage` key. When set, `collapsed` is restored from it on connect and saved to it on every change. |

#### ui-sidebar-menu-button

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | string | | Link target. Without it, the item is a button activated by Enter and Space. |
| `current` | boolean | `false` | Marks the current page with a highlight, medium weight and `aria-current="page"` on the link. |
| `label` | string | | Sets the link's `title`, which is the tooltip when the sidebar is collapsed. |

The other parts have no attributes.

### Properties and methods

| Member | Element | Description |
| --- | --- | --- |
| `toggle()` | `ui-sidebar-layout` | On wide screens, flips `collapsed`. On small screens, opens or closes the off-canvas sidebar. |

### Events

| Event | Element | Description |
| --- | --- | --- |
| `select` | `ui-sidebar-menu-button` | Fires when the button is clicked. Bubbles and is cancelable. `preventDefault()` stops the link from following its `href`. |
| `sidebartoggle` | `ui-sidebar-trigger` | Fires when the trigger is clicked. Bubbles to the enclosing `ui-sidebar-layout`, which calls `toggle()`. |

### CSS parts

| Part | Element | Description |
| --- | --- | --- |
| `sidebar` | `ui-sidebar-layout` | The `<aside>` holding the sidebar. Sticky and `100dvh` tall by default. |
| `backdrop` | `ui-sidebar-layout` | The overlay behind the off-canvas sidebar on small screens. Clicking it closes the sidebar. |
| `content` | `ui-sidebar-content` | The scrolling `<nav>`. |
| `menu` | `ui-sidebar-menu` | The `<ul>`. |
| `button` | `ui-sidebar-menu-button` | The `<a>`. |
| `main` | `ui-sidebar-inset` | The `<main>` panel. |

### CSS states and custom properties

- `ui-sidebar-layout:state(attr-collapsed)` matches while collapsed (the same as `[collapsed]`).
- `ui-sidebar-layout:state(state-layout-mobile)` matches when the viewport is narrower than 768px, and
  `:state(state-layout-open)` while the off-canvas sidebar is open.
- The layout sets `--ui-sidebar-width` and `--ui-sidebar-label` (`block` or `none`) for its descendants. Group
  labels and badges use `--ui-sidebar-label` to hide when collapsed.

### Accessibility

- The layout renders an `<aside>` for the sidebar, `ui-sidebar-inset` renders a `<main>`, and
  `ui-sidebar-content` renders a `<nav>`.
- Each group has `role="group"` and is labelled by its `ui-sidebar-group-label`. Each menu is a list, each menu item
  a list item with a native link inside. The current item's link has `aria-current`.
- The trigger is a `ui-button` labelled "Toggle sidebar".
- Ctrl+B, or ⌘B on macOS, toggles every `ui-sidebar-layout` on the page from anywhere in the document.
- Each menu declares `focusgroup="menu block"`, so Up and Down arrows move between its items.
