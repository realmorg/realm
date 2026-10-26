// Tells IndexNow (Bing, Yandex and the other engines that share it) which pages are new or
// changed. The site build runs this before deploying, while the old sitemap is still live:
//
//   node scripts/indexnow.mjs apps/site/dist/sitemap.xml indexnow.json
//
// It writes the request bodies to indexnow.json, which the deploy job posts once the pages are
// live. When nothing changed, it writes no file.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const KEY = "18971ba2931eb81880ee5d96af8dd1d4";
// IndexNow accepts at most 10,000 URLs per request.
const BATCH = 10000;

export const entriesOf = (xml) =>
  new Map(
    [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*(?:<lastmod>([^<]+)<\/lastmod>)?/g)].map(
      ([, loc, lastmod]) => [loc.trim(), lastmod?.trim() ?? ""],
    ),
  );

export const changedUrls = (previousXml, nextXml) => {
  const previous = entriesOf(previousXml);
  return [...entriesOf(nextXml)]
    .filter(([loc, lastmod]) => !previous.has(loc) || previous.get(loc) !== lastmod)
    .map(([loc]) => loc);
};

export const payloads = (urls) => {
  if (!urls.length) return [];
  const { host, origin } = new URL(urls[0]);
  const batches = [];
  for (let start = 0; start < urls.length; start += BATCH)
    batches.push({
      host,
      key: KEY,
      keyLocation: `${origin}/${KEY}.txt`,
      urlList: urls.slice(start, start + BATCH),
    });
  return batches;
};

const main = async ([sitemap, out]) => {
  const next = readFileSync(sitemap, "utf8");
  const first = entriesOf(next).keys().next().value;
  if (!first) return console.log("IndexNow: the sitemap lists no pages.");
  const live = await fetch(new URL("/sitemap.xml", first))
    .then((response) => (response.ok ? response.text() : ""))
    .catch(() => "");
  const batches = payloads(changedUrls(live, next));
  if (!batches.length) return console.log("IndexNow: no new or changed pages.");
  writeFileSync(out, JSON.stringify(batches));
  console.log(`IndexNow: ${batches.reduce((n, b) => n + b.urlList.length, 0)} pages to submit.`);
};

if (process.argv[1] === fileURLToPath(import.meta.url) && existsSync(process.argv[2] ?? ""))
  await main(process.argv.slice(2));
