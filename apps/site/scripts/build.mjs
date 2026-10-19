import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { Marked } from "marked";
import { createHighlighter } from "shiki";

const root = fileURLToPath(new URL("..", import.meta.url));
const repo = join(root, "../..");
const out = join(root, "dist");
const SITE_URL = (process.env.SITE_URL ?? "https://realmui.github.io").replace(/\/$/, "");
const BASE = `/${(process.env.SITE_BASE ?? "/").replace(/^\/|\/$/g, "")}/`.replace("//", "/");

const highlighter = await createHighlighter({
  themes: ["github-light-high-contrast", "github-dark-high-contrast"],
  langs: ["html", "css", "js", "ts", "json", "bash", "diff"],
});

const escapeHtml = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const frontmatter = (text) => {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { meta: {}, body: text };
  const meta = {};
  for (const line of match[1].split("\n")) {
    const [key, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    meta[key.trim()] = /^-?\d+$/.test(value) ? Number(value) : value.replace(/^"(.*)"$/, "$1");
  }
  return { meta, body: text.slice(match[0].length) };
};

const pages = walk(join(root, "content"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const { meta, body } = frontmatter(readFileSync(file, "utf8"));
    const path = relative(join(root, "content"), file).replace(/\.md$/, "");
    const slug = path === "index" ? "" : path.replace(/\/index$/, "");
    const depth = slug ? slug.split("/").length : 0;
    return {
      file,
      meta,
      body,
      slug,
      prefix: depth ? "../".repeat(depth) : "./",
      section: slug.split("/")[0] || "home",
      url: `${BASE}${slug ? `${slug}/` : ""}`,
    };
  });

const SECTIONS = [
  { id: "docs", label: "Docs" },
  { id: "components", label: "Components" },
  { id: "examples", label: "Examples" },
  { id: "reference", label: "Reference" },
  { id: "blog", label: "Blog" },
];

const sorted = (list) =>
  [...list].sort(
    (a, b) =>
      (a.meta.order ?? 999) - (b.meta.order ?? 999) || a.meta.title.localeCompare(b.meta.title),
  );

const internalLink = (href, prefix) => {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const [path, hash = ""] = href.slice(1).split("#");
  const clean = path.replace(/\/$/, "");
  const isFile = /\.[a-z0-9]+$/i.test(clean);
  const target = clean ? (isFile ? clean : `${clean}/`) : "";
  return `${prefix}${target}${hash ? `#${hash}` : ""}` || "./";
};

const render = (page) => {
  const toc = [];
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = slugify(text);
        if (depth === 2 || depth === 3) toc.push({ id, text: text.replace(/<[^>]+>/g, ""), depth });
        return `<h${depth} id="${id}"><a class="anchor" href="#${id}">${text}</a></h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        const attrs = external ? ' rel="noopener" target="_blank"' : "";
        return `<a href="${escapeHtml(internalLink(href, page.prefix))}"${title ? ` title="${escapeHtml(title)}"` : ""}${attrs}>${text}</a>`;
      },
      code({ text, lang = "" }) {
        const [language = "text", ...flags] = lang.split(/\s+/);
        const known = highlighter.getLoadedLanguages().includes(language);
        const highlighted = highlighter.codeToHtml(text, {
          lang: known ? language : "text",
          themes: { light: "github-light-high-contrast", dark: "github-dark-high-contrast" },
        });
        const block = `<code-block language="${escapeHtml(language)}">${highlighted}</code-block>`;
        if (!flags.includes("live")) return block;
        const demo = text.replaceAll("{{root}}", page.prefix);
        return `<live-demo>\n<div slot="preview">\n${demo}\n</div>\n<div slot="code">${block}</div>\n</live-demo>\n`;
      },
    },
  });
  const html = marked.parse(page.body.replaceAll("{{root}}", page.prefix));
  return { html, toc };
};

const navFor = (page) => {
  const items = sorted(
    pages.filter((p) => p.section === page.section && p.meta.title && !p.meta.hidden),
  );
  const groups = new Map();
  for (const item of items) {
    const group = item.meta.group ?? "";
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(item);
  }
  return [...groups]
    .map(
      ([group, list]) =>
        `<section>${group ? `<h2>${escapeHtml(group)}</h2>` : ""}<ul>${list
          .map((item) => {
            const href = item.slug === page.slug ? "./" : `${page.prefix}${item.slug}/`;
            const current = item.slug === page.slug ? ' aria-current="page"' : "";
            return `<li><a href="${href}"${current}>${escapeHtml(item.meta.nav ?? item.meta.title)}</a></li>`;
          })
          .join("")}</ul></section>`,
    )
    .join("");
};

const tocFor = (toc) =>
  toc.length < 2
    ? ""
    : `<h2>On this page</h2><ul>${toc
        .map(
          (item) =>
            `<li class="depth-${item.depth}"><a href="#${item.id}">${escapeHtml(item.text)}</a></li>`,
        )
        .join("")}</ul>`;

const pager = (page) => {
  const list = sorted(
    pages.filter((p) => p.section === page.section && p.meta.title && !p.meta.hidden),
  );
  const index = list.findIndex((p) => p.slug === page.slug);
  if (index === -1 || list.length < 2) return "";
  const link = (p, rel) =>
    p
      ? `<a rel="${rel}" href="${page.prefix}${p.slug}/"><small>${rel === "prev" ? "Previous" : "Next"}</small>${escapeHtml(p.meta.nav ?? p.meta.title)}</a>`
      : "<span></span>";
  return `<nav class="pager" aria-label="Pages">${link(list[index - 1], "prev")}${link(list[index + 1], "next")}</nav>`;
};

const template = (page, { html, toc }) => {
  const title = page.slug
    ? `${page.meta.title} · REALM`
    : "REALM: native web components in plain HTML";
  const description = escapeHtml(
    page.meta.description ??
      "Build native web components with one HTML tag. No compiler, no build step.",
  );
  const p = page.prefix;
  const home = page.meta.layout === "home";
  const editUrl = `https://github.com/realmui/realm/edit/main/apps/site/content/${relative(join(root, "content"), page.file)}`;
  const body = home
    ? `<main id="main" class="home">${html}</main>`
    : `<site-layout>
  <nav slot="nav" class="sidebar" aria-label="${escapeHtml(SECTIONS.find((s) => s.id === page.section)?.label ?? "Site")}">${navFor(page)}</nav>
  <article id="main" class="prose">${html}${pager(page)}<p class="edit"><a href="${editUrl}" rel="noopener" target="_blank">Edit this page on GitHub</a> · <a href="${p}${page.slug}.md">View as Markdown</a></p></article>
  <nav slot="toc" class="toc" aria-label="On this page">${tocFor(toc)}</nav>
</site-layout>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${SITE_URL}${page.url}">
<link rel="alternate" type="text/markdown" href="${p}${page.slug || "index"}.md">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE_URL}${page.url}">
<meta name="theme-color" content="#0a0a0a">
<link rel="icon" href="${p}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${p}assets/realm/realm.css">
<link rel="stylesheet" href="${p}assets/ui/theme.css">
<link rel="stylesheet" href="${p}assets/site.css">
<script>try{const t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t}catch{}</script>
<script type="module" src="${p}assets/realm/realm.js"></script>
</head>
<body>
<nav class="skip-links" aria-label="Skip links"><a class="skip" href="#main">Skip to content</a></nav>
<import-element from="${p}assets/ui/ui.html"></import-element>
<import-element from="${p}components/site.html"></import-element>
<site-header root="${p}" section="${page.section}"></site-header>
<ui-toaster></ui-toaster>
${body}
<site-footer root="${p}"></site-footer>
</body>
</html>
`;
};

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const plainText = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const search = [];
const markdownFor = (page) => {
  const body = page.body.replaceAll("{{root}}", "/").trimStart();
  return body.startsWith("# ") ? body : `# ${page.meta.title}\n\n${body}`;
};

for (const page of pages) {
  const rendered = render(page);
  const dir = join(out, page.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), template(page, rendered));
  writeFileSync(join(out, `${page.slug || "index"}.md`), markdownFor(page));
  if (page.meta.title && !page.meta.hidden) {
    search.push({
      title: page.meta.title,
      section: SECTIONS.find((s) => s.id === page.section)?.label ?? "",
      url: page.slug ? `${page.slug}/` : "",
      headings: rendered.toc.map((h) => h.text),
      text: plainText(rendered.html).slice(0, 400),
    });
  }
}

