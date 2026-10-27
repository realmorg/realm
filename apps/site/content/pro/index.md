---
title: REALM Pro
seoTitle: REALM Pro · Web component UI kit, blocks and templates
description: Premium web components for REALM: data grid, date range picker, flipbook, {{pro:blocks}} UI blocks, {{pro:layouts}} page templates, {{pro:themes}} themes. Pay once.
layout: landing
nav: REALM Pro
---

<link rel="stylesheet" href="{{root}}assets/pro.css">

<section class="pro-hero">
<div class="pro-wrap pro-hero-copy">
<a class="pro-status" href="#roadmap"><span class="pro-status-dot" aria-hidden="true"></span>Early access · {{pro:total}} items ready</a>
<h1>Web components, UI blocks and page templates for REALM</h1>
<p class="pro-lead">REALM Pro is a UI kit for <a href="{{root}}docs/">REALM</a>: a data grid, a date range picker and a flipbook component, {{pro:blocks}} UI blocks, {{pro:layouts}} responsive page templates and {{pro:themes}} themes built on design tokens. Each item is an accessible, framework-free custom element in one HTML file, with light and dark mode. Copy it into your project and load it with one tag.</p>
<div class="pro-actions">
<a class="action primary" href="https://buy.polar.sh/polar_cl_LGiAIgKHE9dVha4DOPmnF8UnAL8r6P0JDtOl81VgV0b">Get early access, $149 <u-icon name="arrow-right"></u-icon></a>
<a class="action outline" href="#catalogue"><u-icon name="layout-grid"></u-icon> Browse the catalogue</a>
</div>
<p class="pro-trust">Pay once · 14-day refund · REALM stays MIT</p>
</div>
<div class="pro-wall" aria-label="Screens built with REALM Pro">
<div class="pro-wall-row">
<img src="{{root}}pro/landing/wall/pro-dashboard-sidebar-analytics.webp" alt="Analytics dashboard layout with revenue chart and sidebar" width="960" height="600" decoding="async">
<img src="{{root}}pro/landing/wall/pro-pricing-three-tiers.webp" alt="Pricing block with three plans" width="960" height="600" decoding="async">
<img src="{{root}}pro/landing/wall/pro-sign-in-split-social.webp" alt="Split sign-in page with a brand panel" width="960" height="600" decoding="async">
<img src="{{root}}pro/landing/wall/pro-data-table-tabs-card.webp" alt="Invoices table with status tabs and row actions" width="960" height="600" decoding="async">
<img src="{{root}}pro/landing/wall/pro-settings-profile-columns.webp" alt="Profile settings form" width="960" height="600" decoding="async">
<img src="{{root}}pro/landing/wall/pro-hero-split-mock.webp" alt="Marketing hero with a product mock" width="960" height="600" decoding="async">
</div>
<div class="pro-wall-row reverse">
<img src="{{root}}pro/landing/wall/pro-billing-usage-card.webp" alt="Billing usage meters" width="960" height="600" decoding="async">
<img src="{{root}}pro/landing/wall/pro-activity-days.webp" alt="Activity feed grouped by day" width="960" height="600" decoding="async">
<img src="{{root}}pro/landing/wall/pro-team-table.webp" alt="Team members table with roles" width="960" height="600" decoding="async">
<img src="{{root}}pro/landing/wall/pro-features-bento.webp" alt="Bento grid of product features" width="960" height="600" decoding="async">
<img src="{{root}}pro/landing/wall/pro-onboarding-checklist.webp" alt="Onboarding checklist with progress" width="960" height="600" decoding="async">
<img src="{{root}}pro/landing/wall/pro-docs-guide.webp" alt="Three-column documentation page" width="960" height="600" decoding="async">
</div>
</div>
</section>

