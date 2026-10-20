---
title: "<custom-element>"
description: The custom-element tag that defines a REALM component: its attributes, children, script types and instance behaviour.
group: Elements
order: 10
nav: "<custom-element>"
---

# `<custom-element>`

Defines a component. The definition holds an optional `<script>`, any number of `<style>` and `<link rel="stylesheet">` elements, and the markup every instance renders in its shadow root. There is no `<template>` wrapper and no JavaScript definition API.

```html
<custom-element name="tag-name"
  [form-associated] [role="…"] [delegates-focus] [slot="…"]>
  <script type="realm">/* runs once per element */</script>
  <style type="realm">/* scoped to the component */</style>
  <!-- markup -->
</custom-element>
```

`type="realm"` is for definitions written in a page. In a file loaded with [`<import-element>`](/reference/elements/import-element/), use a plain `<script>` and `<style>`. See [The script](#the-script).

```html live
<custom-element name="click-counter">
  <script type="realm">
    const props = defineProps({ step: prop.number().int().default(1) });
    const count = useState({ value: 0 });

    function add() {
      count.value += props.step;
    }
  </script>

  <style type="realm">
    :host {
      display: inline-flex;
      align-items: center;
      gap: calc(var(--spacing) * 3);
    }
  </style>

  <ui-button onclick="add()">Add</ui-button>
  <output>Count: <slot name="#count.value"></slot></output>
</custom-element>

<click-counter step="2"></click-counter>
```

## Attributes

| Attribute | Type | Default | Meaning |
| --- | --- | --- | --- |
| `name` | tag name containing `-` | required | The element name. Without a dash REALM warns and defines nothing |
| `form-associated` | boolean | absent | Makes the element a form field (`static formAssociated = true`). See [Forms](/docs/forms/) |
| `role` | ARIA role | none | Default role, set as `internals.role`. Page authors can still override it with a `role` attribute |
| `delegates-focus` | boolean | absent | Attaches the shadow root with `delegatesFocus: true`, so focusing the host focuses the first focusable element inside |
| `slot` | slot name | none | Makes the component a compound part. See [slot](#slot) |

### form-associated

A form-associated component:

- takes part in form submission, reset, validation, `<fieldset disabled>` and `<label>` like a native field,
- sets its form value from the `value` prop (and from `checked` when it declares one, sending `value` or `"on"` while checked),
- re-reads its attributes on form reset and restores `value` or `checked` on back/forward navigation,
- delegates to an inner `<input>`, `<select>` or `<textarea>` marked [`ref="control"`](/reference/attributes/ref/#ref-control),
- reports `props.disabled` as `true` while a surrounding fieldset is disabled, and starts disabled when created inside one,
- can use [`onFormReset`](/reference/script/on-form-reset/), [`onFormDisabled`](/reference/script/on-form-disabled/) and [`onFormStateRestore`](/reference/script/on-form-state-restore/).

### slot

With `slot="title"` on the definition, every instance gets `slot="title"` unless it sets its own `slot`, so it lands in the parent's `title` slot. A part like this can call its parent's functions and show its parent's state without a script, and those parent lookups do not log the usual `reads "name" from <parent>` message.

```html
<custom-element name="card-title" slot="title">
  <h3><slot></slot></h3>
</custom-element>
```

## Children

| Child | Meaning |
| --- | --- |
| First `<script>` | The component script. Extra scripts log a warning and are ignored |
| `<style>` | Adopted into every instance's shadow root. Scoped to the component |
| `<link rel="stylesheet" href>` | Fetched once (relative to the file that holds the definition) and adopted like `<style>`. A failed load warns |
| Anything else | Markup, cloned into each instance's open shadow root |

Styles are scanned for [`var(--attr-*)`, `var(--state-*)`](/reference/css/variables/) and [`:state(…)`](/reference/css/states/) so those stay reactive.

## The script

The script runs **once per element**, when it is first connected. Its top-level `const`, `let`, `var`, `function` and `class` names and its imports can be referenced from markup (`#name.path`) and called from handlers. The [script helpers](/reference/script/) are in scope without importing.

| Script | Where | Behaviour |
| --- | --- | --- |
| `<script type="realm">` | Definitions written in a page | The browser ignores the type, so the code only runs as the component script. A plain `<script>` in a page definition has already run in the page scope, and REALM warns |
| `<script>` | Files loaded with [`<import-element>`](/reference/elements/import-element/) | Files are parsed, not executed, so a plain script is safe |
| `<script type="module">` | Either | Use it when the script has `import` statements, for readability. REALM treats any script with leading `import` statements as a module |
| `<script src="setup.js">` | Either | Loads a **pre-assembled setup module** produced by the [Vite plugin](/reference/tooling/vite-plugin/) or [`compileDefinition`](/reference/javascript/compiler/). It is not a way to load a plain script file |

`import` statements must come first. Relative specifiers (`./store.js`) are resolved against the file that holds the definition. A script with a syntax error, or whose import fails, logs a warning and the component renders without it. An error thrown while the script runs is logged with `console.error`, and the markup still renders.

Use `<style type="realm">` in page definitions too, so the browser does not apply the styles to the page before REALM reads them.

## Instances

- Each instance gets an open shadow root with the definition's stylesheets and markup.
- Moving an element (removing and re-inserting it in the same task) keeps its state. Removing it tears it down: observers stop, listeners and requests abort, [`onDisconnected`](/reference/script/on-disconnected/) hooks run.
- The `hidden` attribute always hides a component, whatever `display` its styles set.
- REALM elements written inside a page definition are not mounted while they are part of the definition.
- Defining the same name with the same source twice is ignored. A different source logs a warning and the first is kept. A name another library already registered logs a warning.

## Where definitions go

Inline in a page (REALM defines them on start and when they are added later) or in an HTML file loaded with [`<import-element>`](/reference/elements/import-element/). `realm.css` hides definitions with `display: none`.

## Related

- [Component anatomy](/docs/components/)
- [Component script](/reference/script/)
- [Nested components and scope](/docs/scope/)
