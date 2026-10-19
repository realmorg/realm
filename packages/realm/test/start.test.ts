import { describe, expect, test, vi } from "vitest";
import * as api from "../src/index";
import { sanitize } from "../src/sanitize";
import { parseDuration } from "../src/time";
import { render, root, tag, text, tick } from "./helpers";

describe("start", () => {
  test("defines inline definitions already in the page and ones added later", async () => {
    const early = tag("early");
    const late = tag("late");
    const nested = tag("nested");
    render(`<custom-element name="${early}"><p>early</p></custom-element><${early}></${early}>`);
    api.start();
    api.start();
    await tick();
    expect(text(root(document.querySelector(early)))).toBe("early");
    render(`<custom-element name="${late}"><p>late</p></custom-element><${late}></${late}>`);
    render(
      `<section><div><custom-element name="${nested}"><p>nested</p></custom-element></div></section><${nested}></${nested}>`,
    );
    document.body.append(document.createTextNode("text node"));
    const direct = tag("direct");
    const definition = document.createElement("custom-element");
    definition.setAttribute("name", direct);
    definition.innerHTML = "<p>direct</p>";
    document.body.append(definition);
    render(`<${direct}></${direct}>`);
    await vi.waitFor(() => expect(text(root(document.querySelector(direct)))).toBe("direct"));
    await vi.waitFor(() => expect(text(root(document.querySelector(late)))).toBe("late"));
    await vi.waitFor(() => expect(text(root(document.querySelector(nested)))).toBe("nested"));
    expect(customElements.get("import-element")).toBeDefined();
    expect(getComputedStyle(document.createElement("custom-element")).display).toBeDefined();
  });

  test("public API", async () => {
    expect(Object.keys(api).sort()).toEqual([
      "defineComponent",
      "defineStore",
      "flush",
      "importDefinitions",
      "observe",
      "prop",
      "start",
      "toRaw",
      "untrack",
      "useState",
    ]);
    const auto = await import("../src/auto");
    expect(auto.start).toBe(api.start);
  });

  test("durations and the sanitiser", () => {
    expect(parseDuration("2s")).toBe(2000);
    expect(parseDuration("1m")).toBe(60000);
    expect(parseDuration("15")).toBe(15);
    const fragment = sanitize(
      `<a href="javascript:alert(1)" title="t">a</a><iframe srcdoc="x"></iframe><img src="x.png" srcdoc="y">`,
    );
    const div = document.createElement("div");
    div.append(fragment);
    expect(div.innerHTML).toBe('<a title="t">a</a><img src="x.png">');
  });
});
