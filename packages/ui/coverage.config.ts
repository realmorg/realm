import { mkdirSync, writeFileSync } from "node:fs";
import type { CDPSession, Page } from "playwright";
import type { BrowserCommand } from "vitest/node";

const DIR = new URL("./coverage-components/", import.meta.url);
type Coverage = { scriptId: string; url: string; functions: unknown[] };
const sessions = new WeakMap<Page, Promise<CDPSession>>();
let counter = 0;

const session = (page: Page): Promise<CDPSession> | undefined => {
  if (page.context().browser()?.browserType().name() !== "chromium") return undefined;
  if (!sessions.has(page))
    sessions.set(
      page,
      (async () => {
        const cdp = await page.context().newCDPSession(page);
        await cdp.send("Debugger.enable");
        await cdp.send("Profiler.enable");
        await cdp.send("Profiler.startPreciseCoverage", { callCount: true, detailed: true });
        return cdp;
      })(),
    );
  return sessions.get(page);
};

export const startComponentCoverage: BrowserCommand<[]> = async ({ page }) => {
  await session(page as Page);
};

export const takeComponentCoverage: BrowserCommand<[]> = async ({ page }) => {
  const cdp = await session(page as Page);
  if (!cdp) return;
  const { result } = await cdp.send("Profiler.takePreciseCoverage");
  const entries = [];
  for (const script of result as Coverage[]) {
    if (!script.url.includes(".html#")) continue;
    const { scriptSource } = await cdp.send("Debugger.getScriptSource", {
      scriptId: script.scriptId,
    });
    entries.push({ url: script.url, source: scriptSource, functions: script.functions });
  }
  mkdirSync(DIR, { recursive: true });
  writeFileSync(new URL(`${process.pid}-${++counter}.json`, DIR), JSON.stringify(entries));
};
