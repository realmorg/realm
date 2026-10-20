import { afterEach, beforeEach, describe, expect, type MockInstance, test, vi } from "vitest";
import { ImportElement, importDefinitions, noticeTag, watchDocumentTags } from "../src/loader";
import { render, root, tag, text, tick } from "./helpers";

if (!customElements.get("import-element")) customElements.define("import-element", ImportElement);

let warn: MockInstance<typeof console.warn>;
let calls: string[];
let respond: (url: URL) => Response | Promise<Response>;

beforeEach(() => {
  calls = [];
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const url = new URL(String(input), location.href);
    calls.push(url.href);
    return respond(url);
  });
});
afterEach(() => vi.restoreAllMocks());
const warned = (part: string) => warn.mock.calls.some((call) => String(call[1]).includes(part));

const file = (...names: string[]) =>
  names.map((name) => `<custom-element name="${name}"><p>${name}</p></custom-element>`).join("");

describe("import-element", () => {
  test("racing imports of the same file fetch once and define every component in it", async () => {
    const [a, b] = [tag("bundle"), tag("bundle")];
    let release: () => void = () => {};
    respond = () => new Promise((resolve) => (release = () => resolve(new Response(file(a, b)))));
    const url = `/components/${a}.html`;
    const host = render(
      `<import-element from="${url}"></import-element><import-element from="${url}"></import-element><${a}></${a}><${b}></${b}>`,
    );
    const loaded = new Promise((r) =>
      host.querySelector("import-element")?.addEventListener("load", r),
    );
    await tick();
    release();
    await loaded;
    await tick();
    expect(calls).toHaveLength(1);
    expect(text(root(host.querySelector(a)))).toBe(a);
    expect(text(root(host.querySelector(b)))).toBe(b);
  });

  test("failed imports fire error and warn, removed importers stay quiet", async () => {
    const name = tag("missing");
    respond = (url) =>
      url.pathname.includes("network")
        ? Promise.reject(new TypeError("down"))
        : new Response("", { status: 404 });
    const host = render(
      `<import-element from="/${name}.html"></import-element><import-element from="/${name}-network.html"></import-element>`,
    );
    const [first, second] = [...host.querySelectorAll("import-element")];
    const statuses: number[] = [];
    first?.addEventListener("error", (e) => statuses.push((e as CustomEvent).detail.status));
    second?.addEventListener("error", (e) => statuses.push((e as CustomEvent).detail.status));
    await vi.waitFor(() => expect(statuses.sort()).toEqual([0, 404]));
    expect(warned(`/${name}.html (HTTP 404)`)).toBe(true);
    const quiet = render(`<import-element from="/${name}-quiet.html"></import-element>`)
      .firstElementChild as HTMLElement;
    const spy = vi.fn();
    quiet.addEventListener("error", spy);
    quiet.remove();
    await tick();
    await tick();
    expect(spy).not.toHaveBeenCalled();
  });

  test("an importer removed before its file arrives does not fire load", async () => {
    const name = tag("gone");
    let release: () => void = () => {};
    respond = () => new Promise((resolve) => (release = () => resolve(new Response(file(name)))));
    const el = render(`<import-element from="/${name}.html"></import-element>`)
      .firstElementChild as HTMLElement;
    const spy = vi.fn();
    el.addEventListener("load", spy);
    await tick();
    el.remove();
    release();
    await vi.waitFor(() => expect(customElements.get(name)).toBeDefined());
    expect(spy).not.toHaveBeenCalled();
  });

  test("missing from attribute warns; reconnecting does not import twice", async () => {
    const el = render(`<import-element></import-element>`).firstElementChild as HTMLElement;
    expect(warned("<import-element> needs a from attribute")).toBe(true);
    el.remove();
    document.body.append(el);
    el.remove();
    respond = () => new Response(file(tag("once")));
    const once = render(`<import-element from="/once-${tag("o")}.html"></import-element>`)
      .firstElementChild as HTMLElement;
    await tick();
    const parent = once.parentElement as HTMLElement;
    once.remove();
    parent.append(once);
    await tick();
    expect(calls).toHaveLength(1);
  });

  test("lazy imports wait until a listed tag is used", async () => {
    const name = tag("lazy");
    respond = () => new Response(file(name));
    render(`<import-element from="/${name}.html" loading="lazy" for="${name}"></import-element>`);
    render(`<import-element from="/${name}-nofor.html" loading="lazy"></import-element>`);
    await tick();
    expect(calls.filter((c) => c.endsWith(`/${name}.html`))).toHaveLength(0);
    expect(warned("needs a for attribute")).toBe(true);
    noticeTag(name);
    noticeTag(name);
    await vi.waitFor(() =>
      expect(calls.filter((c) => c.endsWith(`/${name}.html`))).toHaveLength(1),
    );
    const seenAlready = tag("seen");
    noticeTag(seenAlready);
    render(
      `<import-element from="/${seenAlready}.html" loading="lazy" for="${seenAlready}"></import-element>`,
    );
    await vi.waitFor(() =>
      expect(calls.some((c) => c.endsWith(`/${seenAlready}.html`))).toBe(true),
    );
  });

  test("document tags are noticed as they are added", async () => {
    const outer = tag("watched");
    const inner = tag("watched");
    respond = () => new Response(file(inner));
    watchDocumentTags(document);
    render(`<import-element from="/${inner}.html" loading="lazy" for="${inner}"></import-element>`);
    await tick();
    expect(calls.some((c) => c.endsWith(`/${inner}.html`))).toBe(false);
    render(`<${outer}><${inner}></${inner}></${outer}><p>plain</p>`);
    await vi.waitFor(() => expect(calls.some((c) => c.endsWith(`/${inner}.html`))).toBe(true));
    const direct = tag("direct");
    render(
      `<import-element from="/${direct}.html" loading="lazy" for="${direct}"></import-element>`,
    );
    const el = document.createElement(direct);
    document.body.append(el);
    await vi.waitFor(() => expect(calls.some((c) => c.endsWith(`/${direct}.html`))).toBe(true));
    el.remove();
  });

  test("at most six requests per origin run at once", async () => {
    const releases: (() => void)[] = [];
    respond = () => new Promise((resolve) => releases.push(() => resolve(new Response(""))));
    const urls = Array.from({ length: 8 }, (_, i) => `https://cdn.example/${tag("q")}-${i}.html`);
    const all = Promise.all(urls.map((url) => importDefinitions(url)));
    await tick();
    expect(calls).toHaveLength(6);
    releases.shift()?.();
    await vi.waitFor(() => expect(calls).toHaveLength(7));
    while (calls.length < 8 || releases.length) {
      releases.shift()?.();
      await tick();
    }
    await all;
    expect(calls).toHaveLength(8);
  });
});
