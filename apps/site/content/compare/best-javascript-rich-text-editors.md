---
title: Best JavaScript rich text editors
description: Eight JavaScript rich text and WYSIWYG editors compared: licence, price model, frameworks, paste cleanup, collaboration and accessibility. Checked October 2026.
seoTitle: Best JavaScript rich text editors (WYSIWYG) in 2026
---

# Best JavaScript rich text editors

The right editor depends on what you are building. For a full WYSIWYG with collaboration, track changes and Word export, pick **CKEditor 5** or **TinyMCE**. For a custom editor inside a React, Vue or Svelte app, pick **Tiptap**, or **Lexical** if you are on React. For a rich text field in ordinary forms, with clean paste from Word and Google Docs, Markdown, mentions and safe HTML for one payment, pick **`ui-kit-editor`** from REALM Pro. **Froala** suits teams that want a commercial classic editor with Word import and export. **Quill** and **ProseMirror** remain good open source choices for simpler or fully custom needs.

Facts were checked in October 2026 against each vendor's own pricing page, documentation, GitHub repository and the npm registry, linked below. Prices are in US dollars as shown on those pages and change often, so check them before you buy.

## Quick comparison

| Editor | Licence | Price model | Official frameworks | Best for |
| --- | --- | --- | --- | --- |
| [CKEditor 5](https://ckeditor.com/pricing/) | GPL or commercial | Free cloud plan up to 1,000 loads a month, paid plans by editor loads, custom quotes for self-hosting | Angular, React, Next.js, Nuxt, Vue, Svelte and more | Collaboration, track changes, export, accessibility paperwork |
| [TinyMCE](https://www.tiny.cloud/pricing/) | GPL 2 or later, or commercial | Free cloud plan up to 1,000 loads a month, paid plans by editor loads | React, Angular, Vue, Blazor, Svelte, web component and more | A familiar WYSIWYG with many premium plugins |
| [Tiptap](https://tiptap.dev/pricing) | MIT | Editor free. Paid plans for cloud documents, collaboration and conversion | Vanilla JS, React, Next.js, Vue, Nuxt, Svelte, Alpine | Custom editors in modern app frameworks |
| [Lexical](https://lexical.dev/docs/intro) | MIT | Free | Framework-agnostic core, official React bindings | React apps that want a small, extensible core |
| `ui-kit-editor` (REALM Pro) | Commercial | $149 or $499, paid once, for the whole REALM Pro kit | A standard custom element, in plain HTML or inside any framework that supports custom elements | Form fields with clean paste, Markdown and safe output |
| [Froala](https://froala.com/wysiwyg-editor/) | Commercial | Annual or lifetime licences, from $899 a year at list price | 15 or more, including React, Angular, Vue and Svelte | A polished classic editor with Word import and export |
| [Quill](https://github.com/slab/quill) | BSD-3-Clause | Free | None official | Simple editors with a stable API |
| [ProseMirror](https://github.com/ProseMirror/prosemirror) | MIT | Free | None; a toolkit of modules | Building your own editor from the ground up |

## CKEditor 5

CKEditor 5 is the most complete package on this list. Version 49.0.1 was published in October 2026. Self-hosted with `licenseKey: 'GPL'`, it is free under the GPL and shows a small "Powered by CKEditor" logo. Cloud delivery, premium features and use outside the GPL need a commercial key. The [pricing page](https://ckeditor.com/pricing/) lists a Free plan with 1,000 editor loads a month, Essential at $144 a month and Professional at $289 a month when billed annually, with overage charged per 1,000 loads and self-hosting on custom quotes. Collaboration (comments, track changes, revision history) is an add-on, and Word and PDF export come with monthly quotas.

The enhanced Word and Excel paste is a premium feature from Essential up. CKEditor's [accessibility page](https://ckeditor.com/docs/ckeditor5/latest/features/accessibility.html) states WCAG 2.2 A and AA compliance and Section 508, with a published conformance report.

**Best for:** products where several people write and review the same document, or where procurement asks for a VPAT.

## TinyMCE

TinyMCE 8.10.1 is GPL 2 or later, and self-hosting it now needs a `license_key`, which open source users set to `'gpl'` ([licence key docs](https://www.tiny.cloud/docs/tinymce/latest/license-key/)). The cloud Free plan includes 1,000 editor loads a month. Essential is $79 and Professional $145 a month billed annually, for 5,000 and 20,000 loads. PowerPaste, the Word and Google Docs cleanup, is for paid plans only, and AI, revision history and export are add-ons. Tiny targets WCAG 2.2 A and AA for its interface and publishes conformance reports.

**Best for:** teams who want a free cloud start and the option to buy plugins later. See [TinyMCE alternatives](/alternatives/tinymce/) for a closer look.

## Tiptap

Tiptap is an MIT-licensed editor framework built on ProseMirror. `@tiptap/core` 3.32.0 was published in October 2026. You compose it from extensions (tables, mentions, collaboration and more, also MIT) and draw your own toolbar. The paid [plans](https://tiptap.dev/pricing) add hosted collaboration, comments, AI and conversion to and from DOCX, PDF and Markdown: Start at $49, Team at $149 and Business at $999 a month billed annually. Official guides cover vanilla JavaScript, React, Next.js, Vue, Nuxt, Svelte and Alpine. Its Markdown support is marked as an early release.

**Best for:** app teams who want full control of the interface and are happy to build it.

## Lexical

[Lexical](https://github.com/facebook/lexical) is Meta's MIT-licensed editor framework, at 0.53.0, still before 1.0. The core has no dependencies and no framework tie, with official React bindings. Packages add Markdown, HTML and JSON serialisation, tables, lists, code blocks and real-time collaboration through Yjs. Like Tiptap, it gives you building blocks, not a finished toolbar.

**Best for:** React apps that need a fast, extensible core and can absorb API changes before 1.0.

## ui-kit-editor (REALM Pro)

`ui-kit-editor` is a finished editor, not a toolkit, and it is a form field. Give it a `name` and it submits HTML like a textarea, with `required`, `maxlength`, `placeholder`, `readonly`, `disabled` and form reset working as they do on native fields.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-editor/light-desktop.png" alt="REALM Pro rich text editor component, desktop, light mode" width="960" height="1925" loading="lazy">
    <figcaption>REALM Pro rich text editor. <a href="/pro/components/ui-kit-editor/">See it in dark mode and on a phone</a>.</figcaption>
  </figure>
</div>

```html
<ui-kit-editor name="body" required placeholder="Write your post"></ui-kit-editor>
```

It covers headings, lists including task lists, quotes, code blocks, tables, links, images, alignment and theme colours, with a toolbar, a bubble menu over selected text, a `/` block menu and `@` mentions from a list or your server. Markdown shortcuts work while typing, and the `markdown` property reads and writes Markdown. Paste from Word and Google Docs keeps structure and drops fonts, colours and Office's hidden markup, with no extra plugin to buy. Everything that enters passes one allow-list, so scripts, frames, event handlers and `javascript:` links are removed. The toolbar follows the ARIA toolbar pattern and commands are announced.

What it does not have: comments, track changes, revision history, real-time collaboration, AI and `.docx` or PDF export. It runs on REALM, which needs Chrome or Edge 125, Firefox 126 or Safari 17.4 and newer, and REALM Pro is in early access.

**Best for:** admin panels, CMSs, support tools and comment forms that need a good editor without per-load pricing or framework lock-in. See the [Rich text editor](/pro/components/ui-kit-editor/) page.

## Froala

Froala 5.5.0 is commercial only, with a 30-day watermarked trial. The [store](https://cart.froala.com/) lists Professional at $899 a year or $2,699 lifetime (three domains, one product, no SaaS use) and Enterprise at $1,999 a year or $5,999 lifetime, with 12 months of updates on lifetime licences. Its [plugins](https://froala.com/wysiwyg-editor/docs/plugins/) include Word paste, Word import and export, Markdown, track changes and code view.

**Best for:** teams who want a commercial classic editor with Word round trips. See [Froala alternatives](/alternatives/froala/).

## Quill

Quill is BSD-3-Clause, maintained by Slab. Quill 2.0 shipped in April 2024, and the latest release is 2.0.3 from November 2024. It has two built-in themes, Snow and Bubble. It is small and well understood, but releases have been quiet for almost two years.

**Best for:** simple comment boxes and notes where you do not need tables or advanced paste.

## ProseMirror

ProseMirror is the MIT-licensed toolkit Tiptap is built on, made of separate modules for the model, state, view and transforms, with collaborative editing and custom document schemas. Its modules were still being released in October 2026. It gives you the most control and the most work.

**Best for:** teams building an editor product, or anything with an unusual document structure.

## How to choose

1. **Do people review each other's text in the editor?** If yes, CKEditor 5, TinyMCE or Tiptap's paid plans. None of the free options do comments and track changes out of the box.
2. **Do you need `.docx` in and out?** Froala, CKEditor 5 or Tiptap's conversion plans.
3. **Do you want to design the editor's interface yourself?** Tiptap, Lexical or ProseMirror.
4. **Is it a field in a form?** `ui-kit-editor` is built for that: it submits, validates and resets like a native field, and pastes cleanly without a paid plugin.
5. **How is it priced at your scale?** Per-load plans are cheap for small apps and grow with traffic. One-time and open source licences do not.

## What to compare in a trial

- Paste a real Word document with nested lists and a table, and a Google Doc with headings. See what survives.
- Look at the HTML it produces. Is it clean enough to store and render elsewhere?
- Tab through the toolbar and use the editor with a screen reader for five minutes.
- Check what happens to bundle size and licence cost when you add the plugins you actually need.

## Frequently asked questions

<ui-accordion type="multiple" class="faq">
  <ui-accordion-item>
    <ui-accordion-trigger>Which rich text editor is free for commercial use?</ui-accordion-trigger>
    <ui-accordion-content>Tiptap's editor and Lexical are MIT, ProseMirror is MIT and Quill is BSD-3-Clause, so all can be used commercially. TinyMCE and CKEditor 5 are free under the GPL, which has its own terms, or through paid commercial plans.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>What is the difference between a WYSIWYG editor and a headless editor?</ui-accordion-trigger>
    <ui-accordion-content>A WYSIWYG editor such as TinyMCE, CKEditor 5, Froala or <code>ui-kit-editor</code> comes with its toolbar and menus. A headless framework such as Tiptap, Lexical or ProseMirror gives you the editing engine and leaves the interface to you.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Which editor handles paste from Word best?</ui-accordion-trigger>
    <ui-accordion-content>Test with your own documents. TinyMCE's PowerPaste and CKEditor's Paste from Office Enhanced are paid features built for this. <code>ui-kit-editor</code> includes Word and Google Docs cleanup in the REALM Pro price.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Can I store Markdown instead of HTML?</ui-accordion-trigger>
    <ui-accordion-content>Lexical, Tiptap (in early release), Froala's Markdown plugin and <code>ui-kit-editor</code> all handle Markdown. In <code>ui-kit-editor</code>, read and set the <code>markdown</code> property.</ui-accordion-content>
  </ui-accordion-item>
</ui-accordion>

## Next

- [Rich text editor](/pro/components/ui-kit-editor/): the full feature list for `ui-kit-editor`.
- [REALM Pro](/pro/): the editor plus the data grid, scheduler, charts and more, for one payment.
- [Forms](/docs/forms/): how REALM components behave as form fields.
