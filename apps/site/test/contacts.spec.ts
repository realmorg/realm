import type { Page } from "@playwright/test";
import { expect, ready, test } from "./fixtures";

const open = async (page: Page) => {
  await page.goto("examples/contacts/");
  await ready(page, "contacts-app");
};

const rows = (page: Page) => page.getByRole("table", { name: "Contacts" }).locator("tbody tr");

test("contacts: the service worker serves the seeded list on first load", async ({
  page,
  errors,
}) => {
  await open(page);
  await expect(rows(page)).toHaveCount(10);
  await expect(rows(page).first()).toContainText("Ada Lovelace");
  await expect(page.getByRole("status").filter({ hasText: "10 contacts" })).toBeVisible();
  expect(await page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  void errors;
});

test("contacts: search filters through the API with a debounced query", async ({
  page,
  errors,
}) => {
  await open(page);
  await expect(rows(page)).toHaveCount(10);
  const search = page.getByRole("searchbox", { name: "Search contacts" });
  await search.fill("mit");
  await expect(rows(page)).toHaveCount(2);
  await expect(page.getByRole("status").filter({ hasText: "2 contacts" })).toBeVisible();
  await search.press("Enter");
  expect(page.url()).toMatch(/examples\/contacts\/$/);

  await search.fill("nobody at all");
  await expect(page.getByRole("heading", { name: "No contacts found" })).toBeVisible();
  await search.fill("");
  await expect(rows(page)).toHaveCount(10);
  void errors;
});

test("contacts: create, edit and delete persist across reloads", async ({ page, errors }) => {
  await open(page);
  await expect(rows(page)).toHaveCount(10);

  await page.getByRole("button", { name: "New contact" }).click();
  // Slotted dialog content is not a DOM descendant of the <dialog>, so fields are found from the page.
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("heading", { name: "New contact" })).toBeVisible();
  await page.getByRole("textbox", { name: "Name" }).fill("Hedy Lamarr");
  await page.getByRole("textbox", { name: "Email" }).fill("hedy@spread.spectrum");
  await page.getByRole("textbox", { name: "Company" }).fill("MGM");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText("Contact created")).toBeVisible();
  await expect(rows(page)).toHaveCount(11);
  await expect(rows(page).filter({ hasText: "Hedy Lamarr" })).toContainText("hedy@spread.spectrum");

  await page.getByRole("button", { name: "Edit Grace Hopper" }).click();
  await expect(page.getByRole("heading", { name: "Edit contact" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Email" })).toHaveValue("grace@navy.mil");
  await page.getByRole("textbox", { name: "Company" }).fill("Harvard Mark I");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText("Contact updated")).toBeVisible();
  await expect(rows(page).filter({ hasText: "Grace Hopper" })).toContainText("Harvard Mark I");

  await page.getByRole("button", { name: "Delete Alan Turing" }).click();
  const confirm = page.getByRole("alertdialog");
  await expect(confirm).toBeVisible();
  await expect(page.getByText("Alan Turing will be removed")).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(confirm).toBeHidden();
  await expect(rows(page)).toHaveCount(11);
  await page.getByRole("button", { name: "Delete Alan Turing" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(confirm).toBeHidden();
  await expect(page.getByText("Contact deleted")).toBeVisible();
  await expect(rows(page).filter({ hasText: "Alan Turing" })).toHaveCount(0);

  await page.reload();
  await ready(page, "contacts-app");
  await expect(rows(page)).toHaveCount(10);
  await expect(rows(page).filter({ hasText: "Hedy Lamarr" })).toHaveCount(1);
  await expect(rows(page).filter({ hasText: "Grace Hopper" })).toContainText("Harvard Mark I");
  await expect(rows(page).filter({ hasText: "Alan Turing" })).toHaveCount(0);
  void errors;
});

test("contacts: the API validates input and answers 404 for unknown contacts", async ({
  page,
  errors,
}) => {
  await open(page);
  const responses = await page.evaluate(async () => {
    const invalid = await fetch("api/contacts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: " ", email: "nope" }),
    });
    const missing = await fetch("api/contacts/does-not-exist");
    const patched = await fetch("api/contacts/1", {
      method: "PATCH",
      body: new URLSearchParams({ phone: "123" }),
    });
    return {
      invalid: [invalid.status, await invalid.json()],
      missing: missing.status,
      patched: [patched.status, await patched.json()],
    };
  });
  expect(responses.invalid[0]).toBe(422);
  expect(responses.invalid[1].errors).toEqual({
    name: "Name is required.",
    email: "Enter a valid email address.",
  });
  expect(responses.missing).toBe(404);
  expect(responses.patched[0]).toBe(200);
  expect(responses.patched[1]).toMatchObject({ id: "1", name: "Ada Lovelace", phone: "123" });
  const logged = errors.splice(0);
  expect(logged.every((message) => /404|422/.test(message))).toBe(true);
});

test("contacts: a single match is counted as one contact", async ({ page, errors }) => {
  await open(page);
  await page.getByRole("searchbox", { name: "Search contacts" }).fill("lovelace");
  await expect(rows(page)).toHaveCount(1);
  await expect(page.getByRole("status").filter({ hasText: "contact" })).toHaveText("1 contact");
  void errors;
});

test("contacts: the editor shows the API's validation errors", async ({ page, errors }) => {
  await open(page);
  await expect(rows(page)).toHaveCount(10);
  await page.getByRole("button", { name: "New contact" }).click();
  // Blank text satisfies `required` in the browser but is rejected by the API once trimmed.
  await page.getByRole("textbox", { name: "Name" }).fill("   ");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Couldn't save the contact")).toBeVisible();
  await expect(page.getByText("Please fix the highlighted fields.")).toBeVisible();
  await expect(page.getByText("Name is required.", { exact: true })).toBeVisible();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(rows(page)).toHaveCount(10);
  const logged = errors.splice(0);
  expect(logged.every((message) => message.includes("422"))).toBe(true);
});

test("contacts: deleting a contact that is already gone reports the API's answer", async ({
  page,
  errors,
}) => {
  await open(page);
  await page.getByRole("button", { name: "Delete Grace Hopper" }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.evaluate(async () => {
    const contacts: { id: string; name: string }[] = await (await fetch("api/contacts")).json();
    const grace = contacts.find((contact) => contact.name === "Grace Hopper");
    await fetch(`api/contacts/${grace?.id}`, { method: "DELETE" });
  });
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("alertdialog")).toBeHidden();
  await expect(page.getByText("Couldn't delete the contact")).toBeVisible();
  await expect(page.getByText("Contact not found.")).toBeVisible();
  const logged = errors.splice(0);
  expect(logged.every((message) => message.includes("404"))).toBe(true);
});

test("contacts: an unreachable API is reported when listing, saving and deleting", async ({
  page,
  errors,
}) => {
  await open(page);
  await expect(rows(page)).toHaveCount(10);
  const setOnline = (online: boolean) =>
    page.evaluate((value) => {
      const original =
        (window as unknown as { onlineFetch?: typeof fetch }).onlineFetch ?? window.fetch;
      Object.assign(window, { onlineFetch: original });
      window.fetch = value ? original : () => Promise.reject(new TypeError("Failed to fetch"));
    }, online);

  await setOnline(false);
  const search = page.getByRole("searchbox", { name: "Search contacts" });
  await search.fill("ada");
  await expect(page.getByText("Couldn't load contacts")).toBeVisible();

  await page.getByRole("button", { name: "New contact" }).click();
  await page.getByRole("textbox", { name: "Name" }).fill("Hedy Lamarr");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Couldn't save the contact")).toBeVisible();
  await expect(page.getByText("The server is unavailable.")).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();

  await page.getByRole("button", { name: "Delete Alan Turing" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByText("Couldn't delete the contact")).toBeVisible();
  await expect(page.getByText("The server is unavailable.").last()).toBeVisible();

  await setOnline(true);
  await search.fill("");
  await expect(page.getByText("Couldn't load contacts")).toBeHidden();
  await expect(rows(page)).toHaveCount(10);
  void errors;
});
