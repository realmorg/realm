---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 07. Children Rendering
menuOrder: 7
title: Rendering children of Custom Element
author: Ribhararnus Pracutian
description: Learn how to render children of Custom Element.
---

Alright, let's consider a new case. We want to develop a `<blog-post>` element that consists of a title, articles, and metadata like author and date. It's crucial for this content to be crawlable by search engines. In this scenario, we have two options:

1. Create an isolated custom element that encapsulates all the necessary elements within it.
2. Create a custom element that has the ability to render children.

The first option, although feasible, is not ideal because the elements inside it cannot be easily reused. While attributes can be used to achieve some level of reusability, it won't allow for the rendering of HTML content. Additionally, this approach may not be favorable for search engine optimization (SEO) since search engines cannot access the content within the shadow DOM.

In the second option, we will render the children of custom element. This approach is more flexible and allows us to render HTML content. It also allows us to use the custom element as a wrapper for other elements.

Then how do we render children of custom element? We can use `<slot>` tag to render children of custom element.

```html
<custom-element name="blog-post">
  <template>
    <slot name="title"></slot>
    <slot children></slot>
    <div>
      by
      <slot name="author"></slot>
    </div>
  </template>
</custom-element>

<blog-post>
  <h1 slot="title">Hello world!</h1>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
  </p>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
  </p>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
  </p>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
  </p>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
  </p>
  <div slot="author">R. Pracutian</div>
</blog-post>
```

<custom-element name="blog-post">
  <template>
    <slot name="title"></slot>
    <slot children></slot>
    <div>by <slot name="author"></slot></div>
  </template>
</custom-element>

<realm-demo>
  <blog-post>
    <h1 slot="title">Hello world!</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
    <span slot="author">R. Pracutian</span>
  </blog-post>
</realm-demo>

## The `<slot name>` tag

The `<slot name>` tag is rendering children of custom element that have a `slot` attribute. All children of custom element will be rendered inside `<slot name>` tag.

```html
<custom-element name="article-layout">
  <template>
    <div>
      <slot name="layout-a"></slot>
    </div>
    <div>
      <slot name="layout-b"></slot>
    </div>
  </template>
</custom-element>

<article-layout>
  <div slot="layout-a">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
  </div>
  <div slot="layout-b">Sidebar thing!</div>
</article-layout>
```

<custom-element name="article-layout">
  <template>
    <div>
      <slot name="layout-a"></slot>
    </div>
    <div>
      <slot name="layout-b"></slot>
    </div>
  </template>
</custom-element>

<realm-demo>
  <article-layout>
    <div slot="layout-a">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
    </div>
    <div slot="layout-b">
      Sidebar thing!
    </div>
  </article-layout>
</realm-demo>

## The `<slot children>` tag

The `<slot children>` tag is a special element that renders all children of the current custom element. It's similar with `<slot>` tag, but it doesn't need a name. You can use it to render all children of custom element. All children of custom element will be rendered inside `<slot children>` tag, except the children that have a `slot` attribute.

We can render nested children of custom element with `<slot children>` tag. For example:

```html
<custom-element name="abc-element">
  <template>
    I am, abc.
    <slot children></slot>
  </template>
</custom-element>

<custom-element name="xyz-element">
  <template>
    Yo, I am xyz.
    <slot children></slot>
  </template>
</custom-element>

<custom-element name="alphabet-element">
  <template>
    <slot children></slot>
  </template>
</custom-element>

<alphabet-element>
  <abc-element>
    <xyz-element>
      <p>Hi, I am the last children</p>
    </xyz-element>
  </abc-element>
</alphabet-element>
```

<custom-element name="abc-element">
  <template>
    I am, abc. <slot children></slot>
  </template>
</custom-element>

<custom-element name="xyz-element">
  <template>
    Yo, I am xyz. <slot children></slot>
  </template>
</custom-element>

<custom-element name="alphabet-element">
  <template>
    <slot children></slot>
  </template>
</custom-element>

<realm-demo>
  <alphabet-element>
    <abc-element>
      <xyz-element>
        Hi, I am the last children
      </xyz-element>
    </abc-element>
  </alphabet-element>
</realm-demo>

## The truth about `<slot>` tag

Under the hood, the `<slot>` tag within the Shadow DOM can only be slotted to a single node. In the provided example below, you will observe that the `<slot name>` tag renders only the last child of the custom element that has a slot attribute. This behavior aligns with the basic functionality of slots.

```html
<custom-element name="slot-name-demo">
  <template>
    Hi,
    <slot name="layout-a"></slot>
    . Yo,
    <slot name="layout-a"></slot>
    .
  </template>
</custom-element>

<slot-name-demo>
  <div slot="layout-a">This won't be rendered!</div>
  <div slot="layout-a">This will be choosen one and will be rendered!</div>
</slot-name-demo>
```

<custom-element name="slot-name-demo">
  <template>
    Hi, <slot name="layout-a"></slot>.
    Yo, <slot name="layout-a"></slot>.
  </template>
</custom-element>

<realm-demo>
  <slot-name-demo>
    <div slot="layout-a">
      This won't be rendered!
    </div>
    <div slot="layout-a">
      This will be choosen one and will be rendered!
    </div>
  </slot-name-demo>
</realm-demo>

However, in Realm, the `<slot children>` tag behaves differently. It renders every child nodes of the custom element, but inside the Shadow DOM, only the first `<slot children>` that can render it. The rest of `<slot children>` will be ignored.

````html
```html
<custom-element name="slot-children-demo">
  <template>
    <div>
      Children:
      <slot children></slot>
    </div>
    <div>
      Another children:
      <slot children></slot>
    </div>
  </template>
</custom-element>

<slot-children-demo>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
  </p>
  <p>Sit amet consectetur adipisicing elit. Quisquam, quos.</p>
</slot-children-demo>
````

<custom-element name="slot-children-demo">
  <template>
    <div>Children: <slot children></slot></div>
    <div>Another children: <slot children></slot></div>
  </template>
</custom-element>

<realm-demo>
  <slot-children-demo>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
    <p>Sit amet consectetur adipisicing elit. Quisquam, quos.</p>
  </slot-children-demo>
</realm-demo>

So, please use `<slot>` tag wisely. If you intend to render multiple children within a custom element, use the `<slot children>` tag. On the other hand, if you specifically want to render a particular section of the children within the custom element, use the `<slot name>` tag. By leveraging these tags appropriately, you can achieve the desired rendering behavior in your custom elements.

Learn about the original behavior of slot in <anchor-link href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot" target="_blank">MDN: The Web Component Slot element</anchor-link>

All learning materials until this page is basically enough to ship your product. But, we still have some more important things to learn.

## What's next?

In our previous tutorial, we covered the fundamentals of <anchor-link href="/docs/learn/flow">Element Flow</anchor-link>. However, let's now consider a scenario where you have custom business logic that is slightly more intricate. It's not overly complex, but it does require a little more sophistication. In such cases, relying solely on `<element-flow>` may prove to be challenging or insufficient to meet your requirements.

Then <anchor-link href="/docs/learn/script">Custom Script Flow</anchor-link> is the answer. It's a powerful feature that allows you to write custom JavaScript code to handle your business logic.
