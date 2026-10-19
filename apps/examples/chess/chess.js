export const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const FILES = "abcdefgh";
const KNIGHT = [-17, -15, -10, -6, 6, 10, 15, 17];
const KING = [-9, -8, -7, -1, 1, 7, 8, 9];
const DIAGONAL = [-9, -7, 7, 9];
const STRAIGHT = [-8, -1, 1, 8];
const VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };

export const squareName = (index) => `${FILES[index % 8]}${8 - Math.floor(index / 8)}`;
export const squareIndex = (name) => (8 - Number(name[1])) * 8 + FILES.indexOf(name[0]);

const file = (index) => index % 8;
const opponent = (color) => (color === "w" ? "b" : "w");
const fileDistance = (a, b) => Math.abs(file(a) - file(b));

export class Chess {
  constructor(fen = START) {
    this.load(fen);
  }

  load(fen) {
    const [placement, turn, castling, enPassant, halfmove = "0", fullmove = "1"] = fen
      .trim()
      .split(/\s+/);
    this.board = Array(64).fill(null);
    let index = 0;
    for (const char of placement) {
      if (char === "/") continue;
      if (/\d/.test(char)) index += Number(char);
      else {
        this.board[index] = {
          type: char.toLowerCase(),
          color: char === char.toUpperCase() ? "w" : "b",
        };
        index++;
      }
    }
    this.turn = turn;
    this.castling = {
      K: castling.includes("K"),
      Q: castling.includes("Q"),
      k: castling.includes("k"),
      q: castling.includes("q"),
    };
    this.enPassant = enPassant === "-" ? -1 : squareIndex(enPassant);
    this.halfmove = Number(halfmove);
    this.fullmove = Number(fullmove);
    this.history = [];
    this.positions = new Map([[this.key(), 1]]);
  }

  fen() {
    let placement = "";
    for (let rank = 0; rank < 8; rank++) {
      let empty = 0;
      for (let f = 0; f < 8; f++) {
        const piece = this.board[rank * 8 + f];
        if (!piece) {
          empty++;
          continue;
        }
        if (empty) placement += empty;
        empty = 0;
        placement += piece.color === "w" ? piece.type.toUpperCase() : piece.type;
      }
      if (empty) placement += empty;
      if (rank < 7) placement += "/";
    }
    const castling = ["K", "Q", "k", "q"].filter((right) => this.castling[right]).join("") || "-";
    const enPassant = this.enPassant === -1 ? "-" : squareName(this.enPassant);
    return `${placement} ${this.turn} ${castling} ${enPassant} ${this.halfmove} ${this.fullmove}`;
  }

  key() {
    return this.fen().split(" ").slice(0, 4).join(" ");
  }

  king(color) {
    return this.board.findIndex((piece) => piece?.type === "k" && piece.color === color);
  }

  attacked(square, by) {
    const pawnSources = by === "w" ? [7, 9] : [-7, -9];
    for (const offset of pawnSources) {
      const from = square + offset;
      const piece = this.board[from];
      if (
        from >= 0 &&
        from < 64 &&
        fileDistance(from, square) === 1 &&
        piece?.color === by &&
        piece.type === "p"
      )
        return true;
    }
    for (const offset of KNIGHT) {
      const from = square + offset;
      const piece = this.board[from];
      if (
        from >= 0 &&
        from < 64 &&
        fileDistance(from, square) <= 2 &&
        piece?.color === by &&
        piece.type === "n"
      )
        return true;
    }
    for (const offset of KING) {
      const from = square + offset;
      const piece = this.board[from];
      if (
        from >= 0 &&
        from < 64 &&
        fileDistance(from, square) <= 1 &&
        piece?.color === by &&
        piece.type === "k"
      )
        return true;
    }
    const slide = (directions, types) => {
      for (const step of directions) {
        let from = square;
        for (;;) {
          const next = from + step;
          if (next < 0 || next >= 64 || fileDistance(next, from) > 1) break;
          from = next;
          const piece = this.board[from];
          if (!piece) continue;
          if (piece.color === by && types.includes(piece.type)) return true;
          break;
        }
      }
      return false;
    };
    return slide(DIAGONAL, ["b", "q"]) || slide(STRAIGHT, ["r", "q"]);
  }

  inCheck(color = this.turn) {
    return this.attacked(this.king(color), opponent(color));
  }

