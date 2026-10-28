import { afterEach, beforeEach, describe, expect, type MockInstance, test, vi } from "vitest";
import { define, render, root, tag, text, tick } from "./helpers";

let warn: MockInstance<typeof console.warn>;
beforeEach(() => {
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => warn.mockRestore());
const warned = (part: string) => warn.mock.calls.some((call) => String(call[1]).includes(part));

const mount = (name: string, inner = "", attrs = "") =>
  render(`<${name} ${attrs}>${inner}</${name}>`).querySelector(name) as HTMLElement &
    Record<string, unknown>;

describe("writable props", () => {
  test("writing an undeclared prop warns", async () => {
    const name = tag("undeclared");
    await define(
      `<custom-element name="${name}"><script>const props = defineProps({ a: prop.string() }); props.b = 1;</script></custom-element>`,
    );
    mount(name);
    expect(warned(`<${name}> "b" is not a declared prop`)).toBe(true);
  });
});

describe("useChildren and tick", () => {
  test("useChildren tracks matching children and watched attributes", async () => {
    const name = tag("children");
    await define(`<custom-element name="${name}">
      <script>
        const options = useChildren("option", ["label"]);
        const view = useState({ get labels() { return options.map((o) => o.label).join(","); } });
        async function measure() { view.measured = refs.out.textContent; }
        async function waitAndRead() { options[0].label = "changed"; await tick(); window.afterTick = refs.out.textContent; }
      </script>
      <p ref="out"><slot name="#view.labels"></slot></p>
      <button onclick="waitAndRead()">x</button>
    </custom-element>`);
    const el = mount(name, `<option label="a"></option><span></span><option>b</option>`);
    expect(text(root(el).querySelector("p"))).toBe("a,b");
    el.append(Object.assign(document.createElement("option"), { textContent: "c" }));
    await tick();
    await new Promise((resolve) => setTimeout(resolve));
    await tick();
    expect(text(root(el).querySelector("p"))).toBe("a,b,c");
    (root(el).querySelector("button") as HTMLButtonElement).click();
    await vi.waitFor(() =>
      expect((window as unknown as { afterTick: string }).afterTick).toBe("changed,b,c"),
    );
  });
});

describe("reactive refs", () => {
  test("observers written at the top of a script see refs once the markup exists", async () => {
    const name = tag("refs");
    await define(`<custom-element name="${name}">
      <script>observe(() => { if (refs.box) refs.box.textContent = "ready"; });</script>
      <p ref="box">waiting</p>
    </custom-element>`);
    const el = mount(name);
    await tick();
    expect(text(root(el).querySelector("p"))).toBe("ready");
  });
});

describe("form-associated automation", () => {
  test("value and checked props drive the form value, reset and restore", async () => {
    const field = tag("field");
    const check = tag("check");
    await define(`
      <custom-element name="${field}" form-associated>
        <script>const props = defineProps({ value: prop.string().default(""), disabled: prop.boolean() }); function type(v) { props.value = v; }</script>
        <input _value="@value" _disabled="@disabled" oninput="type(this.value)">
      </custom-element>
      <custom-element name="${check}" form-associated>
        <script>const props = defineProps({ checked: prop.boolean(), value: prop.string() }); function flip() { props.checked = !props.checked; }</script>
        <button onclick="flip()">flip</button>
      </custom-element>`);
    const host = render(
      `<form><fieldset><${field} name="f" value="start"></${field}><${check} name="c" checked></${check}><${check} name="d" value="yes"></${check}></fieldset></form>`,
    );
    const form = host.querySelector("form") as HTMLFormElement;
    const [input] = [...host.querySelectorAll(field)].map(
      (el) => root(el).querySelector("input") as HTMLInputElement,
    );
    const data = () => [...new FormData(form)].map(([k, v]) => `${k}=${v}`).join("&");
    expect(data()).toBe("f=start&c=on");
    (input as HTMLInputElement).value = "typed";
    input?.dispatchEvent(new Event("input"));
    (
      root(host.querySelector(`${check}[name="d"]`)).querySelector("button") as HTMLButtonElement
    ).click();
    await tick();
    expect(data()).toBe("f=typed&c=on&d=yes");
    form.reset();
    await tick();
    expect(data()).toBe("f=start&c=on");
    (host.querySelector("fieldset") as HTMLFieldSetElement).disabled = true;
    await tick();
    expect(input?.disabled).toBe(true);
    const restore = (el: Element, state: unknown) =>
      (
        el as unknown as { formStateRestoreCallback(s: unknown, m: string): void }
      ).formStateRestoreCallback(state, "restore");
    restore(host.querySelector(field) as Element, "restored");
    restore(host.querySelector(`${check}[name="c"]`) as Element, null);
    await tick();
    expect((host.querySelector(field) as unknown as { value: string }).value).toBe("restored");
    expect((host.querySelector(check) as unknown as { checked: boolean }).checked).toBe(false);
  });

  test("a form reset keeps props that are not the form value", async () => {
    const name = tag("picker");
    await define(
      `<custom-element name="${name}" form-associated><script>defineProps({ value: prop.string().default(""), options: prop.array().default([]) });</script></custom-element>`,
    );
    const host = render(`<form><${name} name="p" value="a"></${name}></form>`);
    const picker = host.querySelector(name) as unknown as { value: string; options: string[] };
    picker.options = ["a", "b"];
    picker.value = "b";
    (host.querySelector("form") as HTMLFormElement).reset();
    await tick();
    expect(picker.value).toBe("a");
    expect(picker.options).toEqual(["a", "b"]);
  });

  test("a form-associated component exposes validity like a native field", async () => {
    const name = tag("valid");
    const plain = tag("plain");
    await define(`
      <custom-element name="${name}" form-associated>
        <script>defineProps({ value: prop.string().default("") });</script>
        <input ref="control" required _value="@value">
      </custom-element>
      <custom-element name="${plain}"></custom-element>`);
    const host = render(`<form><${name} name="v"></${name}></form><${plain}></${plain}>`);
    const field = host.querySelector(name) as unknown as HTMLInputElement;
    await tick();
    expect(field.willValidate).toBe(true);
    expect(field.checkValidity()).toBe(false);
    expect(field.validity.valueMissing).toBe(true);
    expect(field.validationMessage).not.toBe("");
    expect(field.reportValidity()).toBe(false);
    field.value = "filled";
    await tick();
    expect(field.checkValidity()).toBe(true);
    expect("checkValidity" in (host.querySelector(plain) as Element)).toBe(false);
  });

  test("form-associated components without value props still reset", async () => {
    const name = tag("plain-form");
    await define(
      `<custom-element name="${name}" form-associated><script>defineProps({ size: prop.number().default(1) });</script></custom-element>`,
    );
    const host = render(`<form><${name}></${name}></form>`);
    (host.querySelector("form") as HTMLFormElement).reset();
    expect((host.querySelector(name) as unknown as { size: number }).size).toBe(1);
  });
});

describe("reactive CSS", () => {
  test("--attr-* variables do not leak into nested components", async () => {
    const name = tag("tone");
    await define(`<custom-element name="${name}"><script>defineProps({ tone: prop.string() });</script>
      <style>:host { display: block; color: var(--attr-tone, rgb(0, 0, 255)); }</style><slot></slot></custom-element>`);
    const host = render(
      `<${name} tone="rgb(255, 0, 0)"><${name} id="inner">inner</${name}></${name}>`,
    );
    await tick();
    expect(getComputedStyle(host.querySelector(name) as Element).color).toBe("rgb(255, 0, 0)");
    expect(getComputedStyle(host.querySelector("#inner") as Element).color).toBe("rgb(0, 0, 255)");
  });

  test("--attr-* and --state-* variables follow props, attributes and state", async () => {
    const name = tag("css-vars");
    await define(`<custom-element name="${name}">
      <script>
        defineProps({ size: prop.number().default(10) });
        const theme = useState({ color: "red", nested: { tone: "light" }, list: [1] });
        window.cssTheme = theme;
      </script>
      <style>
        :host { width: calc(var(--attr-size) * 1px); color: var(--state-theme-color); background: var(--attr-tint); --x: var(--state-theme-nested-tone) var(--state-theme-list); }
      </style>
    </custom-element>`);
    const el = mount(name, "", `tint="blue"`);
    const style = el.style;
    expect(style.getPropertyValue("--attr-size")).toBe("10");
    expect(style.getPropertyValue("--attr-tint")).toBe("blue");
    expect(style.getPropertyValue("--state-theme-color")).toBe("red");
    expect(style.getPropertyValue("--state-theme-nested-tone")).toBe("light");
    expect(style.getPropertyValue("--state-theme-list")).toBe("initial");
    const theme = (window as unknown as { cssTheme: { color: string } }).cssTheme;
    theme.color = "green";
    el.setAttribute("tint", "pink");
    el.size = 20;
    await tick();
    await new Promise((resolve) => setTimeout(resolve));
    await tick();
    expect(style.getPropertyValue("--state-theme-color")).toBe("green");
    expect(style.getPropertyValue("--attr-tint")).toBe("pink");
    expect(style.getPropertyValue("--attr-size")).toBe("20");
    expect(getComputedStyle(el).color).toBe("rgb(0, 128, 0)");
  });

  test(":state() selectors cover truthy values and comparisons", async () => {
    const name = tag("css-states");
    await define(`<custom-element name="${name}">
      <script>
        defineProps({ variant: prop.enum(["solid", "outline"]).default("solid"), open: prop.boolean() });
        const todo = useState({ count: 0, filter: "all", isEmpty: true });
        window.cssTodo = todo;
      </script>
      <style>
        :host(:state(attr-open)) { outline: 1px solid; }
        :host(:state(attr-variant-is-outline)) { border: 1px solid; }
        :host(:state(state-todo-isEmpty)) { opacity: 0.5; }
        :host(:state(state-todo-filter-is-done)) { color: red; }
        :host(:state(state-todo-count-gt-2)) { font-weight: 700; }
        :host(:state(state-todo-count-gte-3)) {}
        :host(:state(state-todo-count-lt-1)) {}
        :host(:state(state-todo-count-lte-0)) {}
        :host(:state(attr-data-mode)) {}
      </style>
    </custom-element>`);
    const el = mount(name, "", `variant="outline"`);
    const has = (state: string) => el.matches(`:state(${state})`);
    expect(has("attr-open")).toBe(false);
    expect(has("attr-variant-is-outline")).toBe(true);
    expect(has("state-todo-isEmpty")).toBe(true);
    expect(has("state-todo-count-lt-1")).toBe(true);
    expect(has("state-todo-count-lte-0")).toBe(true);
    const todo = (
      window as unknown as { cssTodo: { count: number; filter: string; isEmpty: boolean } }
    ).cssTodo;
    todo.count = 3;
    todo.filter = "done";
    todo.isEmpty = false;
    el.open = true;
    el.setAttribute("data-mode", "x");
    await tick();
    await new Promise((resolve) => setTimeout(resolve));
    await tick();
    expect(has("attr-open")).toBe(true);
    expect(has("state-todo-filter-is-done")).toBe(true);
    expect(has("state-todo-count-gt-2")).toBe(true);
    expect(has("state-todo-count-gte-3")).toBe(true);
    expect(has("state-todo-isEmpty")).toBe(false);
    expect(has("attr-data-mode")).toBe(true);
    expect(getComputedStyle(el).fontWeight).toBe("700");
  });
});

describe("attrs and dispatch", () => {
  test("attrs reads and writes any host attribute reactively", async () => {
    const name = tag("attrs");
    await define(`<custom-element name="${name}">
      <script>
        const view = useState({ get label() { return attrs.label ?? "none"; } });
        function rename() { attrs.label = "renamed"; attrs.flag = true; attrs.gone = false; attrs.size = 3; }
      </script>
      <p><slot name="#view.label"></slot></p>
      <button onclick="rename()">r</button>
    </custom-element>`);
    const el = mount(name, "", `label="first" gone`);
    expect(text(root(el).querySelector("p"))).toBe("first");
    el.setAttribute("label", "second");
    await tick();
    await new Promise((resolve) => setTimeout(resolve));
    await tick();
    expect(text(root(el).querySelector("p"))).toBe("second");
    (root(el).querySelector("button") as HTMLButtonElement).click();
    await tick();
    expect(text(root(el).querySelector("p"))).toBe("renamed");
    expect(el.getAttribute("flag")).toBe("");
    expect(el.hasAttribute("gone")).toBe(false);
    expect(el.getAttribute("size")).toBe("3");
    el.removeAttribute("label");
    await new Promise((resolve) => setTimeout(resolve));
    await tick();
    expect(text(root(el).querySelector("p"))).toBe("none");
  });

  test("dispatch sends a bubbling, composed, cancelable event and reports cancellation", async () => {
    const name = tag("dispatch");
    await define(`<custom-element name="${name}">
      <script>function fire() { window.dispatched = dispatch("pick", { id: 7 }); }</script>
      <button onclick="fire()">x</button>
    </custom-element>`);
    const host = render(`<div><${name}></${name}></div>`);
    const seen: unknown[] = [];
    host.addEventListener("pick", (event) => {
      seen.push((event as CustomEvent).detail.id);
      event.preventDefault();
    });
    (root(host.querySelector(name)).querySelector("button") as HTMLButtonElement).click();
    expect(seen).toEqual([7]);
    expect((window as unknown as { dispatched: boolean }).dispatched).toBe(false);
  });
});

describe("form control delegation", () => {
  test("a control ref syncs value, checked and numbers, mirrors validity and re-dispatches change", async () => {
    const text = tag("text-field");
    const check = tag("check-field");
    const range = tag("range-field");
    const plain = tag("plain-field");
    await define(`
      <custom-element name="${text}" form-associated><script>defineProps({ value: prop.string().default(""), required: prop.boolean() });</script><input ref="control" _value="@value" _required="@required"></custom-element>
      <custom-element name="${check}" form-associated><script>defineProps({ checked: prop.boolean() });</script><input ref="control" type="checkbox" _checked="@checked"></custom-element>
      <custom-element name="${range}" form-associated><script>defineProps({ value: prop.number().default(5) });</script><input ref="control" type="range" _value="@value"></custom-element>
      <custom-element name="${plain}" form-associated><script>defineProps({ size: prop.number() });</script><input ref="control"></custom-element>`);
    const host = render(
      `<form><${text} name="t" required></${text}><${check} name="c"></${check}><${range} name="r"></${range}><${plain}></${plain}></form>`,
    );
    const form = host.querySelector("form") as HTMLFormElement;
    const control = (tagName: string) =>
      root(host.querySelector(tagName)).querySelector("input") as HTMLInputElement;
    expect(form.checkValidity()).toBe(false);
    const changes: string[] = [];
    host.addEventListener("change", (event) => changes.push((event.target as Element).localName));
    control(text).value = "hello";
    control(text).dispatchEvent(new Event("input"));
    control(text).dispatchEvent(new Event("change"));
    control(check).click();
    control(range).value = "9";
    control(range).dispatchEvent(new Event("input"));
    control(plain).dispatchEvent(new Event("input"));
    await tick();
    expect(Object.fromEntries(new FormData(form))).toEqual({ t: "hello", c: "on", r: "9" });
    expect((host.querySelector(range) as unknown as { value: number }).value).toBe(9);
    expect(form.checkValidity()).toBe(true);
    expect(changes).toEqual([text, check]);
  });
});

describe("child upgrades", () => {
  test("useChildren refreshes when a child component mounts, so parents read child props", async () => {
    const parent = tag("parent");
    const child = tag("child");
    await define(`<custom-element name="${parent}">
      <script>
        const items = useChildren("${child}");
        const view = useState({ get labels() { return items.map((item) => item.label ?? "?").join(","); } });
      </script>
      <p><slot name="#view.labels"></slot></p>
    </custom-element>`);
    const host = render(`<${parent}><${child} label="a"></${child}></${parent}>`);
    expect(text(root(host.querySelector(parent)).querySelector("p"))).toBe("?");
    await define(
      `<custom-element name="${child}"><script>defineProps({ label: prop.string() });</script></custom-element>`,
    );
    await tick();
    expect(text(root(host.querySelector(parent)).querySelector("p"))).toBe("a");
  });
});

describe("defineMethods", () => {
  test("exposes methods and getters on the element and removes them on teardown", async () => {
    const name = tag("methods");
    await define(`<custom-element name="${name}">
      <script>
        const counter = useState({ n: 0 });
        defineMethods({
          increment(by = 1) { counter.n += by; return counter.n; },
          get count() { return counter.n; },
        });
      </script>
    </custom-element>`);
    const el = mount(name) as unknown as HTMLElement & {
      increment(by?: number): number;
      count: number;
    };
    expect(el.increment(2)).toBe(2);
    expect(el.count).toBe(2);
    el.remove();
    await tick();
    await new Promise((resolve) => setTimeout(resolve));
    expect("increment" in el).toBe(false);
  });

  test("a value set before upgrade reaches a defineMethods setter", async () => {
    const name = tag("early");
    const host = render(`<${name} id="early"></${name}><${name} id="late"></${name}>`);
    const early = host.querySelector("#early") as unknown as { loader: string };
    early.loader = "fetch-children";
    await define(`<custom-element name="${name}">
      <script>
        const seen = useState({ loader: "none" });
        defineMethods({ set loader(value) { seen.loader = value; }, get loader() { return seen.loader; } });
      </script>
    </custom-element>`);
    await tick();
    expect(early.loader).toBe("fetch-children");
    expect((host.querySelector("#late") as unknown as { loader: string }).loader).toBe("none");
  });
});

describe("listen", () => {
  test("listens on the host or another target until the element is removed", async () => {
    const name = tag("listen");
    await define(`<custom-element name="${name}">
      <script>
        const log = useState({ host: 0, doc: 0 });
        window.listenLog = log;
        listen("ping", () => log.host++);
        listen("ping", () => log.doc++, document);
      </script>
    </custom-element>`);
    const el = mount(name);
    const log = (window as unknown as { listenLog: { host: number; doc: number } }).listenLog;
    el.dispatchEvent(new Event("ping"));
    document.dispatchEvent(new Event("ping"));
    expect(log).toMatchObject({ host: 1, doc: 1 });
    el.remove();
    await tick();
    await new Promise((resolve) => setTimeout(resolve));
    el.dispatchEvent(new Event("ping"));
    document.dispatchEvent(new Event("ping"));
    expect(log).toMatchObject({ host: 1, doc: 1 });
  });
});

describe("implicit submission", () => {
  test("Enter in a delegated text control submits the outer form", async () => {
    const name = tag("enter-field");
    await define(`<custom-element name="${name}" form-associated><script>defineProps({ value: prop.string() });</script><input ref="control"></custom-element>
      <custom-element name="${name}-area" form-associated><script>defineProps({ value: prop.string() });</script><textarea ref="control"></textarea></custom-element>`);
    const host = render(
      `<form><${name} name="a"></${name}><${name}-area name="b"></${name}-area></form><${name} name="loose"></${name}>`,
    );
    const form = host.querySelector("form") as HTMLFormElement;
    let submits = 0;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submits++;
    });
    const press = (el: Element, key: string) =>
      el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
    press(root(host.querySelector(name)).querySelector("input") as Element, "Enter");
    press(root(host.querySelector(name)).querySelector("input") as Element, "a");
    press(root(host.querySelector(`${name}-area`)).querySelector("textarea") as Element, "Enter");
    press(
      root(host.querySelector(`${name}[name="loose"]`)).querySelector("input") as Element,
      "Enter",
    );
    expect(submits).toBe(1);
  });
});

