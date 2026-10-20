import { defineStore } from "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js";

export const LEVELS = {
  easy: { id: "easy", label: "Easy", rows: 9, columns: 9, mines: 10 },
  medium: { id: "medium", label: "Medium", rows: 12, columns: 12, mines: 24 },
  hard: { id: "hard", label: "Hard", rows: 16, columns: 16, mines: 40 },
};

export const records = defineStore(
  "example-minesweeper",
  { best: { easy: null, medium: null, hard: null } },
  { persist: "local" },
);

// A small seeded generator, so a board number always lays the same mines.
export const generator = (seed) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const randomSeed = () => Math.floor(Math.random() * 900_000) + 100_000;

export const neighbours = (index, { rows, columns }) => {
  const row = Math.floor(index / columns);
  const column = index % columns;
  const found = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      const r = row + dr;
      const c = column + dc;
      if ((dr || dc) && r >= 0 && r < rows && c >= 0 && c < columns) found.push(r * columns + c);
    }
  return found;
};

export const layMines = (level, safe, seed) => {
  const random = generator(seed);
  const blocked = new Set([safe, ...neighbours(safe, level)]);
  const free = Array.from({ length: level.rows * level.columns }, (_, index) => index).filter(
    (index) => !blocked.has(index),
  );
  for (let i = free.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [free[i], free[j]] = [free[j], free[i]];
  }
  return free.slice(0, level.mines).sort((a, b) => a - b);
};

export const fromUrl = (search) => {
  const params = new URLSearchParams(search);
  const seed = Number(params.get("seed"));
  return {
    levelId: LEVELS[params.get("level")] ? params.get("level") : "easy",
    seed: Number.isInteger(seed) && seed > 0 ? seed : randomSeed(),
  };
};

const fields = (levelId, seed) => {
  const level = LEVELS[levelId];
  return {
    levelId,
    seed,
    status: "ready",
    started: 0,
    elapsed: 0,
    finalTime: 0,
    newBest: false,
    cursor: 0,
    cells: Array.from({ length: level.rows * level.columns }, (_, index) => ({
      index,
      mine: false,
      adjacent: 0,
      open: false,
      flagged: false,
      exploded: false,
    })),
  };
};

const seconds = (ms) => `${(ms / 1000).toFixed(1)} s`;

const SYMBOLS = { flagged: "🚩", mine: "💣", exploded: "💥", wrong: "❌" };

const stateOf = (cell, over) => {
  if (cell.exploded) return "exploded";
  if (cell.flagged && over && !cell.mine) return "wrong";
  if (cell.flagged) return "flagged";
  if (over && cell.mine) return "mine";
  return cell.open ? "open" : "hidden";
};

const DESCRIBE = {
  hidden: () => "hidden",
  flagged: () => "flagged",
  wrong: () => "wrongly flagged",
  mine: () => "mine",
  exploded: () => "exploded mine",
  open: (cell) =>
    cell.adjacent ? `${cell.adjacent} ${cell.adjacent === 1 ? "mine" : "mines"} nearby` : "empty",
};

const STATUS = {
  ready: (game) => `Find the ${game.level.mines} mines. Your first click is always safe.`,
  playing: (game) => `${game.flagsLeft} ${game.flagsLeft === 1 ? "mine" : "mines"} left to flag.`,
  won: (game) => `Cleared in ${seconds(game.finalTime)}.`,
  lost: () => "Boom. You hit a mine.",
};

