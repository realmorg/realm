---
layout: ../../../layouts/Docs.astro
menuGroup: references
menuTitle: http-request
menuOrder: 5
title: "Action: http-request"
author: Ribhararnus Pracutian
description: The `http-request` action reference.
---

The `http-request` action tag is used to send an HTTP request to the server. It is a wrapper of the `fetch` API with basic features. If you want to use more advanced features, you can use the `fetch` API directly inside the `<script type="module/realm>` tag.

The `response-ok` or `response-fail` sub-action tag is required to handle the response of the request. If you don't provide any of them, the request will be ignored.

<ref-section title="Attributes">
  <ref-item-def name="url">
    The URL of the request.
  </ref-item-def>
  <ref-item-def name="method">
    The HTTP method of the request, e.g `GET`, `POST`, `PUT`, `DELETE`, etc.
  </ref-item-def>
  <ref-item-def name="as">
    The response data type, it can be `json`, `text`, or `html`.
  </ref-item-def>
</ref-section>

<ref-section title="Sub Actions">
  <ref-item-def name="request-header">
    Reference link: <anchor-link href="/references/actions/request-header">&lt;request-header&gt;</anchor-link>
  </ref-item-def>
  <ref-item-def name="request-body">
    Reference link: <anchor-link href="/references/actions/request-body">&lt;request-body&gt;</anchor-link>
  </ref-item-def>
  <ref-item-def name="response-ok">
    Reference link: <anchor-link href="/references/actions/response-ok">&lt;response-ok&gt;</anchor-link>
  </ref-item-def>
  <ref-item-def name="response-fail">
    Reference link: <anchor-link href="/references/actions/response-fail">&lt;request-fail&gt;</anchor-link>
  </ref-item-def>
</ref-section>

<ref-section title="Example">
  See example on <anchor-link href="/docs/learn/http-request">Learn HTTP Request</anchor-link> page.
</ref-section>