const notFound = {
  file: join(root, "content/index.md"),
  meta: { title: "Page not found", layout: "home" },
  body: "",
  slug: "404",
  prefix: BASE,
  section: "home",
  url: `${BASE}404.html`,
};
writeFileSync(
  join(out, "404.html"),
  template(notFound, {
    html: `<section class="not-found"><h1>Page not found</h1><p>The page you are looking for does not exist.</p><p><a href="${BASE}">Go to the home page</a></p></section>`,
    toc: [],
  }),
);

writeFileSync(join(out, "search-index.json"), JSON.stringify(search));

const listed = sorted(pages.filter((p) => p.meta.title && !p.meta.hidden));
const llms = [
  "# REALM",
  "",
  '> REALM builds native web components with one HTML tag. A component is a <custom-element> holding a <script> (plain JavaScript with defineProps, useState and observe), a <style>, and markup that shows values with native <slot name="#state.path">, binds attributes with _attr="#ref", handles events with native on<event> attributes, repeats with <repeat-list> and fetches with attributes like fetch, into and render. No compiler and no build step.',
  "",
  ...SECTIONS.flatMap((section) => {
    const items = listed.filter((p) => p.section === section.id);
    if (!items.length) return [];
    return [
      `## ${section.label}`,
      "",
      ...items.map(
        (p) =>
          `- [${p.meta.title}](${SITE_URL}${BASE}${p.slug}.md)${p.meta.description ? `: ${p.meta.description}` : ""}`,
      ),
      "",
    ];
  }),
].join("\n");
writeFileSync(join(out, "llms.txt"), llms);
writeFileSync(
  join(out, "llms-full.txt"),
  listed
    .map((p) => `${markdownFor(p).replace(/\n\n/, `\n\nSource: ${SITE_URL}${p.url}\n\n`)}`)
    .join("\n\n---\n\n"),
);
writeFileSync(
  join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${listed
    .map((p) => `  <url><loc>${SITE_URL}${p.url}</loc></url>`)
    .join("\n")}\n</urlset>\n`,
);
writeFileSync(
  join(out, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}${BASE}sitemap.xml\n`,
);

const copy = (from, to) => {
  if (existsSync(from)) cpSync(from, join(out, to), { recursive: true });
};
copy(join(root, "public"), ".");
copy(join(root, "components"), "components");
copy(join(repo, "packages/realm/dist"), "assets/realm");
copy(join(repo, "packages/ui/dist"), "assets/ui");
copy(join(repo, "packages/ui/components"), "assets/ui/components");
copy(join(repo, "apps/examples"), "examples");
rmSync(join(out, "assets/realm/types"), { recursive: true, force: true });
for (const extra of ["package.json", "test", "node_modules", "playwright.config.ts"]) {
  rmSync(join(out, "examples", extra), { recursive: true, force: true });
}

console.log(
  `Built ${pages.length} pages into ${relative(process.cwd(), out) || "."} (base ${BASE})`,
);
