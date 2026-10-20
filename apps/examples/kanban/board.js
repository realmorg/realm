import { defineStore } from "../../assets/realm/realm.js";

const id = () => crypto.randomUUID().slice(0, 8);

const card = (title, label = "", description = "") => ({ id: id(), title, label, description });

export const initialColumns = () => [
  {
    id: "backlog",
    title: "Backlog",
    cards: [
      card("Write the docs for props", "docs"),
      card("Port the chess example", "example", "Legal moves, check and mate."),
    ],
  },
  { id: "doing", title: "In progress", cards: [card("Keyed list reconciliation", "core")] },
  { id: "review", title: "Review", cards: [] },
  { id: "done", title: "Done", cards: [card("Archive v1", "chore")] },
];

export const board = defineStore(
  "example-kanban",
  {
    columns: initialColumns(),
    get total() {
      return this.columns.reduce((sum, column) => sum + column.cards.length, 0);
    },
  },
  { persist: "local" },
);

export const newCard = (title) => card(title);

export const findCard = (cardId) => {
  for (const column of board.columns) {
    const index = column.cards.findIndex((item) => item.id === cardId);
    if (index !== -1) return { column, index, card: column.cards[index] };
  }
  return null;
};

export const moveCard = (cardId, toColumnId, toIndex) => {
  const found = findCard(cardId);
  const target = board.columns.find((column) => column.id === toColumnId);
  if (!found || !target) return;
  const [moved] = found.column.cards.splice(found.index, 1);
  const index =
    toIndex === undefined ? target.cards.length : Math.min(toIndex, target.cards.length);
  const adjusted = found.column === target && found.index < index ? index - 1 : index;
  target.cards.splice(Math.max(adjusted, 0), 0, moved);
};
