import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { chunkOf } from "../src/unicons.js";

const CHUNK_BYTES = 4 * 1024;
const PACKAGE = join(import.meta.dirname, "..");
const DIST = join(PACKAGE, "dist");
const SOURCE = dirname(createRequire(import.meta.url).resolve("react-icons"));
const ICON = /export function (\w+) \(props\) \{\s*return GenIcon\((.*)\)\(props\);\s*\};/g;
const SETS_LINE = "export const sets = {};";

// Remix Icon changed its licence on 25 January 2026 (v4.9.0) to one that forbids competing icon
// libraries. react-icons bundles a later commit, so the ri set is built from remixicon 4.8.0, the
// last release under Apache 2.0, straight from its SVG files.
const REMIX = dirname(createRequire(import.meta.url).resolve("remixicon/package.json"));
const REMIX_LICENCE = {
  license: "Apache License Version 2.0 (Remix Icon 4.8.0)",
  licenseUrl: "https://github.com/Remix-Design/RemixIcon/blob/v4.8.0/License",
};
const SVG = /^<svg([^>]*)>([\s\S]*)<\/svg>\s*$/;
const SVG_ATTRIBUTE = /([\w:-]+)="([^"]*)"/g;

const DROPPED = new Set(["t", "role", "aria-hidden", "version", "baseProfile", "enableBackground"]);
const DROPPED_ON_ROOT = new Set([...DROPPED, "id", "x", "y", "style", "xmlns"]);
const ROOT_DEFAULTS = { stroke: "currentColor", fill: "currentColor", strokeWidth: "0" };
const CAMEL_CASE_SVG = new Set(
  "viewBox preserveAspectRatio gradientTransform gradientUnits patternTransform patternUnits patternContentUnits clipPathUnits markerHeight markerWidth markerUnits maskUnits maskContentUnits stdDeviation filterUnits primitiveUnits spreadMethod startOffset pathLength".split(
    " ",
  ),
);

const attributeName = (key) =>
  CAMEL_CASE_SVG.has(key) ? key : key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

const escapeAttribute = (value) =>
  String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

const attributes = (attr, dropped) =>
  Object.entries(attr)
    .filter(([key]) => !dropped.has(key))
    .map(([key, value]) => `${attributeName(key)}="${escapeAttribute(value)}"`)
    .join(" ");

const markup = ({ tag, attr, child }) => {
  const open = [tag, attributes(attr, DROPPED)].filter(Boolean).join(" ");
  return child.length ? `<${open}>${child.map(markup).join("")}</${tag}>` : `<${open}/>`;
};

const iconName = (component, prefix) =>
  component
    .slice(prefix.length)
    .replace(/([a-z])([A-Z0-9])/g, "$1-$2")
    .replace(/([0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

const mostCommon = (values) => {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1])[0][0];
};

const readRemix = () => {
  const icons = new Map();
  for (const category of readdirSync(join(REMIX, "icons")))
    for (const file of readdirSync(join(REMIX, "icons", category))) {
      const [, attrs, body] = readFileSync(join(REMIX, "icons", category, file), "utf8").match(SVG);
      const attr = Object.fromEntries(
        [...attrs.matchAll(SVG_ATTRIBUTE)].map(([, key, value]) => [key, value]),
      );
      // Named the way react-icons names them (RiHtml5Fill is html-5-fill), so existing names keep working.
      const component = `Ri${file.replace(/\.svg$/, "").replace(/(?:^|-)(\w)/g, (_, letter) => letter.toUpperCase())}`;
      icons.set(iconName(component, "Ri"), {
        root: attributes({ ...ROOT_DEFAULTS, ...attr }, DROPPED_ON_ROOT),
        body,
      });
    }
  return new Map([...icons].sort(([a], [b]) => a.localeCompare(b)));
};

const readSet = (id) => {
  if (id === "ri") return readRemix();
  const prefix = id.replace(/\d+$/, "").replace(/^./, (letter) => letter.toUpperCase());
  const source = readFileSync(join(SOURCE, id, "index.mjs"), "utf8");
  const icons = new Map();
  for (const [, component, json] of source.matchAll(ICON)) {
    const tree = JSON.parse(json);
    const name = iconName(component, prefix);
    if (icons.has(name))
      throw new Error(`${id}: ${component} and another icon both map to ${name}`);
    icons.set(name, {
      root: attributes({ ...ROOT_DEFAULTS, ...tree.attr }, DROPPED_ON_ROOT),
      body: tree.child.map(markup).join(""),
    });
  }
  return new Map([...icons].sort(([a], [b]) => a.localeCompare(b)));
};

const manifest = readFileSync(join(SOURCE, "lib", "iconsManifest.mjs"), "utf8");
const catalog = JSON.parse(manifest.slice(manifest.indexOf("["), manifest.lastIndexOf("]") + 1))
  .map(({ id, name, projectUrl, license, licenseUrl }) => ({
    id,
    name,
    projectUrl,
    license,
    licenseUrl,
    ...(id === "ri" ? REMIX_LICENCE : {}),
  }))
  .sort((a, b) => a.id.localeCompare(b.id));

rmSync(DIST, { recursive: true, force: true });
mkdirSync(join(DIST, "meta"), { recursive: true });

const sets = {};
const report = [];
for (const set of catalog) {
  const icons = readSet(set.id);
  const defaults = mostCommon([...icons.values()].map(({ root }) => root));
  const entries = [...icons].map(([name, { root, body }]) => [
    name,
    root === defaults ? body : [root, body],
  ]);
  const bytes = entries.reduce((total, entry) => total + JSON.stringify(entry).length, 0);
  const chunks = Math.max(1, Math.round(bytes / CHUNK_BYTES));
  const groups = Array.from({ length: chunks }, () => ({}));
  for (const [name, value] of entries) groups[chunkOf(name, chunks)][name] = value;

  mkdirSync(join(DIST, "icons", set.id), { recursive: true });
  groups.forEach((group, index) => {
    writeFileSync(
      join(DIST, "icons", set.id, `${index}.js`),
      `export default ${JSON.stringify(group)};\n`,
    );
  });
  writeFileSync(join(DIST, "meta", `${set.id}.json`), JSON.stringify([...icons.keys()]));
  sets[set.id] = { chunks, attributes: defaults };
  set.count = icons.size;
  report.push(`${set.id.padEnd(4)} ${String(icons.size).padStart(5)} icons ${chunks} chunks`);
}

const loader = readFileSync(join(PACKAGE, "src/unicons.js"), "utf8");
if (!loader.includes(SETS_LINE)) throw new Error(`src/unicons.js must contain "${SETS_LINE}"`);
writeFileSync(
  join(DIST, "unicons.js"),
  loader.replace(SETS_LINE, `export const sets = ${JSON.stringify(sets)};`),
);
copyFileSync(join(PACKAGE, "src/unicons.html"), join(DIST, "unicons.html"));
writeFileSync(join(DIST, "sets.json"), JSON.stringify(catalog));

const total = catalog.reduce((sum, set) => sum + set.count, 0);
console.log(`${report.join("\n")}\nBuilt ${total} icons in ${catalog.length} sets into dist/`);
