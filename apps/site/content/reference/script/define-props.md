---
title: defineProps
description: Reference for defineProps, which declares a component's typed props, maps them to attributes and properties, validates them and returns a reactive object.
group: Script
order: 41
nav: defineProps
---

# `defineProps`

Declares the component's props and returns a reactive object of their current values.

```ts
defineProps<T extends Record<string, PropType>>(schema: T): Record<keyof T, unknown>
```

```js
const props = defineProps({
  label: prop.string().required(),
  size: prop.enum(["sm", "md", "lg"]).default("md"),
  count: prop.number().int().min(0).default(0).reflect(),
  disabled: prop.boolean(),
});
```

## Parameters

| Parameter | Type | Meaning |
| --- | --- | --- |
| `schema` | object of [`prop`](/reference/script/prop/) types | One key per prop |

Returns a reactive object. Read it in observers, getters and handlers. Reference it from markup with `@name`.

## Attributes and properties

| For each key | Behaviour |
| --- | --- |
| Attribute | camelCase keys map to kebab-case attributes (`maxItems` → `max-items`), or the name given with `.attribute()` |
| Property | Defined on the element (`element.maxItems`). Reading gives the current value. Writing validates it |
| Attribute changes | Parsed with the type's rules (see [`prop`](/reference/script/prop/)) and validated |
| Properties set before upgrade | A value assigned to the property before the element was defined is kept and validated |
| Invalid value | Logs `prop "name" … Using the default.` and uses the default (`false` for booleans, otherwise `undefined` unless `.default()` is set) |
| `.reflect()` | Property writes also update the attribute |
| Teardown | The property accessors are removed when the element is removed |

## Writing props from inside

Writing a declared key on the returned object goes through the property setter. The value is validated, and reflected if the type has `.reflect()`. Writing an undeclared key logs `"name" is not a declared prop.` and does nothing.

```js
function increment() {
  props.count++;
}
```

## Form-associated components

In a component defined with `form-associated`:

| Prop | Extra behaviour |
| --- | --- |
| `disabled` | Reads `true` while a surrounding `<fieldset disabled>` disables the element, even if the prop is `false` |
| `value` | Becomes the form value (`String(value)`, or no value when `null`/`undefined`) |
| `checked` | When declared, the form value is `value` (or `"on"`) while `checked`, and nothing while unchecked |
| all | Re-parsed from attributes on form reset. `value` or `checked` is restored on back/forward navigation |

## Rules

- Call it at most once per script. A second call throws `<tag> called defineProps more than once.`
- Props appear in CSS as [`var(--attr-name)`](/reference/css/variables/) and [`:state(attr-name)`](/reference/css/states/).

## Example

```html live
<custom-element name="price-tag">
  <script type="realm">
    const props = defineProps({
      amount: prop.number().min(0).default(0),
      currency: prop.enum(["USD", "EUR", "JPY"]).default("USD"),
    });

    const price = useState({
      get text() {
        return new Intl.NumberFormat("en", { style: "currency", currency: props.currency }).format(props.amount);
      },
    });
  </script>

  <strong><slot name="#price.text"></slot></strong>
</custom-element>

<p><price-tag amount="19.5"></price-tag> · <price-tag amount="1200" currency="JPY"></price-tag> · <price-tag amount="7" currency="EUR"></price-tag></p>
```

## Related

- [Props](/docs/props/)
- [`prop`](/reference/script/prop/)
