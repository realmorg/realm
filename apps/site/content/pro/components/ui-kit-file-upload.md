---
title: File upload
seoTitle: JavaScript file upload web component · REALM Pro
description: Drop or browse files with type, size and count limits, image previews, per-file progress, retry and remove. Submits the uploaded file references.
group: Forms
nav: File upload
---

# File upload

Drop or browse files with type, size and count limits, image previews, per-file progress, retry and remove. Submits the uploaded file references.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-file-upload/light-desktop.png" alt="File upload, desktop, light mode" width="960" height="693" loading="lazy">
    <figcaption>Desktop, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-file-upload/dark-desktop.png" alt="File upload, desktop, dark mode" width="960" height="693" loading="lazy">
    <figcaption>Desktop, dark mode</figcaption>
  </figure>
</div>

## What it does

The file upload turns the plain "Choose file" button into a drop zone with a list of files underneath. People drag files onto it, click it to open the file chooser, focus it and press Enter, or paste a screenshot straight from the clipboard. Each file appears as a row with its name, its size, a thumbnail for images and a progress bar while it uploads. When it is done the row says so, and a remove button takes it away again.

## Limits that explain themselves

`accept` limits the file types, using the same syntax as the native input, such as `image/*,.pdf`. `max-size` caps each file, written the way people say it, like `5MB`. `max-files` caps how many files a multiple upload holds. Under the drop zone, a short line spells the rules out ("Images, PDF · up to 5 MB · 6 files at most") so nobody has to guess. A file that breaks a rule is not silently dropped: it stays in the list in red with the reason, such as "contract.zip is not an allowed file type" or "scan.png is larger than 5 MB", until it is removed, and a `reject` event tells the page about it.

## Uploading your way

There are three ways to handle the bytes. With `src`, the component posts each file to that URL with `XMLHttpRequest`, so the progress bar follows the real upload, and reads the file's id or URL from the JSON response. Without `src`, it sends an `upload` event for each file. The page calls `event.detail.respondWith()` with a promise for the file reference and reports progress with `event.detail.progress()`, which fits presigned S3 URLs, Cloudinary, Firebase Storage or any SDK. And when nothing handles the upload at all, the files are kept in the form like a native file input and are sent with the form itself.

Failed uploads show the server's message and a retry button. Removing a file while it is still uploading cancels the request through an `AbortSignal`, and every request stops if the component leaves the page. With `manual`, files wait in the list until people press the Upload button, which suits forms where several files are reviewed before anything is sent.

## In a form

The form value is the list of uploaded file references, one entry per file under the component's `name`, so the server receives `photos=img_7d2a&photos=img_91c0` rather than the files themselves. Files from an earlier visit can be shown with `files`, which makes edit forms straightforward. `required` asks for at least one file, and the form will not submit while uploads are still running or any upload has failed, each with a clear message. A form reset brings back the starting files.

```html
<form>
  <label for="photos">Listing photos</label>
  <ui-kit-file-upload id="photos" name="photos" multiple accept="image/*" max-size="5MB" max-files="6"
    src="/api/uploads"></ui-kit-file-upload>
  <button>Save</button>
</form>
```

## Accessible and responsive

The drop zone is a labelled button that describes its own rules, the file list is announced as it changes, and every remove, cancel and retry button names the file it acts on. Rows stack neatly on a 390 pixel phone screen, long names are shortened with an ellipsis, and colours come from the REALM UI theme tokens, so the component follows your theme and dark mode.

<div class="pro-shots phone">
  <figure>
    <img src="/pro/components/ui-kit-file-upload/light-phone.png" alt="File upload, phone, light mode" width="390" height="693" loading="lazy">
    <figcaption>Phone, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-file-upload/dark-phone.png" alt="File upload, phone, dark mode" width="390" height="693" loading="lazy">
    <figcaption>Phone, dark mode</figcaption>
  </figure>
</div>


## Built from REALM UI

File upload is made from free REALM UI components, so it follows your theme and dark mode like the rest of your page:

- `u-icon`
- [`ui-button`](/components/button/)

## Use it

File upload is part of [REALM Pro](/pro/). Add it from REALM Pro Studio, or copy the file into your project and load it:

```html
<import-element from="/pro/components/ui-kit-file-upload.html"></import-element>
<ui-kit-file-upload></ui-kit-file-upload>
```
