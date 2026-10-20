import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

const components = readdirSync("components")
  .filter((file) => file.endsWith(".html"))
  .sort();
mkdirSync("dist", { recursive: true });
writeFileSync(
  "dist/ui.html",
  `${components.map((file) => readFileSync(`components/${file}`, "utf8").trim()).join("\n\n")}\n`,
);
copyFileSync("theme.css", "dist/theme.css");
console.log(`Bundled ${components.length} files into dist/ui.html`);
