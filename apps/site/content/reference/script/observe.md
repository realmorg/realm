---
title: observe
description: Reference for observe, which runs a function now and again whenever the reactive values it read change, with cleanup functions and automatic stop on removal.
group: Script
order: 44
nav: observe
---

# `observe`

Runs a function now and again whenever a reactive value it read changes.

```ts
observe(fn: () => unknown): () => void
```

```js
observe(() => {
  localStorage.setItem("draft", todo.draft);
});

observe(() => {
  const id = setInterval(refresh, props.interval);
  return () => clearInterval(id);
});
```

## Parameters

| Parameter | Type | Meaning |
| --- | --- | --- |
| `fn` | `() => unknown` | Runs immediately, then after any value it read changes. If it returns a function, that function runs before the next run and when the observer stops |

Returns a `stop()` function.

## Behaviour

| Topic | Behaviour |
| --- | --- |
| Dependencies | Collected fresh on every run: only what the last run read is watched |
| Batching | Re-runs are queued and run once per microtask, after all synchronous writes |
| Lifetime | In a component script, stops automatically when the element is removed. The exported `observe` from `@realmorg/realm` is not tied to any element |
| `refs` | An observer at the top of a script sees `refs` once the markup exists, because `refs` is reactive |
| Errors | A throwing observer is reported with `console.error`. Other observers keep running |
| Loops | If observers keep re-triggering each other for 100 rounds in one flush, the queue is cleared and `Update loop detected` is reported |
| Reading without subscribing | Wrap reads in [`untrack`](/reference/javascript/untrack/), imported from `@realmorg/realm` (it is not one of the script helpers) |

## Example

```html live
<custom-element name="title-mirror">
  <script type="realm">
    const draft = useState({ text: "REALM" });
    const log = useState({ runs: 0 });
    let runs = 0;

    observe(() => {
      refs.preview?.style.setProperty("letter-spacing", `${draft.text.length / 20}em`);
      log.runs = ++runs;
    });
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 2);
      width: min(calc(var(--spacing) * 100), 100%);
    }
  </style>

  <input aria-label="Text" _value="#draft.text" oninput="draft.text = this.value">
  <strong ref="preview"><slot name="#draft.text"></slot></strong>
  <small>Observer runs: <slot name="#log.runs"></slot></small>
</custom-element>

<title-mirror></title-mirror>
```

## Related

- [State and reactivity: observe](/docs/state/#observe)

## Calling other components from an observer

An observer subscribes to everything it reads, including state read inside another component's methods. Wrap such calls in `untrack` so the observer runs only when its own inputs change:

```js
observe(() => {
  if (order.status === "error") untrack(() => refs.dialog.showModal());
});
```
