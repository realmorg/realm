---
title: Props
description: Declare typed, validated attributes with defineProps and the prop builder, read them with @ references, and pass objects between components.
group: Core concepts
order: 11
nav: Props
---

# Props

Props are a component's public attributes. Declare them with `defineProps` and the `prop` builder, which converts attribute text into typed values, validates them and supplies defaults.

```js
const props = defineProps({
  heading: prop.string().default("Todos"),
  count: prop.number().int().min(0).default(0),
  variant: prop.enum(["primary", "ghost", "danger"]).default("primary"),
  disabled: prop.boolean(),
  tags: prop.array(prop.string()).default([]),
  user: prop.object({ name: prop.string(), email: prop.string().email() }).optional(),
  href: prop.string().url().required(),
  size: prop.number().attribute("data-size").reflect(),
});
```

`defineProps` returns a reactive object. Read it in the script (`props.count`) and in markup with `@` references:

```html
<h2><slot name="@heading"></slot></h2>
<button _disabled="@disabled">Save</button>
```

```html live
<custom-element name="price-tag">
  <script type="realm">
    const props = defineProps({
      amount: prop.number().min(0).default(0),
      currency: prop.enum(["USD", "EUR", "JPY"]).default("USD"),
      sale: prop.boolean(),
    });

    const price = useState({
      get label() {
        return new Intl.NumberFormat("en", { style: "currency", currency: props.currency }).format(props.amount);
      },
    });
  </script>

  <style type="realm">
    :host {
      display: inline-flex;
      gap: calc(var(--spacing) * 2);
      align-items: center;
      font-variant-numeric: tabular-nums;
    }
  </style>

  <strong><slot name="#price.label"></slot></strong>
  <ui-badge variant="destructive" _hidden="!@sale">Sale</ui-badge>
</custom-element>

<price-tag amount="19.5"></price-tag>
<price-tag amount="12" currency="EUR" sale></price-tag>
<price-tag amount="-3" currency="JPY"></price-tag>
```

The third tag has an invalid amount. REALM logs a warning naming the component, the prop and the rule, then uses the default (`0`). Invalid values never crash a component.

## Types

| Builder | Attribute text is converted with | Rules |
| --- | --- | --- |
| `prop.string()` | As-is | `.min(n)`, `.max(n)` (length), `.pattern(regex)`, `.email()`, `.url()` |
| `prop.number()` | `Number(text)`; empty text is invalid | `.int()`, `.min(n)`, `.max(n)` |
| `prop.boolean()` | Native rule: present is `true`, absent is `false` | |
| `prop.enum([...])` | Must be one of the listed strings | |
| `prop.date()` | `new Date(text)`, usually ISO text | Must be a valid date |
| `prop.array(item?)` | `JSON.parse(text)` | Each item is checked against `item` |
| `prop.object(shape?)` | `JSON.parse(text)` | Each key in `shape` is checked |

Arrays and objects are usually passed as properties, not written by hand as JSON. See [Passing objects](#passing-objects).

## Modifiers

| Modifier | Meaning |
| --- | --- |
| `.default(value)` | Used when the attribute is missing or its value is invalid. Object and array defaults are cloned per instance |
| `.required()` | A missing value is reported with a warning |
| `.optional()` | Allows `undefined` |
| `.reflect()` | Setting the property also writes the attribute (`false`, `null` and `undefined` remove it, `true` writes an empty attribute) |
| `.attribute("name")` | Use a different attribute name. By default `maxItems` maps to `max-items` |

Without a default, a missing prop is `undefined`, except booleans, which are `false`.

## Attributes and properties

Each prop is both an attribute and a property on the element, like native elements:

```js
const tag = document.querySelector("price-tag");
tag.amount = 25; // property: validated, not written to the attribute
tag.setAttribute("amount", "30"); // attribute: parsed, then validated
```

- Attribute changes are picked up automatically (through a `MutationObserver`, so they apply in the next microtask).
- Properties set on an element before its definition loads are kept and applied on upgrade.
- A prop with `.reflect()` writes the attribute back when the property changes, which makes it usable from CSS selectors such as `:host([open])`.

## Writing props from inside

`props` is read-mostly. Writing a declared prop from the component goes through the same validation as a property write, and reflects if the prop reflects:

```js
const props = defineProps({ open: prop.boolean().reflect() });

function toggle() {
  props.open = !props.open;
}
```

Writing a name that is not declared logs a warning and does nothing. Use `useState` for internal values.

## Passing objects

A `_` binding to another REALM component passes objects and arrays as properties, so they arrive intact instead of being turned into text:

```html
<user-card _user="#session.user" _compact="@compact"></user-card>
```

```js
// inside user-card
const props = defineProps({
  user: prop.object({ name: prop.string(), email: prop.string().email() }),
  compact: prop.boolean(),
});
```

Strings, numbers and booleans are written as attributes, which the child parses with its own prop types.

## Props in CSS

Every prop can be read in the component's styles as `var(--attr-name)` and matched with `:state(attr-name)` or `:state(attr-name-is-value)`:

```css
:host(:state(attr-variant-is-danger)) button {
  background: var(--destructive);
}
```

See [Styling](/docs/styling/).

## One call per component

`defineProps` may be called once per script. A second call is reported as an error. Put every prop in one schema.
