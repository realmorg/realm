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
import { basename, join, posix, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { Marked } from "marked";
import { createHighlighter } from "shiki";
import { zipDirectory } from "../../../scripts/zip.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const repo = join(root, "../..");
const out = process.env.SITE_OUT ?? join(root, "dist");
const SITE_URL = (process.env.SITE_URL ?? "https://realm.js.org").replace(/\/$/, "");
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

// {{version:ui}} in a page becomes the current version of @realmorg/ui, so pinned examples stay
// in step with each release.
const VERSIONS = Object.fromEntries(
  ["realm", "ui", "unicons", "vite-plugin"].map((name) => [
    name,
    JSON.parse(readFileSync(join(repo, `packages/${name}/package.json`), "utf8")).version,
  ]),
);
const withVersions = (text) =>
  text.replace(/\{\{version:([\w-]+)\}\}/g, (placeholder, name) => {
    if (!VERSIONS[name]) throw new Error(`Unknown package in ${placeholder}`);
    return VERSIONS[name];
  });

const pages = walk(join(root, "content"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const { meta, body } = frontmatter(withVersions(readFileSync(file, "utf8")));
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
  { id: "reference", label: "Reference" },
  { id: "components", label: "Components" },
  { id: "examples", label: "Examples" },
  { id: "blog", label: "Blog" },
];

const sorted = (list) =>
  [...list].sort(
    (a, b) =>
      (a.meta.order ?? 999) - (b.meta.order ?? 999) ||
      String(b.meta.date ?? "").localeCompare(String(a.meta.date ?? "")) ||
      a.meta.title.localeCompare(b.meta.title),
  );

const internalLink = (href, prefix) => {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const [path, hash = ""] = href.slice(1).split("#");
  const clean = path.replace(/\/$/, "");
  const isFile = /\.[a-z0-9]+$/i.test(clean);
  const target = clean ? (isFile ? clean : `${clean}/`) : "";
  return `${prefix}${target}${hash ? `#${hash}` : ""}` || "./";
};

// Shiki leaves a script or style with an unknown type as plain text, so type="realm" is
// highlighted as a type it knows and the attribute is put back in the output.
const REALM_TYPES = [
  ["script", "text/javascript"],
  ["style", "text/css"],
];

// Each line records its indentation, so a wrapped line hangs under its own code (see site.css).
const indentation = {
  line(node, number) {
    const spaces = this.source.split("\n")[number - 1].match(/^ */)[0].length;
    if (spaces) node.properties.style = `--indent: ${spaces}`;
  },
};

const highlight = (text, language) => {
  const known = highlighter.getLoadedLanguages().includes(language);
  let source = text;
  const swapped = REALM_TYPES.filter(([tag, type]) => {
    const pattern = new RegExp(`(<${tag}\\b[^>]*?\\btype=")realm"`, "g");
    if (source.includes(type) || !pattern.test(source)) return false;
    source = source.replace(pattern, `$1${type}"`);
    return true;
  });
  const html = highlighter.codeToHtml(source, {
    lang: known ? language : "text",
    themes: { light: "github-light-high-contrast", dark: "github-dark-high-contrast" },
    defaultColor: false,
    transformers: [indentation],
  });
  return swapped.reduce((result, [, type]) => result.replaceAll(`>"${type}"<`, '>"realm"<'), html);
};

const codeBlock = (text, language) =>
  `<code-block language="${escapeHtml(language)}">${highlight(text, language)}</code-block>`;

const CDN = "https://cdn.jsdelivr.net/npm";
const DEMO_STYLES = new Map(
  [
    ...readFileSync(join(root, "public/assets/site.css"), "utf8").matchAll(
      /^\.(demo-[\w-]+) \{\n[\s\S]*?\n\}/gm,
    ),
  ].map(([rule, name]) => [name, rule]),
);

// Where each published path comes from, so a demo can show the files it imports.
const SOURCES = [
  ["examples/", "apps/examples/"],
  ["components/", "apps/site/components/"],
  ["assets/ui/components/", "packages/ui/components/"],
  ["assets/ui/", "packages/ui/dist/"],
  ["assets/realm/", "packages/realm/dist/"],
  ["unicons/", "packages/unicons/dist/"],
  ["", "apps/site/public/"],
];
const sourceOf = (path) => {
  for (const [prefix, dir] of SOURCES) {
    const file = join(repo, dir, path.slice(prefix.length));
    if (path.startsWith(prefix) && existsSync(file)) return file;
  }
  throw new Error(`A demo imports ${path}, which is not part of the site.`);
};

const LOCAL_IMPORT = /(<import-element\b[^>]*?\bfrom=")\{\{root\}\}([^"]+)"/g;
const RELATIVE_IMPORTS = [
  /<import-element\b[^>]*?\bfrom="([^"]+)"/g,
  /\bimport\b[^"';]*?["'](\.{1,2}\/[\w./-]+)["']/g,
];

