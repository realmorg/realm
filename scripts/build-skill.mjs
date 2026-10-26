// Generates the parts of the REALM agent skill (skills/realm) that come from the repository:
// the REALM UI component reference, the design token list, the console message list, the
// Unicons set list and the package versions. Hand-written text lives between the markers.
//
//   node scripts/build-skill.mjs          write the files
//   node scripts/build-skill.mjs --check  exit 1 when the committed files are out of date

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repo = fileURLToPath(new URL("..", import.meta.url));
const skill = join(repo, "skills/realm");
const DIST = "https://realm.js.org/dist";
const SITE = "https://realm.js.org";
const UI_DIR = join(repo, "packages/ui/components");
const UI_DOCS = join(repo, "apps/site/content/components");

const read = (path) => readFileSync(join(repo, path), "utf8");
const version = (name) => JSON.parse(read(`packages/${name}/package.json`)).version;

const frontmatter = (text) => {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  const meta = {};
  for (const line of match?.[1].split("\n") ?? []) {
    const [key, ...rest] = line.split(":");
    meta[key.trim()] = rest.join(":").trim();
  }
  return { meta, body: match ? text.slice(match[0].length) : text };
};

// Site links are root-relative. In the skill they point at the live site.
const absoluteLinks = (text) =>
  text
    .replace(/\]\((\/[^)\s]*)\)/g, (_, path) => `](${SITE}${path})`)
    .replace(/\]\(([\w-]+)\.html\)/g, (_, name) => `](${SITE}/components/${name}/)`);

const dedent = (text) => {
  const lines = text.split("\n");
  const indent = Math.min(
    ...lines.filter((line) => line.trim()).map((line) => line.match(/^ */)[0].length),
  );
  return lines.map((line) => line.slice(indent)).join("\n");
};

// --- REALM UI ---------------------------------------------------------------------------

const uiFiles = readdirSync(UI_DIR)
  .filter((file) => file.endsWith(".html"))
  .sort()
  .map((file) => {
    const source = readFileSync(join(UI_DIR, file), "utf8");
    return {
      file,
      tags: [...source.matchAll(/<custom-element name="([\w-]+)"/g)].map(([, tag]) => tag),
      imports: [...source.matchAll(/<import-element from="\.\/([\w.-]+)"/g)].map(([, f]) => f),
    };
  });
const fileOfTag = new Map(uiFiles.flatMap(({ file, tags }) => tags.map((tag) => [tag, file])));

const uiImport = (file) => `<import-element from="${DIST}/ui/components/${file}"></import-element>`;
const UNICONS_IMPORT = `<import-element from="${DIST}/unicons/unicons.html"></import-element>`;

// The REALM UI files a piece of markup needs, so a snippet imports only those.
const filesUsedBy = (markup) =>
  [...new Set([...markup.matchAll(/(?<![\w-])ui-[a-z0-9-]+/g)].map(([tag]) => fileOfTag.get(tag)))]
    .filter(Boolean)
    .sort();

// The site's demos use small layout helpers (class="demo-…"). The skill shows plain markup.
const withoutDemoHelpers = (markup) => {
  let text = markup.replace(/ class="([^"]*)"/g, (_, value) => {
    const kept = value.split(/\s+/).filter((name) => name && !name.startsWith("demo-"));
    return kept.length ? ` class="${kept.join(" ")}"` : "";
  });
  for (;;) {
    const trimmed = text.trim();
    if (!trimmed.startsWith("<div>\n") || !trimmed.endsWith("\n</div>")) break;
    const inner = trimmed.slice("<div>\n".length, -"\n</div>".length);
    let depth = 0;
    let balanced = true;
    for (const [tag] of inner.matchAll(/<\/?div\b/g)) {
      depth += tag === "<div" ? 1 : -1;
      if (depth < 0) balanced = false;
    }
    if (!balanced || depth !== 0) break;
    text = dedent(inner);
  }
  return text.trim();
};

const usageSnippet = (markup) => {
  const body = withoutDemoHelpers(markup.replaceAll("{{root}}", `${SITE}/`));
  const toaster = /\btoast\b/.test(body) && !body.includes("<ui-toaster");
  const files = filesUsedBy(`${body}${toaster ? "<ui-toaster>" : ""}`);
  return [
    ...files.map(uiImport),
    ...(/<u-icon\b/.test(body) ? [UNICONS_IMPORT] : []),
    "",
    body,
    ...(toaster ? ["<ui-toaster></ui-toaster>"] : []),
  ].join("\n");
};

