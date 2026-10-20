---
title: Component events
description: Events your components send with dispatch, how to handle them in markup and on plain pages, and the change event of delegated form controls.
group: Events
order: 82
nav: Component events
---

# Component events

Components send their own events. REALM adds one event of its own for form-associated components.

## Sending

| Way | Defaults |
| --- | --- |
| [`dispatch(type, detail, options)`](/reference/script/dispatch/) | `bubbles: true`, `composed: true`, `cancelable: true` |
| `host.dispatchEvent(new CustomEvent(type, init))` | Whatever `init` says |

Composed events cross shadow boundaries, so a page can listen on an ancestor.

## Handling

| Where | How |
| --- | --- |
| A parent component's markup | `on<type>="code"` on the child, for any event name. See [`on…` handlers](/reference/attributes/handlers/) |
| A plain page | `on<type>="code"` attribute or `element.on<type> = fn` property, for event names found in the component's script |
| Anywhere | `addEventListener(type, …)` |

On plain pages, REALM finds event names written as `dispatch("name"`, `new CustomEvent("name"` or `new Event("name"` in the component script. Names that are native handlers (`onchange`, `oninput`, `onclose`, …) already work and are not redefined.

## change from delegated controls

A form-associated component with [`ref="control"`](/reference/attributes/ref/#ref-control) re-dispatches its control's `change` event from the host:

| Event | Bubbles | Composed | When |
| --- | --- | --- | --- |
| `change` | yes | no | The inner control fired `change`, after the `value` / `checked` prop was updated |

The inner control's own `input` events are composed and reach the host's listeners as they are.

## REALM UI events

Each component page under [Components](/components/) lists that component's events.

## Related

- [Events](/docs/events/)
