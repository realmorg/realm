# Working on REALM

REALM v2 is specified in `openspec/specs`. Read the relevant spec before changing behaviour,
and propose changes through OpenSpec (`/opsx:propose`) rather than editing specs directly.

## Commands

| Task | Command |
| --- | --- |
| Install | `pnpm install` |
| Unit and component tests (Chromium, with 100% coverage gate) | `pnpm --filter @realmorg/realm coverage` |
| Firefox and WebKit | `pnpm --filter @realmorg/realm test:cross` |
| Typecheck | `pnpm typecheck` |
| Lint and format | `pnpm lint` / `pnpm format` (Biome) |
| Specs | `pnpm spec` (strict validation and scenario-to-test check) |
| Build | `pnpm build` |

## Rules

- Native HTML first. Use the platform's own feature and naming wherever it exists.
- Do not copy template syntax or helper semantics from other frameworks. They are references only.
- Comments only where the code cannot explain itself (a browser quirk, a performance trick).
- Clear names over abbreviations. The bundler minifies.
- No globals on `window`. No module-level side effects outside `src/auto.ts`.
- Every listener, timer, observer and request is tied to its element's `AbortSignal` and stops on removal.
- Coverage of `packages/realm/src` stays at 100%. Add a test with every change.
- Every OpenSpec scenario name equals a test title.

## Authoring components and examples

- A component is one `<custom-element name="…">` with an optional `<script>`, `<style>` and markup. No `<template>`, no JS definition API.
- Values: `<slot name="#state.path">` and `<slot name="@prop">`. Attributes: `_attr="#ref"` or `_attr="!#ref"`. Never `{}` or expressions in attributes.
- Events: native `onclick="save(item)"` calling script functions. Emit with `dispatch(type, detail)`.
- Script order: `defineProps` → `useState` → functions → `defineMethods`, `listen`, lifecycle hooks, and `observe` last.
- Keep scripts short. If a component needs plumbing, add a core primitive instead.
- Lookup tables instead of `else if` / `switch` chains.
- Style variants with reactive CSS (`:host(:state(attr-variant-is-outline))`, `var(--attr-*)`, `var(--state-*)`).
- Sizes, spacing, radii, shadows and colours come from the tokens in `packages/ui/theme.css` (`calc(var(--spacing) * 4)`, `var(--text-sm)`, `var(--radius-md)`). No hard-coded values.
- Inline definitions in a page use `<script type="realm">`. Files loaded through `<import-element>` use plain `<script>` (or `type="module"` when they `import`).
- Inside `<ul>`/`<ol>`/`<table>`/`<select>`, repeat with the `repeat` attribute on the item (`<li repeat="#list" as="item" key="id">`), not `<repeat-list>`.
- Compose with compound parts, not `slot="…"` attributes: `<ui-card><ui-card-header><ui-card-title>`. A part is its own `<custom-element name="ui-<parent>-<part>" slot="<slot>">`, usually with no script: its handlers and values resolve from the parent component (`onclick="requestClose()"`).
- Usage never needs `style="…"` on a reusable element. Components fill their container's inline size where that is the natural layout, and expose attributes for real variation (`size`, `variant`, `width`/`height` in spacing units). Page layout belongs to the page.