<section class="pro-band" aria-labelledby="components">
<div class="pro-wrap">
<header class="pro-head">
<h2 id="components">{{pro:components}} components teams usually buy as separate libraries</h2>
<p>Data grids, date pickers, flipbooks and the other widgets below are usually sold as paid add-ons for React, Vue or jQuery. In REALM Pro they are framework-free web components that read your design tokens, so they match the rest of your interface.</p>
</header>
<div class="pro-feature">
<figure class="pro-video">
<video src="{{root}}pro/landing/video/pro-data-grid.mp4" poster="{{root}}pro/landing/video/pro-data-grid.webp" width="1280" height="720" muted loop playsinline autoplay preload="none" aria-label="The data grid scrolling 100,000 orders, sorting by total and searching"></video>
</figure>
<div class="pro-feature-copy">
<code class="pro-tag">&lt;pro-data-grid&gt;</code>
<h3>Data grid</h3>
<p>Virtual scrolling renders only the rows on screen, so a table of 100,000 rows scrolls at about 7 ms of work per frame.</p>
<ul class="pro-checks">
<li>Sort, multi-sort, column filters and search across columns</li>
<li>Resize, reorder, pin and hide columns</li>
<li>Row selection that submits with a form</li>
<li>Edit cells in place, export what is on screen to CSV</li>
<li>Keyboard navigation following the ARIA grid pattern</li>
<li>Rows from a property or from your server, page by page</li>
</ul>
</div>
</div>
<div class="pro-feature reverse">
<figure class="pro-video">
<video src="{{root}}pro/landing/video/pro-date-range-picker.mp4" poster="{{root}}pro/landing/video/pro-date-range-picker.webp" width="1280" height="720" muted loop playsinline autoplay preload="none" aria-label="Choosing a date range in the date range picker"></video>
</figure>
<div class="pro-feature-copy">
<code class="pro-tag">&lt;pro-date-range-picker&gt;</code>
<h3>Date range picker</h3>
<p>A two-month calendar with presets such as Last 30 days. It is a form control: the selected range submits as <code>2026-10-01/2026-10-14</code>.</p>
<ul class="pro-checks">
<li>Month and weekday names, and the first day of the week, from the reader's language</li>
<li>Minimum and maximum dates, and blocked days</li>
<li>Keyboard support following the ARIA date picker pattern</li>
<li>Popover or inline, one month on phones</li>
</ul>
</div>
</div>
<div class="pro-feature">
<figure class="pro-video">
<video src="{{root}}pro/landing/video/pro-flipbook.mp4" poster="{{root}}pro/landing/video/pro-flipbook.webp" width="1280" height="720" muted loop playsinline autoplay preload="none" aria-label="Turning the pages of a catalogue in the flipbook"></video>
</figure>
<div class="pro-feature-copy">
<code class="pro-tag">&lt;pro-flipbook&gt;</code>
<h3>Flipbook</h3>
<p>A page-flip component for catalogues, magazines and brochures written in HTML. The page curls with the pointer, casts a shadow along the fold and returns if you let go early.</p>
<ul class="pro-checks">
<li>One page or a two-page spread, chosen by width</li>
<li>Hard covers, thumbnails, zoom and full screen</li>
<li>Arrow keys, swipe, and links to a page such as <code>#page=5</code></li>
<li>A plain slide when the reader asks for reduced motion</li>
</ul>
</div>
</div>
<h3 class="pro-subhead">Every component in REALM Pro</h3>
<!-- pro-components -->
</div>
</section>

<section class="pro-band muted" id="catalogue" aria-labelledby="catalogue-title">
<div class="pro-wrap">
<header class="pro-head">
<h2 id="catalogue-title">What is included in REALM Pro?</h2>
<p>{{pro:total}} items. UI blocks are page sections such as a pricing table, a sign-in form or a stats row. Page templates combine blocks into complete screens. Every item follows your theme and supports light and dark mode.</p>
</header>
<dl class="pro-numbers">
<div><dt>Components</dt><dd>{{pro:components}}</dd></div>
<div><dt>UI blocks</dt><dd>{{pro:blocks}}</dd></div>
<div><dt>Page templates</dt><dd>{{pro:layouts}}</dd></div>
<div><dt>Themes</dt><dd>{{pro:themes}}</dd></div>
</dl>
<!-- pro-catalogue -->
</div>
</section>

