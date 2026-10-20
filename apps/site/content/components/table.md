---
title: Table
description: A data table rendered from a list of columns and rows, plus the pattern for building a custom table from component state.
group: Display
order: 213
nav: Table
---

# Table

`ui-table` renders a native `<table>` from two properties: `columns`, which lists the keys and header labels, and
`rows`, a list of plain objects. Each cell shows the row's value for the column key as text. The table fills the
width of its container and scrolls horizontally when its content is wider.

```html live
<ui-table
  caption="A list of your recent invoices."
  columns='[{"key":"invoice","label":"Invoice"},{"key":"status","label":"Status"},{"key":"method","label":"Method"},{"key":"amount","label":"Amount"}]'
  rows='[{"id":"INV001","invoice":"INV001","status":"Paid","method":"Credit card","amount":"$250.00"},{"id":"INV002","invoice":"INV002","status":"Pending","method":"PayPal","amount":"$150.00"},{"id":"INV003","invoice":"INV003","status":"Unpaid","method":"Bank transfer","amount":"$350.00"}]'>
</ui-table>
```

## Examples

### Data from component state

In a component, bind `columns` and `rows` with `_columns` and `_rows`. Arrays and objects are passed as properties,
so the table re-renders whenever the state changes. Here the rows are a getter that filters and sorts the data.

```html live
<custom-element name="table-invoices-demo">
  <script type="realm">
    const COLUMNS = [
      { key: "id", label: "Invoice" },
      { key: "customer", label: "Customer" },
      { key: "status", label: "Status" },
      { key: "total", label: "Amount" },
    ];
    const INVOICES = [
      { id: "INV001", customer: "Olivia Martin", status: "Paid", amount: 250 },
      { id: "INV002", customer: "Jackson Lee", status: "Pending", amount: 150 },
      { id: "INV003", customer: "Isabella Nguyen", status: "Unpaid", amount: 350 },
      { id: "INV004", customer: "William Kim", status: "Paid", amount: 450 },
      { id: "INV005", customer: "Sofia Davis", status: "Paid", amount: 550 },
    ];
    const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

    const invoices = useState({
      columns: COLUMNS,
      paidOnly: false,
      get rows() {
        return INVOICES.filter((invoice) => !this.paidOnly || invoice.status === "Paid")
          .toSorted((a, b) => b.amount - a.amount)
          .map((invoice) => ({ ...invoice, total: currency.format(invoice.amount) }));
      },
    });

    function filter(event) {
      invoices.paidOnly = event.target.checked;
    }
  </script>
  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
      width: 100%;
    }
    label {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 2);
      font-size: var(--text-sm);
    }
  </style>
  <label><input type="checkbox" onchange="filter(event)"> Paid only</label>
  <ui-table _columns="#invoices.columns" _rows="#invoices.rows" caption="Sorted by amount, highest first."></ui-table>
</custom-element>
<table-invoices-demo></table-invoices-demo>
```

### Column labels

`label` is optional. Without it, the header shows the column `key`.

```html live
<ui-table
  columns='[{"key":"name"},{"key":"role"},{"key":"email","label":"Email address"}]'
  rows='[{"id":1,"name":"Ada","role":"Owner","email":"ada@example.com"},{"id":2,"name":"Linus","role":"Member","email":"linus@example.com"}]'>
</ui-table>
```

### Custom cells with a native table

`ui-table` cells hold text only. When cells need badges, buttons or links, write a native `<table>` in your
component and repeat the rows with the `repeat` attribute on `<tr>` (inside `<table>`, `<ul>`, `<ol>` and
`<select>`, use `repeat` on the item rather than `<repeat-list>`, so the HTML parser keeps the structure).

```html live
<custom-element name="table-members-demo">
  <script type="realm">
    const ROLE_VARIANTS = { Owner: "default", Admin: "secondary", Member: "outline" };

    const team = useState({
      members: [
        { id: 1, name: "Olivia Martin", email: "olivia@example.com", role: "Owner" },
        { id: 2, name: "Jackson Lee", email: "jackson@example.com", role: "Admin" },
        { id: 3, name: "Sofia Davis", email: "sofia@example.com", role: "Member" },
      ],
      get rows() {
        return this.members.map((member) => ({
          ...member,
          variant: ROLE_VARIANTS[member.role],
          initials: member.name.split(" ").map((part) => part[0]).join(""),
        }));
      },
    });

    function remove(member) {
      team.members = team.members.filter((item) => item.id !== member.id);
    }
  </script>
  <style type="realm">
    :host {
      display: block;
      width: 100%;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--text-sm);
    }
    th {
      height: calc(var(--spacing) * 10);
      padding: 0 calc(var(--spacing) * 2);
      text-align: left;
      font-weight: var(--font-weight-medium);
    }
    td {
      padding: calc(var(--spacing) * 2);
    }
    tr {
      border-bottom: 1px solid var(--border);
    }
    tbody tr:last-child {
      border-bottom: 0;
    }
    .person {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 3);
    }
    small {
      display: block;
      color: var(--muted-foreground);
    }
    .actions {
      text-align: right;
    }
  </style>
  <table>
    <thead>
      <tr><th>Member</th><th>Role</th><th class="actions">Actions</th></tr>
    </thead>
    <tbody>
      <tr repeat="#team.rows" as="member" key="id">
        <td>
          <div class="person">
            <ui-avatar><ui-avatar-fallback><slot name="#member.initials"></slot></ui-avatar-fallback></ui-avatar>
            <div><slot name="#member.name"></slot><small><slot name="#member.email"></slot></small></div>
          </div>
        </td>
        <td><ui-badge _variant="#member.variant"><slot name="#member.role"></slot></ui-badge></td>
        <td class="actions"><ui-button size="sm" variant="ghost" onclick="remove(member)">Remove</ui-button></td>
      </tr>
    </tbody>
  </table>
</custom-element>
<table-members-demo></table-members-demo>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | array of `{ key: string, label?: string }` | `[]` | The columns, in order. `key` is required and selects the value from each row; `label` is the header text and falls back to `key`. Accepts JSON in the attribute, or an array through the `columns` property or a `_columns` binding. |
| `rows` | array of objects | `[]` | The rows. Each object's values are looked up by column key; missing values render as empty cells. A row's `id`, when present, keys the row so updates reuse its DOM; otherwise the index is used. Accepts JSON or an array, like `columns`. |
| `caption` | string | none | Text for the table's `<caption>`, shown under the table. The caption is hidden when this is not set. |

### Properties

`columns` and `rows` are also properties. Assigning a new array re-renders the table:

```html
<ui-table id="people"></ui-table>
<script>
  const table = document.getElementById("people");
  table.columns = [{ key: "name", label: "Name" }, { key: "email", label: "Email" }];
  table.rows = [{ id: 1, name: "Ada", email: "ada@example.com" }];
</script>
```

### Parts

`ui-table` has no child parts and no slots: it renders everything from `columns`, `rows` and `caption`. For cells
with markup, use a native table as shown above.

### CSS parts

| Part | Description |
| --- | --- |
| `table` | The native `<table>`. |
| `head` | Each header cell (`<th>`). |
| `row` | Each body row (`<tr>`). |
| `cell` | Each body cell (`<td>`). |

Rows get a bottom border and a muted background on hover. Cells do not wrap; long tables scroll horizontally
inside the element.

### Accessibility

The output is a native `<table>` with `<thead>`, `<th>` header cells and an optional `<caption>`, so screen
readers announce row and column headers. Set `caption` to give the table a name.
