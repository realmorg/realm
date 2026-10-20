# @realmorg/ui

About 60 accessible components in the style of shadcn/ui, built with [REALM](https://realmui.github.io). Every component is a native custom element composed from parts, styled from the design tokens in `theme.css`, and works in forms where it applies.

```html
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

- `dist/ui.html` holds every component in one file; `components/*.html` holds them one per file, to copy into a project and own.
- `theme.css` defines the colour, spacing, radius, shadow and type tokens, with a dark theme.

Documentation and live demos for each component: [realmui.github.io/components](https://realmui.github.io/components/).

## License

MIT
