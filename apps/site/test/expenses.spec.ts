import { readFileSync } from "node:fs";
import type { Page } from "@playwright/test";
import { expect, ready, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.goto("examples/expenses/");
  await ready(page, "expense-tracker");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await ready(page, "expense-tracker");
  await expect(rows(page)).toHaveCount(12);
});

const rows = (page: Page) => page.getByRole("table", { name: "Expenses" }).locator("tbody tr");
const firstCell = (page: Page, column: number) => rows(page).first().locator("td").nth(column);

const add = async (
  page: Page,
  description: string,
  amount: string,
  date: string,
  category: string,
) => {
  await page.getByRole("textbox", { name: "Description" }).fill(description);
  await page.getByRole("spinbutton", { name: "Amount (USD)" }).fill(amount);
  await page.locator('expense-form input[type="date"]').fill(date);
  await page.getByRole("combobox", { name: "Category", exact: true }).selectOption(category);
  await page.getByRole("button", { name: "Add expense" }).click();
};

test("expenses: the form validates, adds an expense, resets and persists", async ({
  page,
  errors,
}) => {
  await page.getByRole("button", { name: "Add expense" }).click();
  await expect(rows(page)).toHaveCount(12);
  expect(
    await page
      .locator("expense-form form")
      .evaluate((form: HTMLFormElement) => form.checkValidity()),
  ).toBe(false);

  await add(page, "Dentist", "120.5", "2026-10-15", "health");
  await expect(rows(page)).toHaveCount(13);
  await expect(page.getByText("Expense added")).toBeVisible();
  await expect(firstCell(page, 1)).toHaveText("Dentist");
  await expect(firstCell(page, 2)).toHaveText("Health");
  await expect(firstCell(page, 3)).toHaveText("$120.50");
  await expect(page.getByText("13 expenses, $5,094.65 in total")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Description" })).toHaveValue("");
  await expect(page.locator('expense-form input[type="date"]')).not.toHaveValue("");
  await expect(page.getByRole("button", { name: /October 2026/ })).toContainText("$1,740.70");

  await page.reload();
  await ready(page, "expense-tracker");
  await expect(rows(page)).toHaveCount(13);
  await expect(firstCell(page, 1)).toHaveText("Dentist");
  void errors;
});

test("expenses: sort by column and filter by category, month and text", async ({
  page,
  errors,
}) => {
  const table = page.getByRole("table", { name: "Expenses" });
  const amount = table.getByRole("columnheader", { name: "Amount" });
  await expect(table.getByRole("columnheader", { name: "Date" })).toHaveAttribute(
    "aria-sort",
    "descending",
  );
  await amount.getByRole("button").click();
  await expect(amount).toHaveAttribute("aria-sort", "descending");
  await expect(firstCell(page, 3)).toHaveText("$1,450.00");
  await amount.getByRole("button").click();
  await expect(amount).toHaveAttribute("aria-sort", "ascending");
  await expect(firstCell(page, 3)).toHaveText("$23.90");
  await table.getByRole("columnheader", { name: "Category" }).getByRole("button").click();
  await expect(firstCell(page, 2)).toHaveText("Transport");
  await table.getByRole("columnheader", { name: "Description" }).getByRole("button").click();
  await expect(firstCell(page, 1)).toHaveText("Train pass");

  const clear = page.getByRole("button", { name: "Clear", exact: true });
  await expect(clear).toBeHidden();
  await page.getByRole("combobox", { name: "Filter by category" }).selectOption("food");
  await expect(rows(page)).toHaveCount(4);
  await expect(clear).toBeVisible();
  await page.getByRole("combobox", { name: "Filter by month" }).selectOption("2026-09");
  await expect(rows(page)).toHaveCount(2);
  await expect(page.getByText("2 expenses, $176.65 in total")).toBeVisible();
  await page.getByRole("searchbox", { name: "Search expenses" }).fill("din");
  await expect(rows(page)).toHaveCount(1);
  await expect(page.getByText("1 expense,")).toBeVisible();
  await page.getByRole("searchbox", { name: "Search expenses" }).fill("nothing");
  await expect(page.getByRole("heading", { name: "No expenses found" })).toBeVisible();
  await expect(page.getByText("Largest expense")).toBeVisible();
  await expect(page.locator("expense-tracker .value").nth(2)).toHaveText("None");
  await clear.click();
  await expect(rows(page)).toHaveCount(12);
  await expect(page.getByRole("searchbox", { name: "Search expenses" })).toHaveValue("");
  await expect(page.getByRole("combobox", { name: "Filter by category" })).toHaveValue("all");
  void errors;
});

test("expenses: the monthly summary filters by month and deleting updates the totals", async ({
  page,
  errors,
}) => {
  const october = page.getByRole("button", { name: /October 2026/ });
  await expect(october).toContainText("-2% vs previous month");
  await expect(page.getByRole("button", { name: /August 2026/ })).toContainText("First month");
  await october.click();
  await expect(october).toHaveAttribute("aria-pressed", "true");
  await expect(rows(page)).toHaveCount(4);
  await expect(page.getByRole("combobox", { name: "Filter by month" })).toHaveValue("2026-10");
  await expect(
    page.getByRole("img", { name: "Spending by category in the current filter" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Delete Cinema on Oct 11, 2026" }).click();
  await expect(rows(page)).toHaveCount(3);
  await expect(october).toContainText("$1,592.20");
  await expect(page.locator("expense-tracker .value").first()).toHaveText("$1,592.20");

  await october.click();
  await expect(october).toHaveAttribute("aria-pressed", "false");
  await expect(rows(page)).toHaveCount(11);
  void errors;
});

test("expenses: export the filtered table as CSV", async ({ page, errors }) => {
  await add(page, 'Coffee, "beans"', "12", "2026-10-12", "food");
  await page.getByRole("combobox", { name: "Filter by category" }).selectOption("food");
  await expect(rows(page)).toHaveCount(5);
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Export CSV" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("expenses.csv");
  const csv = readFileSync((await file.path()) as string, "utf8").split("\n");
  expect(csv).toEqual([
    "Date,Description,Category,Amount",
    '2026-10-12,"Coffee, ""beans""",Food,12.00',
    "2026-10-03,Groceries,Food,94.20",
    "2026-09-22,Dinner out,Food,64.50",
    "2026-09-06,Groceries,Food,112.15",
    "2026-08-04,Groceries,Food,86.40",
  ]);
  void errors;
});
