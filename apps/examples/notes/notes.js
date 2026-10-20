import { defineStore } from "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js";
import { markdown } from "./markdown.js";

const stamp = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const WELCOME = `# Welcome to Notes

Notes are **Markdown**. The preview updates as you type, and everything is saved in this browser.

## Shortcuts

- \`Alt+N\` creates a note
- \`Alt+P\` pins or unpins the current note
- \`Alt+↑\` and \`Alt+↓\` move between notes
- \`/\` jumps to search

> Pinned notes stay at the top of the list.

Read more about [REALM](https://realm.js.org/).`;

const seed = () => [
  { id: "welcome", body: WELCOME, pinned: true, updated: Date.UTC(2026, 9, 18, 9, 30) },
  {
    id: "groceries",
    body: "# Groceries\n\n- Oat milk\n- Coffee beans\n- ~~Bread~~\n- Tomatoes",
    pinned: false,
    updated: Date.UTC(2026, 9, 17, 17, 5),
  },
  {
    id: "standup",
    body: "# Standup\n\n1. Ship the *notes* example\n2. Review `defineStore` docs\n\n```\npnpm --filter site test\n```",
    pinned: false,
    updated: Date.UTC(2026, 9, 16, 8, 45),
  },
];

const titleOf = (body) => {
  const first = body.split("\n").find((line) => line.trim()) ?? "";
  return first.replace(/^#+\s*/, "").trim() || "Untitled";
};

const excerptOf = (body) =>
  body
    .split("\n")
    .slice(1)
    .join(" ")
    .replace(/[#>*_`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80) || "No additional text";

export const notes = defineStore(
  "example-notes",
  {
    items: seed(),
    selectedId: "welcome",
    query: "",
    view: "split",
    get current() {
      return this.items.find((note) => note.id === this.selectedId) ?? null;
    },
    get ordered() {
      return this.items.toSorted((a, b) => b.pinned - a.pinned || b.updated - a.updated);
    },
    get visible() {
      const query = this.query.trim().toLowerCase();
      return this.ordered
        .filter((note) => note.body.toLowerCase().includes(query))
        .map((note) => ({
          id: note.id,
          pinned: note.pinned,
          title: titleOf(note.body),
          excerpt: excerptOf(note.body),
          updated: stamp.format(note.updated),
          current: note.id === this.selectedId,
        }));
    },
    get title() {
      return this.current ? titleOf(this.current.body) : "";
    },
    get preview() {
      return this.current ? markdown(this.current.body) : "";
    },
    get summary() {
      const count = this.visible.length;
      return `${count} ${count === 1 ? "note" : "notes"}`;
    },
  },
  { persist: "local" },
);

export const createNote = () => {
  const note = { id: crypto.randomUUID(), body: "# ", pinned: false, updated: Date.now() };
  notes.items.push(note);
  notes.query = "";
  notes.selectedId = note.id;
};

export const select = (id) => {
  notes.selectedId = id;
};

export const write = (body) => {
  notes.current.body = body;
  notes.current.updated = Date.now();
};

export const togglePin = () => {
  if (notes.current) notes.current.pinned = !notes.current.pinned;
};

export const removeCurrent = () => {
  const list = notes.visible;
  const index = list.findIndex((note) => note.current);
  const next = list[index + 1] ?? list[index - 1];
  notes.items = notes.items.filter((note) => note.id !== notes.selectedId);
  notes.selectedId = next?.id ?? null;
};

export const step = (offset) => {
  const list = notes.visible;
  const index = list.findIndex((note) => note.current);
  const next = list[Math.min(Math.max(index + offset, 0), list.length - 1)];
  if (next) notes.selectedId = next.id;
};

const editing = (event) =>
  event
    .composedPath()
    .some((node) => node.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(node.nodeName));

const ALT_KEYS = { KeyN: "new", KeyP: "pin", ArrowDown: "next", ArrowUp: "previous" };

export const shortcutFor = (event) => {
  if (event.ctrlKey || event.metaKey) return undefined;
  if (event.altKey) return ALT_KEYS[event.code];
  return event.key === "/" && !editing(event) ? "search" : undefined;
};
