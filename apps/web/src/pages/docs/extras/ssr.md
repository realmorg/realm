---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: Server-side Rendering
menuOrder: 1
title: On Server-side Rendering
author: Ribhararnus Pracutian
description: Opinionated thoughts on Server-side Rendering.
---

In the ever-evolving world of frontend software development, we've witnessed a significant shift over the years. We transitioned from the era of DOM manipulation using libraries like jQuery to the era of Single Page Applications (SPAs) crafted with popular frameworks such as Angular, React, and Vue. More recently, Server-Side Rendering (SSR) frameworks like Next.js, Nuxt, and SvelteKit have gained substantial traction. SSR offers advantages like enhanced performance and improved Search Engine Optimization (SEO) scores for websites.

However, SSR introduces its own set of complexities. It operates in a somewhat challenging landscape where JavaScript-built components need to be both hydrated and rendered twice to achieve interactivity.

SSR indeed involves a dual rendering process. The initial rendering occurs on the server, where the component is rendered to HTML and sent to the client. This first render ensures that content is available to search engines and offers faster initial page load times. However, this stage may not fully realize the interactivity and dynamic behavior of the component.

To achieve full interactivity, a second rendering occurs on the client side. Here, JavaScript code responsible for the component's functionality is executed, enabling it to become fully interactive and responsive to user interactions. This process, known as hydration, bridges the gap between server-rendered content and client-side interactivity.

While SSR's dual rendering process adds complexity, it provides benefits such as improved SEO and faster initial load times. Users can quickly access meaningful content, all while enjoying a rich and interactive experience once client-side rendering takes over.

However, it's essential to weigh the trade-offs and determine whether SSR aligns with your specific project goals and requirements. Understanding the intricacies of this dual rendering process empowers you to make informed decisions about when and how to utilize SSR in your applications, striking the right balance between SEO, performance, and interactivity.

As the developer behind Realm, you've taken a unique approach. In Realm, you've designed custom elements with the ability to render all necessary elements without relying on server-side processing. This approach eliminates the complexities and overhead typically associated with SSR.

By leveraging custom elements in Realm, you achieve client-side rendering without the need for additional server-side rendering. This approach streamlines development, reduces dependencies on server interactions, and results in improved performance and efficiency.

Additionally, you've carefully considered the SEO implications of using custom elements in Realm. To optimize SEO performance, it's recommended to ensure that your custom elements are not nested within other elements. Following this practice allows search engine crawlers to easily access and interpret the content within your custom elements, enhancing search engine visibility and indexing. For more details, refer to the <anchor-link href="/docs/learn/children">Children Rendering</anchor-link> section.

Through the utilization of custom elements in Realm and adherence to SEO best practices, you can create web applications that offer efficient rendering and SEO-friendly characteristics. The combination of client-side rendering and thoughtful design choices regarding the placement of custom elements contributes to a seamless user experience while ensuring excellent search engine visibility.

As you're aware, Realm utilizes the native DOM instead of a virtual DOM, taking us back to the era of direct DOM manipulation. However, it's crucial to note that DOM manipulation isn't inherently problematic; it's a matter of how it's used. In the past, inefficient DOM manipulation was common, but advancements in tooling and a shift toward a modular and component-based approach have improved the landscape.

This modern approach emphasizes reusability and declarative programming. As the father of Realm I'll says it loud: If it's a frontend, do it on the client-side.

Remember our motto: "Realm is designed for developers who prioritize fast product delivery."

So, go ahead and ship your product quickly, iterate as you go! Technology is a tool, and ultimately, customers care more about your product than the underlying code.
