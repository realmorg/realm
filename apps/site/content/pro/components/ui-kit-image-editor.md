---
title: Image editor
seoTitle: JavaScript image editor web component · REALM Pro
description: Crop, rotate, straighten, adjust light and colour, apply filters, draw arrows, shapes and text, blur private parts, resize and export JPEG, PNG or WebP.
group: Media
nav: Image editor
---

# Image editor

Crop, rotate, straighten, adjust light and colour, apply filters, draw arrows, shapes and text, blur private parts, resize and export JPEG, PNG or WebP.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-image-editor/light-desktop.png" alt="Image editor, desktop, light mode" width="960" height="677" loading="lazy">
    <figcaption>Desktop, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-image-editor/dark-desktop.png" alt="Image editor, desktop, dark mode" width="960" height="677" loading="lazy">
    <figcaption>Desktop, dark mode</figcaption>
  </figure>
</div>

## What it does

The image editor gives people a full photo editing step before an upload: a product shot for a shop, a listing photo, a screenshot for a support ticket, an avatar or a document scan. It opens an image from `src`, from a file picker or from a file dropped onto it, and offers six tools in one toolbar: Crop, Adjust, Filters, Annotate, Redact and Resize. The result is a real file in the surrounding form, so a plain `multipart/form-data` form uploads the edited picture and nothing else.

## Crop, rotate and straighten

The crop tool shows the whole picture with a crop box on top, a rule-of-thirds grid and the size of the result in pixels. Presets switch between a free crop, the original proportions, square, 4:3, 3:2, 16:9 and a 4:5 portrait. The box is moved by dragging and resized from its corners. Two buttons turn the picture by a quarter turn, two more mirror it horizontally or vertically, and the straighten slider tilts it by up to 45 degrees. While straightening, the picture is zoomed just enough that no empty corner ever reaches the result. Turning or mirroring carries the crop and every drawing along with the picture, so nothing has to be redone.

## Light, colour and filters

Adjust has five sliders, brightness, contrast, saturation, exposure and colour temperature, each from minus 100 to 100, and the preview updates while the slider moves. Filters offers eight presets, among them vivid, warm, cool, black and white, sepia, faded and two high-contrast looks with a darkened edge. Each preset shows a thumbnail of your own picture, and a strength slider blends it in gradually. Presets and sliders add up, so a warm filter can still be made a little brighter.

## Drawing and redaction

Annotate draws freehand lines, arrows, rectangles, ellipses and text in theme colours or any custom colour, in three line weights. The Select tool moves and resizes anything already drawn, and Delete removes it. Redact hides faces, number plates, names or card numbers by pixelating or blurring a rectangle. Redaction replaces the pixels in the exported file, so the hidden detail cannot be recovered from it.

## Size and format

Resize sets the width and height of the result, with the proportions kept by default, or scales it to 75, 50 or 25 percent. The format can be JPEG, PNG or WebP, with a quality slider for the two lossy formats. The Download button saves the file, and `toFile()`, `toBlob()` and `toDataURL()` give it to scripts. An `export` event carries the file and an `editchange` event reports every edit with the crop, rotation, adjustments and counts of drawings.

```html
<form method="post" enctype="multipart/form-data" action="/listings/photo">
  <label for="photo">Listing photo</label>
  <ui-kit-image-editor id="photo" name="photo" type="image/webp" quality="0.85" required></ui-kit-image-editor>
  <button>Upload</button>
</form>
```

## Keyboard, phones and speed

Every tool works without a mouse. The letters C, A, F, D, B and S switch tools. On the picture, the arrow keys move the crop box or the selected drawing, Alt with an arrow resizes it, R rotates, H and V flip, and the square brackets straighten or pick the next drawing. Enter adds the chosen shape in the middle of the picture, or a text box to type into. Undo and redo cover every edit, with Ctrl+Z and Ctrl+Shift+Z. On a 390 pixel phone the toolbar shrinks to icons and the picture stays square and large enough to work on. Editing runs on a preview copy, so sliders stay smooth on large photos, while the export is rendered from the full-size original.

<div class="pro-shots phone">
  <figure>
    <img src="/pro/components/ui-kit-image-editor/light-phone.png" alt="Image editor, phone, light mode" width="390" height="692" loading="lazy">
    <figcaption>Phone, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-image-editor/dark-phone.png" alt="Image editor, phone, dark mode" width="390" height="692" loading="lazy">
    <figcaption>Phone, dark mode</figcaption>
  </figure>
</div>


## Built from REALM UI

Image editor is made from free REALM UI components, so it follows your theme and dark mode like the rest of your page:

- `u-icon`
- [`ui-button`](/components/button/)
- [`ui-input`](/components/input/)
- [`ui-label`](/components/label/)
- [`ui-select`](/components/select/)
- [`ui-slider`](/components/slider/)
- [`ui-switch`](/components/switch/)

## Use it

Image editor is part of [REALM Pro](/pro/). Add it from REALM Pro Studio, or copy the file into your project and load it:

```html
<import-element from="/pro/components/ui-kit-image-editor.html"></import-element>
<ui-kit-image-editor></ui-kit-image-editor>
```
