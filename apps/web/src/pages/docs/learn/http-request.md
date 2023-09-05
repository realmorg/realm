---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 14. HTTP Request
menuOrder: 14
title: HTTP Request in Action
author: Ribhararnus Pracutian
description: Learn how to make simple HTTP request in Realm.
---

In Realm, you have access to a simple HTTP request tag that allows you to make HTTP requests. This functionality is similar to the `fetch` API in JavaScript, providing a convenient way to interact with remote servers and retrieve data.

Using the HTTP request tag in Realm, you can specify the URL of the resource you want to fetch and configure options such as request headers, request method (GET, POST, etc.), and request body data. Once the request is made, you can handle the response and process the data as needed.

Here is an example of using the HTTP request tag in Realm:

```html
<custom-element name="http-req-example">
  <element-state name="content" type="html"></element-state>
  <element-state name="error" type="string"></element-state>
  <element-state name="is-fetching" type="boolean">false</element-state>

  <element-flow>
    <trigger-event click="FetchButton">
      <set-state name="is-fetching" value="true"></set-state>
      <http-request url="https://realm.codes/api-examples/api.html" method="GET">
        <response-ok>
          <set-state name="content" from="event"></set-state>
          <set-state name="is-fetching" value="false"></set-state>
        </response-ok>
        <response-fail>
          <set-state name="error" value="$.message" from="event"></set-state>
          <set-state name="is-fetching" value="false"></set-state>
        </response-fail>
      </http-request>
    </trigger-event>
  </element-flow>

  <template>
    <button ref="FetchButton">Fetch data</button>
    <is-visible value="#is-fetching" eq="true">
      Fetching...
    </is-visible>
    <is-hidden value="#is-fetching" eq="true">
      <div>Response: <slot name="#content"></slot></div>
      <div>Error: <slot name="#error"></slot></div>
    </is-hidden>
  </template>
</custom-element>

<http-req-example></http-req-example>
```

<import-element from="https://realm.codes/elements/basic-counter.html"></import-element>

<custom-element name="http-req-example">
  <element-state name="content" type="html"></element-state>
  <element-state name="error" type="string"></element-state>
  <element-state name="is-fetching" type="boolean">false</element-state>

  <element-flow>
    <trigger-event click="FetchButton">
      <set-state name="is-fetching" value="true"></set-state>
      <http-request url="https://realm.codes/api-examples/api.html" method="GET">
        <response-ok>
          <set-state name="content" from="event"></set-state>
          <set-state name="is-fetching" value="false"></set-state>
        </response-ok>
        <response-fail>
          <set-state name="error" value="$.message" from="event"></set-state>
          <set-state name="is-fetching" value="false"></set-state>
        </response-fail>
      </http-request>
    </trigger-event>
  </element-flow>

  <template>
    <button ref="FetchButton">Fetch data</button>
    <is-visible value="#is-fetching" eq="true">
      Fetching...
    </is-visible>
    <is-hidden value="#is-fetching" eq="true">
      <div>Response: <slot name="#content"></slot></div>
      <div>Error: <slot name="#error"></slot></div>
    </is-hidden>
  </template>
</custom-element>

<realm-demo>
  <http-req-example></http-req-example>
</realm-demo>

Wait, we have element's state with type `html` here? Yes, I'm inspired by <anchor-link href="https://htmx.org" target="_blank">HTMX</anchor-link>, anyway...

As you can see there's `<request-ok>` and `<request-fail>` tag inside `<http-request>` tag. These tags are called **response handler**. You can use it to handle the response from the server. The response handler is a child tag of `<http-request>` tag, and it's only available inside `<http-request>` tag.

You must define at least one response handler whether it's success `<response-ok>` or failure `<response-fail>`. If you don't define any response handler, the HTTP request will be ignored.

## HTTP Request Headers

To define HTTP headers, you can use `<request-header>` tag inside `<http-request>` tag. And you can add multiple `<request-header>` tags.

```html
<custom-element name="fetching-example">
  <!-- ... -->
  <http-request url="https://api.url">
    <request-header name="Content-Type" value="application/json"></request-header>
    <request-header name="X-API" value="xxxxxxxxxxxxx"></request-header>
  </http-request>
  <!-- ... -->
</custom-element>
```
