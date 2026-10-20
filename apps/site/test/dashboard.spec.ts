import { expect, ready, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.goto("examples/dashboard/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await ready(page, "dashboard-app");
});

test("dashboard: navigate, collapse the sidebar, search, chart tabs and paginate", async ({
  page,
  errors,
}) => {
  const crumb = page.locator("ui-breadcrumb-page");
  await expect(crumb).toHaveText("Dashboard");
  await page.getByRole("link", { name: "Settings" }).click();
  await expect(crumb).toHaveText("Settings");
  await expect(page.locator("ui-toaster li").last()).toContainText("Opened Settings");

  const sidebar = page.locator("ui-sidebar-layout");
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await expect(sidebar).toHaveJSProperty("collapsed", true);
  await page.reload();
  await ready(page, "dashboard-app");
  await expect(sidebar).toHaveJSProperty("collapsed", true);
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await expect(sidebar).toHaveJSProperty("collapsed", false);

  await page.keyboard.press("ControlOrMeta+k");
  const palette = page.getByRole("combobox");
  await expect(palette).toBeVisible();
  await palette.fill("anal");
  await palette.press("Enter");
  await expect(palette).toBeHidden();
  await expect(crumb).toHaveText("Analytics");

  await page.getByRole("tab", { name: "Mobile" }).click();
  await expect(page.locator("ui-chart")).toHaveJSProperty("y", "mobile");

  const rows = page.locator("ui-table").getByRole("row");
  const first = await rows.nth(1).textContent();
  await page.getByRole("button", { name: "Next ›" }).click();
  await expect(rows.nth(1)).not.toHaveText(first ?? "");
  await expect(page.locator("ui-pagination")).toHaveJSProperty("page", 2);
  void errors;
});

test("dashboard: the search button and both shortcuts open the command palette", async ({
  page,
  errors,
}) => {
  const palette = page.getByRole("combobox");
  await page.getByRole("button", { name: /Search…/ }).click();
  await expect(palette).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(palette).toBeHidden();
  await page.keyboard.press("k");
  await expect(palette).toBeHidden();
  for (const shortcut of ["Meta+k", "Control+K"]) {
    await page.keyboard.press(shortcut);
    await expect(palette).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(palette).toBeHidden();
  }
  void errors;
});

test("dashboard: the account menu opens the profile and signs out", async ({ page, errors }) => {
  const toasts = page.locator("ui-toaster li");
  const crumb = page.locator("ui-breadcrumb-page");
  for (const [item, message] of [
    ["Profile", "Opening profile"],
    ["Log out", "Signed out"],
  ]) {
    await page.getByRole("button", { name: "shadcn" }).click();
    // The menu items expose their role through ElementInternals, which Playwright's role engine does not read.
    await page.locator("ui-menu-item", { hasText: item as string }).click();
    await expect(toasts.last()).toContainText(message as string);
  }
  await expect(crumb).toHaveText("Dashboard");
  void errors;
});
