---
title: Pintura alternatives
description: Looking for a Pintura alternative? Per-seat yearly pricing compared with REALM Pro's image editor and cropper, Filerobot, Cropper.js and TOAST UI.
seoTitle: Pintura alternative: image editor web component, paid once
---

# Pintura alternatives

If you need stickers, frames, video trimming, React Native or a translated editor, [Pintura](https://pqina.nl/pintura/) is the most complete JavaScript image editor you can buy, and the price reflects it. If you need crop, rotate, light and colour, filters, drawing, redaction and resize before an upload, delivered as a form field that submits the edited file, use `ui-kit-image-editor` from [REALM Pro](/pro/) for one payment. If you only need people to frame an avatar or a cover photo, REALM Pro's smaller `ui-kit-image-cropper` does that. For free and open source, **Cropper.js** is the best maintained cropper and **Filerobot** the most complete editor.

Facts about Pintura were checked in October 2026 against its [product page](https://pqina.nl/pintura/), [pricing page](https://pqina.nl/pintura/pricing/) and [npm package](https://www.npmjs.com/package/@pqina/pintura). The current release is 8.100.4, published 28 September 2026.

## Why people look for an alternative

- **It is priced per developer seat, per year.** The Developer licence is €749 a year per seat, excluding VAT. A team of four pays four seats. The Personal licence is €169 a year for one hobby product. Enterprise and OEM terms are by quote.
- **Perpetual, up to a point.** If the subscription ends, you keep using the last version released while it was active, but lose updates, support and the private npm registry. Staying current means renewing.
- **Video is extra.** Clipping and trimming video needs the separate Video Editor extension.
- **Testing shows a watermark.** The public npm package is a test version that puts a watermark on the editor and on output images. The licensed build comes from Pintura's private registry.
- **It can be more than you need.** Many apps need a crop box, a few adjustments and a way to blur a face before upload. Pintura's 40-plus features are welcome if you use them and weight if you do not.

## What ui-kit-image-editor does instead

`ui-kit-image-editor` is the image editor in REALM Pro. It opens an image from `src`, a file picker or a dropped file, and offers six tools in one toolbar: Crop, Adjust, Filters, Annotate, Redact and Resize. It is a form-associated element, so the edited image is a real file in the form.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-image-editor/light-desktop.png" alt="REALM Pro image editor component, desktop, light mode" width="960" height="677" loading="lazy">
    <figcaption>REALM Pro image editor. <a href="/pro/components/ui-kit-image-editor/">See it in dark mode and on a phone</a>.</figcaption>
  </figure>
</div>

```html
<form method="post" enctype="multipart/form-data" action="/listings/photo">
  <label for="photo">Listing photo</label>
  <ui-kit-image-editor id="photo" name="photo" type="image/webp" quality="0.85" required></ui-kit-image-editor>
  <button>Upload</button>
</form>
```

What it covers:

- **Crop, rotate and straighten.** A crop box with a rule-of-thirds grid and the result's size in pixels. Presets for free, original, square, 4:3, 3:2, 16:9 and 4:5. Quarter turns, horizontal and vertical flips, and a straighten slider up to 45 degrees that zooms just enough to keep empty corners out of the result. Turning or flipping carries the crop and drawings along.
- **Light and colour.** Brightness, contrast, saturation, exposure and colour temperature, each from minus 100 to 100, with a live preview.
- **Filters.** Eight presets, including vivid, warm, cool, black and white, sepia and faded, each shown as a thumbnail of your own picture, with a strength slider. Filters and adjustments add up.
- **Annotate.** Freehand lines, arrows, rectangles, ellipses and text, in theme colours or any colour, in three line weights. A Select tool moves and resizes what is drawn.
- **Redact.** Pixelate or blur a rectangle over a face, a number plate or a card number. Redaction replaces the pixels in the exported file, so the detail cannot be recovered from it.
- **Resize and export.** Set width and height with proportions kept, or scale to 75, 50 or 25 percent. Export as JPEG, PNG or WebP with a quality slider. `toFile()`, `toBlob()` and `toDataURL()` give scripts the result, and `export` and `editchange` events report what happened.
- **Keyboard and phones.** Letters switch tools, arrow keys move the crop box or a drawing, Alt with an arrow resizes, R rotates, H and V flip. Undo and redo cover all edits. On a 390-pixel phone the toolbar shrinks to icons. Editing runs on a preview copy, and the export is rendered from the full-size original. Colours follow your REALM UI theme in light and dark mode.

### When you only need a crop

`ui-kit-image-cropper` is the smaller sibling, for avatars, product shots and banners. It keeps the image covering the crop box so a blank edge never reaches the result, supports aspect presets, rotate, straighten and flip, works fully from the keyboard with a spoken summary of the crop, and submits the cropped image as a `File` in the form. `cropData` gives the crop rectangle in the original image's pixels for servers that crop on their side.

```html
<ui-kit-image-cropper name="avatar" aspect="1:1" type="image/webp" max-output="1024" required></ui-kit-image-cropper>
```

Both come with REALM Pro; you load whichever you need.

## Pintura and ui-kit-image-editor side by side

| | Pintura 8 | ui-kit-image-editor (REALM Pro) |
| --- | --- | --- |
| Licence | Commercial | Commercial, part of REALM Pro |
| Price model | €749 per developer seat per year. Personal €169 a year for one hobby product. Enterprise by quote | $149 once for one developer, $499 once for up to 10 developers, for the whole kit |
| After the term | Keep the last version released during the subscription | All 1.x updates included, no term |
| Refund | 60 days | 14 days |
| Tools | Crop, Finetune, Filter, Annotate, Sticker, Fill, Redact, Frame, Resize | Crop, Adjust, Filters, Annotate, Redact, Resize |
| Video | Paid Video Editor extension | No |
| Crop-only component | Configure the editor | `ui-kit-image-cropper`, included |
| Output | Image file, with compression and resizing in the browser | JPEG, PNG or WebP `File` submitted with the form, plus Blob and data URL |
| Frameworks | Vanilla JS, custom element, React, Vue, Svelte, Angular, Alpine, jQuery, React Native, Ionic, Capacitor | A custom element, in plain HTML or any framework that supports custom elements |
| Upload libraries | FilePond, Uppy, Dropzone, jQuery File Upload | A plain form, or your own `fetch` with `toFile()` |
| Languages | 14 bundled locale files | English labels |
| Accessibility | Touch, mouse and keyboard interaction stated | Keyboard control for all tools, labelled controls, announced changes |
| Dependencies | None | The REALM runtime (about 16 KB gzipped) and a few REALM UI parts. The component file is about 18 KB gzipped as shipped |

## Where Pintura is the better choice

- **Stickers, frames and fill.** Pintura has them. `ui-kit-image-editor` does not.
- **Video.** With the extension, Pintura trims and clips video. REALM Pro's editor is images only.
- **Mobile apps.** Pintura ships examples for React Native, Ionic, Cordova and Capacitor. REALM components run in web pages.
- **Upload library integrations.** If you already use FilePond, Uppy or Dropzone, Pintura plugs into them with adapters.
- **Languages.** Pintura includes 14 locale files. `ui-kit-image-editor` has English labels.
- **Image rules and crop guides.** Pintura can enforce crop ratios and show overlays such as bleed margins. Our editor has aspect presets but no guide overlays.
- **Older browsers and maturity.** REALM needs Chrome or Edge 125, Firefox 126 or Safari 17.4 and newer (see [Browser support](/docs/browser-support/)), and REALM Pro is in early access. Pintura has been sold for years.

## Other Pintura alternatives

| Option | Licence | Status | Best for |
| --- | --- | --- | --- |
| [Filerobot Image Editor](https://github.com/scaleflex/filerobot-image-editor) | MIT | Last stable release v4.9.1, December 2024. npm's latest is a 5.0 beta | A free editor with crop, filters, fine-tune, annotate and watermark, for React or vanilla JS |
| [Cropper.js](https://fengyuanchen.github.io/cropperjs/guide.html) | MIT | 2.3.1, October 2026. Version 2 is built from web components | A free, maintained cropper with multiple selections and touch rotate |
| [react-easy-crop](https://github.com/ValentinH/react-easy-crop) | MIT | 6.2.4, October 2026 | A light crop step in React apps |
| [TOAST UI Image Editor](https://github.com/nhn/tui.image-editor) | MIT | Archived in September 2026, last release April 2022 | Existing projects only; it will not get fixes |

## Moving from Pintura

| Pintura | ui-kit-image-editor |
| --- | --- |
| `openDefaultEditor({ src })` | `<ui-kit-image-editor src="…">` |
| Crop aspect ratio options | `aspect` attribute and built-in presets |
| Finetune | Adjust tool |
| Filter | Filters tool |
| Annotate | Annotate tool |
| Redact | Redact tool |
| Resize | Resize tool |
| Output type and quality | `type` and `quality` attributes |
| Getting the processed image | `export` event, or `toFile()` |
| FilePond adapter | A plain form field with `name` |

## Frequently asked questions

<ui-accordion type="multiple" class="faq">
  <ui-accordion-item>
    <ui-accordion-trigger>How much does Pintura cost?</ui-accordion-trigger>
    <ui-accordion-content>In October 2026, the Developer licence was €749 per seat per year excluding VAT, and the Personal licence €169 a year for one hobby product. Enterprise and OEM use are by quote. Video editing is an extra extension.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Can I keep using Pintura if I stop paying?</ui-accordion-trigger>
    <ui-accordion-content>Yes. Pintura's licence is perpetual for the versions released during your subscription. You lose updates, support and the private npm access.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>What is the best free alternative to Pintura?</ui-accordion-trigger>
    <ui-accordion-content>For a full editor, Filerobot Image Editor is MIT, though its stable line has not had a release since December 2024. For cropping only, Cropper.js 2 is MIT and actively released.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Does redaction really remove the hidden detail?</ui-accordion-trigger>
    <ui-accordion-content>In <code>ui-kit-image-editor</code>, yes. Pixelate and blur replace the pixels in the exported file, so the original detail is not stored in it.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Do images leave the device while editing?</ui-accordion-trigger>
    <ui-accordion-content>No. Both REALM Pro components edit in the browser. The file is sent only when the form is submitted or your code uploads it.</ui-accordion-content>
  </ui-accordion-item>
</ui-accordion>

## Next

- [Image editor](/pro/components/ui-kit-image-editor/): screenshots and the full feature list for `ui-kit-image-editor`.
- [REALM Pro](/pro/): the image editor, the cropper and the rest of the kit, paid once.
- [Forms](/docs/forms/): how REALM components submit files with a form.
