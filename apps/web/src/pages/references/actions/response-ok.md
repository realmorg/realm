---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: response-ok
menuOrder: 5.2
title: "Action: response-ok"
author: Ribhararnus Pracutian
description: The `response-ok` response handler action reference.
---

The `response-ok` sub-action tag is used to handle the response of the <anchor-link href="/references/actions/http-request">`<http-request>`</anchor-link> action when the response status is `200 OK`.

It doesn't have any attributes, the content of this tag is another action, and will be invoked, it has same behaviors when we use the <anchor-link href="/references/flows/trigger-event">`<trigger-event>`</anchor-link> tag.

<ref-section title="Example">
  See how to use this action tag on <anchor-link href="/docs/learn/http-request">Learn HTTP Request</anchor-link> page.
</ref-section>
