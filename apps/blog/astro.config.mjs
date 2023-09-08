import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";
import critters from "astro-critters";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.realm.codes",
  markdown: {
    shikiConfig: {
      theme: "monokai",
    },
  },
  integrations: [
    mdx(),
    partytown(),
    prefetch({
      selector: ["anchor-link[href]", "anchor-gradient[href]"],
    }),
    sitemap(),
    critters({
      path: ["./dist"],
    }),
  ],
});
