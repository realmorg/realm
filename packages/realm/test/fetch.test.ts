// Behaviour checklist informed by htmx's test/attributes and SWR/TanStack Query race tests.
import { afterEach, beforeEach, describe, expect, type MockInstance, test, vi } from "vitest";
import { define, render, root, tag, text, tick } from "./helpers";

type Route = (url: URL, init: RequestInit) => Response | Promise<Response>;
let routes: Route;
let calls: { url: URL; init: RequestInit }[];
let warn: MockInstance<typeof console.warn>;
const realFetch = globalThis.fetch;

beforeEach(() => {
  calls = [];
  routes = () => new Response("not found", { status: 404 });
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init = {}) => {
    const url = new URL(String(input), location.href);
    if (url.protocol === "blob:") return realFetch(input, init);
    calls.push({ url, init });
    return routes(url, init);
  });
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
const html = (body: string) => new Response(body, { headers: { "content-type": "text/html" } });
const warned = (part: string) => warn.mock.calls.some((call) => String(call[1]).includes(part));

const component = async (script: string, markup: string) => {
  const name = tag("f");
  await define(
    `<custom-element name="${name}"><script>${script}</script>${markup}</custom-element>`,
  );
  const el = render(`<${name}></${name}>`).querySelector(name) as HTMLElement;
  return { name, el, shadow: root(el) };
};

const events = (el: Element, names: string[]) => {
  const log: string[] = [];
  for (const name of names)
    el.addEventListener(name, (e) =>
      log.push(`${name}:${JSON.stringify((e as CustomEvent).detail?.status ?? "")}`),
    );
  return log;
};

