---
title: Timers
description: Reference for the element-bound setTimeout, setInterval, clearTimeout and clearInterval available in component scripts, which stop when the element is removed.
group: "Script: element"
order: 60
nav: Timers
---

# Timers

Inside a component script, `setTimeout`, `setInterval`, `clearTimeout` and `clearInterval` are bound to the element. Any timer still pending when the element is removed is cleared.

```ts
setTimeout(callback: (...args: unknown[]) => void, delay?: number, ...args: unknown[]): number
setInterval(callback: (...args: unknown[]) => void, delay?: number, ...args: unknown[]): number
clearTimeout(id?: number): void
clearInterval(id?: number): void
```

```js
const clock = useState({ now: new Date() });
setInterval(() => (clock.now = new Date()), 1000);
```

## Behaviour

| Topic | Detail |
| --- | --- |
| Signature | The same as `window.setTimeout` / `window.setInterval`, returning the same numeric ids |
| Cleanup | Pending timeouts and all intervals are cleared when the element's [`signal`](/reference/script/signal/) aborts |
| Clearing | `clearTimeout` and `clearInterval` both work for either kind of id |
| Window timers | `window.setTimeout(…)` is still available and is **not** cleared automatically |

These versions apply only inside the component script and its handlers. Modules imported by the script use the normal globals.

## Example

```html live
<custom-element name="live-clock">
  <script type="realm">
    const clock = useState({ time: new Date().toLocaleTimeString() });

    setInterval(() => {
      clock.time = new Date().toLocaleTimeString();
    }, 1000);
  </script>

  <p>The time is <time><slot name="#clock.time"></slot></time>.</p>
</custom-element>

<live-clock></live-clock>
```

## Related

- [Performance and memory: memory and cleanup](/docs/performance/#memory-and-cleanup)
