const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export const money = (amount) => currency.format(amount);

export const pages = [
  {
    id: "overview",
    label: "Overview",
    href: "./",
    icon: "layout-dashboard",
    description: "Sales, visitors and recent activity.",
  },
  {
    id: "orders",
    label: "Orders",
    href: "orders.html",
    icon: "shopping-cart",
    description: "Every order, with its status and items.",
  },
  {
    id: "customers",
    label: "Customers",
    href: "customers.html",
    icon: "users",
    description: "People who bought from the store.",
  },
  {
    id: "products",
    label: "Products",
    href: "products.html",
    icon: "package",
    description: "The catalog, prices and stock.",
  },
  {
    id: "settings",
    label: "Settings",
    href: "settings.html",
    icon: "settings",
    description: "Your profile and notifications.",
  },
];

export const months = [
  { month: "May", desktop: 186, mobile: 80 },
  { month: "Jun", desktop: 305, mobile: 200 },
  { month: "Jul", desktop: 237, mobile: 120 },
  { month: "Aug", desktop: 73, mobile: 190 },
  { month: "Sep", desktop: 209, mobile: 130 },
  { month: "Oct", desktop: 214, mobile: 140 },
];

export const categories = ["Apparel", "Accessories", "Home", "Stationery"];

export const products = [
  { id: 1, name: "Canvas tote", category: "Accessories", price: 24, stock: 42 },
  { id: 2, name: "Linen shirt", category: "Apparel", price: 68, stock: 7 },
  { id: 3, name: "Ceramic mug", category: "Home", price: 18, stock: 120 },
  { id: 4, name: "Dot grid notebook", category: "Stationery", price: 12, stock: 0 },
  { id: 5, name: "Wool beanie", category: "Apparel", price: 32, stock: 25 },
  { id: 6, name: "Desk lamp", category: "Home", price: 89, stock: 4 },
  { id: 7, name: "Leather card case", category: "Accessories", price: 45, stock: 16 },
  { id: 8, name: "Fountain pen", category: "Stationery", price: 54, stock: 9 },
  { id: 9, name: "Hoodie", category: "Apparel", price: 72, stock: 31 },
  { id: 10, name: "Throw blanket", category: "Home", price: 96, stock: 0 },
];

export const stockLevels = [
  { max: 0, label: "Out of stock", variant: "destructive" },
  { max: 9, label: "Low stock", variant: "secondary" },
  { max: Number.POSITIVE_INFINITY, label: "In stock", variant: "outline" },
];

export const stockLevel = (stock) => stockLevels.find((level) => stock <= level.max);

const people = [
  ["Olivia Martin", "Lisbon"],
  ["Jackson Lee", "Toronto"],
  ["Isabella Nguyen", "Melbourne"],
  ["William Kim", "Seoul"],
  ["Sofia Davis", "Austin"],
  ["Noah Fischer", "Berlin"],
  ["Amara Okafor", "Lagos"],
  ["Lucas Moreau", "Lyon"],
  ["Mei Tanaka", "Osaka"],
  ["Diego Alvarez", "Bogotá"],
  ["Hannah Berg", "Oslo"],
  ["Ravi Patel", "Pune"],
];

const statusCycle = [
  "Paid",
  "Shipped",
  "Pending",
  "Paid",
  "Shipped",
  "Refunded",
  "Paid",
  "Pending",
];
export const statuses = ["Pending", "Paid", "Shipped", "Refunded"];
export const statusVariants = {
  Pending: "secondary",
  Paid: "default",
  Shipped: "outline",
  Refunded: "destructive",
};

const today = new Date(2026, 9, 20);

export const orders = Array.from({ length: 36 }, (_, index) => {
  const [name] = people[(index * 5) % people.length];
  const items = Array.from({ length: (index % 3) + 1 }, (_, line) => {
    const product = products[(index * 3 + line * 4) % products.length];
    return { product: product.name, quantity: ((index + line) % 2) + 1, price: product.price };
  });
  return {
    id: `ORD-${1036 - index}`,
    customer: name,
    email: `${name.split(" ")[0].toLowerCase()}@example.com`,
    date: day.format(new Date(today.getFullYear(), today.getMonth(), today.getDate() - index)),
    status: statusCycle[index % statusCycle.length],
    items,
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
});

export const customers = people.map(([name, city], index) => {
  const own = orders.filter((order) => order.customer === name);
  return {
    id: index + 1,
    name,
    city,
    email: `${name.split(" ")[0].toLowerCase()}@example.com`,
    initials: name
      .split(" ")
      .map((part) => part[0])
      .join(""),
    joined: day.format(new Date(2025, index % 12, ((index * 7) % 28) + 1)),
    orders: own.length,
    spent: own.reduce((sum, order) => sum + order.total, 0),
  };
});

const earned = orders.filter((order) => order.status !== "Refunded" && order.status !== "Pending");

export const stats = [
  {
    id: "revenue",
    label: "Revenue",
    icon: "dollar-sign",
    value: money(earned.reduce((sum, order) => sum + order.total, 0)),
    change: "+20.1% from last month",
  },
  {
    id: "orders",
    label: "Orders",
    icon: "shopping-cart",
    value: String(orders.length),
    change: "+12 since last week",
  },
  {
    id: "customers",
    label: "Customers",
    icon: "users",
    value: String(customers.length),
    change: "+3 this month",
  },
  {
    id: "low-stock",
    label: "Low or out of stock",
    icon: "package",
    value: String(
      products.filter((product) => stockLevel(product.stock) !== stockLevels.at(-1)).length,
    ),
    change: "Restock soon",
  },
];

export const recentSales = earned.slice(0, 5).map((order) => ({
  id: order.id,
  name: order.customer,
  email: order.email,
  initials: customers.find((customer) => customer.name === order.customer).initials,
  amount: `+${money(order.total)}`,
}));

export const defaultSettings = {
  name: "Sam Chen",
  email: "sam@example.com",
  language: "en",
  timezone: "utc",
  orderEmails: true,
  weeklyReport: true,
  productUpdates: false,
  pushAlerts: false,
};
