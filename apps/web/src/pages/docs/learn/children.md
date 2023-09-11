---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 07. Children Rendering
menuOrder: 7
title: Rendering children of Custom Element
author: Ribhararnus Pracutian
description: Learn how to render children of Custom Element.
---

Let's delve into a new scenario. Imagine we need to develop a `<blog-post>` element containing a title, articles, and metadata such as author and date. It's crucial for this content to be accessible to search engines. In this scenario, we have two options:

1. Create an isolated custom element that encapsulates all the necessary elements within it.
2. Create a custom element that has the ability to render children.

The first option, while feasible, has limitations. Elements inside it may not be easily reused. Although attributes can enhance reusability to some extent, they won't allow for the rendering of HTML content. Moreover, this approach might not be favorable for search engine optimization (SEO) since search engines cannot access the content within the shadow DOM.

In the second option, we render the children of the custom element. This approach offers greater flexibility, enabling us to render HTML content and use the custom element as a wrapper for other elements.

So, how do we render children within a custom element? We can achieve this using the `<slot>` tag.

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
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
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

## The `<slot name>` Tag

The `<slot name>` tag is used to render children within a custom element that have a `slot` attribute. It acts as a placeholder where all children of the custom element will be rendered.

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
  <div slot="layout-a">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</div>
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

## The `<slot children>` Tag

The `<slot children>` tag is a special element that renders all children of the current custom element. Unlike the `<slot>` tag, it doesn't require a name. You can use it to render all children of the custom element. All children of the custom element will be rendered inside the `<slot children>` tag, except for those with a `slot` attribute.

You can also use the `<slot children>` tag to render nested children of the custom element. For example:

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

## The Truth About `<slot>` Tag

Under the hood, the `<slot>` tag within the Shadow DOM can only be slotted to a single node. In the provided example below, you will observe that the `<slot name>` tag renders only the last child of the custom element that has a `slot` attribute. This behavior aligns with the basic functionality of slots.

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

However, in Realm, the `<slot children>` tag behaves differently. It renders every child node of the custom element, but inside the Shadow DOM, only the first `<slot children>` tag can render it. The rest of the `<slot children>` tags will be ignored.

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
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
  <p>Sit amet consectetur adipisicing elit. Quisquam, quos.</p>
</slot-children-demo>
```

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

Learn about the original behavior of the slot in <anchor-link href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot" target="_blank">MDN: The Web Component Slot element</anchor-link>.

All tutorials until this page are basically enough to ship your product. But, we still have some more important things to learn.

## Element Composability

In other frameworks, you may have heard the term "composition" or "composable".. For example, you have a `<custom-dialog>` element that contains a title, content, and footer. In custom element, you can achieve this easily by using the `<slot>` tag.

```html
<custom-element name="custom-dialog">
  <element-attr name="is-open" type="boolean">false</element-attr>
  <element-attr name="title" type="string">Default Title</element-attr>
  <template>
    <dialog>
      <h1><slot name="@title"></slot></h1>
      <slot name="content"></title>
      <slot name="footer"></title>
    </dialog>
  </template>
</custom-element>

<custom-element name="custom-dialog-body">
  <template>
    <slot children></slot>
  </template>
</custom-element>


<custom-element name="custom-dialog-footer">
  <template>
    <slot name="save-button"></slot>
    <slot name="cancel-button"></slot>
  </template>
</custom-element>

<custom-dialog title="Hey!">
  <custom-dialog-body slot="content">
    <p>Any HTML tags</p>
  </custom-dialog-body>
  <custom-dialog-footer slot="footer">
    <button slot="save-button">Save</button>
    <button slot="cancel-button">Cancel</button>
  </custom-dialog-body>
</custom-dialog>
```

## What's next?

In our previous tutorial, we covered the fundamentals of <anchor-link href="/docs/learn/flow">Element Flow</anchor-link>. However, let's now consider a scenario where you have custom business logic that is slightly more intricate. It's not overly complex, but it does require a little more sophistication. In such cases, relying solely on `<element-flow>` may prove to be challenging or insufficient to meet your requirements.

Then <anchor-link href="/docs/learn/script">Custom Script Flow</anchor-link> is the answer. It's a powerful feature that allows you to write custom JavaScript code to handle your business logic.
