import type { Page } from "@playwright/test";
import { expect, ready, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.goto("examples/notes/");
  await ready(page, "notes-app");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await ready(page, "notes-app");
  await expect(page.getByRole("textbox", { name: "Note text" })).toBeAttached();
});

const list = (page: Page) => page.getByRole("navigation", { name: "Notes" }).getByRole("button");
const preview = (page: Page) => page.getByRole("article", { name: "Preview" });
const editor = (page: Page) => page.getByRole("textbox", { name: "Note text" });

test("notes: edits render a live Markdown preview and persist", async ({ page, errors }) => {
  await expect(list(page)).toHaveText([/Welcome to Notes/, /Groceries/, /Standup/]);
  await expect(preview(page).getByRole("heading", { name: "Welcome to Notes" })).toBeVisible();

  await list(page).filter({ hasText: "Groceries" }).click();
  await expect(page.getByRole("heading", { level: 2 })).toHaveText("Groceries");
  await editor(page).fill(
    "# Weekend shopping\n\nBuy **oat milk** and *bread*.\n\n1. Market\n2. Bakery\n\n> Cash only\n\n`code` [site](https://example.com)",
  );
  const view = preview(page);
  await expect(view.getByRole("heading", { name: "Weekend shopping" })).toBeVisible();
  await expect(view.locator("strong")).toHaveText("oat milk");
  await expect(view.locator("em")).toHaveText("bread");
  await expect(view.getByRole("listitem")).toHaveText(["Market", "Bakery"]);
  await expect(view.locator("blockquote")).toHaveText("Cash only");
  await expect(view.getByRole("link", { name: "site" })).toHaveAttribute(
    "href",
    "https://example.com",
  );
  await expect(list(page).nth(1)).toContainText("Weekend shopping");

  await page.reload();
  await ready(page, "notes-app");
  await expect(list(page).nth(1)).toContainText("Weekend shopping");
  await expect(list(page).nth(1)).toHaveAttribute("aria-current", "true");
  await expect(editor(page)).toHaveValue(/Buy \*\*oat milk\*\*/);
  void errors;
});

test("notes: unsafe Markdown is escaped and sanitised", async ({ page, errors }) => {
  await editor(page).fill(
    '# Safe\n\n<img src=x onerror="window.hacked=1"> [bad](javascript:alert(1)) <script>window.hacked=2</script>',
  );
  const view = preview(page);
  await expect(view.getByRole("heading", { name: "Safe" })).toBeVisible();
  await expect(view.locator("img, script")).toHaveCount(0);
  await expect(view.getByRole("link")).toHaveCount(0);
  await expect(view).toContainText('<img src=x onerror="window.hacked=1">');
  expect(await page.evaluate(() => "hacked" in window)).toBe(false);
  void errors;
});

test("notes: create, search, pin and delete with a confirmation", async ({ page, errors }) => {
  await page.getByRole("button", { name: /^New/ }).click();
  await expect(editor(page)).toBeFocused();
  await expect(list(page)).toHaveCount(4);
  await page.keyboard.type("Trip ideas\nLisbon in spring");
  await expect(page.getByRole("heading", { level: 2 })).toHaveText("Trip ideas");

  const search = page.getByRole("searchbox", { name: "Search notes" });
  await search.fill("lisbon");
  await expect(list(page)).toHaveText([/Trip ideas/]);
  await expect(page.getByText("1 note", { exact: true })).toBeVisible();
  await search.fill("nothing like this");
  await expect(page.getByText("No notes match your search.")).toBeVisible();
  await expect(page.getByText("0 notes")).toBeVisible();
  await search.fill("");

  const pin = page.getByRole("button", { name: "Pin note" });
  await expect(pin).toHaveAttribute("aria-pressed", "false");
  await pin.click();
  await expect(pin).toHaveAttribute("aria-pressed", "true");
  await expect(list(page).nth(0)).toContainText("Trip ideas");
  await expect(list(page).nth(0)).toHaveAttribute("data-pinned", "");

  await page.getByRole("button", { name: "Delete note" }).click();
  const dialog = page.getByRole("alertdialog", { name: "Delete this note?" });
  await expect(dialog).toHaveAccessibleDescription(
    "“Trip ideas” will be removed from this browser.",
  );
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(dialog).toBeHidden();
  await expect(list(page)).toHaveCount(4);

  await page.getByRole("button", { name: "Delete note" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(list(page)).toHaveCount(3);
  await expect(list(page).filter({ hasText: "Trip ideas" })).toHaveCount(0);
  await expect(list(page).nth(0)).toHaveAttribute("aria-current", "true");
  await expect(page.getByRole("heading", { level: 2 })).toHaveText("Welcome to Notes");

  for (let count = 3; count > 0; count--) {
    await page.getByRole("button", { name: "Delete note" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(list(page)).toHaveCount(count - 1);
  }
  await expect(page.getByRole("heading", { name: "No note selected" })).toBeVisible();
  void errors;
});

test("notes: keyboard shortcuts create, pin, move and search", async ({ page, errors }) => {
  await page.locator("body").click({ position: { x: 5, y: 5 } });
  await page.keyboard.press("/");
  const search = page.getByRole("searchbox", { name: "Search notes" });
  await expect(search).toBeFocused();
  await expect(search).toHaveValue("");

  await page.keyboard.press("Alt+ArrowDown");
  await expect(list(page).nth(1)).toHaveAttribute("aria-current", "true");
  await page.keyboard.press("Alt+ArrowDown");
  await page.keyboard.press("Alt+ArrowDown");
  await expect(list(page).nth(2)).toHaveAttribute("aria-current", "true");
  await page.keyboard.press("Alt+ArrowUp");
  await expect(list(page).nth(1)).toHaveAttribute("aria-current", "true");

  const groceries = list(page).filter({ hasText: "Groceries" });
  await page.keyboard.press("Alt+KeyP");
  await expect(groceries).toHaveAttribute("data-pinned", "");
  await expect(page.getByRole("button", { name: "Pin note" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.keyboard.press("Alt+KeyP");
  await expect(groceries).not.toHaveAttribute("data-pinned", "");

  await page.keyboard.press("Alt+KeyN");
  await expect(editor(page)).toBeFocused();
  await expect(list(page)).toHaveCount(4);
  await page.keyboard.press("Control+KeyN");
  await page.keyboard.type("/path");
  await expect(editor(page)).toBeFocused();
  await expect(editor(page)).toHaveValue("# /path");
  await expect(list(page)).toHaveCount(4);
  void errors;
});

test("notes: write, split and preview views", async ({ page, errors }) => {
  const write = page.getByRole("button", { name: "Write", exact: true });
  const split = page.getByRole("button", { name: "Split", exact: true });
  await expect(split).toHaveAttribute("aria-pressed", "true");
  await expect(editor(page)).toBeVisible();
  await expect(preview(page)).toBeVisible();

  await write.click();
  await expect(preview(page)).toBeHidden();
  await expect(editor(page)).toBeVisible();
  await page.locator("notes-app").getByRole("button", { name: "Preview", exact: true }).click();
  await expect(editor(page)).toBeHidden();
  await expect(preview(page)).toBeVisible();

  await page.reload();
  await ready(page, "notes-app");
  await expect(
    page.locator("notes-app").getByRole("button", { name: "Preview", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(editor(page)).toBeHidden();
  await split.click();
  await expect(editor(page)).toBeVisible();
  void errors;
});
