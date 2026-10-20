export const stats = [
  { id: "revenue", label: "Total revenue", value: "$45,231.89", change: "+20.1% from last month" },
  {
    id: "subscriptions",
    label: "Subscriptions",
    value: "+2,350",
    change: "+180.1% from last month",
  },
  { id: "sales", label: "Sales", value: "+12,234", change: "+19% from last month" },
  { id: "active", label: "Active now", value: "+573", change: "+201 since last hour" },
];

export const months = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

export const sales = [
  {
    id: 1,
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
    initials: "OM",
  },
  { id: 2, name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", initials: "JL" },
  {
    id: 3,
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
    initials: "IN",
  },
  { id: 4, name: "William Kim", email: "will@email.com", amount: "+$99.00", initials: "WK" },
];

const statuses = ["Paid", "Pending", "Unpaid"];
const methods = ["Credit card", "PayPal", "Bank transfer"];

export const invoices = Array.from({ length: 23 }, (_, index) => ({
  id: `INV${String(index + 1).padStart(3, "0")}`,
  status: statuses[index % 3],
  method: methods[(index * 2) % 3],
  amount: `$${((index * 137) % 900) + 100}.00`,
}));

export const navigation = [
  { id: "dashboard", label: "Dashboard", icon: "⌂" },
  { id: "analytics", label: "Analytics", icon: "◔" },
  { id: "projects", label: "Projects", icon: "▤" },
  { id: "team", label: "Team", icon: "☺" },
  { id: "settings", label: "Settings", icon: "⚙" },
];
