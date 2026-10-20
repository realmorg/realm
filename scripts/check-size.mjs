import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";

const BUDGET_GZIP = 16 * 1024;
const dist = "packages/realm/dist";
const files = [
  join(dist, "realm.js"),
  ...readdirSync(join(dist, "chunks")).map((f) => join(dist, "chunks", f)),
];
const source = Buffer.concat(files.map((file) => readFileSync(file)));
const gzip = gzipSync(source, { level: 9 }).length;
const brotli = brotliCompressSync(source).length;
console.log(
  `realm runtime: ${(gzip / 1024).toFixed(2)} KB gzip, ${(brotli / 1024).toFixed(2)} KB brotli (budget ${BUDGET_GZIP / 1024} KB gzip)`,
);
process.exit(gzip > BUDGET_GZIP ? 1 : 0);