  pseudoMoves(color = this.turn) {
    const moves = [];
    const add = (from, to, extra = {}) =>
      moves.push({
        from,
        to,
        piece: this.board[from].type,
        captured: this.board[to]?.type,
        ...extra,
      });
    for (let from = 0; from < 64; from++) {
      const piece = this.board[from];
      if (!piece || piece.color !== color) continue;
      if (piece.type === "p") {
        const dir = color === "w" ? -8 : 8;
        const startRank = color === "w" ? 6 : 1;
        const lastRank = color === "w" ? 0 : 7;
        const pushTo = (to, extra = {}) => {
          if (Math.floor(to / 8) === lastRank)
            for (const promotion of ["q", "r", "b", "n"]) add(from, to, { ...extra, promotion });
          else add(from, to, extra);
        };
        const one = from + dir;
        if (one >= 0 && one < 64 && !this.board[one]) {
          pushTo(one);
          const two = from + dir * 2;
          if (Math.floor(from / 8) === startRank && !this.board[two])
            add(from, two, { double: true });
        }
        for (const side of [-1, 1]) {
          const to = from + dir + side;
          if (to < 0 || to >= 64 || fileDistance(from, to) !== 1) continue;
          if (this.board[to] && this.board[to].color !== color) pushTo(to);
          else if (to === this.enPassant) add(from, to, { enPassant: true, captured: "p" });
        }
        continue;
      }
      if (piece.type === "n" || piece.type === "k") {
        const offsets = piece.type === "n" ? KNIGHT : KING;
        const reach = piece.type === "n" ? 2 : 1;
        for (const offset of offsets) {
          const to = from + offset;
          if (to < 0 || to >= 64 || fileDistance(from, to) > reach) continue;
          if (this.board[to]?.color === color) continue;
          add(from, to);
        }
        if (piece.type === "k") this.#castles(from, color, add);
        continue;
      }
      const directions =
        piece.type === "b" ? DIAGONAL : piece.type === "r" ? STRAIGHT : [...DIAGONAL, ...STRAIGHT];
      for (const step of directions) {
        let current = from;
        for (;;) {
          const to = current + step;
          if (to < 0 || to >= 64 || fileDistance(to, current) > 1) break;
          if (this.board[to]?.color === color) break;
          add(from, to);
          if (this.board[to]) break;
          current = to;
        }
      }
    }
    return moves;
  }

