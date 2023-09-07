---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: response-fail
menuOrder: 5.3
title: "Action: response-fail"
author: Ribhararnus Pracutian
description: The `response-fail` response handler action reference.
---

The `response-fail` sub-action tag is used to handle the response of the <anchor-link href="/references/actions/http-request">`<http-request>`</anchor-link> action when the response fails.

It doesn't have any attributes, the content of this tag is another action, and will be invoked, it has same behaviors when we use the <anchor-link href="/references/flows/trigger-event">`<trigger-event>`</anchor-link> tag.

We can use data source selector to get the response error message, by using `$.message` selector.

<ref-section title="Example">
  See how to use this action tag on <anchor-link href="/docs/learn/http-request">Learn HTTP Request</anchor-link> page.
</ref-section>
