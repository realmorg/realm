import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

const dependencyImport = /^<import-element from="[^"]*"><\/import-element>\n/gm;

const components = readdirSync("components")
  .filter((file) => file.endsWith(".html"))
  .sort();
mkdirSync("dist", { recursive: true });
writeFileSync(
  "dist/ui.html",
  `${components
    .map((file) => readFileSync(`components/${file}`, "utf8").replace(dependencyImport, "").trim())
    .join("\n\n")}\n`,
);
copyFileSync("theme.css", "dist/theme.css");
console.log(`Bundled ${components.length} files into dist/ui.html`);
