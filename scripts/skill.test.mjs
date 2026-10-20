// Checks the REALM agent skill (skills/realm) against the code it describes.
//
//   node --test scripts/skill.test.mjs
//
// Static checks compare names in the skill with the runtime source. The browser checks run
// every ```html runnable block in Chromium with the local builds of REALM, REALM UI and
// Unicons standing in for the CDN, and fail on console errors, REALM warnings, failed
// requests and custom elements that never get defined. Run `pnpm build` first.

import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { after, before, describe, test } from "node:test";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const repo = fileURLToPath(new URL("..", import.meta.url));
const skill = join(repo, "skills/realm");
const src = join(repo, "packages/realm/src");
const read = (path) => readFileSync(path, "utf8");

const docs = new Map(
  ["SKILL.md", ...readdirSync(join(skill, "references")).map((file) => `references/${file}`)]
    .filter((path) => path.endsWith(".md"))
    .map((path) => [path, read(join(skill, path))]),
);
const doc = (path) => docs.get(path) ?? assert.fail(`${path} is missing`);
const handWritten = [...docs].filter(([path]) => path !== "references/ui-components.md");

const source = (file) => read(join(src, file));
const allSource = readdirSync(src)
  .filter((file) => file.endsWith(".ts"))
  .map(source)
  .join("\n");
const runtimeStrings = new Set(
  [...allSource.matchAll(/"([^"\\\n]*)"/g)].flatMap(([, text]) => [text, ...text.split(/\s+/)]),
);
const attributesRead = (file) =>
  new Set(
    [...source(file).matchAll(/(?:get|has)Attribute\("([\w-]+)"\)/g)].map(([, name]) => name),
  );

