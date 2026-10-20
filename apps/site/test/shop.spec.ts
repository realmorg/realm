import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, ready, test } from "./fixtures";

const visit = async (
  page: Page,
  path: string,
  tag: string,
  lines?: { id: number; quantity: number }[],
) => {
  await page.goto(`examples/shop/${path}`);
  await ready(page, tag);
  await page.evaluate((saved) => {
    localStorage.clear();
    if (saved)
      localStorage.setItem(
        "realm:example-shop-cart",
        JSON.stringify({ lines: saved, order: null }),
      );
  }, lines);
  await page.reload();
  await ready(page, tag);
};

const products = (page: Page) =>
  page.getByRole("list", { name: "Products" }).getByRole("heading", { level: 2 });
const cartLink = (page: Page) =>
  page.getByRole("navigation", { name: "Shop" }).getByRole("link", { name: /^Cart/ });

test("shop: filter, search and sort the catalogue", async ({ page, errors }) => {
  await visit(page, "", "product-list");
  await expect(products(page)).toHaveCount(12);
  await expect(page.getByText("12 products")).toBeVisible();
  await expect(page.getByRole("link", { name: "Products" })).toHaveAttribute(
    "aria-current",
    "true",
  );

  await page.getByRole("combobox", { name: "Category" }).selectOption("kitchen");
  await expect(products(page)).toHaveText(["Stoneware mug", "Pour-over kettle", "Chef's knife"]);
  await page.getByRole("switch", { name: "In stock only" }).click();
  await expect(products(page)).toHaveText(["Stoneware mug", "Pour-over kettle"]);
  await page.getByRole("combobox", { name: "Sort by" }).selectOption("price-desc");
  await expect(products(page)).toHaveText(["Pour-over kettle", "Stoneware mug"]);

  await page.getByRole("combobox", { name: "Category" }).selectOption("all");
  await page.getByRole("combobox", { name: "Sort by" }).selectOption("price-asc");
  await expect(products(page).first()).toHaveText("Dot grid notebook");
  await page.getByRole("combobox", { name: "Sort by" }).selectOption("rating");
  await expect(products(page).first()).toHaveText("Stoneware mug");
  await page.getByRole("combobox", { name: "Sort by" }).selectOption("name");
  await expect(products(page).first()).toHaveText("Camping lantern");

  const search = page.getByRole("searchbox", { name: "Search products" });
  await search.fill("lamp");
  await expect(products(page)).toHaveText(["Table lamp"]);
  await expect(page.getByText("1 product", { exact: true })).toBeVisible();
  await search.fill("");
  await expect(products(page)).toHaveCount(11);
  await search.fill("teapot");
  await expect(page.getByRole("heading", { name: "No products found" })).toBeVisible();
  void errors;
});

test("shop: adding to the cart updates the header on every page, up to the stock", async ({
  page,
  errors,
}) => {
  await visit(page, "", "product-list");
  await expect(cartLink(page)).toHaveAccessibleName("Cart, 0 items");
  await expect(page.getByRole("button", { name: "Add Chef's knife to cart" })).toBeDisabled();

  await page.getByRole("button", { name: "Add Stoneware mug to cart" }).click();
  await expect(page.getByText("You have 1 item in your cart.")).toBeVisible();
  await expect(cartLink(page)).toHaveAccessibleName("Cart, 1 item");
  const lamp = page.getByRole("button", { name: "Add Table lamp to cart" });
  for (let i = 0; i < 6; i++) await lamp.click();
  await expect(cartLink(page)).toHaveAccessibleName("Cart, 7 items");
  await lamp.click();
  await expect(page.getByText("No more in stock")).toBeVisible();
  await expect(cartLink(page)).toHaveAccessibleName("Cart, 7 items");

  await page.goto("examples/shop/cart.html");
  await ready(page, "cart-page");
  await expect(cartLink(page)).toHaveAccessibleName("Cart, 7 items");
  await expect(cartLink(page)).toHaveAttribute("aria-current", "true");
  await expect(
    page.getByRole("list", { name: "Items in your cart" }).getByRole("listitem"),
  ).toHaveCount(2);

  await page.goto("examples/shop/product.html?id=1");
  await ready(page, "product-detail");
  await expect(cartLink(page)).toHaveAccessibleName("Cart, 7 items");
  void errors;
});

