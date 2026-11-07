---
title: Product tour
seoTitle: JavaScript product tour web component · REALM Pro
description: Guided product tours with a spotlight on each element, a popover that stays on screen, progress, keyboard support and resume where people left off.
group: Application
nav: Product tour
---

# Product tour

Guided product tours with a spotlight on each element, a popover that stays on screen, progress, keyboard support and resume where people left off.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-tour/light-desktop.png" alt="Product tour, desktop, light mode" width="960" height="574" loading="lazy">
    <figcaption>Desktop, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-tour/dark-desktop.png" alt="Product tour, desktop, dark mode" width="960" height="574" loading="lazy">
    <figcaption>Desktop, dark mode</figcaption>
  </figure>
</div>

## What it does

The product tour walks new users through your interface one step at a time. Each step points at a real element on the page, found by a CSS selector, dims everything else and cuts a rounded window out of the dimmed layer so the element stands out. A small card next to it carries a title, a short explanation, the step number and Back and Next buttons. Steps without a target show the card in the middle of the screen, which suits a welcome message or a closing note.

## Placement that stays on screen

The card goes below, above, beside or on top of its target, whichever side has room, and you can ask for a preferred side per step. It never runs off the edge of the window: on a phone it takes the full width and sits above or below the highlighted element, and next to an element in a corner it moves to the side that fits. When the target is outside the visible area, the tour scrolls it into view first, including inside scrolling panels such as a long activity list or a sidebar, and the highlight follows the element as the page or the panel scrolls, resizes or changes. If a target only appears later, for example after a menu opens, the step picks it up as soon as it is in the page.

## Interactive steps

Most steps block clicks on the page so people read before they act. Mark a step as interactive and the highlighted element stays usable, or give it an event name such as `click` and the tour moves on by itself when that event happens on the target. That is how you teach someone to press the real New project button instead of a picture of it.

## Keyboard, focus and screen readers

The card is a dialog with its title and text as its name and description. When a step opens, focus moves to the Next button, so Enter moves forward, the arrow keys go back and forth, Tab stays inside the card and Escape ends the tour. When the tour closes, focus returns to wherever it was before. People who ask their system for less motion get no sliding, fading or smooth scrolling.

## Resume where people left off

The current step is an attribute. The tour sends a `stepchange` event every time it moves, a `complete` event at the end and a `close` event however it ends, so your page can save the step in local storage or on your server and set it again on the next visit. An optional launcher button shows "Take the tour" or "Resume tour" with the progress, and can itself be the target of the last step.

```html
<ui-kit-tour launcher step="2"></ui-kit-tour>
```

Set the steps as a list of objects with a target, a title, text that may contain simple formatting, a preferred placement and optional interactive or advance-on settings. Every label can be translated, and the colours, spacing and type follow your REALM UI theme in light and dark mode.

<div class="pro-shots phone">
  <figure>
    <img src="/pro/components/ui-kit-tour/light-phone.png" alt="Product tour, phone, light mode" width="390" height="768" loading="lazy">
    <figcaption>Phone, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-tour/dark-phone.png" alt="Product tour, phone, dark mode" width="390" height="768" loading="lazy">
    <figcaption>Phone, dark mode</figcaption>
  </figure>
</div>


## Built from REALM UI

Product tour is made from free REALM UI components, so it follows your theme and dark mode like the rest of your page:

- [`ui-button`](/components/button/)

## Use it

Product tour is part of [REALM Pro](/pro/). Add it from REALM Pro Studio, or copy the file into your project and load it:

```html
<import-element from="/pro/components/ui-kit-tour.html"></import-element>
<ui-kit-tour></ui-kit-tour>
```