const LIBRARIES = [
  ["assets/realm/", `${CDN}/@realmorg/realm@alpha/dist/`],
  ["assets/ui/components/", `${CDN}/@realmorg/ui@alpha/components/`],
  ["assets/ui/", `${CDN}/@realmorg/ui@alpha/dist/`],
  ["unicons/", `${CDN}/@realmorg/unicons@alpha/dist/`],
];
const cdnUrl = (path) => {
  const library = LIBRARIES.find(([prefix]) => path.startsWith(prefix));
  return library && `${library[1]}${path.slice(library[0].length)}`;
};

// The REALM UI file that defines each ui-* tag, so a demo imports only the files it uses.
const UI_COMPONENTS = join(repo, "packages/ui/components");
const UI_FILES = new Map(
  readdirSync(UI_COMPONENTS)
    .filter((file) => file.endsWith(".html"))
    .flatMap((file) =>
      [
        ...readFileSync(join(UI_COMPONENTS, file), "utf8").matchAll(
          /<custom-element name="(ui-[\w-]+)"/g,
        ),
      ].map(([, tag]) => [tag, file]),
    ),
);
const uiFilesOf = (text) =>
  [...text.matchAll(/(?<![\w-])ui-[a-z0-9-]+/g)].map(([tag]) => UI_FILES.get(tag)).filter(Boolean);

