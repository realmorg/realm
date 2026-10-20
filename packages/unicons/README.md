# UNICONS

One `<u-icon>` web component for 50,939 icons from 31 open source sets, built with [REALM](https://realm.js.org) v2.

The component and its loader are about 1.9 KB gzipped. Icons are split into small per-set chunks (about 1.5 KB gzipped each), so a page downloads only the chunks holding the icons it shows. Each file is requested once, however many icons use it.

## Usage

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"></script>
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/unicons@alpha/dist/unicons.html"></import-element>

<u-icon name="house"></u-icon>
<u-icon set="fa6" name="heart" color="crimson" size="32"></u-icon>
<u-icon set="tb" name="bell" stroke-width="1.5" label="Notifications"></u-icon>
```

Browse every icon and copy its markup in the [catalog](https://realm.js.org/unicons/).

### Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `name` | (required) | Icon name in kebab case, for example `house`, `fill-alert`, `arrow-90-deg-down`. |
| `set` | `lu` | Icon set id (see below). |
| `size` | `1em` | Width and height. A plain number means pixels (`24`); any CSS length works (`2rem`). |
| `color` | inherited | Sets `color`. Icons paint with `currentColor`, so they follow the text colour by default. |
| `fill` | from the icon | Overrides the fill of the icon. |
| `stroke` | from the icon | Overrides the stroke of the icon. |
| `stroke-width` | from the icon | Overrides the stroke width, for example `1.5` on outline sets. |
| `label` | none | Accessible name. Without it the icon is decorative and hidden from assistive technology. With it the icon has `role="img"`. |

Every attribute is reactive. Changing `name` or `set` swaps the icon in place.

Children of `<u-icon>` show while the icon loads and when it can't be found, which also logs a warning:

```html
<u-icon name="rocket">🚀</u-icon>
```

### Styling

`<u-icon>` is an inline box sized by `size`. Page CSS wins over the attributes:

```css
u-icon {
  color: rebeccapurple;
  width: 1.25rem;
  height: 1.25rem;
}
u-icon::part(svg) {
  fill: currentColor;
}
```

Parts: `icon` (the wrapper) and `svg`.

### Lazy import

Load the component only once a `<u-icon>` appears in the page:

```html
<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/unicons@alpha/dist/unicons.html" loading="lazy" for="u-icon"></import-element>
```

### Chunks

`unicons.html` finds its icon chunks relative to its own URL, so the icons load from the same CDN folder as the component. Each chunk is requested once, however many icons on the page use it.

### Preloading

An icon shows once REALM, `unicons.html`, `unicons.js` and the icon's chunk have loaded, one after another. Preload them to start every request at once:

```html
<link rel="preload" href="https://cdn.jsdelivr.net/npm/@realmorg/unicons@alpha/dist/unicons.html" as="fetch" crossorigin>
<link rel="modulepreload" href="https://cdn.jsdelivr.net/npm/@realmorg/unicons@alpha/dist/unicons.js">
<link rel="modulepreload" href="https://cdn.jsdelivr.net/npm/@realmorg/unicons@alpha/dist/icons/lu/62.js">
```

`chunkPath(set, name)` from `unicons.js` returns the chunk of an icon (`chunkPath("lu", "house")` is `icons/lu/62.js`), so a build step can list the chunks a page needs. Chunk numbers change between versions, so generate them rather than writing them by hand.

## Sets

| id | Set | id | Set |
| --- | --- | --- | --- |
| `ai` | Ant Design Icons | `io` | Ionicons 4 |
| `bi` | BoxIcons | `io5` | Ionicons 5 |
| `bs` | Bootstrap Icons | `lia` | Icons8 Line Awesome |
| `cg` | css.gg | `lu` | Lucide |
| `ci` | Circum Icons | `md` | Material Design icons |
| `di` | Devicons | `pi` | Phosphor Icons |
| `fa` | Font Awesome 5 | `ri` | Remix Icon |
| `fa6` | Font Awesome 6 | `rx` | Radix Icons |
| `fc` | Flat Color Icons | `si` | Simple Icons |
| `fi` | Feather | `sl` | Simple Line Icons |
| `gi` | Game Icons | `tb` | Tabler Icons |
| `go` | Github Octicons | `tfi` | Themify Icons |
| `gr` | Grommet-Icons | `ti` | Typicons |
| `hi` | Heroicons | `vsc` | VS Code Icons |
| `hi2` | Heroicons 2 | `wi` | Weather Icons |
| `im` | IcoMoon Free | | |

Icon data comes from [react-icons](https://react-icons.github.io/react-icons/) 5.7.0. Each set keeps its own license, listed in `dist/sets.json` and in the catalog.

## How it works

```
dist/
  unicons.html        <u-icon> definition (REALM <custom-element>)
  unicons.js          loader: set table, chunk lookup, svg assembly
  icons/<set>/<n>.js  chunks: export default { "icon-name": "<path …/>" }
  meta/<set>.json     icon names per set, for search
  sets.json           set names, licenses and counts
```

- An icon lives in chunk `fnv1a(name) % chunks` of its set, so the loader finds it without an index.
- Chunks are loaded with `import()`, so the browser's module map shares one request between every icon that needs it, and a `modulepreload` of a chunk is reused.
- Chunk URLs are built at runtime, outside `new URL()`, so bundlers and dev servers (Vite rewrites a templated `new URL()` into an import of every chunk) leave them alone.
- `<import-element>` fetches `unicons.html` once per URL, even when it appears several times.

## Development

Unicons lives in the REALM monorepo at `packages/unicons`. Run these from the repository root after `pnpm install`:

| Task | Command |
| --- | --- |
| Build `dist/` | `pnpm --filter @realmorg/unicons build` |
| Catalog at http://localhost:4317/unicons/ | `pnpm --filter @realmorg/unicons preview` |
| Tests in Chromium, Firefox and WebKit | `pnpm --filter @realmorg/unicons test` |
| Component script coverage (Chromium) | `pnpm --filter @realmorg/unicons coverage` |

The tests and preview serve `dist/` and need it built, along with REALM (`pnpm build` builds both).

Source: `src/unicons.html` (component), `src/unicons.js` (loader), `scripts/build.mjs` (data from react-icons), `site/` (catalog, published on the REALM website at `/unicons/`), `test/` (Playwright).

## Upgrading from v1

v1 shipped one element per icon (`<icon-ai-fill-alert>`, 44,000 files). v2 has one element:

```html
<!-- v1 -->
<import-element from="https://unicons.realm.codes/ai-fill-alert.html"></import-element>
<icon-ai-fill-alert size="24px"></icon-ai-fill-alert>

<!-- v2 -->
<u-icon set="ai" name="fill-alert" size="24"></u-icon>
```

v1 is kept at the `unicons-v1-final` tag of the former [realmorg/unicons](https://github.com/realmorg/unicons) repository.

## License

Copyright 2023. [MIT License](https://github.com/realmorg/realm/blob/main/LICENSE). Icons are under the licenses of their sets.
