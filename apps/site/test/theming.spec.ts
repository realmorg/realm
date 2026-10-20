import type { Page } from "@playwright/test";
import { expect, ready, test } from "./fixtures";

const open = async (page: Page) => {
  await page.goto("components/theming/");
  await ready(page, "theme-builder");
  const builder = page.locator("theme-builder");
  await expect(builder.locator(".tokens input")).toHaveCount(21);
  return builder;
};

const token = (page: Page, name: string) =>
  page
    .locator("theme-builder .tokens li")
    .filter({ has: page.locator("span", { hasText: new RegExp(`^--${name}$`) }) })
    .locator("input");

const pick = (page: Page, preset: string) =>
  page.locator("theme-builder .presets label", { hasText: preset }).click();

const mockClipboard = (page: Page, works: boolean) =>
  page.addInitScript((resolves) => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: (text: string) => {
          document.documentElement.dataset.copied = text;
          return resolves ? Promise.resolve() : Promise.reject(new DOMException("Denied"));
        },
      },
    });
  }, works);

test("the theming page lists the tokens and builds a theme", async ({ page, errors }) => {
  const builder = await open(page);
  await expect(page.locator(".sidebar a[aria-current=page]")).toHaveText("Theming");
  await expect(page.locator("h2", { hasText: "Colour tokens" })).toBeVisible();
  await expect(builder.getByRole("radio", { name: "REALM" })).toBeChecked();
  await expect(builder.locator(".preview")).toHaveAttribute("style", /--primary: #c4288c/);
  await expect(builder.locator(".preview ui-button").first()).toBeVisible();
  void errors;
});

test("a preset recolours the preview and the stylesheet", async ({ page, errors }) => {
  const builder = await open(page);
  await pick(page, "Ocean");
  await expect(builder.locator(".preview")).toHaveAttribute("style", /--primary: #0462d3/);
  await expect(token(page, "primary")).toHaveValue("#0462d3");
  await builder.getByRole("tab", { name: "CSS" }).click();
  const css = builder.locator("pre");
  await expect(css).toContainText("--primary: oklch(0.519 0.19 258.1);");
  await expect(css).toContainText(':root[data-theme="dark"] {');
  await expect(css).toContainText("@media (prefers-color-scheme: dark) {");
  await expect(css).toContainText("--sidebar-primary: oklch(0.519 0.19 258.1);");
  void errors;
});

test("light and dark colours are edited separately", async ({ page, errors }) => {
  const builder = await open(page);
  await token(page, "primary").fill("#ff0000");
  await expect(builder.locator(".preview")).toHaveAttribute("style", /--primary: #ff0000/);
  await expect(builder.getByRole("radio", { checked: true })).toHaveCount(0);

  const dark = builder.getByRole("button", { name: "Dark" });
  await dark.click();
  await expect(builder.locator(".preview")).toHaveAttribute("style", /color-scheme: dark/);
  await expect(token(page, "primary")).toHaveValue("#ee64b5");
  await dark.click();
  await expect(builder.locator(".preview")).toHaveAttribute("style", /color-scheme: dark/);

  await builder.getByRole("button", { name: "Light" }).click();
  await expect(token(page, "primary")).toHaveValue("#ff0000");
  void errors;
});

test("radius and font change the preview", async ({ page, errors }) => {
  const builder = await open(page);
  const radius = builder.getByRole("slider", { name: "Radius" });
  await radius.focus();
  await radius.press("End");
  await expect(builder.locator(".setting .value")).toHaveText("1.5rem");
  await expect(builder.locator(".preview")).toHaveAttribute("style", /--radius: 1.5rem/);
  const button = builder.locator(".preview ui-button").first().locator("button");
  expect(await button.evaluate((el) => getComputedStyle(el).borderTopLeftRadius)).toBe("22px");

  await builder.getByRole("combobox", { name: "Font" }).selectOption("serif");
  await expect(builder.locator(".preview")).toHaveAttribute("style", /--font-sans: ui-serif/);
  await builder.getByRole("tab", { name: "CSS" }).click();
  await expect(builder.locator("pre")).toContainText("--radius: 1.5rem;");
  await expect(builder.locator("pre")).toContainText("--font-sans: ui-serif");
  void errors;
});

test("the contrast tab flags text that is hard to read", async ({ page, errors }) => {
  const builder = await open(page);
  await builder.getByRole("tab", { name: "Contrast" }).click();
  const checks = builder.locator(".checks li");
  await expect(checks).toHaveCount(7);
  await expect(checks.first()).toContainText("--foreground on --background");
  await expect(checks.first().locator("ui-badge")).toHaveText("AA");

  await token(page, "primary-foreground").fill("#c4288c");
  const primary = checks.filter({ hasText: "--primary-foreground on --primary" });
  await expect(primary).toContainText("1.00:1");
  await expect(primary.locator("ui-badge")).toHaveText("Low");
  await expect(primary.locator("ui-badge")).toHaveAttribute("variant", "destructive");
  void errors;
});

test("copying the stylesheet confirms, then resets the button", async ({ page, errors }) => {
  await mockClipboard(page, true);
  const builder = await open(page);
  const copy = builder.locator(".toolbar ui-button").last();
  await copy.click();
  await expect(copy).toHaveText("Copied");
  const copied = await page.evaluate(() => document.documentElement.dataset.copied);
  expect(copied).toMatch(/^:root \{\n {2}--radius: 0.625rem;/);
  await expect(copy).toHaveText("Copy CSS", { timeout: 5000 });
  void errors;
});

test("a refused copy leaves the button as it was", async ({ page, errors }) => {
  await mockClipboard(page, false);
  const builder = await open(page);
  const copy = builder.locator(".toolbar ui-button").last();
  await copy.click();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset.copied))
    .toBeTruthy();
  await expect(copy).toHaveText("Copy CSS");
  void errors;
});

test("the theme is kept after a reload and reset restores the default", async ({
  page,
  errors,
}) => {
  const builder = await open(page);
  await pick(page, "Forest");
  await builder.getByRole("combobox", { name: "Font" }).selectOption("mono");
  await page.reload();
  await ready(page, "theme-builder");
  await expect(builder.getByRole("radio", { name: "Forest" })).toBeChecked();
  await expect(builder.locator(".preview")).toHaveAttribute("style", /--font-sans: ui-monospace/);

  await builder.getByRole("button", { name: "Reset" }).click();
  await expect(builder.getByRole("radio", { name: "REALM" })).toBeChecked();
  await expect(builder.locator(".preview")).toHaveAttribute("style", /--radius: 0.625rem/);
  await expect(builder.locator(".preview")).toHaveAttribute("style", /--font-sans: ui-sans-serif/);
  void errors;
});
