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
          // After a page-initiated navigation the old document's scripts can still be listed
          // until they are collected, but their source is gone. They cannot be measured.
          const source = await cdp
            .send("Debugger.getScriptSource", { scriptId: script.scriptId })
            .catch(() => undefined);
          if (!source) continue;
          entries.push({
            url: script.url,
            source: source.scriptSource,
            functions: script.functions,
          });
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

// Records every layout shift, including those right after input that CLS ignores, because a
// shift caused by typing into a form still moves content under the user. Chromium only.
export const recordLayoutShifts = async (page: Page) => {
  await page.addInitScript(() => {
    const shifts: { value: number; sources: string[] }[] = [];
    Object.defineProperty(window, "layoutShifts", { value: shifts });
    if (!PerformanceObserver.supportedEntryTypes.includes("layout-shift")) return;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & {
        value: number;
        sources: { node: Node | null }[];
      })[]) {
        shifts.push({
          value: entry.value,
          sources: entry.sources.map((source) => source.node?.nodeName ?? "?"),
        });
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
};

export const takeLayoutShift = async (page: Page) => {
  await page.evaluate(() => new Promise(requestAnimationFrame));
  return page.evaluate(() => {
    const shifts = (window as unknown as { layoutShifts: { value: number }[] }).layoutShifts;
    return shifts.splice(0).reduce((total, shift) => total + shift.value, 0);
  });
};
