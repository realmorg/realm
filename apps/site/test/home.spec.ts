import { expect, ready, recordLayoutShifts, takeLayoutShift, test } from "./fixtures";

const defined = (page: import("@playwright/test").Page) =>
  page.waitForFunction(() => document.querySelectorAll(":not(:defined)").length === 0);

test("the home page loads without layout shifts", async ({ page, errors, browserName }) => {
  test.skip(browserName !== "chromium", "Layout shift entries are Chromium only.");
  await recordLayoutShifts(page);
  await page.goto("");
  await defined(page);
  await page.waitForTimeout(500);
  expect(await takeLayoutShift(page)).toBeLessThan(0.01);
  void errors;
});

test("the home page links to the quick start and the examples", async ({ page, errors }) => {
  await page.goto("");
  await expect(page.locator(".hero").getByRole("link", { name: "Get started" })).toHaveAttribute(
    "href",
    /docs\/quick-start\/$/,
  );
  await expect(page.locator(".hero").getByRole("link", { name: "Examples" })).toHaveAttribute(
    "href",
    /examples\/$/,
  );
  void errors;
});

test("the home demos run", async ({ page, errors }) => {
  await page.goto("");
  await ready(page, "click-counter");
  const counter = page.locator("click-counter").first();
  await counter.getByRole("button", { name: /Clicked/ }).click();
  await expect(counter.locator("ui-button").first()).toHaveText("Clicked 1 time");

  const tabs = page.locator(".demo-tabs");
  const show = (name: string) => tabs.getByRole("tab", { name, exact: true }).click();

  await ready(page, "todo-list");
  const todos = page.locator("todo-list");
  await todos.getByRole("textbox", { name: "New todo" }).fill("Write the docs");
  await todos.getByRole("button", { name: "Add" }).click();
  await expect(todos.locator("li")).toHaveCount(3);
  await expect(todos.getByText("2 left")).toBeVisible();

  await show("Fetch");
  const shelf = page.locator("book-shelf");
  await shelf.getByRole("button", { name: "Load books" }).click();
  await expect(shelf.locator("li")).toHaveCount(4);
  await expect(shelf.locator("li").first()).toContainText("Dune by Frank Herbert");

  await show("Forms");
  await ready(page, "signup-form");
  const signup = page.locator("signup-form");
  await signup.getByRole("textbox", { name: "Email" }).fill("ada@example.com");
  await signup.getByRole("button", { name: "Sign up" }).click();
  await expect(signup.locator("pre")).toContainText('"email": "ada@example.com"');
  await expect(signup.locator("pre")).toContainText('"updates": "on"');

  await show("Files");
  await ready(page, "profile-card");
  const ada = page.locator("profile-card").first();
  await expect(ada).toContainText("AL");
  await ada.getByRole("button", { name: "Follow" }).click();
  await expect(ada.locator("ui-button")).toHaveText("Following");
  await expect(ada.locator("ui-button")).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Launch" }).click();
  await expect(page.locator("ui-toaster li").last()).toContainText("Launched");

  const icons = page.locator("section[aria-labelledby=ui-kit] .icon-row u-icon");
  await expect(icons).toHaveCount(6);
  for (const icon of await icons.all()) await expect(icon.locator("svg")).toBeAttached();
  void errors;
});

test("the server-rendered section shows templates and the component they render", async ({
  page,
  errors,
}) => {
  await page.goto("");
  const section = page.locator("section[aria-labelledby=server-rendered-html]");
  const templates = section.locator(".ssr-pane ui-tabs-list[aria-label='Server templates']");
  await expect(templates.locator("ui-tabs-trigger")).toHaveText([
    "faq.php",
    "faq.html.erb",
    "faq.html",
    "faq.tmpl",
  ]);
  for (const name of ["faq.html.erb", "faq.html", "faq.tmpl", "faq.php"]) {
    await templates.getByRole("tab", { name, exact: true }).click();
    await expect(
      section.locator(".ssr-pane ui-tabs-content:not([hidden]) pre").first(),
    ).toContainText("<ui-accordion-trigger>");
  }
  await expect(section.locator(".backends u-icon svg")).toHaveCount(6);
  await expect(section.locator(".seo figcaption")).toHaveText("What a crawler receives");
  await expect(section.locator(".seo pre")).toContainText("Can search engines read these answers?");
  await expect(section.locator(".seo-points u-icon svg")).toHaveCount(4);
  await expect(section.locator(".ssr-note")).toContainText(
    "does not output Declarative Shadow DOM",
  );

  await ready(page, "ui-accordion");
  const items = section.locator("live-demo ui-accordion-item");
  await expect(items).toHaveCount(3);
  const second = items.nth(1);
  await second.locator("summary").click();
  await expect(second.locator("details")).toHaveAttribute("open", "");
  void errors;
});