export const createGame = (levelId, seed) => ({
  ...fields(levelId, seed),
  get level() {
    return LEVELS[this.levelId];
  },
  get columns() {
    return this.level.columns;
  },
  get over() {
    return this.status === "won" || this.status === "lost";
  },
  get flagsLeft() {
    return this.level.mines - this.cells.filter((cell) => cell.flagged).length;
  },
  get clock() {
    return String(Math.min(this.elapsed, 999)).padStart(3, "0");
  },
  get message() {
    return STATUS[this.status](this);
  },
  get link() {
    return `?level=${this.levelId}&seed=${this.seed}`;
  },
  get rows() {
    const { rows, columns } = this.level;
    const over = this.over;
    return Array.from({ length: rows }, (_, row) => ({
      id: row,
      cells: this.cells.slice(row * columns, (row + 1) * columns).map((cell) => {
        const state = stateOf(cell, over);
        const text =
          state === "open" && cell.adjacent ? String(cell.adjacent) : (SYMBOLS[state] ?? "");
        return {
          index: cell.index,
          state,
          text,
          adjacent: cell.adjacent,
          tabindex: cell.index === this.cursor ? 0 : -1,
          label: `Row ${row + 1}, column ${(cell.index % columns) + 1}, ${DESCRIBE[state](cell)}`,
        };
      }),
    }));
  },
  get result() {
    return this.status === "won"
      ? {
          title: this.newBest ? "New best time!" : "You won!",
          description: `You cleared the ${this.level.label.toLowerCase()} board in ${seconds(this.finalTime)}.`,
        }
      : { title: "Game over", description: "You hit a mine. Every mine is shown on the board." };
  },
});

export const restart = (game, levelId, seed) => {
  Object.assign(game, fields(levelId, seed));
};

export const tickClock = (game) => {
  game.elapsed = Math.floor((Date.now() - game.started) / 1000);
};

const arm = (game, safe) => {
  const level = game.level;
  for (const index of layMines(level, safe, game.seed)) game.cells[index].mine = true;
  for (const cell of game.cells)
    cell.adjacent = neighbours(cell.index, level).filter((index) => game.cells[index].mine).length;
  game.status = "playing";
  game.started = Date.now();
};

const finish = (game, status) => {
  game.finalTime = Date.now() - game.started;
  game.status = status;
  if (status !== "won") return;
  for (const cell of game.cells) cell.flagged = cell.mine;
  const best = records.best[game.levelId];
  game.newBest = best === null || game.finalTime < best;
  if (game.newBest) records.best[game.levelId] = game.finalTime;
};

// Returns true when this move ends the game.
export const reveal = (game, index) => {
  const cell = game.cells[index];
  game.cursor = index;
  if (game.over || cell.flagged || cell.open) return false;
  if (game.status === "ready") arm(game, index);
  if (cell.mine) {
    cell.exploded = true;
    finish(game, "lost");
    return true;
  }
  const queue = [index];
  while (queue.length) {
    const next = game.cells[queue.pop()];
    if (next.open || next.flagged) continue;
    next.open = true;
    if (!next.adjacent) queue.push(...neighbours(next.index, game.level));
  }
  const hidden = game.cells.filter((item) => !item.open).length;
  if (hidden !== game.level.mines) return false;
  finish(game, "won");
  return true;
};

export const toggleFlag = (game, index) => {
  const cell = game.cells[index];
  game.cursor = index;
  if (game.status !== "playing" || cell.open) return;
  cell.flagged = !cell.flagged;
};

const MOVES = {
  ArrowLeft: (index, columns) => (index % columns ? index - 1 : index),
  ArrowRight: (index, columns) => ((index + 1) % columns ? index + 1 : index),
  ArrowUp: (index, columns) => (index >= columns ? index - columns : index),
  ArrowDown: (index, columns, total) => (index + columns < total ? index + columns : index),
  Home: (index, columns) => index - (index % columns),
  End: (index, columns) => index - (index % columns) + columns - 1,
};

export const handleKey = (game, key) => {
  const move = MOVES[key];
  if (move) {
    game.cursor = move(game.cursor, game.columns, game.cells.length);
    return true;
  }
  if (key.toLowerCase() !== "f") return false;
  toggleFlag(game, game.cursor);
  return true;
};

export const bestTimes = () =>
  Object.values(LEVELS).map((level) => ({
    id: level.id,
    label: level.label,
    time: records.best[level.id] === null ? "None yet" : seconds(records.best[level.id]),
  }));
