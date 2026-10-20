import { expect, type Page, test } from "./fixtures";

const visit = async (page: Page, path = "") => {
  await page.goto(`examples/dashboard/${path}`);
  await page.waitForFunction(() => document.querySelectorAll(":not(:defined)").length === 0);
};

// A page-initiated navigation discards the outgoing document before its coverage is read,
// so the request is recorded and aborted, which leaves the page in place.
const holdNavigation = async (page: Page, pattern: string) => {
  const requested: string[] = [];
  await page.route(pattern, (route) => {
    requested.push(route.request().url());
    return route.abort("aborted");
  });
  return requested;
};

const heading = (page: Page) => page.getByRole("heading", { level: 1 });
const toasts = (page: Page) => page.locator("ui-toaster li");
const accountButton = (page: Page) => page.locator("ui-dropdown-menu-trigger ui-button");

test.beforeEach(async ({ page }) => {
  await visit(page);
  await page.evaluate(() => localStorage.clear());
});

test("dashboard: the sidebar links to every page and marks the current one", async ({
  page,
  errors,
}) => {
  await visit(page);
  const nav = page.locator("ui-sidebar");
  for (const [label, path] of [
    ["Orders", /orders\.html$/],
    ["Customers", /customers\.html$/],
    ["Products", /products\.html$/],
    ["Settings", /settings\.html$/],
    ["Overview", /dashboard\/$/],
  ] as const) {
    await nav.getByRole("link", { name: label }).click();
    await expect(page).toHaveURL(path);
    await expect(heading(page)).toHaveText(label);
    await expect(heading(page)).toHaveCount(1);
    await expect(page.locator("ui-breadcrumb-page")).toHaveText(label);
    await expect(nav.getByRole("link", { name: label })).toHaveAttribute("aria-current", "page");
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
  }
  await visit(page, "orders.html");
  await page.getByRole("link", { name: "Acme Store" }).click();
  await expect(page).toHaveURL(/dashboard\/$/);
  void errors;
});

test("dashboard: the collapsed sidebar stays collapsed on other pages", async ({
  page,
  errors,
}) => {
  await visit(page);
  const sidebar = page.locator("ui-sidebar-layout");
  await expect(sidebar).toHaveJSProperty("collapsed", false);
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await expect(sidebar).toHaveJSProperty("collapsed", true);
  await page.getByRole("link", { name: "Customers" }).click();
  await expect(page).toHaveURL(/customers\.html$/);
  await page.waitForFunction(() => document.querySelectorAll(":not(:defined)").length === 0);
  await expect(sidebar).toHaveJSProperty("collapsed", true);
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  await expect(sidebar).toHaveJSProperty("collapsed", false);
  await visit(page, "products.html");
  await expect(sidebar).toHaveJSProperty("collapsed", false);
  void errors;
});

test("dashboard: Command-K searches the pages", async ({ page, errors }) => {
  await visit(page, "orders.html");
  const palette = page.getByRole("combobox", { name: /Go to a page/ });
  const requested = await holdNavigation(page, "**/dashboard/products.html");
  await page.keyboard.press("ControlOrMeta+k");
  await expect(palette).toBeVisible();
  await palette.fill("prod");
  await palette.press("Enter");
  await expect(palette).toBeHidden();
  await expect.poll(() => requested).toEqual([expect.stringMatching(/products\.html$/)]);
  void errors;
});

test("dashboard: a page picked with Command-K opens", async ({ page, errors }) => {
  await visit(page, "orders.html");
  const palette = page.getByRole("combobox", { name: /Go to a page/ });
  await page.keyboard.press("ControlOrMeta+k");
  await palette.fill("sett");
  await palette.press("Enter");
  await expect(page).toHaveURL(/settings\.html$/);
  await expect(heading(page)).toHaveText("Settings");
  void errors;
});

