---
title: TinyMCE alternatives
description: Looking for a TinyMCE alternative? Licence keys, editor-load pricing and paid paste cleanup compared with REALM Pro's editor, CKEditor 5, Tiptap and more.
seoTitle: TinyMCE alternative without editor-load pricing
---

# TinyMCE alternatives

If you need comments, revision history, an AI assistant, Word and PDF export or a vendor support contract, stay on [TinyMCE](https://www.tiny.cloud/) or compare it with CKEditor 5, which sells the same kind of package. If you want a rich text field for your own forms that pastes cleanly from Word and Google Docs, outputs safe HTML or Markdown and costs one payment with no load counting, use `ui-kit-editor` from [REALM Pro](/pro/). If you want an open source toolkit to build your own editor in a React or Vue app, look at Tiptap or Lexical.

Facts about TinyMCE were checked in October 2026 against [tiny.cloud/pricing](https://www.tiny.cloud/pricing/), the [licence key docs](https://www.tiny.cloud/docs/tinymce/latest/license-key/), the [PowerPaste docs](https://www.tiny.cloud/docs/tinymce/latest/introduction-to-powerpaste/), the [accessibility conformance page](https://www.tiny.cloud/docs/tinymce/latest/accessibility-conformance/) and the [npm registry](https://www.npmjs.com/package/tinymce). The current release is 8.10.1.

## Why people look for an alternative

- **Self-hosting now needs a licence key.** TinyMCE 8 run from your own server reads a `license_key`. Open source users set it to `'gpl'`, commercial users need a key from Tiny plus a key manager add-on, and without a valid key the editor is disabled. Keys from TinyMCE 7 do not carry over. Loading TinyMCE from Tiny Cloud needs no key, but then you are on cloud pricing.
- **Cloud pricing counts editor loads.** The Free plan covers 1,000 editor loads a month. Essential is $79 a month billed annually for 5,000 loads, Professional is $145 a month billed annually for 20,000, and extra loads cost $40 per 1,000. A busy admin panel or a public comment form can move you up a tier without any change in your code.
- **The best paste cleanup is paid.** PowerPaste, the plugin that cleans content from Word, Excel and Google Docs, is only available on paid subscriptions.
- **The extras are add-ons.** TinyMCE AI, export to PDF or Word and revision history are priced separately on top of a plan. That is fine if you need them and a lot of cost if you only needed a good text box.
- **GPL is a real choice to make.** The core is GPL 2 or later. That suits open source projects. Teams shipping closed source products often prefer a commercial licence, which brings them back to a paid plan.

## What ui-kit-editor does instead

`ui-kit-editor` is the rich text editor in REALM Pro. It is a form-associated custom element: give it a `name` and it submits its HTML with the form like a textarea, with `required`, `maxlength`, `placeholder`, `readonly` and `disabled` working the way they do on native fields. Form reset restores the starting text, and a counter shows words and characters.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-editor/light-desktop.png" alt="REALM Pro rich text editor component, desktop, light mode" width="960" height="1925" loading="lazy">
    <figcaption>REALM Pro rich text editor. <a href="/pro/components/ui-kit-editor/">See it in dark mode and on a phone</a>.</figcaption>
  </figure>
</div>

```html
<form method="post" action="/posts">
  <ui-kit-editor name="body" required maxlength="20000" placeholder="Write your post"></ui-kit-editor>
  <button>Publish</button>
</form>

<script type="module">
  const editor = document.querySelector("ui-kit-editor");
  editor.addEventListener("upload", (event) => {
    const body = new FormData();
    body.append("image", event.detail.file);
    const stored = fetch("/images", { method: "POST", body })
      .then((response) => response.json())
      .then((image) => image.url);
    event.detail.resolve(stored);
  });
</script>
```

What it covers:

- **Formatting.** Bold, italic, underline, strikethrough and inline code, four heading levels, quotes, code blocks, dividers, bulleted, numbered and task lists with nesting, alignment, and text colour and highlight taken from your theme's colours. A toolbar sits on top and a small menu appears over selected text.
- **Paste from Word and Google Docs, included.** Headings, paragraphs, bold, italic, underline, links, lists and tables survive. Fonts, sizes, colours, classes and the hidden markup Office adds are dropped. Word's fake list paragraphs become real nested lists, and Google Docs' styled spans become `strong` and `em`.
- **Writing without the mouse.** Type `/` at the start of a line for a block menu, `@` to mention someone from a list or from your server through the `mentionsearch` event, and Markdown shortcuts such as `# `, `- `, `> ` and `**bold**` turn into formatting as you type.
- **Images and tables.** Images come in by address, file picker, paste or drop. The `upload` event hands your code the file, and the image shows faded until your server answers with its address. Tables start with a header row, and Tab moves between cells.
- **Safe output.** Everything that enters, typed, pasted or set from code, passes one allow-list. Scripts, styles, frames, event handler attributes and `javascript:` addresses are removed. Read the result as `value` (HTML) or through the `markdown` property, which you can also set to load a document.
- **Accessibility.** The toolbar follows the ARIA toolbar pattern with one Tab stop and arrow keys between buttons, Alt+F10 jumps to it from the text, and commands are announced to screen readers.

## TinyMCE and ui-kit-editor side by side

| | TinyMCE 8 | ui-kit-editor (REALM Pro) |
| --- | --- | --- |
| Licence | GPL 2 or later, or commercial | Commercial, part of REALM Pro |
| Price model | Free cloud plan up to 1,000 loads a month, then $79 or $145 a month billed annually, plus $40 per extra 1,000 loads. Enterprise on request | $149 once for one developer, $499 once for up to 10 developers. No load or domain limits |
| Self-hosting | GPL build with `license_key: 'gpl'`, or a commercial key with a key manager add-on | Always. The files are copied into your project |
| Word and Google Docs paste cleanup | PowerPaste, paid plans only | Included |
| Mentions | Listed from the Essential plan | Included, from a list or your server |
| Comments, revision history, AI, PDF and Word export | Available as plan features or paid add-ons | Not included |
| Framework integrations | Official packages for React, Angular, Vue, Blazor, Svelte, a web component and more | A standard custom element, used directly in plain HTML or inside React, Vue or Angular |
| Form submission | Through the textarea it replaces | Form-associated element with `name`, validation and reset |
| Accessibility | Targets WCAG 2.2 A and AA for the editor UI, with published conformance reports | ARIA toolbar pattern, keyboard access to commands, spoken announcements |
| Theming | Skins and content CSS | REALM UI theme tokens, so it follows your colours and dark mode |
| Size | Not published by Tiny. `tinymce.min.js` 8.10.1 is about 170 KB gzipped by our measurement, before the theme, skin and plugins | About 36 KB gzipped for the component file as shipped, plus the REALM runtime (about 16 KB gzipped) and the REALM UI parts it uses |

## Where TinyMCE is the better choice

Be honest with yourself about these before you move:

- **Collaboration and review.** Comments, revision history and the wider set of premium plugins are things `ui-kit-editor` does not do. If editors on your team review each other's text inside the editor, TinyMCE or CKEditor 5 are built for that.
- **Export and AI.** TinyMCE sells PDF and Word export and an AI assistant. `ui-kit-editor` gives you HTML and Markdown and leaves conversion to your server.
- **Support contracts and conformance paperwork.** Tiny publishes accessibility conformance reports and sells enterprise plans with support terms. If procurement needs a VPAT or an SLA, that matters more than the editor itself.
- **Older browsers and long history.** TinyMCE has years of integrations with CMSs and frameworks. `ui-kit-editor` runs on REALM, which needs Chrome or Edge 125, Firefox 126 or Safari 17.4 and newer. See [Browser support](/docs/browser-support/).
- **Maturity.** REALM Pro is in early access. TinyMCE has been in production on a very large number of sites for a long time.

## Other TinyMCE alternatives

| Option | Licence and price model | Best for |
| --- | --- | --- |
| [CKEditor 5](https://ckeditor.com/pricing/) | GPL with `licenseKey: 'GPL'` when self-hosted, or commercial plans priced by editor loads | Teams that need collaboration, track changes and export, with a WCAG 2.2 AA statement |
| [Froala](https://froala.com/wysiwyg-editor/) | Commercial only, annual or lifetime per-domain licences | A polished classic WYSIWYG with Word import and export plugins |
| [Tiptap](https://tiptap.dev/pricing) | MIT editor, paid cloud plans for collaboration and conversion | Building a custom editor in React, Vue or Svelte |
| [Lexical](https://lexical.dev/docs/intro) | MIT, pre-1.0 | React apps that want a small, extensible core from Meta |
| [Quill](https://github.com/slab/quill) | BSD-3-Clause | Simple editors where an older, stable API is enough; the last release was 2.0.3 in November 2024 |

For a wider comparison, see [the best JavaScript rich text editors](/compare/best-javascript-rich-text-editors/). If you are also weighing Froala, see [Froala alternatives](/alternatives/froala/).

## Moving from TinyMCE

| TinyMCE | ui-kit-editor |
| --- | --- |
| `tinymce.init({ selector: "textarea" })` | `<ui-kit-editor name="body">` in the form |
| `license_key` | Not needed |
| `toolbar: "undo redo \| bold italic"` | `toolbar="undo redo \| bold italic"`, with names such as `block`, `link`, `image`, `table`, `bullet`, `ordered`, `task` |
| `editor.getContent()` | `editor.value`, or `editor.markdown` |
| `editor.setContent(html)` | `editor.value = html` |
| `images_upload_handler` | The `upload` event, answered with `event.detail.resolve(url)` |
| Mentions plugin | `mentions` property, or the `mentionsearch` event |
| `editor.on("change")` | The `change` event |
| `readonly` option | `readonly` attribute |
| Skins and `content_css` | The REALM UI theme |

Saved HTML from TinyMCE can be loaded directly. It passes the same allow-list as pasted content, so markup the editor does not support, such as inline font styles, is dropped on load.

## Frequently asked questions

<ui-accordion type="multiple" class="faq">
  <ui-accordion-item>
    <ui-accordion-trigger>Is TinyMCE still free?</ui-accordion-trigger>
    <ui-accordion-content>The core is open source under GPL 2 or later, and Tiny Cloud has a Free plan with 1,000 editor loads a month. Self-hosted TinyMCE 8 under the GPL needs <code>license_key: 'gpl'</code>. Commercial use outside the GPL needs a paid plan.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Is there a TinyMCE alternative that cleans Word paste for free?</ui-accordion-trigger>
    <ui-accordion-content>In open source editors, Word paste cleanup is usually basic and up to you. <code>ui-kit-editor</code> includes Word and Google Docs cleanup in the REALM Pro price, with no paid plugin on top.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Does ui-kit-editor work with React or Vue?</ui-accordion-trigger>
    <ui-accordion-content>Yes. It is a standard custom element, so it works in plain HTML pages and inside frameworks that support custom elements. It loads with REALM, one script tag, and needs no build step.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Is the output safe to store and show?</ui-accordion-trigger>
    <ui-accordion-content>The editor removes scripts, styles, frames, event handler attributes and <code>javascript:</code> links from everything that enters it. Always sanitise again on your server, because a request can be sent without the editor.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Does REALM Pro charge per editor load or per domain?</ui-accordion-trigger>
    <ui-accordion-content>No. Personal is $149 and Team is $499, paid once, for unlimited projects including client work, with 1.x updates and a 14-day refund.</ui-accordion-content>
  </ui-accordion-item>
</ui-accordion>

## Next

- [Rich text editor](/pro/components/ui-kit-editor/): screenshots and the full feature list for `ui-kit-editor`.
- [REALM Pro](/pro/): the editor plus the data grid, scheduler, charts and the rest of the kit, for one payment.
- [Forms](/docs/forms/): how REALM components take part in forms.
