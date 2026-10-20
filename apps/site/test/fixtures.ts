import { mkdirSync, writeFileSync } from "node:fs";
import { test as base, expect, type Page } from "@playwright/test";

const COVERAGE = new URL("../coverage-components/", import.meta.url);

export const test = base.extend<{ errors: string[]; coverage: undefined }>({
  coverage: [
    async ({ page, browserName }, use, info) => {
      if (browserName !== "chromium") return use(undefined);
      const cdp = await page.context().newCDPSession(page);
      await cdp.send("Debugger.enable");
      await cdp.send("Profiler.enable");
      await cdp.send("Profiler.startPreciseCoverage", { callCount: true, detailed: true });
      const entries: unknown[] = [];
      const snapshot = async () => {
        const { result } = await cdp.send("Profiler.takePreciseCoverage");
        for (const script of result.filter((item) => item.url.includes(".html#"))) {
          const { scriptSource } = await cdp.send("Debugger.getScriptSource", {
            scriptId: script.scriptId,
          });
          entries.push({ url: script.url, source: scriptSource, functions: script.functions });
        }
      };
      // Chromium holds DevTools commands while a page-initiated navigation is in flight, so the
      // outgoing document cannot be measured then; tests abort such navigations (see site.spec.ts).
      for (const method of ["goto", "reload"] as const) {
        const original = page[method].bind(page) as (...args: unknown[]) => Promise<unknown>;
        Object.assign(page, {
          [method]: async (...args: unknown[]) => {
            await snapshot();
            return original(...args);
          },
        });
      }
      await use(undefined);
      await snapshot();
      mkdirSync(COVERAGE, { recursive: true });
      writeFileSync(new URL(`${info.testId}.json`, COVERAGE), JSON.stringify(entries));
    },
    { auto: true },
  ],
  errors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await use(errors);
    expect(errors).toEqual([]);
  },
});

export { expect };

export const ready = async (page: Page, tag: string) => {
  await page.waitForFunction(
    (name) => !!customElements.get(name) && !!document.querySelector(name)?.shadowRoot,
    tag,
  );
};
