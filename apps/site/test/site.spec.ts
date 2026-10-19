import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const pages: { title: string; url: string }[] = JSON.parse(
  readFileSync(new URL("../dist/search-index.json", import.meta.url), "utf8"),
);
const SECTIONS = ["", "docs/", "reference/", "components/", "examples/", "blog/"];
const sectionOf = (url: string) => SECTIONS.findLast((section) => url.startsWith(section)) ?? "";

for (const section of SECTIONS) {
  test(`every page in ${section || "the root"} loads without errors`, async ({ page, errors }) => {
    test.setTimeout(240_000);
    for (const entry of pages.filter((item) => sectionOf(item.url) === section)) {
      await page.goto(entry.url);
      await page.waitForFunction(() => document.querySelectorAll(":not(:defined)").length === 0);
      await expect(page.locator("h1").first()).toBeVisible();
      expect(errors, entry.url).toEqual([]);
    }
  });
}

const AUDITED = [
  "",
  "docs/",
  "docs/quick-start/",
  "components/",
  "components/button/",
  "reference/",
];

for (const url of AUDITED) {
  test(`${url || "home"} has no accessibility violations`, async ({ page, errors }) => {
    await page.goto(url);
    await page.waitForFunction(() => document.querySelectorAll(":not(:defined)").length === 0);
    await page.waitForTimeout(300);
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(
      violations.map(
        ({ id, nodes }) => `${id}: ${nodes.map((node) => node.target.join(" > ")).join(", ")}`,
      ),
    ).toEqual([]);
    void errors;
  });
}

// A page-initiated navigation would discard the outgoing document before its coverage is read,
// so the request to the target is recorded and aborted, which leaves the page in place.
const holdNavigation = async (page: Page, pattern: string) => {
  const requested: string[] = [];
  await page.route(pattern, (route) => {
    requested.push(route.request().url());
    return route.abort("aborted");
  });
  return requested;
};

test("search finds a page and opens it", async ({ page, errors }) => {
  await page.goto("docs/");
  const requested = await holdNavigation(page, "**/docs/fetching/");
  await page.getByRole("button", { name: /Search docs/ }).click();
  const input = page.getByRole("combobox");
  await expect(input).toBeFocused();
  await input.fill("fetching");
  await input.press("Enter");
  await expect.poll(() => requested).toEqual([expect.stringMatching(/\/docs\/fetching\/$/)]);
  void errors;
});

test("search opens with Command-K and Control-K", async ({ page, errors }) => {
  await page.goto("docs/");
  await page.waitForFunction(() => document.querySelectorAll(":not(:defined)").length === 0);
  const input = page.getByRole("combobox");
  await page.keyboard.press("k");
  await expect(input).toBeHidden();
  for (const shortcut of ["Meta+k", "Control+K"]) {
    await page.keyboard.press(shortcut);
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(input).toBeHidden();
  }
  void errors;
});

test("the theme toggle follows the system and remembers the choice", async ({ page, errors }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("docs/");
  const toLight = page.getByRole("button", { name: "Switch to light theme" });
  await toLight.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const toDark = page.getByRole("button", { name: "Switch to dark theme" });
  await toDark.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");
  await page.emulateMedia({ colorScheme: "light" });
  await page.reload();
  await expect(page.getByRole("button", { name: "Switch to light theme" })).toBeVisible();

  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage is disabled.", "SecurityError");
    };
  });
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");
  void errors;
});

test("the docs menu opens on small screens and closes when a link is followed", async ({
  page,
  errors,
}) => {
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto("docs/");
  const nav = page.getByRole("navigation", { name: "Docs" });
  await expect(nav).toBeHidden();
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(nav).toBeVisible();
  await nav.getByRole("heading", { name: "Getting started" }).click();
  await expect(nav).toBeVisible();
  const requested = await holdNavigation(page, "**/docs/installation/");
  await nav.getByRole("link", { name: "Installation" }).click();
  await expect(nav).toBeHidden();
  await expect.poll(() => requested).toHaveLength(1);
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(nav).toBeVisible();
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(nav).toBeHidden();
  void errors;
});

test("code blocks copy their source and report a failed copy", async ({ page, errors }) => {
  await page.goto("docs/quick-start/");
  await page.evaluate(() => {
    const copied: string[] = [];
    Object.assign(window, { copied });
    navigator.clipboard.writeText = async (text: string) => {
      copied.push(text);
    };
  });
  const block = page.locator("code-block").first();
  await block.hover();
  await block.getByRole("button", { name: "Copy code" }).click();
  const source = await block.locator("pre").textContent();
  expect(await page.evaluate(() => (window as unknown as { copied: string[] }).copied)).toEqual([
    source,
  ]);
  const done = block.locator("is-visible svg");
  await expect(done).toBeVisible();
  await expect(done).toBeHidden({ timeout: 3000 });

  await page.evaluate(() => {
    navigator.clipboard.writeText = () =>
      Promise.reject(new DOMException("Denied", "NotAllowedError"));
  });
  await block.getByRole("button", { name: "Copy code" }).click();
  await expect(page.getByText("Copy failed")).toBeVisible();
  void errors;
});

test("llms.txt lists every section and links Markdown copies", async ({ request }) => {
  const text = await (await request.get("llms.txt")).text();
  for (const heading of ["## Docs", "## Components", "## Examples"])
    expect(text).toContain(heading);
  const markdown = await request.get("docs/quick-start.md");
  expect(markdown.ok()).toBe(true);
});
