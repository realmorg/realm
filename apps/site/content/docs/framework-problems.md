---
title: Modern framework problems
description: A checklist of common front-end framework problems, such as FOUC, hydration, memory leaks, XSS, stale closures, fetch races, CSP and SEO, and how REALM handles each one, including its gaps.
group: Guides
order: 53
nav: Framework problems
---

# Modern framework problems and how REALM handles them

Every UI framework has to answer the same questions. This page lists the common ones and REALM's answer to each, including where REALM has no answer yet. "Gap" means a known limitation, not a hidden feature.

| Problem | How REALM handles it | Status |
| --- | --- | --- |
| **Flash of unstyled content (FOUC)** | `realm.css` hides custom elements until they are defined (`:not(:defined)`) and hides definitions and `<import-element>`. Styles are adopted before a component's markup is inserted, so a component never appears unstyled | Handled. The trade-off: content is invisible until its definition loads |
| **Hydration mismatches and glitches** | There is no server render to hydrate. Components render once, in the browser, from their definition | Not applicable |
| **SSR and SEO** | Light DOM content you write inside components (headings, paragraphs, links placed in slots) is in the HTML and indexable. Shadow DOM content is created by JavaScript. Search engines that run JavaScript see it; others do not | **Gap.** No server-side rendering yet. Declarative Shadow DOM output is planned after 2.0. Keep important text in light DOM |
| **Bundle size** | About 15 KB gzipped for the whole runtime, no compiler, no per-component runtime cost beyond your own code | Handled |
| **Build tooling** | None required. Components are HTML files; scripts are plain JavaScript | Handled. A bundler is optional |
| **Memory leaks** | Every listener, observer, timer, debounce, poll and request is tied to the element's `AbortSignal`. Removal aborts it and empties the shadow root. A memory test mounts and removes components 1,000 times and checks they are collected | Handled for everything started through REALM. Code you start without `signal` is yours to stop |
| **Stale closures** | Components never re-run, so there is no "closure from an old render". Functions read state through live proxies at call time, and loop handlers receive the current item | Handled |
| **Effect dependency arrays** | `observe` tracks what it reads; there is no array to get wrong | Handled |
| **Over-rendering** | Fine-grained subscriptions: a change updates only the slots and bindings that read it. Updates are batched per microtask | Handled |
| **Infinite update loops** | An observer that keeps changing its own input is stopped after 100 rounds with an error | Handled |
| **Race conditions in data fetching** | A new request from an element aborts its previous one; identical `GET`s in flight are shared; requests abort when the element is removed; errors never render | Handled for fetch attributes. For `fetch()` in scripts, pass `signal` and handle ordering yourself |
| **Loading and error states** | `busy="#ref"`, `aria-busy`, `:state(loading)`, and native `loadstart`/`load`/`error`/`abort`/`timeout`/`loadend` events | Handled |
| **XSS** | Markup holds references, never expressions. Values are inserted as text. `html` slots and `render` sanitise (scripts, `on*` attributes, `javascript:` URLs removed) and inserted HTML is never scanned for handlers | Handled for the common cases. The sanitiser is a deny-list: sanitise user rich text on the server too, and never use `html-unsafe` for untrusted input |
| **Content Security Policy** | No `eval`, `new Function` or `blob:`. REALM copies the page's script nonce onto the scripts it assembles. Markup handlers are compiled into the component script, not inline attributes | Handled for nonce-based policies. **Gap:** hash-only policies and Trusted Types are not supported |
| **Style leaks and CSS conflicts** | Component styles live in shadow roots and cannot leak out; page styles cannot leak in except through inherited properties | Handled |
| **Theming across components** | Design tokens as CSS custom properties, `part` for inner elements, custom states for variants, `data-theme` for dark mode | Handled |
| **Custom form inputs** | `form-associated` components submit, reset, validate, disable and restore through `ElementInternals`; `ref="control"` delegates to a native control | Handled |
| **Accessibility** | Native elements inside components, default roles through `ElementInternals`, `delegates-focus`, a `focusgroup` implementation for arrow-key navigation, ARIA bindings that write `"true"`/`"false"`, `aria-busy` on requests | Partly. Roles set through `ElementInternals` are invisible to some audit tools, and you are still responsible for your own components' semantics |
| **Prop drilling and global state** | Nested components read parent state automatically (with a one-time warning), and `defineStore` provides app-wide, optionally persisted state | Handled |
| **"Already defined" registration errors** | Defining the same component twice is a no-op; conflicting definitions keep the first and warn; imports of the same file are shared | Handled |
| **Request waterfalls when loading components** | Each file is fetched once, at most six at a time per origin; bundles hold many components; `loading="lazy"` defers files | Partly. Components imported by other component files are discovered only when those load. Bundle components that are always used together |
| **Error isolation** | A syntax error in one component's script, or an error thrown during setup, is reported and that component still renders its markup. Errors in observers do not stop other observers | Partly. There is no error-boundary API to render fallback UI |
| **TypeScript and editor support** | The package ships type declarations for its exports | **Gap.** Component scripts are not type-checked, and there is no editor plugin for references and props yet |
| **Routing** | Links with `render` load another page's content into a ref and update the address bar | **Gap.** No client-side router. Use normal page navigation or `render` links |
| **Very long lists** | Keyed lists reuse and move rows | **Gap.** No built-in virtualisation |
| **Interop with other frameworks** | REALM components are standard custom elements: they take attributes and properties and emit DOM events, so they work in any framework or none | Handled |
| **Debugging** | Clear, one-time `[realm]` console warnings that name the component, the attribute and the rule; assembled scripts get a `sourceURL` named after the component file | Partly. No devtools extension |

## When REALM is a good fit

- Sites and apps where pages are HTML and interactivity is per component: dashboards, admin tools, documentation, marketing sites with interactive parts, internal apps.
- Teams that want to avoid a toolchain, or want components that work in any stack.

## When to look elsewhere

- Pages that must render fully without JavaScript or need server rendering for SEO today.
- Very large single-page apps that need a router, code-splitting strategy and type-checked templates out of the box.
