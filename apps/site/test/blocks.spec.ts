import { expect, ready, test } from "./fixtures";

test("login block validates, shows a busy state and toasts on success", async ({
  page,
  errors,
}) => {
  await page.goto("examples/login/");
  await ready(page, "login-form");
  const submit = page.getByRole("button", { name: "Login", exact: true });
  await submit.click();
  await expect(page.locator("ui-toaster li")).toHaveCount(0);
  await page.getByRole("textbox", { name: "Email" }).fill("ada@example.com");
  await page.locator("#password input").fill("secret");
  await page.locator("#password input").press("Enter");
  await expect(page.locator("login-form ui-spinner")).toBeVisible();
  await expect(page.locator("ui-toaster li")).toContainText("Welcome back, ada@example.com.");
  await expect(page.locator("login-form ui-spinner")).toHaveCount(0);
  void errors;
});

test("login split block takes its heading from an attribute", async ({ page, errors }) => {
  await page.goto("examples/login-split/");
  await ready(page, "login-form");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  void errors;
});

test("signup block gates submission on the terms checkbox", async ({ page, errors }) => {
  await page.goto("examples/signup/");
  await ready(page, "signup-form");
  const create = page.getByRole("button", { name: "Create account" });
  await expect(create).toBeDisabled();
  await page.getByRole("textbox", { name: "Name" }).fill("Ada");
  await page.getByRole("textbox", { name: "Email" }).fill("ada@example.com");
  await page.locator("#signup-password input").fill("analytical");
  await page.getByRole("checkbox", { name: /I agree/ }).check();
  await expect(create).toBeEnabled();
  await create.click();
  await expect(page.locator("ui-toaster li")).toContainText("Welcome, Ada!");
  void errors;
});

test("signup block does not submit incomplete details", async ({ page, errors }) => {
  await page.goto("examples/signup/");
  await ready(page, "signup-form");
  await page.getByRole("textbox", { name: "Email" }).fill("ada@example.com");
  await page.locator("#signup-password input").fill("short");
  await page.getByRole("checkbox", { name: /I agree/ }).check();
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("textbox", { name: "Name" })).toBeFocused();
  await page.waitForTimeout(200);
  await expect(page.locator("ui-toaster li")).toHaveCount(0);
  void errors;
});

test("otp block verifies a complete code", async ({ page, errors }) => {
  await page.goto("examples/otp/");
  await ready(page, "otp-form");
  const status = page.getByRole("status");
  await expect(status).toHaveText("Enter the code to continue.");
  await page.getByRole("textbox", { name: "Character 1 of 6" }).click();
  await page.keyboard.type("111111");
  await expect(status).toHaveText("That code is not valid. Try 123456.");
  await page.getByRole("textbox", { name: "Character 1 of 6" }).click();
  await page.keyboard.type("123456");
  await expect(status).toHaveText("Verified.");
  void errors;
});
