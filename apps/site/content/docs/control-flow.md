---
title: Control flow
description: Show and remove content with is-visible and is-hidden, compare values with eq, neq, gt, gte, lt, lte and contains, and hide without removing using _hidden.
group: Core concepts
order: 15
nav: Control flow
---

# Control flow

`<is-visible>` and `<is-hidden>` add or remove their content based on a reference.

```html
<is-visible when="#cart.isEmpty">
  <p>Your cart is empty.</p>
</is-visible>

<is-hidden when="#cart.isEmpty">
  <cart-list></cart-list>
</is-hidden>
```

| Tag | Content is present when |
| --- | --- |
| `<is-visible when="#ref">` | the value is truthy (or the comparison is true) |
| `<is-hidden when="#ref">` | the value is falsy (or the comparison is false) |

Content that is not shown is **removed** from the DOM, not hidden with CSS. Its bindings, listeners, requests and nested components stop, and they start fresh when the content comes back. Both tags lay out as if they were not there (`display: contents`).

## Comparisons

For simple cases, compare the value with one of these attributes instead of writing a getter:

| Attribute | True when |
| --- | --- |
| `eq="text"` | `String(value) === "text"` |
| `neq="text"` | `String(value) !== "text"` |
| `gt="n"`, `gte="n"` | the value as a number is greater than (or equal to) `n` |
| `lt="n"`, `lte="n"` | the value as a number is less than (or equal to) `n` |
| `contains="text"` | an array has an item equal to `text`, or a string includes `text` |

```html live
<custom-element name="order-status">
  <script type="realm">
    const STEPS = ["placed", "packed", "shipped", "delivered"];

    const order = useState({
      step: 0,
      tags: ["gift"],
      get status() {
        return STEPS[this.step];
      },
    });

    function next() {
      order.step = (order.step + 1) % STEPS.length;
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      justify-items: start;
    }
  </style>

  <p>Status: <strong><slot name="#order.status"></slot></strong></p>
  <is-visible when="#order.status" eq="shipped"><p>On its way.</p></is-visible>
  <is-visible when="#order.step" gte="2"><ui-badge variant="secondary">Tracking available</ui-badge></is-visible>
  <is-hidden when="#order.status" neq="delivered"><p>Delivered. Enjoy!</p></is-hidden>
  <is-visible when="#order.tags" contains="gift"><p>Gift wrapped.</p></is-visible>
  <ui-button size="sm" onclick="next()">Next step</ui-button>
</custom-element>

<order-status></order-status>
```

Anything more involved belongs in a getter, which keeps the markup free of logic:

```js
const order = useState({
  items: [],
  get canCheckout() {
    return this.items.length > 0 && this.items.every((item) => item.inStock);
  },
});
```

```html
<is-visible when="#order.canCheckout"><ui-button>Checkout</ui-button></is-visible>
```

`!` works in `when` too: `<is-visible when="!#user.signedIn">`.

## Hiding without removing

To keep content in the DOM (for example to keep a form's typed values, or a playing video), bind the native `hidden` attribute instead:

```html
<section _hidden="!#panel.open">…</section>
```

## Choosing between several cases

There is no `else if` tag. Map the case to a value in the script and compare it with `eq`, or use a lookup table that produces what the markup needs:

```js
const VIEWS = {
  loading: { title: "Loading…", tone: "muted" },
  error: { title: "Something went wrong", tone: "destructive" },
  ready: { title: "Up to date", tone: "default" },
};

const status = useState({
  state: "loading",
  get view() {
    return VIEWS[this.state];
  },
});
```

```html
<is-visible when="#status.state" eq="error"><ui-button onclick="retry()">Retry</ui-button></is-visible>
<p _data-tone="#status.view.tone"><slot name="#status.view.title"></slot></p>
```

## Inside tables and selects

The HTML parser moves unknown elements out of `<table>`, `<tr>` and `<select>`. Do not put `<is-visible>` there. Bind `_hidden` on the row or option instead, or filter the list in a getter and [repeat](/docs/lists/) over the result.

## Recursive components

A component can render itself, which is how trees such as folders or comment threads are built. Put the nested copy inside a condition that eventually turns false, here when a node has no children:

```html live
<custom-element name="file-tree">
  <script type="realm">
    const props = defineProps({
      node: prop.object().default({ name: "src", children: [{ name: "lib", children: [{ name: "store.js" }] }, { name: "app.html" }] }),
    });
    const tree = useState({
      get children() {
        return props.node.children ?? [];
      },
      get hasChildren() {
        return this.children.length > 0;
      },
    });
  </script>

  <style type="realm">
    ul {
      margin: 0;
      padding-left: calc(var(--spacing) * 4);
    }
  </style>

  <slot name="@node.name"></slot>
  <is-visible when="#tree.hasChildren">
    <ul>
      <li repeat="#tree.children" as="child" key="name"><file-tree _node="#child"></file-tree></li>
    </ul>
  </is-visible>
</custom-element>

<file-tree></file-tree>
```

Trees can be as deep as your data. A component nested more than 1000 components deep is not set up, and the console warns `<file-tree> is nested 1000 deep. Stop its recursion with a condition.` That almost always means the component renders itself with nothing to stop it.

