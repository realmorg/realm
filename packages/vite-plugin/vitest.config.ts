import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    testTimeout: 30_000,
    coverage: {
      provider: "v8",
      include: ["src"],
      thresholds: { 100: true },
    },
  },
});
