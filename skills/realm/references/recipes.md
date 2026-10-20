# Recipes

Complete, working starting points. Each one runs as written: open it through any static server (`python3 -m http.server`). The `/api/…` URLs stand for your own backend.

1. [Todo list with persistence](#todo-list-with-persistence)
2. [Fetched list with loading, empty and error states](#fetched-list-with-loading-empty-and-error-states)
3. [Form with validation and server errors](#form-with-validation-and-server-errors)
4. [Dialog with a trigger, a form and a confirmation](#dialog-with-a-trigger-a-form-and-a-confirmation)
5. [Dashboard page layout](#dashboard-page-layout)
6. [Multi-page app without a router](#multi-page-app-without-a-router)

## Todo list with persistence

A store persisted to `localStorage`, a lookup table for filters, a keyed list with the `repeat` attribute and getters for everything derived.

```html runnable
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Todos</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/theme.css">
  <script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"></script>
</head>
<body>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/button.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/checkbox.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/input.html"></import-element>

  <custom-element name="todo-app">
    <script type="realm">
      const FILTERS = {
        all: { label: "All", keep: () => true },
        active: { label: "Active", keep: (item) => !item.done },
        done: { label: "Done", keep: (item) => item.done },
      };

      const todo = defineStore("todo", { items: [], filter: "all" }, { persist: "local" });
      const draft = useState({ text: "" });
      const view = useState({
        get visible() {
          return todo.items.filter(FILTERS[todo.filter].keep);
        },
        get remaining() {
          return todo.items.filter(FILTERS.active.keep).length;
        },
        get summary() {
          return this.remaining === 1 ? "1 item left" : `${this.remaining} items left`;
        },
        get filters() {
          return Object.entries(FILTERS).map(([id, filter]) => ({
            id,
            label: filter.label,
            variant: id === todo.filter ? "secondary" : "ghost",
          }));
        },
      });

      function updateDraft(field) {
        draft.text = field.value;
      }

      function add(event) {
        event.preventDefault();
        const text = draft.text.trim();
        if (!text) return;
        todo.items.push({ id: crypto.randomUUID(), text, done: false });
        draft.text = "";
      }

      function toggle(item, box) {
        item.done = box.checked;
      }

      function remove(item) {
        todo.items.splice(todo.items.indexOf(item), 1);
      }

      function show(filter) {
        todo.filter = filter.id;
      }

      function clearDone() {
        todo.items = todo.items.filter(FILTERS.active.keep);
      }
    </script>

    <style type="realm">
      :host {
        display: grid;
        gap: calc(var(--spacing) * 4);
        width: min(calc(var(--spacing) * 120), 100%);
      }
      form,
      footer {
        display: flex;
        align-items: center;
        gap: calc(var(--spacing) * 2);
      }
      form ui-input {
        flex: 1;
      }
      ul {
        margin: 0;
        padding: 0;
        list-style: none;
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
      }
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: calc(var(--spacing) * 3);
        padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);
        border-bottom: 1px solid var(--border);
      }
      li:last-child {
        border-bottom: 0;
      }
      li[data-done] ui-checkbox {
        color: var(--muted-foreground);
        text-decoration: line-through;
      }
      footer span {
        flex: 1;
        color: var(--muted-foreground);
        font-size: var(--text-sm);
      }
    </style>

    <form onsubmit="add(event)">
      <ui-input aria-label="New todo" placeholder="What needs doing?" _value="#draft.text" oninput="updateDraft(this)"></ui-input>
      <ui-button type="submit">Add</ui-button>
    </form>

    <is-visible when="#todo.items.length">
      <ul>
        <li repeat="#view.visible" as="item" key="id" _data-done="#item.done">
          <ui-checkbox _checked="#item.done" onchange="toggle(item, this)"><slot name="#item.text"></slot></ui-checkbox>
          <ui-button variant="ghost" size="sm" onclick="remove(item)">Remove</ui-button>
        </li>
      </ul>
      <footer>
        <span><slot name="#view.summary"></slot></span>
        <ui-button repeat="#view.filters" as="filter" key="id" size="sm" _variant="#filter.variant" onclick="show(filter)"><slot name="#filter.label"></slot></ui-button>
        <ui-button variant="outline" size="sm" onclick="clearDone()">Clear done</ui-button>
      </footer>
    </is-visible>
    <is-hidden when="#todo.items.length"><p>Nothing to do yet.</p></is-hidden>
  </custom-element>

  <todo-app></todo-app>
</body>
</html>
```

Notes:

- Filters and labels live in one table, and getters turn them into what the markup needs (`variant`). No `if`/`else` in markup or script.
- `remove(item)` uses the loop variable directly. `indexOf` finds the item whether it is the proxy or the raw object.
- The same component in its own file would use a plain `<script>` and `<style>`.

## Fetched list with loading, empty and error states

Fetch attributes load the list on connect, again when the search changes (debounced), and again when "Try again" bumps a counter. `busy` drives the spinner, `onerror` stores a message, and getters decide what shows.

```html runnable
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Products</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/theme.css">
  <script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"></script>
</head>
<body>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/alert.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/badge.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/button.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/empty.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/input.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/spinner.html"></import-element>

  <custom-element name="product-list">
    <script type="realm">
      const catalog = useState({
        products: [],
        query: "",
        attempt: 0,
        loading: false,
        error: null,
        get empty() {
          return !this.loading && !this.error && this.products.length === 0;
        },
      });

      function search(field) {
        catalog.query = field.value;
      }

      function loaded() {
        catalog.error = null;
      }

      function failed(detail) {
        catalog.error = detail.status ? `The server answered ${detail.status}.` : "Check your connection.";
      }

      function retry() {
        catalog.attempt++;
      }
    </script>

    <style type="realm">
      :host {
        display: grid;
        gap: calc(var(--spacing) * 4);
        width: min(calc(var(--spacing) * 120), 100%);
      }
      :host(:state(loading)) ul {
        opacity: 0.5;
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
        justify-content: space-between;
        padding: calc(var(--spacing) * 3);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
      }
    </style>

    <div hidden fetch="/api/products" trigger="load, #catalog.query, #catalog.attempt" debounce="250ms"
      params="q:#catalog.query" into="#catalog.products" busy="#catalog.loading"
      onload="loaded()" onerror="failed(event.detail)"></div>

    <ui-input type="search" aria-label="Search products" placeholder="Search products" oninput="search(this)"></ui-input>

    <is-visible when="#catalog.loading"><ui-spinner label="Loading products"></ui-spinner></is-visible>

    <is-visible when="#catalog.error">
      <ui-alert variant="destructive">
        <ui-alert-title>Could not load products</ui-alert-title>
        <ui-alert-description><slot name="#catalog.error"></slot></ui-alert-description>
      </ui-alert>
      <ui-button variant="outline" onclick="retry()">Try again</ui-button>
    </is-visible>

    <ul>
      <li repeat="#catalog.products" as="product" key="id">
        <span><slot name="#product.name"></slot></span>
        <ui-badge variant="secondary"><slot name="#product.price"></slot></ui-badge>
      </li>
    </ul>

    <is-visible when="#catalog.empty">
      <ui-empty>
        <ui-empty-header>
          <ui-empty-title>No products found</ui-empty-title>
          <ui-empty-description>Try another search.</ui-empty-description>
        </ui-empty-header>
      </ui-empty>
    </is-visible>
  </custom-element>

  <product-list></product-list>
</body>
</html>
```

The endpoint returns JSON such as `[{ "id": 1, "name": "Desk lamp", "price": "$39" }]` with a JSON `Content-Type`. Because each new request aborts the previous one, fast typing never shows stale results.

## Form with validation and server errors

Native constraints (`required`, `type="email"`, `minlength`) block the submit. `onloadstart="return check()"` adds a rule the browser cannot express. The server's `422` answer is mapped onto fields with `ui-field error`. Success shows a toast and resets the form.

```html runnable
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sign up</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/theme.css">
  <script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"></script>
</head>
<body>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/button.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/card.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/checkbox.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/field.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/input.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/label.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/toaster.html"></import-element>

  <custom-element name="signup-form">
    <script type="realm">
      const signup = useState({
        password: "",
        confirm: "",
        saving: false,
        errors: {},
        get mismatch() {
          return this.confirm !== "" && this.confirm !== this.password;
        },
        get confirmError() {
          return this.mismatch ? "The passwords do not match." : null;
        },
      });

      function setPassword(field) {
        signup.password = field.value;
      }

      function setConfirm(field) {
        signup.confirm = field.value;
      }

      function check() {
        signup.errors = {};
        return !signup.mismatch;
      }

      function created(form) {
        form.reset();
        document.dispatchEvent(new CustomEvent("toast", { detail: { title: "Account created" } }));
      }

      function failed(detail) {
        signup.errors = detail.data?.errors ?? { form: "Something went wrong. Try again." };
      }

      function cleared() {
        signup.password = "";
        signup.confirm = "";
        signup.errors = {};
      }
    </script>

    <style type="realm">
      :host {
        display: block;
        width: min(calc(var(--spacing) * 104), 100%);
      }
      form {
        display: grid;
        gap: calc(var(--spacing) * 5);
      }
      .error {
        margin: 0;
        color: var(--destructive);
        font-size: var(--text-sm);
      }
    </style>

    <ui-card>
      <ui-card-header>
        <ui-card-title level="1">Create an account</ui-card-title>
        <ui-card-description>All fields are required.</ui-card-description>
      </ui-card-header>
      <ui-card-content>
        <form action="/api/signup" method="post" busy="#signup.saving"
          onloadstart="return check()" onload="created(this)" onerror="failed(event.detail)" onreset="cleared()">
          <ui-field _error="#signup.errors.email" _invalid="#signup.errors.email">
            <ui-label for="signup-email">Email</ui-label>
            <ui-input id="signup-email" name="email" type="email" autocomplete="email" required></ui-input>
          </ui-field>
          <ui-field>
            <ui-label for="signup-password">Password</ui-label>
            <ui-input id="signup-password" name="password" type="password" minlength="8" required oninput="setPassword(this)"></ui-input>
            <ui-field-description>At least 8 characters.</ui-field-description>
          </ui-field>
          <ui-field _error="#signup.confirmError" _invalid="#signup.mismatch">
            <ui-label for="signup-confirm">Confirm password</ui-label>
            <ui-input id="signup-confirm" type="password" required oninput="setConfirm(this)"></ui-input>
          </ui-field>
          <ui-checkbox name="terms" required>I agree to the terms</ui-checkbox>
          <p class="error" role="alert"><slot name="#signup.errors.form"></slot></p>
          <ui-button type="submit" _disabled="#signup.saving">Create account</ui-button>
        </form>
      </ui-card-content>
    </ui-card>
  </custom-element>

  <signup-form></signup-form>
  <ui-toaster></ui-toaster>
</body>
</html>
```

The endpoint answers `201` on success, or `422` with `{ "errors": { "email": "That email is taken." } }`. Bound values that may be missing use `null` or `undefined`, never `""`: an empty string is still written as an attribute, so `_invalid=""` would mark the field invalid.

## Dialog with a trigger, a form and a confirmation

`ui-dialog-trigger` opens the dialog, `ui-dialog-close` closes it, `refs.dialog.close(value)` closes it from script, and `onclose` reads `returnValue`. The delete button asks first with `ui-alert-dialog`.

```html runnable
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Project settings</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/theme.css">
  <script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"></script>
</head>
<body>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/alert-dialog.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/button.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/dialog.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/field.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/input.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/label.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/toaster.html"></import-element>

  <custom-element name="project-settings">
    <script type="realm">
      const project = useState({ name: "Acme website", draft: "", deleted: false });

      function edit() {
        project.draft = project.name;
      }

      function setDraft(field) {
        project.draft = field.value;
      }

      function save(event) {
        event?.preventDefault();
        const name = project.draft.trim();
        if (!name) return;
        project.name = name;
        refs.dialog.close("saved");
      }

      function renamed() {
        if (refs.dialog.returnValue !== "saved") return;
        document.dispatchEvent(new CustomEvent("toast", { detail: { title: "Project renamed" } }));
      }

      function confirmed() {
        if (refs.confirm.returnValue === "delete") project.deleted = true;
      }
    </script>

    <style type="realm">
      :host {
        display: grid;
        gap: calc(var(--spacing) * 3);
        justify-items: start;
      }
      .actions {
        display: flex;
        gap: calc(var(--spacing) * 2);
      }
    </style>

    <p>Project: <strong><slot name="#project.name"></slot></strong></p>
    <is-visible when="#project.deleted"><p>This project is scheduled for deletion.</p></is-visible>

    <div class="actions">
      <ui-dialog ref="dialog" onclose="renamed()">
        <ui-dialog-trigger><ui-button variant="outline" onclick="edit()">Rename</ui-button></ui-dialog-trigger>
        <ui-dialog-header>
          <ui-dialog-title>Rename project</ui-dialog-title>
          <ui-dialog-description>The new name shows everywhere at once.</ui-dialog-description>
        </ui-dialog-header>
        <form onsubmit="save(event)">
          <ui-field>
            <ui-label for="project-name">Name</ui-label>
            <ui-input id="project-name" required _value="#project.draft" oninput="setDraft(this)"></ui-input>
          </ui-field>
        </form>
        <ui-dialog-footer>
          <ui-dialog-close><ui-button variant="outline">Cancel</ui-button></ui-dialog-close>
          <ui-button _disabled="!#project.draft" onclick="save()">Save</ui-button>
        </ui-dialog-footer>
      </ui-dialog>

      <ui-alert-dialog ref="confirm" onclose="confirmed()">
        <ui-alert-dialog-trigger><ui-button variant="destructive" _disabled="#project.deleted">Delete</ui-button></ui-alert-dialog-trigger>
        <ui-alert-dialog-header>
          <ui-alert-dialog-title>Delete this project?</ui-alert-dialog-title>
          <ui-alert-dialog-description>This cannot be undone.</ui-alert-dialog-description>
        </ui-alert-dialog-header>
        <ui-alert-dialog-footer>
          <ui-alert-dialog-cancel>Cancel</ui-alert-dialog-cancel>
          <ui-alert-dialog-action value="delete" variant="destructive">Delete</ui-alert-dialog-action>
        </ui-alert-dialog-footer>
      </ui-alert-dialog>
    </div>
  </custom-element>

  <project-settings></project-settings>
  <ui-toaster></ui-toaster>
</body>
</html>
```

Notes:

- Parts such as `ui-dialog-header` and `ui-dialog-footer` must be direct children of `ui-dialog` so they reach their slots. The form wraps only the fields, and the Save button in the footer calls the same `save()`.
- Enter in `ui-input` submits the form, so `save(event)` handles both paths.
- A button anywhere can open a dialog with commands: `<ui-button commandfor="dialog-id" command="show-modal">`.

## Dashboard page layout

`ui-sidebar-layout` gives the app shell: a collapsible sidebar, an inset for the page, an off-canvas sidebar on small screens and a trigger. Stats repeat into cards, and a native table repeats rows with the `repeat` attribute.

```html runnable
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dashboard</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/theme.css">
  <script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"></script>
  <style>
    body {
      margin: 0;
    }
  </style>
</head>
<body>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/badge.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/card.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/separator.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/sidebar.html"></import-element>
  <import-element from="https://cdn.jsdelivr.net/npm/@realmorg/unicons@alpha/dist/unicons.html"></import-element>

  <custom-element name="sales-dashboard">
    <script type="realm">
      const STATUS = {
        paid: { label: "Paid", variant: "secondary" },
        pending: { label: "Pending", variant: "outline" },
        refunded: { label: "Refunded", variant: "destructive" },
      };

      const dashboard = useState({
        nav: [
          { id: "overview", label: "Overview", icon: "layout-dashboard", href: "#overview", current: true },
          { id: "orders", label: "Orders", icon: "shopping-cart", href: "#orders", current: false },
          { id: "customers", label: "Customers", icon: "users", href: "#customers", current: false },
          { id: "settings", label: "Settings", icon: "settings", href: "#settings", current: false },
        ],
        stats: [
          { id: "revenue", label: "Revenue", value: "$45,231", change: "+20.1% from last month" },
          { id: "orders", label: "Orders", value: "2,350", change: "+180 from last month" },
          { id: "customers", label: "Customers", value: "1,203", change: "+19 this week" },
        ],
        orders: [
          { id: "1001", customer: "Olivia Martin", total: "$1,999.00", status: "paid" },
          { id: "1002", customer: "Jackson Lee", total: "$39.00", status: "pending" },
          { id: "1003", customer: "Isabella Nguyen", total: "$299.00", status: "refunded" },
        ],
        get rows() {
          return this.orders.map((order) => ({ ...order, ...STATUS[order.status] }));
        },
      });
    </script>

    <style type="realm">
      :host {
        display: block;
      }
      .brand {
        padding: calc(var(--spacing) * 2);
        font-weight: var(--font-weight-semibold);
        white-space: nowrap;
        overflow: hidden;
      }
      .bar {
        display: flex;
        align-items: center;
        gap: calc(var(--spacing) * 3);
        height: calc(var(--spacing) * 14);
        padding: 0 calc(var(--spacing) * 4);
        border-bottom: 1px solid var(--border);
      }
      .bar ui-separator {
        height: calc(var(--spacing) * 4);
      }
      main {
        display: grid;
        gap: calc(var(--spacing) * 6);
        padding: calc(var(--spacing) * 6);
      }
      h1 {
        margin: 0;
        font-size: var(--text-2xl);
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(calc(var(--spacing) * 56), 1fr));
        gap: calc(var(--spacing) * 4);
      }
      .value {
        margin: 0;
        font-size: var(--text-2xl);
        font-weight: var(--font-weight-bold);
      }
      .change {
        margin: 0;
        color: var(--muted-foreground);
        font-size: var(--text-xs);
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--text-sm);
      }
      th,
      td {
        padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);
        border-bottom: 1px solid var(--border);
        text-align: left;
      }
      th {
        color: var(--muted-foreground);
        font-weight: var(--font-weight-medium);
      }
    </style>

    <ui-sidebar-layout persist="sales-dashboard-sidebar">
      <ui-sidebar>
        <ui-sidebar-header><div class="brand">Acme Store</div></ui-sidebar-header>
        <ui-sidebar-content>
          <ui-sidebar-group>
            <ui-sidebar-group-label>Store</ui-sidebar-group-label>
            <ui-sidebar-menu>
              <ui-sidebar-menu-item repeat="#dashboard.nav" as="item" key="id">
                <ui-sidebar-menu-button _href="#item.href" _current="#item.current" _label="#item.label">
                  <u-icon _name="#item.icon"></u-icon>
                  <slot name="#item.label"></slot>
                </ui-sidebar-menu-button>
              </ui-sidebar-menu-item>
            </ui-sidebar-menu>
          </ui-sidebar-group>
        </ui-sidebar-content>
      </ui-sidebar>

      <ui-sidebar-inset>
        <div class="bar">
          <ui-sidebar-trigger></ui-sidebar-trigger>
          <ui-separator orientation="vertical"></ui-separator>
          <span>Overview</span>
        </div>
        <main>
          <h1>Overview</h1>
          <div class="stats">
            <repeat-list of="#dashboard.stats" as="stat" key="id">
              <ui-card>
                <ui-card-header>
                  <ui-card-description><slot name="#stat.label"></slot></ui-card-description>
                </ui-card-header>
                <ui-card-content>
                  <p class="value"><slot name="#stat.value"></slot></p>
                  <p class="change"><slot name="#stat.change"></slot></p>
                </ui-card-content>
              </ui-card>
            </repeat-list>
          </div>
          <ui-card>
            <ui-card-header>
              <ui-card-title level="2">Recent orders</ui-card-title>
            </ui-card-header>
            <ui-card-content>
              <table>
                <thead>
                  <tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th></tr>
                </thead>
                <tbody>
                  <tr repeat="#dashboard.rows" as="row" key="id">
                    <td>#<slot name="#row.id"></slot></td>
                    <td><slot name="#row.customer"></slot></td>
                    <td><ui-badge _variant="#row.variant"><slot name="#row.label"></slot></ui-badge></td>
                    <td><slot name="#row.total"></slot></td>
                  </tr>
                </tbody>
              </table>
            </ui-card-content>
          </ui-card>
        </main>
      </ui-sidebar-inset>
    </ui-sidebar-layout>
  </custom-element>

  <sales-dashboard></sales-dashboard>
</body>
</html>
```

For a quick table without custom cells, `ui-table` renders `columns` and `rows` given as data: `<ui-table _columns="#report.columns" _rows="#report.rows"></ui-table>`.

## Multi-page app without a router

Each page is a real HTML file. A shared shell component draws the navigation from a `page` prop, plain links move between pages, and state that must survive navigation lives in a persisted store in a shared module. There is no client router: the browser handles history, reloads and deep links.

```text
app/
  index.html               overview page
  settings.html            settings page
  state.js                 shared store
  components/
    app-shell.html         layout and navigation
    pages.html             one component per page
```

```js file=app/state.js
import { defineStore } from "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/index.js";

export const PAGES = [
  { id: "overview", label: "Overview", href: "index.html", icon: "house" },
  { id: "settings", label: "Settings", href: "settings.html", icon: "settings" },
];

export const settings = defineStore("app-settings", { name: "Ada Lovelace", compact: false }, { persist: "local" });
```

```html file=app/components/app-shell.html
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/sidebar.html"></import-element>
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/unicons@alpha/dist/unicons.html"></import-element>

<custom-element name="app-shell">
  <script type="module">
    import { PAGES, settings } from "../state.js";

    const props = defineProps({ page: prop.enum(PAGES.map((page) => page.id)).default("overview") });
    const shell = useState({
      get nav() {
        return PAGES.map((page) => ({ ...page, current: page.id === props.page }));
      },
      get title() {
        return PAGES.find((page) => page.id === props.page).label;
      },
    });
  </script>

  <style>
    :host {
      display: block;
    }
    header {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 3);
      padding: calc(var(--spacing) * 3) calc(var(--spacing) * 4);
      border-bottom: 1px solid var(--border);
    }
    main {
      padding: calc(var(--spacing) * 6);
    }
  </style>

  <ui-sidebar-layout>
    <ui-sidebar>
      <ui-sidebar-content>
        <ui-sidebar-menu>
          <ui-sidebar-menu-item repeat="#shell.nav" as="item" key="id">
            <ui-sidebar-menu-button _href="#item.href" _current="#item.current" _label="#item.label">
              <u-icon _name="#item.icon"></u-icon>
              <slot name="#item.label"></slot>
            </ui-sidebar-menu-button>
          </ui-sidebar-menu-item>
        </ui-sidebar-menu>
      </ui-sidebar-content>
    </ui-sidebar>
    <ui-sidebar-inset>
      <header>
        <ui-sidebar-trigger></ui-sidebar-trigger>
        <strong><slot name="#shell.title"></slot></strong>
        <span>Signed in as <slot name="#settings.name"></slot></span>
      </header>
      <main><slot></slot></main>
    </ui-sidebar-inset>
  </ui-sidebar-layout>
</custom-element>
```

```html file=app/components/pages.html
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/card.html"></import-element>
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/field.html"></import-element>
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/input.html"></import-element>
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/label.html"></import-element>
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/switch.html"></import-element>

<custom-element name="overview-page">
  <script type="module">
    import { settings } from "../state.js";
  </script>

  <ui-card>
    <ui-card-header>
      <ui-card-title level="1">Welcome back, <slot name="#settings.name"></slot></ui-card-title>
      <ui-card-description>Change your name on the settings page. It is kept across pages.</ui-card-description>
    </ui-card-header>
  </ui-card>
</custom-element>

<custom-element name="settings-page">
  <script type="module">
    import { settings } from "../state.js";

    function rename(field) {
      settings.name = field.value;
    }

    function setCompact(control) {
      settings.compact = control.checked;
    }
  </script>

  <style>
    form {
      display: grid;
      gap: calc(var(--spacing) * 4);
      max-width: calc(var(--spacing) * 96);
    }
  </style>

  <form onsubmit="return false">
    <ui-field>
      <ui-label for="settings-name">Display name</ui-label>
      <ui-input id="settings-name" _value="#settings.name" oninput="rename(this)"></ui-input>
    </ui-field>
    <ui-switch _checked="#settings.compact" onchange="setCompact(this)">Compact layout</ui-switch>
  </form>
</custom-element>
```

```html runnable file=app/index.html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Overview</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/theme.css">
  <script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"></script>
  <style>
    body {
      margin: 0;
    }
  </style>
</head>
<body>
  <import-element from="components/app-shell.html"></import-element>
  <import-element from="components/pages.html"></import-element>
  <app-shell page="overview"><overview-page></overview-page></app-shell>
</body>
</html>
```

```html runnable file=app/settings.html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Settings</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/theme.css">
  <script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"></script>
  <style>
    body {
      margin: 0;
    }
  </style>
</head>
<body>
  <import-element from="components/app-shell.html"></import-element>
  <import-element from="components/pages.html"></import-element>
  <app-shell page="settings"><settings-page></settings-page></app-shell>
</body>
</html>
```

Notes:

- `state.js` imports `index.js` from the same CDN version as the page's `realm.js`, so both share one runtime and one store.
- Relative paths in component files (`../state.js`, `<import-element from>`) resolve against the component file.
- The page component sits in the shell's default slot. Each component imports the store it reads, so neither depends on the other's names.
- To keep each page small, import only the page components it shows (one file per page works too).
