---
title: host
description: Reference for host, the component element itself as seen from its script.
group: "Script: element"
order: 50
nav: host
---

# `host`

The component element itself.

```ts
host: HTMLElement
```

```js
host.toggleAttribute("open", true);
host.closest("form");
host.shadowRoot.querySelector("input");
```

## Notes

| Topic | Detail |
| --- | --- |
| Shadow root | `host.shadowRoot` is the open shadow root that holds the markup. It is empty while the script's top level runs |
| Attributes | For reactive attribute reads, use [`attrs`](/reference/script/attrs/) or [`defineProps`](/reference/script/define-props/) |
| Events | Prefer [`dispatch`](/reference/script/dispatch/) to send events and [`listen`](/reference/script/listen/) to receive them, so listeners are removed with the element |
| In markup | `host` is not exposed to references. Inside handlers, `host` is in scope |

## Example

```html live
<custom-element name="host-size">
  <script type="realm">
    const size = useState({ width: 0 });

    onConnected(() => {
      const observer = new ResizeObserver(() => {
        size.width = Math.round(host.getBoundingClientRect().width);
      });
      observer.observe(host);
      return () => observer.disconnect();
    });
  </script>

  <style type="realm">
    /* The text never wraps, so writing the width cannot change the size again. */
    :host {
      display: block;
      resize: horizontal;
      overflow: hidden;
      white-space: nowrap;
      width: calc(var(--spacing) * 60);
      padding: calc(var(--spacing) * 3);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
    }
  </style>

  Drag the corner. Width: <slot name="#size.width"></slot>px
</custom-element>

<host-size></host-size>
```

## Related

- [Lifecycle: host, refs and internals](/docs/lifecycle/#host-refs-and-internals)
