---
title: Browser support
description: Which browsers REALM supports, the platform features it relies on, and what is polyfilled or emulated.
group: Guides
order: 52
nav: Browser support
---

# Browser support

REALM targets current evergreen browsers: the latest versions of Chrome, Edge, Firefox and Safari. There is no build step that could down-level the runtime, and there is no legacy fallback.

Every runtime test runs in Chromium, Firefox and WebKit through Playwright, and the site's example apps are tested end to end in all three.

## Minimum versions

The oldest versions that have every platform feature REALM uses:

| Browser | Version |
| --- | --- |
| Chrome and Edge | 125 |
| Firefox | 126 |
| Safari (macOS and iOS) | 17.4 |

The limiting feature is `CustomStateSet` with the `:state()` selector, which REALM uses for reactive CSS and loading states.

## Platform features used

| Feature | Used for |
| --- | --- |
| Custom elements and shadow DOM | Every component |
| Constructable stylesheets (`adoptedStyleSheets`) | Component styles, shared per type |
| `ElementInternals`, `CustomStateSet` and `:state()` | Roles, form association, reactive CSS states, `:state(loading)` |
| Form-associated custom elements | `form-associated` components |
| `delegatesFocus` | `delegates-focus` components |
| `Proxy`, `WeakMap`, microtasks | Reactivity |
| `AbortController` and `AbortSignal` | Cleanup and request cancellation |
| `DOMParser` | Loading component files and sanitising HTML |
| `IntersectionObserver` | `trigger="visible"` |
| ES2023 (`findLast`, `toReversed`) and `URL.canParse` | Runtime code and URL props |

## Polyfilled or emulated

- **focusgroup.** The `focusgroup` attribute is a proposal that only the newest Chromium versions have started to ship. REALM implements its arrow-key behaviour itself, so it works in every supported browser. See [Accessibility](/docs/accessibility/).
- **Invoker commands.** `ui-button` supports `commandfor` and `command` natively where the browser has them, and emulates `show-modal`, `close` and the popover commands elsewhere.

REALM UI also uses the Popover API and `<dialog>`, both available in the versions above.

## Not supported

- Internet Explorer and the legacy (EdgeHTML) Edge.
- Browsers with JavaScript disabled: components render nothing without the runtime. See [Modern framework problems](/docs/framework-problems/) for server rendering.
