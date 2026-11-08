---
title: Searchable select
seoTitle: JavaScript searchable select web component · REALM Pro
description: A searchable select with multiple choice, removable chips, option groups, options loaded from a URL, create-new and a virtual list that handles 10,000 options.
group: Forms
nav: Searchable select
---

# Searchable select

A searchable select with multiple choice, removable chips, option groups, options loaded from a URL, create-new and a virtual list that handles 10,000 options.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-select/light-desktop.png" alt="Select, desktop, light mode" width="960" height="642" loading="lazy">
    <figcaption>Desktop, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-select/dark-desktop.png" alt="Select, desktop, dark mode" width="960" height="642" loading="lazy">
    <figcaption>Desktop, dark mode</figcaption>
  </figure>
</div>

## What it does

The select replaces the browser's `<select>` when a plain dropdown stops being enough. People type to narrow the list, pick one value or several, and see their choices as small chips inside the field. Each chip has its own remove button, Backspace removes the last one, and a clear button empties the field in one go. Matching ignores case and accents, so typing "jalap" finds "Jalapeño", and the matching part of each option is underlined so people can see why it matched.

Options come from wherever your data lives. Write `<option>` and `<optgroup>` children as you would for a native select, set the `options` property to an array, or point `src` at a URL. With a URL, the select asks the server as people type, sending the search text as `q`, shows a spinner while it waits, says so when nothing matches, and shows an error message when the request fails. The server can answer with a plain array or with an object holding `items`, `options` or `results`.

## Built for long lists

Only the rows in view are in the page. A list of 10,000 products opens instantly and filters in a few milliseconds per keystroke, because the select reuses about twenty rows as you scroll instead of creating ten thousand. Group headings stay in place as you scroll, so long catalogues stay readable.

## Multiple choice, limits and new values

With `multiple`, the select keeps the list open while people tick several options. `max` caps how many they may choose and greys out the rest once the limit is reached, and `max-tags` shows the first few chips followed by "+3" so a long selection does not push the form down. With `creatable`, typing something that is not in the list offers to create it. The select sends a cancelable `create` event first, so you can save the new value or refuse it.

## Keyboard and screen readers

The field follows the editable combobox pattern from the WAI-ARIA Authoring Practices. Arrow keys move through the options, skipping group headings and disabled entries, Page Up and Page Down jump ten at a time, Enter picks, Escape closes, and Alt with the arrow keys opens and closes the list. Left Arrow at the start of the field moves into the chips, where the arrow keys move between them and Delete removes one. Screen readers hear the number of results, each option's group, its position in the full list even when only part of it is rendered, and when the selection limit is reached.

## In a form

The select is a real form field. A single select submits one value; a multiple select submits one entry per value, just like a native `<select multiple>`, so servers read it the same way. `required` blocks an empty submit, a form reset restores the starting value, and every change sends a `change` event with the new values.

```html
<form>
  <label for="reviewers">Reviewers</label>
  <ui-kit-select id="reviewers" name="reviewers" multiple max="4" value="amara,jonas" required>
    <optgroup label="Design">
      <option value="amara">Amara Okafor</option>
      <option value="mei">Mei Tanaka</option>
    </optgroup>
    <optgroup label="Engineering">
      <option value="jonas">Jonas Becker</option>
      <option value="priya">Priya Raman</option>
    </optgroup>
  </ui-kit-select>
  <button>Save</button>
</form>
```

Colours, spacing and radii come from the REALM UI theme tokens, so the select follows your theme and dark mode, and the list opens upward when there is no room below.

<div class="pro-shots phone">
  <figure>
    <img src="/pro/components/ui-kit-select/light-phone.png" alt="Select, phone, light mode" width="390" height="670" loading="lazy">
    <figcaption>Phone, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-select/dark-phone.png" alt="Select, phone, dark mode" width="390" height="670" loading="lazy">
    <figcaption>Phone, dark mode</figcaption>
  </figure>
</div>


## Built from REALM UI

Select is made from free REALM UI components, so it follows your theme and dark mode like the rest of your page:

- [`ui-spinner`](/components/spinner/)

## Use it

Select is part of [REALM Pro](/pro/). Add it from REALM Pro Studio, or copy the file into your project and load it:

```html
<import-element from="/pro/components/ui-kit-select.html"></import-element>
<ui-kit-select></ui-kit-select>
```
