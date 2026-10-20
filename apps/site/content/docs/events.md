---
title: Events
description: Handle events with native on* attributes that call script functions, emit events with dispatchEvent or dispatch, handle custom events on pages, and expose methods with defineMethods.
group: Core concepts
order: 14
nav: Events
---

# Events

REALM uses the browser's own event model. Handlers are native `on*` attributes, events are emitted with `dispatchEvent`, and anything that listens with `addEventListener` keeps working.

## Handling events in markup

Write native handler attributes. Function names resolve to the component's script:

```html
<button onclick="save()">Save</button>
<input oninput="search(this.value)">
<form onsubmit="add(event)">…</form>
<li repeat="#todo.items" as="item" key="id" onclick="toggle(item)">…</li>
```

- `event` is the event and `this` is the element, as in plain HTML.
- Inside `repeat` or `<repeat-list>`, the loop variables (`item`, and the `index` name if you set one) are in scope.
- `return false` cancels the event, like a native handler.
- Names that the script does not define are looked up in parent components, then globals, so `console.log(event)` or `history.back()` work.

Keep handlers to a single function call. Logic belongs in the script.

Handlers are compiled together with the script when the component type is defined, not from the attribute at runtime, and the `on*` attribute is removed from the rendered element. They are not inline handler attributes as far as the browser is concerned, so a Content Security Policy that blocks inline handlers does not block them. See [Security](/docs/security/).

### Debounce and throttle

`debounce` and `throttle` attributes time every handler on that element:

```html
<input oninput="search(this.value)" debounce="300ms">
<div onscroll="measure()" throttle="100ms"></div>
```

Durations accept `ms`, `s` and `m` (`250ms`, `2s`, `1m`). A bare number is milliseconds. Pending debounced calls are cancelled when the element is removed.

## Emitting events

Emit events from the host with the native `dispatchEvent`, or with the `dispatch` helper, which creates a `CustomEvent` that bubbles, crosses shadow roots (`composed`) and is cancelable, and returns `false` when a listener called `preventDefault()`:

```js
function choose(option) {
  if (!dispatch("pick", { value: option.value })) return; // a listener cancelled it
  props.value = option.value;
}
```

`dispatch(type, detail, options)` accepts the usual `CustomEvent` options to override the defaults, for example `{ bubbles: false, composed: false }`.

Name events like native ones: lowercase, without dashes, so `on` plus the name reads like a native handler (`pick` → `onpick`, `requestclose` → `onrequestclose`).

## Handling a component's events

### Inside another component

A parent handles a child's events with `on<name>` in its markup, whether the name is native or not:

```html
<rating-stars onrate="saveRating(event.detail.value)"></rating-stars>
```

### On a plain page

Browsers only support handler attributes for native event names. REALM adds them for its components. On a plain page, an `on<name>` attribute on a REALM element holds ordinary JavaScript, and the matching property accepts a function, like `onclick`:

```html live
<custom-element name="rating-stars">
  <script type="realm">
    const props = defineProps({ value: prop.number().int().min(0).max(5).default(0) });

    const stars = useState({
      get list() {
        return [1, 2, 3, 4, 5].map((value) => ({ value, on: value <= props.value, label: `${value} stars` }));
      },
    });

    function rate(star) {
      const event = new CustomEvent("rate", { bubbles: true, composed: true, cancelable: true, detail: { value: star.value } });
      if (host.dispatchEvent(event)) props.value = star.value;
    }
  </script>

  <style type="realm">
    :host {
      display: inline-flex;
    }
    button {
      all: unset;
      cursor: pointer;
      padding: calc(var(--spacing) * 0.5);
      font-size: var(--text-2xl);
      line-height: 1;
      color: var(--muted-foreground);
    }
    button[data-on] {
      color: var(--chart-4);
    }
    button:focus-visible {
      border-radius: var(--radius-sm);
      box-shadow: var(--focus-ring);
    }
  </style>

  <repeat-list of="#stars.list" as="star" key="value">
    <button type="button" _aria-label="#star.label" _data-on="#star.on" onclick="rate(star)">★</button>
  </repeat-list>
</custom-element>

<rating-stars value="3" onrate="document.getElementById('rating-out').value = 'You rated ' + event.detail.value"></rating-stars>
<output id="rating-out">Click a star.</output>
```

The attribute and the property stay in sync, the handler runs in its native position among listeners, `return false` cancels, and `addEventListener` works alongside:

```js
const stars = document.querySelector("rating-stars");
stars.onrate = (event) => {
  if (event.detail.value < 2) event.preventDefault();
};
```

REALM finds a component's custom event names by reading its script for `new CustomEvent("name"` and `new Event("name"`. Native names such as `change`, `input`, `toggle`, `select` and `close` are never redefined, because they already work everywhere.

## Listening from the script

`listen(type, handler, target)` adds a listener that is removed when the element is removed. The target defaults to the host:

```js
listen("keydown", (event) => {
  if (event.key === "Escape") close();
});

listen("toast", (event) => show(event.detail), document);
```

Use it instead of `addEventListener` so you never leak listeners on `document` or `window`. For listeners you add yourself, pass the `signal` helper: `target.addEventListener(type, fn, { signal })`.

## Public methods

`defineMethods(object)` adds methods and getters to the element, so page code and parent components can call them. They are removed when the element is torn down.

```html live
<custom-element name="tally-counter">
  <script type="realm">
    const tally = useState({ count: 0 });

    defineMethods({
      increment(by = 1) {
        tally.count += by;
        return tally.count;
      },
      reset() {
        tally.count = 0;
      },
      get count() {
        return tally.count;
      },
    });
  </script>

  <style type="realm">
    :host {
      font-size: var(--text-2xl);
      font-weight: var(--font-weight-semibold);
      font-variant-numeric: tabular-nums;
    }
  </style>

  <slot name="#tally.count"></slot>
</custom-element>

<tally-counter id="tally"></tally-counter>
<ui-button onclick="document.getElementById('tally').increment()">Add one</ui-button>
<ui-button variant="outline" onclick="document.getElementById('tally').increment(10)">Add ten</ui-button>
<ui-button variant="ghost" onclick="document.getElementById('tally').reset()">Reset</ui-button>
```

The buttons here are plain page markup, so their handlers are ordinary page JavaScript.

## Events from requests and imports

Elements with [fetch attributes](/docs/fetching/) fire `loadstart`, `load`, `error`, `abort`, `timeout` and `loadend`. `<import-element>` fires `load` and `error`. Handle them with the same native attributes, such as `onload="clearDraft()"`.
