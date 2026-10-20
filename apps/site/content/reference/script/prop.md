---
title: prop
description: Reference for the prop type builder, every type (string, number, boolean, enum, date, array, object) and every rule (default, required, optional, reflect, attribute, min, max, int, pattern, email, url).
group: Script
order: 42
nav: prop
---

# `prop`

Builds the prop types passed to [`defineProps`](/reference/script/define-props/). Available in every script, and exported from `@realmorg/realm`.

```js
prop.string().min(2).max(40).required()
prop.number().int().min(0).default(1).reflect()
prop.enum(["sm", "md", "lg"]).default("md")
prop.array(prop.object({ id: prop.number(), label: prop.string() })).default([])
```

Every method returns a **new** type, so types can be stored and reused.

## Types

| Builder | Value type | Attribute text → value |
| --- | --- | --- |
| `prop.string()` | `string` | As is |
| `prop.number()` | `number` | `Number(text)`. Empty or blank text is invalid, and so is `NaN` |
| `prop.boolean()` | `boolean` | Present (any text, even `"false"`) is `true`, absent is `false` |
| `prop.enum(values: string[])` | one of `values` | As is, then checked against `values` |
| `prop.date()` | `Date` | `new Date(text)`. An invalid date is invalid |
| `prop.array(item?: PropType)` | `unknown[]` | `JSON.parse(text)`. Every item is checked with `item` when given |
| `prop.object(shape?: Record<string, PropType>)` | plain object | `JSON.parse(text)`. Each key in `shape` is checked with its type |

Property writes skip the text conversion and are checked directly, so `element.count = "3"` is invalid for a number prop.

## Rules

| Rule | Applies to | Meaning | Failure message |
| --- | --- | --- | --- |
| `.default(value)` | all | Value when the prop is missing, `null`, `undefined` or invalid. Objects and arrays are cloned for each element | |
| `.required()` | all | Missing values are invalid (unless there is a default) | `is required` |
| `.optional()` | all | Undoes `.required()`. Missing values are `undefined` (`false` for booleans) | |
| `.reflect()` | all | Property writes update the attribute | |
| `.attribute(name)` | all | Use this attribute name instead of the kebab-case key | |
| `.min(n)` | string, number | Minimum length, or minimum value | `must be at least n characters` / `must be at least n` |
| `.max(n)` | string, number | Maximum length, or maximum value | `must be at most n characters` / `must be at most n` |
| `.int()` | number | Must be an integer | `must be an integer` |
| `.pattern(regex)` | string | Must match `regex` | `must match /…/` |
| `.email()` | string | Must look like `name@host.tld` | `must be an email address` |
| `.url()` | string | Must be parseable by `URL.canParse` | `must be a URL` |

Type mismatches report `expected a string, got number`, `"NaN" is not a number`, `must be one of "sm", "md", "lg"`, `is not a valid date`, `expected an array`, `expected an object`, or `"…" is not valid JSON`. Nested failures name the position: `[2] expected a string`, `.label is required`.

## Reflection

With `.reflect()`, writing the property writes the attribute:

| Value | Attribute |
| --- | --- |
| `true` | present, empty |
| `false`, `null`, `undefined` | removed |
| `Date` | `toISOString()` |
| object or array | `JSON.stringify(value)` |
| anything else | `String(value)` |

## Example

```html live
<custom-element name="rating-badge">
  <script type="realm">
    const props = defineProps({
      score: prop.number().min(0).max(5).default(0),
      label: prop.string().max(12).default("Rating"),
    });
  </script>

  <ui-badge variant="secondary"><slot name="@label"></slot>: <slot name="@score"></slot> / 5</ui-badge>
</custom-element>

<rating-badge score="4"></rating-badge>
<rating-badge score="9" label="Score out of range"></rating-badge>
```

The second badge's `score` fails `.max(5)` and its label fails `.max(12)`, so both use their defaults (a warning is logged for each).

## Related

- [Props: types and modifiers](/docs/props/#types)
