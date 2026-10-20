import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2023",
    minify: true,
    lib: {
      entry: {
        index: "src/index.ts",
        realm: "src/auto.ts",
        compiler: "src/compiler.ts",
      },
      formats: ["es"],
    },
    rolldownOptions: {
      output: {
        minify: true,
        chunkFileNames: "chunks/[name]-[hash].js",
      },
    },
  },
});
