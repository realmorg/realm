---
title: Kanban board
seoTitle: JavaScript kanban board web component · REALM Pro
description: A task board with drag and drop by pointer, touch and keyboard, swimlanes, WIP limits, collapsible columns, a card editor and virtualised long columns.
group: Data
nav: Kanban board
---

# Kanban board

A task board with drag and drop by pointer, touch and keyboard, swimlanes, WIP limits, collapsible columns, a card editor and virtualised long columns.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-kanban/light-desktop.png" alt="Kanban board, desktop, light mode" width="960" height="1964" loading="lazy">
    <figcaption>Desktop, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-kanban/dark-desktop.png" alt="Kanban board, desktop, dark mode" width="960" height="1964" loading="lazy">
    <figcaption>Desktop, dark mode</figcaption>
  </figure>
</div>

## What it does

The Kanban board lays out work as cards in columns, such as To do, In progress, Review and Done, and lets people move a card by picking it up and putting it somewhere else. Each card shows its labels, its title on up to two lines, a reference such as WEB-131, the priority, the due date, story points and the initials of the person who owns it. Due dates that have passed turn red until the card reaches the last column. A filter box above the board narrows every column at once by title, reference, label or assignee, and the count next to it says how many cards match.

## Moving cards

Drag a card with the mouse and a copy follows the pointer while the other cards make room where it will land. The column under the pointer is outlined, and the board scrolls sideways or down by itself when the pointer comes close to an edge, so a card can travel across a wide board in one movement. On a phone, press and hold a card for a moment to pick it up; a quick swipe still scrolls the column as usual.

Every move goes through a `cardmove` event before it happens. The event says which card is moving, where it came from and where it is going, by column, lane and position. Call `preventDefault()` and the card goes back, which is how a page enforces its own rules, for example that nothing reaches Done without an owner. Edits send `cardchange` with the fields that changed and the previous values, and can be refused the same way. New and deleted cards send `cardadd` and `carddelete`.

## Keyboard and screen readers

The board has one card in the tab order. The arrow keys move between cards and columns, and Home and End jump to the top and bottom of a column. Space picks the focused card up; the arrow keys then move it within the column or to the neighbouring column, Page Up and Page Down move it to another swimlane, Space drops it and Escape puts it back. A live region tells screen reader users what they picked up, where it is now ("Done, position 2 of 5") and where it was dropped. Enter opens the card for editing.

## Swimlanes, limits and long columns

Lanes split the board into horizontal bands, one per team, client or priority, and each lane can fold away. Columns can fold into a narrow strip that still shows its name and count and still accepts cards. Give a column a work-in-progress limit and its header shows the count against the limit, marks the column when it is full and warns by how much it is over. With `strict-limits` the board refuses cards for a full column instead of only warning.

Columns stay fast with thousands of cards. Only the cards in view are on the page, and they are swapped as the column scrolls, so a backlog of 10,000 tickets scrolls as smoothly as one with ten.

## Editing and data

Clicking a card opens a side sheet with its title, description, column, lane, priority, points, owner, due date and labels. If your app has its own editor, cancel the `cardopen` event and show yours. Pass the columns, lanes and cards as properties, or set `src` to an address that returns them as JSON. Colours, spacing and type follow your REALM UI theme, in light and dark mode.

```html
<ui-kit-kanban label="Sprint 42" src="/api/board" strict-limits></ui-kit-kanban>
```

<div class="pro-shots phone">
  <figure>
    <img src="/pro/components/ui-kit-kanban/light-phone.png" alt="Kanban board, phone, light mode" width="390" height="2090" loading="lazy">
    <figcaption>Phone, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-kanban/dark-phone.png" alt="Kanban board, phone, dark mode" width="390" height="2090" loading="lazy">
    <figcaption>Phone, dark mode</figcaption>
  </figure>
</div>


## Built from REALM UI

Kanban board is made from free REALM UI components, so it follows your theme and dark mode like the rest of your page:

- [`ui-avatar`](/components/avatar/)
- [`ui-button`](/components/button/)
- [`ui-field`](/components/field/)
- [`ui-input`](/components/input/)
- [`ui-label`](/components/label/)
- [`ui-select`](/components/select/)
- [`ui-sheet`](/components/sheet/)
- [`ui-skeleton`](/components/skeleton/)
- [`ui-textarea`](/components/textarea/)

## Use it

Kanban board is part of [REALM Pro](/pro/). Add it from REALM Pro Studio, or copy the file into your project and load it:

```html
<import-element from="/pro/components/ui-kit-kanban.html"></import-element>
<ui-kit-kanban></ui-kit-kanban>
```
