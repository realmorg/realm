import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "./fixtures";

const REPO = fileURLToPath(new URL("../../../", import.meta.url));
const DIST = "https://realm.js.org/dist/";

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    if (entry === "node_modules" || entry === "dist" || entry.startsWith(".")) return [];
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

// Every realm.js.org/dist URL the docs, examples, READMEs and the agent skill tell people to load.
const documentedUrls = () => {
  const files = [
    ...["apps/site/content", "apps/examples", "skills/realm", "packages/unicons/site"].flatMap(
      (dir) => walk(join(REPO, dir)),
    ),
    ...["realm", "ui", "unicons"].map((name) => join(REPO, `packages/${name}/README.md`)),
  ].filter((file) => /\.(md|html|js)$/.test(file));
  // A URL cut short by a placeholder (meta/<set>.json) names no single file.
  const urls = files.flatMap((file) => {
    const text = readFileSync(file, "utf8");
    return [...text.matchAll(/https:\/\/realm\.js\.org\/dist\/[\w./-]+/g)].flatMap((match) => {
      const url = match[0].replace(/\.+$/, "");
      const next = text[match.index + match[0].length] ?? "";
      return url.endsWith("/") || "<{$".includes(next || " ") ? [] : [url];
    });
  });
  return [...new Set(urls)].sort();
};

test.describe("files under /dist/", () => {
  test("every file the docs load from realm.js.org/dist is part of the built site", async ({
    page,
  }) => {
    const urls = documentedUrls();
    expect(urls).toContain(`${DIST}realm.js`);
    expect(urls).toContain(`${DIST}ui/components/button.html`);
    expect(urls).toContain(`${DIST}unicons/unicons.html`);
    const missing: string[] = [];
    for (const url of urls) {
      const response = await page.request.get(`/dist/${url.slice(DIST.length)}`);
      if (!response.ok()) missing.push(url);
    }
    expect(missing).toEqual([]);
  });

  test("the runtime, REALM UI and Unicons are served at stable paths", async ({ page }) => {
    for (const [path, text] of [
      ["/dist/realm.js", "export"],
      ["/dist/index.js", "export"],
      ["/dist/compiler.js", "export"],
      ["/dist/realm.css", "custom-element"],
      ["/dist/ui/theme.css", "--spacing"],
      ["/dist/ui/ui.html", '<custom-element name="ui-button"'],
      ["/dist/ui/components/button.html", '<custom-element name="ui-button"'],
      ["/dist/unicons/unicons.html", '<custom-element name="u-icon">'],
      ["/dist/unicons/unicons.js", "export"],
      ["/assets/realm/realm.js", "export"],
      ["/assets/ui/ui.html", '<custom-element name="ui-button"'],
      ["/assets/ui/components/button.html", '<custom-element name="ui-button"'],
    ]) {
      const response = await page.request.get(path);
      expect(response.ok(), path).toBe(true);
      expect(await response.text(), path).toContain(text);
    }
  });

  test("a page outside the site runs REALM, REALM UI and Unicons from /dist/", async ({
    page,
    errors,
  }) => {
    const failed: string[] = [];
    page.on("response", (response) => {
      if (response.status() >= 400) failed.push(response.url());
    });
    await page.route("**/dist-page.html", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Loads REALM from /dist/</title>
  <link rel="stylesheet" href="/dist/realm.css">
  <link rel="stylesheet" href="/dist/ui/theme.css">
  <script type="module" src="/dist/realm.js"></script>
</head>
<body>
  <import-element from="/dist/ui/components/button.html"></import-element>
  <import-element from="/dist/unicons/unicons.html"></import-element>
  <custom-element name="click-counter">
    <script type="realm">
      const counter = useState({ count: 0 });

      function add() {
        counter.count += 1;
      }
    </script>
    <ui-button onclick="add()">Clicked <slot name="#counter.count">0</slot> times</ui-button>
  </custom-element>
  <click-counter></click-counter>
  <u-icon name="heart" label="Heart"></u-icon>
</body>
</html>`,
      }),
    );
    await page.goto("/dist-page.html");
    const button = page.getByRole("button", { name: "Clicked 0 times" });
    await expect(button).toBeVisible();
    await button.click();
    await expect(page.getByRole("button", { name: "Clicked 1 times" })).toBeVisible();
    await expect(page.locator("u-icon svg")).toBeVisible();
    expect(failed).toEqual([]);
    void errors;
  });
});
