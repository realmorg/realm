---
title: Select2 alternatives
description: Looking for a Select2 alternative without jQuery? REALM Pro's select, Tom Select, Choices.js and Slim Select compared on size, a11y and long lists.
seoTitle: Select2 alternative without jQuery
---

# Select2 alternatives

If your app already runs jQuery and Select2 works, the 4.1.0 release from May 2026 is a reason to stay: it is the first stable release in six years and improves accessibility. If you are removing jQuery, need lists of thousands of options to stay fast, or want a select that behaves like a real form field, there are better choices. **Tom Select** is the closest free replacement, a jQuery-free fork of selectize.js. **`ui-kit-select`** from [REALM Pro](/pro/) adds a virtual list for 10,000 options, the WAI-ARIA combobox pattern and native form submission, as part of a one-time kit. **Choices.js** and **Slim Select** are small, free and MIT.

Facts were checked in October 2026 against the [Select2 site](https://select2.org/), its [GitHub releases](https://github.com/select2/select2/releases) and the npm pages of each library linked below.

## Why people look for an alternative

- **It is a jQuery plugin.** Select2 is called as `$("select").select2()`. The 4.1.0 release supports jQuery 1.x through 4.x and moves some internals to native DOM, but you still need jQuery on the page. For a team removing jQuery, Select2 is often one of the last things holding it there.
- **Releases were quiet for years.** 4.0.13 shipped in January 2020 and 4.1.0-rc.0 in January 2021. Stable 4.1.0 only arrived on 26 May 2026. Many projects moved on in between, and some still run the release candidate.
- **4.1.0 has breaking changes.** It drops old Internet Explorer versions, removes `initSelection` and `query`, renames `containerCssClass` to `selectionCssClass` and changes the selection markup. Upgrading means testing, so teams compare options while they are at it.
- **Long lists.** Select2 can page remote results, but it has no virtual scrolling. A local list with thousands of options renders them all into the page.

## What ui-kit-select does instead

`ui-kit-select` is a searchable select in REALM Pro. It reads `<option>` and `<optgroup>` children like a native `<select>`, so existing markup moves across with a tag change.

```html
<form>
  <label for="reviewers">Reviewers</label>
  <ui-kit-select id="reviewers" name="reviewers" multiple max="4" required>
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

What it covers:

- **Search that forgives.** Typing narrows the list, ignoring case and accents, so "jalap" finds "Jalapeño". The matching part of each option is underlined.
- **Three ways to get options.** Children `<option>` elements, the `options` property as an array, or `src` pointing at a URL. With a URL, it sends the search text as `q` while people type, shows a spinner, an empty message and an error message when the request fails. The server can answer with a plain array or an object holding `items`, `options` or `results`.
- **A virtual list.** Only the rows in view are in the page. A 10,000-item list opens at once and filters in a few milliseconds per keystroke, because about twenty rows are reused as you scroll. Group headings stay pinned while scrolling.
- **Multiple choice.** With `multiple`, choices show as chips with their own remove buttons. Backspace removes the last chip and a clear button empties the field. `max` caps the number of choices and `max-tags` shows the first few chips followed by "+3".
- **Creating values.** With `creatable`, typing something that is not in the list offers to create it, and a cancelable `create` event lets your code save or refuse the new value.
- **Keyboard and screen readers.** It follows the editable combobox pattern from the WAI-ARIA Authoring Practices. Arrow keys skip group headings and disabled options, Page Up and Page Down jump ten, Alt with the arrows opens and closes. Left Arrow at the start of the field moves into the chips. Screen readers hear the result count, each option's group and its position in the full list, even though only part of it is rendered.
- **A real form field.** A multiple select submits one entry per value, like `<select multiple>`, so your server reads it the same way. `required` blocks an empty submit, form reset restores the starting value, and changes fire a `change` event.

## Select2 and the alternatives side by side

| | Select2 4.1.0 | ui-kit-select (REALM Pro) | Tom Select 2.6 | Choices.js 11.2 | Slim Select 4.6 |
| --- | --- | --- | --- | --- | --- |
| Licence | MIT | Commercial, part of REALM Pro | Apache 2.0 | MIT | MIT |
| Price | Free | $149 or $499 once, for the whole kit | Free | Free | Free |
| jQuery | Required | No | No | No | No |
| Size stated by the project | Not stated | About 8 KB gzipped component file as shipped, plus the REALM runtime (about 16 KB gzipped) | About 16 KB gzipped | About 20 KB gzipped | About 16 KB gzipped JS, 2 KB CSS |
| Remote data | Yes, with paging | Yes, `src` with `q` | Yes | Yes, via a Promise | Yes |
| Create new values | `tags` | `creatable`, with a cancelable event | Yes, including async | Yes, in text mode | Yes |
| Option groups | Yes, nested | Yes, with pinned headings | Yes, plus an optgroup columns plugin | Yes | Yes |
| Custom option templates | Yes | No | Yes, render functions | Yes | HTML options |
| Virtual scrolling | No | Built in | Official plugin | Not mentioned in its docs | Not mentioned in its docs |
| Accessibility | Selection area improved in 4.1.0, selections announced | WAI-ARIA editable combobox pattern, position and group announced | Described as accessible, no detail given | `aria-labelledby` via an option | Claims WCAG 2.1 AA |
| Native form submission | Through the original `<select>` | Form-associated element | Through the original `<select>` | Through the original `<select>` | Through the original `<select>` |
| Theming | CSS and themes | REALM UI theme tokens, light and dark | CSS | CSS | CSS |

Free, open source options are linked here: [Tom Select](https://tom-select.js.org/), [Choices.js](https://github.com/Choices-js/Choices), [Slim Select](https://slimselectjs.com/). If you only need a styled native select or a simple searchable list, REALM UI's free [Select](/components/select/) and [Combobox](/components/combobox/) may be enough.

## Where Select2 is the better choice

- **jQuery apps that work today.** If jQuery stays in your stack, Select2 4.1.0 is maintained again and keeps your existing code. A rewrite has a cost that a working dropdown may not justify.
- **Custom option templates.** Select2's `templateResult` and `templateSelection` let you draw avatars, flags or two-line options. `ui-kit-select` shows text labels only.
- **Bundled translations.** Select2 ships more than 40 language files. In `ui-kit-select` you translate a handful of text attributes yourself.
- **Paging remote results.** Select2 can load remote results page by page as people scroll. `ui-kit-select` sends one search request per query.
- **Older browsers.** REALM needs Chrome or Edge 125, Firefox 126 or Safari 17.4 and newer. See [Browser support](/docs/browser-support/).
- **Price.** Select2, Tom Select, Choices.js and Slim Select are free. `ui-kit-select` makes sense when you also want the rest of REALM Pro.

## Moving from Select2

| Select2 | ui-kit-select |
| --- | --- |
| `<select>` plus `$("select").select2()` | `<ui-kit-select>` with the same `<option>` children |
| `multiple` | `multiple` |
| `placeholder` | `placeholder` |
| `allowClear: true` | Built in: a clear button appears once something is chosen |
| `tags: true` | `creatable` |
| `maximumSelectionLength` | `max` |
| `ajax: { url }` with `params.term` | `src` set to your endpoint, which receives `q` |
| `data: [...]` | The `options` property |
| `templateResult` | No equivalent |
| `select2:select`, `change.select2` | `change` |
| `language` | `empty-text`, `loading-text`, `error-text`, `create-text` |

## Frequently asked questions

<ui-accordion type="multiple" class="faq">
  <ui-accordion-item>
    <ui-accordion-trigger>Is Select2 still maintained?</ui-accordion-trigger>
    <ui-accordion-content>Yes. After years on 4.0.13 and a 4.1.0 release candidate, stable 4.1.0 was released on 26 May 2026, with jQuery 4 support and accessibility improvements. The repository is active.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Does Select2 work without jQuery?</ui-accordion-trigger>
    <ui-accordion-content>No. It is a jQuery plugin. For a jQuery-free replacement, Tom Select is the closest in features, and Choices.js and Slim Select are smaller.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Which select handles 10,000 options?</ui-accordion-trigger>
    <ui-accordion-content>You need virtual scrolling. Tom Select has an official virtual scroll plugin, and <code>ui-kit-select</code> has a virtual list built in that keeps about twenty rows in the page.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Does ui-kit-select submit like a native select?</ui-accordion-trigger>
    <ui-accordion-content>Yes. A single select submits one value and a multiple select submits one entry per value, the same as <code>&lt;select multiple&gt;</code>. <code>required</code> and form reset work too.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Can I use ui-kit-select in React or Vue?</ui-accordion-trigger>
    <ui-accordion-content>Yes. It is a standard custom element, so it works in plain HTML and in frameworks that support custom elements. It loads with REALM, one script tag, with no build step.</ui-accordion-content>
  </ui-accordion-item>
</ui-accordion>

## Next

- [Select](/pro/components/ui-kit-select/): screenshots and the full feature list for `ui-kit-select`.
- [REALM Pro](/pro/): the select plus the data grid, scheduler, charts and more, paid once.
- [Forms](/docs/forms/): how REALM components submit with a form.
