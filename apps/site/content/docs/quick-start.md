---
title: Quick start
description: Write your first REALM component in one HTML file, then move it into its own file and load it with import-element.
group: Getting started
order: 3
nav: Quick start
---

# Quick start

This page builds a working component in one HTML file, then moves it into its own file. You need a text editor and a web browser. There is nothing to install. REALM loads from a CDN.

## 1. One HTML file

Create `index.html`. The two tags in the `<head>` load REALM from the jsDelivr CDN:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My first REALM page</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.css">
  <script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"></script>
</head>
<body>
  <custom-element name="greeting-form">
    <script type="realm">
      const greeting = useState({
        name: "",
        get message() {
          return this.name.trim() ? `Hello, ${this.name.trim()}!` : "";
        },
      });

      function updateName(field) {
        greeting.name = field.value;
      }
    </script>

    <style type="realm">
      :host {
        display: block;
        font-family: system-ui, sans-serif;
      }
    </style>

    <label>
      Your name
      <input _value="#greeting.name" oninput="updateName(this)">
    </label>
    <p><slot name="#greeting.message">Type your name.</slot></p>
  </custom-element>

  <greeting-form></greeting-form>
</body>
</html>
```

Open the file in your browser and type a name. The live version:

```html live
<custom-element name="greeting-form">
  <script type="realm">
    const greeting = useState({
      name: "",
      get message() {
        return this.name.trim() ? `Hello, ${this.name.trim()}!` : "";
      },
    });

    function updateName(field) {
      greeting.name = field.value;
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      width: calc(var(--spacing) * 72);
    }
  </style>

  <ui-label for="name">Your name</ui-label>
  <ui-input id="name" _value="#greeting.name" oninput="updateName(this)"></ui-input>
  <p><slot name="#greeting.message">Type your name.</slot></p>
</custom-element>

<greeting-form></greeting-form>
```

How it works:

- `useState` returned a reactive object. Writing `greeting.name` updates everything that reads it.
- `message` is a getter, so it works as a cached derived value.
- `<slot name="#greeting.message">` shows the value as text. While the value is empty, the slot shows its own content, "Type your name.", like a native slot's fallback content.
- `_value="#greeting.name"` binds the input's current value to state. `oninput="updateName(this)"` sends changes back. There is no hidden two-way binding.
- In a page, the script and style use `type="realm"`. The browser ignores those types, so the script does not run in the page's global scope and the style does not leak into the page. REALM picks them up and runs them per component instance.

## 2. Move the component into its own file

In an app, each component usually lives in its own file. Create `greeting-form.html` with the same definition, using a plain `<script>` and `<style>` (the file is never rendered by the browser directly, so no `type` is needed):

```html
<custom-element name="greeting-form">
  <script>
    const greeting = useState({
      name: "",
      get message() {
        return this.name.trim() ? `Hello, ${this.name.trim()}!` : "";
      },
    });

    function updateName(field) {
      greeting.name = field.value;
    }
  </script>

  <style>
    :host {
      display: block;
    }
  </style>

  <label>
    Your name
    <input _value="#greeting.name" oninput="updateName(this)">
  </label>
  <p><slot name="#greeting.message">Type your name.</slot></p>
</custom-element>
```

Then load it from the page:

```html
<import-element from="greeting-form.html"></import-element>
<greeting-form></greeting-form>
```

`<import-element>` fetches the file once, defines every `<custom-element>` in it, and fires `load` or `error`. Because files are loaded with `fetch`, open the page through any static file server rather than from disk, for example your editor's live preview or `python3 -m http.server`. There is still nothing to build.

## 3. Use ready-made components

Add the REALM UI theme and bundle to get buttons, inputs, dialogs and more:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/theme.css">
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/ui.html"></import-element>

<ui-button variant="outline">Click me</ui-button>
```

```html live
<ui-button variant="outline">Click me</ui-button>
```

## Next

- The [Tutorial](/docs/tutorial/) builds a small app with lists, props, persistence and styling.
- [Component anatomy](/docs/components/) explains the rules of the three parts.
