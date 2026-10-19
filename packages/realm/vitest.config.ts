import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

type Browser = "chromium" | "firefox" | "webkit";

const project = (name: string, browsers: Browser[], include: string[], args: string[] = []) => ({
  test: {
    name,
    include,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({ launchOptions: { args } }),
      instances: browsers.map((browser) => ({ browser })),
    },
  },
});

const unit = ["test/*.test.ts"];

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      reporter: ["text", "html", "json-summary"],
      thresholds: { 100: true },
    },
    projects: [
      project("chromium", ["chromium"], unit),
      project("cross", ["firefox", "webkit"], unit),
      project("memory", ["chromium"], ["test/memory/*.test.ts"], ["--js-flags=--expose-gc"]),
      project("perf", ["chromium"], ["test/perf/*.test.ts"]),
    ],
  },
});
