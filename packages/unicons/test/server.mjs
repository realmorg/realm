import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { dirname, extname, join, normalize } from "node:path";

// Serves the same layout as the website: the catalog and dist/ under /unicons/, REALM under
// /assets/realm/ and REALM UI under /assets/ui/.
const PACKAGE = join(import.meta.dirname, "..");
const REALM = dirname(createRequire(import.meta.url).resolve("@realmorg/realm"));
const PORT = Number(process.env.PORT ?? 4317);
const UI = join(PACKAGE, "../ui");
const MOUNTS = [
  ["/assets/realm/", [REALM]],
  ["/assets/ui/components/", [join(UI, "components")]],
  ["/assets/ui/", [UI]],
  ["/unicons/", [join(PACKAGE, "site"), join(PACKAGE, "dist")]],
];
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
};

const fixture = (url) =>
  `<!doctype html><html><head><meta charset="utf-8">${url.searchParams.get("head") ?? ""}<script type="module" src="/assets/realm/realm.js"></script></head><body>${url.searchParams.get("body") ?? ""}</body></html>`;

const read = async (pathname) => {
  const file = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
  for (const [prefix, roots] of MOUNTS) {
    if (!file.startsWith(prefix)) continue;
    for (const root of roots) {
      const path = normalize(join(root, file.slice(prefix.length)));
      if (!path.startsWith(root)) continue;
      const body = await readFile(path).catch(() => undefined);
      if (body) return { body, type: TYPES[extname(path)] ?? "application/octet-stream" };
    }
  }
};

createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  if (url.pathname === "/unicons/fixture.html") {
    response.writeHead(200, { "content-type": "text/html" }).end(fixture(url));
    return;
  }
  const found = await read(url.pathname);
  if (!found) return response.writeHead(404).end();
  response.writeHead(200, { "content-type": found.type }).end(found.body);
}).listen(PORT);
