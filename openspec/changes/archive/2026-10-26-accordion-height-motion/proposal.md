## Why
`ui-accordion` items opened and closed in one frame. Only the chevron moved, so the content below an item jumped into place. Users expect the item's height to grow and shrink.

## What Changes
- An item's body animates its height when it opens and closes, using the theme's `--default-transition-duration` and `--default-transition-timing-function`. The chevron uses the same tokens.
- Built on the native `<details>` element: `::details-content` becomes a one-row grid whose row moves from `0fr` to `1fr`, and `content-visibility` transitions with `transition-behavior: allow-discrete` so closed content stays visible until the row has collapsed. Collapsed content keeps the browser's own hiding, so it stays out of the tab order and the accessibility tree, and find-in-page behaves as before.
- With `prefers-reduced-motion: reduce`, items open and close at once.
- Engines without `::details-content` open and close at once. WebKit animates both, but it does not yet transition `content-visibility` on `::details-content`, so a closing item's content disappears at once while the space it took still shrinks smoothly.

## Out of scope
- A script-driven workaround that keeps content visible while it closes in WebKit. It would have to hold `<details>` open past the user's click and re-route programmatic closes, which the component avoids.
- Motion for `ui-collapsible` and other disclosure components.

## Impact
`packages/ui/components/accordion.html` styles only. No new tokens, attributes or events. The UI test harness gains a `reduceMotion` browser command.
