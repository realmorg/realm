import { expect, test } from "./fixture";

// index.html, not the directory, so the component script is named index.html#icon-catalog for
// coverage.
const CATALOG = "/unicons/index.html";

test.describe("catalog", () => {
  test("lists a set, filters by search and switches sets", async ({ page }) => {
    await page.goto(CATALOG);
    const tiles = page.locator("li button");
    await expect(tiles).toHaveCount(240);
    await expect(page.getByRole("radio")).toHaveCount(31);
    await expect(page.getByRole("radio", { name: /^Lucide/ })).toBeChecked();

    await page.getByPlaceholder("Search icons").fill("alarm-clock");
    await expect(tiles).toHaveCount(5);
    await expect(page.getByText("5 of 1541 icons")).toBeVisible();
    await expect(page.locator("icon-catalog .grid u-icon svg")).toHaveCount(5);

    await page.getByPlaceholder("Search icons").fill("");
    await page.getByRole("radio", { name: /^Flat Color Icons/ }).check();
    await expect(tiles).toHaveCount(240);
    await expect(page.locator("icon-catalog .grid u-icon").first()).toHaveAttribute("set", "fc");
    await expect(page.getByRole("link", { name: "Flat Color Icons" })).toBeVisible();
  });

  test("shows more results on demand", async ({ page }) => {
    await page.goto(CATALOG);
    await expect(page.locator("li button")).toHaveCount(240);
    await page.getByRole("button", { name: "Show more" }).click();
    await expect(page.locator("li button")).toHaveCount(480);
  });

  test("clicking an icon copies its markup", async ({ page, browserName }) => {
    if (browserName === "chromium")
      await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(CATALOG);
    await page.getByPlaceholder("Search icons").fill("house-plus");
    await page.getByRole("button", { name: "house-plus" }).click();
    const markup = '<u-icon set="lu" name="house-plus" size="32"></u-icon>';
    await expect(page.getByRole("status")).toContainText(markup);
    if (browserName === "chromium")
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(markup);
  });

  test("the copied markup carries the chosen size and colour", async ({ page }) => {
    await page.goto(CATALOG);
    await page.getByPlaceholder("Search icons").fill("house-plus");
    const slider = page.getByRole("slider", { name: "Size" });
    await slider.focus();
    await slider.press("End");
    await page.getByRole("button", { name: "house-plus" }).click();
    await expect(page.getByRole("status")).toContainText(
      '<u-icon set="lu" name="house-plus" size="64"></u-icon>',
    );

    await page.getByRole("button", { name: "REALM pink" }).click();
    await page.getByRole("button", { name: "house-plus" }).click();
    const pink = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--primary").trim(),
    );
    await expect(page.getByRole("status")).toContainText(
      `<u-icon set="lu" name="house-plus" size="64" color="${pink}"></u-icon>`,
    );

    await page.getByLabel("Custom colour").fill("#ff0000");
    await page.getByRole("button", { name: "house-plus" }).click();
    await expect(page.getByRole("status")).toContainText(
      '<u-icon set="lu" name="house-plus" size="64" color="#ff0000"></u-icon>',
    );
  });

  test("shows the markup to copy by hand when the clipboard refuses", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: () => Promise.reject(new DOMException("Denied", "NotAllowedError")) },
      });
    });
    await page.goto(CATALOG);
    await page.getByPlaceholder("Search icons").fill("house-plus");
    await page.getByRole("button", { name: "house-plus" }).click();
    await expect(page.getByRole("status")).toHaveText(
      '<u-icon set="lu" name="house-plus" size="32"></u-icon>',
    );
    await expect(page.getByRole("status").getByRole("img", { name: "Copied" })).toBeHidden();
  });

  test("highlights the install snippet and the copied markup", async ({ page }) => {
    await page.goto(CATALOG);
    const snippet = page.locator(".intro html-code");
    await expect(snippet).toContainText('<u-icon set="tb" name="heart"></u-icon>');
    await expect(snippet.locator(".tag").filter({ hasText: /^u-icon$/ })).toHaveCount(2);
    await expect(snippet.locator(".attribute").filter({ hasText: /^src$/ })).toHaveCount(1);
    await expect(snippet.locator(".string").first()).toHaveText('"module"');
    const [tag, plain] = await snippet.evaluate((el) => {
      const code = el.shadowRoot?.querySelector("code") as Element;
      return [
        getComputedStyle(code.querySelector(".tag") as Element).color,
        getComputedStyle(code).color,
      ];
    });
    expect(tag).not.toBe(plain);

    await page.getByPlaceholder("Search icons").fill("house-plus");
    await page.getByRole("button", { name: "house-plus" }).click();
    const copied = page.getByRole("status").locator("html-code");
    await expect(copied.locator(".tag")).toHaveText(["u-icon", "u-icon"]);
    await expect(copied.locator(".string")).toHaveText(['"lu"', '"house-plus"', '"32"']);
  });

  test("keeps the current icons when a set's icon list fails to load", async ({ page }) => {
    await page.route("**/meta/fc.json", (route) => route.abort());
    await page.goto(CATALOG);
    await expect(page.locator("li button")).toHaveCount(240);
    const failed = page.waitForEvent("requestfailed");
    await page.getByRole("radio", { name: /^Flat Color Icons/ }).click();
    await failed;
    await expect(page.locator("icon-catalog .grid u-icon").first()).toHaveAttribute("set", "lu");
    await expect(page.getByText("1541 of 1541 icons")).toBeVisible();
  });

  test("switching sets quickly shows the last set chosen", async ({ page }) => {
    let release = () => {};
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route("**/meta/fc.json", async (route) => {
      await held;
      await route.continue();
    });
    await page.goto(CATALOG);
    await expect(page.locator("li button")).toHaveCount(240);
    await page.getByRole("radio", { name: /^Flat Color Icons/ }).check();
    await page.getByRole("radio", { name: /^Tabler Icons/ }).check();
    await expect(page.locator("icon-catalog .grid u-icon").first()).toHaveAttribute("set", "tb");
    const fc = page.waitForResponse("**/meta/fc.json");
    release();
    await fc;
    await page.evaluate(() => new Promise(requestAnimationFrame));
    await expect(page.locator("icon-catalog .grid u-icon").first()).toHaveAttribute("set", "tb");
    await expect(page.getByRole("link", { name: "Tabler Icons" })).toBeVisible();
  });

  test("size and colour controls restyle the icons", async ({ page }) => {
    await page.goto(CATALOG);
    const icon = page.locator("icon-catalog .grid u-icon").first();
    await expect(icon).toHaveAttribute("size", "32");
    await page.locator('input[type="range"]').fill("48");
    await expect(icon).toHaveAttribute("size", "48");
    await expect.poll(async () => (await icon.boundingBox())?.width).toBe(48);
    await page.locator('input[type="color"]').fill("#ff0000");
    await expect(icon).toHaveAttribute("color", "#ff0000");
    await expect
      .poll(() => icon.locator("svg").evaluate((el) => getComputedStyle(el).stroke))
      .toBe("rgb(255, 0, 0)");
    await expect(page.locator(".custom .dot")).toBeVisible();
    await expect(page.locator(".custom u-icon")).toBeHidden();
  });

  test("colour swatches follow the theme and start on the text colour", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto(CATALOG);
    const icon = page.locator("icon-catalog .grid u-icon").first();
    await expect(icon.locator("svg")).toBeVisible();
    const text = page.getByRole("button", { name: "Text colour" });
    await expect(text).toHaveAttribute("aria-pressed", "true");
    expect(await icon.evaluate((el) => getComputedStyle(el).color)).toBe(
      await page.evaluate(() => getComputedStyle(document.body).color),
    );

    await page.getByRole("button", { name: "REALM pink" }).click();
    await expect(icon).toHaveAttribute("color", "var(--primary)");
    await expect(text).toHaveAttribute("aria-pressed", "false");
    const pink = await icon.evaluate((el) => getComputedStyle(el).color);
    expect(pink).not.toBe(await page.evaluate(() => getComputedStyle(document.body).color));

    await page.getByRole("button", { name: "Muted" }).click();
    await expect(icon).toHaveAttribute("color", "var(--muted-foreground)");
    await page.getByRole("button", { name: "Muted" }).click();
    await expect(icon).not.toHaveAttribute("color", /./);
    await expect(text).toHaveAttribute("aria-pressed", "true");
  });

  test("shows one heart from eight sets and the size of every set", async ({ page }) => {
    await page.goto(CATALOG);
    const specimen = page.locator(".specimen li");
    await expect(specimen).toHaveCount(8);
    await expect(specimen.locator("u-icon svg")).toHaveCount(8);
    await expect(page.getByRole("radio", { name: "Lucide lu 1,541" })).toBeChecked();
    await expect(page.getByRole("radio", { name: "Phosphor Icons pi 9,072" })).not.toBeChecked();
  });

  test("the set list scrolls with the page instead of trapping the wheel", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(CATALOG);
    await expect(page.locator("li button")).toHaveCount(240);
    const aside = page.locator("icon-catalog aside");
    expect(
      await aside.evaluate((el) => [
        el.scrollHeight - el.clientHeight,
        getComputedStyle(el).overflowY,
      ]),
    ).toEqual([0, "visible"]);
    const list = page.getByRole("group", { name: /^Icon sets/ });
    const box = await list.boundingBox();
    await page.mouse.move((box?.x ?? 0) + 40, 600);
    const before = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
  });

  test("keeps the end of the set list in view while the icons scroll", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(CATALOG);
    await expect(page.locator("li button")).toHaveCount(240);
    await page.getByRole("button", { name: "Show more" }).click();
    await expect(page.locator("li button")).toHaveCount(480);
    await page.evaluate(() => scrollTo(0, 4000));
    await expect(page.getByRole("radio", { name: /^Weather Icons/ })).toBeInViewport();
  });

  test("marks the chosen set with a check and arrow keys move the choice", async ({ page }) => {
    await page.goto(CATALOG);
    const lucide = page.locator("icon-catalog .sets label").filter({ hasText: "Lucide" });
    await expect(lucide.locator(".check")).toBeVisible();
    await expect(
      page
        .locator("icon-catalog .sets label")
        .filter({ hasText: "Tabler Icons" })
        .locator(".check"),
    ).toBeHidden();
    expect(await lucide.evaluate((el) => getComputedStyle(el).boxShadow)).toBe("none");

    await page.getByRole("radio", { name: /^Lucide/ }).focus();
    await page.keyboard.press("ArrowDown");
    const material = page.getByRole("radio", { name: /^Material Design icons/ });
    await expect(material).toBeChecked();
    await expect(material).toBeFocused();
    await expect(page.locator("icon-catalog .grid u-icon").first()).toHaveAttribute("set", "md");
    await expect(lucide.locator(".check")).toBeHidden();
  });

  test("fits a phone without scrolling sideways", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(CATALOG);
    await expect(page.locator("li button")).toHaveCount(240);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    ).toBe(0);
    await expect(page.getByRole("radio")).toHaveCount(0);
    const sets = page.getByRole("combobox", { name: "Icon set" });
    await expect(sets).toHaveValue("lu");
    await sets.scrollIntoViewIfNeeded();
    await sets.selectOption("tb");
    await expect(page.locator("icon-catalog .grid u-icon").first()).toHaveAttribute("set", "tb");
    await expect(sets.locator("option:checked")).toHaveAttribute(
      "label",
      "Tabler Icons (tb), 6,146",
    );
    await expect(sets).toBeInViewport();
  });
});