describe("fetch attributes", () => {
  test("a fetch form never submits natively, whatever its trigger", async () => {
    routes = () => json([]);
    const { shadow } = await component(
      ``,
      `<form fetch="/api/search" trigger="input"><input name="q"></form><a href="/next" fetch="/api/next" trigger="mouseenter">next</a>`,
    );
    const submit = new SubmitEvent("submit", { cancelable: true });
    (shadow.querySelector("form") as HTMLFormElement).dispatchEvent(submit);
    const click = new MouseEvent("click", { cancelable: true });
    (shadow.querySelector("a") as HTMLAnchorElement).dispatchEvent(click);
    expect(submit.defaultPrevented).toBe(true);
    expect(click.defaultPrevented).toBe(true);
    expect(calls).toHaveLength(0);
  });

  test("debounce on a fetch element times the request, not its handlers", async () => {
    routes = () => json([]);
    const { shadow } = await component(
      `const log = useState({ events: [] });
       function seen(event) { log.events.push(event.type); }`,
      `<form fetch="/api/search" trigger="input submit" debounce="40ms" oninput="seen(event)" onsubmit="seen(event)"><input name="q"></form>`,
    );
    const form = shadow.querySelector("form") as HTMLFormElement;
    const input = form.querySelector("input") as HTMLInputElement;
    input.value = "a";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    const submit = new SubmitEvent("submit", { cancelable: true });
    form.dispatchEvent(submit);
    expect(submit.defaultPrevented).toBe(true);
    expect(calls).toHaveLength(0);
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(calls).toHaveLength(1);
    expect(calls[0]?.url.searchParams.get("q")).toBe("a");
  });

  test("requests read form values changed in the same task", async () => {
    routes = () => json({});
    const field = tag("field");
    await define(`<custom-element name="${field}" form-associated>
      <script>defineProps({ value: prop.string() });</script></custom-element>`);
    const { shadow } = await component(
      ``,
      `<form fetch="/api/save" trigger="submit"><${field} name="unit" value="a"></${field}></form>`,
    );
    await tick();
    const form = shadow.querySelector("form") as HTMLFormElement;
    (form.querySelector(field) as HTMLElement & { value: string }).value = "b";
    form.requestSubmit();
    await tick();
    expect(calls[0]?.url.searchParams.get("unit")).toBe("b");
  });

  test("loads JSON into state on load and tracks busy state", async () => {
    let release: () => void = () => {};
    routes = () =>
      new Promise((resolve) => (release = () => resolve(json([{ id: 1, title: "one" }]))));
    const { el, shadow } = await component(
      `const todo = useState({ items: [], loading: false });`,
      `<ul fetch="/api/todos" trigger="load" into="#todo.items" busy="#todo.loading">
         <repeat-list of="#todo.items" key="id"><li><slot name="#item.title"></slot></li></repeat-list>
       </ul>
       <p><slot name="#todo.loading"></slot></p>`,
    );
    await tick();
    const ul = shadow.querySelector("ul") as HTMLElement;
    expect(ul.getAttribute("aria-busy")).toBe("true");
    expect(el.matches(":state(loading)")).toBe(true);
    expect(text(shadow.querySelector("p"))).toBe("true");
    release();
    await vi.waitFor(() => expect(text(shadow.querySelector("li"))).toBe("one"));
    expect(ul.hasAttribute("aria-busy")).toBe(false);
    expect(el.matches(":state(loading)")).toBe(false);
    await tick();
    expect(text(shadow.querySelector("p"))).toBe("false");
  });

  test("search as you type: params, debounce, cancelled stale requests", async () => {
    const pending: Record<string, (r: Response) => void> = {};
    routes = (url) =>
      new Promise((resolve) => (pending[url.searchParams.get("q") ?? ""] = resolve));
    const { shadow } = await component(
      `const search = useState({ results: [], page: 2 });`,
      `<input name="q" fetch="/api/search" trigger="input" params="page:#search.page, empty:#search.none, obj:#search, bad:oops" into="#search.results">
       <p><slot name="#search.results.length"></slot></p>`,
    );
    const input = shadow.querySelector("input") as HTMLInputElement;
    const log = events(input, ["abort", "load", "loadend"]);
    input.value = "a";
    input.dispatchEvent(new Event("input"));
    input.value = "ab";
    input.dispatchEvent(new Event("input"));
    await tick();
    expect(calls.map((c) => c.url.searchParams.get("q"))).toEqual(["a", "ab"]);
    expect(calls[1]?.url.searchParams.get("page")).toBe("2");
    expect(calls[1]?.url.searchParams.get("empty")).toBe("");
    expect(calls[1]?.url.searchParams.get("obj")).toContain('"page":2');
    pending.ab?.(json([1, 2]));
    pending.a?.(json([1]));
    await vi.waitFor(() => expect(log).toContain("load:200"));
    await tick();
    expect(text(shadow.querySelector("p"))).toBe("2");
    expect(log[0]).toBe('abort:""');
  });

  test("forms post url-encoded or multipart data and honour the submitter", async () => {
    routes = (url) => json({ ok: url.pathname });
    const { shadow } = await component(
      `const todo = useState({ items: [{ ok: "first" }], last: null });`,
      `<form action="/todos" method="post" into="#todo.items" into-mode="append">
         <input name="text" value="milk"><button id="add">Add</button>
         <button id="alt" formaction="/alt" formmethod="put">Alt</button>
       </form>
       <form id="upload" action="/upload" method="post" enctype="multipart/form-data" into="#todo.last" into-mode="prepend">
         <input name="file" value="f">
       </form>
       <p><slot name="#todo.items.length"></slot></p>`,
    );
    (shadow.getElementById("add") as HTMLButtonElement).click();
    await vi.waitFor(() => expect(text(shadow.querySelector("p"))).toBe("2"));
    expect(calls[0]?.init.method).toBe("POST");
    expect(String(calls[0]?.init.body)).toBe("text=milk");
    (shadow.getElementById("alt") as HTMLButtonElement).click();
    await vi.waitFor(() => expect(calls).toHaveLength(2));
    expect(calls[1]?.url.pathname).toBe("/alt");
    expect(calls[1]?.init.method).toBe("PUT");
    (shadow.getElementById("upload") as HTMLFormElement).requestSubmit();
    await vi.waitFor(() => expect(calls).toHaveLength(3));
    expect(calls[2]?.init.body).toBeInstanceOf(FormData);
  });

  test("render inserts sanitised HTML with every mode", async () => {
    routes = (url) =>
      html(
        `<section><b class="hit" onclick="x()">${url.pathname}</b><script>bad()</script></section>`,
      );
    const modes = [
      "replace",
      "outer",
      "append",
      "prepend",
      "before",
      "after",
      "text",
      "merge",
      "remove",
    ];
    const { shadow } = await component(
      ``,
      modes
        .map(
          (mode) =>
            `<button id="${mode}" fetch="/${mode}" render="${mode}-target" render-mode="${mode}"></button><div ref="${mode}-target"><b class="old">old</b></div>`,
        )
        .join("") +
        `<button id="select" fetch="/select" render="select-target" render-select=".hit"></button><div ref="select-target"></div>`,
    );
    for (const mode of [...modes, "select"])
      (shadow.getElementById(mode) as HTMLButtonElement).click();
    await vi.waitFor(() => expect(calls).toHaveLength(modes.length + 1));
    const target = (mode: string) => shadow.querySelector(`[ref="${mode}-target"]`);
    await vi.waitFor(() => {
      expect(target("replace")?.innerHTML).toBe('<section><b class="hit">/replace</b></section>');
      expect(target("select")?.innerHTML).toBe('<b class="hit">/select</b>');
      expect(target("remove")).toBeNull();
    });
    expect(target("outer")).toBeNull();
    expect(target("append")?.lastElementChild?.localName).toBe("section");
    expect(target("prepend")?.firstElementChild?.localName).toBe("section");
    expect(target("before")?.previousElementSibling?.localName).toBe("section");
    expect(target("after")?.nextElementSibling?.localName).toBe("section");
    expect(target("text")?.textContent).toContain("<section>");
    expect(target("merge")?.innerHTML).toBe('<section><b class="hit">/merge</b></section>');
    expect(target("remove")).toBeNull();
    expect(target("select")?.innerHTML).toBe('<b class="hit">/select</b>');
  });

  test("merge keeps existing nodes and the focused input", async () => {
    routes = () => html(`<p class="new">one</p><input value="server"><span>x</span>`);
    const { shadow } = await component(
      ``,
      `<button fetch="/m" render="t" render-mode="merge"></button><div ref="t"><p class="old" data-x="1">zero</p><input value="typed"><em>a</em><i>extra</i></div>`,
    );
    const target = shadow.querySelector('[ref="t"]') as HTMLElement;
    const p = target.querySelector("p");
    const input = target.querySelector("input") as HTMLInputElement;
    input.focus();
    (shadow.querySelector("button") as HTMLButtonElement).click();
    await vi.waitFor(() => expect(target.querySelector("span")).not.toBeNull());
    expect(target.querySelector("p")).toBe(p);
    expect(p?.className).toBe("new");
    expect(p?.hasAttribute("data-x")).toBe(false);
    expect(p?.textContent).toBe("one");
    expect(input.getAttribute("value")).toBe("server");
    expect(target.querySelector("i")).toBeNull();
  });

  test("merge appends new nodes and leaves identical ones alone", async () => {
    routes = () => html(`same<p class="a">p</p><b>new</b>`);
    const { shadow } = await component(
      ``,
      `<button fetch="/grow" render="t" render-mode="merge"></button><div ref="t">same<p class="a">p</p></div>`,
    );
    const target = shadow.querySelector('[ref="t"]') as HTMLElement;
    const textNode = target.firstChild;
    (shadow.querySelector("button") as HTMLButtonElement).click();
    await vi.waitFor(() => expect(target.querySelector("b")).not.toBeNull());
    expect(target.firstChild).toBe(textNode);
    expect(target.innerHTML).toBe('same<p class="a">p</p><b>new</b>');
  });

  test("into modes append and prepend single values onto any existing value", async () => {
    routes = (url) => (url.pathname === "/one" ? json({ id: "one" }) : json([{ id: "many" }]));
    const { shadow } = await component(
      `const s = useState({ list: "not a list", other: [{ id: "old" }] });`,
      `<button id="a" fetch="/one" into="#s.list" into-mode="append"></button>
       <button id="p" fetch="/many" into="#s.other" into-mode="prepend"></button>
       <p><slot name="#s.list.length"></slot>,<slot name="#s.other.0.id"></slot></p>`,
    );
    (shadow.getElementById("a") as HTMLButtonElement).click();
    (shadow.getElementById("p") as HTMLButtonElement).click();
    await vi.waitFor(() => expect(text(shadow.querySelector("p"))).toBe("1,many"));
  });

  test("into modes update and remove list items by key", async () => {
    routes = (url) =>
      (
        ({
          "/update": () =>
            json([
              { id: 2, name: "B" },
              { id: 3, name: "c" },
            ]),
          "/remove": () => json({ id: 1 }),
          "/code": () => json({ code: "x", name: "X" }),
          "/odd": () => json({ id: 9, name: "odd" }),
        }) as Record<string, () => Response>
      )[url.pathname]?.() ?? json(null, 404);
    const { shadow } = await component(
      `const s = useState({ list: [{ id: 1, name: "a" }, { id: 2, name: "b" }], codes: [{ code: "x", name: "x" }] });
       const view = useState({ get names() { return s.list.map((item) => item.name).join(","); } });`,
      `<button id="update" fetch="/update" into="#s.list" into-mode="update"></button>
       <button id="remove" fetch="/remove" into="#s.list" into-mode="remove"></button>
       <button id="code" fetch="/code" into="#s.codes" into-mode="update" into-key="code"></button>
       <button id="odd" fetch="/odd" into="#s.list" into-mode="unknown"></button>
       <p><slot name="#view.names"></slot>|<slot name="#s.codes.0.name"></slot></p>`,
    );
    const click = async (id: string, expected: string) => {
      (shadow.getElementById(id) as HTMLButtonElement).click();
      await vi.waitFor(() => expect(text(shadow.querySelector("p"))).toBe(expected));
    };
    await click("update", "a,B,c|x");
    await click("remove", "B,c|x");
    await click("code", "B,c|X");
    await click("odd", "B,c,odd|X");
  });

  test("a reference trigger re-runs the request when the state changes", async () => {
    routes = (url) => json({ q: url.searchParams.get("q") });
    const { shadow } = await component(
      `const s = useState({ filter: { q: "a" }, result: null, same: 1 });
       function set(q) { s.filter.q = q; }
       function touch() { s.same = 1; s.late = "now"; }`,
      `<div fetch="/search" trigger="#s.filter" debounce="10ms" params="q:#s.filter.q" into="#s.result"></div>
       <div fetch="/same" trigger="#s.same"></div>
       <div fetch="/late" trigger="#s.late"></div>
       <div fetch="/broken" trigger="#"></div>
       <button id="b" onclick="set('b')"></button><button id="c" onclick="set('c')"></button>
       <button id="t" onclick="touch()"></button>
       <p><slot name="#s.result.q">-</slot></p>`,
    );
    await tick();
    expect(calls).toHaveLength(0);
    (shadow.getElementById("t") as HTMLButtonElement).click();
    (shadow.getElementById("b") as HTMLButtonElement).click();
    (shadow.getElementById("c") as HTMLButtonElement).click();
    await vi.waitFor(() => expect(text(shadow.querySelector("p"))).toBe("c"));
    expect(calls.map((call) => call.url.pathname).sort()).toEqual(["/late", "/search"]);
    expect(warned("trigger")).toBe(true);
  });

  test("error, network failure, timeout and cancelled loadstart", async () => {
    routes = (url) => {
      if (url.pathname === "/fail") return json({ message: "bad" }, 500);
      if (url.pathname === "/slow") return new Promise(() => {});
      if (url.pathname === "/text")
        return new Response("{oops", { headers: { "content-type": "application/json" } });
      throw new TypeError("network down");
    };
    const { shadow } = await component(
      `const s = useState({ data: null });`,
      `<button id="fail" fetch="/fail" into="#s.data"></button>
       <button id="net" fetch="/net"></button>
       <button id="slow" fetch="/slow" timeout="10ms"></button>
       <button id="text" fetch="/text" into="#s.data"></button>
       <button id="cancel" fetch="/never" onloadstart="return false"></button>`,
    );
    const log = (id: string) =>
      events(shadow.getElementById(id) as Element, ["error", "timeout", "load", "loadend"]);
    const fail = log("fail");
    const net = log("net");
    const slow = log("slow");
    const textLog = log("text");
    for (const id of ["fail", "net", "slow", "text", "cancel"])
      (shadow.getElementById(id) as HTMLButtonElement).click();
    await vi.waitFor(() => expect(slow).toContain('loadend:""'));
    await vi.waitFor(() => expect(textLog).toContain("load:200"));
    expect(fail).toEqual(["error:500", 'loadend:""']);
    expect(net).toEqual(["error:0", 'loadend:""']);
    expect(slow[0]).toBe('timeout:""');
    expect(calls.some((c) => c.url.pathname === "/never")).toBe(false);
  });

  test("identical GET requests are shared", async () => {
    let resolve: (r: Response) => void = () => {};
    routes = () => new Promise((r) => (resolve = r));
    const { shadow } = await component(
      `const a = useState({ v: null }); const b = useState({ v: null });`,
      `<button id="a" fetch="/same" into="#a.v"></button><button id="b" fetch="/same" into="#b.v"></button>
       <p><slot name="#a.v"></slot>-<slot name="#b.v"></slot></p>`,
    );
    (shadow.getElementById("a") as HTMLButtonElement).click();
    (shadow.getElementById("b") as HTMLButtonElement).click();
    await tick();
    expect(calls).toHaveLength(1);
    resolve(new Response("shared"));
    await vi.waitFor(() => expect(text(shadow.querySelector("p"))).toBe("shared-shared"));
  });

  test("headers, default triggers, visible and poll triggers", async () => {
    routes = () => new Response("ok");
    const { el, shadow } = await component(
      `const auth = useState({ headers: { "x-token": "t" } });`,
      `<select name="s" fetch="/change" headers="#auth.headers"><option>1</option></select>
       <textarea name="t" fetch="/area"></textarea>
       <div fetch="/visible" trigger="visible" style="height: 10px"></div>
       <div fetch="/hidden" trigger="visible" style="display: none"></div>
       <span fetch="/poll" trigger="none" poll="20ms"></span>`,
    );
    shadow.querySelector("select")?.dispatchEvent(new Event("change"));
    shadow.querySelector("textarea")?.dispatchEvent(new Event("change"));
    await vi.waitFor(() => expect(calls.some((c) => c.url.pathname === "/visible")).toBe(true));
    await vi.waitFor(() =>
      expect(calls.filter((c) => c.url.pathname === "/poll").length).toBeGreaterThan(1),
    );
    const change = calls.find((c) => c.url.pathname === "/change");
    expect(new Headers(change?.init.headers).get("x-token")).toBe("t");
    expect(change?.url.searchParams.get("s")).toBe("1");
    expect(calls.find((c) => c.url.pathname === "/area")).toBeDefined();
    expect(calls.some((c) => c.url.pathname === "/hidden")).toBe(false);
    el.remove();
    await tick();
    const count = calls.length;
    await new Promise((r) => setTimeout(r, 60));
    expect(calls.length).toBe(count);
  });

  test("links with render update the address bar; warnings for bad targets", async () => {
    routes = () => html("<p>page</p>");
    const start = location.href;
    const { name, shadow } = await component(
      ``,
      `<a href="/next-page" render="main">next</a><main ref="main"></main>
       <button fetch="/x" render="missing"></button><button fetch="/y" render="main" render-mode="sideways"></button>`,
    );
    (shadow.querySelector("a") as HTMLAnchorElement).click();
    await vi.waitFor(() => expect(text(shadow.querySelector("main"))).toBe("page"));
    expect(location.pathname).toBe("/next-page");
    history.replaceState({}, "", start);
    (shadow.querySelectorAll("button")[0] as HTMLButtonElement).click();
    await vi.waitFor(() =>
      expect(warned(`<${name}> render="missing" does not match any ref`)).toBe(true),
    );
    expect(warned(`<${name}> render-mode="sideways" is not supported`)).toBe(true);
    (shadow.querySelector("main") as HTMLElement).textContent = "cleared";
    (shadow.querySelectorAll("button")[1] as HTMLButtonElement).click();
    await vi.waitFor(() => expect(calls.some((c) => c.url.pathname === "/y")).toBe(true));
    await vi.waitFor(() => expect(text(shadow.querySelector("main"))).toBe("page"));
  });
});
