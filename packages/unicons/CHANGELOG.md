# @realmorg/unicons

## 2.0.0-alpha.3

### Patch Changes

- 42e8119: The READMEs load REALM, REALM UI and Unicons from `https://realm.js.org/dist/`, which serves the latest build. Pin an exact version from npm (or jsDelivr) in production.
- Updated dependencies [0205693]
- Updated dependencies [42e8119]
- Updated dependencies [7c712c3]
  - @realmorg/realm@2.0.0-alpha.5

## 2.0.0-alpha.2

### Patch Changes

- 97a757e: The catalog's "copied" notice now hides after three seconds, or ten when the clipboard refuses and the markup has to be copied by hand. On phones it spans the screen with even margins instead of being squeezed to half the width.
- 1f199c4: The catalog's size slider no longer snaps back while dragging. The catalog now passes the slider a number instead of a string.
- db1f8bd: `<u-icon>` sets `touch-action: manipulation` inside its shadow root, so quickly tapping an icon button does not zoom the page in iOS Safari.
- Updated dependencies [e4f8d9b]
- Updated dependencies [3b98631]
  - @realmorg/realm@2.0.0-alpha.3

## 2.0.0-alpha.1

### Major Changes

- 89423b7: Unicons v2: one `<u-icon>` REALM component for 50,939 icons from the 31 react-icons sets, replacing v1's one element per icon. Icons load on demand from small per-set chunks, each requested once per page. Attributes `name`, `set`, `size`, `color`, `fill`, `stroke`, `stroke-width` and `label` are reactive. The package now lives in the REALM monorepo, and its catalog is published on the REALM website at `/unicons/`. Chunk URLs are built outside `new URL()`, so Vite's dev server no longer turns the loader into an import of every chunk, chunks are 4 KB (about 1.5 KB gzipped), and `chunkPath(set, name)` lets a build preload the chunks a page shows.

### Patch Changes

- Updated dependencies [b21e827]
  - @realmorg/realm@2.0.0-alpha.2
