import type { Page } from "@playwright/test";
import { expect, ready, test } from "./fixtures";

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

const open = async (page: Page, path: string) => {
  await page.goto(path);
  await ready(page, "example-source");
  return page.locator("example-source");
};

test("an example page switches between its preview and its source files", async ({
  page,
  errors,
}) => {
  const source = await open(page, "examples/todo/");
  const panel = source.getByRole("region", { name: "Source code" });
  const preview = source.getByRole("button", { name: "Preview" });
  const code = source.getByRole("button", { name: "Code" });
  await expect(panel).toBeHidden();
  await expect(preview).toHaveAttribute("aria-pressed", "true");

  await code.click();
  await expect(panel).toBeVisible();
  await expect(code).toHaveAttribute("aria-pressed", "true");
  const tabs = source.getByRole("tab");
  await expect(tabs).toHaveText(["index.html", "todo-app.html", "todos.js"]);
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  const shown = source.getByRole("tabpanel");
  await expect(shown).toContainText(
    'src="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"',
  );
  await expect(shown).not.toContainText("defineStore");

  await source.getByRole("tab", { name: "todos.js" }).click();
  await expect(shown.locator(".shiki")).toContainText("defineStore");
  await expect(shown).not.toContainText("<!doctype html>");

  await page.keyboard.press("Tab");
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();

  await code.click();
  await preview.click();
  await expect(panel).toBeHidden();
  await expect(page.locator("todo-app")).toBeVisible();
  await expect(page.getByText("defineStore")).toHaveCount(0);
  void errors;
});

test("the source view copies the open file", async ({ page, errors }) => {
  await mockClipboard(page, true);
  const source = await open(page, "examples/todo/");
  await source.getByRole("button", { name: "Code" }).click();
  await source.getByRole("tab", { name: "todo-app.html" }).click();
  const copy = source.getByRole("button", { name: "Copy" });
  await copy.click();
  await expect(source.getByRole("button", { name: "Copied" })).toBeVisible();
  const copied = await page.evaluate(() => document.documentElement.dataset.copied);
  expect(copied).toContain('<custom-element name="todo-app">');

  await source.getByRole("tab", { name: "index.html" }).click();
  await expect(source.getByRole("button", { name: "Copy" })).toBeVisible();
  void errors;
});

test("a refused copy keeps the copy button as it was", async ({ page, errors }) => {
  await mockClipboard(page, false);
  const source = await open(page, "examples/todo/");
  await source.getByRole("button", { name: "Code" }).click();
  await source.getByRole("button", { name: "Copy" }).click();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset.copied))
    .toBeTruthy();
  await expect(source.getByRole("button", { name: "Copy" })).toBeVisible();
  void errors;
});

test("each page of a multi-page example lists its own files", async ({ page, errors }) => {
  const source = await open(page, "examples/dashboard/orders.html");
  await source.getByRole("button", { name: "Code" }).click();
  await expect(source.getByRole("tab")).toHaveText([
    "orders.html",
    "components/dashboard-shell.html",
    "data.js",
    "components/orders-page.html",
  ]);
  void errors;
});
