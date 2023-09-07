---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: Shadow DOM Styling
menuOrder: 2
title: Styling Inside Shadow DOM
author: Ribhararnus Pracutian
description: WIP.
---

When defining a custom element using the `<custom-element>` tag, it triggers the underlying `customElements.define()` method, which registers the custom element in the browser. As part of this process, a shadow DOM is attached to the custom element, providing encapsulation and isolation for its styling.

Styling within the isolated world of the shadow DOM can sometimes give us challenges. The encapsulation ensures that styles defined within the shadow DOM do not leak out and affect other elements on the page. However, it also means that applying styles from the outside can be more difficult.

To style elements within the shadow DOM, you typically need to use CSS selectors and apply styles using the `::slotted()` pseudo-element or by utilizing CSS variables that are exposed by the custom element.

While writing styles within the isolated world of the shadow DOM can be more complex compared to styling regular HTML elements, it provides the benefit of encapsulation and prevents conflicts with other parts of the page's styling.

By understanding the intricacies of working with the shadow DOM and utilizing CSS selectors and variables effectively, you can overcome the challenges of styling within the isolated world of custom elements.

## Using CSS Variables

CSS variables within the shadow DOM can be inherited from the owner document, starting from the html tag and propagating through the depth of the shadow DOM tree. This inheritance mechanism allows you to define and reuse CSS variables at higher levels within the document hierarchy.

To avoid repetitive work and streamline your styling process, you can leverage CSS utility libraries like <anchor-link href="https://open-props.style/" target="_blank">OpenProps</anchor-link>. OpenProps provides a set of CSS utilities and custom properties that you can use to enhance your styling workflow. By utilizing OpenProps, you can tap into a collection of pre-defined CSS variables and utilities, which can be easily applied to your custom elements within the shadow DOM.

These CSS utilities and variables offered by OpenProps can help you achieve consistent and reusable styles across your custom elements, saving you time and effort in writing repetitive code. They provide a convenient way to manage and apply styles within the isolated world of the shadow DOM, ensuring consistency and efficiency in your development process.

## Using `:host` Pseudo-Class Selector

By using the :host selector, you can define styles within the shadow DOM that will be applied to the custom element itself. Here's an example of how you can use the `:host` selector to apply a background color to the custom element:

```css
:host {
  background-color: #f0f0f0;
}
```

In this example, the background-color property is applied directly to the custom element represented by the `:host` selector. You can customize the color value to suit your design preferences.

By leveraging the `:host` selector, you can conveniently and efficiently style the custom element itself from within the shadow DOM, without the need for additional wrapper elements. This allows you to keep your code concise and maintain a clean and encapsulated styling approach for your custom elements.
