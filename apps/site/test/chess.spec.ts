import { expect, ready, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.goto("examples/chess/");
  await ready(page, "chess-game");
});

type Page = import("@playwright/test").Page;
type ChessGame = HTMLElement & { reset(): void; readonly position: string };

const square = (page: Page, name: string) =>
  page.locator(`chess-game button[data-square="${name}"]`);

const play = async (page: Page, moves: string[][]) => {
  for (const [from, to] of moves) {
    await square(page, from as string).click();
    await square(page, to as string).click();
  }
};

const load = async (page: Page, fen: string) => {
  const game = page.locator("chess-game");
  await game.evaluate((element, value) => element.setAttribute("fen", value), fen);
  await expect
    .poll(() =>
      game.evaluate((element: ChessGame) => {
        element.reset();
        return element.position;
      }),
    )
    .toBe(fen);
};

test("chess: moves by click, the computer replies, undo restores", async ({ page, errors }) => {
  await square(page, "e2").click();
  await expect(square(page, "e4")).toHaveAttribute("data-target", "");
  await square(page, "e4").click();
  await expect(page.locator("chess-game ol li")).toContainText(["1.e4"]);
  await expect(page.getByRole("status")).toHaveText("White to move.");
  await expect(page.locator("chess-game ol li").first()).not.toHaveText(/^1\.e4\s*$/);
  const position = await page
    .locator("chess-game")
    .evaluate((element: ChessGame) => element.position);
  expect(position).toContain("/4P3/");
  expect(position).toMatch(/ w KQkq - \d+ 2$/);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.locator("chess-game ol li")).toHaveCount(0);
  void errors;
});

test("chess: selecting, deselecting and pieces that cannot move", async ({ page, errors }) => {
  await square(page, "e2").click();
  await expect(square(page, "e2")).toHaveAttribute("data-selected", "");
  await square(page, "e2").click();
  await expect(square(page, "e2")).not.toHaveAttribute("data-selected", "");
  await expect(square(page, "e4")).not.toHaveAttribute("data-target", "");

  await square(page, "e7").click();
  await expect(square(page, "e7")).not.toHaveAttribute("data-selected", "");
  const dragAccepted = await square(page, "e7")
    .locator(".piece")
    .evaluate((piece) =>
      piece.dispatchEvent(
        new DragEvent("dragstart", {
          bubbles: true,
          cancelable: true,
          composed: true,
          dataTransfer: new DataTransfer(),
        }),
      ),
    );
  expect(dragAccepted).toBe(false);

  await play(page, [["e2", "e4"]]);
  await expect(page.locator("chess-game ol li")).toContainText(["1.e4"]);
  await page.getByRole("button", { name: "New game" }).click();
  await expect(page.locator("chess-game ol li")).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText("White to move.");
  void errors;
});

test("chess: check, stalemate and the draw rules", async ({ page, errors }) => {
  await page.getByText("Play against the computer").click();
  const status = page.getByRole("status");

  await load(page, "4k3/8/8/8/8/8/4q3/4K3 w - - 0 1");
  await expect(status).toHaveText("White is in check.");
  await load(page, "k7/8/1Q6/8/8/8/8/K7 b - - 0 1");
  await expect(status).toHaveText("Stalemate. The game is a draw.");
  await load(page, "k7/8/8/8/8/8/8/KR6 w - - 100 80");
  await expect(status).toHaveText("Draw by the fifty-move rule.");

  await load(page, "6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1");
  await play(page, [["a1", "a8"]]);
  await expect(status).toHaveText("Checkmate. White wins.");
  await square(page, "g8").click();
  await expect(square(page, "g8")).not.toHaveAttribute("data-selected", "");

  await load(page, "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const shuffle = [
    ["g1", "f3"],
    ["g8", "f6"],
    ["f3", "g1"],
    ["f6", "g8"],
  ];
  await play(page, [...shuffle, ...shuffle]);
  await expect(status).toHaveText("Draw by threefold repetition.");
  void errors;
});

test("chess: fool's mate ends the game", async ({ page, errors }) => {
  await page.getByText("Play against the computer").click();
  for (const [from, to] of [
    ["f2", "f3"],
    ["e7", "e5"],
    ["g2", "g4"],
    ["d8", "h4"],
  ]) {
    await square(page, from).click();
    await square(page, to).click();
  }
  await expect(page.getByRole("status")).toHaveText("Checkmate. Black wins.");
  await expect(square(page, "e1")).toHaveAttribute("data-check", "");
  await expect(page.locator("chess-game ol li").last()).toContainText("Qh4#");
  void errors;
});

test("chess: drag and drop, flipping and promotion", async ({ page, errors }) => {
  await page.getByText("Play against the computer").click();
  await page.evaluate(() => {
    const game = document.querySelector("chess-game") as HTMLElement & { reset(): void };
    game.setAttribute("fen", "8/P6k/8/8/8/8/8/K7 w - - 0 1");
  });
  await page.waitForTimeout(50);
  await page.evaluate(() =>
    (document.querySelector("chess-game") as HTMLElement & { reset(): void }).reset(),
  );
  for (const piece of ["Queen", "Rook", "Bishop"]) {
    await play(page, [["a7", "a8"]]);
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: piece }).click();
    await expect(square(page, "a8")).toHaveAttribute(
      "aria-label",
      `a8, white ${piece.toLowerCase()}`,
    );
    await page.getByRole("button", { name: "Undo" }).click();
    await expect(square(page, "a7")).toHaveAttribute("aria-label", "a7, white pawn");
  }
  await square(page, "a7").dragTo(square(page, "a8"));
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Knight" }).click();
  await expect(square(page, "a8")).toHaveAttribute("aria-label", "a8, white knight");
  await page.getByRole("button", { name: "Flip board" }).click();
  await expect(page.locator("chess-game .square").first()).toHaveAttribute("data-square", "h1");
  await page.getByRole("button", { name: "New game" }).click();
  void errors;
});
