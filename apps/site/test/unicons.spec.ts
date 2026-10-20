import { expect, test } from "./fixtures";

test.describe("unicons catalog", () => {
  test("the catalog renders icons from the site under /unicons/", async ({ page, errors }) => {
    const missing: string[] = [];
    page.on("response", (response) => {
      if (response.status() >= 400) missing.push(response.url());
    });
    await page.goto("/unicons/");
    await expect(page).toHaveTitle(/Unicons/);
    await expect(page.locator("li button")).toHaveCount(240);
    await expect(page.locator("icon-catalog .grid u-icon svg").first()).toBeVisible();
    await expect(page.getByRole("radio")).toHaveCount(31);
    await expect(page.getByRole("img", { name: "Unicons" })).toBeVisible();
    expect(missing).toEqual([]);
    expect(errors).toEqual([]);
  });

  test("searching the catalog filters the icons", async ({ page }) => {
    await page.goto("/unicons/");
    await expect(page.locator("li button")).toHaveCount(240);
    await page.getByPlaceholder("Search icons").fill("alarm-clock");
    await expect(page.locator("li button")).toHaveCount(5);
    await expect(page.locator("icon-catalog .grid u-icon svg")).toHaveCount(5);
    await expect(page.getByText("5 of 1541 icons")).toBeVisible();
  });

  test("the published component loads from the site", async ({ page }) => {
    const response = await page.request.get("/unicons/unicons.html");
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain('<custom-element name="u-icon">');
    const sets = await (await page.request.get("/unicons/sets.json")).json();
    expect(sets).toHaveLength(31);
  });

  test("pages preload REALM, unicons.js and the icon chunks they show", async ({ page }) => {
    const chunks: string[] = [];
    page.on("request", (request) => {
      const path = new URL(request.url()).pathname;
      if (path.startsWith("/unicons/icons/")) chunks.push(path);
    });
    await page.goto("/");
    await page.waitForFunction(() =>
      [...document.querySelectorAll("main u-icon")].every((icon) =>
        icon.shadowRoot?.querySelector("svg"),
      ),
    );
    const preloaded = await page
      .locator('link[rel="modulepreload"]')
      .evaluateAll((links) =>
        links.map((link) => new URL((link as HTMLLinkElement).href).pathname),
      );
    expect(preloaded).toContain("/unicons/unicons.js");
    expect(preloaded.some((path) => path.startsWith("/assets/realm/chunks/"))).toBe(true);
    expect(chunks.length).toBeGreaterThan(0);
    expect(new Set(chunks).size).toBe(chunks.length);
    expect(chunks.filter((path) => !preloaded.includes(path))).toEqual([]);
  });
});
