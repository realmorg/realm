---
title: tick
description: Reference for tick, which resolves after pending reactive updates have been applied to the DOM.
group: Script
order: 45
nav: tick
---

# `tick`

Waits until pending updates have been applied to the DOM.

```ts
tick(): Promise<void>
```

```js
async function add() {
  todo.items.push(item);
  await tick();
  refs.list.lastElementChild.scrollIntoView();
}
```

## Behaviour

State changes are applied once per microtask. `tick()` waits one microtask and then [flushes](/reference/javascript/flush/) whatever is still queued, so after `await tick()` bindings, slots, lists and conditions show the new state.

| Returns | Meaning |
| --- | --- |
| `Promise<void>` | Resolves after the flush |

## Example

```html live
<custom-element name="tick-list">
  <script type="realm">
    const log = useState({ lines: ["Line 1"] });

    async function add() {
      log.lines.push(`Line ${log.lines.length + 1}`);
      await tick();
      refs.list.scrollTop = refs.list.scrollHeight;
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      justify-items: start;
    }
    div {
      width: calc(var(--spacing) * 60);
      height: calc(var(--spacing) * 24);
      overflow: auto;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: calc(var(--spacing) * 2);
    }
    p {
      margin: 0;
    }
  </style>

  <ui-button onclick="add()">Add a line</ui-button>
  <div ref="list"><p repeat="#log.lines" as="line"><slot name="#line"></slot></p></div>
</custom-element>

<tick-list></tick-list>
```

The new line is in the DOM after `await tick()`, so scrolling reaches it.

## Related

- [State and reactivity: tick](/docs/state/#tick)