// The API section of a component page, without the accessibility notes (the docs page has them).
const apiSection = (body) => {
  const start = body.search(/^## API$/m);
  if (start === -1) return "";
  const rest = body.slice(start).replace(/^## API\n/, "");
  const end = rest.search(/^## /m);
  const api = end === -1 ? rest : rest.slice(0, end);
  return api.replace(/^### Accessibility\n[\s\S]*?(?=^### |(?![\s\S]))/m, "").trim();
};

const firstDemo = (body) => body.match(/^```html live[^\n]*\n([\s\S]*?)^```/m)?.[1];

const uiPages = readdirSync(UI_DOCS)
  .filter((file) => file.endsWith(".md"))
  .map((file) => ({ file, ...frontmatter(readFileSync(join(UI_DOCS, file), "utf8")) }))
  .filter(({ meta }) => meta.group !== "Overview")
  .map(({ file, meta, body }) => {
    const htmlFile = file.replace(/\.md$/, ".html");
    const source = uiFiles.find((entry) => entry.file === htmlFile);
    if (!source) throw new Error(`${file} documents ${htmlFile}, which does not exist.`);
    const demo = firstDemo(body);
    if (!demo) throw new Error(`${file} has no live demo to use as the usage snippet.`);
    return { slug: file.replace(/\.md$/, ""), meta, body, source, demo };
  })
  .sort((a, b) => Number(a.meta.order) - Number(b.meta.order) || a.slug.localeCompare(b.slug));

for (const { file, tags } of uiFiles) {
  if (tags.length && !uiPages.some((page) => page.source.file === file))
    throw new Error(`packages/ui/components/${file} has no page in apps/site/content/components.`);
}

const squeeze = (lines) =>
  lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const uiSection = (page) => {
  const { file, tags, imports } = page.source;
  return squeeze([
    `<a id="${page.slug}"></a>`,
    "",
    `## ${page.meta.title}`,
    "",
    `${page.meta.description} [Docs and demos](${SITE}/components/${page.slug}/).`,
    "",
    `- File: \`${file}\`, import with \`${uiImport(file)}\``,
    `- Tags: ${tags.map((tag) => `\`${tag}\``).join(", ")}`,
    ...(imports.length
      ? [`- Imports for you: ${imports.map((name) => `\`${name}\``).join(", ")}`]
      : []),
    "",
    "```html runnable",
    usageSnippet(page.demo),
    "```",
    "",
    absoluteLinks(apiSection(page.body)),
  ]);
};

const uiComponents = () => {
  const intro = [
    "# REALM UI components",
    "",
    "<!-- Generated by scripts/build-skill.mjs from packages/ui/components and apps/site/content/components. Do not edit. -->",
    "",
    `Every \`ui-*\` component in \`@realmorg/ui\` ${version("ui")}: its file, tags, a usage snippet and its API. This file is long. Find the component in the index, then read only its lines (or search for its heading, such as \`## Dialog\`).`,
    "",
    "Load the theme once per page, then either the whole bundle or one file per component. Each file imports the files it depends on, and every file is fetched once.",
    "",
    "```html",
    `<link rel="stylesheet" href="${DIST}/ui/theme.css">`,
    "",
    "<!-- everything -->",
    `<import-element from="${DIST}/ui/ui.html"></import-element>`,
    "",
    "<!-- or only what the page uses -->",
    uiImport("button.html"),
    uiImport("dialog.html"),
    "```",
    "",
    "Conventions shared by every component:",
    "",
    '- Attributes are typed props. Variants and sizes are attributes: `<ui-button variant="outline" size="sm">`.',
    "- Compound parts place themselves. `<ui-dialog-title>` goes inside `<ui-dialog-header>` with no `slot` attribute.",
    "- Form controls are form-associated: they submit with `name`, reset, validate and follow `<fieldset disabled>`.",
    "- Events use native names where one fits (`change`, `input`, `toggle`, `select`, `close`, `cancel`), so `onchange` works anywhere.",
    '- Style from outside with `::part(name)`, the theme tokens and states such as `ui-button:state(attr-variant-is-ghost)`. Do not put `style="…"` on `ui-*` elements.',
    "",
    "## Index",
    "",
  ];
  const sections = uiPages.map((page) => ({ page, text: uiSection(page) }));
  const groups = [...new Set(uiPages.map((page) => page.meta.group))];
  const indexLength = groups.reduce(
    (sum, group) => sum + 5 + uiPages.filter((page) => page.meta.group === group).length,
    0,
  );
  let line = intro.length + indexLength + 1;
  const lines = new Map();
  for (const { page, text } of sections) {
    const count = text.split("\n").length;
    lines.set(page, `${line}-${line + count - 1}`);
    line += count + 1;
  }
  const index = groups.flatMap((group) => [
    `### ${group}`,
    "",
    "| Component | Lines | File | Tags |",
    "| --- | --- | --- | --- |",
    ...uiPages
      .filter((page) => page.meta.group === group)
      .map(
        (page) =>
          `| [${page.meta.title}](#${page.slug}) | ${lines.get(page)} | \`${page.source.file}\` | ${page.source.tags.map((tag) => `\`${tag}\``).join(", ")} |`,
      ),
    "",
  ]);
  return `${[...intro, ...index, ...sections.map(({ text }) => `${text}\n`)].join("\n").trimEnd()}\n`;
};

// --- Generated regions in hand-written files --------------------------------------------

const themeTokens = () => {
  const root = read("packages/ui/theme.css").match(/^:root \{\n([\s\S]*?)\n\}/m)[1];
  const tokens = [...root.matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm)].map(([, name, value]) => [
    name,
    value.trim().replace(/\s+/g, " "),
  ]);
  return [
    "| Token | Light value |",
    "| --- | --- |",
    ...tokens.map(([name, value]) => `| \`${name}\` | \`${value.replaceAll("|", "\\|")}\` |`),
  ].join("\n");
};

const consoleMessages = () => {
  const { body } = frontmatter(read("apps/site/content/reference/console.md"));
  return absoluteLinks(
    body
      .trimStart()
      .replace(/^# .*\n+/, "")
      .replace(/^REALM writes[^\n]*\n+/m, ""),
  )
    .replace(/^## /gm, "### ")
    .trim();
};

const iconSets = () => {
  const sets = JSON.parse(read("packages/unicons/dist/sets.json"));
  return [
    "| `set` | Name | Icons | License |",
    "| --- | --- | --- | --- |",
    ...sets.map((set) => `| \`${set.id}\` | ${set.name} | ${set.count} | ${set.license} |`),
  ].join("\n");
};

const versions = () =>
  `Written for REALM \`${version("realm")}\`, REALM UI \`${version("ui")}\` and Unicons \`${version("unicons")}\`. The tags load the latest build from \`realm.js.org/dist\`.`;

const REGIONS = {
  "SKILL.md": { versions },
  "references/styling.md": { tokens: themeTokens },
  "references/pitfalls.md": { console: consoleMessages },
  "references/unicons.md": { sets: iconSets },
};

const fill = (text, regions, path) => {
  let result = text;
  for (const [name, generate] of Object.entries(regions)) {
    const pattern = new RegExp(
      `(<!-- generated:${name} -->\\n)[\\s\\S]*?(<!-- /generated:${name} -->)`,
    );
    if (!pattern.test(result)) throw new Error(`${path} has no generated:${name} markers.`);
    result = result.replace(pattern, (_, open, close) => `${open}${generate()}\n${close}`);
  }
  return result;
};

// --- Write or check ---------------------------------------------------------------------

const outputs = new Map([
  [join(skill, "references/ui-components.md"), uiComponents()],
  ...Object.entries(REGIONS).map(([path, regions]) => {
    const file = join(skill, path);
    return [file, fill(readFileSync(file, "utf8"), regions, path)];
  }),
]);

const check = process.argv.includes("--check");
const stale = [...outputs].filter(
  ([file, text]) => !existsSync(file) || readFileSync(file, "utf8") !== text,
);
if (check) {
  if (stale.length) {
    console.error(
      `The agent skill is out of date. Run \`pnpm skill\` and commit the result:\n${stale
        .map(([file]) => `  ${relative(repo, file)}`)
        .join("\n")}`,
    );
    process.exit(1);
  }
  console.log("The agent skill is up to date.");
} else {
  for (const [file, text] of stale) writeFileSync(file, text);
  console.log(
    stale.length
      ? `Updated ${stale.map(([file]) => relative(repo, file)).join(", ")}`
      : "The agent skill is up to date.",
  );
}
