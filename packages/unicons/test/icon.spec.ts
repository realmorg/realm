import { readFileSync } from "node:fs";
import { countOf, expect, open, rendered, style, svgOf, test } from "./fixture";

const IMPORT = `<import-element from="/unicons/unicons.html"></import-element>`;

test.describe("u-icon", () => {
  test("renders the icon as an inline svg", async ({ page }) => {
    await open(page, `${IMPORT}<u-icon name="house"></u-icon>`);
    await rendered(page);
    const svg = svgOf(page.locator("u-icon"));
    await expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    await expect(svg).toHaveAttribute("fill", "none");
    await expect(svg).toHaveAttribute("stroke", "currentColor");
    await expect(svg.locator("path")).toHaveCount(2);
    expect(await svg.evaluate((el) => el.namespaceURI)).toBe("http://www.w3.org/2000/svg");
  });

  test("renders icons from another set with its own root attributes", async ({ page }) => {
    await open(page, `${IMPORT}<u-icon set="ai" name="fill-alert"></u-icon>`);
    await rendered(page);
    const svg = svgOf(page.locator("u-icon"));
    await expect(svg).toHaveAttribute("viewBox", "0 0 1024 1024");
    await expect(svg).toHaveAttribute("fill", "currentColor");
  });

  test("size defaults to 1em and accepts numbers and css lengths", async ({ page }) => {
    await open(
      page,
      `${IMPORT}<div style="font-size: 20px"><u-icon id="em" name="star"></u-icon></div>
      <u-icon id="number" name="star" size="32"></u-icon>
      <u-icon id="length" name="star" size="3rem"></u-icon>`,
    );
    await rendered(page);
    for (const [id, pixels] of [
      ["em", 20],
      ["number", 32],
      ["length", 48],
    ] as const) {
      const box = await page.locator(`#${id}`).boundingBox();
      expect(box?.width).toBe(pixels);
      expect(box?.height).toBe(pixels);
      expect((await svgOf(page.locator(`#${id}`)).boundingBox())?.width).toBe(pixels);
    }
    await page.locator("#number").evaluate((el) => el.setAttribute("size", "40"));
    await expect.poll(async () => (await page.locator("#number").boundingBox())?.width).toBe(40);
  });

  test("color, fill, stroke and stroke-width are configurable", async ({ page }) => {
    await open(
      page,
      `${IMPORT}<p style="color: rgb(0, 128, 0)">
        <u-icon id="plain" set="ai" name="fill-alert"></u-icon>
        <u-icon id="color" set="ai" name="fill-alert" color="rgb(0, 0, 255)"></u-icon>
        <u-icon id="fill" set="ai" name="fill-alert" fill="rgb(255, 0, 0)"></u-icon>
        <u-icon id="stroke" name="heart" stroke="rgb(255, 0, 0)" stroke-width="1.5"></u-icon>
        <u-icon id="both" name="heart" fill="rgb(255, 192, 203)" stroke="rgb(128, 0, 128)"></u-icon>
      </p>`,
    );
    await rendered(page);
    const svg = (id: string) => svgOf(page.locator(`#${id}`));
    expect(await style(svg("plain"), "fill")).toBe("rgb(0, 128, 0)");
    expect(await style(svg("color"), "fill")).toBe("rgb(0, 0, 255)");
    expect(await style(svg("fill"), "fill")).toBe("rgb(255, 0, 0)");
    expect(await style(svg("fill"), "stroke")).toBe("rgb(0, 128, 0)");
    expect(await style(svg("stroke"), "stroke")).toBe("rgb(255, 0, 0)");
    expect(await style(svg("stroke"), "stroke-width")).toBe("1.5px");
    expect(await style(svg("stroke"), "fill")).toBe("none");
    expect(await style(svg("both"), "fill")).toBe("rgb(255, 192, 203)");
    expect(await style(svg("both"), "stroke")).toBe("rgb(128, 0, 128)");

    await page.locator("#fill").evaluate((el) => el.removeAttribute("fill"));
    await expect.poll(() => style(svg("fill"), "fill")).toBe("rgb(0, 128, 0)");
    await page.locator("#stroke").evaluate((el) => el.setAttribute("stroke-width", "3"));
    await expect.poll(() => style(svg("stroke"), "stroke-width")).toBe("3px");
  });

  test("css on the page can style the icon", async ({ page }) => {
    await open(
      page,
      `${IMPORT}<u-icon name="heart"></u-icon>`,
      `<style>u-icon { color: rgb(1, 2, 3); width: 50px; height: 50px; } u-icon::part(svg) { fill: rgb(4, 5, 6); }</style>`,
    );
    await rendered(page);
    const svg = svgOf(page.locator("u-icon"));
    expect(await style(svg, "stroke")).toBe("rgb(1, 2, 3)");
    expect(await style(svg, "fill")).toBe("rgb(4, 5, 6)");
    expect((await page.locator("u-icon").boundingBox())?.width).toBe(50);
  });

  test("icons are decorative by default and labelled with label", async ({ page }) => {
    await open(
      page,
      `${IMPORT}<button><u-icon name="house"></u-icon> Home</button>
      <u-icon id="labelled" name="bell" label="Notifications"></u-icon>`,
    );
    await rendered(page);
    await expect(page.getByRole("img")).toHaveCount(1);
    await expect(page.getByRole("img", { name: "Notifications" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Home" })).toBeVisible();
    await page.locator("#labelled").evaluate((el) => el.removeAttribute("label"));
    await expect(page.getByRole("img")).toHaveCount(0);
  });

  test("changing name or set swaps the icon", async ({ page }) => {
    await open(page, `${IMPORT}<u-icon name="house"></u-icon>`);
    await rendered(page);
    const icon = page.locator("u-icon");
    await icon.evaluate((el) => el.setAttribute("name", "x"));
    await expect(svgOf(icon).locator("path")).toHaveCount(2);
    await expect(svgOf(icon).locator("path").first()).toHaveAttribute("d", "M18 6 6 18");
    await icon.evaluate((el) => el.setAttribute("set", "fc"));
    await icon.evaluate((el) => el.setAttribute("name", "about"));
    await expect(svgOf(icon)).toHaveAttribute("viewBox", "0 0 48 48");
  });

  test("a stale response never overwrites a newer icon", async ({ page }) => {
    await open(page, `${IMPORT}<u-icon set="gi" name="ace"></u-icon>`);
    await page.locator("u-icon").evaluate((el) => {
      el.setAttribute("name", "acid");
      el.setAttribute("set", "fc");
      el.setAttribute("name", "about");
    });
    await rendered(page);
    await page.waitForTimeout(300);
    await expect(svgOf(page.locator("u-icon"))).toHaveAttribute("viewBox", "0 0 48 48");
  });

  test("unknown icons and sets warn and show the fallback content", async ({ page }) => {
    const { warnings } = await open(
      page,
      `${IMPORT}<u-icon id="icon" name="does-not-exist">?</u-icon><u-icon id="set" set="nope" name="house">!</u-icon>`,
    );
    await expect
      .poll(() => warnings.join("\n"))
      .toContain('has no icon "does-not-exist" in set "lu"');
    await expect.poll(() => warnings.join("\n")).toContain('has no set "nope"');
    await expect(page.locator("#icon")).toHaveText("?");
    await expect(page.locator("#set")).toHaveText("!");
    await expect(page.locator("u-icon svg")).toHaveCount(0);
  });

  test("many icons share one request per file and only load what they use", async ({ page }) => {
    const names = [
      "house",
      "heart",
      "star",
      "search",
      "bell",
      "check",
      "x",
      "user",
      "settings",
      "mail",
    ];
    const icons = Array.from({ length: 12 }, () =>
      names.map((name) => `<u-icon name="${name}"></u-icon>`).join(""),
    ).join("");
    const { requests } = await open(
      page,
      `${IMPORT}${IMPORT}<import-element from="./unicons.html"></import-element>${icons}<u-icon set="fc" name="about"></u-icon>`,
    );
    await rendered(page);
    await expect(page.locator("u-icon svg")).toHaveCount(names.length * 12 + 1);

    expect(countOf(requests, "/unicons/unicons.html")).toBe(1);
    expect(countOf(requests, "/unicons/unicons.js")).toBe(1);
    const chunks = requests.filter((path) => path.startsWith("/unicons/icons/"));
    expect(new Set(chunks).size).toBe(chunks.length);
    expect(chunks.length).toBeLessThanOrEqual(names.length + 1);
    expect(chunks.every((path) => /^\/unicons\/icons\/(lu|fc)\/\d+\.js$/.test(path))).toBe(true);
    expect(chunks.filter((path) => path.startsWith("/unicons/icons/fc/"))).toHaveLength(1);

    await page.evaluate(() => {
      const more = document.createElement("div");
      more.innerHTML = '<u-icon name="house"></u-icon><u-icon name="heart"></u-icon>';
      document.body.append(more);
    });
    await rendered(page);
    expect(requests.filter((path) => path.startsWith("/unicons/icons/"))).toHaveLength(
      chunks.length,
    );
  });

  test("works when imported lazily", async ({ page }) => {
    const { requests } = await open(
      page,
      `<import-element from="/unicons/unicons.html" loading="lazy" for="u-icon"></import-element>`,
    );
    await page.waitForTimeout(200);
    expect(countOf(requests, "/unicons/unicons.html")).toBe(0);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML("beforeend", '<u-icon name="house"></u-icon>');
    });
    await rendered(page);
    expect(countOf(requests, "/unicons/unicons.html")).toBe(1);
  });

  test("removing an icon while it loads is quiet", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await open(page, `${IMPORT}<u-icon set="tb" name="alarm"></u-icon>`);
    await page.locator("u-icon").evaluate((el) => el.remove());
    await page.waitForTimeout(300);
    expect(errors).toEqual([]);
  });

  test("chunk URLs are built at runtime so bundlers do not import every chunk", async ({
    page,
  }) => {
    const loader = readFileSync(new URL("../dist/unicons.js", import.meta.url), "utf8");
    expect(loader).not.toMatch(/new URL\(\s*[`'"]/);
    const { requests } = await open(page, `${IMPORT}<u-icon name="house"></u-icon>`);
    await rendered(page);
    const chunk = await page.evaluate(async (url) => {
      const { chunkPath } = await import(url);
      return chunkPath("lu", "house");
    }, "/unicons/unicons.js");
    expect(requests.filter((path) => path.startsWith("/unicons/icons/"))).toEqual([
      `/unicons/${chunk}`,
    ]);
  });
});
