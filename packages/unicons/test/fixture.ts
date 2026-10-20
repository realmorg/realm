import { mkdirSync, writeFileSync } from "node:fs";
import { test as base, expect, type Locator, type Page } from "@playwright/test";

const COVERAGE = new URL("../coverage-components/", import.meta.url);

// Records V8 coverage of the component scripts (named `<file>.html#<component>`) in Chromium,
// read by scripts/component-coverage.mjs at the repository root.
export const test = base.extend<{ coverage: undefined }>({
  coverage: [
    async ({ page, browserName }, use, info) => {
      if (browserName !== "chromium") return use(undefined);
      const cdp = await page.context().newCDPSession(page);
      await cdp.send("Debugger.enable");
      await cdp.send("Profiler.enable");
      await cdp.send("Profiler.startPreciseCoverage", { callCount: true, detailed: true });
      await use(undefined);
      const { result } = await cdp.send("Profiler.takePreciseCoverage");
      const entries = [];
      for (const script of result.filter((item) => item.url.includes(".html#"))) {
        const { scriptSource } = await cdp.send("Debugger.getScriptSource", {
          scriptId: script.scriptId,
        });
        entries.push({ url: script.url, source: scriptSource, functions: script.functions });
      }
      mkdirSync(COVERAGE, { recursive: true });
      writeFileSync(new URL(`${info.testId}.json`, COVERAGE), JSON.stringify(entries));
    },
    { auto: true },
  ],
});

export { expect };

export interface Opened {
  requests: string[];
  warnings: string[];
}

export const open = async (page: Page, body: string, head = ""): Promise<Opened> => {
  const requests: string[] = [];
  const warnings: string[] = [];
  page.on("request", (request) => requests.push(new URL(request.url()).pathname));
  page.on("console", (message) => {
    if (message.type() === "warning") warnings.push(message.text());
  });
  await page.goto(`/unicons/fixture.html?${new URLSearchParams({ head, body })}`);
  return { requests, warnings };
};

export const svgOf = (icon: Locator) => icon.locator("svg");

export const rendered = async (page: Page, selector = "u-icon") =>
  page.waitForFunction(
    (query) =>
      [...document.querySelectorAll(query)].every((el) => el.shadowRoot?.querySelector("svg")),
    selector,
  );

export const style = (locator: Locator, property: string) =>
  locator.evaluate((el, name) => getComputedStyle(el).getPropertyValue(name), property);

export const countOf = (list: string[], path: string) =>
  list.filter((entry) => entry === path).length;
