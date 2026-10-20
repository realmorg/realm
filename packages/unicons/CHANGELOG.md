# @realmorg/unicons

## 2.0.0-alpha.1

### Major Changes

- 89423b7: Unicons v2: one `<u-icon>` REALM component for 50,939 icons from the 31 react-icons sets, replacing v1's one element per icon. Icons load on demand from small per-set chunks, each requested once per page. Attributes `name`, `set`, `size`, `color`, `fill`, `stroke`, `stroke-width` and `label` are reactive. The package now lives in the REALM monorepo, and its catalog is published on the REALM website at `/unicons/`. Chunk URLs are built outside `new URL()`, so Vite's dev server no longer turns the loader into an import of every chunk, chunks are 4 KB (about 1.5 KB gzipped), and `chunkPath(set, name)` lets a build preload the chunks a page shows.

### Patch Changes

- Updated dependencies [b21e827]
  - @realmorg/realm@2.0.0-alpha.2
