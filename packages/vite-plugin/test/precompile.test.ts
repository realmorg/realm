import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseHTML } from "linkedom";
import { createServer } from "vite";
import { expect, describe as group, test } from "vitest";
import realm, { createManifest, describe, precompile, precompileFile } from "../src/index";

const COMPONENTS = `<custom-element name="x-counter">
  <script>
    import { format } from "./format.js";
    const props = defineProps({
      start: prop.number().default(0),
      variant: prop.enum(["solid", "outline"]).default("solid"),
      maxLength: prop.number().attribute("max"),
      label: prop.string(),
      minValue: prop.number(),
      other: somethingElse,
    });
    const count = useState({ value: props.start, items: [1, 2] });
    function add(step) { count.value += step; dispatch("change", count.value); }
    host.dispatchEvent(new CustomEvent("ready"));
  </script>
  <style>:host(:state(attr-variant-is-outline)) { border: 1px solid; } :host(:state(loading)) {}</style>
  <button part="button inner" onclick="add(1)"><slot name="#count.value"></slot></button>
  <ul><li repeat="#count.items" as="item" onclick="add(item > 0)"><slot name="@label"></slot></li></ul>
  <slot></slot><slot name="footer"></slot>
</custom-element>

<custom-element name="x-static"><p>static</p></custom-element>
<custom-element name="x-close" slot="close"><button onclick="requestClose()">x</button></custom-element>
<custom-element name="x-external"><script src="./x-external.js"></script></custom-element>
<custom-element name="x-module"><script type="module">const a = useState({});</script></custom-element>
`;

const PAGE = `<!doctype html>
<html><head><title>page</title></head><body>
<custom-element name="x-inline"><script type="realm">const greeting = useState({ name: "world" });</script><p><slot name="#greeting.name"></slot></p></custom-element>
</body></html>`;

const fixture = () => {
  const dir = mkdtempSync(join(tmpdir(), "realm-precompile-"));
  writeFileSync(join(dir, "components.html"), COMPONENTS);
  writeFileSync(join(dir, "index.html"), PAGE);
  writeFileSync(join(dir, "notes.txt"), "not html");
  mkdirSync(join(dir, "node_modules"));
  writeFileSync(join(dir, "node_modules", "ignored.html"), COMPONENTS);
  mkdirSync(join(dir, "nested"));
  writeFileSync(join(dir, "nested", "plain.html"), "<p>no components</p>");
  return dir;
};

group("precompile", () => {
  test("writes a setup module per definition and points the script at it", () => {
    const dir = fixture();
    const { modules, definitions } = precompile(dir);
    expect(modules.map((path) => path.slice(dir.length + 1)).sort()).toEqual([
      "components.x-close.js",
      "components.x-counter.js",
      "components.x-module.js",
      "index.x-inline.js",
    ]);
    expect(definitions.map((definition) => definition.tagName).sort()).toEqual([
      "x-close",
      "x-counter",
      "x-external",
      "x-inline",
      "x-module",
      "x-static",
    ]);
    const components = readFileSync(join(dir, "components.html"), "utf8");
    expect(components).toContain('<script src="./components.x-counter.js"></script>');
    expect(components).toContain('<script src="./components.x-module.js"></script>');
    expect(components).toContain('<script src="./x-external.js"></script>');
    expect(components).toContain(
      '<custom-element name="x-close" slot="close"><script type="realm" src="./components.x-close.js"></script><button realm:onclick="requestClose()">x</button>',
    );
    expect(components).not.toContain("useState");
    expect(components).toContain('<button part="button inner" realm:onclick="add(1)">');
    expect(components).toContain(
      '<li repeat="#count.items" as="item" realm:onclick="add(item > 0)">',
    );
    const page = readFileSync(join(dir, "index.html"), "utf8");
    expect(page).toContain('<script type="realm" src="./index.x-inline.js"></script>');
    const module = readFileSync(join(dir, "components.x-counter.js"), "utf8");
    expect(module).toContain('import { format } from "./format.js";');
    expect(module).toContain("export default function (__realm)");
    expect(readFileSync(join(dir, "node_modules", "ignored.html"), "utf8")).toBe(COMPONENTS);
    expect(precompile(dir).modules).toEqual([]);
  });

  test("a file without definitions is left untouched", () => {
    const dir = fixture();
    expect(precompileFile(join(dir, "nested", "plain.html"))).toEqual({
      modules: [],
      definitions: [],
    });
  });
});

