// Publishes the day's scheduled pages, the same way NovelOS publishes its blog drafts.
//
//   pnpm pseo:publish                 publish today's batch
//   pnpm pseo:publish --check         validate today's batch without moving anything
//   pnpm pseo:publish --date 2026-11-02
//
// Drafts wait in the private pro repository, in pro/seo/drafts/YYYY-MM-DD/, laid out like
// apps/site/content (pro/seo/drafts/2026-11-02/docs/integrations/django.md becomes
// apps/site/content/docs/integrations/django.md). Nothing reaches the public repository before
// its day. Images and other files a page needs go in the day's public/ folder, laid out like
// apps/site/public. Publishing moves the batch into the site, builds it, commits both repositories
// and pushes. The site deploy then publishes the pages and submits them to IndexNow.
//
// A launchd agent runs this every morning (see scripts/launchd/org.realmjs.pseo-publish.plist).
// Publishing a few pages a day keeps the site from looking like a mass of generated pages to
// search engines.
import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(fileURLToPath(import.meta.url), "../..");
const content = join(repo, "apps/site/content");
const sitePublic = join(repo, "apps/site/public");
const drafts = join(repo, "pro/seo/drafts");

export const MAX_PAGES_PER_DAY = 4;
export const MIN_WORDS = 300;
export const MAX_DESCRIPTION = 160;

const filesIn = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { recursive: true })
        .map((name) => join(dir, String(name)))
        .filter((file) => statSync(file).isFile())
    : [];

const markdownFiles = (dir) =>
  filesIn(dir).filter(
    (file) => file.endsWith(".md") && !relative(dir, file).startsWith(`public${sep}`),
  );

// The URL paths of the files in a public folder: public/pro/a.png is /pro/a.png.
const assetsIn = (dir) =>
  filesIn(dir).map((file) => `/${relative(dir, file).split(sep).join("/")}`);

export const frontmatter = (text) => {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: text };
  const meta = {};
  for (const line of match[1].split("\n")) {
    const [key, ...rest] = line.split(":");
    if (key && rest.length)
      meta[key.trim()] = rest
        .join(":")
        .trim()
        .replace(/^"(.*)"$/, "$1");
  }
  return { meta, body: match[2] };
};

// The URL a content file is served at: docs/index.md is /docs/, docs/state.md is /docs/state/.
export const urlOf = (path) =>
  `/${path
    .split(sep)
    .join("/")
    .replace(/\.md$/, "")
    .replace(/(^|\/)index$/, "")}/`.replace("//", "/");

const wordsOf = (body) =>
  body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter((word) => /[a-z0-9]/i.test(word)).length;

// Copied into the site as whole apps, not built from content pages.
const APPS = ["/dist/", "/unicons/", "/examples/"];

const internalLinks = (body) =>
  [...body.matchAll(/\]\((\/[^)\s#?]*)/g)].map(([, href]) =>
    href.endsWith("/") ? href : `${href}/`,
  );

// Code samples are shown as text, so a src inside a fenced block is not an image on the page.
const imageSources = (body) =>
  [...body.replace(/```[\s\S]*?```/g, "").matchAll(/\b(?:src|srcset)="(\/[^"\s]+)/g)].map(
    ([, src]) => src,
  );

// A page can take over from raw example pages (a tutorial from its finished app): front matter
// `supersedes: examples/todo/index.html examples/todo/cart.html`, paths under apps/. On the day it
// is published those pages get noindex, follow, so search shows the page that explains them.
const NOINDEX = '<meta name="robots" content="noindex, follow">';
export const supersededBy = (page) => (page.meta.supersedes ?? "").split(/\s+/).filter(Boolean);
export const withNoindex = (html) =>
  html.includes('name="robots"') ? html : html.replace(/(\s*)<\/head>/, `$1  ${NOINDEX}$1</head>`);

