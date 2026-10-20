import { expect, ready, recordLayoutShifts, takeLayoutShift, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.goto("examples/todo/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await ready(page, "todo-app");
});

test("todo: add, complete, filter, edit, delete and persist", async ({ page, errors }) => {
  const input = page.getByRole("textbox", { name: "New todo" });
  for (const text of ["Buy milk", "Write docs", "Ship v2"]) {
    await input.fill(text);
    await input.press("Enter");
  }
  const items = page.locator("todo-app li");
  await expect(items).toHaveCount(3);
  await expect(page.getByText("3 items left")).toBeVisible();

  await items.nth(0).getByRole("checkbox").check();
  await expect(page.getByText("2 items left")).toBeVisible();

  await page.getByRole("button", { name: "Completed", exact: true }).click();
  await expect(items).toHaveCount(1);
  await page.getByRole("button", { name: "Active" }).click();
  await expect(items).toHaveCount(2);
  await page.getByRole("button", { name: "All" }).click();

  await items.nth(1).getByText("Write docs").dblclick();
  const edit = page.getByRole("textbox", { name: "Edit todo" });
  await edit.fill("Write great docs");
  await edit.press("Enter");
  await expect(items.nth(1)).toContainText("Write great docs");

  await items.nth(2).hover();
  await items.nth(2).getByRole("button", { name: "Delete" }).click();
  await expect(items).toHaveCount(2);

  await page.reload();
  await ready(page, "todo-app");
  await expect(items).toHaveCount(2);
  await page.getByRole("button", { name: "Clear completed" }).click();
  await expect(items).toHaveCount(1);
  await page.getByRole("checkbox", { name: "Mark all as complete" }).check();
  await expect(page.getByText("0 items left")).toBeVisible();
  void errors;
});

test("todo: blank todos are ignored, Escape cancels an edit and clearing the text deletes", async ({
  page,
  errors,
}) => {
  const input = page.getByRole("textbox", { name: "New todo" });
  await input.press("Enter");
  await input.fill("   ");
  await input.press("Enter");
  const items = page.locator("todo-app li");
  await expect(items).toHaveCount(0);

  for (const text of ["Buy milk", "Write docs"]) {
    await input.fill(text);
    await input.press("Enter");
  }
  const edit = page.getByRole("textbox", { name: "Edit todo" });
  await items.nth(0).getByText("Buy milk").dblclick();
  await edit.fill("Buy oat milk");
  await edit.press("Escape");
  await expect(edit).toBeHidden();
  await expect(items.nth(0)).toContainText("Buy milk");

  await items.nth(1).getByText("Write docs").dblclick();
  await edit.fill("");
  await edit.press("Enter");
  await expect(items).toHaveCount(1);
  await expect(items.nth(0)).toContainText("Buy milk");
  void errors;
});

test("todo: adding and completing todos does not shift the layout", async ({ page, errors }) => {
  await recordLayoutShifts(page);
  await page.reload();
  await ready(page, "todo-app");
  const input = page.getByRole("textbox", { name: "New todo" });
  const form = page.locator("todo-app form");
  await expect(page.getByText("Nothing to do yet.")).toBeVisible();
  await takeLayoutShift(page);
  const before = await form.boundingBox();

  await input.fill("Buy milk");
  await input.press("Enter");
  await expect(page.getByText("1 item left")).toBeVisible();
  expect(await takeLayoutShift(page)).toBe(0);
  expect(await form.boundingBox()).toEqual(before);

  for (const text of ["Write docs", "Ship v2"]) {
    await input.fill(text);
    await input.press("Enter");
  }
  await expect(page.locator("todo-app li")).toHaveCount(3);
  expect(await form.boundingBox()).toEqual(before);
  await takeLayoutShift(page);

  const filters = page.getByRole("group", { name: "Filter" });
  const filtersBefore = await filters.boundingBox();
  await page.locator("todo-app li").first().getByRole("checkbox").check();
  await expect(page.getByRole("button", { name: "Clear completed" })).toBeVisible();
  expect(await takeLayoutShift(page)).toBe(0);
  expect(await filters.boundingBox()).toEqual(filtersBefore);
  void errors;
});
