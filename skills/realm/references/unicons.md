# Unicons: `<u-icon>`

One `<u-icon>` element for about 50,000 icons from 31 open source sets. Icons load on demand in small per-set chunks.

```html
<script type="module" src="https://realm.js.org/dist/realm.js"></script>
<import-element from="https://realm.js.org/dist/unicons/unicons.html"></import-element>
```

```html runnable
<u-icon name="house"></u-icon>
<u-icon set="fa6" name="heart" color="crimson" size="32"></u-icon>
<u-icon set="tb" name="bell" stroke-width="1.5" label="Notifications"></u-icon>
```

## Attributes

| Attribute | Default | Meaning |
| --- | --- | --- |
| `name` | required | Icon name in kebab case: `house`, `fill-alert`, `arrow-90-deg-down` |
| `set` | `lu` (Lucide) | Set id, see the table below |
| `size` | `1em` | Width and height. A plain number is pixels (`24`), any CSS length works (`2rem`) |
| `color` | inherited | Sets `color`. Icons paint with `currentColor`, so they follow the text colour by default |
| `fill` | from the icon | Overrides the icon's fill |
| `stroke` | from the icon | Overrides the stroke |
| `stroke-width` | from the icon | Overrides the stroke width (`1.5` on outline sets) |
| `label` | none | Accessible name. Without it the icon is decorative and hidden from assistive technology. With it the icon has `role="img"` |

Every attribute is reactive, so `<u-icon _name="#item.icon">` swaps the icon when the value changes. Children show while the icon loads and when it is not found (which also logs a warning): `<u-icon name="rocket">🚀</u-icon>`.

## Use with REALM UI

Icons inherit the colour and font size of their surroundings, so they fit inside buttons, menu items and sidebar buttons with no extra styling. Icon-only buttons need a name:

```html
<ui-button size="icon" variant="ghost" aria-label="Settings"><u-icon name="settings"></u-icon></ui-button>
<ui-button><u-icon name="plus"></u-icon> New project</ui-button>
```

## Finding icon names

- Browse and copy markup from the catalog: https://realm.js.org/unicons/
- Every set has a name list: `https://realm.js.org/dist/unicons/meta/<set>.json` (for example `meta/lu.json`). Check a name there before using it. Lucide (`lu`, the default) covers most UI needs: `house`, `search`, `settings`, `user`, `bell`, `plus`, `x`, `check`, `trash-2`, `pencil`, `chevron-down`, `chevron-right`, `arrow-left`, `log-out`, `calendar`, `mail`, `menu`, `ellipsis`.
- Names are the react-icons names without the set prefix, in kebab case (`FaHeart` in `fa` is `<u-icon set="fa" name="heart">`).

## Styling

`<u-icon>` is an inline box sized by `size`. Page or component CSS wins over the attributes:

```css
u-icon {
  width: calc(var(--spacing) * 4);
  height: calc(var(--spacing) * 4);
}
u-icon::part(svg) {
  fill: currentColor;
}
```

Parts: `icon` (the wrapper) and `svg`.

## Loading

Lazy, only once a `<u-icon>` appears:

```html
<import-element from="https://realm.js.org/dist/unicons/unicons.html" loading="lazy" for="u-icon"></import-element>
```

An icon shows after REALM, `unicons.html`, `unicons.js` and its chunk have loaded, one after another. Preload them on pages where icons are above the fold:

```html
<link rel="preload" href="https://realm.js.org/dist/unicons/unicons.html" as="fetch" crossorigin>
<link rel="modulepreload" href="https://realm.js.org/dist/unicons/unicons.js">
```

`chunkPath(set, name)` from `unicons.js` returns an icon's chunk (`icons/lu/62.js`) if a build step wants to preload chunks too. Chunk numbers change between versions, so generate them.

## Sets

<!-- generated:sets -->
| `set` | Name | Icons | License |
| --- | --- | --- | --- |
| `ai` | Ant Design Icons | 831 | MIT |
| `bi` | BoxIcons | 1634 | MIT |
| `bs` | Bootstrap Icons | 2754 | MIT |
| `cg` | css.gg | 704 | MIT |
| `ci` | Circum Icons | 288 | MPL-2.0 license |
| `di` | Devicons | 192 | MIT |
| `fa` | Font Awesome 5 | 1611 | CC BY 4.0 License |
| `fa6` | Font Awesome 6 | 2058 | CC BY 4.0 License |
| `fc` | Flat Color Icons | 329 | MIT |
| `fi` | Feather | 287 | MIT |
| `gi` | Game Icons | 4040 | CC BY 3.0 |
| `go` | Github Octicons icons | 264 | MIT |
| `gr` | Grommet-Icons | 637 | Apache License Version 2.0 |
| `hi` | Heroicons | 460 | MIT |
| `hi2` | Heroicons 2 | 972 | MIT |
| `im` | IcoMoon Free | 491 | CC BY 4.0 License |
| `io` | Ionicons 4 | 696 | MIT |
| `io5` | Ionicons 5 | 1332 | MIT |
| `lia` | Icons8 Line Awesome | 1544 | MIT |
| `lu` | Lucide | 1541 | ISC |
| `md` | Material Design icons | 4341 | Apache License Version 2.0 |
| `pi` | Phosphor Icons | 9072 | MIT |
| `ri` | Remix Icon | 3188 | Apache License Version 2.0 (Remix Icon 4.8.0) |
| `rx` | Radix Icons | 332 | MIT |
| `si` | Simple Icons | 3446 | CC0 1.0 Universal |
| `sl` | Simple Line Icons | 189 | MIT |
| `tb` | Tabler Icons | 6146 | MIT |
| `tfi` | Themify Icons | 352 | MIT |
| `ti` | Typicons | 336 | CC BY-SA 3.0 |
| `vsc` | VS Code Icons | 612 | CC BY 4.0 |
| `wi` | Weather Icons | 219 | SIL OFL 1.1 |
<!-- /generated:sets -->

Each set keeps its own license.
