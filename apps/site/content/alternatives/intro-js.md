---
title: Intro.js alternatives
description: Looking for an Intro.js alternative? AGPL licensing, accessibility and resume support compared with REALM Pro's tour, Driver.js, Shepherd.js and Joyride.
seoTitle: Intro.js alternative for accessible product tours
---

# Intro.js alternatives

For most commercial projects, [Intro.js](https://introjs.com/) is cheap to license and quick to set up, and its hints feature is something most alternatives lack, so it is a fair choice. If you want a free MIT library, pick **Driver.js**. If you want a tour that behaves as an accessible dialog (focus moved and trapped, focus returned, reduced motion respected), with steps that wait for a real click and a resume button, and you also want the rest of a component kit, use `ui-kit-tour` from [REALM Pro](/pro/). For React apps, **React Joyride** is the usual pick. **Shepherd.js** is strong on accessibility but is no longer free for companies with revenue.

Facts were checked in October 2026 against [introjs.com](https://introjs.com/), the Intro.js [licence](https://github.com/usablica/intro.js/blob/master/license.md) and [tour options](https://introjs.com/docs/tour/options), and each alternative's own site, licence and npm page, linked below. Intro.js is at 8.6.0, released 21 September 2026.

## Why people look for an alternative

- **The licence is AGPL.** Intro.js is AGPL-3.0 for open source use, and commercial use needs a paid licence. The prices are low and paid once: Starter $9.99 for one project, Business $49.99 for five projects, Premium $299.99 for unlimited projects. Still, AGPL code needs care in a closed source product, and some legal teams block it outright.
- **Accessibility is not documented.** Intro.js has keyboard navigation and Escape to exit, on by default. Its site and options page make no statement about focus handling, ARIA roles or screen readers.
- **Resume is left to you.** Intro.js has a "don't show again" option and events, but showing "Resume tour" with progress, or picking up at step 4 on the next visit, is your code.
- **Interactive steps.** A common need is a step that waits for people to press the real button. Intro.js lets you turn off interaction with the highlighted element, but advancing on a real event is something you wire up.

## What ui-kit-tour does instead

`ui-kit-tour` is the product tour in REALM Pro. Steps are a list of objects, each with a CSS selector `target`, a `title`, `text` that may hold simple HTML formatting, a preferred `placement`, and optional `interactive` or `advanceOn` settings.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-tour/light-desktop.png" alt="REALM Pro product tour component, desktop, light mode" width="960" height="574" loading="lazy">
    <figcaption>REALM Pro product tour. <a href="/pro/components/ui-kit-tour/">See it in dark mode and on a phone</a>.</figcaption>
  </figure>
</div>

```html
<ui-kit-tour launcher></ui-kit-tour>

<script type="module">
  const tour = document.querySelector("ui-kit-tour");
  tour.steps = [
    { id: "welcome", title: "Welcome", text: "A one-minute look around." },
    { id: "search", target: "[data-tour='search']", title: "Find anything", text: "Search projects, people and files." },
    { id: "create", target: "#new-project", title: "Start a project", text: "Press <strong>New project</strong> to try it.", advanceOn: "click" },
  ];
  tour.step = Number(localStorage.getItem("tour-step") ?? 0);
  tour.addEventListener("stepchange", (event) => localStorage.setItem("tour-step", event.detail.step));
</script>
```

What it covers:

- **A spotlight on the real element.** Each step dims the page and cuts a rounded window around its target. Steps without a target show the card in the middle, for a welcome or a closing note.
- **A card that stays on screen.** It goes below, above, beside or over its target, wherever there is room, honouring a preferred side per step. On a phone it takes the full width above or below the element. Targets outside the view are scrolled into view first, including inside scrolling panels, and the highlight follows the element as the page scrolls, resizes or changes. A target that appears later, such as an item in a menu that opens, is picked up as soon as it exists.
- **Interactive steps.** Most steps block clicks so people read first. Mark a step `interactive` and the element stays usable, or set `advanceOn: "click"` and the tour moves on when that event happens on the target. People learn by pressing the real button.
- **Keyboard, focus and screen readers.** The card is a dialog named by its title and described by its text. Focus moves to Next when a step opens, so Enter moves forward, the arrow keys go back and forth, Tab stays in the card and Escape ends the tour. Focus goes back to where it was when the tour closes. With reduced motion, there is no sliding, fading or smooth scrolling.
- **Resume.** The current step is an attribute. The tour fires `stepchange`, `complete` and `close`, so you can save the step anywhere. The optional `launcher` button reads "Take the tour" or "Resume tour" with the progress.
- **Translatable and themed.** Next, Back, Finish, Close and the step counter are attributes. Colours, spacing and type follow your REALM UI theme in light and dark mode.

## Intro.js and the alternatives side by side

| | Intro.js 8.6 | ui-kit-tour (REALM Pro) | Driver.js 1.10 | Shepherd.js 15.3 | React Joyride 3.2 |
| --- | --- | --- | --- | --- | --- |
| Licence | AGPL-3.0 or commercial | Commercial, part of REALM Pro | MIT | AGPL-3.0 or commercial | MIT |
| Commercial price | $9.99 to $299.99, paid once | $149 or $499 once, for the whole kit | Free | $50 or $300, paid once. Required if your company has revenue | Free |
| Frameworks | Any. Wrappers listed for React, AngularJS, Ember, Rails, WordPress | A custom element, in plain HTML or any framework that supports custom elements | Any, no official wrappers | Any, with React, Vue, Angular and Ember wrappers | React only |
| Size stated by the project | About 10 KB, no dependencies | About 6 KB gzipped component file as shipped, plus the REALM runtime (about 16 KB gzipped) | About 5 KB, no dependencies | Not stated (uses Floating UI) | Not stated |
| Hints or beacons | Yes | No | Yes | Not stated | Not stated |
| Progress | Bullets and a progress bar | Step counter and launcher progress | Progress text | Not stated | Not stated |
| Advance on a real event | Not built in | `advanceOn` per step | Hooks on Next and Back | Not stated | Not stated |
| Resume launcher | Not built in | Built in | Not built in | Not built in | Not built in |
| Accessibility claims | Keyboard navigation, no other statement | Dialog semantics, focus moved, trapped and restored, reduced motion | "Accessible", screen reader close label, reduced motion for beacons | Keyboard navigation, focus trapping, ARIA | Focus trapping, keyboard navigation, ARIA |
| Theming | CSS and custom themes | REALM UI theme tokens, light and dark | CSS and options | CSS | Props and styles |

"Not stated" means the project's own pages we checked do not say. The libraries: [Driver.js](https://driverjs.com/), [Shepherd.js](https://shepherdjs.dev/pricing) ([licence](https://github.com/shipshapecode/shepherd/blob/main/LICENSE.md)), [React Joyride](https://github.com/gilbarbara/react-joyride). [Reactour](https://github.com/elrumordelaluz/reactour) is another MIT option for React, last released in May 2025.

## Where Intro.js is the better choice

- **Hints.** Intro.js can place hint markers on features people can open in their own time. `ui-kit-tour` only runs step-by-step tours. Driver.js also has hint beacons.
- **Price for a tour alone.** If a tour is all you need, Intro.js Starter at $9.99 or Business at $49.99 costs less than REALM Pro, and Driver.js is free.
- **Steps from HTML attributes.** Intro.js can read steps from `data-intro`, `data-title` and `data-step` attributes in your markup. `ui-kit-tour` takes steps as a list in script.
- **Older browsers.** REALM needs Chrome or Edge 125, Firefox 126 or Safari 17.4 and newer. See [Browser support](/docs/browser-support/).
- **Maturity.** Intro.js has years of production use. REALM Pro is in early access.

## Moving from Intro.js

| Intro.js | ui-kit-tour |
| --- | --- |
| `introJs.tour().setOptions({ steps }).start()` | `tour.steps = [...]`, then `tour.start()` or the `open` attribute |
| `element` in a step | `target`, a CSS selector |
| `intro` | `text` |
| `title` | `title` |
| `position` or `tooltipPosition` | `placement` |
| `nextLabel`, `prevLabel`, `doneLabel` | `next-label`, `back-label`, `done-label` |
| `goToStep(n)` | `tour.goTo(n)`, or set `step` |
| `exit()` | `tour.end()` |
| `onChange`, `onComplete`, `onExit` | `stepchange`, `complete`, `close` events |
| `exitOnOverlayClick` | `close-on-backdrop` |
| `disableInteraction: false` | `interactive: true` on the step |

## Frequently asked questions

<ui-accordion type="multiple" class="faq">
  <ui-accordion-item>
    <ui-accordion-trigger>Is Intro.js free for commercial use?</ui-accordion-trigger>
    <ui-accordion-content>No. Intro.js is AGPL-3.0 for open source use. Commercial projects need one of the paid licences, from $9.99 for one project to $299.99 for unlimited projects, paid once.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Is Shepherd.js still free?</ui-accordion-trigger>
    <ui-accordion-content>Not for most companies. Shepherd.js is now dual-licensed under AGPL-3.0 and a commercial licence, and its licence says a company that generates revenue needs the commercial licence, even if the project using Shepherd does not.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>What is the best free alternative to Intro.js?</ui-accordion-trigger>
    <ui-accordion-content>Driver.js: MIT, no dependencies, with highlights, progress, hint beacons and hooks for async steps. In React apps, React Joyride is also MIT.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Can a tour step wait for people to click the real button?</ui-accordion-trigger>
    <ui-accordion-content>In <code>ui-kit-tour</code>, yes: set <code>advanceOn: "click"</code> on the step and the tour moves on when the target is clicked. Any event name works.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>How do I resume a tour on the next visit?</ui-accordion-trigger>
    <ui-accordion-content>Save <code>event.detail.step</code> from the <code>stepchange</code> event, then set the <code>step</code> attribute on the next visit. With <code>launcher</code>, the button shows "Resume tour" and the progress.</ui-accordion-content>
  </ui-accordion-item>
</ui-accordion>

## Next

- [Product tour](/pro/components/ui-kit-tour/): screenshots and the full feature list for `ui-kit-tour`.
- [REALM Pro](/pro/): the tour plus the data grid, scheduler, charts and more, paid once.
- [Accessibility](/docs/accessibility/): how REALM components handle focus and announcements.
