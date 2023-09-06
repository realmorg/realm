---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 17. Finale
menuOrder: 17
title: Final Words
author: Ribhararnus Pracutian
description: Congratulations! You've reached the end of the tutorial. Now you're ready to build your product.
---

🥳 Congratulations! You've reached the end of the learning documentations.

Now that you have acquired the necessary skills, you are well-prepared to embark on building your product. Before you begin, I would like to offer one last piece of advice and reminder: do not limit your creativity by sticking solely to a specific stack or technology.

It's important to remember that stacks and technologies are tools designed to assist you in building your product. They should not be viewed as constraints that hinder your creative potential. Your primary focus should always be on the product itself.

It's worth noting that the average user, who may not possess a technical background, is primarily interested in the product you create rather than the underlying technology stack. They are more concerned with the functionality, usability, and value that your product brings to their lives.

Therefore, instead of fixating on the technology, prioritize the product itself. Concentrate on delivering a solution that meets the needs of your target users, provides a seamless user experience, and delivers value in a meaningful way. By focusing on the product and its impact, you can unleash your creativity and build something truly remarkable.

Good luck on your product-building journey, and remember to prioritize the product over the technology stack!

<custom-element name="confetti-element">
  <import-script
    from="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js">
  </import-script>

  <element-flow>
    <listen-event mounted>
      <set-timer once="1000">
        <script type="module/realm">
          confetti({
            particleCount: 300,
            spread: 100,
            origin: { y: 0.6 }
          });
        </script>
      </set-timer>
    </listen-event>
  </element-flow>
</custom-element>

<confetti-element></confetti-element>
