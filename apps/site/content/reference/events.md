---
title: Events
description: Reference for the events REALM fires on fetch elements and import-element, their detail objects, and how custom event handler attributes work.
group: Reference
order: 4
nav: Events
---

# Events

## Request events

Fired on the element that has the fetch attributes. They do not bubble.

| Event | Cancelable | When | `detail` |
| --- | --- | --- | --- |
| `loadstart` | yes | Before the request is sent. Cancelling stops it | `{ url: string, method: string }` |
| `load` | no | 2xx response, after `into` and `render` | `{ status: number, data: unknown, headers: Headers, url: string }` |
| `error` | no | Non-2xx response | `{ status, data, headers, url }` |
| `error` | no | Network failure | `{ status: 0, data: undefined, message: string, url }` |
| `abort` | no | Cancelled by a newer request from the same element, or by removal | `{ url }` |
| `timeout` | no | The `timeout` duration elapsed | `{ url }` |
| `loadend` | no | After every request | `{ url }` |

`data` is parsed JSON when the response's `Content-Type` contains `json`, otherwise text.

## Import events

Fired on `<import-element>`. Not fired if the element was removed before the file arrived.

| Event | When | `detail` |
| --- | --- | --- |
| `load` | Every definition in the file is defined | `{ url: string }` |
| `error` | The file could not be loaded | `{ url: string, status: number }` (`0` for network errors) |

## Events from components

Components emit their own events with `dispatch(type, detail, options)` or `host.dispatchEvent(...)`. `dispatch` defaults to `bubbles`, `composed` and `cancelable` all `true`.

Form-associated components that use `ref="control"` re-dispatch the control's `change` event from the host (bubbling, not composed).

The events of each REALM UI component are listed on its page under [Components](/components/).

## Handler attributes

| Where | `on<name>` holds | Notes |
| --- | --- | --- |
| Component markup | Code compiled with the component script | Works for every event name, native or custom. `event`, `this`, loop variables and script names are in scope |
| Plain page, native event names | Native handler | Browser behaviour |
| Plain page, a REALM element's custom event | JavaScript, compiled when the element connects | The `on<name>` property accepts a function and stays in sync with the attribute. Event names are read from `new CustomEvent("name"` and `new Event("name"` in the component script |

In every case, returning `false` calls `preventDefault()`.
