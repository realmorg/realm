---
title: Compiler
description: Reference for @realmorg/realm/compiler, the build-time module that turns a custom-element definition into a setup module and tokenizes scripts.
group: JavaScript API
order: 107
nav: Compiler
---

# Compiler

`compiler.js` holds REALM's build-time code. The [Vite plugin](/reference/tooling/vite-plugin/) uses it. You need it only to build your own tooling.

```js
import { compileDefinition, tokenize } from "https://realm.js.org/dist/compiler.js";
```

## compileDefinition

```ts
compileDefinition(definition: Element): CompiledDefinition | undefined

interface CompiledDefinition {
  name: string;
  script: Element | undefined;
  module: string;
}
```

Turns a `<custom-element>` element into the source of a **setup module**: the script and the handler code from the markup, assembled into a function that REALM can load with `<script src>`.

| Field | Meaning |
| --- | --- |
| `name` | The definition's `name` attribute |
| `script` | The definition's `<script>` element, if any, so the caller can replace it |
| `module` | JavaScript source: hoisted `import` statements, `export const names = [...]` (the exposed top-level names) and `export default function (context) { … }` |

Returns `undefined` when there is nothing to assemble: the script already has a `src`, or there is neither script text nor any `on…` handler in the markup.

Write `module` to a file and point the definition at it with `<script src="file.js"></script>` (keep `type="realm"` for inline definitions). REALM then imports the module instead of assembling code at runtime, which lets components run under `script-src 'self'`. The Vite plugin also renames `on…` attributes inside definitions to `realm:on…` in the output HTML, so the page holds no inline handler attributes. REALM reads both forms.

Relative `import` specifiers are kept as written, so they resolve against the module file.

## tokenize

```ts
tokenize(source: string): Token[]

interface Token {
  type: "name" | "punct" | "string" | "number" | "regex" | "template";
  value: string;
  newline: boolean;
}
```

The small JavaScript tokenizer REALM uses to find top-level names and free variables. Comments are skipped. `newline` is `true` when a line break came before the token. The Vite plugin uses it to read `defineProps` for the manifest.

## Related

- [Security: Content Security Policy](/docs/security/#content-security-policy)
