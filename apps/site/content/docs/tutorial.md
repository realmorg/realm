---
title: "Tutorial: a reading list"
description: Build a small reading list app step by step, covering state, lists, events, derived values, conditional content, props, reactive CSS and persistence.
group: Getting started
order: 4
nav: Tutorial
---

# Tutorial: a reading list

In this tutorial you build a reading list: add books, mark them as read, filter them, and keep them after a reload. Each step adds one idea. The demos on this page are live, and each step uses a numbered tag name (`reading-list-2`, `reading-list-3`, …) so they can sit on one page. In your own project, call it `reading-list`.

You need a text editor, a browser and one HTML file. Load REALM and REALM UI from the CDN in its `<head>`, as in the [Quick start](/docs/quick-start/):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/theme.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"></script>
```

Then import the components at the top of the `<body>`:

```html
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/ui.html"></import-element>
```

## Step 1: markup and style

Start with a component that has no script at all. It is still a custom element with a shadow root and scoped styles.

```html
<custom-element name="reading-list">
  <style type="realm">
    :host {
      display: block;
      width: min(calc(var(--spacing) * 120), 100%);
    }
    form {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
    form ui-input {
      flex: 1;
    }
  </style>

  <h2>Reading list</h2>
  <form>
    <ui-input name="title" aria-label="Book title" placeholder="Add a book"></ui-input>
    <ui-button type="submit">Add</ui-button>
  </form>
</custom-element>

<reading-list></reading-list>
```

The style only applies inside the component. `ui-input` and `ui-button` come from [REALM UI](/components/).

## Step 2: state and a list

Add a `<script>`. `useState` returns a reactive object. When a property changes, every slot and binding that reads it updates.

```html live
<custom-element name="reading-list-2">
  <script type="realm">
    const books = useState({ items: [] });
    const draft = useState({ title: "" });

    function add(event) {
      event.preventDefault();
      const title = draft.title.trim();
      if (!title) return;
      books.items.push({ id: crypto.randomUUID(), title, read: false });
      draft.title = "";
    }

    function updateDraft(field) {
      draft.title = field.value;
    }
  </script>

  <style type="realm">
    :host {
      display: block;
      width: min(calc(var(--spacing) * 120), 100%);
    }
    form {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
    form ui-input {
      flex: 1;
    }
  </style>

  <form onsubmit="add(event)">
    <ui-input name="title" aria-label="Book title" placeholder="Add a book" _value="#draft.title" oninput="updateDraft(this)"></ui-input>
    <ui-button type="submit">Add</ui-button>
  </form>

  <ul>
    <li repeat="#books.items" as="book" key="id"><slot name="#book.title"></slot></li>
  </ul>
</custom-element>

<reading-list-2></reading-list-2>
```

Four things are new:

- **Handlers call script functions.** `onsubmit="add(event)"` is a native handler attribute, but `add` resolves to the function in the component's script. `event` and `this` work as in plain HTML.
- **Bindings.** `_value="#draft.title"` binds the input's current value to `draft.title`. `oninput` sends typed text back. REALM never writes state for you.
- **Lists.** `repeat="#books.items"` renders one `<li>` per item, with the item available as `book`. Inside `<ul>`, `<ol>`, `<table>` and `<select>`, put `repeat` on the item element itself. Elsewhere you can use the `<repeat-list>` tag.
- **Keys.** `key="id"` lets REALM reuse and move rows when the list changes instead of rebuilding them.

`books.items.push(...)` is enough to update the list. Array methods such as `push`, `splice` and `sort` are tracked.

## Step 3: events per item, derived values and empty states

Each row gets a checkbox and a remove button. Inside a repeated element, the loop variable (`book`) is available in handlers. Getters on the state object are cached derived values, so `summary` recomputes only when the items change.

```html live
<custom-element name="reading-list-3">
  <script type="realm">
    const books = useState({
      items: [
        { id: "dune", title: "Dune", read: true },
        { id: "piranesi", title: "Piranesi", read: false },
      ],
      get unread() {
        return this.items.filter((book) => !book.read).length;
      },
      get summary() {
        return `${this.unread} of ${this.items.length} unread`;
      },
      get isEmpty() {
        return this.items.length === 0;
      },
    });
    const draft = useState({ title: "" });

    function add(event) {
      event.preventDefault();
      const title = draft.title.trim();
      if (!title) return;
      books.items.push({ id: crypto.randomUUID(), title, read: false });
      draft.title = "";
    }

    function updateDraft(field) {
      draft.title = field.value;
    }

    function toggle(book) {
      book.read = !book.read;
    }

    function remove(book) {
      books.items.splice(books.items.indexOf(book), 1);
    }
  </script>

  <style type="realm">
    :host {
      display: block;
      width: min(calc(var(--spacing) * 120), 100%);
    }
    form {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
    form ui-input {
      flex: 1;
    }
    ul {
      margin: calc(var(--spacing) * 4) 0 0;
      padding: 0;
      list-style: none;
    }
    li {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 3);
      padding: calc(var(--spacing) * 1) 0;
    }
    li span {
      flex: 1;
    }
    li[data-read] span {
      color: var(--muted-foreground);
      text-decoration: line-through;
    }
    p {
      color: var(--muted-foreground);
      font-size: var(--text-sm);
    }
  </style>

  <form onsubmit="add(event)">
    <ui-input name="title" aria-label="Book title" placeholder="Add a book" _value="#draft.title" oninput="updateDraft(this)"></ui-input>
    <ui-button type="submit">Add</ui-button>
  </form>

  <is-hidden when="#books.isEmpty">
    <ul>
      <li repeat="#books.items" as="book" key="id" _data-read="#book.read">
        <ui-checkbox aria-label="Read" _checked="#book.read" onchange="toggle(book)"></ui-checkbox>
        <span><slot name="#book.title"></slot></span>
        <ui-button variant="ghost" size="sm" onclick="remove(book)">Remove</ui-button>
      </li>
    </ul>
    <p><slot name="#books.summary"></slot></p>
  </is-hidden>

  <is-visible when="#books.isEmpty">
    <p>Nothing here yet. Add the first book above.</p>
  </is-visible>
</custom-element>

<reading-list-3></reading-list-3>
```

- `_data-read="#book.read"` adds `data-read` when the value is `true` and removes it when it is `false`, like a native boolean attribute. The style uses it.
- `<is-hidden when="#books.isEmpty">` and `<is-visible>` mount and unmount their content. Unmounted content has no running bindings or listeners.
- Markup only holds references, never expressions. "How many are unread" is a getter in the script, not a calculation in the markup.

## Step 4: filters, props and reactive CSS

Filters are a lookup table, so adding one is a one-line change. The heading becomes a prop, declared with `defineProps`, so each instance can set it as an attribute. The empty state is styled with a reactive CSS state.

```html live
<custom-element name="reading-list-4">
  <script type="realm">
    const props = defineProps({ heading: prop.string().default("Reading list") });

    const FILTERS = {
      all: { label: "All", keep: () => true },
      unread: { label: "Unread", keep: (book) => !book.read },
      read: { label: "Read", keep: (book) => book.read },
    };

    const books = useState({
      items: [
        { id: "dune", title: "Dune", read: true },
        { id: "piranesi", title: "Piranesi", read: false },
        { id: "circe", title: "Circe", read: false },
      ],
      filter: "all",
      get visible() {
        return this.items.filter(FILTERS[this.filter].keep);
      },
      get filters() {
        return Object.entries(FILTERS).map(([id, filter]) => ({
          id,
          label: filter.label,
          pressed: id === this.filter,
          variant: id === this.filter ? "secondary" : "ghost",
        }));
      },
      get summary() {
        return `${this.items.filter(FILTERS.unread.keep).length} of ${this.items.length} unread`;
      },
      get isEmpty() {
        return this.items.length === 0;
      },
    });
    const draft = useState({ title: "" });

    function add(event) {
      event.preventDefault();
      const title = draft.title.trim();
      if (!title) return;
      books.items.push({ id: crypto.randomUUID(), title, read: false });
      draft.title = "";
    }

    function updateDraft(field) {
      draft.title = field.value;
    }

    function toggle(book) {
      book.read = !book.read;
    }

    function remove(book) {
      books.items.splice(books.items.indexOf(book), 1);
    }

    function show(filter) {
      books.filter = filter.id;
    }
  </script>

  <style type="realm">
    :host {
      display: block;
      width: min(calc(var(--spacing) * 120), 100%);
    }
    h2 {
      margin: 0 0 calc(var(--spacing) * 4);
      font-size: var(--text-xl);
    }
    form,
    footer {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
    form ui-input {
      flex: 1;
    }
    ul {
      margin: calc(var(--spacing) * 4) 0;
      padding: 0;
      list-style: none;
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
    }
    li {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 3);
      padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);
      border-bottom: 1px solid var(--border);
    }
    li:last-child {
      border-bottom: 0;
    }
    li span {
      flex: 1;
    }
    li[data-read] span {
      color: var(--muted-foreground);
      text-decoration: line-through;
    }
    footer {
      align-items: center;
      font-size: var(--text-sm);
      color: var(--muted-foreground);
    }
    footer span {
      flex: 1;
    }
    :host(:state(state-books-isEmpty)) ul,
    :host(:state(state-books-isEmpty)) footer {
      display: none;
    }
  </style>

  <h2><slot name="@heading"></slot></h2>

  <form onsubmit="add(event)">
    <ui-input name="title" aria-label="Book title" placeholder="Add a book" _value="#draft.title" oninput="updateDraft(this)"></ui-input>
    <ui-button type="submit">Add</ui-button>
  </form>

  <ul>
    <li repeat="#books.visible" as="book" key="id" _data-read="#book.read">
      <ui-checkbox aria-label="Read" _checked="#book.read" onchange="toggle(book)"></ui-checkbox>
      <span><slot name="#book.title"></slot></span>
      <ui-button variant="ghost" size="sm" onclick="remove(book)">Remove</ui-button>
    </li>
  </ul>

  <footer>
    <span><slot name="#books.summary"></slot></span>
    <repeat-list of="#books.filters" as="filter" key="id">
      <ui-button size="sm" _variant="#filter.variant" _aria-pressed="#filter.pressed" onclick="show(filter)"><slot name="#filter.label"></slot></ui-button>
    </repeat-list>
  </footer>
</custom-element>

<reading-list-4 heading="Books for the summer"></reading-list-4>
```

- `defineProps` declares typed attributes. `<slot name="@heading">` shows a prop. `@` means "prop", `#` means "script value".
- `_variant="#filter.variant"` passes a value to another component's prop. `_aria-pressed` receives `"true"` or `"false"`, as ARIA expects.
- `:host(:state(state-books-isEmpty))` matches while `books.isEmpty` is truthy. REALM sets these custom states for every `:state(state-…)` and `:state(attr-…)` selector it finds in the component's styles. See [Styling](/docs/styling/).
- `<repeat-list>` repeats any content where a list element is not needed.

## Step 5: keep the list after a reload

Swap `useState` for `defineStore` to share the list between every instance and save it to `localStorage`. Values come back with their types, so booleans stay booleans.

```html live
<custom-element name="reading-list-5">
  <script type="realm">
    const books = defineStore(
      "tutorial-reading-list",
      {
        items: [],
        get isEmpty() {
          return this.items.length === 0;
        },
      },
      { persist: "local" },
    );
    const draft = useState({ title: "" });

    function add(event) {
      event.preventDefault();
      const title = draft.title.trim();
      if (!title) return;
      books.items.push({ id: crypto.randomUUID(), title, read: false });
      draft.title = "";
    }

    function updateDraft(field) {
      draft.title = field.value;
    }

    function toggle(book) {
      book.read = !book.read;
    }

    function remove(book) {
      books.items.splice(books.items.indexOf(book), 1);
    }
  </script>

  <style type="realm">
    :host {
      display: block;
      width: min(calc(var(--spacing) * 120), 100%);
    }
    form {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
    form ui-input {
      flex: 1;
    }
    ul {
      margin: calc(var(--spacing) * 4) 0 0;
      padding: 0;
      list-style: none;
    }
    li {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 3);
      padding: calc(var(--spacing) * 1) 0;
    }
    li span {
      flex: 1;
    }
    li[data-read] span {
      color: var(--muted-foreground);
      text-decoration: line-through;
    }
    p {
      color: var(--muted-foreground);
      font-size: var(--text-sm);
    }
  </style>

  <form onsubmit="add(event)">
    <ui-input name="title" aria-label="Book title" placeholder="Add a book, then reload the page" _value="#draft.title" oninput="updateDraft(this)"></ui-input>
    <ui-button type="submit">Add</ui-button>
  </form>

  <ul>
    <li repeat="#books.items" as="book" key="id" _data-read="#book.read">
      <ui-checkbox aria-label="Read" _checked="#book.read" onchange="toggle(book)"></ui-checkbox>
      <span><slot name="#book.title"></slot></span>
      <ui-button variant="ghost" size="sm" onclick="remove(book)">Remove</ui-button>
    </li>
  </ul>

  <is-visible when="#books.isEmpty">
    <p>Your saved list is empty.</p>
  </is-visible>
</custom-element>

<reading-list-5></reading-list-5>
```

Add a book and reload the page. It is still there. In a larger app, define the store in its own JavaScript module and import it from every component that needs it. See [Stores](/docs/stores/).

## Step 6: move it into a file

Put the finished definition in `reading-list.html`, switch `type="realm"` back to a plain `<script>` and `<style>`, and load it. Open the page through any static file server (your editor's live preview works), because `<import-element>` loads files with `fetch`:

```html
<import-element from="/components/reading-list.html"></import-element>

<reading-list heading="Books for the summer"></reading-list>
```

## What you used

| Idea | Where to read more |
| --- | --- |
| `useState`, getters, `defineStore` | [State and reactivity](/docs/state/), [Stores](/docs/stores/) |
| `<slot name="#…">`, `_attr="#…"` | [Values and bindings](/docs/bindings/) |
| `onsubmit="add(event)"`, loop variables in handlers | [Events](/docs/events/) |
| `<is-visible>`, `<is-hidden>` | [Control flow](/docs/control-flow/) |
| `repeat`, `<repeat-list>`, `key` | [Lists and keys](/docs/lists/) |
| `defineProps` | [Props](/docs/props/) |
| `:state(state-…)` | [Styling](/docs/styling/) |
| `<import-element>` | [Importing components](/docs/importing/) |
