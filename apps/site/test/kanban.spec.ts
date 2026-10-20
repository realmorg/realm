import { expect, ready, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.goto("examples/kanban/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await ready(page, "kanban-board");
});

const column = (page: import("@playwright/test").Page, name: string) =>
  page.getByRole("region", { name }).or(page.locator(`section[aria-label="${name}"]`));

test("kanban: add, drag, move with the keyboard, edit and delete cards", async ({
  page,
  errors,
}) => {
  const review = page.locator('section[aria-label="Review"]');
  await review.getByRole("textbox", { name: "New card title" }).fill("Test the board");
  await review.getByRole("button", { name: "Add" }).click();
  await expect(review.locator("kanban-card")).toHaveCount(1);

  const card = page.locator("kanban-card").filter({ hasText: "Keyed list reconciliation" });
  await card.locator("article").dragTo(review);
  await expect(review.locator("kanban-card")).toHaveCount(2);
  await expect(page.locator('section[aria-label="In progress"] kanban-card')).toHaveCount(0);

  const moved = page
    .locator("kanban-card")
    .filter({ hasText: "Test the board" })
    .locator("article");
  await moved.focus();
  await page.keyboard.press("Alt+ArrowRight");
  await expect(page.locator('section[aria-label="Done"]')).toContainText("Test the board");

  await page.locator("kanban-card").filter({ hasText: "Archive v1" }).locator("article").click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.getByRole("textbox", { name: "Title", exact: true }).fill("Archive v1 for good");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.locator("kanban-card").filter({ hasText: "Archive v1 for good" })).toHaveCount(
    1,
  );

  await page
    .locator("kanban-card")
    .filter({ hasText: "Archive v1 for good" })
    .locator("article")
    .click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.locator("kanban-card").filter({ hasText: "Archive v1" })).toHaveCount(0);
  await expect(page.getByText("Card deleted")).toBeVisible();
  void column;
  void errors;
});

const cardIn = (page: import("@playwright/test").Page, title: string) =>
  page.locator("kanban-card").filter({ hasText: title }).locator("article");

const titlesIn = (page: import("@playwright/test").Page, name: string) =>
  page
    .locator(`section[aria-label="${name}"] kanban-card article`)
    .evaluateAll((cards) => cards.map((card) => card.getAttribute("aria-label")));

test("kanban: empty titles and moves past the edge are ignored", async ({ page, errors }) => {
  const backlog = page.locator('section[aria-label="Backlog"]');
  await backlog.getByRole("button", { name: "Add" }).click();
  await backlog.getByRole("textbox", { name: "New card title" }).fill("   ");
  await backlog.getByRole("button", { name: "Add" }).click();
  await expect(backlog.locator("kanban-card")).toHaveCount(2);

  await cardIn(page, "Write the docs for props").focus();
  await page.keyboard.press("Alt+ArrowLeft");
  await page.keyboard.press("ArrowRight");
  await expect(backlog.locator("kanban-card")).toHaveCount(2);

  const accepted = await backlog.evaluate((column) =>
    column.dispatchEvent(
      new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      }),
    ),
  );
  expect(accepted).toBe(true);
  await expect(backlog).not.toHaveAttribute("data-over", "");
  void errors;
});

test("kanban: dropping on a card inserts before it, and a cancelled drag clears the highlight", async ({
  page,
  errors,
}) => {
  await cardIn(page, "Keyed list reconciliation").dragTo(cardIn(page, "Port the chess example"));
  await expect
    .poll(() => titlesIn(page, "Backlog"))
    .toEqual(["Write the docs for props", "Keyed list reconciliation", "Port the chess example"]);
  await expect(page.locator('section[aria-label="In progress"] kanban-card')).toHaveCount(0);

  const card = cardIn(page, "Archive v1");
  const review = page.locator('section[aria-label="Review"]');
  await card.hover();
  await page.mouse.down();
  const box = await review.boundingBox();
  if (!box) throw new Error("The Review column has no box.");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 5 });
  await expect(review).toHaveAttribute("data-over", "");
  const heading = await page.getByRole("heading", { name: "Roadmap board" }).boundingBox();
  if (!heading) throw new Error("The board heading has no box.");
  await page.mouse.move(heading.x + 10, heading.y + heading.height / 2, { steps: 5 });
  await page.mouse.up();
  await expect(review).not.toHaveAttribute("data-over", "");
  await expect(page.locator('section[aria-label="Done"] kanban-card')).toHaveCount(1);
  void errors;
});

test("kanban: the editor opens from the keyboard, keeps a title and moves the card", async ({
  page,
  errors,
}) => {
  await cardIn(page, "Archive v1").focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const title = page.getByRole("textbox", { name: "Title", exact: true });
  await expect(title).toHaveValue("Archive v1");
  await title.fill("");
  await page.locator("ui-select[name=column] select").selectOption({ label: "Backlog" });
  await page.getByRole("button", { name: "Save" }).click();
  await expect(dialog).toBeHidden();
  await expect
    .poll(() => titlesIn(page, "Backlog"))
    .toEqual(["Write the docs for props", "Port the chess example", "Archive v1"]);
  await expect(page.locator('section[aria-label="Done"] kanban-card')).toHaveCount(0);

  await page.getByRole("button", { name: "Reset board" }).click();
  await expect(page.locator("kanban-card")).toHaveCount(4);
  void errors;
});
