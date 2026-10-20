import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

const PAGES = [
  "todo",
  "kanban",
  "chess",
  "dashboard/",
  "dashboard/orders.html",
  "dashboard/customers.html",
  "dashboard/products.html",
  "dashboard/settings.html",
  "login",
  "login-split",
  "signup",
  "otp",
  "weather",
  "contacts",
  "chat",
  "shop/",
  "shop/product.html?id=5",
  "shop/cart.html",
  "notes",
  "expenses",
  "github",
  "game",
];

// axe-core ignores roles set through ElementInternals, so lists whose items are slotted
// <ui-breadcrumb-item> / <ui-sidebar-menu-item> hosts look empty to it. Browsers expose them as listitems.
const INTERNALS_LISTS = [
  { fromShadowDom: ["dashboard-shell", "ui-breadcrumb-list", "ol"] },
  { fromShadowDom: ["dashboard-shell", "ui-sidebar-menu", "ul"] },
  { fromShadowDom: ["product-detail", "ui-breadcrumb-list", "ol"] },
];

const examplePath = (name: string) => `examples/${name.includes("/") ? name : `${name}/`}`;

for (const name of PAGES) {
  test(`${name} example has no accessibility violations`, async ({ page, errors }) => {
    await page.goto(examplePath(name));
    await page.waitForFunction(() => document.querySelectorAll(":not(:defined)").length === 0);
    await page.waitForTimeout(300);
    const axe = new AxeBuilder({ page });
    for (const selector of INTERNALS_LISTS) axe.exclude(selector);
    const { violations } = await axe.analyze();
    expect(
      violations.map(
        ({ id, nodes }) => `${id}: ${nodes.map((node) => node.target.join(" > ")).join(", ")}`,
      ),
    ).toEqual([]);
    void errors;
  });
}

const SITE_PAGES = [
  "",
  "docs/installation/",
  "docs/quick-start/",
  "docs/fetching/",
  "docs/styling/",
  "docs/stores/",
  "components/theming/",
  "components/button/",
  "components/badge/",
  "components/alert/",
  "components/tabs/",
  "components/card/",
  "components/table/",
  "components/sidebar/",
  "components/toaster/",
  "components/input/",
  "components/chart/",
  "reference/",
  "reference/css/design-tokens/",
  "blog/",
  "blog/realm-v2/",
  "examples/",
  "unicons/",
];

for (const scheme of ["light", "dark"] as const) {
  for (const path of [...SITE_PAGES, ...PAGES.map(examplePath)]) {
    test(`${path || "home"} has no colour contrast violations in ${scheme} mode`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path || "./");
      await page.waitForFunction(() => document.querySelectorAll(":not(:defined)").length === 0);
      await page.waitForTimeout(300);
      const { violations } = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
      expect(
        violations.flatMap(({ nodes }) =>
          nodes.map((node) => `${node.target.join(" > ")}: ${node.any[0]?.message}`),
        ),
      ).toEqual([]);
    });
  }
}
