import { execFileSync, spawn } from "node:child_process";
import { cpSync, mkdtempSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium, firefox, webkit } from "playwright";

const root = new URL("..", import.meta.url).pathname;
const work = mkdtempSync(join(tmpdir(), "realm-release-"));
const packs = join(work, "packs");
const app = join(work, "app");
const run = (command, args, cwd) => execFileSync(command, args, { cwd, stdio: "inherit" });

for (const name of ["realm", "ui", "vite-plugin"])
  run("pnpm", ["pack", "--pack-destination", packs], join(root, "packages", name));

cpSync(join(root, "scripts/release-check"), app, { recursive: true });
writeFileSync(
  join(app, "package.json"),
  '{ "name": "release-check", "private": true, "type": "module" }\n',
);
const tarballs = readdirSync(packs).map((file) => join(packs, file));
run("npm", ["install", "--no-audit", "--no-fund", ...tarballs, "vite@8.3.4"], app);
cpSync(join(app, "node_modules/@realmorg/ui/dist/ui.html"), join(app, "public/ui.html"));
run("npx", ["vite", "build"], app);

const server = spawn("npx", ["vite", "preview", "--port", "4199", "--strictPort"], { cwd: app });
await new Promise((resolve) => setTimeout(resolve, 2000));
const failures = [];
try {
  for (const engine of [chromium, firefox, webkit]) {
    const browser = await engine.launch();
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) errors.push(message.text());
    });
    await page.goto("http://localhost:4199/");
    const button = page.locator("hello-card ui-button");
    await button.click();
    await button.click();
    await page
      .waitForFunction(
        () => document.querySelector("hello-card")?.shadowRoot?.textContent?.includes("Clicked 2"),
        undefined,
        { timeout: 5000 },
      )
      .catch(() => errors.push("counter did not reach 2"));
    console.log(`${engine.name()}: ${errors.length ? errors.join(" | ") : "ok"}`);
    if (errors.length) failures.push(engine.name());
    await browser.close();
  }
} finally {
  server.kill();
}
process.exit(failures.length ? 1 : 0);
