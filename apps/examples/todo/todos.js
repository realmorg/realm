import { defineStore } from "https://realm.js.org/dist/realm.js";

export const todos = defineStore(
  "example-todos",
  {
    items: [],
    filter: "all",
    get visible() {
      if (this.filter === "active") return this.items.filter((item) => !item.done);
      if (this.filter === "done") return this.items.filter((item) => item.done);
      return this.items;
    },
    get remaining() {
      return this.items.filter((item) => !item.done).length;
    },
    get summary() {
      return `${this.remaining} ${this.remaining === 1 ? "item" : "items"} left`;
    },
    get hasDone() {
      return this.items.some((item) => item.done);
    },
    get isEmpty() {
      return this.items.length === 0;
    },
    get allDone() {
      return this.items.length > 0 && this.remaining === 0;
    },
  },
  { persist: "local" },
);
