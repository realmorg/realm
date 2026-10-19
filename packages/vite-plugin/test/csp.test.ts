import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";
import { chromium, firefox, webkit } from "playwright";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { precompile } from "../src/index";

const PAGE = `<!doctype html>
<html><head>
<meta http-equiv="Content-Security-Policy" content="script-src 'self'">
<link rel="stylesheet" href="./realm/realm.css">
<script type="module" src="./realm/realm.js"></script>
</head><body>
<import-element from="./components.html"></import-element>
<x-counter></x-counter>
</body></html>`;

const COMPONENTS = `<custom-element name="x-counter">
  <script>
    import { format } from "./format.js";
    const count = useState({ value: 0, items: [1, 10] });
    function add(step) { count.value += step; }
    function reset() { count.value = 0; }
    function label() { return format(count.value); }
    const view = useState({ get text() { return format(count.value); } });
  </script>
  <output><slot name="#view.text"></slot></output>
  <ul><li repeat="#count.items" as="item"><button onclick="add(item)">add</button></li></ul>
  <x-reset></x-reset>
</custom-element>
<custom-element name="x-reset"><button onclick="reset()">reset</button></custom-element>
<custom-element name="x-note"><style>p { margin: 0; }</style><p>static</p></custom-element>`;

const TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
};

const site = (compiled: boolean) => {
  const dir = mkdtempSync(join(tmpdir(), "realm-csp-"));
  cpSync(join(import.meta.dirname, "../../realm/dist"), join(dir, "realm"), { recursive: true });
  writeFileSync(join(dir, "index.html"), PAGE);
  writeFileSync(join(dir, "components.html"), COMPONENTS);
  writeFileSync(join(dir, "format.js"), "export const format = (value) => `#${value}`;\n");
  if (compiled) precompile(dir);
  return dir;
};

let server: Server;
let origin = "";
const roots = { compiled: site(true), plain: site(false) };

beforeAll(async () => {
  server = createServer((request, response) => {
    const [, root = "", ...rest] = (request.url as string).split("/");
    const base = roots[root as keyof typeof roots];
    const path = base ? join(base, ...rest) : "";
    try {
      const body = readFileSync(path);
      response.writeHead(200, { "content-type": TYPES[extname(path)] ?? "text/plain" });
      response.end(body);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(() => new Promise((resolve) => server.close(resolve)));

describe.each([chromium, firefox, webkit])("strict CSP in %s", (engine) => {
  const open = async (root: keyof typeof roots) => {
    const browser = await engine.launch();
    const page = await browser.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(`${origin}/${root}/index.html`);
    return { browser, page, errors };
  };

  test("pre-assembled components run under script-src 'self'", async () => {
    const { browser, page, errors } = await open("compiled");
    const output = page.locator("x-counter output");
    await expect.poll(() => output.textContent()).toBe("#0");
    await page.locator("x-counter button").nth(1).click();
    await expect.poll(() => output.textContent()).toBe("#10");
    await page.locator("x-counter button").first().click();
    await expect.poll(() => output.textContent()).toBe("#11");
    await page.locator("x-reset button").click();
    await expect.poll(() => output.textContent()).toBe("#0");
    expect(errors).toEqual([]);
    await browser.close();
  });

  test("without pre-assembly the same page is blocked by the policy", async () => {
    const { browser, page } = await open("plain");
    const violations = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let count = 0;
          document.addEventListener("securitypolicyviolation", () => count++);
          setTimeout(() => resolve(count), 1000);
        }),
    );
    const defined = await page.evaluate(() => !!customElements.get("x-counter"));
    expect(violations > 0 || !defined).toBe(true);
    await browser.close();
  });
});