test("dashboard: the search button and both shortcuts open the page search", async ({
  page,
  errors,
}) => {
  await visit(page);
  const palette = page.getByRole("combobox", { name: /Go to a page/ });
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

test("dashboard: the account menu signs out and opens settings", async ({ page, errors }) => {
  await visit(page);
  const requested = await holdNavigation(page, "**/dashboard/settings.html");
  await accountButton(page).click();
  // The menu items expose their role through ElementInternals, which Playwright's role engine does not read.
  await page.locator("ui-menu-item", { hasText: "Log out" }).click();
  await expect(toasts(page).last()).toContainText("Signed out");
  await accountButton(page).click();
  await page.locator("ui-menu-item", { hasText: "Settings" }).click();
  await expect.poll(() => requested).toEqual([expect.stringMatching(/settings\.html$/)]);
  void errors;
});

test("dashboard: the overview shows stats, recent sales and switches the chart series", async ({
  page,
  errors,
}) => {
  await visit(page);
  await expect(page.getByRole("region", { name: "Key figures" }).locator("ui-card")).toHaveCount(4);
  await expect(page.getByRole("region", { name: "Key figures" })).toContainText("Revenue");
  await expect(page.locator(".sale")).toHaveCount(5);
  const chart = page.locator("ui-chart");
  await expect(chart).toHaveJSProperty("y", "desktop,mobile");
  await page.getByRole("tab", { name: "Mobile" }).click();
  await expect(chart).toHaveJSProperty("y", "mobile");
  await page.getByRole("tab", { name: "Desktop" }).click();
  await expect(chart).toHaveJSProperty("y", "desktop");
  await visit(page);
  await page.getByRole("link", { name: "All orders" }).click();
  await expect(page).toHaveURL(/orders\.html$/);
  void errors;
});

test("dashboard: orders are searched, filtered by status and paged", async ({ page, errors }) => {
  await visit(page, "orders.html");
  const rows = page.getByRole("table", { name: "Orders" }).locator("tbody tr");
  const summary = page.getByRole("status").filter({ hasText: /orders/ });
  const pagination = page.locator("ui-pagination");
  await expect(rows).toHaveCount(8);
  await expect(summary).toHaveText("Showing 1–8 of 36 orders");
  await expect(pagination).toHaveJSProperty("total", 5);

  await page.getByRole("button", { name: /Next/ }).click();
  await expect(pagination).toHaveJSProperty("page", 2);
  await expect(summary).toHaveText("Showing 9–16 of 36 orders");
  await expect(rows.first()).toContainText("ORD-1028");

  await page.getByRole("combobox", { name: "Status" }).selectOption("Refunded");
  await expect(pagination).toHaveJSProperty("page", 1);
  await expect(rows).toHaveCount(4);
  await expect(summary).toHaveText("Showing 1–4 of 4 orders");
  for (const row of await rows.all()) await expect(row).toContainText("Refunded");

  await page.getByRole("combobox", { name: "Status" }).selectOption("all");
  const search = page.getByRole("searchbox", { name: "Search orders" });
  await search.fill("olivia");
  await expect(rows).toHaveCount(3);
  await expect(summary).toHaveText("Showing 1–3 of 3 orders");
  await search.fill("ord-1001");
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText("ORD-1001");

  await search.fill("nobody");
  await expect(rows).toHaveCount(0);
  await expect(summary).toHaveText("No orders");
  await expect(page.getByText("No orders found")).toBeVisible();
  await expect(pagination).toHaveJSProperty("total", 1);
  void errors;
});

test("dashboard: an order opens in a dialog and moves to its next status", async ({
  page,
  errors,
}) => {
  await visit(page, "orders.html");
  await page.getByRole("button", { name: "View order ORD-1034" }).click();
  await expect(page.getByRole("dialog", { name: "Order ORD-1034" })).toBeVisible();
  // Slotted dialog content is not a DOM descendant of the <dialog>, so it is found from the host.
  const dialog = page.locator("orders-page ui-dialog");
  await expect(dialog).toContainText("Hannah Berg");
  await expect(dialog.getByRole("list", { name: "Items" }).getByRole("listitem")).toHaveCount(3);
  await expect(dialog.locator("ui-badge")).toHaveText("Pending");

  await dialog.getByRole("button", { name: "Mark as paid" }).click();
  await expect(dialog.locator("ui-badge")).toHaveText("Paid");
  await expect(toasts(page).last()).toContainText("ORD-1034 marked as paid");
  await dialog.getByRole("button", { name: "Mark as shipped" }).click();
  await expect(dialog.locator("ui-badge")).toHaveText("Shipped");
  await expect(dialog.getByRole("button", { name: /Mark as/ })).toHaveCount(0);
  await dialog.getByRole("button", { name: "Close" }).first().click();
  await expect(page.getByRole("dialog")).toBeHidden();

  const row = page.getByRole("row").filter({ hasText: "ORD-1034" });
  await expect(row.locator("ui-badge")).toHaveText("Shipped");
  await page.getByRole("button", { name: "View order ORD-1036" }).click();
  await expect(page.getByRole("dialog", { name: "Order ORD-1036" })).toBeVisible();
  await expect(dialog).toContainText("1 × Canvas tote");
  void errors;
});

test("dashboard: customers are searched and open in a sheet", async ({ page, errors }) => {
  await visit(page, "customers.html");
  const rows = page.getByRole("table", { name: "Customers" }).locator("tbody tr");
  const summary = page.getByRole("status").filter({ hasText: /customers/ });
  await expect(rows).toHaveCount(12);
  await expect(rows.first().locator("ui-avatar")).toHaveText("OM");
  await expect(summary).toHaveText("12 of 12 customers");

  const search = page.getByRole("searchbox", { name: "Search customers" });
  await search.fill("berlin");
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText("Noah Fischer");
  await expect(summary).toHaveText("1 of 12 customers");
  await search.fill("nobody");
  await expect(page.getByText("No customers found")).toBeVisible();
  await search.fill("");
  await expect(rows).toHaveCount(12);

  await page.getByRole("button", { name: "View Jackson Lee" }).click();
  await expect(page.getByRole("dialog", { name: "Jackson Lee" })).toBeVisible();
  const sheet = page.locator("customers-page ui-sheet");
  await expect(sheet.getByRole("link", { name: "jackson@example.com" })).toHaveAttribute(
    "href",
    "mailto:jackson@example.com",
  );
  await expect(
    sheet.getByRole("list", { name: "Order history" }).getByRole("listitem"),
  ).toHaveCount(3);
  await expect(sheet).toContainText("Toronto");
  await sheet.getByRole("button", { name: "Close" }).first().click();
  await expect(page.getByRole("dialog")).toBeHidden();
  void errors;
});

test("dashboard: products are added and edited through a validated form", async ({
  page,
  errors,
}) => {
  await visit(page, "products.html");
  const rows = page.getByRole("table", { name: "Products" }).locator("tbody tr");
  await expect(rows).toHaveCount(10);
  await expect(rows.filter({ hasText: "Desk lamp" }).locator("ui-badge")).toHaveText("Low stock");
  await expect(rows.filter({ hasText: "Throw blanket" }).locator("ui-badge")).toHaveText(
    "Out of stock",
  );
  await expect(rows.filter({ hasText: "Ceramic mug" }).locator("ui-badge")).toHaveText("In stock");

  await page.getByRole("button", { name: "Add product" }).click();
  await expect(page.getByRole("dialog", { name: "Add product" })).toBeVisible();
  const dialog = page.locator("products-page ui-dialog");
  const open = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Save" }).click();
  for (const message of [
    "Enter at least 2 characters.",
    "Choose a category.",
    "Enter a price above 0.",
    "Enter a whole number, 0 or more.",
  ])
    await expect(dialog.getByText(message)).toBeVisible();
  await expect(open).toBeVisible();

  await dialog.getByRole("textbox", { name: "Name" }).fill("Travel mug");
  await dialog.getByRole("combobox", { name: "Category" }).selectOption("Home");
  await dialog.getByRole("spinbutton", { name: "Price (USD)" }).fill("22.5");
  await dialog.getByRole("spinbutton", { name: "Stock" }).fill("1.5");
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(dialog.getByText("Enter a whole number, 0 or more.")).toBeVisible();
  await expect(dialog.getByText("Choose a category.")).toBeHidden();
  await dialog.getByRole("spinbutton", { name: "Stock" }).fill("3");
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(open).toBeHidden();
  await expect(toasts(page).last()).toContainText("Product added");
  await expect(rows).toHaveCount(11);
  await expect(rows.first()).toContainText("Travel mug");
  await expect(rows.first()).toContainText("$22.50");
  await expect(rows.first().locator("ui-badge")).toHaveText("Low stock");

  await page.getByRole("button", { name: "Edit Linen shirt" }).click();
  await expect(page.getByRole("dialog", { name: "Edit product" })).toBeVisible();
  await expect(dialog.getByRole("textbox", { name: "Name" })).toHaveValue("Linen shirt");
  await dialog.getByRole("spinbutton", { name: "Stock" }).fill("0");
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(open).toBeHidden();
  await expect(toasts(page).last()).toContainText("Product updated");
  await expect(rows).toHaveCount(11);
  await expect(rows.filter({ hasText: "Linen shirt" }).locator("ui-badge")).toHaveText(
    "Out of stock",
  );

  await page.getByRole("button", { name: "Add product" }).click();
  await expect(dialog.getByRole("textbox", { name: "Name" })).toHaveValue("");
  await dialog.getByRole("button", { name: "Cancel" }).click();
  await expect(open).toBeHidden();

  const search = page.getByRole("searchbox", { name: "Search products" });
  await search.fill("stationery");
  await expect(rows).toHaveCount(2);
  await search.fill("nothing");
  await expect(page.getByText("No products found")).toBeVisible();
  void errors;
});

test("dashboard: settings are validated, saved and kept after a reload", async ({
  page,
  errors,
}) => {
  await visit(page, "settings.html");
  const name = page.getByRole("textbox", { name: "Name" });
  const account = accountButton(page);
  await expect(account).toContainText("Sam Chen");

  await name.fill("");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(name).toBeFocused();
  expect(await name.evaluate((field: HTMLInputElement) => field.validity.valueMissing)).toBe(true);
  await expect(toasts(page)).toHaveCount(0);

  await name.fill("Ada Lovelace");
  await page.getByRole("combobox", { name: "Language" }).selectOption("de");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(toasts(page).last()).toContainText("Profile saved");
  await expect(account).toContainText("Ada Lovelace");
  await expect(account.locator("ui-avatar")).toHaveText("AL");

  const orders = page.getByRole("switch", { name: "New orders" });
  const push = page.getByRole("switch", { name: "Push alerts" });
  await expect(orders).toBeChecked();
  await expect(push).not.toBeChecked();
  await orders.click();
  await push.click();
  await page.getByRole("button", { name: "Save notifications" }).click();
  await expect(toasts(page).last()).toContainText("Notifications saved");

  await visit(page, "settings.html");
  await expect(name).toHaveValue("Ada Lovelace");
  await expect(page.getByRole("combobox", { name: "Language" })).toHaveValue("de");
  await expect(orders).not.toBeChecked();
  await expect(push).toBeChecked();
  await visit(page, "orders.html");
  await expect(account).toContainText("Ada Lovelace");
  void errors;
});
