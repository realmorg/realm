import { expect, ready, test } from "./fixtures";

test("pagination demos fit a phone screen with icon-only Previous and Next", async ({
  page,
  errors,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("components/pagination/");
  await ready(page, "ui-pagination");
  const demos = page.locator("live-demo").filter({ has: page.locator("ui-pagination") });
  await expect(demos.first()).toBeVisible();
  for (const demo of await demos.all()) {
    const overflow = await demo.locator(".preview").evaluate((preview) => {
      const bounds = preview.getBoundingClientRect();
      return [...preview.querySelectorAll("ui-pagination")].flatMap((pagination) =>
        [...(pagination.shadowRoot as ShadowRoot).querySelectorAll("li")]
          .map((item) => item.getBoundingClientRect())
          .filter((box) => box.left < bounds.left || box.right > bounds.right),
      );
    });
    expect(overflow).toEqual([]);
  }
  const first = page.locator("ui-pagination").first();
  const next = first.getByRole("button", { name: "Next" });
  const nextBox = await next.boundingBox();
  const pageBox = await first.getByRole("button", { name: "5" }).boundingBox();
  expect(nextBox?.width).toBe(pageBox?.width);
  await expect(first.getByRole("button", { name: "Previous" })).toBeVisible();
  void errors;
});

test("attachment demo: removing a file leaves the other where the list starts", async ({
  page,
  errors,
}) => {
  await page.goto("components/attachment/");
  await ready(page, "attachment-list-demo");
  const files = page.locator("attachment-list-demo ui-attachment");
  await expect(files).toHaveCount(2);
  const start = (await files.first().boundingBox())?.x;
  await page.getByRole("button", { name: "Remove design-review.fig" }).click();
  await expect(files).toHaveCount(1);
  expect((await files.first().boundingBox())?.x).toBe(start);
  void errors;
});
