---
title: Form builder
seoTitle: JavaScript form builder web component · REALM Pro
description: Drag fields onto a canvas, edit labels, validation, options and show-if rules, split the form into pages, preview it working and export JSON.
group: Forms
nav: Form builder
---

# Form builder

Drag fields onto a canvas, edit labels, validation, options and show-if rules, split the form into pages, preview it working and export JSON.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-form-builder/light-desktop.png" alt="Form builder, desktop, light mode" width="960" height="1816" loading="lazy">
    <figcaption>Desktop, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-form-builder/dark-desktop.png" alt="Form builder, desktop, dark mode" width="960" height="1816" loading="lazy">
    <figcaption>Desktop, dark mode</figcaption>
  </figure>
</div>

## What it does

The form builder lets people put together a form without writing markup: a registration form, a customer survey, an intake questionnaire or a job application. A palette on the left lists twelve kinds of field: short and long text, email, number, dropdown, single choice, checkboxes, date, file upload, rating, a section heading and a page break. Fields are dragged onto the canvas in the middle, or added with a click or the Enter key below the field that is selected. The canvas draws each field the way it will look, with its label, help text, placeholder, choices or stars, so the form can be read at a glance.

The settings panel on the right edits the selected field: its label, the key its answer is submitted under, help text, placeholder, whether it is required, and a default answer. Choice fields get a list of choices, each with a label and a stored value, that can be added, removed and put in order. Validation depends on the kind of field: a shortest and longest length or a pattern for text, a lowest and highest value for numbers, a first and last date, or how many boxes may be ticked. A custom error message replaces the built-in ones.

## Conditions and pages

Any field can be shown only for some answers. A condition picks an earlier question, a comparison such as "is", "is not", "contains", "is more than" or "is answered", and an answer; several conditions can all have to match, or only one. Renaming a question's key updates every condition that refers to it. A page break splits the form, and its title becomes the heading of the next page.

## A preview that works

The Preview tab turns the schema into a real form built from REALM UI fields: inputs, selects, radio groups, checkboxes, a file input and a star rating. Conditions are live, pages have Back and Next buttons with a progress bar, and each page is checked before moving on, with the error under the field and focus moved to the first problem. Submitting shows the answers the form would send and fires a `formsubmit` event with them.

## JSON, history and keyboard

The JSON tab shows the whole form as a plain schema that can be copied, downloaded, edited and applied back; mistakes in the JSON are reported instead of breaking the builder. The same schema is the element's `schema` property and, with a `name`, its value in a surrounding form, so saving a form design is an ordinary form submission. Every change fires `schemachange`. Undo and redo cover every edit, with typing in one box grouped into a single step, and work with the toolbar buttons or Ctrl+Z and Ctrl+Shift+Z.

The canvas is a listbox: the arrow keys move between fields, Alt with an arrow moves the field, Delete removes it, Ctrl+D duplicates it and Enter jumps to its settings. Moves and removals are announced to screen readers.

```html
<form method="post" action="/forms">
  <ui-kit-form-builder name="schema" types='["text","email","select","checkbox","page"]'></ui-kit-form-builder>
  <button>Save form</button>
</form>
```

The layout uses three columns on a wide screen and stacks on a phone, with the palette as a two-column grid of buttons. Colours, spacing and radii come from the theme tokens, so the builder follows your theme and dark mode.

<div class="pro-shots phone">
  <figure>
    <img src="/pro/components/ui-kit-form-builder/light-phone.png" alt="Form builder, phone, light mode" width="390" height="3211" loading="lazy">
    <figcaption>Phone, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-form-builder/dark-phone.png" alt="Form builder, phone, dark mode" width="390" height="3211" loading="lazy">
    <figcaption>Phone, dark mode</figcaption>
  </figure>
</div>


## Built from REALM UI

Form builder is made from free REALM UI components, so it follows your theme and dark mode like the rest of your page:

- `u-icon`
- [`ui-badge`](/components/badge/)
- [`ui-button`](/components/button/)
- [`ui-checkbox`](/components/checkbox/)
- [`ui-field`](/components/field/)
- [`ui-input`](/components/input/)
- [`ui-label`](/components/label/)
- [`ui-progress`](/components/progress/)
- [`ui-radio-group`](/components/radio-group/)
- [`ui-select`](/components/select/)
- [`ui-switch`](/components/switch/)
- [`ui-tabs`](/components/tabs/)
- [`ui-textarea`](/components/textarea/)

## Use it

Form builder is part of [REALM Pro](/pro/). Add it from REALM Pro Studio, or copy the file into your project and load it:

```html
<import-element from="/pro/components/ui-kit-form-builder.html"></import-element>
<ui-kit-form-builder></ui-kit-form-builder>
```
