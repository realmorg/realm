// Refreshes jsDelivr after a release. jsDelivr caches a tag such as @alpha for up to 12 hours,
// so without a purge a URL requested before the release keeps serving the old version (or a 404).
// Usage: node scripts/purge-cdn.mjs '<changesets publishedPackages JSON>'
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = fileURLToPath(new URL("..", import.meta.url));
const BATCH = 50;

// Unicons icon chunks change only when the icon sets do, and there are thousands of them.
const SKIPPED = [/^dist\/icons\//];

export const tagOf = (pre) => (pre?.mode === "pre" ? pre.tag : "latest");

export const purgePaths = (name, files, tag) =>
  files
    .filter((file) => !SKIPPED.some((pattern) => pattern.test(file)))
    .flatMap((file) =>
      tag === "latest"
        ? [`/npm/${name}/${file}`, `/npm/${name}@latest/${file}`]
        : [`/npm/${name}@${tag}/${file}`],
    );

const packageDirs = () =>
  new Map(
    readdirSync(join(repo, "packages"))
      .map((dir) => join(repo, "packages", dir))
      .filter((dir) => existsSync(join(dir, "package.json")))
      .map((dir) => [JSON.parse(readFileSync(join(dir, "package.json"), "utf8")).name, dir]),
  );

const filesOf = (dir) =>
  JSON.parse(
    execFileSync("npm", ["pack", "--dry-run", "--json"], { cwd: dir, encoding: "utf8" }),
  )[0].files.map((file) => file.path);

const main = async () => {
  const published = JSON.parse(process.argv[2] ?? "[]");
  const pre = JSON.parse(readFileSync(join(repo, ".changeset/pre.json"), "utf8"));
  const dirs = packageDirs();
  const paths = published.flatMap(({ name }) =>
    dirs.has(name) ? purgePaths(name, filesOf(dirs.get(name)), tagOf(pre)) : [],
  );
  for (let start = 0; start < paths.length; start += BATCH) {
    const path = paths.slice(start, start + BATCH);
    const response = await fetch("https://purge.jsdelivr.net/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path }),
    }).catch((error) => ({ ok: false, statusText: error.message }));
    if (!response.ok) console.warn(`::warning::jsDelivr purge failed: ${response.statusText}`);
  }
  console.log(`Asked jsDelivr to refresh ${paths.length} files.`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