// The first table after a heading, as rows of cells.
const tableAfter = (markdown, heading) => {
  const start = markdown.indexOf(`\n${heading}\n`);
  assert.notEqual(start, -1, `missing heading "${heading}"`);
  const lines = markdown.slice(start + heading.length + 2).split("\n");
  const first = lines.findIndex((line) => line.startsWith("|"));
  const rows = [];
  for (const line of lines.slice(first + 2)) {
    if (!line.startsWith("|")) break;
    rows.push(
      line
        .slice(1, -1)
        .split(/(?<!\\)\|/)
        .map((cell) => cell.trim()),
    );
  }
  return rows;
};
const codeSpans = (text) =>
  [...text.replace(/^```[\s\S]*?^```/gm, "").matchAll(/`([^`\n]+)`/g)].map(([, code]) => code);
const names = (codes) => codes.filter((code) => /^[\w-]+$/.test(code));
const firstCellNames = (rows) => rows.flatMap(([cell]) => codeSpans(cell));

describe("skill format", () => {
  test("SKILL.md has valid frontmatter and stays short", () => {
    const text = doc("SKILL.md");
    const match = text.match(/^---\n([\s\S]*?)\n---\n/);
    assert.ok(match, "frontmatter");
    const name = match[1].match(/^name: (.+)$/m)?.[1];
    const description = match[1].match(/^description: (.+)$/m)?.[1];
    assert.equal(name, basename(skill));
    assert.match(name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(description && description.length <= 1024, "description of 1 to 1024 characters");
    assert.ok(text.split("\n").length < 500, "SKILL.md under 500 lines");
  });

  test("every relative link points at a file in the skill", () => {
    for (const [path, text] of docs) {
      for (const [, target] of text.matchAll(/\]\(((?!https?:|#)[^)\s]+)\)/g)) {
        const file = join(skill, path.includes("/") ? "references" : "", target.split("#")[0]);
        assert.ok(existsSync(file), `${path} links to ${target}`);
      }
    }
  });

  test("hand-written files use no em dashes", () => {
    for (const [path, text] of handWritten) assert.ok(!text.includes("—"), path);
  });

  test("every CDN URL points at a file in the packages", () => {
    for (const [path, text] of docs) {
      for (const [url, pkg, rest] of text.matchAll(
        /https:\/\/cdn\.jsdelivr\.net\/npm\/@realmorg\/([\w-]+)@alpha\/([\w./-]+[\w])/g,
      )) {
        if (rest.includes("<")) continue;
        assert.ok(existsSync(join(repo, "packages", pkg, rest)), `${path}: ${url}`);
      }
    }
  });
});

describe("names match the runtime", () => {
  const HELPERS = source("assemble.ts")
    .match(/HELPERS =\s*"([^"]+)"/)[1]
    .split(" ");
  const EXPORTS = [...source("index.ts").matchAll(/(?:\{|,)\s*(?:\w+ as )?(\w+)/g)].map(
    ([, name]) => name,
  );

  test("api.md documents every script helper, and only real names", () => {
    const headings = [...doc("references/api.md").matchAll(/^### (.+)$/gm)].flatMap(([, heading]) =>
      codeSpans(heading),
    );
    for (const name of headings)
      assert.ok(HELPERS.includes(name) || EXPORTS.includes(name), `api.md documents ${name}`);
    for (const helper of HELPERS) assert.ok(headings.includes(helper), `api.md misses ${helper}`);
    for (const name of [
      "start",
      "importDefinitions",
      "defineComponent",
      "flush",
      "toRaw",
      "untrack",
    ])
      assert.ok(headings.includes(name), `api.md misses the export ${name}`);
  });

  test("api.md lists every prop builder and modifier", () => {
    const props = source("props.ts");
    const builders = [
      ...props.match(/export const prop = \{([\s\S]*?)\};/)[1].matchAll(/^ {2}(\w+):/gm),
    ];
    const modifiers = [...props.matchAll(/^ {2}(\w+)\([^)]*\) \{\n {4}return this\.#with/gm)];
    const api = doc("references/api.md");
    for (const [, name] of builders) assert.ok(api.includes(`prop.${name}(`), `prop.${name}`);
    for (const [, name] of modifiers) assert.ok(api.includes(`.${name}(`), `.${name}()`);
  });

  test("markup.md elements and definition attributes exist", () => {
    const markup = doc("references/markup.md");
    for (const [cell] of tableAfter(markup, "## Elements"))
      for (const [, tag] of cell.matchAll(/<([\w-]+)/g))
        assert.ok(runtimeStrings.has(tag), `element ${tag}`);
    const definition = new Set(
      [...source("definition.ts").matchAll(/\bel\.(?:get|has)Attribute\("([\w-]+)"\)/g)].map(
        ([, name]) => name,
      ),
    );
    const defined = firstCellNames(tableAfter(markup, "## The definition"));
    assert.deepEqual(new Set(defined), definition);
  });

  test("markup.md conditions, lists, slots and focusgroup match the runtime", () => {
    const markup = doc("references/markup.md");
    const bindings = source("bindings.ts");
    const comparators = bindings.match(/COMPARATORS = \[([^\]]+)\]/)[1].match(/[a-z]+/g);
    const documented = firstCellNames(
      tableAfter(markup, "## Conditions: `<is-visible>` and `<is-hidden>`"),
    ).flatMap((code) => code.match(/^(\w+)=/)?.[1] ?? []);
    assert.deepEqual(new Set(documented), new Set(comparators));

    const listAttributes = names(
      firstCellNames(tableAfter(markup, "## Lists: `<repeat-list>` and `repeat`")),
    );
    for (const name of listAttributes)
      assert.ok(runtimeStrings.has(name), `list attribute ${name}`);

    const modes = Object.keys(
      Object.fromEntries(
        [
          ...bindings
            .match(/RENDER_SLOT: [^\n]*= \{([\s\S]*?)\n\};/)[1]
            .matchAll(/^ {2}"?([\w-]+)"?:/gm),
        ].map(([, name]) => [name]),
      ),
    );
    const slotModes = firstCellNames(tableAfter(markup, "## Value slots"));
    for (const mode of modes.filter((mode) => mode !== "text"))
      assert.ok(slotModes.includes(mode), `slot mode ${mode}`);

    const tokens = firstCellNames(tableAfter(markup, "## `focusgroup`"));
    for (const token of tokens) assert.ok(source("focusgroup.ts").includes(`"${token}"`), token);
  });

  test("fetching.md attributes, modes and events match fetch.ts", () => {
    const fetching = doc("references/fetching.md");
    const read = new Set([...attributesRead("fetch.ts"), ...attributesRead("time.ts")]);
    const documented = firstCellNames(tableAfter(fetching, "## Attributes"));
    for (const name of documented) assert.ok(read.has(name), `fetch attribute ${name}`);
    for (const name of read)
      assert.ok(codeSpans(fetching).includes(name), `fetching.md misses the attribute ${name}`);

    const fetchTs = source("fetch.ts");
    const renderModes = fetchTs.match(/RENDER_MODES = new Set\(\s*"([^"]+)"/)[1].split(" ");
    assert.deepEqual(
      new Set(firstCellNames(tableAfter(fetching, "### render modes"))),
      new Set(renderModes),
    );
    const intoModes = [
      "replace",
      ...[...fetchTs.match(/const INTO[^=]*= \{([\s\S]*?)\n\};/)[1].matchAll(/^ {2}(\w+):/gm)].map(
        ([, name]) => name,
      ),
    ];
    assert.deepEqual(
      new Set(firstCellNames(tableAfter(fetching, "### into modes"))),
      new Set(intoModes),
    );

    const events = new Set(
      [...fetchTs.matchAll(/\bdispatch\(([^,]+),/g)].flatMap(([, type]) =>
        [...type.matchAll(/"(\w+)"/g)].map(([, name]) => name),
      ),
    );
    events.delete("TimeoutError");
    assert.deepEqual(new Set(firstCellNames(tableAfter(fetching, "## Events"))), events);
  });

  test("imports.md documents the attributes of <import-element>", () => {
    const documented = firstCellNames(
      tableAfter(doc("references/imports.md"), "## `<import-element>`"),
    );
    for (const name of attributesRead("loader.ts"))
      assert.ok(
        documented.some((code) => code.startsWith(name)),
        `import-element ${name}`,
      );
  });

  test("pitfalls.md explains every warning REALM prints", () => {
    const pitfalls = doc("references/pitfalls.md");
    const templates = [
      ...allSource.matchAll(/\bwarn\(\s*(`[^`]*`|"[^"]*")/g),
      ...allSource.matchAll(/new Error\(\s*(`[^`]*`|"[^"]*")/g),
    ].map(([, literal]) => literal.slice(1, -1));
    for (const template of templates) {
      const longest = template
        .split(/\$\{(?:[^{}]|\{[^}]*\})*\}/)
        .sort((a, b) => b.length - a.length)[0]
        .trim();
      if (longest.length < 12) continue;
      assert.ok(pitfalls.includes(longest), `pitfalls.md misses "${longest}"`);
    }
  });

  test("every ui-* tag in the skill exists", () => {
    const CSS_FONTS = new Set(["ui-sans-serif", "ui-serif", "ui-monospace", "ui-rounded"]);
    const tags = new Set(
      readdirSync(join(repo, "packages/ui/components")).flatMap((file) =>
        [
          ...read(join(repo, "packages/ui/components", file)).matchAll(
            /<custom-element name="([\w-]+)"/g,
          ),
        ].map(([, tag]) => tag),
      ),
    );
    for (const [path, text] of docs)
      for (const [, tag] of text.matchAll(/(?:<\/?|`)(ui-[a-z0-9]+(?:-[a-z0-9]+)*)(?![\w-])/g))
        assert.ok(tags.has(tag) || CSS_FONTS.has(tag), `${path}: ${tag}`);
  });

  test("every <u-icon> name exists in its set", () => {
    const meta = (set) =>
      new Set(JSON.parse(read(join(repo, "packages/unicons/dist/meta", `${set}.json`))));
    for (const [path, text] of docs)
      for (const [element] of text.matchAll(/<u-icon\b[^>]*>/g)) {
        const name = element.match(/\sname="([\w-]+)"/)?.[1];
        if (!name) continue;
        const set = element.match(/\sset="([\w-]+)"/)?.[1] ?? "lu";
        assert.ok(meta(set).has(name), `${path}: ${element}`);
      }
  });
});