group("manifest", () => {
  test("describes attributes, events, slots, parts and states", () => {
    const { document } = parseHTML(`<html><body>${COMPONENTS}</body></html>`);
    const counter = describe(document.querySelector("custom-element") as Element, "c.html");
    expect(counter).toMatchObject({
      name: "XCounter",
      tagName: "x-counter",
      attributes: [
        { name: "start", fieldName: "start", type: { text: "number" }, default: "0" },
        { name: "variant", type: { text: '"solid" | "outline"' }, default: '"solid"' },
        { name: "max", fieldName: "maxLength", type: { text: "number" } },
        { name: "label", type: { text: "string" } },
        { name: "min-value", fieldName: "minValue" },
      ],
      events: [{ name: "change" }, { name: "ready" }],
      slots: [{ name: "" }, { name: "footer" }],
      cssParts: [{ name: "button" }, { name: "inner" }],
      cssStates: [{ name: "attr-variant-is-outline" }, { name: "loading" }],
    });
    expect(counter.attributes[3]).not.toHaveProperty("default");
    const manifest = createManifest([counter]);
    expect(manifest.schemaVersion).toBe("2.1.0");
    expect(manifest.modules[0]?.exports[0]).toEqual({
      kind: "custom-element-definition",
      name: "x-counter",
      declaration: { name: "XCounter", module: "c.html" },
    });
  });

  test("components without props, or with unbalanced props, have no attributes", () => {
    const { document } = parseHTML(`<html><body>
      <custom-element name="a-b"><p></p></custom-element>
      <custom-element name="c-d"><script>defineProps({ a: prop.string()</script></custom-element>
      <custom-element name="e-f"><script>defineProps({ a: prop.date(), b: prop.boolean(), c: prop.array(), d: prop.object() })</script></custom-element>
    </body></html>`);
    const [plain, broken, types] = [...document.querySelectorAll("custom-element")].map((el) =>
      describe(el, "x.html"),
    );
    expect(plain?.attributes).toEqual([]);
    expect(broken?.attributes).toEqual([]);
    expect(types?.attributes.map((attribute) => attribute.type?.text)).toEqual([
      "Date",
      "boolean",
      "array",
      "object",
    ]);
  });
});

group("vite plugin", () => {
  test("precompiles the build output and writes the manifest", () => {
    const run = (options?: Parameters<typeof realm>[0] & { command?: string }) => {
      const dir = fixture();
      const plugin = realm(options) as unknown as {
        configResolved(config: { root: string; command: string; build: { outDir: string } }): void;
        closeBundle(): void;
      };
      plugin.configResolved({
        root: dir,
        command: options?.command ?? "build",
        build: { outDir: "." },
      });
      plugin.closeBundle();
      return dir;
    };
    const dir = run();
    const manifest = JSON.parse(readFileSync(join(dir, "custom-elements.json"), "utf8"));
    expect(manifest.modules).toHaveLength(6);
    expect(
      readFileSync(join(run({ manifest: "elements.json" }), "elements.json"), "utf8"),
    ).toContain("x-counter");
    expect(() => readFileSync(join(run({ manifest: false }), "custom-elements.json"))).toThrow();
    expect(() => readFileSync(join(run({ command: "serve" }), "custom-elements.json"))).toThrow();
  });
});

group("dev server", () => {
  test("component files fetched by import-element are served untransformed in dev", async () => {
    const dir = fixture();
    const server = await createServer({
      root: dir,
      configFile: false,
      logLevel: "silent",
      plugins: [realm()],
      server: { port: 0 },
    });
    await server.listen();
    const origin = server.resolvedUrls?.local[0] as string;
    const get = (path: string, accept: string) =>
      fetch(new URL(path, origin), { headers: { accept } }).then((response) => response.text());
    expect(await get("components.html", "*/*")).toBe(COMPONENTS);
    expect(await get("index.html", "text/html")).toContain("/@vite/client");
    expect(await get("missing.html", "*/*")).not.toBe(COMPONENTS);
    expect(await get("notes.txt", "*/*")).toBe("not html");
    expect(await get("components.html?html-proxy&index=0.js", "*/*")).not.toBe(COMPONENTS);
    await server.close();
  });
});
