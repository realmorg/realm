---
title: REALM Pro
seoTitle: REALM Pro · Data grid, blocks, layouts and themes for REALM
description: A 100,000-row data grid, a date range picker, a flipbook, {{pro:blocks}} blocks, {{pro:layouts}} page layouts and {{pro:themes}} themes for REALM. One-time payment, 14-day refund.
layout: landing
nav: REALM Pro
---

<link rel="stylesheet" href="{{root}}assets/pro.css">

<section class="pro-hero">
<div class="pro-wrap pro-hero-copy">
<a class="pro-status" href="#roadmap"><span class="pro-status-dot" aria-hidden="true"></span>Early access · {{pro:total}} items ready</a>
<h1>The hard parts of your app, already built.</h1>
<p class="pro-lead">A data grid that scrolls 100,000 rows, a date range picker, a flipbook, {{pro:blocks}} blocks, {{pro:layouts}} page layouts and {{pro:themes}} themes. Each one is a REALM web component in one HTML file: copy it into your project and load it with a tag. No build step.</p>
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
<h2 id="components">Three components teams usually buy separately</h2>
<p>Grids, date pickers and flipbooks are sold as paid add-ons for React, Vue and jQuery. These are built for REALM, run without a framework and come with the rest of Pro.</p>
</header>
<div class="pro-feature">
<figure class="pro-video">
<video src="{{root}}pro/landing/video/pro-data-grid.mp4" poster="{{root}}pro/landing/video/pro-data-grid.webp" width="1280" height="720" muted loop playsinline autoplay preload="none" aria-label="The data grid scrolling 100,000 orders, sorting by total and searching"></video>
</figure>
<div class="pro-feature-copy">
<code class="pro-tag">&lt;pro-data-grid&gt;</code>
<h3>Data grid</h3>
<p>Scrolls 100,000 rows at about 7 ms of work per frame, because only the rows on screen exist in the page.</p>
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
<p>Two months side by side, presets such as Last 30 days, and a value your form submits as <code>2026-10-01/2026-10-14</code>.</p>
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
<p>Turns any HTML into a book: the page curls under the pointer, folds with shading and springs back if you let go early.</p>
<ul class="pro-checks">
<li>One page or a two-page spread, chosen by width</li>
<li>Hard covers, thumbnails, zoom and full screen</li>
<li>Arrow keys, swipe, and links to a page such as <code>#page=5</code></li>
<li>A plain slide when the reader asks for reduced motion</li>
</ul>
</div>
</div>
</div>
</section>

<section class="pro-band muted" id="catalogue" aria-labelledby="catalogue-title">
<div class="pro-wrap">
<header class="pro-head">
<h2 id="catalogue-title">{{pro:total}} items, grouped by the job they do</h2>
<p>Blocks are sections you drop into a page. Layouts are whole pages made from blocks. Every one follows your theme and works in light and dark mode.</p>
</header>
<dl class="pro-numbers">
<div><dt>Components</dt><dd>{{pro:components}}</dd></div>
<div><dt>Blocks</dt><dd>{{pro:blocks}}</dd></div>
<div><dt>Page layouts</dt><dd>{{pro:layouts}}</dd></div>
<div><dt>Themes</dt><dd>{{pro:themes}}</dd></div>
</dl>
<!-- pro-catalogue -->
</div>
</section>

<section class="pro-band" aria-labelledby="layouts">
<div class="pro-wrap">
<header class="pro-head">
<h2 id="layouts">Whole pages, on every screen size</h2>
<p>A layout composes blocks into a finished page: dashboards, settings, sign-in flows, landing pages and docs. Each block it uses is copied with it.</p>
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
<h2 id="themes">{{pro:themes}} themes, each with light and dark modes</h2>
<p>A theme is one stylesheet of colour, radius and font tokens. Load it after REALM UI and every component and Pro item on the page follows. Text and buttons meet 4.5:1 contrast in both modes.</p>
</header>
<!-- pro-themes -->
</div>
</section>

<section class="pro-band" aria-labelledby="delivery">
<div class="pro-wrap pro-delivery">
<div>
<header class="pro-head left">
<h2 id="delivery">Browse, preview and copy, even offline</h2>
<p>The download includes REALM Pro Studio, a small app that runs on your computer. Search the catalogue, preview any item at desktop, tablet and phone widths in light or dark mode, try your colours, and add an item to your project with the files it needs.</p>
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
<h2 id="quality">Built by the same rules as REALM</h2>
<p>Pro items are written the way REALM UI is, by the people who make REALM.</p>
</header>
<ul class="pro-rules">
<li><u-icon name="file-code-2" aria-hidden="true"></u-icon><strong>One file per item</strong><span>A <code>&lt;custom-element&gt;</code> with its script, style and markup. Read it, change it, own it.</span></li>
<li><u-icon name="palette" aria-hidden="true"></u-icon><strong>Theme tokens only</strong><span>No hard-coded colours or sizes, so your theme and dark mode reach every item.</span></li>
<li><u-icon name="keyboard" aria-hidden="true"></u-icon><strong>Keyboard and screen readers</strong><span>Focus order, labels and the ARIA patterns that match each component.</span></li>
<li><u-icon name="monitor-check" aria-hidden="true"></u-icon><strong>Checked in a browser</strong><span>Every item renders without errors at desktop and phone widths in light and dark mode. The components have their own test suites.</span></li>
</ul>
</div>
</section>

<section class="pro-band" id="pricing" aria-labelledby="pricing-title">
<div class="pro-wrap">
<header class="pro-head">
<h2 id="pricing-title">Pay once, use it in every project</h2>
<p>Both plans include every item, every 1.x update, and use in client work. Early-access prices hold until the 1.x catalogue is complete.</p>
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
<h2 id="roadmap-title">Coming in 1.x</h2>
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
<h2 id="faq">Questions</h2>
<ui-accordion type="multiple" class="faq">
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
<h2 id="close">Start with the hard parts done.</h2>
<p>{{pro:total}} items for $149, paid once, with 14 days to change your mind.</p>
<div class="pro-actions">
<a class="action primary" href="https://buy.polar.sh/polar_cl_LGiAIgKHE9dVha4DOPmnF8UnAL8r6P0JDtOl81VgV0b">Get early access, $149 <u-icon name="arrow-right"></u-icon></a>
<a class="action outline" href="#pricing">Compare plans</a>
</div>
</div>
</section>

<script type="module">
  // Respect a reader who asked for less motion: keep the poster frame instead of the loop.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches)
    for (const video of document.querySelectorAll(".pro-video video")) {
      video.removeAttribute("autoplay");
      video.pause();
    }
</script>
