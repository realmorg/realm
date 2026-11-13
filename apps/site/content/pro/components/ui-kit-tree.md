---
title: Tree view
seoTitle: JavaScript tree view web component · REALM Pro
description: A tree for files or categories with lazy loading, tri-state checkboxes, search highlighting, drag to reorder, inline rename and 10,000 nodes.
group: Data
nav: Tree view
---

# Tree view

A tree for files or categories with lazy loading, tri-state checkboxes, search highlighting, drag to reorder, inline rename and 10,000 nodes.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-tree/light-desktop.png" alt="Tree view, desktop, light mode" width="960" height="1096" loading="lazy">
    <figcaption>Desktop, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-tree/dark-desktop.png" alt="Tree view, desktop, dark mode" width="960" height="1096" loading="lazy">
    <figcaption>Desktop, dark mode</figcaption>
  </figure>
</div>

## What it does

The tree view shows nested data as rows that open and close: files and folders, product categories, an organisation chart, a table of contents. Folders have a chevron and an open or closed folder icon, files get an icon that matches their extension, and each level is indented so the shape of the data is easy to follow. Click a row to select it, or click the chevron to open it without changing the selection.

## Large trees and lazy folders

The tree draws only the rows that fit in its box, plus a few above and below, and swaps them while you scroll. A tree with 10,000 open nodes renders in a few dozen milliseconds and scrolls without stutter, because the page never holds more than about forty rows. Folders do not need their contents up front. Mark a folder as lazy and the tree asks for its children the first time it opens, either from a function you give it or from a `src` address it calls with the folder's id. A loading row with a spinner shows while the request is running, and a failed request closes the folder again and says what went wrong.

## Checkboxes

With the `checkboxes` attribute every row gets a box. Ticking a folder ticks everything inside it, and a folder whose contents are only partly ticked shows a dash, both on screen and to screen readers as a mixed state. Put the tree in a form with a `name` and it submits the ids of every ticked node, like a group of checkboxes would. A form reset brings back the boxes that were ticked when the page loaded.

## Search

The search box above the tree keeps only the branches that contain a match. Parents of a match stay visible and open so you can see where it lives, the matching part of each name is highlighted, and a count tells you how many nodes matched. Clearing the box puts the tree back the way you had it.

## Rearranging and renaming

With `reorder`, rows can be dragged. Drop on the top or bottom edge of a row to place the node before or after it, or on the middle of a folder to move it inside. The tree will not let you drop a folder into one of its own subfolders. Keyboard users get the same power: Alt with the up and down arrows moves a node among its siblings, Alt with right moves it into the folder above, and Alt with left moves it out of its folder. Every move sends a `nodemove` event that your code can cancel. With `editable`, F2 or a double click turns the name into a text field; Enter saves and sends `noderename`, and Escape keeps the old name.

## Keyboard and screen readers

The tree follows the ARIA tree pattern. One row is in the tab order. Up and down move between rows, right opens a folder or steps into it, left closes it or steps out to the parent, Home and End go to the first and last row, the asterisk opens every folder at the same level, and typing letters jumps to the next row whose name starts with them. Each row reports its level and its position among its siblings, so screen reader users hear "3 of 5" even though most rows are not on the page.

```html
<ui-kit-tree label="Categories" name="category" checkboxes></ui-kit-tree>
```

<div class="pro-shots phone">
  <figure>
    <img src="/pro/components/ui-kit-tree/light-phone.png" alt="Tree view, phone, light mode" width="390" height="1661" loading="lazy">
    <figcaption>Phone, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-tree/dark-phone.png" alt="Tree view, phone, dark mode" width="390" height="1661" loading="lazy">
    <figcaption>Phone, dark mode</figcaption>
  </figure>
</div>


## Built from REALM UI

Tree view is made from free REALM UI components, so it follows your theme and dark mode like the rest of your page:

- [`ui-button`](/components/button/)
- [`ui-input`](/components/input/)
- [`ui-spinner`](/components/spinner/)

## Use it

Tree view is part of [REALM Pro](/pro/). Add it from REALM Pro Studio, or copy the file into your project and load it:

```html
<import-element from="/pro/components/ui-kit-tree.html"></import-element>
<ui-kit-tree></ui-kit-tree>
```
