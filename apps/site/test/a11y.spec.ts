import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

const PAGES = [
  "todo",
  "kanban",
  "chess",
  "dashboard",
  "login",
  "login-split",
  "signup",
  "otp",
  "weather",
  "contacts",
];

// axe-core ignores roles set through ElementInternals, so lists whose items are slotted
// <ui-breadcrumb-item> / <ui-sidebar-menu-item> hosts look empty to it. Browsers expose them as listitems.
const INTERNALS_LISTS = [
  { fromShadowDom: ["dashboard-app", "ui-breadcrumb-list", "ol"] },
  { fromShadowDom: ["dashboard-app", "ui-sidebar-menu", "ul"] },
];

for (const name of PAGES) {
  test(`${name} example has no accessibility violations`, async ({ page, errors }) => {
    await page.goto(`examples/${name}/`);
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