// --- Runnable blocks in Chromium ------------------------------------------------------------

const ORIGIN = "http://localhost:4188";
const CDN = "https://cdn.jsdelivr.net/npm/";
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
};

const blocks = [...docs].flatMap(([path, text]) =>
  [...text.matchAll(/^```(\w+)([^\n]*)\n([\s\S]*?)^```/gm)].map(([, language, info, code], n) => ({
    path,
    language,
    runnable: /\brunnable\b/.test(info),
    file: info.match(/\bfile=(\S+)/)?.[1],
    code,
    n,
  })),
);

// Pages without their own <head> get the CDN tags a page needs, like the docs show.
const page = (code) => {
  if (/^<!doctype/i.test(code.trim())) return code;
  const ui = /<ui-/.test(code) && !/<import-element\b[^>]*@realmorg\/ui@/.test(code);
  const icons = /<u-icon\b/.test(code) && !/@realmorg\/unicons@/.test(code);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Skill block</title>
<link rel="stylesheet" href="${CDN}@realmorg/realm@alpha/dist/realm.css">
<link rel="stylesheet" href="${CDN}@realmorg/ui@alpha/dist/theme.css">
<script type="module" src="${CDN}@realmorg/realm@alpha/dist/realm.js"></script>
</head>
<body>
${ui ? `<import-element from="${CDN}@realmorg/ui@alpha/dist/ui.html"></import-element>` : ""}
${icons ? `<import-element from="${CDN}@realmorg/unicons@alpha/dist/unicons.html"></import-element>` : ""}
${code}
</body>
</html>`;
};

const served = new Map();
const pages = [];
for (const block of blocks) {
  const folder = `/${basename(block.path, ".md").toLowerCase()}/`;
  if (block.file) served.set(`${folder}${block.file}`, block.code);
  if (!block.runnable) continue;
  const path = block.file ? `${folder}${block.file}` : `${folder}block-${block.n}.html`;
  if (!block.file) served.set(path, page(block.code));
  pages.push({ ...block, url: `${ORIGIN}${path}` });
}

const PRODUCTS = [
  { id: 1, name: "Desk lamp", price: "$39" },
  { id: 2, name: "Notebook", price: "$12" },
  { id: 3, name: "Pen set", price: "$18" },
];
const API = {
  "GET /api/products": (url) => {
    const query = (url.searchParams.get("q") ?? "").toLowerCase();
    return [200, PRODUCTS.filter((product) => product.name.toLowerCase().includes(query))];
  },
  "POST /api/signup": () => [201, { id: 1 }],
};

const fulfil = async (route) => {
  const request = route.request();
  const url = new URL(request.url());
  const respond = (status, body, type) =>
    route.fulfill({
      status,
      body,
      headers: { "content-type": type, "access-control-allow-origin": "*" },
    });
  if (url.href.startsWith(CDN)) {
    const [, pkg, rest] = url.pathname.match(/^\/npm\/@realmorg\/([\w-]+)@alpha\/(.+)$/) ?? [];
    const file = pkg && join(repo, "packages", pkg, rest);
    if (!file || !existsSync(file)) return respond(404, "Not found", "text/plain");
    return respond(200, readFileSync(file), TYPES[extname(file)] ?? "application/octet-stream");
  }
  if (url.origin === ORIGIN) {
    const api = API[`${request.method()} ${url.pathname}`];
    if (api) {
      const [status, data] = api(url);
      return respond(status, JSON.stringify(data), "application/json");
    }
    if (url.pathname === "/favicon.ico") return respond(204, "", "image/x-icon");
    const text = served.get(url.pathname);
    if (text === undefined) return respond(404, "Not found", "text/plain");
    return respond(200, text, TYPES[extname(url.pathname)] ?? "text/plain");
  }
  return route.abort();
};

// Small interactions for the recipes, run after the page settles.
const INTERACTIONS = {
  "todo-app": async (tab) => {
    await tab.getByRole("textbox", { name: "New todo" }).fill("Buy milk");
    await tab.getByRole("button", { name: "Add" }).click();
    await tab.getByText("1 item left").waitFor();
    await tab.getByRole("checkbox", { name: "Buy milk" }).check();
    await tab.getByText("0 items left").waitFor();
  },
  "product-list": async (tab) => {
    await tab.getByText("Desk lamp").waitFor();
    await tab.getByRole("searchbox", { name: "Search products" }).fill("note");
    await tab.getByText("Desk lamp").waitFor({ state: "detached" });
    await tab.getByText("Notebook").waitFor();
    await tab.getByRole("searchbox", { name: "Search products" }).fill("zzz");
    await tab.getByText("No products found").waitFor();
  },
  "signup-form": async (tab) => {
    await tab.getByRole("textbox", { name: "Email" }).fill("ada@example.com");
    await tab.locator("#signup-password input").fill("analytical");
    await tab.locator("#signup-confirm input").fill("different");
    await tab.getByText("The passwords do not match.").waitFor();
    await tab.locator("#signup-confirm input").fill("analytical");
    await tab.getByRole("checkbox", { name: "I agree to the terms" }).check();
    await tab.getByRole("button", { name: "Create account" }).click();
    await tab.getByText("Account created").waitFor();
  },
  "project-settings": async (tab) => {
    await tab.getByRole("button", { name: "Rename" }).click();
    await tab.getByRole("textbox", { name: "Name" }).fill("Acme shop");
    await tab.getByRole("button", { name: "Save" }).click();
    await tab.getByText("Project renamed").waitFor();
    await tab.locator("strong", { hasText: "Acme shop" }).waitFor();
    await tab.getByRole("button", { name: "Delete" }).click();
    await tab.locator("ui-alert-dialog-action").getByRole("button", { name: "Delete" }).click();
    await tab.getByText("This project is scheduled for deletion.").waitFor();
  },
  "settings-page": async (tab) => {
    await tab.getByRole("textbox", { name: "Display name" }).fill("Grace Hopper");
    await tab.getByText("Signed in as Grace Hopper").waitFor();
  },
};

describe("runnable blocks run in Chromium", () => {
  let browser;
  before(async () => {
    browser = await chromium.launch();
  });
  after(async () => {
    await browser?.close();
  });

  test("the skill has runnable blocks", () => {
    assert.ok(pages.length > 70, `${pages.length} runnable blocks`);
  });

  for (const block of pages) {
    test(`${block.path} block ${block.n + 1}${block.file ? ` (${block.file})` : ""}`, async () => {
      const context = await browser.newContext();
      await context.route("**/*", fulfil);
      const tab = await context.newPage();
      const problems = [];
      tab.on("console", (message) => {
        if (message.type() === "error" || message.type() === "warning")
          problems.push(`console.${message.type()}: ${message.text()}`);
      });
      tab.on("pageerror", (error) => problems.push(`page error: ${error.message}`));
      tab.on("requestfailed", (request) => problems.push(`request failed: ${request.url()}`));
      try {
        await tab.goto(block.url);
        const undefinedTags = await tab.evaluate(async () => {
          const SKIP = new Set(["is-visible", "is-hidden", "repeat-list"]);
          const missing = () => {
            const tags = new Set();
            const visit = (root) => {
              for (const el of root.querySelectorAll("*")) {
                if (
                  el.localName.includes("-") &&
                  !SKIP.has(el.localName) &&
                  !customElements.get(el.localName)
                )
                  tags.add(el.localName);
                if (el.shadowRoot) visit(el.shadowRoot);
              }
            };
            visit(document);
            return [...tags];
          };
          const deadline = performance.now() + 10_000;
          while (missing().length && performance.now() < deadline)
            await new Promise((resolve) => setTimeout(resolve, 50));
          await new Promise((resolve) => setTimeout(resolve, 300));
          return missing();
        });
        assert.deepEqual(undefinedTags, [], "every custom element is defined");
        for (const [tag, interact] of Object.entries(INTERACTIONS))
          if (new RegExp(`<${tag}[\\s>]`).test(block.code)) await interact(tab);
        assert.deepEqual(problems, [], "no console errors or warnings");
      } finally {
        await context.close();
      }
    });
  }
});