describe("labels", () => {
  test("a native label around a delegated field names its inner control", async () => {
    const name = tag("labelled");
    await define(
      `<custom-element name="${name}" form-associated><script>defineProps({ value: prop.string() });</script><input ref="control"></custom-element>`,
    );
    const host = render(
      `<form><label>Title <${name}></${name}></label><label>Other <${name} id="named"></${name}></label></form>`,
    );
    const input = root(host.querySelector(name)).querySelector("input") as HTMLInputElement;
    expect(input.getAttribute("aria-label")).toBe("Title");
    expect(
      root(host.querySelector("#named")).querySelector("input")?.getAttribute("aria-label"),
    ).toBe("Other");
  });
});

test("form-associated components created inside a disabled fieldset start disabled", async () => {
  const field = tag("field");
  const form = tag("form");
  await define(`<custom-element name="${field}" form-associated>
      <script>defineProps({ disabled: prop.boolean() });</script>
      <input _disabled="@disabled"></custom-element>
    <custom-element name="${form}"><form><fieldset disabled><${field}></${field}></fieldset></form></custom-element>`);
  const host = mount(form);
  await tick();
  const inner = root(root(host).querySelector(field)).querySelector("input") as HTMLInputElement;
  expect(inner.disabled).toBe(true);
});

test("timers started by a component stop when it is removed", async () => {
  const name = tag("timers");
  await define(`<custom-element name="${name}"><script>
    const log = useState({ ticks: 0, fired: 0, cleared: 0 });
    const every = setInterval(() => log.ticks++, 5);
    setTimeout((step) => (log.fired += step), 5, 2);
    const never = setTimeout(() => log.cleared++, 5);
    clearTimeout(never);
    clearInterval();
    defineMethods({ get log() { return log; }, stop: () => clearInterval(every) });
    setTimeout(() => window.lateTimer = true, 60);
  </script></custom-element>`);
  const el = mount(name) as unknown as HTMLElement & {
    log: { ticks: number; fired: number; cleared: number };
  };
  await new Promise((resolve) => setTimeout(resolve, 30));
  expect(el.log.ticks).toBeGreaterThan(0);
  expect(el.log.fired).toBe(2);
  expect(el.log.cleared).toBe(0);
  const log = el.log;
  el.remove();
  await tick();
  const ticks = log.ticks;
  await new Promise((resolve) => setTimeout(resolve, 80));
  expect(log.ticks).toBe(ticks);
  expect((window as unknown as { lateTimer?: boolean }).lateTimer).toBeUndefined();
});

