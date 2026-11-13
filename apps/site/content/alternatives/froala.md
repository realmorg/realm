---
title: Froala alternatives
description: Looking for a Froala alternative? Per-domain licences, renewals and SaaS limits compared with REALM Pro's editor, TinyMCE, CKEditor 5 and Tiptap.
seoTitle: Froala alternative with one payment and no domain limits
---

# Froala alternatives

If you need Word import and export, track changes or a supported, long-standing commercial WYSIWYG that drops into 15 or more frameworks, [Froala](https://froala.com/wysiwyg-editor/) is still a sound choice. If you are on the Professional plan and building a SaaS product, which that plan does not allow, or you would rather not renew a per-domain licence each year, `ui-kit-editor` from [REALM Pro](/pro/) gives you a form-ready editor with clean Word and Google Docs paste for one payment of $149 or $499. If you want a free, open source base to build on, look at Tiptap or Lexical.

Facts about Froala were checked in October 2026 against Froala's [product page](https://froala.com/wysiwyg-editor/), its [store](https://cart.froala.com/), which the old pricing URL now redirects to, the [plugin list](https://froala.com/wysiwyg-editor/docs/plugins/) and the [npm registry](https://www.npmjs.com/package/froala-editor). The current release is 5.5.0, published 30 September 2026.

## Why people look for an alternative

- **There is no free tier.** Froala is commercial only. The self-hosted trial lasts 30 days and shows a watermark and an "unlicensed" banner until you buy.
- **Professional rules out SaaS.** The Professional plan covers three domains and one product, and its terms say you may not use Froala in a SaaS or subscription product. SaaS use and redistribution need Enterprise.
- **The prices are high for one editor.** At list price, Professional is $899 a year or $2,699 for a lifetime licence. Enterprise is $1,999 a year or $5,999 lifetime. The store showed lower sale prices in October 2026, and renewals go back to list price.
- **Lifetime does not mean lifetime updates.** A lifetime licence keeps the version you bought working, with 12 months of updates and support. After that, newer versions need another payment.
- **The bundle is large.** Froala does not publish a size. By our measurement, `froala_editor.min.js` 5.5.0 is about 154 KB gzipped, and the packaged build with plugins is about 549 KB gzipped.

## What ui-kit-editor does instead

`ui-kit-editor` is the rich text editor in REALM Pro. It is a custom element that takes part in forms by itself: give it a `name` and it submits its HTML like a textarea. `required`, `maxlength`, `placeholder`, `readonly` and `disabled` behave as they do on native fields, form reset restores the starting text, and a counter shows words and characters.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-editor/light-desktop.png" alt="REALM Pro rich text editor component, desktop, light mode" width="960" height="1925" loading="lazy">
    <figcaption>REALM Pro rich text editor. <a href="/pro/components/ui-kit-editor/">See it in dark mode and on a phone</a>.</figcaption>
  </figure>
</div>

```html
<form method="post" action="/articles">
  <ui-kit-editor
    name="body"
    required
    toolbar="undo redo | block | bold italic underline | link image table | bullet ordered task | quote codeblock">
  </ui-kit-editor>
  <button>Save</button>
</form>
```

What it handles:

- **Formatting.** Bold, italic, underline, strikethrough, inline code, four heading levels, quotes, code blocks, dividers, nested bulleted, numbered and task lists, alignment, and text colour and highlight from your theme's palette. There is a toolbar along the top and a small menu over selected text.
- **Paste from Word and Google Docs.** Structure is kept: headings, paragraphs, bold, italic, underline, links, lists and tables. Fonts, sizes, colours, classes and Office's hidden markup are removed. Word's fake list paragraphs become real nested lists.
- **Markdown both ways.** Markdown shortcuts work while typing (`# `, `- `, `1. `, `[ ] `, `> `, three backticks, `---`, `**bold**`, `*italic*`). The `markdown` property returns the document as Markdown and loads Markdown when you set it.
- **Slash menu and mentions.** Type `/` at the start of a line for a filterable list of blocks. Type `@` to mention someone from the `mentions` list, or answer the `mentionsearch` event to look people up on your server.
- **Images and tables.** Insert images by address, file picker, paste or drop. The `upload` event gives your code the file, and you answer with the stored address. Tables have a header row, a bar to add and remove rows and columns, and Tab to move between cells.
- **Safe output.** One allow-list applies to typed, pasted, dropped and loaded content. Scripts, styles, frames, event handler attributes and `javascript:` addresses never get through.
- **Accessibility and phones.** The toolbar follows the ARIA toolbar pattern, Alt+F10 reaches it from the text, and commands are announced to screen readers. On a phone, buttons that do not fit move into a More menu.

## Froala and ui-kit-editor side by side

| | Froala 5.5 | ui-kit-editor (REALM Pro) |
| --- | --- | --- |
| Licence | Commercial | Commercial, part of REALM Pro |
| Price, list | Professional $899 a year or $2,699 lifetime. Enterprise $1,999 a year or $5,999 lifetime | $149 once for one developer, $499 once for up to 10 developers |
| Updates | 12 months, then renew | All 1.x updates included |
| Domains and products | Professional: 3 domains, 1 product. Enterprise: unlimited | Unlimited projects, including client work |
| SaaS use | Enterprise only | Allowed |
| Free trial | 30 days, watermarked | 14-day refund instead of a trial |
| Word paste cleanup | Word Paste plugin | Included |
| Word import and export | Import from Word and Export to Word plugins | Not included |
| Markdown | Markdown Support plugin | Shortcuts, plus Markdown in and out |
| Track changes | Plugin | Not included |
| Mentions and slash menu | No mentions plugin in the published list | Both included |
| Frameworks | 15 or more, with official React, Vue, Angular and Svelte packages | A standard custom element, used in plain HTML or inside React, Vue or Angular |
| Forms | Bind to a textarea or your framework's model | Form-associated element with `name`, validation and reset |
| Accessibility statement | None found on the product page | ARIA toolbar pattern, keyboard access, announcements |
| Theming | Froala themes and CSS | REALM UI theme tokens, light and dark |
| Size | Not published. About 154 KB gzipped core by our measurement | About 36 KB gzipped component file, plus the REALM runtime (about 16 KB gzipped) and the REALM UI parts it uses |

## Where Froala is the better choice

- **Word round trips.** If people upload `.docx` files and download them again, Froala's import and export plugins do that in the browser. `ui-kit-editor` reads pasted Word content but does not open or save `.docx` files.
- **Track changes and code view.** Froala has both as plugins. `ui-kit-editor` has neither.
- **Wide framework and CMS coverage.** Froala ships official wrappers and guides for many stacks, from React to Django and WordPress. `ui-kit-editor` works in any of them as a custom element, but you write the small bit of glue yourself.
- **A vendor you already pay.** If your team has a current Enterprise licence and support you use, the switching cost may be larger than the renewal.
- **Older browsers.** REALM needs Chrome or Edge 125, Firefox 126 or Safari 17.4 and newer. See [Browser support](/docs/browser-support/).
- **Maturity.** REALM Pro is in early access. Froala has been sold for many years.

## Other Froala alternatives

| Option | Licence and price model | Best for |
| --- | --- | --- |
| [TinyMCE](https://www.tiny.cloud/pricing/) | GPL 2 or later, or cloud plans priced by editor loads | Teams that want a free cloud tier and paid add-ons such as PowerPaste, comments and AI |
| [CKEditor 5](https://ckeditor.com/pricing/) | GPL when self-hosted, or plans priced by editor loads | Collaboration, track changes and Word and PDF export, with a WCAG 2.2 AA statement |
| [Tiptap](https://tiptap.dev/pricing) | MIT editor, paid plans for cloud collaboration and document conversion | Custom editors in React, Vue or Svelte |
| [Lexical](https://lexical.dev/docs/intro) | MIT | React apps that want a small core and build their own UI |
| [Quill](https://github.com/slab/quill) | BSD-3-Clause | Simple editors, accepting that the last release was in November 2024 |

TinyMCE is covered in more detail in [TinyMCE alternatives](/alternatives/tinymce/), and all of these are compared in [the best JavaScript rich text editors](/compare/best-javascript-rich-text-editors/).

## Moving from Froala

| Froala | ui-kit-editor |
| --- | --- |
| `new FroalaEditor("#editor", options)` | `<ui-kit-editor name="body">` in the form |
| `toolbarButtons` | `toolbar` attribute, groups separated by `\|` |
| `editor.html.get()` | `editor.value` |
| `editor.html.set(html)` | `editor.value = html` |
| `imageUploadURL` | The `upload` event, answered with `event.detail.resolve(url)` |
| `placeholderText` | `placeholder` |
| `charCounterMax` | `maxlength`, with the built-in counter |
| `contentChanged` event | `input` and `change` events |
| Licence key in options | Not needed |

Content saved by Froala can be loaded as `value`. It passes the same allow-list as pasted HTML, so inline font styles and classes are dropped and the structure is kept.

## Frequently asked questions

<ui-accordion type="multiple" class="faq">
  <ui-accordion-item>
    <ui-accordion-trigger>Is Froala free?</ui-accordion-trigger>
    <ui-accordion-content>No. Froala is commercial. You can evaluate it for 30 days with a watermark. Use after that needs an annual or lifetime licence.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Can I use Froala Professional in a SaaS app?</ui-accordion-trigger>
    <ui-accordion-content>Froala's store says the Professional plan does not allow use in a SaaS or subscription product. Enterprise does. REALM Pro allows SaaS and client work on both plans.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>What is the closest free alternative to Froala?</ui-accordion-trigger>
    <ui-accordion-content>TinyMCE and CKEditor 5 are the closest in look and features, both open source under the GPL with paid plans. If GPL does not suit you, Tiptap and Lexical are MIT, but you build more of the interface yourself.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Does ui-kit-editor need a licence key at runtime?</ui-accordion-trigger>
    <ui-accordion-content>No. The component is a file you copy into your project or install from the REALM Pro package. Nothing calls home and nothing counts loads.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Can I try it before buying?</ui-accordion-trigger>
    <ui-accordion-content>The showcase page has screenshots and the feature list. If it does not fit after you buy, REALM Pro has a 14-day refund, no questions asked.</ui-accordion-content>
  </ui-accordion-item>
</ui-accordion>

## Next

- [Rich text editor](/pro/components/ui-kit-editor/): screenshots and the full feature list for `ui-kit-editor`.
- [REALM Pro](/pro/): the editor plus the rest of the kit, paid once.
- [Forms](/docs/forms/): how REALM components submit with a form.
