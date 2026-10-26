import { playwright } from "@vitest/browser-playwright";
import type { Page } from "playwright";
import { defineConfig } from "vitest/config";
import type { BrowserCommand } from "vitest/node";
import { startComponentCoverage, takeComponentCoverage } from "./coverage.config.ts";

type Browser = "chromium" | "firefox" | "webkit";

const reduceMotion: BrowserCommand<[boolean]> = async ({ page }, reduce) => {
  await (page as Page).emulateMedia({ reducedMotion: reduce ? "reduce" : "no-preference" });
};

const project = (name: string, browsers: Browser[]) => ({
  test: {
    name,
    include: ["test/*.test.ts"],
    browser: {
      enabled: true,
      headless: true,
      viewport: { width: 1280, height: 800 },
      provider: playwright(),
      instances: browsers.map((browser) => ({ browser })),
      commands: { startComponentCoverage, takeComponentCoverage, reduceMotion },
    },
  },
});

export default defineConfig({
  resolve: {
    alias: {
      "@realmorg/realm": decodeURIComponent(
        new URL("../realm/src/index.ts", import.meta.url).pathname,
      ),
    },
  },
  test: {
    fileParallelism: false,
    projects: [project("chromium", ["chromium"]), project("cross", ["firefox", "webkit"])],
  },
});
