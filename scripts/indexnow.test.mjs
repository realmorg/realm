import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { changedUrls, expand, KEY, payloads } from "./indexnow.mjs";

const sitemap = (urls) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      ([loc, lastmod]) =>
        `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`,
    )
    .join("\n")}\n</urlset>\n`;

test("new pages and pages with a new lastmod are submitted, unchanged pages are not", () => {
  const live = sitemap([
    ["https://realm.js.org/", "2026-10-20"],
    ["https://realm.js.org/docs/", "2026-10-20"],
  ]);
  const built = sitemap([
    ["https://realm.js.org/", "2026-10-20"],
    ["https://realm.js.org/docs/", "2026-10-26"],
    ["https://realm.js.org/docs/new/", "2026-10-26"],
  ]);
  assert.deepEqual(changedUrls(live, built), [
    "https://realm.js.org/docs/",
    "https://realm.js.org/docs/new/",
  ]);
});

test("every page is submitted when the live sitemap could not be read", () => {
  const built = sitemap([["https://realm.js.org/"], ["https://realm.js.org/docs/"]]);
  assert.equal(changedUrls("", built).length, 2);
});

test("requests carry the key file and stay within 10,000 URLs each", () => {
  assert.deepEqual(payloads([]), []);
  const urls = Array.from({ length: 10001 }, (_, i) => `https://realm.js.org/p/${i}/`);
  const batches = payloads(urls);
  assert.equal(batches.length, 2);
  assert.equal(batches[0].urlList.length, 10000);
  assert.equal(batches[1].urlList.length, 1);
  assert.equal(batches[0].host, "realm.js.org");
  assert.equal(batches[0].keyLocation, `https://realm.js.org/${KEY}.txt`);
});

test("the key file the site serves matches the key", () => {
  const file = new URL(`../apps/site/public/${KEY}.txt`, import.meta.url);
  assert.equal(readFileSync(file, "utf8").trim(), KEY);
});

test("a sitemap index is expanded into the pages of its sitemaps", async () => {
  const index = `<sitemapindex><sitemap><loc>https://realm.js.org/sitemap-docs.xml</loc></sitemap><sitemap><loc>https://realm.js.org/sitemap-blog.xml</loc></sitemap></sitemapindex>`;
  const files = {
    "https://realm.js.org/sitemap-docs.xml": sitemap([
      ["https://realm.js.org/docs/", "2026-10-01"],
    ]),
    "https://realm.js.org/sitemap-blog.xml": sitemap([["https://realm.js.org/blog/", ""]]),
  };
  const xml = await expand(index, async (loc) => files[loc]);
  assert.deepEqual(changedUrls("", xml), [
    "https://realm.js.org/docs/",
    "https://realm.js.org/blog/",
  ]);
  const plain = sitemap([["https://realm.js.org/", ""]]);
  assert.equal(await expand(plain, async () => ""), plain);
});