  #castles(from, color, add) {
    const home = color === "w" ? 60 : 4;
    if (from !== home || this.inCheck(color)) return;
    const enemy = opponent(color);
    const [kingSide, queenSide] = color === "w" ? ["K", "Q"] : ["k", "q"];
    if (
      this.castling[kingSide] &&
      !this.board[home + 1] &&
      !this.board[home + 2] &&
      this.board[home + 3]?.type === "r"
    ) {
      if (!this.attacked(home + 1, enemy) && !this.attacked(home + 2, enemy))
        add(from, home + 2, { castle: "king" });
    }
    if (
      this.castling[queenSide] &&
      !this.board[home - 1] &&
      !this.board[home - 2] &&
      !this.board[home - 3] &&
      this.board[home - 4]?.type === "r"
    ) {
      if (!this.attacked(home - 1, enemy) && !this.attacked(home - 2, enemy))
        add(from, home - 2, { castle: "queen" });
    }
  }

  moves(from) {
    const color = this.turn;
    return this.pseudoMoves(color).filter((move) => {
      if (from !== undefined && move.from !== from) return false;
      this.#apply(move);
      const legal = !this.inCheck(color);
      this.#revert();
      return legal;
    });
  }

  #apply(move) {
    const piece = this.board[move.from];
    this.history.push({
      move,
      piece,
      captured: move.enPassant
        ? this.board[move.to + (piece.color === "w" ? 8 : -8)]
        : this.board[move.to],
      castling: { ...this.castling },
      enPassant: this.enPassant,
      halfmove: this.halfmove,
      fullmove: this.fullmove,
    });
    this.board[move.to] = move.promotion ? { type: move.promotion, color: piece.color } : piece;
    this.board[move.from] = null;
    if (move.enPassant) this.board[move.to + (piece.color === "w" ? 8 : -8)] = null;
    if (move.castle) {
      const [rookFrom, rookTo] =
        move.castle === "king" ? [move.from + 3, move.from + 1] : [move.from - 4, move.from - 1];
      this.board[rookTo] = this.board[rookFrom];
      this.board[rookFrom] = null;
    }
    if (piece.type === "k") {
      if (piece.color === "w") this.castling.K = this.castling.Q = false;
      else this.castling.k = this.castling.q = false;
    }
    for (const [square, right] of [
      [63, "K"],
      [56, "Q"],
      [7, "k"],
      [0, "q"],
    ]) {
      if (move.from === square || move.to === square) this.castling[right] = false;
    }
    this.enPassant = move.double ? (move.from + move.to) / 2 : -1;
    this.halfmove = piece.type === "p" || move.captured ? 0 : this.halfmove + 1;
    if (piece.color === "b") this.fullmove++;
    this.turn = opponent(piece.color);
  }

  #revert() {
    const entry = this.history.pop();
    const { move, piece, captured } = entry;
    this.board[move.from] = piece;
    this.board[move.to] = null;
    if (move.enPassant) this.board[move.to + (piece.color === "w" ? 8 : -8)] = captured;
    else this.board[move.to] = captured;
    if (move.castle) {
      const [rookFrom, rookTo] =
        move.castle === "king" ? [move.from + 3, move.from + 1] : [move.from - 4, move.from - 1];
      this.board[rookFrom] = this.board[rookTo];
      this.board[rookTo] = null;
    }
    this.castling = entry.castling;
    this.enPassant = entry.enPassant;
    this.halfmove = entry.halfmove;
    this.fullmove = entry.fullmove;
    this.turn = piece.color;
    return entry;
  }

  san(move) {
    if (move.castle) return this.#suffix(move, move.castle === "king" ? "O-O" : "O-O-O");
    const piece = move.piece;
    const capture = move.captured ? "x" : "";
    const to = squareName(move.to);
    if (piece === "p") {
      const base = `${capture ? `${FILES[file(move.from)]}x` : ""}${to}${move.promotion ? `=${move.promotion.toUpperCase()}` : ""}`;
      return this.#suffix(move, base);
    }
    const rivals = this.moves().filter(
      (other) => other.piece === piece && other.to === move.to && other.from !== move.from,
    );
    let disambiguation = "";
    if (rivals.length) {
      const sameFile = rivals.some((other) => file(other.from) === file(move.from));
      const sameRank = rivals.some(
        (other) => Math.floor(other.from / 8) === Math.floor(move.from / 8),
      );
      const name = squareName(move.from);
      disambiguation = !sameFile ? name[0] : !sameRank ? name[1] : name;
    }
    return this.#suffix(move, `${piece.toUpperCase()}${disambiguation}${capture}${to}`);
  }

  #suffix(move, text) {
    this.#apply(move);
    const check = this.inCheck();
    const mate = check && this.moves().length === 0;
    this.#revert();
    return `${text}${mate ? "#" : check ? "+" : ""}`;
  }

  move({ from, to, promotion = "q" }) {
    const move = this.moves(from).find(
      (candidate) =>
        candidate.to === to && (!candidate.promotion || candidate.promotion === promotion),
    );
    if (!move) return null;
    const san = this.san(move);
    this.#apply(move);
    this.history.at(-1).san = san;
    const key = this.key();
    this.positions.set(key, (this.positions.get(key) ?? 0) + 1);
    return { ...move, san };
  }

  undo() {
    if (!this.history.length) return null;
    const key = this.key();
    this.positions.set(key, this.positions.get(key) - 1);
    return this.#revert().move;
  }

  insufficientMaterial() {
    const pieces = this.board
      .map((piece, index) => piece && { ...piece, index })
      .filter((piece) => piece && piece.type !== "k");
    if (pieces.length === 0) return true;
    if (pieces.length === 1 && (pieces[0].type === "b" || pieces[0].type === "n")) return true;
    if (pieces.every((piece) => piece.type === "b")) {
      const colors = new Set(
        pieces.map((piece) => (Math.floor(piece.index / 8) + file(piece.index)) % 2),
      );
      return colors.size === 1;
    }
    return false;
  }

  status() {
    const moves = this.moves();
    const check = this.inCheck();
    if (!moves.length) return check ? "checkmate" : "stalemate";
    if (this.halfmove >= 100) return "fifty-move";
    if (this.insufficientMaterial()) return "insufficient";
    if ((this.positions.get(this.key()) ?? 0) >= 3) return "repetition";
    return check ? "check" : "playing";
  }

  perft(depth) {
    if (depth === 0) return 1;
    let nodes = 0;
    for (const move of this.moves()) {
      this.#apply(move);
      nodes += this.perft(depth - 1);
      this.#revert();
    }
    return nodes;
  }

  evaluate() {
    let score = 0;
    this.board.forEach((piece, index) => {
      if (!piece) return;
      const center =
        3.5 - Math.abs(3.5 - file(index)) + (3.5 - Math.abs(3.5 - Math.floor(index / 8)));
      const value = VALUES[piece.type] + (piece.type === "k" ? 0 : center * 4);
      score += piece.color === "w" ? value : -value;
    });
    return score;
  }

  #negamax(depth, alpha, beta) {
    const moves = this.moves();
    if (!moves.length) return this.inCheck() ? -100000 - depth : 0;
    if (depth === 0) return (this.turn === "w" ? 1 : -1) * this.evaluate();
    let best = -Infinity;
    for (const move of moves) {
      this.#apply(move);
      const score = -this.#negamax(depth - 1, -beta, -alpha);
      this.#revert();
      best = Math.max(best, score);
      alpha = Math.max(alpha, score);
      if (alpha >= beta) break;
    }
    return best;
  }

  bestMove(depth = 2) {
    let choice = null;
    let best = -Infinity;
    const ordered = this.moves().sort(
      (a, b) => (VALUES[b.captured] ?? 0) - (VALUES[a.captured] ?? 0),
    );
    for (const move of ordered) {
      this.#apply(move);
      const score = -this.#negamax(depth - 1, -Infinity, Infinity);
      this.#revert();
      if (score > best) {
        best = score;
        choice = move;
      }
    }
    return choice;
  }
}

export const SYMBOLS = { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" };
export const NAMES = { k: "king", q: "queen", r: "rook", b: "bishop", n: "knight", p: "pawn" };
