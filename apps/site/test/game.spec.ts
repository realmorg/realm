import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, ready, test } from "./fixtures";

const open = async (
  page: Page,
  query = "?level=easy&seed=42",
  best?: Record<string, number | null>,
) => {
  await page.goto(`examples/game/${query}`);
  await ready(page, "mine-sweeper");
  await page.evaluate((saved) => {
    localStorage.clear();
    if (saved) localStorage.setItem("realm:example-minesweeper", JSON.stringify({ best: saved }));
  }, best);
  await page.reload();
  await ready(page, "mine-sweeper");
  await expect(cells(page).first()).toBeAttached();
};

const cells = (page: Page) => page.locator("mine-sweeper .cell");
const cell = (page: Page, index: number) => cells(page).nth(index);
const status = (page: Page) => page.locator("mine-sweeper .status");

// The board is seeded, so the module computes the same mines the game lays.
const minesFor = (page: Page, level: string, safe: number, seed: number) =>
  page.evaluate(
    async ({ level, safe, seed }) => {
      const game = await import(new URL("minesweeper.js", location.href).href);
      return game.layMines(game.LEVELS[level], safe, seed) as number[];
    },
    { level, safe, seed },
  );

const hiddenSafe = (page: Page, mines: number[]) =>
  cells(page).evaluateAll(
    (buttons, mineList) =>
      buttons
        .map((button, index) => ({ index, state: button.getAttribute("data-state") }))
        .filter(({ index, state }) => state === "hidden" && !mineList.includes(index))
        .map(({ index }) => index),
    mines,
  );

// Opening a square is synchronous, so every safe square is clicked in one pass.
const clearBoard = (page: Page, mines: number[]) =>
  cells(page).evaluateAll((buttons, mineList) => {
    buttons.forEach((button, index) => {
      if (!mineList.includes(index)) (button as HTMLButtonElement).click();
    });
  }, mines);