test("a disabled delegated control is valid, whatever its constraints", async () => {
  const field = tag("range-field");
  await define(`<custom-element name="${field}" form-associated>
    <script>defineProps({ value: prop.number().default(1), disabled: prop.boolean() });</script>
    <input ref="control" type="number" min="1" max="0" _value="@value" _disabled="@disabled"></custom-element>`);
  const errors: unknown[] = [];
  const spy = vi.spyOn(console, "error").mockImplementation((...args) => errors.push(args));
  const el = mount(field, "", "disabled") as unknown as HTMLElement & { value: number };
  await tick();
  el.value = 2;
  await tick();
  expect(errors).toEqual([]);
  expect((el as unknown as { matches(s: string): boolean }).matches(":invalid")).toBe(false);
  spy.mockRestore();
});

test("hidden elements inside a component stay hidden whatever their display", async () => {
  const name = tag("hidden-close");
  await define(
    `<custom-element name="${name}"><style>button { display: grid; }</style><button hidden>x</button><details hidden="until-found"><summary>s</summary></details></custom-element>`,
  );
  const el = mount(name);
  expect(getComputedStyle(root(el).querySelector("button") as Element).display).toBe("none");
});

test("untrack lets an effect call other components without subscribing to them", async () => {
  const name = tag("untracked");
  await define(`<custom-element name="${name}"><script>
    const outer = useState({ runs: 0 });
    const other = useState({ open: false });
    function toggle() { other.open = !other.open; }
    observe(() => { outer.runs++; untrack(() => other.open); });
    defineMethods({ get runs() { return outer.runs; }, toggle });
  </script></custom-element>`);
  const el = mount(name) as unknown as { runs: number; toggle(): void };
  await tick();
  const runs = el.runs;
  el.toggle();
  await tick();
  expect(el.runs).toBe(runs);
});

test("toRaw gives component scripts the plain data behind a prop or state", async () => {
  const name = tag("raw");
  await define(`<custom-element name="${name}"><script>
    const props = defineProps({ rows: prop.array().default([]) });
    const state = useState({ list: [{ id: 1 }] });
    defineMethods({
      get rawRows() { return toRaw(props.rows); },
      get rawList() { return toRaw(state.list); },
      get proxied() { return props.rows; },
    });
  </script></custom-element>`);
  const el = mount(name) as unknown as {
    rows: object[];
    rawRows: object[];
    rawList: object[];
    proxied: object[];
  };
  const rows = [{ id: 1 }, { id: 2 }];
  el.rows = rows;
  await tick();
  expect(el.rawRows).toBe(rows);
  expect(el.proxied).not.toBe(rows);
  expect(structuredClone(el.rawList)).toEqual([{ id: 1 }]);
});
