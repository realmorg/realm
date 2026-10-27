import { afterEach, beforeEach, describe, expect, type MockInstance, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { applyAttribute, compare } from "../src/bindings";
import { instances } from "../src/element";
import { parseReference, readReference, writeReference } from "../src/scope";
import { define, render, root, tag, text, tick } from "./helpers";

let warn: MockInstance<typeof console.warn>;
beforeEach(() => {
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => warn.mockRestore());
const warned = (part: string) => warn.mock.calls.some((call) => String(call[1]).includes(part));

const component = async (script: string, markup: string, attrs = "") => {
  const name = tag("b");
  await define(
    `<custom-element name="${name}"><script>${script}</script>${markup}</custom-element>`,
  );
  const el = render(`<${name} ${attrs}></${name}>`).querySelector(name) as HTMLElement;
  return { name, el, shadow: root(el) };
};

describe("applyAttribute", () => {
  test("covers every value rule", () => {
    const div = document.createElement("div");
    applyAttribute(div, "--accent", "red");
    expect(div.style.getPropertyValue("--accent")).toBe("red");
    applyAttribute(div, "--accent", null);
    expect(div.style.getPropertyValue("--accent")).toBe("");
    applyAttribute(div, "aria-expanded", false);
    expect(div.getAttribute("aria-expanded")).toBe("false");
    applyAttribute(div, "draggable", true);
    expect(div.draggable).toBe(true);
    applyAttribute(div, "draggable", false);
    expect(div.getAttribute("draggable")).toBe("false");
    applyAttribute(div, "hidden", true);
    expect(div.getAttribute("hidden")).toBe("");
    for (const empty of [false, null, undefined]) {
      div.setAttribute("hidden", "");
      applyAttribute(div, "hidden", empty);
      expect(div.hasAttribute("hidden")).toBe(false);
    }
    applyAttribute(div, "title", 5);
    expect(div.getAttribute("title")).toBe("5");
    const input = document.createElement("input");
    applyAttribute(input, "value", "x");
    expect(input.value).toBe("x");
    applyAttribute(input, "value", null);
    expect(input.value).toBe("");
    applyAttribute(input, "checked", 1);
    expect(input.checked).toBe(true);
    const custom = document.createElement("x-unknown") as HTMLElement & { userData?: unknown };
    applyAttribute(custom, "user-data", { a: 1 });
    expect(custom.userData).toEqual({ a: 1 });
    applyAttribute(custom, "label", "plain");
    expect(custom.getAttribute("label")).toBe("plain");
  });
});

describe("compare", () => {
  test("comparators", () => {
    expect(compare(1, "eq", "1")).toBe(true);
    expect(compare(1, "neq", "1")).toBe(false);
    expect(compare(3, "gt", "2")).toBe(true);
    expect(compare(2, "gte", "2")).toBe(true);
    expect(compare(1, "lt", "2")).toBe(true);
    expect(compare(2, "lte", "2")).toBe(true);
    expect(compare([1, 2], "contains", "2")).toBe(true);
    expect(compare("hello", "contains", "ell")).toBe(true);
    expect(compare(null, "contains", "x")).toBe(false);
    expect(compare(0, undefined, "")).toBe(false);
  });
});

describe("references", () => {
  test("parse and write rules", async () => {
    expect(parseReference("todo")).toBeUndefined();
    expect(parseReference("!#a.b")?.negate).toBe(true);
    const { name, el } = await component(
      `const s = useState({ a: { b: 1 }, n: null });`,
      `<p></p>`,
    );
    const instance = instances.get(el) as NonNullable<ReturnType<typeof instances.get>>;
    const scope = { instance, vars: [], signal: instance.signal, disposers: [] };
    const read = (text: string) =>
      readReference(parseReference(text) as NonNullable<ReturnType<typeof parseReference>>, scope);
    const write = (text: string) =>
      writeReference(
        parseReference(text) as NonNullable<ReturnType<typeof parseReference>>,
        scope,
        () => 2,
      );
    expect(read("#s.n.deep")).toBeUndefined();
    expect(read("@missing")).toBeUndefined();
    write("#s.a.b");
    expect(read("#s.a.b")).toBe(2);
    write("@x.y");
    write("#s");
    write("!#s.a");
    write("#s.n.deep");
    expect(warned(`<${name}> "#s" can't be written`)).toBe(true);
    expect(
      warned(`<${name}> "#s.n.deep" can't be written because its parent is not an object`),
    ).toBe(true);
  });
});

describe("value slots", () => {
  test("text, html, unsafe html and fallback", async () => {
    const { shadow } = await component(
      `const s = useState({ text: "<b>x</b>", empty: "", html: "<b onclick='x()'>bold</b><script>bad()<\\/script>" });`,
      `<slot id="t" name="#s.text"></slot>
       <slot id="h" name="#s.html" html></slot>
       <slot id="u" name="#s.text" html-unsafe></slot>
       <slot id="f" name="#s.empty">fallback <slot name="#s.text"></slot></slot>
       <slot id="native" name="footer">native</slot>`,
    );
    const slot = (id: string) => shadow.getElementById(id) as HTMLSlotElement;
    expect(slot("t").textContent).toBe("<b>x</b>");
    expect(slot("h").innerHTML).toBe("<b>bold</b>");
    expect(slot("u").innerHTML).toBe("<b>x</b>");
    expect(slot("f").textContent).toBe("fallback <b>x</b>");
    expect(slot("native").textContent).toBe("native");
  });

  test("invalid references warn", async () => {
    const { name } = await component(
      ``,
      `<slot name="#1bad"></slot><p _title="nope"></p><is-visible></is-visible><repeat-list></repeat-list>`,
    );
    expect(warned(`<${name}> <slot> name="#1bad"`)).toBe(true);
    expect(warned(`<${name}> _title="nope"`)).toBe(true);
    expect(warned(`<${name}> <is-visible> when=""`)).toBe(true);
    expect(warned(`<${name}> repeat=""`)).toBe(true);
  });
});

describe("attribute bindings and refs", () => {
  test("bindings follow state, including css variables", async () => {
    const { shadow } = await component(
      `const s = useState({ url: "/a", open: false, color: "red" });
       function toggle() { s.open = !s.open; s.url = "/b"; s.color = "blue"; }`,
      `<a ref="link" _href="#s.url" _hidden="!#s.open" _--accent="#s.color" onclick="toggle(); return false">x</a>`,
    );
    const link = shadow.querySelector("a") as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("/a");
    expect(link.hasAttribute("hidden")).toBe(true);
    expect(link.style.getPropertyValue("--accent")).toBe("red");
    const event = new MouseEvent("click", { cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    await tick();
    expect(link.getAttribute("href")).toBe("/b");
    expect(link.hasAttribute("hidden")).toBe(false);
    expect(link.style.getPropertyValue("--accent")).toBe("blue");
  });

  test("debounce and throttle on handlers", async () => {
    vi.useFakeTimers();
    const { shadow } = await component(
      `const s = useState({ d: 0, t: 0 });`,
      `<input id="d" oninput="s.d++" debounce="100ms"><input id="t" oninput="s.t++" throttle="1s">
       <p><slot name="#s.d"></slot>/<slot name="#s.t"></slot></p>`,
    );
    const fire = (id: string) => shadow.getElementById(id)?.dispatchEvent(new Event("input"));
    fire("d");
    fire("d");
    fire("t");
    fire("t");
    vi.advanceTimersByTime(150);
    vi.useRealTimers();
    await tick();
    expect(text(shadow.querySelector("p"))).toBe("1/1");
  });

  test("debounced handlers are cancelled when the element is removed", async () => {
    vi.useFakeTimers();
    const { el, shadow } = await component(
      `window.debounced = 0;`,
      `<input oninput="window.debounced++" debounce="2s">`,
    );
    shadow.querySelector("input")?.dispatchEvent(new Event("input"));
    el.remove();
    await Promise.resolve();
    vi.advanceTimersByTime(3000);
    vi.useRealTimers();
    expect((window as unknown as { debounced: number }).debounced).toBe(0);
  });

  test("invalid durations warn and fire immediately", async () => {
    const { shadow } = await component(
      `const s = useState({ n: 0 });`,
      `<button onclick="s.n++" debounce="soon"><slot name="#s.n"></slot></button>`,
    );
    (shadow.querySelector("button") as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 5));
    await tick();
    expect(text(shadow.querySelector("button"))).toBe("1");
    expect(warned(`"soon" is not a duration`)).toBe(true);
  });

  test("a loop variable named event is the item in its handlers", async () => {
    const { shadow } = await component(
      `const s = useState({ events: [{ id: 1, name: "Launch" }], picked: "" });
       function pick(item) { s.picked = item.name; }`,
      `<ul><li repeat="#s.events" as="event" key="id" onclick="pick(event)"><slot name="#event.name"></slot></li></ul>
       <p><slot name="#s.picked"></slot></p>`,
    );
    (shadow.querySelector("li") as HTMLLIElement).click();
    await tick();
    expect(text(shadow.querySelector("p"))).toBe("Launch");
  });
});

describe("conditional rendering", () => {
  test("is-visible and is-hidden mount and unmount content", async () => {
    const { shadow } = await component(
      `const s = useState({ status: "idle", count: 0, flag: false });
       window.condState = s;`,
      `<is-visible when="#s.flag"><p id="flag">flag</p></is-visible>
       <is-hidden when="#s.flag"><p id="noflag">no flag</p></is-hidden>
       <is-visible when="#s.status" eq="done"><p id="done">done</p></is-visible>
       <is-visible when="#s.count" gt="1"><p id="many">many</p></is-visible>`,
    );
    const s = (window as unknown as { condState: { status: string; count: number; flag: boolean } })
      .condState;
    const has = (id: string) => shadow.getElementById(id) !== null;
    expect([has("flag"), has("noflag"), has("done"), has("many")]).toEqual([
      false,
      true,
      false,
      false,
    ]);
    s.flag = true;
    s.status = "done";
    s.count = 2;
    await tick();
    expect([has("flag"), has("noflag"), has("done"), has("many")]).toEqual([
      true,
      false,
      true,
      true,
    ]);
  });

  test("hidden content stops its bindings and listeners", async () => {
    const { el, shadow } = await component(
      `const s = useState({ show: true, n: 0 }); window.hideState = s;`,
      `<is-visible when="#s.show"><button onclick="s.n++"><slot name="#s.n"></slot></button></is-visible>`,
    );
    const s = (window as unknown as { hideState: { show: boolean; n: number } }).hideState;
    const button = shadow.querySelector("button") as HTMLButtonElement;
    s.show = false;
    await tick();
    button.click();
    expect(s.n).toBe(0);
    s.show = true;
    await tick();
    el.remove();
    await tick();
    expect(shadow.querySelector("button")).toBeNull();
  });
});

describe("lists", () => {
  test("keyed lists reuse, move and remove nodes", async () => {
    const { shadow } = await component(
      `const s = useState({ items: [{ id: 1, t: "a" }, { id: 2, t: "b" }, { id: 3, t: "c" }] });
       window.listState = s;
       function pick(item, i) { window.picked = item.t + i; }`,
      `<ul><repeat-list of="#s.items" as="item" index="i" key="id">
         <li onclick="pick(item, i)"><slot name="#item.t"></slot>:<slot name="#i"></slot></li>
       </repeat-list></ul>`,
    );
    const s = (window as unknown as { listState: { items: { id: number; t: string }[] } })
      .listState;
    const items = () => [...shadow.querySelectorAll("li")];
    const [first, second] = items();
    expect(items().map((li) => text(li))).toEqual(["a:0", "b:1", "c:2"]);
    s.items.reverse();
    await tick();
    expect(items().map((li) => text(li))).toEqual(["c:0", "b:1", "a:2"]);
    expect(items()[2]).toBe(first);
    expect(items()[1]).toBe(second);
    s.items.splice(1, 1);
    s.items[0] = { id: 3, t: "C" };
    await tick();
    expect(items().map((li) => text(li))).toEqual(["C:0", "a:1"]);
    items()[1]?.click();
    expect((window as unknown as { picked: string }).picked).toBe("a1");
  });

  test("unkeyed lists, duplicate keys, nested loops and non-arrays", async () => {
    const { name, shadow } = await component(
      `const s = useState({ rows: [[1, 2], [3]], dup: [{ k: 1 }, { k: 1 }], none: null });`,
      `<repeat-list of="#s.rows" as="row" index="r">
         <div><repeat-list of="#row" as="cell"><span onclick="window.cell = cell + r"><slot name="#cell"></slot></span></repeat-list></div>
       </repeat-list>
       <repeat-list of="#s.dup" key="k"><b><slot name="#item.k"></slot></b></repeat-list>
       <repeat-list of="#s.none"><i>never</i></repeat-list>`,
    );
    expect([...shadow.querySelectorAll("div")].map((div) => text(div))).toEqual(["12", "3"]);
    expect(shadow.querySelectorAll("b")).toHaveLength(2);
    expect(shadow.querySelector("i")).toBeNull();
    expect(warned(`<${name}> repeat has a duplicate key "1"`)).toBe(true);
    (shadow.querySelectorAll("span")[2] as HTMLElement).click();
    expect((window as unknown as { cell: number }).cell).toBe(4);
  });

  test("the repeat attribute works inside tables", async () => {
    const { shadow } = await component(
      `const report = useState({ rows: [{ id: "a", name: "Ana" }, { id: "b", name: "Budi" }] }); window.tableState = report;`,
      `<table><tbody><tr repeat="#report.rows" as="row" key="id" onclick="window.row = row.name"><td><slot name="#row.name"></slot></td></tr></tbody></table>`,
    );
    const rows = () => [...shadow.querySelectorAll("tr")].map((tr) => text(tr));
    expect(rows()).toEqual(["Ana", "Budi"]);
    const state = (window as unknown as { tableState: { rows: { id: string; name: string }[] } })
      .tableState;
    state.rows.push({ id: "c", name: "Citra" });
    await tick();
    expect(rows()).toEqual(["Ana", "Budi", "Citra"]);
    (shadow.querySelectorAll("tr")[2] as HTMLElement).click();
    expect((window as unknown as { row: string }).row).toBe("Citra");
  });
});

describe("svg", () => {
  test("bindings keep SVG attribute case and value slots render as text", async () => {
    const { shadow } = await component(
      `const chart = useState({ box: "0 0 10 10", label: "Sales", empty: "" });`,
      `<svg _viewBox="#chart.box"><text><slot name="#chart.label">x</slot></text><text id="e"><slot name="#chart.empty">fallback</slot></text><rect _width="#chart.box"></rect></svg>`,
    );
    const svg = shadow.querySelector("svg") as SVGSVGElement;
    expect(svg.getAttribute("viewBox")).toBe("0 0 10 10");
    expect(svg.querySelector("text")?.textContent).toBe("Sales");
    expect(shadow.getElementById("e")?.textContent).toBe("fallback");
    expect(svg.querySelector("slot")).toBeNull();
  });

  test("html value slots inside SVG render sanitised SVG elements", async () => {
    const { shadow } = await component(
      `const icon = useState({ body: '<circle r="4" onclick="alert(1)"/><scr' + 'ipt>alert(1)</scr' + 'ipt><a href="javascript:x"><set attributeName="href" to="javascript:alert(1)"/></a>', raw: '<rect onclick="go()"/>', none: "" });
       function swap() { icon.body = '<path d="M0 0"/>'; icon.raw = ""; }`,
      `<svg><slot name="#icon.body" html></slot><g id="raw"><slot name="#icon.raw" html-unsafe><line></line></slot></g><g id="none"><slot name="#icon.none" html><ellipse></ellipse></slot></g></svg><button onclick="swap()"></button>`,
    );
    const svg = shadow.querySelector("svg") as SVGSVGElement;
    const circle = svg.querySelector("circle") as Element;
    expect(circle.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(circle.hasAttribute("onclick")).toBe(false);
    expect(svg.querySelector("script")).toBeNull();
    expect(svg.querySelector("a")?.hasAttribute("href")).toBe(false);
    expect(svg.querySelector("set")?.hasAttribute("to")).toBe(false);
    expect(shadow.querySelector("#raw rect")?.getAttribute("onclick")).toBe("go()");
    expect(shadow.querySelector("#none ellipse")).not.toBeNull();
    (shadow.querySelector("button") as HTMLButtonElement).click();
    await tick();
    expect(svg.querySelector("circle")).toBeNull();
    expect(svg.querySelector("path")?.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(shadow.querySelector("#raw line")).not.toBeNull();
  });
});

test("an absent value leaves progress and meter indeterminate", async () => {
  const { shadow } = await component(
    `const job = useState({ done: null });
     function advance() { job.done = 0.5; }`,
    `<progress _value="#job.done"></progress><meter _value="#job.done"></meter><button onclick="advance()"></button>`,
  );
  const progress = shadow.querySelector("progress") as HTMLProgressElement;
  expect(progress.hasAttribute("value")).toBe(false);
  expect(progress.position).toBe(-1);
  expect(shadow.querySelector("meter")?.hasAttribute("value")).toBe(false);
  (shadow.querySelector("button") as HTMLButtonElement).click();
  await tick();
  expect(progress.value).toBe(0.5);
});

test("the repeat attribute on a top-level element keeps updating after the markup is mounted", async () => {
  const { shadow } = await component(
    `const list = useState({ items: ["a"] });
     function add() { list.items.push("b"); }`,
    `<p repeat="#list.items" as="item"><slot name="#item"></slot></p><button onclick="add()"></button>`,
  );
  (shadow.querySelector("button") as HTMLButtonElement).click();
  await tick();
  expect([...shadow.querySelectorAll("p")].map((p) => p.textContent)).toEqual(["a", "b"]);
});

test("a bound value on a component keeps what the user types until state changes", async () => {
  const field = tag("field");
  const name = tag("bound");
  await define(`<custom-element name="${field}" form-associated>
    <script>defineProps({ value: prop.string().default("") });</script>
    <input ref="control" _value="@value">
  </custom-element>`);
  await define(`<custom-element name="${name}">
    <script>const form = useState({ text: "" }); function search(value) { form.text = value; }</script>
    <${field} _value="#form.text" oninput="search(this.value)" debounce="100ms"></${field}>
  </custom-element>`);
  const host = render(`<${name}></${name}>`);
  const child = root(host.querySelector(name)).querySelector(field) as HTMLElement & {
    value: string;
  };
  const input = root(child).querySelector("input") as HTMLInputElement;
  input.focus();
  await userEvent.keyboard("abc");
  await new Promise((resolve) => setTimeout(resolve, 150));
  await tick();
  expect(input.value).toBe("abc");
  expect(child.value).toBe("abc");
});

test("a typed value is not written back, so length limits still apply", async () => {
  const name = tag("typed");
  await define(`<custom-element name="${name}">
    <script>const form = useState({ text: "" }); function typed(field) { form.text = field.value; }</script>
    <input minlength="4" _value="#form.text" oninput="typed(this)">
  </custom-element>`);
  const host = render(`<${name}></${name}>`);
  const input = root(host.querySelector(name)).querySelector("input") as HTMLInputElement;
  input.focus();
  await userEvent.keyboard("ab");
  await tick();
  expect(input.value).toBe("ab");
  expect(input.validity.tooShort).toBe(true);
  input.value = "";
  input.dispatchEvent(new Event("input"));
  await tick();
  expect(input.value).toBe("");
});