test("game: clearing the board wins, records a best time and offers another game", async ({
  page,
  errors,
}) => {
  await open(page);
  await expect(cells(page)).toHaveCount(81);
  await expect(status(page)).toHaveText("Find the 10 mines. Your first click is always safe.");
  await expect(page.getByRole("link", { name: "Board 42" })).toHaveAttribute(
    "href",
    "?level=easy&seed=42",
  );

  await cell(page, 40).click();
  await expect(status(page)).toHaveText("10 mines left to flag.");
  await expect(cell(page, 40)).toHaveAttribute("data-state", "open");
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(
    violations.map(
      ({ id, nodes }) => `${id}: ${nodes.map((node) => node.target.join(" > ")).join(", ")}`,
    ),
  ).toEqual([]);
  const mines = await minesFor(page, "easy", 40, 42);
  await clearBoard(page, mines);

  const dialog = page.getByRole("dialog", { name: "New best time!" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleDescription(/You cleared the easy board in \d+\.\d s\./);
  await expect(status(page)).toHaveText(/Cleared in \d+\.\d s\./);
  await expect(cell(page, mines[0] as number)).toHaveAttribute("data-state", "flagged");
  await expect(page.locator("mine-sweeper dd").first()).toHaveText(/\d+\.\d s/);

  await page.getByRole("button", { name: "Play again" }).click();
  await expect(dialog).toBeHidden();
  await expect(status(page)).toHaveText("Find the 10 mines. Your first click is always safe.");
  await expect(page.getByRole("link", { name: "Board 42" })).toHaveCount(0);
  await expect(page.locator("mine-sweeper dd").first()).toHaveText(/\d+\.\d s/);
  void errors;
});

test("game: a slower win is not a new best time", async ({ page, errors }) => {
  await open(page, "?level=easy&seed=7", { easy: 1, medium: null, hard: null });
  await expect(page.locator("mine-sweeper dd").first()).toHaveText("0.0 s");
  await cell(page, 0).click();
  await clearBoard(page, await minesFor(page, "easy", 0, 7));
  await expect(page.getByRole("dialog", { name: "You won!" })).toBeVisible();
  await page.getByRole("button", { name: "View board" }).click();
  await expect(page.locator("mine-sweeper dd").first()).toHaveText("0.0 s");
  void errors;
});

test("game: flags, a lost game, the stopped timer and replaying the same board", async ({
  page,
  errors,
}) => {
  await open(page);
  await cell(page, 0).click({ button: "right" });
  await expect(cell(page, 0)).toHaveAttribute("data-state", "hidden");

  await cell(page, 40).click();
  const mines = await minesFor(page, "easy", 40, 42);
  const mine = mines[0] as number;
  const safe = (await hiddenSafe(page, mines))[0] as number;
  await cell(page, mine).click({ button: "right" });
  await expect(cell(page, mine)).toHaveAttribute("data-state", "flagged");
  await expect(cell(page, mine)).toHaveText("🚩");
  await expect(status(page)).toHaveText("9 mines left to flag.");
  await cell(page, mine).click();
  await expect(cell(page, mine)).toHaveAttribute("data-state", "flagged");
  await cell(page, mine).click({ button: "right" });
  await expect(status(page)).toHaveText("10 mines left to flag.");
  await cell(page, 40).click({ button: "right" });
  await expect(cell(page, 40)).toHaveAttribute("data-state", "open");

  await cell(page, safe).click({ button: "right" });
  await expect(page.locator("mine-sweeper .counters")).toContainText("9");
  await expect
    .poll(() => page.locator("mine-sweeper .counters").textContent(), { timeout: 3000 })
    .toContain("001");
  await cell(page, mines[1] as number).click();

  const dialog = page.getByRole("dialog", { name: "Game over" });
  await expect(dialog).toBeVisible();
  await expect(cell(page, mines[1] as number)).toHaveAttribute("data-state", "exploded");
  await expect(cell(page, mine)).toHaveAttribute("data-state", "mine");
  await expect(cell(page, safe)).toHaveAttribute("data-state", "wrong");
  await expect(cell(page, safe)).toHaveAttribute("aria-label", /wrongly flagged$/);
  await page.getByRole("button", { name: "View board" }).click();
  await expect(dialog).toBeHidden();
  await expect(status(page)).toHaveText("Boom. You hit a mine.");
  const clock = await page.locator("mine-sweeper .counters").textContent();
  await page.waitForTimeout(1300);
  expect(await page.locator("mine-sweeper .counters").textContent()).toBe(clock);
  await cell(page, 1).click();
  await expect(cell(page, 1)).toHaveAttribute("data-state", /hidden|mine/);

  await page.getByRole("button", { name: "Replay this board" }).click();
  await expect(status(page)).toHaveText("Find the 10 mines. Your first click is always safe.");
  await expect(page.getByRole("link", { name: "Board 42" })).toBeVisible();
  await expect(page.locator("mine-sweeper .counters")).toContainText("000");
  await cell(page, 40).click();
  await expect(cell(page, mine)).toHaveAttribute("data-state", "hidden");
  await cell(page, mine).click();
  await expect(dialog).toBeVisible();
  void errors;
});

test("game: play with the keyboard", async ({ page, errors }) => {
  await open(page);
  await expect(cells(page).and(page.locator('[tabindex="0"]'))).toHaveCount(1);
  await expect(cell(page, 0)).toHaveAttribute("tabindex", "0");
  await cell(page, 0).focus();
  const focused = () =>
    page.evaluate(() => {
      let element = document.activeElement;
      while (element?.shadowRoot?.activeElement) element = element.shadowRoot.activeElement;
      return element?.getAttribute("aria-label");
    });
  await expect.poll(focused).toBe("Row 1, column 1, hidden");

  await page.keyboard.press("f");
  await expect(cell(page, 0)).toHaveAttribute("data-state", "hidden");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowUp");
  await expect.poll(focused).toBe("Row 1, column 1, hidden");
  for (const key of ["ArrowRight", "ArrowDown", "ArrowDown", "ArrowRight"])
    await page.keyboard.press(key);
  await expect.poll(focused).toBe("Row 3, column 3, hidden");
  await page.keyboard.press("End");
  await expect.poll(focused).toBe("Row 3, column 9, hidden");
  await page.keyboard.press("ArrowRight");
  await expect.poll(focused).toBe("Row 3, column 9, hidden");
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("x");
  await expect.poll(focused).toBe("Row 2, column 1, hidden");
  for (let i = 0; i < 8; i++) await page.keyboard.press("ArrowDown");
  await expect.poll(focused).toBe("Row 9, column 1, hidden");
  for (let i = 0; i < 4; i++) await page.keyboard.press("ArrowUp");
  for (let i = 0; i < 4; i++) await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(cell(page, 40)).toHaveAttribute("data-state", "open");
  await expect(status(page)).toHaveText("10 mines left to flag.");

  const mines = await minesFor(page, "easy", 40, 42);
  const target = await hiddenSafe(page, mines);
  const mine = mines[0] as number;
  await cell(page, mine).focus();
  await page.keyboard.press("F");
  await expect(cell(page, mine)).toHaveAttribute("data-state", "flagged");
  await page.keyboard.press("Space");
  await expect(cell(page, mine)).toHaveAttribute("data-state", "flagged");
  expect(target.length).toBeGreaterThan(0);
  void errors;
});

test("game: difficulty levels and new games", async ({ page, errors }) => {
  await open(page, "?level=nope&seed=-3");
  await expect(cells(page)).toHaveCount(81);
  const link = page.locator("mine-sweeper .board-link a");
  await expect(link).toHaveAttribute("href", /^\?level=easy&seed=\d{6}$/);
  await page.getByRole("combobox", { name: "Difficulty" }).selectOption("medium");
  await expect(cells(page)).toHaveCount(144);
  await expect(status(page)).toHaveText("Find the 24 mines. Your first click is always safe.");
  await expect(link).toHaveAttribute("href", /^\?level=medium&seed=\d{6}$/);
  const before = await link.getAttribute("href");
  await page.getByRole("button", { name: "New game" }).click();
  await expect(link).not.toHaveAttribute("href", before as string);
  await expect(cells(page)).toHaveCount(144);

  await page.goto("examples/game/?level=hard&seed=5");
  await ready(page, "mine-sweeper");
  await expect(cells(page)).toHaveCount(256);
  await expect(page.getByRole("combobox", { name: "Difficulty" })).toHaveValue("hard");
  await page.setViewportSize({ width: 390, height: 844 });
  const grid = await page.getByRole("grid", { name: "Minefield" }).boundingBox();
  expect(grid && grid.x >= 0 && grid.x + grid.width <= 390).toBe(true);
  void errors;
});
