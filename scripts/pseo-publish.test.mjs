import assert from "node:assert/strict";
import { test } from "node:test";
import { frontmatter, MAX_PAGES_PER_DAY, MIN_WORDS, problemsOf, urlOf } from "./pseo-publish.mjs";

const words = (count) => Array.from({ length: count }, (_, i) => `word${i}`).join(" ");
const page = (path, meta = {}, body = words(MIN_WORDS)) => ({
  path,
  meta: { title: path, description: "A page.", ...meta },
  body,
});

test("content paths map to the URLs the site serves", () => {
  assert.equal(urlOf("index.md"), "/");
  assert.equal(urlOf("docs/index.md"), "/docs/");
  assert.equal(urlOf("docs/integrations/django.md"), "/docs/integrations/django/");
});

test("front matter is read with its body", () => {
  const { meta, body } = frontmatter(
    '---\ntitle: "Use REALM: with Django"\ndescription: Hi\n---\n\nText',
  );
  assert.equal(meta.title, "Use REALM: with Django");
  assert.equal(meta.description, "Hi");
  assert.equal(body.trim(), "Text");
});

test("a good batch has no problems", () => {
  const existing = [page("docs/index.md", { title: "Introduction" })];
  const batch = [page("docs/django.md", {}, `${words(MIN_WORDS)} [intro](/docs/)`)];
  assert.deepEqual(problemsOf({ date: "2026-11-02", batch, existing }), []);
});

test("a batch over the daily limit is refused", () => {
  const batch = Array.from({ length: MAX_PAGES_PER_DAY + 1 }, (_, i) => page(`docs/p${i}.md`));
  const problems = problemsOf({ date: "2026-11-02", batch, existing: [] });
  assert.ok(problems.some((problem) => problem.includes("limit is 4 a day")));
});

test("thin pages, long descriptions, duplicate titles and broken links are refused", () => {
  const existing = [page("docs/index.md", { title: "Introduction" })];
  const batch = [
    page("docs/thin.md", {}, words(10)),
    page("docs/long.md", { description: "x".repeat(161) }),
    page("docs/dupe.md", { title: "introduction" }),
    page("docs/link.md", {}, `${words(MIN_WORDS)} [gone](/docs/missing/)`),
    page("docs/index.md", { title: "Other" }),
  ].slice(0, 5);
  const problems = problemsOf({ date: "2026-11-02", batch: batch.slice(0, 4), existing });
  assert.ok(problems.some((p) => p.startsWith("docs/thin.md: 10 words")));
  assert.ok(problems.some((p) => p.startsWith("docs/long.md: description has 161")));
  assert.ok(
    problems.some((p) => p.startsWith('docs/dupe.md: title "introduction" is already used')),
  );
  assert.ok(problems.some((p) => p.startsWith("docs/link.md: links to /docs/missing/")));
  const clash = problemsOf({ date: "2026-11-02", batch: [batch[4]], existing });
  assert.ok(clash.some((p) => p.startsWith("docs/index.md: a live page already exists")));
});

test("a blog post must be dated for the day it is published", () => {
  const batch = [page("blog/post.md", { date: "2026-11-03" })];
  const problems = problemsOf({ date: "2026-11-02", batch, existing: [] });
  assert.ok(problems.some((p) => p.includes("date is 2026-11-03, expected 2026-11-02")));
});
