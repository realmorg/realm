---
title: Rich text editor
seoTitle: JavaScript rich text editor web component · REALM Pro
description: A form-ready rich text editor: toolbar and bubble menu, tables, images, mentions, slash commands, Markdown, clean paste from Word and Google Docs.
group: Forms
nav: Rich text editor
---

# Rich text editor

A form-ready rich text editor: toolbar and bubble menu, tables, images, mentions, slash commands, Markdown, clean paste from Word and Google Docs.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-editor/light-desktop.png" alt="Rich text editor, desktop, light mode" width="960" height="1925" loading="lazy">
    <figcaption>Desktop, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-editor/dark-desktop.png" alt="Rich text editor, desktop, dark mode" width="960" height="1925" loading="lazy">
    <figcaption>Desktop, dark mode</figcaption>
  </figure>
</div>

## What it does

The rich text editor gives a form a writing area that produces clean HTML. People format text the way they expect from a word processor: a toolbar along the top, a small menu that appears over selected text, and the usual shortcuts such as Ctrl+B for bold and Ctrl+K for a link (Cmd on a Mac). It handles bold, italic, underline, strikethrough and inline code, four heading levels, quotes, code blocks, dividers, bulleted, numbered and task lists with nesting, alignment, and text colour and highlight drawn from your theme's colours.

Images go in by address, from the device, by pasting a screenshot or by dragging a file onto the page. The editor sends an `upload` event with the file, and your page replies with the address it stored the image at; until then the image shows faded so nobody mistakes it for a finished upload. Without a listener, the image is embedded in the document. Tables start with a header row, and a small bar above the table adds and removes rows and columns. Tab moves to the next cell and adds a row at the end.

## Writing without the mouse

Type `/` at the start of a line to get a short list of blocks to insert: headings, lists, a quote, a code block, a table, an image or a divider. Keep typing to filter it and press Enter to choose. Type `@` to mention a person from the `mentions` list, or answer the `mentionsearch` event to look people up on your server as the name is typed. Markdown habits work too: `# ` starts a heading, `- ` and `1. ` start lists, `[ ] ` starts a task, `> ` a quote, three backticks a code block and `---` a divider, while `**bold**`, `*italic*`, `` `code` `` and `~~struck~~` turn into formatting as you close them. Undo and redo cover typing and every command, with the caret going back to where it was.

## Pasting from Word and Google Docs

Paste is where most editors leave a mess. This one keeps headings, paragraphs, bold, italic, underline, links, lists and tables, and drops fonts, sizes, colours, classes and the hidden markup that Word and Google Docs add. Word's fake list paragraphs become real nested lists, numbered or bulleted as they were, and Google Docs' bold and italic spans become proper `strong` and `em` tags. Plain text is split into paragraphs at blank lines.

## Safe output

Everything that enters the editor, whether typed, pasted, dropped or set from code, passes the same allow-list. Scripts, styles, frames, event handler attributes and `javascript:` addresses are removed, and only theme colour values survive in style attributes. The result is available as `value`, as HTML, and as Markdown through the `markdown` property, which you can also set to load a document.

## Forms and accessibility

With a `name`, the editor submits its HTML like a textarea. `required`, `maxlength`, `placeholder`, `readonly` and `disabled` behave as they do on native fields, form reset restores the starting text, and a counter shows words and characters. The toolbar follows the ARIA toolbar pattern, with one Tab stop and arrow keys between buttons, and Alt+F10 jumps to it from the text. Commands are announced to screen readers. On a phone the buttons that do not fit move into a More menu.

```html
<ui-kit-editor name="body" required placeholder="Write your post"></ui-kit-editor>
```

<div class="pro-shots phone">
  <figure>
    <img src="/pro/components/ui-kit-editor/light-phone.png" alt="Rich text editor, phone, light mode" width="390" height="2293" loading="lazy">
    <figcaption>Phone, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-editor/dark-phone.png" alt="Rich text editor, phone, dark mode" width="390" height="2293" loading="lazy">
    <figcaption>Phone, dark mode</figcaption>
  </figure>
</div>


## Built from REALM UI

Rich text editor is made from free REALM UI components, so it follows your theme and dark mode like the rest of your page:

- [`ui-button`](/components/button/)
- [`ui-input`](/components/input/)
- [`ui-label`](/components/label/)

## Use it

Rich text editor is part of [REALM Pro](/pro/). Add it from REALM Pro Studio, or copy the file into your project and load it:

```html
<import-element from="/pro/components/ui-kit-editor.html"></import-element>
<ui-kit-editor></ui-kit-editor>
```