<section class="pro-band" aria-labelledby="layouts">
<div class="pro-wrap">
<header class="pro-head">
<h2 id="layouts">Responsive page templates</h2>
<p>Admin dashboards, settings pages, sign-in and sign-up flows, landing pages and documentation. Each template adapts from a 390px phone to a wide desktop, and adding one to a project copies the blocks it uses.</p>
</header>
<div class="pro-layouts">
<figure>
<div class="pro-frames">
<img class="desktop" src="{{root}}pro/landing/layouts/pro-dashboard-sidebar-orders-desktop.webp" alt="Orders dashboard on a desktop screen" width="1440" height="900" loading="lazy" decoding="async">
<img class="phone" src="{{root}}pro/landing/layouts/pro-dashboard-sidebar-orders-phone.webp" alt="The same dashboard on a phone" width="390" height="844" loading="lazy" decoding="async">
</div>
<figcaption>Dashboard with an orders table</figcaption>
</figure>
<figure>
<div class="pro-frames">
<img class="desktop" src="{{root}}pro/landing/layouts/pro-landing-saas-desktop.webp" alt="Software product landing page on a desktop screen" width="1440" height="900" loading="lazy" decoding="async">
<img class="phone" src="{{root}}pro/landing/layouts/pro-landing-saas-phone.webp" alt="The same landing page on a phone" width="390" height="844" loading="lazy" decoding="async">
</div>
<figcaption>Landing page for a software product</figcaption>
</figure>
<figure>
<div class="pro-frames">
<img class="desktop" src="{{root}}pro/landing/layouts/pro-docs-api-desktop.webp" alt="API reference page on a desktop screen" width="1440" height="900" loading="lazy" decoding="async">
<img class="phone" src="{{root}}pro/landing/layouts/pro-docs-api-phone.webp" alt="The same API reference on a phone" width="390" height="844" loading="lazy" decoding="async">
</div>
<figcaption>API reference with a request and response panel</figcaption>
</figure>
</div>
</div>
</section>

<section class="pro-band muted" aria-labelledby="themes">
<div class="pro-wrap">
<header class="pro-head">
<h2 id="themes">{{pro:themes}} themes built on design tokens</h2>
<p>A theme is one stylesheet of colour, border radius and typography tokens with a light and a dark palette. Load it after REALM UI and every component on the page uses it. Text and buttons meet WCAG AA contrast (4.5:1) in both modes.</p>
</header>
<!-- pro-themes -->
</div>
</section>

<section class="pro-band" aria-labelledby="delivery">
<div class="pro-wrap pro-delivery">
<div>
<header class="pro-head left">
<h2 id="delivery">How do you install REALM Pro?</h2>
<p>The download includes REALM Pro Studio, a local app for browsing the catalogue offline. Preview any item at desktop, tablet and phone widths in light or dark mode, try your own colours in the theme builder, and add an item to your project with the files it needs.</p>
</header>
<ol class="pro-steps">
<li><strong>Download</strong> from your Polar customer portal: one zip, or a version for macOS, Windows or Linux that needs nothing installed.</li>
<li><strong>Run the studio</strong> with <code>./realm-pro-studio</code>, or <code>bun run studio</code>.</li>
<li><strong>Prefer the terminal?</strong> Install <code>@realmorg/pro</code> from GitHub Packages, or read the source in the private GitHub repository your purchase gives you access to.</li>
</ol>
</div>
<img class="pro-studio" src="{{root}}pro/landing/studio.webp" alt="REALM Pro Studio showing the data grid preview with the catalogue on the left" width="1440" height="900" loading="lazy" decoding="async">
</div>
</section>

<section class="pro-band muted" aria-labelledby="quality">
<div class="pro-wrap">
<header class="pro-head">
<h2 id="quality">Accessible, themeable and framework-free</h2>
<p>Pro items follow the same rules as the free REALM UI components, and the REALM maintainers write them.</p>
</header>
<ul class="pro-rules">
<li><u-icon name="file-code-2" aria-hidden="true"></u-icon><strong>One file per component</strong><span>A <code>&lt;custom-element&gt;</code> with its script, style and markup, which you can read and edit like your own code.</span></li>
<li><u-icon name="palette" aria-hidden="true"></u-icon><strong>Design tokens only</strong><span>Spacing, type, radius and colour come from tokens, so your theme and dark mode reach every item.</span></li>
<li><u-icon name="keyboard" aria-hidden="true"></u-icon><strong>Keyboard and screen readers</strong><span>Visible focus, labelled controls and the WAI-ARIA patterns for grids, date pickers and menus.</span></li>
<li><u-icon name="monitor-check" aria-hidden="true"></u-icon><strong>Tested in a browser</strong><span>Every item renders without errors at desktop and phone widths in light and dark mode. The three components have their own test suites.</span></li>
</ul>
</div>
</section>

