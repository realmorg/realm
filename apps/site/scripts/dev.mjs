import { spawn } from "node:child_process";
import { watch } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const build = () =>
  new Promise((resolve) =>
    spawn(process.execPath, ["scripts/build.mjs"], { cwd: root, stdio: "inherit" }).on(
      "exit",
      resolve,
    ),
  );

await build();
const server = await createServer({ root: `${root}dist`, server: { port: 5173 }, appType: "mpa" });
await server.listen();
server.printUrls();

let timer;
for (const dir of [
  "content",
  "components",
  "public",
  "../examples",
  "../../packages/ui/components",
]) {
  watch(`${root}${dir}`, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      await build();
      server.ws.send({ type: "full-reload" });
    }, 100);
  });
}
