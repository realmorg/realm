import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import { startComponentCoverage, takeComponentCoverage } from "./coverage.config.ts";

type Browser = "chromium" | "firefox" | "webkit";

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
      commands: { startComponentCoverage, takeComponentCoverage },
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