// Every problem with a batch. An empty list means it can be published.
export const problemsOf = ({ date, batch, existing, assets = new Set(), exists = () => true }) => {
  const problems = [];
  if (batch.length > MAX_PAGES_PER_DAY)
    problems.push(
      `${batch.length} pages are scheduled for ${date}; the limit is ${MAX_PAGES_PER_DAY} a day`,
    );
  const titles = new Map(existing.map((page) => [page.meta.title?.toLowerCase(), page.path]));
  const urls = new Set([...existing, ...batch].map((page) => urlOf(page.path)));
  for (const page of batch) {
    const { path, meta, body } = page;
    if (existing.some((other) => other.path === path))
      problems.push(`${path}: a live page already exists`);
    if (!meta.title) problems.push(`${path}: missing title`);
    else if (titles.has(meta.title.toLowerCase()))
      problems.push(
        `${path}: title "${meta.title}" is already used by ${titles.get(meta.title.toLowerCase())}`,
      );
    if (!meta.description) problems.push(`${path}: missing description`);
    else if (meta.description.length > MAX_DESCRIPTION)
      problems.push(
        `${path}: description has ${meta.description.length} characters, the limit is ${MAX_DESCRIPTION}`,
      );
    if (meta.date && meta.date !== date)
      problems.push(`${path}: date is ${meta.date}, expected ${date}`);
    const words = wordsOf(body);
    if (words < MIN_WORDS) problems.push(`${path}: ${words} words, expected at least ${MIN_WORDS}`);
    for (const href of internalLinks(body))
      if (!urls.has(href) && !APPS.some((app) => href.startsWith(app)))
        problems.push(`${path}: links to ${href}, which does not exist`);
    for (const file of supersededBy(page))
      if (!exists(file)) problems.push(`${path}: supersedes ${file}, which does not exist`);
    for (const src of imageSources(body))
      if (!assets.has(src)) problems.push(`${path}: shows ${src}, which does not exist`);
  }
  return problems;
};

const read = (root, file) => {
  const { meta, body } = frontmatter(readFileSync(file, "utf8"));
  return { path: relative(root, file), meta, body };
};

const run = (command, args, cwd = repo) =>
  execFileSync(command, args, {
    cwd,
    stdio: ["ignore", "pipe", "inherit"],
    encoding: "utf8",
  }).trim();

const today = () => {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((part) => String(part).padStart(2, "0"))
    .join("-");
};

const main = (args) => {
  const check = args.includes("--check");
  const date = args.includes("--date") ? args[args.indexOf("--date") + 1] : today();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`--date must be YYYY-MM-DD, got ${date}`);
  if (!existsSync(join(repo, "pro/README.md")))
    throw new Error("pro/ is empty. Run `git submodule update --init pro` first.");

  const dayDir = join(drafts, date);
  const batch = markdownFiles(dayDir).map((file) => read(dayDir, file));
  if (!batch.length) return console.log(`[pseo] Nothing scheduled for ${date}.`);
  const existing = markdownFiles(content).map((file) => read(content, file));
  const dayPublic = join(dayDir, "public");
  const assets = new Set([...assetsIn(sitePublic), ...assetsIn(dayPublic)]);
  const problems = problemsOf({
    date,
    batch,
    existing,
    assets,
    exists: (file) => existsSync(join(repo, "apps", file)),
  });
  if (problems.length) {
    console.error(`[pseo] ${date}: not published.\n- ${problems.join("\n- ")}`);
    process.exitCode = 1;
    return;
  }
  const list = batch.map((page) => `  ${urlOf(page.path)}  ${page.meta.title}`).join("\n");
  if (check) return console.log(`[pseo] ${date}: ${batch.length} page(s) ready.\n${list}`);

  for (const dir of [repo, join(repo, "pro")]) {
    if (run("git", ["status", "--porcelain", "--untracked-files=no"], dir))
      throw new Error(`${dir} has uncommitted changes. Commit or stash them, then run again.`);
    run("git", ["pull", "--ff-only", "--quiet"], dir);
  }

  const published = assetsIn(dayPublic).map((path) => join("apps/site/public", path));
  const superseded = batch.flatMap(supersededBy).map((file) => join("apps", file));
  for (const file of superseded)
    writeFileSync(join(repo, file), withNoindex(readFileSync(join(repo, file), "utf8")));
  cpSync(dayDir, content, { recursive: true, filter: (path) => path !== dayPublic });
  if (existsSync(dayPublic)) cpSync(dayPublic, sitePublic, { recursive: true });
  try {
    run("pnpm", ["--filter", "site", "build"]);
  } catch (error) {
    for (const page of batch) rmSync(join(content, page.path));
    for (const path of published) rmSync(join(repo, path));
    if (superseded.length) run("git", ["checkout", "--", ...superseded]);
    throw new Error(
      `[pseo] The site does not build with the ${date} pages, so nothing was published.`,
      {
        cause: error,
      },
    );
  }

  rmSync(dayDir, { recursive: true });
  run("git", ["add", "-A", "seo/drafts"], join(repo, "pro"));
  run("git", ["commit", "--quiet", "-m", `seo: publish the ${date} pages`], join(repo, "pro"));
  run("git", ["push", "--quiet"], join(repo, "pro"));

  const paths = [
    ...batch.map((page) => join("apps/site/content", page.path)),
    ...published,
    ...superseded,
  ];
  run("git", ["add", ...paths, "pro"]);
  run("git", [
    "commit",
    "--quiet",
    "-m",
    `content: publish ${batch.length} scheduled page(s) for ${date}\n\n${list}`,
    "--",
    ...paths,
    "pro",
  ]);
  run("git", ["push", "--quiet"]);
  console.log(`[pseo] ${date}: published ${batch.length} page(s).\n${list}`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
