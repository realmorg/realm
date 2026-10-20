import { defineStore } from "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const money = (amount) => currency.format(amount);

export const CATEGORIES = [
  { id: "kitchen", label: "Kitchen" },
  { id: "home", label: "Home" },
  { id: "desk", label: "Desk" },
  { id: "outdoors", label: "Outdoors" },
];

const LABELS = Object.fromEntries(CATEGORIES.map((category) => [category.id, category.label]));

export const PRODUCTS = [
  [
    1,
    "Stoneware mug",
    "kitchen",
    18,
    4.8,
    24,
    "coffee",
    "A heavy, glazed mug that keeps coffee warm for longer.",
  ],
  [
    2,
    "Pour-over kettle",
    "kitchen",
    64,
    4.6,
    8,
    "flame-kindling",
    "A gooseneck kettle for a slow, even pour.",
  ],
  [
    3,
    "Chef's knife",
    "kitchen",
    89,
    4.9,
    0,
    "utensils",
    "A 20 cm carbon steel blade, sharpened by hand.",
  ],
  [
    4,
    "Linen throw",
    "home",
    72,
    4.5,
    15,
    "bed-double",
    "Washed linen in a soft oat colour, 130 by 170 cm.",
  ],
  [5, "Table lamp", "home", 120, 4.7, 6, "lamp", "A dimmable lamp with a frosted glass shade."],
  [
    6,
    "Plant pot",
    "home",
    26,
    4.3,
    40,
    "sprout",
    "Terracotta with a saucer, for plants up to 20 cm.",
  ],
  [
    7,
    "Dot grid notebook",
    "desk",
    14,
    4.4,
    60,
    "notebook",
    "A5, 160 pages of 100 gsm paper that takes fountain pens.",
  ],
  [
    8,
    "Desk organiser",
    "desk",
    38,
    4.1,
    12,
    "layout-grid",
    "Oak trays for pens, cards and the things that pile up.",
  ],
  [
    9,
    "Mechanical pencil",
    "desk",
    22,
    4.6,
    33,
    "pencil",
    "A brass pencil with 0.5 mm leads and a knurled grip.",
  ],
  [
    10,
    "Insulated bottle",
    "outdoors",
    32,
    4.8,
    50,
    "cup-soda",
    "Keeps drinks cold for 24 hours or hot for 12.",
  ],
  [
    11,
    "Camping lantern",
    "outdoors",
    45,
    4.2,
    9,
    "lamp-desk",
    "A rechargeable lantern with three brightness levels.",
  ],
  [
    12,
    "Trail backpack",
    "outdoors",
    110,
    4.7,
    4,
    "backpack",
    "A 24 litre pack with a rain cover and hip belt.",
  ],
].map(([id, name, category, price, rating, stock, icon, description]) => ({
  id,
  name,
  category,
  categoryLabel: LABELS[category],
  price,
  priceLabel: money(price),
  rating,
  ratingLabel: `${rating} out of 5`,
  stock,
  inStock: stock > 0,
  stockLabel: stock === 0 ? "Sold out" : stock < 10 ? `Only ${stock} left` : "In stock",
  icon,
  description,
  href: `product.html?id=${id}`,
  addLabel: `Add ${name} to cart`,
}));

export const plural = (count, word) => `${count} ${count === 1 ? word : `${word}s`}`;

export const findProduct = (id) => PRODUCTS.find((product) => product.id === Number(id)) ?? null;

export const productFromUrl = (search) => findProduct(new URLSearchParams(search).get("id"));

const SORTS = {
  featured: (a, b) => a.id - b.id,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  name: (a, b) => a.name.localeCompare(b.name),
};

export const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
  { id: "name", label: "Name" },
];

export const catalogue = ({ query, category, sort, inStock }) => {
  const text = query.trim().toLowerCase();
  return PRODUCTS.filter(
    (product) =>
      (category === "all" || product.category === category) &&
      (!inStock || product.inStock) &&
      `${product.name} ${product.description}`.toLowerCase().includes(text),
  ).toSorted(SORTS[sort]);
};

const FREE_SHIPPING = 75;
const SHIPPING = 6;
const TAX = 0.08;

