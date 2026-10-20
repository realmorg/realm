---
title: importDefinitions
description: Reference for importDefinitions, which loads an HTML file from JavaScript and defines every custom-element in it, sharing requests with import-element.
group: JavaScript API
order: 102
nav: importDefinitions
---

# `importDefinitions`

Loads an HTML file and defines every `<custom-element>` in it. The JavaScript form of [`<import-element>`](/reference/elements/import-element/).

```ts
importDefinitions(url: string): Promise<void>
```

```js
import { importDefinitions } from "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/index.js";

await importDefinitions(new URL("components/chart.html", document.baseURI).href);
document.body.append(document.createElement("sales-chart"));
```

## Parameters

| Parameter | Type | Meaning |
| --- | --- | --- |
| `url` | `string` | Absolute URL of the file. Relative URLs inside the file resolve against it |

## Returns

A promise that resolves when every definition in the file is defined. It rejects with an error whose message is `Could not import URL (HTTP status)` and which carries `url` and `status` (`0` for network errors).

## Behaviour

- The file is fetched once per page. `<import-element>` tags and other calls for the same URL share the request.
- At most six imports per origin run at once.
- The file is parsed with `DOMParser` and never executed. Only `<custom-element>` elements are used.
- Unlike `<import-element>`, it does not log a warning on failure. Handle the rejection yourself.

## Related

- [Importing components: from JavaScript](/docs/importing/#from-javascript)
