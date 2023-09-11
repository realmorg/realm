---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 09. Reusability
menuOrder: 9
title: Custom Element Reusability
author: Ribhararnus Pracutian
description: Learn how to reuse custom elements across the web.
---

You've already acquired the fundamental knowledge of Realm. In our previous tutorial, we delved into creating a custom element that could be reused within a single page. However, what if we want to extend its usability across multiple pages? This is where the `<import-element>` tag becomes invaluable.

Picture this scenario: you have numerous pages where you need to define the same custom element repeatedly. It's not the most efficient process, right? Thankfully, Realm offers a solution. We can define the custom element once and then seamlessly reuse it across all our pages, saving us precious time and effort. This approach streamlines code management, greatly enhancing productivity, especially when dealing with multiple pages.

In the following example, we'll demonstrate how to import a `basic-counter` element directly from Realm's domain:  
<anchor-link href="https://realm.codes/elements/basic-counter.html">https://realm.codes/elements/basic-counter.html</anchor-link>

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

In our initial tutorial, we explored how to use Realm without the need for setting up a localhost. However, when utilizing the `<import-element>` tag, setting up a localhost environment becomes necessary. This requirement arises due to potential issues related to the Cross-Origin Resource Sharing (CORS) policy.

To delve deeper into CORS and comprehend its implications, you can refer to the following resource: <anchor-link href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" target="_blank">MDN: Cross-Origin Resource Sharing (CORS)</anchor-link>. This resource provides valuable insights into how cross-origin requests are handled and the policies involved. Familiarizing yourself with CORS will equip you with the knowledge to navigate and resolve any potential issues that may arise when using the `<import-element>` tag.

If you have NodeJS installed on your machine, you can serve your current folder using the `npx serve` command.

For Python users, you can serve your current folder with the `python -m http.server` command.

Other programming languages may have their own methods for serving a folder, which you can also use.

Alternatively, you can employ online tools like <anchor-link href="https://codesandbox.io" target="_blank">CodeSandbox</anchor-link> or <anchor-link href="https://stackblitz.com/" target="_blank">StackBlitz</anchor-link>.

## Importing Elements Across the Web

Realm takes a unique approach compared to other frameworks that rely on package managers for importing elements and utilizing pre-built components. Realm leverages the `<import-element>` tag, eliminating the need for bundlers or compiler tools. With Realm, you can directly import and work with custom elements, whether created by someone else or yourself, without intricate setup processes.

To facilitate this seamless integration, whether you're a third-party developer or wish to share your public elements, enabling Cross-Origin Resource Sharing (CORS) on your server is essential. Configuring CORS allows the browser to make requests to your server from various origins, ensuring the smooth retrieval and utilization of imported elements in Realm. This setup guarantees that your custom elements can be effortlessly integrated and utilized across diverse projects and environments.

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

The `domain-abc.tld` is a 3rd-party developer that provides a custom dialog element, and the `domain-xyz.tld` is a developer who wants to use it. We don't need to copy-paste someone else's code; we can simply import it.

## Security Considerations

When importing an element from a third-party developer, it's crucial to ensure the element's safety for use in your project. You should review the element's source code to verify that it doesn't contain any malicious code or potential security vulnerabilities. If you have any doubts about the element's safety, you can always create your own custom element with similar functionality, giving you greater control over its security.

## Import Element Aliasing

In some cases, developers may choose less-than-desirable names for their custom elements, or there might be a need to use the same element with different names in various contexts. Realm provides a solution through the use of the `as` attribute. This attribute allows you to assign a new name to the imported element, offering enhanced flexibility and control over how it is referenced and used within your code.

By leveraging the `as` attribute, you can easily provide an element with a new, more fitting name that aligns with your project's naming conventions or specific requirements. This feature promotes better organization, readability, and maintainability of your code, simplifying the process of working with custom elements in Realm.

```html
<import-element from="https://realm.codes/elements/basic-counter.html" as="good-counter"></import-element>

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

Hurray, it's time to delve into the world of styling! In the next tutorial, we'll explore how to apply dynamic styles to your custom elements. Get ready to enhance the visual appeal and interactivity of your Realm apps with <anchor-link href="/docs/learn/css">Dynamic Styles</anchor-link>.
