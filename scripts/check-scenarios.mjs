import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (dir, match, found = []) => {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "dist" || entry === "archive") continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, match, found);
    else if (match(path)) found.push(path);
  }
  return found;
};

const scenarios = walk("openspec/specs", (p) => p.endsWith("spec.md")).flatMap((file) =>
  [...readFileSync(file, "utf8").matchAll(/^#### Scenario: (.+)$/gm)].map((m) => ({
    file,
    name: m[1].trim(),
  })),
);

const titles = new Set(
  ["packages", "apps", "e2e"]
    .flatMap((dir) => {
      try {
        return walk(dir, (p) => /\.(test|spec)\.ts$/.test(p));
      } catch {
        return [];
      }
    })
    .flatMap((file) =>
      [...readFileSync(file, "utf8").matchAll(/\btest\(\s*(["'`])(.+?)\1/g)].map((m) => m[2]),
    ),
);

const missing = scenarios.filter((s) => !titles.has(s.name));
for (const s of missing) console.error(`Missing test for scenario "${s.name}" (${s.file})`);
console.log(`${scenarios.length - missing.length}/${scenarios.length} scenarios have a test.`);
process.exit(missing.length ? 1 : 0);
