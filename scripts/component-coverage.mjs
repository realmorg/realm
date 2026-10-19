import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BODY_START = /= __realm;\n\{\n/;
const BODY_END = "\nreturn {\nget(__name) {";
const HANDLER =
  /function \([^)]*\) \{\n(?:(?:const [\w$]+ = lookup\("[^"]*"\);\n)+|\n)\{\n([\s\S]*?)\n\}\n\}(?=,\n|\n\])/g;

const regionsOf = (source) => {
  const start = source.search(BODY_START);
  if (start === -1) return [];
  const bodyStart = start + source.match(BODY_START)[0].length;
  const bodyEnd = source.lastIndexOf(BODY_END);
  const regions = [{ kind: "script", start: bodyStart, end: bodyEnd }];
  const handlers = source.slice(bodyEnd);
  for (const match of handlers.matchAll(HANDLER)) {
    const codeStart = bodyEnd + match.index + match[0].indexOf(match[1]);
    regions.push({ kind: "handler", start: codeStart, end: codeStart + match[1].length });
  }
  return regions;
};

const counts = (entry) => {
  const painted = new Int32Array(entry.source.length).fill(-1);
  const ranges = entry.functions
    .flatMap((fn) => fn.ranges)
    .sort((a, b) => b.endOffset - b.startOffset - (a.endOffset - a.startOffset));
  for (const range of ranges) painted.fill(range.count, range.startOffset, range.endOffset);
  return painted;
};

const nameOf = (url) => decodeURIComponent(url.split("#").at(-1) ?? "");

export const analyze = (entries, matches = () => true) => {
  const components = new Map();
  for (const entry of entries) {
    if (!entry.url.includes(".html#") || !matches(entry.url)) continue;
    const painted = counts(entry);
    const name = nameOf(entry.url);
    for (const [index, region] of regionsOf(entry.source).entries()) {
      const text = entry.source.slice(region.start, region.end);
      const key = `${index}:${text}`;
      const component = components.get(name) ?? new Map();
      components.set(name, component);
      const covered = component.get(key)?.covered ?? new Uint8Array(text.length);
      for (let i = 0; i < text.length; i++) if (painted[region.start + i] > 0) covered[i] = 1;
      component.set(key, { text, covered, kind: region.kind });
    }
  }
  return [...components]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, regions]) => {
      let total = 0;
      let hit = 0;
      const missed = [];
      for (const { text, covered, kind } of regions.values()) {
        let run = "";
        for (let i = 0; i <= text.length; i++) {
          const char = text[i];
          const counted = char !== undefined && /\S/.test(char);
          if (counted) total++;
          if (counted && covered[i]) hit++;
          if (char !== undefined && !covered[i]) run += char;
          else if (run.trim()) {
            missed.push(`${kind}: ${run.trim().replace(/\s+/g, " ").slice(0, 120)}`);
            run = "";
          } else run = "";
        }
      }
      return { name, percent: total ? (hit / total) * 100 : 100, missed };
    });
};

export const readEntries = (dir) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((file) => file.endsWith(".json"))
        .flatMap((file) => JSON.parse(readFileSync(join(dir, file), "utf8")))
    : [];

if (import.meta.url === `file://${process.argv[1]}`) {
  const [dir, filter = ""] = process.argv.slice(2);
  const results = analyze(readEntries(dir), (url) => url.includes(filter));
  for (const { name, percent, missed } of results) {
    console.log(`${percent.toFixed(2).padStart(7)}%  ${name}`);
    for (const line of missed) console.log(`           ${line}`);
  }
  const incomplete = results.filter((result) => result.percent < 100);
  console.log(`${results.length - incomplete.length}/${results.length} components fully covered`);
  process.exit(results.length && !incomplete.length ? 0 : 1);
}
