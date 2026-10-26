// Publishes the day's scheduled pages, the same way NovelOS publishes its blog drafts.
//
//   pnpm pseo:publish                 publish today's batch
//   pnpm pseo:publish --check         validate today's batch without moving anything
//   pnpm pseo:publish --date 2026-11-02
//
// Drafts wait in the private pro repository, in pro/seo/drafts/YYYY-MM-DD/, laid out like
// apps/site/content (pro/seo/drafts/2026-11-02/docs/integrations/django.md becomes
// apps/site/content/docs/integrations/django.md). Nothing reaches the public repository before
// its day. Publishing moves the batch into the site, builds it, commits both repositories and
// pushes. The site deploy then publishes the pages and submits them to IndexNow.
//
// A launchd agent runs this every morning (see scripts/launchd/org.realmjs.pseo-publish.plist).
// Publishing a few pages a day keeps the site from looking like a mass of generated pages to
// search engines.
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(fileURLToPath(import.meta.url), "../..");
const content = join(repo, "apps/site/content");
const drafts = join(repo, "pro/seo/drafts");

export const MAX_PAGES_PER_DAY = 4;
export const MIN_WORDS = 300;
export const MAX_DESCRIPTION = 160;

const markdownFiles = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { recursive: true })
        .map((name) => join(dir, String(name)))
        .filter((file) => file.endsWith(".md") && statSync(file).isFile())
    : [];

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

const internalLinks = (body) =>
  [...body.matchAll(/\]\((\/[^)\s#?]*)/g)].map(([, href]) =>
    href.endsWith("/") ? href : `${href}/`,
  );

// Every problem with a batch. An empty list means it can be published.
export const problemsOf = ({ date, batch, existing }) => {
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
      if (!urls.has(href) && !href.startsWith("/dist/"))
        problems.push(`${path}: links to ${href}, which does not exist`);
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
  const problems = problemsOf({ date, batch, existing });
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

  cpSync(dayDir, content, { recursive: true });
  try {
    run("pnpm", ["--filter", "site", "build"]);
  } catch (error) {
    for (const page of batch) rmSync(join(content, page.path));
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

  const paths = batch.map((page) => join("apps/site/content", page.path));
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