test("the platform examples use the native features they name", async ({ page, errors }) => {
  await page.goto("");
  await defined(page);
  const tiles = page.locator("section[aria-labelledby=platform] .platform-tile");
  await expect(tiles).toHaveCount(6);

  await tiles.nth(0).getByRole("button", { name: "Open dialog" }).click();
  const dialog = page.getByRole("dialog", { name: "A native dialog" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await tiles.nth(1).getByRole("button", { name: "Open popover" }).click();
  await expect(tiles.nth(1).locator("ui-popover-content")).toBeVisible();
  await page.mouse.click(1, 1);
  await expect(tiles.nth(1).locator("ui-popover-content")).toBeHidden();

  const input = tiles.nth(2).locator("ui-input");
  await tiles.nth(2).getByRole("button", { name: "Send" }).click();
  expect(await input.evaluate((el) => el.matches(":invalid"))).toBe(true);
  await input.getByRole("textbox").fill("ada@example.com");
  await tiles.nth(2).getByRole("button", { name: "Send" }).click();
  await expect(input.getByRole("textbox")).toHaveValue("");

  const select = tiles.nth(3).getByRole("combobox", { name: "Engine" });
  await select.selectOption("webkit");
  await expect(tiles.nth(3).locator("ui-select")).toHaveJSProperty("value", "webkit");

  await tiles.nth(4).getByRole("button", { name: "Bold" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tiles.nth(4).getByRole("button", { name: "Italic" })).toBeFocused();

  const toggle = tiles.nth(5).locator("ui-switch");
  expect(await toggle.evaluate((el) => el.matches(":state(attr-checked)"))).toBe(true);
  await toggle.getByRole("switch").click();
  expect(await toggle.evaluate((el) => el.matches(":state(attr-checked)"))).toBe(false);

  const browsers = page.locator(".facts-browsers");
  await expect(browsers.locator("dd")).toContainText("Tested in every major browser and engine.");
  const engines = browsers.locator(".engines u-icon");
  await expect(engines).toHaveCount(4);
  for (const icon of await engines.all()) await expect(icon.locator("svg")).toBeAttached();
  void errors;
});

test("the coding assistant section runs its demo and links to what assistants read", async ({
  page,
  request,
  errors,
}) => {
  await page.goto("");
  await ready(page, "pricing-table");
  const section = page.locator("section[aria-labelledby=coding-assistants]");
  await expect(section.locator(".session")).toContainText("npx skills add realmorg/realm");
  await expect(section.locator(".session")).toContainText("realmorg/realm repository on GitHub");
  const assistants = section.locator(".assistants li");
  await expect(assistants).toHaveText(["ChatGPT", "Claude", "Gemini"]);
  for (const icon of await assistants.locator("u-icon").all())
    await expect(icon.locator("svg")).toBeAttached();
  const pricing = section.locator("pricing-table");
  await expect(pricing).toContainText("$19 per month");
  await pricing.getByRole("button", { name: "Yearly" }).click();
  await expect(pricing).toContainText("$190 per year");
  await pricing.getByRole("button", { name: "Monthly" }).click();
  await expect(pricing).toContainText("$19 per month");

  const links = section.locator(".session a, .assist-links a:not([href^=http])");
  await expect(links).toHaveCount(4);
  for (const href of await links.evaluateAll((all) => all.map((a) => a.getAttribute("href")))) {
    const response = await request.get(href as string);
    expect(response.ok(), href as string).toBe(true);
    // vite preview answers unknown paths with the home page, so a resolved link must not be it.
    expect(await response.text(), href as string).not.toContain("<title>REALM: ");
  }
  void errors;
});

test("side-by-side demos open their code at the body", async ({ page, errors }) => {
  await page.goto("");
  await ready(page, "live-demo");
  const code = page.locator("live-demo[layout=split] .shiki").first();
  await expect.poll(() => code.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  const { offset, end } = await code.evaluate((pre) => {
    const body = [...pre.querySelectorAll(".line")].find(
      (line) => line.textContent?.trim() === "<body>",
    );
    return {
      offset: (body as Element).getBoundingClientRect().top - pre.getBoundingClientRect().top,
      end: pre.scrollTop >= pre.scrollHeight - pre.clientHeight - 1,
    };
  });
  expect(offset).toBeGreaterThanOrEqual(0);
  // A short page cannot scroll the body to the top, so it scrolls as far as it goes.
  if (!end) expect(offset).toBeLessThan(64);
  void errors;
});

test("a live demo shows each component it defines as its own file", async ({ page, errors }) => {
  await page.goto("");
  await defined(page);
  const demo = page.locator("live-demo").filter({ has: page.locator("click-counter") });
  await expect(demo.locator("ui-tabs-trigger")).toHaveText(["index.html", "click-counter.html"]);
  const source = demo.locator("ui-tabs-content:not([hidden]) pre");
  await expect(source).toContainText('<import-element from="./click-counter.html">');
  await expect(source).not.toContainText("<custom-element");
  await demo.getByRole("tab", { name: "click-counter.html" }).click();
  await expect(source).toContainText('<custom-element name="click-counter">');
  await expect(source).toContainText("  <script>\n");
  await expect(source).toContainText("  <style>\n");
  await expect(source).not.toContainText('type="realm"');
  void errors;
});

test("a live demo shows the full page and each imported file", async ({ page, errors }) => {
  await page.goto("");
  await defined(page);
  await page.locator(".demo-tabs").getByRole("tab", { name: "Files", exact: true }).click();
  const demo = page.locator("live-demo").filter({ has: page.locator("profile-card") });
  await expect(demo.locator("ui-tabs-trigger")).toHaveText(["index.html", "profile-card.html"]);
  const source = demo.locator("ui-tabs-content:not([hidden]) pre");
  await expect(source).toContainText("<!doctype html>");
  await expect(source).toContainText(
    'href="https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.css"',
  );
  for (const file of ["avatar", "button", "card"])
    await expect(source).toContainText(
      `<import-element from="https://cdn.jsdelivr.net/npm/@realmorg/ui@alpha/components/${file}.html">`,
    );
  await expect(source).not.toContainText("@realmorg/ui@alpha/dist/ui.html");
  await expect(source).toContainText('<import-element from="./profile-card.html">');
  await demo.getByRole("tab", { name: "profile-card.html" }).click();
  await expect(source).toContainText('<custom-element name="profile-card">');

  await page.evaluate(() => {
    const copied: string[] = [];
    Object.assign(window, { copied });
    navigator.clipboard.writeText = async (text: string) => {
      copied.push(text);
    };
  });
  const block = demo.locator("ui-tabs-content:not([hidden]) code-block");
  await block.hover();
  await block.getByRole("button", { name: "Copy code" }).click();
  const copied = await page.evaluate(() => (window as unknown as { copied: string[] }).copied);
  expect(copied[0]).toMatch(/^<custom-element name="profile-card">/);
  void errors;
});

test("docs demos open on the preview and list their source files", async ({ page, errors }) => {
  await page.goto("reference/elements/import-element/");
  await defined(page);
  const demo = page.locator("live-demo").first();
  await expect(demo.locator("ui-tabs-trigger")).toHaveText([
    "Preview",
    "index.html",
    "todo-app.html",
    "todos.js",
  ]);
  await expect(demo.getByRole("button", { name: "Show a todo-app" })).toBeVisible();
  await demo.getByRole("tab", { name: "todos.js" }).click();
  await expect(demo.locator("ui-tabs-content:not([hidden]) pre")).toContainText(
    'from "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js"',
  );
  void errors;
});

test("the header menu reaches every section on small screens", async ({ page, errors }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("docs/");
  await expect(page.getByRole("navigation", { name: "Main" })).toBeHidden();
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("navigation", { name: "Menu" });
  await expect(menu).toBeVisible();
  for (const name of ["Home", "Docs", "Reference", "Components", "Examples", "Unicons", "Blog"]) {
    await expect(menu.getByRole("link", { name })).toBeVisible();
  }
  await expect(menu.getByRole("link", { name: "Docs" })).toHaveAttribute("aria-current", "page");
  const title = await page.getByRole("heading", { name: "Menu" }).boundingBox();
  const home = await menu.getByRole("link", { name: "Home" }).boundingBox();
  expect((home?.y ?? 0) - ((title?.y ?? 0) + (title?.height ?? 0))).toBeLessThan(40);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  void errors;
});

for (const url of [
  "reference/css/design-tokens/",
  "reference/fetch/fetch/",
  "components/dropdown-menu/",
  "docs/fetching/",
]) {
  test(`${url} does not scroll sideways on a phone`, async ({ page, errors }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url);
    await defined(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    ).toBe(0);
    void errors;
  });
}

test("a side-by-side demo that starts hidden opens its code at the body once shown", async ({
  page,
  errors,
}) => {
  await page.goto("");
  await ready(page, "live-demo");
  const scrolled = await page.evaluate(async () => {
    const original = document.querySelector("live-demo[layout=split]") as Element;
    const holder = document.createElement("div");
    holder.hidden = true;
    holder.innerHTML = original.outerHTML;
    document.body.append(holder);
    const pre = holder.querySelector(".shiki") as HTMLElement;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const before = pre.scrollTop;
    holder.hidden = false;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const after = pre.scrollTop;
    holder.remove();
    await new Promise((resolve) => setTimeout(resolve));
    return { before, after };
  });
  expect(scrolled.before).toBe(0);
  expect(scrolled.after).toBeGreaterThan(0);
  void errors;
});
