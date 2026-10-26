---
title: Vite plugin
description: Reference for @realmorg/vite-plugin: pre-assemble REALM components for a strict CSP, write custom-elements.json and serve component files in dev.
group: Tooling
order: 110
nav: Vite plugin
---

# Vite plugin

`@realmorg/vite-plugin` is optional. REALM needs no build step. Use the plugin when a site built with Vite must run under a strict Content Security Policy, or when you want a `custom-elements.json` manifest for editors.

Add `@realmorg/vite-plugin` to the project's dev dependencies, then:

```js
// vite.config.js
import realm from "@realmorg/vite-plugin";

export default {
  plugins: [realm()],
};
```

## Options

```ts
realm(options?: RealmPluginOptions): Plugin

interface RealmPluginOptions {
  manifest?: string | false;
}
```

| Option | Type | Default | Meaning |
| --- | --- | --- | --- |
| `manifest` | `string` or `false` | `"custom-elements.json"` | File name of the manifest written to the build output, or `false` to skip it |

## What it does

| When | Effect |
| --- | --- |
| `vite build` (after the bundle is written) | Every `.html` file in the output directory (except under `node_modules`) is pre-assembled |
| `vite` dev server | HTML files requested by `fetch` (for example by `<import-element>`) are served as is, not transformed into Vite pages |

### Pre-assembly

For each `<custom-element>` in an output HTML file that has a script or `on…` handlers:

1. Its script and handler code are compiled with [`compileDefinition`](/reference/javascript/compiler/) into a module written next to the file, named `<file>.<tag-name>.js`.
2. The inline `<script>` is replaced with `<script src="./<file>.<tag-name>.js"></script>` (the `type` is kept unless it was `module`). A definition with handlers but no script gets `<script type="realm" src="…">`.
3. `on…` attributes inside definitions are renamed to `realm:on…`.

REALM then imports these modules instead of assembling code at runtime, so a policy of `script-src 'self'` (plus your CDN, if you load REALM from one) is enough. Inline `on…` attributes on plain page elements are still inline handlers and a strict policy blocks them as usual.

### Manifest

The manifest follows the [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest) schema 2.1.0. For each definition it lists:

| Field | Source |
| --- | --- |
| `attributes` | Keys of the `defineProps({ … })` object, with type (`string`, `number`, `boolean`, `Date`, `array`, `object`, or the enum values joined with `\|`), attribute name (`.attribute()` or kebab-case) and `.default()` text |
| `events` | `dispatch("name"`, `new CustomEvent("name"` and `new Event("name"` in the script |
| `slots` | Named and default `<slot>` elements, except value slots |
| `cssParts` | `part` attributes in the markup |
| `cssStates` | `:state(…)` names in the definition's `<style>` |

## Outside Vite

The package also exports the functions the plugin uses:

| Export | Signature | Meaning |
| --- | --- | --- |
| `precompile` | `precompile(dir: string): PrecompileResult` | Pre-assemble every HTML file under `dir` |
| `precompileFile` | `precompileFile(path: string, root?: string): PrecompileResult` | Pre-assemble one file |
| `describe` | `describe(definition: Element, path: string)` | The manifest declaration for one definition |
| `createManifest` | `createManifest(declarations)` | The full manifest object |

`PrecompileResult` is `{ modules: string[]; definitions: Declaration[] }`: the module files written and the manifest declarations found.

## Related

- [Security: Content Security Policy](/docs/security/#content-security-policy)
- [Compiler](/reference/javascript/compiler/)
