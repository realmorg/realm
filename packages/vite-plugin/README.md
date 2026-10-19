# @realmorg/vite-plugin

Pre-assembles REALM components at build time so they run under a strict Content Security Policy, and writes a `custom-elements.json` manifest for editors and documentation tools.

```bash
npm install -D @realmorg/vite-plugin
```

```js
// vite.config.js
import realm from "@realmorg/vite-plugin";

export default {
  plugins: [realm()],
};
```

After the build, every `<custom-element>` in the output HTML gets its script assembled into a module next to the file, and the inline script becomes `<script src="./file.name.js">`. Nothing is evaluated at runtime, so a policy of `script-src 'self'` is enough.

| Option | Default | |
| --- | --- | --- |
| `manifest` | `"custom-elements.json"` | File name for the manifest, or `false` to skip it |

Outside Vite, call `precompile(dir)` on any folder of built HTML files.

Inline `on…` attributes on plain page elements are still inline handlers, so a strict policy blocks them exactly as it would without REALM.