<section class="pro-band" id="pricing" aria-labelledby="pricing-title">
<div class="pro-wrap">
<header class="pro-head">
<h2 id="pricing-title">How much does REALM Pro cost?</h2>
<p>A one-time payment, not a subscription. Both plans include every item, every 1.x update and commercial use in client projects. Early-access prices apply until the 1.x catalogue is complete.</p>
</header>
<div class="pro-plans">
<article class="pro-plan">
<h3>Personal</h3>
<p class="pro-plan-for">For one developer.</p>
<p class="pro-price"><span>$149</span> paid once</p>
<p class="pro-plan-later">$149 during early access. $249 after.</p>
<a class="action primary" href="https://buy.polar.sh/polar_cl_LGiAIgKHE9dVha4DOPmnF8UnAL8r6P0JDtOl81VgV0b">Get early access <u-icon name="arrow-right"></u-icon></a>
<ul class="pro-checks">
<li>All {{pro:total}} items, and every item added in 1.x</li>
<li>Unlimited projects, including client work</li>
<li>Studio app, npm package and GitHub access</li>
</ul>
</article>
<article class="pro-plan team">
<h3>Team</h3>
<p class="pro-plan-for">For up to 10 developers.</p>
<p class="pro-price"><span>$499</span> paid once</p>
<p class="pro-plan-later">$499 during early access. $749 after.</p>
<a class="action primary" href="https://buy.polar.sh/polar_cl_i06D1Rh91CpXAmLf2X0FLbwPxlVkuR2wjpIuz0x3y2Y">Get early access for your team <u-icon name="arrow-right"></u-icon></a>
<ul class="pro-checks">
<li>Everything in Personal, for 10 developers</li>
<li>One licence covers the whole team</li>
<li>Priority support</li>
</ul>
</article>
</div>
<ul class="pro-assurance">
<li><u-icon name="rotate-ccw" aria-hidden="true"></u-icon>Refund within 14 days, no questions asked</li>
<li><u-icon name="receipt" aria-hidden="true"></u-icon>Sales tax and VAT handled by Polar, with invoices</li>
<li><u-icon name="refresh-cw" aria-hidden="true"></u-icon>Every 1.x update included</li>
</ul>
</div>
</section>

<section class="pro-band muted" id="roadmap" aria-labelledby="roadmap-title">
<div class="pro-wrap pro-two">
<div>
<h2 id="roadmap-title">What ships next in 1.x</h2>
<p>Your purchase includes everything below as it ships.</p>
<ul class="pro-roadmap">
<li>Scheduler with resource timeline</li>
<li>Advanced charts: heatmap, treemap, sankey, gauge, candlestick</li>
<li>Rich text editor</li>
<li>Kanban board</li>
<li>Gallery and lightbox</li>
<li>Product tour</li>
<li>E-commerce, inbox, file browser and invoice blocks</li>
</ul>
</div>
<div>
<h2>What stays free</h2>
<p>REALM, REALM UI, Unicons, the Vite plugin, the docs and the agent skill stay free and open source under the MIT licence. Pro adds finished pieces on top and never locks a feature REALM has today. Buying it pays for the free parts.</p>
<p><a href="https://github.com/realmorg/realm" rel="noopener">REALM on GitHub <u-icon name="arrow-up-right"></u-icon></a></p>
</div>
</div>
</section>

