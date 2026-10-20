---
title: dispatch
description: Reference for dispatch, which sends a bubbling, composed, cancelable CustomEvent from the component host.
group: "Script: element"
order: 57
nav: dispatch
---

# `dispatch`

Sends a `CustomEvent` from the host.

```ts
dispatch(type: string, detail?: unknown, options?: CustomEventInit): boolean
```

```js
function select(item) {
  if (dispatch("select", { id: item.id })) state.selected = item.id;
}
```

## Parameters

| Parameter | Type | Default | Meaning |
| --- | --- | --- | --- |
| `type` | `string` | required | Event name |
| `detail` | any | `undefined` | `event.detail` |
| `options` | `CustomEventInit` | `{ bubbles: true, composed: true, cancelable: true }` | Overrides any of the defaults |

Returns `false` if a listener called `preventDefault()` (or a handler attribute returned `false`), otherwise `true`.

## Handling the event

| Where | How |
| --- | --- |
| A parent component's markup | `<child-tag onselect="choose(event.detail)">` |
| A plain page | `<child-tag onselect="…">` or `element.onselect = fn`. REALM finds names written as `dispatch("name"` in the script. See [`on…` handlers](/reference/attributes/handlers/#on-a-plain-page) |
| JavaScript | `element.addEventListener("select", …)` |

## Example

```html live
<custom-element name="color-picker">
  <script type="realm">
    function pick(color) {
      dispatch("pick", { color });
    }
  </script>

  <style type="realm">
    :host {
      display: inline-flex;
      gap: calc(var(--spacing) * 2);
    }
  </style>

  <ui-button variant="outline" onclick="pick('red')">Red</ui-button>
  <ui-button variant="outline" onclick="pick('green')">Green</ui-button>
  <ui-button variant="outline" onclick="pick('blue')">Blue</ui-button>
</custom-element>

<color-picker onpick="document.getElementById('picked').value = event.detail.color"></color-picker>
<output id="picked">none</output>
```

## Related

- [Events: emitting events](/docs/events/#emitting-events)
- [Component events](/reference/events/component-events/)
