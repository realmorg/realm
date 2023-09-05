---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 09. Reusability
menuOrder: 9
title: Custom Element Reusability
author: Ribhararnus Pracutian
description: Learn how to reuse custom elements across the web.
---

You've already learned the basics of Realm. In our previous tutorial, we created a custom element that could be reused within a page. But what if we want to reuse it on multiple pages? Well, here's where the `<import-element>` tag comes into play.

Imagine having numerous pages where we need to define the same custom element repeatedly. It's not very efficient, is it? Thankfully, Realm provides a solution. We can define the custom element once and then reuse it across all of our pages, saving time and effort. This approach simplifies code management and enhances productivity when working with multiple pages.

For example we will import `basic-counter` element from Realm's domain: <anchor-link href="https://realm.codes/elements/basic-counter.html">https://realm.codes/elements/basic-counter.html</anchor-link>

```html
<import-element from="https://realm.codes/elements/basic-counter.html"></import-element>

<basic-counter></basic-counter>
<basic-counter></basic-counter>
<basic-counter></basic-counter>
```

<import-element from="https://realm.codes/elements/basic-counter.html"></import-element>
<realm-demo>
  <basic-counter></basic-counter>
  <basic-counter></basic-counter>
  <basic-counter></basic-counter>
</realm-demo>

## Development Mode

In our first tutorial, we explored how to use Realm without the need for setting up a localhost. However, when we want to use the `<import-element>` tag, you'll need to set up a localhost environment. This is because the usage of `<import-element>` can encounter issues related to the Cross-Origin Resource Sharing (CORS) policy.

To dive deeper into CORS and understand its implications, you can refer to the following resource: <anchor-link href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" target="_blank">MDN: Cross-Origin Resource Sharing (CORS)</anchor-link>. It provides valuable insights into how cross-origin requests are handled and the policies involved. By familiarizing yourself with CORS, you'll gain a better understanding of how to navigate and resolve any potential issues that might arise when using the `<import-element>` tag.

## Import Element Accross the Web

Unlike other frameworks that rely on package managers for importing elements and utilizing pre-built components, Realm takes a different approach. It leverages the `<import-element>` tag, eliminating the need for bundlers or compiler tools. With Realm, you can directly import and work with someone else's or your own custom elements without complicated setup processes.

To make this seamless integration possible, if you're a third-party developer or even if you wish to share your own public elements, it's essential to enable Cross-Origin Resource Sharing (CORS) on your server. By setting up CORS, you allow the browser to make requests to your server from different origins, enabling the smooth retrieval and utilization of imported elements in Realm. This setup ensures that your custom elements can be easily integrated and utilized across different projects and environments.

Take a look at the following example:

```html
<!-- https://domain-abc.tld/elements/custom-dialog.html -->
<custom-element name="custom-dialog">
  <element-attr name="is-open" type="boolean">false</element-attr>

  <template>
    <!-- <dialog> element here -->
  </template>
</custom-element>

<!-- https://domain-xyz.tld -->
<import-element from="https://domain-xyz.abc/elements/custom-dialog.html"></import-element>

<custom-element name="show-alert">
  <element-state name="is-open" type="boolean">false</element-state>
  <element-flow>
    <trigger-event click="ShowDialogBtn">
      <set-state name="is-open" value="true"></set-state>
    </trigger-event>
  </element-flow>
  <template>
    <button ref="ShowDialogBtn">Show Dialog</button>
    <custom-dialog _is-open="#is-open"></custom-dialog>
  </template>
</custom-element>

<show-alert></show-alert>
```


## Import Element Alias

Sometimes, developers may come up with less-than-desirable names for their custom elements, or there might be a need to use the same element with different names in different contexts. In such cases, Realm provides a solution through the use of the `as` attribute. This attribute allows you to assign a new name to the element, providing more flexibility and control over how it is referenced and used within your code.

By utilizing the `as` attribute, you can easily give an element a new, more suitable name that aligns with your project's naming conventions or specific requirements. This feature enables better organization, readability, and maintainability of your code, making it easier to work with custom elements in Realm.

```html
<import-element
  from="https://realm.codes/elements/basic-counter.html"
  as="good-counter">
</import-element>

<good-counter></good-counter>
<good-counter></good-counter>
<good-counter></good-counter>
```

<import-element from="https://realm.codes/elements/basic-counter.html" as="good-counter"></import-element>

<realm-demo>
  <good-counter></good-counter>
  <good-counter></good-counter>
  <good-counter></good-counter>
</realm-demo>

## What's Next?
Hurray, It's time for styling parts, let's go to the next tutorial: <anchor-link href="/docs/learn/css">Dynamic Styles</anchor-link>.
