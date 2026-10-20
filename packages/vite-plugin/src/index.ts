import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { compileDefinition } from "@realmorg/realm/compiler";
import { parseHTML } from "linkedom";
import type { Plugin } from "vite";
import { createManifest, describe } from "./manifest.js";

export { createManifest, describe } from "./manifest.js";

export interface PrecompileResult {
  modules: string[];
  definitions: ReturnType<typeof describe>[];
}

const htmlFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return entry === "node_modules" ? [] : htmlFiles(path);
    return entry.endsWith(".html") ? [path] : [];
  });

const scriptTag = (script: Element, src: string) => {
  const type = script.getAttribute("type");
  return `<script${type && type !== "module" ? ` type="${type}"` : ""} src="./${src}"></script>`;
};

const TAG = /<[a-z][^\s/>]*(?:\s+[^\s=/>]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s*\/?>/gi;
const HANDLER = /(\s)on([a-z][\w-]*)(?=\s*=)/g;
const DEFINITION = /<custom-element[\s>][\s\S]*?<\/custom-element>/g;

const inertHandlers = (html: string) =>
  html.replace(DEFINITION, (definition) =>
    definition.replace(TAG, (tag) => tag.replace(HANDLER, "$1realm:on$2")),
  );

export const precompileFile = (path: string, root = dirname(path)): PrecompileResult => {
  let html = readFileSync(path, "utf8");
  const { document } = parseHTML(
    /<html[\s>]/i.test(html) ? html : `<!doctype html><html><body>${html}</body></html>`,
  );
  const result: PrecompileResult = { modules: [], definitions: [] };
  let cursor = 0;
  for (const definition of document.querySelectorAll("custom-element")) {
    const open = html.indexOf("<custom-element", cursor);
    const openEnd = html.indexOf(">", open) + 1;
    cursor = openEnd;
    result.definitions.push(describe(definition, relative(root, path)));
    const compiled = compileDefinition(definition);
    if (!compiled) continue;
    const module = `${basename(path, ".html")}.${compiled.name}.js`;
    writeFileSync(join(dirname(path), module), compiled.module);
    result.modules.push(join(dirname(path), module));
    if (!compiled.script) {
      const tag = `<script type="realm" src="./${module}"></script>`;
      html = html.slice(0, openEnd) + tag + html.slice(openEnd);
      cursor = openEnd + tag.length;
      continue;
    }
    const text = compiled.script.textContent as string;
    const end = html.indexOf(`${text}</script>`, openEnd) + text.length + "</script>".length;
    const start = html.lastIndexOf("<script", end - text.length);
    const tag = scriptTag(compiled.script, module);
    html = html.slice(0, start) + tag + html.slice(end);
    cursor = start + tag.length;
  }
  const inert = inertHandlers(html);
  if (inert !== readFileSync(path, "utf8")) writeFileSync(path, inert);
  return result;
};

export const precompile = (dir: string): PrecompileResult => {
  const results = htmlFiles(dir).map((file) => precompileFile(file, dir));
  return {
    modules: results.flatMap((result) => result.modules),
    definitions: results.flatMap((result) => result.definitions),
  };
};

export interface RealmPluginOptions {
  manifest?: string | false;
}

export default function realm(options: RealmPluginOptions = {}): Plugin {
  let outDir = "dist";
  let build = false;
  return {
    name: "realm",
    configResolved(config) {
      outDir = join(config.root, config.build.outDir);
      build = config.command === "build";
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const path = decodeURIComponent((request.url as string).split("?")[0] as string);
        const file = join(server.config.root, path);
        const fetched = !request.headers.accept?.includes("text/html");
        if (!fetched || !path.endsWith(".html") || !existsSync(file)) return next();
        response.setHeader("content-type", "text/html");
        response.end(readFileSync(file));
      });
    },
    closeBundle() {
      if (!build) return;
      const { definitions } = precompile(outDir);
      const manifest = options.manifest ?? "custom-elements.json";
      if (manifest)
        writeFileSync(
          join(outDir, manifest),
          `${JSON.stringify(createManifest(definitions), null, 2)}\n`,
        );
    },
  };
}
