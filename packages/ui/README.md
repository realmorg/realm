# @realmorg/ui

About 60 accessible components built with [REALM](https://realm.js.org). Each one is a native custom element made of composable parts (such as `<ui-card-header>`) and styled with the design tokens in `theme.css`. Form controls work as native form fields.

Load REALM, the theme and the components from the CDN. There is no build step.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/theme.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"></script>
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/dist/ui.html"></import-element>

<ui-card>
  <ui-card-header>
    <ui-card-title>Create project</ui-card-title>
    <ui-card-description>Deploy in one click.</ui-card-description>
  </ui-card-header>
  <ui-card-content>
    <ui-field>
      <ui-label for="name">Name</ui-label>
      <ui-input id="name" name="name"></ui-input>
    </ui-field>
  </ui-card-content>
  <ui-card-footer justify="end"><ui-button>Create</ui-button></ui-card-footer>
</ui-card>
```

To load only what you use, import single files instead of `ui.html`:

```html
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/button.html"></import-element>
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/card.html"></import-element>
```

Each file imports its own dependencies (`sheet.html` loads `dialog.html`), and each file is fetched once.

- `dist/ui.html` holds every component in one file.
- `components/*.html` holds one component per file. Import a file on its own, or copy it into your project and edit it.
- `dist/theme.css` defines the colour, spacing, radius, shadow and type tokens, with a dark theme.

Docs and live demos for each component are at [realm.js.org/components](https://realm.js.org/components/).

## License

MIT
