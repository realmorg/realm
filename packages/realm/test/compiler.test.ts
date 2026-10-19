import { afterEach, beforeEach, describe, expect, type MockInstance, test, vi } from "vitest";
import { compileDefinition } from "../src/compiler";
import { define, render, root, tag, text, tick } from "./helpers";

let warn: MockInstance;
beforeEach(() => {
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => warn.mockRestore());

const parse = (html: string) =>
  new DOMParser().parseFromString(html, "text/html").querySelector("custom-element") as Element;

const moduleUrl = (source: string) =>
  URL.createObjectURL(new Blob([source], { type: "text/javascript" }));

describe("pre-assembled components", () => {
  test("the compiler turns a definition into a setup module with its names and handlers", () => {
    const name = tag("compiled");
    const compiled = compileDefinition(
      parse(`<custom-element name="${name}">
        <script type="realm">import { format } from "./format.js";
          const count = useState({ value: 0 });
          function add(step) { count.value += step; }
        </script>
        <style>p { color: red; }</style>
        <link rel="stylesheet" href="x.css">
        <ul><li repeat="#count.items" as="item" onclick="add(item)"></li></ul>
        <button onclick="add(1)"></button>
      </custom-element>`),
    );
    expect(compiled?.name).toBe(name);
    expect(compiled?.script?.getAttribute("type")).toBe("realm");
    expect(compiled?.module).toContain('import { format } from "./format.js";');
    expect(compiled?.module).toContain('export const names = ["format","count","add"];');
    expect(compiled?.module).toContain("function (event, item)");
    expect(compiled?.module).toContain("export default function (__realm)");
    expect(compileDefinition(parse(`<custom-element name="a-b"><p></p></custom-element>`))).toBe(
      undefined,
    );
    expect(
      compileDefinition(
        parse(`<custom-element name="a-b"><script src="x.js"></script></custom-element>`),
      ),
    ).toBe(undefined);
    expect(
      compileDefinition(parse(`<custom-element name="a-b"><script> </script></custom-element>`)),
    ).toBe(undefined);
    const unnamed = compileDefinition(
      parse(`<custom-element><button onclick="go()"></button></custom-element>`),
    );
    expect(unnamed?.name).toBe("");
    expect(unnamed?.script).toBe(undefined);
    expect(unnamed?.module).toContain("go()");
  });

  test("a definition script with src loads a pre-assembled setup module", async () => {
    const name = tag("precompiled");
    const source = `<custom-element name="${name}">
      <script>
        const count = useState({ value: 1 });
        function add() { count.value++; }
      </script>
      <button onclick="add()"><slot name="#count.value"></slot></button>
    </custom-element>`;
    const compiled = compileDefinition(parse(source)) as { module: string };
    const url = moduleUrl(compiled.module);
    await define(
      source
        .replace(/<script>[\s\S]*<\/script>/, `<script src="${url}"></script>`)
        .replace("onclick", "realm:onclick"),
    );
    const el = render(`<${name}></${name}>`).querySelector(name) as Element;
    await tick();
    const button = root(el).querySelector("button") as HTMLButtonElement;
    expect(text(button)).toBe("1");
    button.click();
    await tick();
    expect(text(button)).toBe("2");
  });

  test("a script src that fails to load warns and renders the markup", async () => {
    const name = tag("missing-module");
    await define(
      `<custom-element name="${name}"><script src="/missing-${name}.js"></script><p>static</p></custom-element>`,
    );
    const el = render(`<${name}></${name}>`).querySelector(name) as Element;
    await tick();
    expect(text(root(el))).toBe("static");
    expect(
      warn.mock.calls.some((call) =>
        String(call[1]).includes(`<${name}> could not load its script`),
      ),
    ).toBe(true);
  });
});