test("shop: links move between the list, a product and the cart without a router", async ({
  page,
  errors,
}) => {
  await visit(page, "", "product-list");
  await page.getByRole("link", { name: "Table lamp" }).click();
  await expect(page).toHaveURL(/product\.html\?id=5$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Table lamp");
  await page.getByRole("link", { name: "View your cart" }).click();
  await expect(page).toHaveURL(/cart\.html$/);
  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
  await page.getByRole("link", { name: "Browse products" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Products");
  void errors;
});

test("shop: the product page adds a quantity and handles sold-out and unknown products", async ({
  page,
  errors,
}) => {
  await visit(page, "product.html?id=5", "product-detail");
  await expect(page).toHaveTitle("Table lamp · Shop · REALM examples");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Table lamp");
  await expect(page.getByText("Only 6 left")).toBeVisible();
  await page.getByRole("spinbutton", { name: "Quantity" }).fill("4");
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByText("4 Table lamps. You have 4 items in your cart.")).toBeVisible();
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByText("2 Table lamps. You have 6 items in your cart.")).toBeVisible();
  await expect(cartLink(page)).toHaveAccessibleName("Cart, 6 items");

  await page.goto("examples/shop/product.html?id=3");
  await ready(page, "product-detail");
  await expect(page.getByText("This product is sold out. Check back soon.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Add to cart" })).toHaveCount(0);

  await page.goto("examples/shop/product.html?id=999");
  await ready(page, "product-detail");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Product not found");
  await expect(page).toHaveTitle("Product not found · Shop · REALM examples");
  await expect(page.getByRole("link", { name: "Browse all products" })).toHaveAttribute(
    "href",
    "./",
  );
  void errors;
});

test("shop: cart quantities, totals and removal", async ({ page, errors }) => {
  await visit(page, "cart.html", "cart-page", [
    { id: 1, quantity: 2 },
    { id: 12, quantity: 3 },
  ]);
  const items = page.getByRole("list", { name: "Items in your cart" }).getByRole("listitem");
  await expect(items).toHaveCount(2);
  const summary = page.locator("cart-page dl");
  await expect(summary).toContainText("Subtotal$366.00");
  await expect(summary).toContainText("ShippingFree");
  await expect(summary).toContainText("Tax (8%)$29.28");
  await expect(summary).toContainText("Total$395.28");

  await page.getByRole("button", { name: "Add one Trail backpack" }).click();
  await expect(page.getByRole("button", { name: "Add one Trail backpack" })).toBeDisabled();
  await expect(items.nth(1)).toContainText("$440.00");
  await page.getByRole("button", { name: "Remove one Stoneware mug" }).click();
  await expect(page.getByRole("button", { name: "Remove one Stoneware mug" })).toBeDisabled();
  await expect(cartLink(page)).toHaveAccessibleName("Cart, 5 items");

  await page.getByRole("button", { name: "Remove Trail backpack from cart" }).click();
  await expect(items).toHaveCount(1);
  await expect(summary).toContainText("Shipping$6.00");
  await expect(page.getByText("Add $57.00 more for free shipping.")).toBeVisible();
  await page.getByRole("button", { name: "Remove Stoneware mug from cart" }).click();
  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
  await expect(cartLink(page)).toHaveAccessibleName("Cart, 0 items");
  void errors;
});

test("shop: checkout validates the form, asks for confirmation and places the order", async ({
  page,
  errors,
}) => {
  await visit(page, "cart.html", "cart-page", [{ id: 2, quantity: 1 }]);
  const review = page.getByRole("button", { name: "Review order" });
  await review.click();
  for (const message of [
    "Enter your name.",
    "Enter a valid email address.",
    "Enter your street address.",
    "Enter a valid postcode.",
    "Card numbers have 16 digits.",
    "Use the MM/YY format.",
  ])
    await expect(page.getByText(message)).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Email" })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(
    violations.map(
      ({ id, nodes }) => `${id}: ${nodes.map((node) => node.target.join(" > ")).join(", ")}`,
    ),
  ).toEqual([]);

  await page.getByRole("textbox", { name: "Full name" }).fill("Ada Lovelace");
  await page.getByRole("textbox", { name: "Email" }).fill("ada@example");
  await page.getByRole("textbox", { name: "Street address" }).fill("12 Analytical Way");
  await page.getByRole("textbox", { name: "Postcode" }).fill("N1 9GU");
  await page.getByRole("textbox", { name: "Card number" }).fill("4242 4242 4242 4242");
  await page.getByRole("textbox", { name: "Expiry (MM/YY)" }).fill("13/29");
  await review.click();
  await expect(page.getByText("Enter your name.")).toHaveCount(0);
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByText("Use the MM/YY format.")).toBeVisible();

  await page.getByRole("textbox", { name: "Email" }).fill("ada@example.com");
  await page.getByRole("textbox", { name: "Expiry (MM/YY)" }).fill("12/29");
  await review.click();
  const dialog = page.getByRole("alertdialog", { name: "Place your order?" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleDescription("Your card will be charged $75.12.");
  await page.getByRole("button", { name: "Go back" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("list", { name: "Items in your cart" })).toBeVisible();

  await review.click();
  await page.getByRole("button", { name: "Place order" }).click();
  const thanks = page.getByRole("region", { name: "Order confirmation" });
  await expect(thanks).toBeVisible();
  await expect(thanks).toContainText(
    /Order R-\d{5} for \$75\.12 is on its way\. A receipt goes to ada@example\.com\./,
  );
  await expect(cartLink(page)).toHaveAccessibleName("Cart, 0 items");

  await page.reload();
  await ready(page, "cart-page");
  await expect(page.getByRole("region", { name: "Order confirmation" })).toBeVisible();
  void errors;
});