export const cart = defineStore(
  "example-shop-cart",
  {
    lines: [],
    order: null,
    get items() {
      return this.lines.map((line) => {
        const product = findProduct(line.id);
        return {
          ...product,
          quantity: line.quantity,
          lineTotal: money(product.price * line.quantity),
          max: product.stock,
          atMax: line.quantity >= product.stock,
          atMin: line.quantity <= 1,
          decreaseLabel: `Remove one ${product.name}`,
          increaseLabel: `Add one ${product.name}`,
          removeLabel: `Remove ${product.name} from cart`,
          quantityLabel: `${line.quantity} × ${product.name}`,
        };
      });
    },
    get count() {
      return this.lines.reduce((total, line) => total + line.quantity, 0);
    },
    get hasItems() {
      return this.count > 0;
    },
    get countLabel() {
      return `Cart, ${plural(this.count, "item")}`;
    },
    get subtotal() {
      return this.lines.reduce(
        (total, line) => total + findProduct(line.id).price * line.quantity,
        0,
      );
    },
    get shipping() {
      return this.subtotal >= FREE_SHIPPING || this.subtotal === 0 ? 0 : SHIPPING;
    },
    get totals() {
      const tax = Math.round(this.subtotal * TAX * 100) / 100;
      return {
        subtotal: money(this.subtotal),
        shipping: this.shipping ? money(this.shipping) : "Free",
        tax: money(tax),
        total: money(this.subtotal + this.shipping + tax),
        freeShippingHint:
          this.shipping > 0
            ? `Add ${money(FREE_SHIPPING - this.subtotal)} more for free shipping.`
            : "",
      };
    },
  },
  { persist: "local" },
);

export const quantityIn = (id) => cart.lines.find((line) => line.id === id)?.quantity ?? 0;

// Adds up to the stock that is left and returns how many were added.
export const addToCart = (product, quantity = 1) => {
  const line = cart.lines.find((item) => item.id === product.id);
  const added = Math.max(0, Math.min(quantity, product.stock - quantityIn(product.id)));
  if (!added) return 0;
  if (line) line.quantity += added;
  else cart.lines.push({ id: product.id, quantity: added });
  cart.order = null;
  return added;
};

export const addedToast = (product, added) =>
  added
    ? {
        title: "Added to cart",
        description: `${plural(added, product.name)}. You have ${plural(cart.count, "item")} in your cart.`,
      }
    : {
        title: "No more in stock",
        description: `Your cart already holds every ${product.name} we have.`,
        variant: "destructive",
      };

export const titleFor = (product) =>
  `${product ? product.name : "Product not found"} · Shop · REALM examples`;

export const changeQuantity = (id, delta) => {
  const line = cart.lines.find((item) => item.id === id);
  line.quantity = Math.min(Math.max(line.quantity + delta, 1), findProduct(id).stock);
};

export const removeFromCart = (id) => {
  cart.lines = cart.lines.filter((line) => line.id !== id);
};

const CHECKS = {
  name: (value) => (value.trim() ? "" : "Enter your name."),
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Enter a valid email address.",
  address: (value) => (value.trim().length >= 5 ? "" : "Enter your street address."),
  postcode: (value) =>
    /^[A-Za-z0-9 -]{3,10}$/.test(value.trim()) ? "" : "Enter a valid postcode.",
  card: (value) =>
    /^\d{16}$/.test(value.replace(/\s/g, "")) ? "" : "Card numbers have 16 digits.",
  expiry: (value) => (/^(0[1-9]|1[0-2])\/\d{2}$/.test(value.trim()) ? "" : "Use the MM/YY format."),
};

export const validate = (data) =>
  Object.fromEntries(
    Object.entries(CHECKS)
      .map(([field, check]) => [field, check(String(data.get(field) ?? ""))])
      .filter(([, message]) => message),
  );

export const placeOrder = (data) => {
  cart.order = {
    number: `R-${String(Math.floor(Math.random() * 90_000) + 10_000)}`,
    email: String(data.get("email")),
    total: cart.totals.total,
    count: cart.count,
  };
  cart.lines = [];
};
