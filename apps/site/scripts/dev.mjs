import { spawn } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync, watch } from "node:fs";
import { fileURLToPath } from "node:url";
import realm from "@realmorg/vite-plugin";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const site = `${root}.dev/site`;

const run = (script, cwd, env = {}) =>
  new Promise((resolve) =>
    spawn(process.execPath, [script], {
      cwd,
      stdio: "inherit",
      env: { ...process.env, ...env },
    }).on("exit", resolve),
  );

let building = Promise.resolve();
const build = () => {
  building = building.then(async () => {
    await run("scripts/bundle.mjs", `${root}../../packages/ui`);
    const next = `${root}.dev/next-${Date.now()}`;
    const code = await run("scripts/build.mjs", root, { SITE_OUT: next });
    if (code !== 0 || !existsSync(next)) {
      rmSync(next, { recursive: true, force: true, maxRetries: 5 });
      console.error("The site did not build. Still serving the last build.");
      return false;
    }
    rmSync(site, { recursive: true, force: true, maxRetries: 5 });
    renameSync(next, site);
    return true;
  });
  return building;
};

mkdirSync(site, { recursive: true });
await build();
const server = await createServer({
  root: site,
  server: { port: 5173, watch: { ignored: ["**/*"] } },
  appType: "mpa",
  plugins: [realm({ manifest: false })],
});
await server.listen();
server.printUrls();

let timer;
for (const dir of [
  "content",
  "components",
  "public",
  "scripts",
  "../examples",
  "../../packages/ui/components",
  "../../packages/ui/theme.css",
  "../../packages/realm/dist",
  "../../packages/unicons/site",
  "../../packages/unicons/dist",
]) {
  watch(`${root}${dir}`, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (!(await build())) return;
      server.moduleGraph.invalidateAll();
      server.ws.send({ type: "full-reload" });
    }, 300);
  });
}