// Every local file a page or demo loads, starting from the given files: the files named by
// <import-element> tags and, inside them, relative imports. Imports of REALM, REALM UI or
// Unicons point at the CDN instead. Names are relative to the first file's folder, as the
// page sees them.
const collectFiles = (roots, patterns = RELATIVE_IMPORTS) => {
  const files = new Map();
  const visit = (path, name) => {
    if (files.has(name)) return;
    files.set(name, "");
    let content = readFileSync(sourceOf(path), "utf8");
    for (const pattern of patterns) {
      content = content.replace(pattern, (match, target) => {
        if (/^[a-z]+:|^\/|\{/i.test(target)) return match;
        const resolved = posix.join(posix.dirname(path), target);
        const cdn = cdnUrl(resolved);
        if (cdn) return match.replace(target, cdn);
        visit(resolved, posix.join(posix.dirname(name), target));
        return match;
      });
    }
    files.set(name, content);
  };
  for (const [path, name] of roots) visit(path, name);
  return files;
};

const importedFiles = (demo) =>
  collectFiles([...demo.matchAll(LOCAL_IMPORT)].map(([, , path]) => [path, basename(path)]));

const indent = (text, spaces) =>
  text
    .split("\n")
    .map((line) => (line ? `${" ".repeat(spaces)}${line}` : line))
    .join("\n");

// A live demo defines its components in the page, so the preview runs in place. Its source
// shows each definition as the file a project keeps it in: plain <script> and <style>, loaded
// with <import-element>.
const INLINE_DEFINITION = /^([ \t]*)<custom-element name="([\w-]+)"[\s\S]*?<\/custom-element>\n?/gm;
const definitionFiles = (demo) => {
  const files = new Map();
  const page = demo
    .replace(INLINE_DEFINITION, (definition, spaces, name) => {
      const file = definition
        .split("\n")
        .map((line) => (line.startsWith(spaces) ? line.slice(spaces.length) : line))
        .join("\n")
        .replace(/(<(?:script|style)\b[^>]*?)\s+type="realm"/g, "$1")
        .replace(LOCAL_IMPORT, (_, start, path) => `${start}./${basename(path)}"`)
        .replaceAll("{{root}}", `${SITE_URL}${BASE}`)
        .trim();
      files.set(`${name}.html`, file);
      return `${spaces}<import-element from="./${name}.html"></import-element>\n`;
    })
    .replace(/(<\/import-element>\n)\n+(?=[ \t]*<import-element from="\.\/)/g, "$1");
  return { page, files };
};

// The demo as a complete page: the CDN tags it needs, then the demo itself.
const demoPage = (demo, page, files, shown) => {
  const sources = [demo, ...files.values()].join("\n");
  const ui = /<ui-/.test(sources);
  const unimported = [...files.values()].filter((file) => !file.includes("@realmorg/ui@alpha/"));
  const theme = ui || /var\(--/.test(sources);
  const icons = /<u-icon\b/.test(sources);
  const toaster = ui && /\btoast\b/.test(demo) && !/<ui-toaster/.test(demo);
  const used = new Set(demo.match(/\bdemo-[\w-]+/g));
  const styles = [...DEMO_STYLES].filter(([name]) => used.has(name)).map(([, rule]) => rule);
  const body = shown
    .replace(LOCAL_IMPORT, (_, start, path) => `${start}./${basename(path)}"`)
    .replaceAll("{{root}}", `${SITE_URL}${BASE}`)
    .trim();
  const head = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${(page.meta.title ?? "REALM").replace(/[<>]/g, "")} demo</title>`,
    `<link rel="stylesheet" href="${CDN}/@realmorg/realm@alpha/dist/realm.css">`,
    theme && `<link rel="stylesheet" href="${CDN}/@realmorg/ui@alpha/dist/theme.css">`,
    `<script type="module" src="${CDN}/@realmorg/realm@alpha/dist/realm.js"></script>`,
    styles.length && `<style>\n${indent(styles.join("\n"), 2)}\n</style>`,
  ].filter(Boolean);
  const uiFiles = body.includes("@realmorg/ui@alpha/dist/ui.html")
    ? []
    : new Set(uiFilesOf([demo, ...unimported, toaster ? "<ui-toaster>" : ""].join("\n")).sort());
  const imports = [
    ...[...uiFiles].map(
      (file) =>
        `<import-element from="${CDN}/@realmorg/ui@alpha/components/${file}"></import-element>`,
    ),
    icons &&
      `<import-element from="${CDN}/@realmorg/unicons@alpha/dist/unicons.html"></import-element>`,
    toaster && "<ui-toaster></ui-toaster>",
  ].filter(Boolean);
  return `<!doctype html>
<html lang="en">
<head>
${indent(head.join("\n"), 2)}
</head>
<body>
${indent([...imports, imports.length ? "" : null, body].filter((part) => part !== null).join("\n"), 2)}
</body>
</html>`;
};

const languageOf = (name) => name.split(".").pop();

// A live block renders its demo and offers every file it needs as a tab: the page, then each
// imported file. With the "split" flag the preview stays beside the code instead of in a tab, and
// with "stacked" it sits below the code.
const liveDemo = (text, page, layout) => {
  const files = importedFiles(text);
  const definitions = definitionFiles(text);
  const tabs = [
    ["index.html", demoPage(text, page, files, definitions.page)],
    ...definitions.files,
    ...files,
  ];
  const preview = `<div class="preview">\n${text.replaceAll("{{root}}", page.prefix)}\n</div>`;
  const triggers = tabs.map(
    ([name]) =>
      `<ui-tabs-trigger value="${escapeHtml(name)}">${escapeHtml(name)}</ui-tabs-trigger>`,
  );
  const panels = tabs.map(
    ([name, source]) =>
      `<ui-tabs-content value="${escapeHtml(name)}">${codeBlock(source, languageOf(name))}</ui-tabs-content>`,
  );
  const sources = `<ui-tabs value="index.html"><ui-tabs-list aria-label="Source files">${triggers.join("")}</ui-tabs-list>${panels.join("")}</ui-tabs>`;
  if (layout === "stacked")
    return `<live-demo layout="stacked">\n${sources}\n${preview}\n</live-demo>\n`;
  if (layout === "split") {
    return `<live-demo layout="split">\n${preview}\n${sources}\n</live-demo>\n`;
  }
  return `<live-demo>\n<ui-tabs value="preview"><ui-tabs-list aria-label="Demo and source files"><ui-tabs-trigger value="preview">Preview</ui-tabs-trigger>${triggers.join("")}</ui-tabs-list><ui-tabs-content value="preview">${preview}</ui-tabs-content>${panels.join("")}</ui-tabs>\n</live-demo>\n`;
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
        if (flags.includes("live"))
          return liveDemo(
            text,
            page,
            ["split", "stacked"].find((layout) => flags.includes(layout)),
          );
        return codeBlock(text.replaceAll("{{root}}", "/"), language);
      },
    },
  });
  const html = marked
    .parse(page.body)
    .replaceAll("{{root}}", page.prefix)
    .replace(
      /<blockquote>\n([\s\S]*?)<\/blockquote>/g,
      '<blockquote class="callout"><u-icon name="info"></u-icon><div>$1</div></blockquote>',
    )
    .replace(
      /<table>\n<thead>([\s\S]*?)<\/table>/g,
      '<div class="table-scroll"><table>\n<thead>$1</table></div>',
    );
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

// A <u-icon> gets its svg only after realm.js and its chunks, the imported component files,
// unicons.js and the icon's chunk have loaded one after another. Preloading them lets every
// request start at once.
const staticImports = (path) => [
  path,
  ...[
    ...readFileSync(join(repo, "packages/realm/dist", path), "utf8").matchAll(
      /\b(?:from|import)\s*"\.\/([^"]+)"/g,
    ),
  ].flatMap(([, target]) => staticImports(posix.join(posix.dirname(path), target))),
];
const REALM_CHUNKS = staticImports("realm.js")
  .slice(1)
  .map((path) => `assets/realm/${path}`);
const { chunkPath, sets: iconSets } = await import(
  new URL("../../../packages/unicons/dist/unicons.js", import.meta.url)
);
const iconChunks = (html) =>
  [...html.matchAll(/<u-icon\b([^>]*)>/g)].flatMap(([, attributes]) => {
    const name = attributes.match(/\sname="([\w-]+)"/)?.[1];
    const set = attributes.match(/\sset="([\w-]+)"/)?.[1] ?? "lu";
    return name && Object.hasOwn(iconSets, set) ? [`unicons/${chunkPath(set, name)}`] : [];
  });
// The header menu names some of its icons in script (icon: "book-open").
const SITE_ICON_CHUNKS = iconChunks(
  readFileSync(join(root, "components/site.html"), "utf8").replace(
    /\bicon: "([\w-]+)"/g,
    '<u-icon name="$1">',
  ),
);
const preloads = (html, p) =>
  [
    ...["assets/ui/ui.html", "components/site.html", "unicons/unicons.html"].map(
      (path) => `<link rel="preload" href="${p}${path}" as="fetch" crossorigin>`,
    ),
    ...[
      ...new Set([...REALM_CHUNKS, "unicons/unicons.js", ...SITE_ICON_CHUNKS, ...iconChunks(html)]),
    ].map((path) => `<link rel="modulepreload" href="${p}${path}">`),
  ].join("\n");

const template = (page, { html, toc }) => {
  const title = page.slug
    ? `${page.meta.title} · REALM`
    : "REALM: the HTML framework for shipping MVPs";
  const description = escapeHtml(
    page.meta.description ??
      "Build native web components with one HTML tag. No compiler, no build step.",
  );
  const p = page.prefix;
  const home = page.meta.layout === "home";
  const wide = page.meta.layout === "wide";
  const editUrl = `https://github.com/realmorg/realm/edit/main/apps/site/content/${relative(join(root, "content"), page.file)}`;
  const body = home
    ? `<main id="main" class="home">${html}</main>`
    : `<site-layout${wide ? " wide" : ""}>
  <nav slot="nav" class="sidebar" aria-label="${escapeHtml(SECTIONS.find((s) => s.id === page.section)?.label ?? "Site")}">${navFor(page)}</nav>
  <article id="main" class="prose${wide ? " wide" : ""}">${html}${pager(page)}<p class="edit"><a href="${editUrl}" rel="noopener" target="_blank">Edit this page on GitHub</a> · <a href="${p}${page.slug}.md">View as Markdown</a></p></article>
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
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${p}favicon.ico" sizes="48x48">
<link rel="icon" href="${p}favicons/favicon-32x32.png" sizes="32x32" type="image/png">
<link rel="icon" href="${p}favicons/favicon-16x16.png" sizes="16x16" type="image/png">
<link rel="apple-touch-icon" href="${p}favicons/apple-touch-icon.png" sizes="180x180">
<link rel="manifest" href="${p}favicons/site.webmanifest">
<link rel="stylesheet" href="${p}assets/realm/realm.css">
<link rel="stylesheet" href="${p}assets/ui/theme.css">
<link rel="stylesheet" href="${p}assets/site.css">
<script>try{const t=localStorage.getItem("theme");if(t){document.documentElement.dataset.theme=t;document.querySelector('meta[name="color-scheme"]').content=t}}catch{}</script>
<script type="module" src="${p}assets/realm/realm.js"></script>
${preloads(html, p)}
</head>
<body>
<nav class="skip-links" aria-label="Skip links"><a class="skip" href="#main">Skip to content</a></nav>
<import-element from="${p}assets/ui/ui.html"></import-element>
<import-element from="${p}components/site.html"></import-element>
<import-element from="${p}unicons/unicons.html"></import-element>
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
    .replace(/<code-block[\s\S]*?<\/code-block>/g, " ")
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
  `Coding assistants can install the REALM agent skill with \`npx skills add realmorg/realm\`, or download it from ${SITE_URL}${BASE}skills/realm.zip. See [Use REALM with coding assistants](${SITE_URL}${BASE}docs/ai-skill.md).`,
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
copy(join(repo, "packages/unicons/dist"), "unicons");
copy(join(repo, "packages/unicons/site"), "unicons");
rmSync(join(out, "assets/realm/types"), { recursive: true, force: true });
for (const extra of ["package.json", "test", "node_modules", "playwright.config.ts"]) {
  rmSync(join(out, "examples", extra), { recursive: true, force: true });
}

// Each example page gets a Preview / Code switch. The code view shows the page as it is in the
// repository and every local file it loads, one tab each.
const PAGE_IMPORTS = [
  ...RELATIVE_IMPORTS,
  /<script\b[^>]*?\bsrc="([^"]+)"/g,
  /<link\b[^>]*?\bhref="([^"]+\.css)"/g,
];
const exampleSource = (files) =>
  [
    `<import-element from="${BASE}components/example-source.html"></import-element>`,
    "<example-source>",
    ...[...files].map(
      ([name, source]) =>
        `<template data-file="${escapeHtml(name)}">${highlight(source.trimEnd(), languageOf(name))}</template>`,
    ),
    "</example-source>",
  ].join("\n");
const examples = join(repo, "apps/examples");
// Example sources load REALM, REALM UI and Unicons from jsDelivr. The site serves its own copies
// instead, so its examples always run the code it ships. LIVE_CDN=1 keeps the jsDelivr URLs.
const toSiteCopies = (text) =>
  process.env.LIVE_CDN
    ? text
    : LIBRARIES.reduce((result, [local, cdn]) => result.replaceAll(cdn, `${BASE}${local}`), text);
for (const file of readdirSync(examples, { recursive: true })) {
  if (!/\.(html|js)$/.test(file)) continue;
  const source = readFileSync(join(examples, file), "utf8");
  let output = toSiteCopies(source);
  if (file.endsWith(".html") && source.includes("</body>")) {
    const path = file.split(sep).join("/");
    const files = collectFiles([[`examples/${path}`, posix.basename(path)]], PAGE_IMPORTS);
    output = output.replace("</body>", `${exampleSource(files)}\n</body>`);
  }
  writeFileSync(join(out, "examples", file), output);
}

// The agent skill: its raw files at /skills/realm/ and a download at /skills/realm.zip.
copy(join(repo, "skills/realm"), "skills/realm");
writeFileSync(join(out, "skills/realm.zip"), zipDirectory(join(repo, "skills/realm"), "realm"));

console.log(
  `Built ${pages.length} pages into ${relative(process.cwd(), out) || "."} (base ${BASE})`,
);
