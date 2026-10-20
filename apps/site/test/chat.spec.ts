import { expect, ready, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.goto("examples/chat/");
  await ready(page, "chat-app");
  await expect(page.getByRole("textbox", { name: "Message" })).toBeAttached();
});

const conversations = (page: import("@playwright/test").Page) =>
  page.getByRole("navigation", { name: "Conversations" }).getByRole("button");

test("chat: Enter sends, Shift+Enter adds a line, then a typing indicator and a reply", async ({
  page,
  errors,
}) => {
  const log = page.locator("chat-thread ui-message-scroller");
  const message = page.getByRole("textbox", { name: "Message" });
  await message.click();
  await message.pressSequentially("Hello there");
  await message.press("Shift+Enter");
  await message.pressSequentially("Second line");
  await expect(message).toHaveValue("Hello there\nSecond line");
  await message.press("Enter");

  await expect(message).toHaveValue("");
  await expect(log.locator("ui-bubble").last()).toHaveText("Hello there\nSecond line");
  await expect(page.getByText("Ana Lopez is typing")).toBeAttached();
  await expect(page.locator("chat-thread header p")).toHaveText("typing…");
  await expect(conversations(page).first()).toContainText("typing…");

  await expect(log.locator("ui-bubble").last()).toHaveText("Sounds good to me.");
  await expect(page.getByText("Ana Lopez is typing")).toHaveCount(0);
  await expect(page.locator("chat-thread header p")).toHaveText("Product designer");
  await expect(conversations(page).first()).toContainText("Sounds good to me.");

  await page.getByRole("button", { name: "Send" }).click();
  await expect(log.locator("ui-message")).toHaveCount(5);
  void errors;
});

test("chat: a reply to another conversation adds an unread badge until it is opened", async ({
  page,
  errors,
}) => {
  await expect(page).toHaveTitle("(3) Chat · REALM examples");
  await expect(page.getByText("3 unread", { exact: true })).toBeVisible();
  const ben = conversations(page).filter({ hasText: "Ben Carter" });
  await expect(ben).toContainText("2 unread");

  const message = page.getByRole("textbox", { name: "Message" });
  await message.fill("Quick question");
  await message.press("Enter");
  await ben.click();
  await expect(ben).toHaveAttribute("aria-current", "true");
  await expect(page.getByRole("heading", { name: "Ben Carter" })).toBeVisible();
  await expect(page).toHaveTitle("(1) Chat · REALM examples");

  const ana = conversations(page).filter({ hasText: "Ana Lopez" });
  await expect(ana).toContainText("1 unread");
  await expect(ana).toContainText("Sounds good to me.");
  await expect(page).toHaveTitle("(2) Chat · REALM examples");

  await ana.click();
  await expect(
    page.locator("chat-thread ui-message-scroller").locator("ui-bubble").last(),
  ).toHaveText("Sounds good to me.");
  await conversations(page).filter({ hasText: "Chloe Park" }).click();
  await expect(page).toHaveTitle("Chat · REALM examples");
  await expect(page.getByText("3 unread", { exact: true })).toHaveCount(0);
  void errors;
});

test("chat: attach a file, remove it, and send an attachment on its own", async ({
  page,
  errors,
}) => {
  const file = page.locator('chat-thread input[type="file"]');
  const upload = { name: "plan.txt", mimeType: "text/plain", buffer: Buffer.alloc(2048, "a") };
  const fileChooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Attach a file" }).click();
  await (await fileChooser).setFiles(upload);
  const pending = page.locator("chat-thread form ui-attachment");
  await expect(pending).toHaveAttribute("name", "plan.txt");
  await expect(pending).toHaveAttribute("size", "2 KB");
  await page.getByRole("button", { name: "Remove attachment" }).click();
  await expect(pending).toHaveCount(0);

  await page.getByRole("textbox", { name: "Message" }).press("Enter");
  const messages = page.locator("chat-thread ui-message-scroller").locator("ui-message");
  await expect(messages).toHaveCount(3);

  await file.setInputFiles({ ...upload, buffer: Buffer.alloc(10, "b") });
  await expect(pending).toHaveAttribute("size", "10 B");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(messages).toHaveCount(4);
  const sent = messages.last();
  await expect(sent.locator("ui-attachment")).toHaveAttribute("name", "plan.txt");
  await expect(sent.locator("ui-bubble")).toHaveCount(0);
  await expect(conversations(page).first()).toContainText("You:");
  void errors;
});

test("chat: search filters the conversations", async ({ page, errors }) => {
  const search = page.getByRole("searchbox", { name: "Search conversations" });
  await search.fill("pa");
  await expect(conversations(page)).toHaveText([/Chloe Park/, /Dev Patel/]);
  await search.fill("zz");
  await expect(conversations(page)).toHaveCount(0);
  await expect(page.getByText("No conversations match your search.")).toBeVisible();
  await search.fill("");
  await expect(conversations(page)).toHaveCount(4);
  void errors;
});

test("chat: on a phone the list and the thread take turns", async ({ page, errors }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const thread = page.locator("chat-thread");
  await expect(thread).toBeHidden();
  await conversations(page).filter({ hasText: "Dev Patel" }).click();
  await expect(thread).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Conversations" })).toBeHidden();
  await expect(page.getByRole("heading", { name: "Dev Patel" })).toBeVisible();
  await page.getByRole("button", { name: "Back to conversations" }).click();
  await expect(thread).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Conversations" })).toBeVisible();
  const box = await page.locator("chat-app").boundingBox();
  expect(box?.width).toBeLessThanOrEqual(390);
  void errors;
});
