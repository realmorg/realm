---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: Server-side Rendering
menuOrder: 1
title: On Server-side Rendering
author: Ribhararnus Pracutian
description: Opinionated thoughts on Server-side Rendering.
---

As frontend software development evolves, we have witnessed a shift from the era of DOM manipulation with libraries like jQuery to Single Page Applications (SPAs) built with frameworks such as Angular, React, and Vue. More recently, Server-Side Rendering (SSR) frameworks like Next.js, Nuxt, and SvelteKit have gained significant popularity. SSR offers advantages such as improved performance and better Search Engine Optimization (SEO) scores for websites.

SSR as a somewhat challenging world where components, built with JavaScript, need to be hydrated and rendered twice to achieve interactivity.

Indeed, SSR involves a dual rendering process. The first render occurs on the server, where the component is rendered to HTML and sent to the client. This initial render ensures that the content is available to search engines and provides faster initial page load times. However, the interactivity and dynamic behavior of the component may not be fully realized at this stage.

To achieve interactivity, a second render takes place on the client side. The JavaScript code responsible for the component's functionality is executed, allowing the component to be fully interactive and responsive to user interactions. This process, known as hydration, bridges the gap between the server-rendered content and the client-side interactivity.

While SSR with its dual rendering process may introduce additional complexity, it offers benefits like improved SEO and initial load times. It allows users to access meaningful content quickly, while still providing a rich and interactive experience once the client-side rendering takes place.

It's important to consider the trade-offs and decide if SSR aligns with your specific goals and requirements. By understanding the intricacies of the dual rendering process, you can make informed decisions about when and how to leverage SSR in your applications, striking the right balance between SEO, performance, and interactivity.

As the developer of Realm, you hold the belief that Server-Side Rendering (SSR) is not necessary for us. In Realm, you have designed custom elements that have the ability to render all the required elements without relying on server-side processing. This approach offers the advantage of avoiding the complexities and overhead associated with SSR.

By utilizing custom elements in Realm, you can achieve client-side rendering without the need for additional server-side rendering. This allows for a more streamlined development process and reduces dependencies on server interactions, resulting in improved performance and efficiency.

Additionally, you have taken into consideration the SEO implications of using custom elements in Realm. It's important to note that for optimal SEO performance, it is recommended to ensure that your custom elements are not nested within other elements. By following this practice, search engine crawlers can easily access and interpret the content within your custom elements, enhancing search engine visibility and indexing. See <anchor-link href="/docs/learn/children">Children Rendering</anchor-link>.

Through the utilization of custom elements in Realm and adhering to SEO best practices, you can create web applications that offer both efficient rendering and SEO-friendly characteristics. The combination of client-side rendering and mindful design choices regarding the placement of custom elements can contribute to a seamless user experience while ensuring good search engine visibility.

As you knew Realm is utilizing the native DOM instead of a virtual DOM, bringing us back to the era of direct DOM manipulation. So, it's kind of useless to use SSR in Realm.

But DOM manipulation is not as bad as it sounds. It's just a matter of how you use it. In the past, we used to do DOM manipulation in a very inefficient way. However, we have seen significant advancements in tooling and a more evolved mindset since then. With improved Web Standards, we now have better support for efficient DOM manipulation.

Our mindset has also shifted towards a modular and component-based approach, focusing on reusability and declarative programming.

As the father of Realm I'll says it loud: If it's a frontend, do it on the client-side.

Remember our slogan: "Realm is designed for developers who prioritize fast product delivery."

So, ship your product faster, ship it until you make it! Technology is just a tool, at the end customer won't care about your code, they care about your product.
