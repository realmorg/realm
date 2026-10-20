import { defineStore } from "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const dayFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const monthFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export const money = (amount) => currency.format(amount);

const asDate = (iso) => new Date(`${iso}T00:00:00Z`);

export const CATEGORIES = [
  { id: "food", label: "Food" },
  { id: "housing", label: "Housing" },
  { id: "transport", label: "Transport" },
  { id: "fun", label: "Fun" },
  { id: "health", label: "Health" },
  { id: "other", label: "Other" },
];

const LABELS = Object.fromEntries(CATEGORIES.map((category) => [category.id, category.label]));

const seed = () =>
  [
    ["2026-08-01", "Rent", "housing", 1450],
    ["2026-08-04", "Groceries", "food", 86.4],
    ["2026-08-12", "Train pass", "transport", 72],
    ["2026-08-19", "Concert tickets", "fun", 95],
    ["2026-09-01", "Rent", "housing", 1450],
    ["2026-09-06", "Groceries", "food", 112.15],
    ["2026-09-14", "Pharmacy", "health", 23.9],
    ["2026-09-22", "Dinner out", "food", 64.5],
    ["2026-10-01", "Rent", "housing", 1450],
    ["2026-10-03", "Groceries", "food", 94.2],
    ["2026-10-08", "Bike repair", "transport", 48],
    ["2026-10-11", "Cinema", "fun", 28],
  ].map(([date, description, category, amount], index) => ({
    id: `seed-${index}`,
    date,
    description,
    category,
    amount,
  }));

const COMPARE = {
  date: (a, b) => a.date.localeCompare(b.date),
  description: (a, b) => a.description.localeCompare(b.description),
  category: (a, b) => LABELS[a.category].localeCompare(LABELS[b.category]),
  amount: (a, b) => a.amount - b.amount,
};

export const COLUMNS = [
  { key: "date", label: "Date" },
  { key: "description", label: "Description" },
  { key: "category", label: "Category" },
  { key: "amount", label: "Amount" },
];

const SORT_NAMES = { asc: "ascending", desc: "descending" };

const cell = (value) => {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

export const toCsv = (rows) =>
  [
    ["Date", "Description", "Category", "Amount"],
    ...rows.map((row) => [row.date, row.description, row.categoryLabel, row.amount.toFixed(2)]),
  ]
    .map((line) => line.map(cell).join(","))
    .join("\n");

const sum = (items) => items.reduce((total, item) => total + item.amount, 0);

export const expenses = defineStore(
  "example-expenses",
  {
    items: seed(),
    category: "all",
    month: "all",
    query: "",
    sortKey: "date",
    sortDirection: "desc",
    get filtered() {
      const query = this.query.trim().toLowerCase();
      return this.items.filter(
        (item) =>
          (this.category === "all" || item.category === this.category) &&
          (this.month === "all" || item.date.startsWith(this.month)) &&
          item.description.toLowerCase().includes(query),
      );
    },
    get rows() {
      const sign = this.sortDirection === "asc" ? 1 : -1;
      return this.filtered
        .toSorted((a, b) => COMPARE[this.sortKey](a, b) * sign || b.date.localeCompare(a.date))
        .map((item) => ({
          ...item,
          day: dayFormat.format(asDate(item.date)),
          categoryLabel: LABELS[item.category],
          price: money(item.amount),
          removeLabel: `Delete ${item.description} on ${dayFormat.format(asDate(item.date))}`,
        }));
    },
    get columns() {
      return COLUMNS.map((column) => ({
        ...column,
        sort: column.key === this.sortKey ? SORT_NAMES[this.sortDirection] : "none",
        icon:
          column.key !== this.sortKey
            ? "arrow-up-down"
            : this.sortDirection === "asc"
              ? "arrow-up"
              : "arrow-down",
      }));
    },
    get total() {
      return money(sum(this.filtered));
    },
    get count() {
      const count = this.filtered.length;
      return `${count} ${count === 1 ? "expense" : "expenses"}`;
    },
    get average() {
      return money(this.filtered.length ? sum(this.filtered) / this.filtered.length : 0);
    },
    get largest() {
      const top = this.filtered.toSorted((a, b) => b.amount - a.amount)[0];
      return top ? `${top.description}, ${money(top.amount)}` : "None";
    },
    get byCategory() {
      return CATEGORIES.map((category) => ({
        category: category.label,
        amount:
          Math.round(sum(this.filtered.filter((item) => item.category === category.id)) * 100) /
          100,
      })).filter((entry) => entry.amount > 0);
    },
    get months() {
      const keys = [...new Set(this.items.map((item) => item.date.slice(0, 7)))].sort().reverse();
      return keys.map((key, index) => {
        const items = this.items.filter((item) => item.date.startsWith(key));
        const total = sum(items);
        const previous = keys[index + 1];
        const before = previous
          ? sum(this.items.filter((item) => item.date.startsWith(previous)))
          : 0;
        const change = before ? Math.round(((total - before) / before) * 100) : null;
        return {
          key,
          label: monthFormat.format(asDate(`${key}-01`)),
          total: money(total),
          count: `${items.length} ${items.length === 1 ? "expense" : "expenses"}`,
          change:
            change === null
              ? "First month"
              : `${change > 0 ? "+" : ""}${change}% vs previous month`,
          current: key === this.month,
        };
      });
    },
    get csv() {
      return `data:text/csv;charset=utf-8,${encodeURIComponent(toCsv(this.rows))}`;
    },
    get filtering() {
      return this.category !== "all" || this.month !== "all" || this.query.trim() !== "";
    },
  },
  { persist: "local" },
);

export const today = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
};

export const addExpense = (data) => {
  expenses.items.push({
    id: crypto.randomUUID(),
    date: data.get("date"),
    description: data.get("description").trim(),
    category: data.get("category"),
    amount: Math.round(Number(data.get("amount")) * 100) / 100,
  });
};

export const removeExpense = (id) => {
  expenses.items = expenses.items.filter((item) => item.id !== id);
};

export const sortBy = (key) => {
  const same = expenses.sortKey === key;
  expenses.sortDirection = same && expenses.sortDirection === "desc" ? "asc" : "desc";
  expenses.sortKey = key;
};

export const toggleMonth = (key) => {
  expenses.month = expenses.month === key ? "all" : key;
};

export const clearFilters = () => {
  Object.assign(expenses, { category: "all", month: "all", query: "" });
};