<section class="pro-band" aria-labelledby="faq">
<div class="pro-wrap pro-narrow">
<h2 id="faq">Frequently asked questions</h2>
<ui-accordion type="multiple" class="faq">
  <ui-accordion-item>
    <ui-accordion-trigger>What is REALM Pro?</ui-accordion-trigger>
    <ui-accordion-content>REALM Pro is a paid UI kit for REALM, the HTML framework for web components. It contains a data grid, a date range picker and a flipbook component, {{pro:blocks}} UI blocks, {{pro:layouts}} page templates and {{pro:themes}} themes. Each item is a custom element in one HTML file that uses REALM UI and your design tokens.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>What does early access mean?</ui-accordion-trigger>
    <ui-accordion-content>All {{pro:total}} launch items are ready to download today. Early access means the 1.x series is still growing: the items listed under Coming in 1.x appear in your download as they ship, and you pay the lower early-access price for them now.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Is it a subscription?</ui-accordion-trigger>
    <ui-accordion-content>No. You pay once. Every 1.x update is included, and the versions you received keep working forever. When REALM Pro 2 comes, 1.x owners can upgrade at a discount.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Can I get a refund?</ui-accordion-trigger>
    <ui-accordion-content>Yes. Ask within 14 days of buying and you get your money back, without questions.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Can I use REALM Pro in client projects?</ui-accordion-trigger>
    <ui-accordion-content>Yes. Each licensed developer can use it in unlimited projects for themselves, their employer or their clients, including commercial ones. You may not resell or publish the Pro source, or use it to make a competing component library or template product.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Do I need a build step or a framework?</ui-accordion-trigger>
    <ui-accordion-content>No. Pro items are REALM components, so they work like the rest of REALM: copy the files into your site and load them with one tag. They work in pages rendered by any server and next to any framework that supports custom elements.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Are the components accessible?</ui-accordion-trigger>
    <ui-accordion-content>Every item supports the keyboard, shows a visible focus ring and labels its controls. The data grid and date range picker follow the WAI-ARIA grid and date picker patterns, and theme colours meet WCAG AA contrast for text and buttons.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Which browsers are supported?</ui-accordion-trigger>
    <ui-accordion-content>The same as REALM: current Chrome, Edge, Firefox and Safari.</ui-accordion-content>
  </ui-accordion-item>
  <ui-accordion-item>
    <ui-accordion-trigger>Who sells REALM Pro?</ui-accordion-trigger>
    <ui-accordion-content>REALM Pro is sold by Taraxa Studio through Polar, which handles payment, tax and your receipts.</ui-accordion-content>
  </ui-accordion-item>
</ui-accordion>
</div>
</section>

<section class="pro-close" aria-labelledby="close">
<div class="pro-wrap">
<h2 id="close">All {{pro:total}} items for $149</h2>
<p>Paid once, with every 1.x update. If it does not fit your project, ask for a refund within 14 days.</p>
<div class="pro-actions">
<a class="action primary" href="https://buy.polar.sh/polar_cl_LGiAIgKHE9dVha4DOPmnF8UnAL8r6P0JDtOl81VgV0b">Get early access, $149 <u-icon name="arrow-right"></u-icon></a>
<a class="action outline" href="#pricing">Compare Personal and Team</a>
</div>
</div>
</section>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Product","name":"REALM Pro","description":"A UI kit for REALM: a data grid, a date range picker and a flipbook web component, {{pro:blocks}} UI blocks, {{pro:layouts}} page templates and {{pro:themes}} themes.","brand":{"@type":"Brand","name":"REALM"},"url":"https://realm.js.org/pro/","image":"https://realm.js.org/pro/landing/wall/pro-dashboard-sidebar-analytics.webp","offers":[{"@type":"Offer","name":"Personal","price":"149","priceCurrency":"USD","availability":"https://schema.org/InStock","url":"https://buy.polar.sh/polar_cl_LGiAIgKHE9dVha4DOPmnF8UnAL8r6P0JDtOl81VgV0b","seller":{"@type":"Organization","name":"Taraxa Studio"}},{"@type":"Offer","name":"Team, up to 10 developers","price":"499","priceCurrency":"USD","availability":"https://schema.org/InStock","url":"https://buy.polar.sh/polar_cl_i06D1Rh91CpXAmLf2X0FLbwPxlVkuR2wjpIuz0x3y2Y","seller":{"@type":"Organization","name":"Taraxa Studio"}}]}
</script>

<script type="module">
  // Respect a reader who asked for less motion: keep the poster frame instead of the loop.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches)
    for (const video of document.querySelectorAll(".pro-video video")) {
      video.removeAttribute("autoplay");
      video.pause();
    }
</script>
