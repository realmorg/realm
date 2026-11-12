---
title: Layered hero slider
seoTitle: JavaScript layered hero slider web component · REALM Pro
description: A hero slider whose headings, text and buttons animate in as separate layers, with Ken Burns, parallax, five transitions, autoplay and swipe.
group: Media
nav: Layered hero slider
---

# Layered hero slider

A hero slider whose headings, text and buttons animate in as separate layers, with Ken Burns, parallax, five transitions, autoplay and swipe.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-slider/light-desktop.png" alt="Layered hero slider, desktop, light mode" width="960" height="901" loading="lazy">
    <figcaption>Desktop, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-slider/dark-desktop.png" alt="Layered hero slider, desktop, dark mode" width="960" height="901" loading="lazy">
    <figcaption>Desktop, dark mode</figcaption>
  </figure>
</div>

## What it does

The layered slider is a hero banner that rotates through a few full-width slides, each one built from ordinary HTML. What sets it apart from a plain carousel is that the parts of a slide arrive one after another: the kicker drops in, the headline is revealed from below, the paragraph fades up and the buttons pop in last, each with its own preset, delay and duration. Nothing is drawn on a canvas, so headings stay headings, buttons stay buttons, and the text can be read, searched and translated.

```html
<ui-kit-slider autoplay ken-burns parallax effect="zoom">
  <section data-background="spring.jpg" data-overlay>
    <h2 data-layer="reveal-up">Trails that start at your door</h2>
    <p data-layer="fade-up" data-delay="300">Lightweight shells and grippy soles.</p>
    <a href="/shop" data-layer="zoom-in" data-delay="500">Shop the collection</a>
  </section>
</ui-kit-slider>
```

## Layers and transitions

Any element inside a slide becomes a layer when it has a data-layer attribute. There are presets for fading in from each side, zooming in or out, blurring into focus, rotating in and revealing with a mask, and a separate leave preset can be given for the way out. Layers start a moment after their slide begins to arrive and leave quickly before it goes, so two slides never fight for attention.

Between slides there are five transitions: a cross-fade, a horizontal slide, a cover where the new slide moves over the old one as it darkens and drifts away, a zoom, and a wipe. Each one is described as a position between the two slides, which is why a drag on a phone follows the finger with the same effect and finishes from wherever the finger let go.

## Movement in the background

Ken Burns slowly pans and zooms the background of the slide on screen, in a different direction for each slide unless you choose one. With parallax on, layers marked with a depth follow the mouse at different speeds, the background drifts the other way, and the background also moves a little slower than the page while it scrolls past.

## Autoplay that respects the reader

Autoplay shows its progress as a bar along the bottom edge. It stops while the pointer is over the slider or while keyboard focus is inside it, while the tab is hidden and while the slider is scrolled out of view, and a stop button sits first in the tab order. While it runs, slide changes are not announced; once it stops, every change is announced politely with the slide's title.

## Accessibility and reduced motion

Slides are labelled as slides with their position, and only the current one can be reached with the keyboard. Navigation comes as bullets, as thumbnails with each slide's title, or not at all, with optional arrows. The arrow keys, Home and End change slides when the controls have focus. Readers who prefer reduced motion get instant slide changes, layers that are simply there, no Ken Burns, no parallax and no autoplay until they press play. A slidechange event reports each change, and the slide attribute opens a given slide or tells you which one is showing.

<div class="pro-shots phone">
  <figure>
    <img src="/pro/components/ui-kit-slider/light-phone.png" alt="Layered hero slider, phone, light mode" width="390" height="870" loading="lazy">
    <figcaption>Phone, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-slider/dark-phone.png" alt="Layered hero slider, phone, dark mode" width="390" height="870" loading="lazy">
    <figcaption>Phone, dark mode</figcaption>
  </figure>
</div>


## Built from REALM UI

Layered hero slider is made from free REALM UI components, so it follows your theme and dark mode like the rest of your page:

- [`ui-button`](/components/button/)

## Use it

Layered hero slider is part of [REALM Pro](/pro/). Add it from REALM Pro Studio, or copy the file into your project and load it:

```html
<import-element from="/pro/components/ui-kit-slider.html"></import-element>
<ui-kit-slider></ui-kit-slider>
```
