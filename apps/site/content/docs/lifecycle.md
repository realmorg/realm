---
title: Lifecycle
description: When a component's script runs, what onConnected and onDisconnected do, how moving and removing elements works, and how signal, host, refs and internals fit in.
group: Core concepts
order: 17
nav: Lifecycle
---

# Lifecycle

REALM follows the native custom element lifecycle. Nothing happens in the constructor; everything happens when the element is connected to the page.

## When an element connects

1. A shadow root is created (once per element) and the component's stylesheets are adopted.
2. The script runs for this instance. `host`, `signal` and `internals` are ready; `refs` is still empty because the markup does not exist yet.
3. The markup is cloned, and every slot, binding, handler, condition, loop and fetch attribute is connected.
4. `onConnected` callbacks run. `refs` now holds every element with a `ref` attribute.

```js
const editor = useState({ ready: false });

onConnected(() => {
  refs.input.focus();
  const observer = new ResizeObserver(() => measure());
  observer.observe(host);
  return () => observer.disconnect(); // runs when the element is removed
});
```

A function returned from `onConnected` runs on removal.

`refs` is reactive, so an `observe` written at the top of the script sees refs as soon as the markup exists:

```js
observe(() => {
  if (refs.canvas) draw(refs.canvas);
});
```

## When an element is removed

Removal is handled one microtask later, so a move (remove, then insert again in the same task) is not a removal:

- **Moved** to another place in the page: the instance, its state and its DOM are kept.
- **Removed**: `onDisconnected` callbacks run, then the element's `signal` aborts, every observer stops, every listener, timer, poll and request REALM created is cancelled, prop accessors and methods added with `defineMethods` are removed, and the shadow root is emptied.
- **Added again later**: it mounts fresh, with new state, as if it were new.

```js
onDisconnected(() => {
  saveDraft();
});
```

## signal

`signal` is an `AbortSignal` that aborts when the element is removed. Pass it to anything you start yourself:

```js
const response = await fetch("/api/report", { signal });

window.addEventListener("resize", measure, { signal });

const id = setInterval(poll, 5000);
signal.addEventListener("abort", () => clearInterval(id));
```

Or use the helpers that already do this: `listen` for listeners and `observe` with a returned cleanup for timers.

## host, refs and internals

| Helper | What it is |
| --- | --- |
| `host` | The element itself. Use it for `host.dispatchEvent`, `host.getRootNode()`, `host.closest(...)` |
| `refs` | An object of elements marked with `ref="name"` in the markup |
| `internals` | The element's `ElementInternals`: `states`, `role`, `setFormValue`, `setValidity`, `form`, `labels` |

`internals.states` drives custom CSS states:

```js
observe(() => {
  if (menu.open) internals.states.add("open");
  else internals.states.delete("open");
});
```

```css
:host(:state(open)) .panel {
  display: block;
}
```

While a [fetch attribute](/docs/fetching/) request runs inside a component, its host matches `:state(loading)`.

## Form lifecycle

Form-associated components also get `onFormReset`, `onFormDisabled` and `onFormStateRestore`. See [Forms](/docs/forms/).

## Elements inside definitions

Elements written inside a `<custom-element>` definition in the page are never mounted while they are part of the definition. They mount once the definition is used.
