## Why
Runtime assembly inserts scripts, which a strict Content Security Policy (`script-src 'self'`) blocks. Projects with strict policies need components that run without any inline script, and editors need a manifest describing components.

## What Changes
- A definition's `<script src="…">` loads a pre-assembled setup module instead of assembling at runtime.
- Handler attributes are stored under an inert `realm:on…` name in definition markup, so cloned markup never carries a native inline handler.
- New `@realmorg/realm/compiler` entry turns a definition into a setup module.
- New `@realmorg/vite-plugin`: pre-assembles every definition in the build output and writes `custom-elements.json`.

## Impact
Runtime: about 100 bytes. New package `packages/vite-plugin`.
