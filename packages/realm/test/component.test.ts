import { afterEach, beforeEach, describe, expect, type MockInstance, test, vi } from "vitest";
import { defineComponent, getDefinition } from "../src/definition";
import { instances } from "../src/element";
import { define, render, root, tag, text, tick } from "./helpers";

let warn: MockInstance<typeof console.warn>;
let error: MockInstance<typeof console.error>;
beforeEach(() => {
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  error = vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  warn.mockRestore();
  error.mockRestore();
});
const warned = (part: string) => warn.mock.calls.some((call) => String(call[1]).includes(part));

const mount = (name: string, attrs = "") =>
  render(`<${name} ${attrs}></${name}>`).querySelector(name) as HTMLElement;

describe("definition", () => {
  test("rejects names without a dash", async () => {
    await define(`<custom-element name="nodash"></custom-element>`);
    expect(warned(`<custom-element name="nodash">`)).toBe(true);
  });

  test("defining the same source twice is harmless, a different source warns", async () => {
    const name = tag("dup");
    const html = `<custom-element name="${name}"><p>one</p></custom-element>`;
    await define(html);
    await define(html);
    expect(warned(`<${name}> is defined twice`)).toBe(false);
    await define(
      `<custom-element name="${name}"><p>two</p></custom-element>`,
      "https://other.test/x.html",
    );
    expect(warned(`<${name}> is defined twice`)).toBe(true);
    expect(getDefinition(name)?.name).toBe(name);
  });

  test("warns when another library owns the name", async () => {
    const name = tag("foreign");
    customElements.define(name, class extends HTMLElement {});
    await define(`<custom-element name="${name}"></custom-element>`);
    expect(warned(`<${name}> is already defined by another library`)).toBe(true);
  });

  test("uses the first script and warns about extras", async () => {
    const name = tag("scripts");
    await define(`<custom-element name="${name}">
      <script>const s = useState({ v: "first" });</script>
      <script>const s = useState({ v: "second" });</script>
      <p><slot name="#s.v"></slot></p>
    </custom-element>`);
    expect(warned(`<${name}> has more than one <script>`)).toBe(true);
    expect(text(root(mount(name)))).toBe("first");
  });

  test("inline definitions warn about a plain script and accept type=realm", async () => {
    const plain = tag("inline");
    const typed = tag("inline");
    const make = (name: string, type: string) => {
      const el = document.createElement("custom-element");
      el.setAttribute("name", name);
      el.innerHTML = `<script ${type}>const s = useState({ v: "ok" });</script><p><slot name="#s.v"></slot></p>`;
      return el;
    };
    await defineComponent(make(plain, ""), location.href, true);
    await defineComponent(make(typed, 'type="realm"'), location.href, true);
    await defineComponent(document.createElement("custom-element"), location.href, true);
    expect(warned(`<${plain}> is defined in the page`)).toBe(true);
    expect(warned(`<${typed}> is defined in the page`)).toBe(false);
    expect(text(root(mount(typed)))).toBe("ok");
  });

  test("assembled scripts carry the page nonce", async () => {
    const holder = document.createElement("script");
    holder.setAttribute("nonce", "n0nce");
    holder.type = "application/json";
    document.head.append(holder);
    const appended: HTMLScriptElement[] = [];
    const original = document.head.append.bind(document.head);
    const spy = vi.spyOn(document.head, "append").mockImplementation((...nodes) => {
      appended.push(...(nodes as HTMLScriptElement[]));
      original(...nodes);
    });
    const name = tag("nonce");
    await define(
      `<custom-element name="${name}"><script>const s = useState({ v: "n" });</script><p><slot name="#s.v"></slot></p></custom-element>`,
    );
    spy.mockRestore();
    holder.remove();
    expect(appended.some((script) => script.nonce === "n0nce")).toBe(true);
    expect(text(root(mount(name)))).toBe("n");
  });

  test("components without a script render their markup", async () => {
    const name = tag("static");
    await define(`<custom-element name="${name}"><p>static</p></custom-element>`);
    expect(text(root(mount(name)))).toBe("static");
  });

  test("styles and linked stylesheets are adopted", async () => {
    const name = tag("styled");
    const css = URL.createObjectURL(new Blob(["p { margin-top: 7px; }"], { type: "text/css" }));
    await define(`<custom-element name="${name}">
      <link rel="stylesheet" href="${css}">
      <style>p { color: rgb(1, 2, 3); }</style>
      <p>hi</p>
    </custom-element>`);
    const el = mount(name);
    const p = root(el).querySelector("p") as HTMLElement;
    expect(getComputedStyle(p).color).toBe("rgb(1, 2, 3)");
    await vi.waitFor(() => expect(getComputedStyle(p).marginTop).toBe("7px"));
  });

  test("broken stylesheet links warn", async () => {
    const missing = tag("missing-css");
    const failing = tag("failing-css");
    await define(
      `<custom-element name="${missing}"><link rel="stylesheet" href="/does-not-exist-${missing}.css"></custom-element>`,
    );
    await define(
      `<custom-element name="${failing}"><link rel="stylesheet" href="http://127.0.0.1:1/x.css"><link rel="stylesheet"></custom-element>`,
    );
    await vi.waitFor(() => expect(warned(`does-not-exist-${missing}.css: HTTP 404`)).toBe(true));
    await vi.waitFor(() => expect(warned("http://127.0.0.1:1/x.css")).toBe(true));
  });

  test("scripts with imports are assembled as modules", async () => {
    const name = tag("module");
    const module = URL.createObjectURL(
      new Blob(["export const greeting = 'hello';"], { type: "text/javascript" }),
    );
    await define(`<custom-element name="${name}">
      <script>
        import { greeting } from "${module}";
        const s = useState({ greeting });
      </script>
      <p><slot name="#s.greeting"></slot> <slot name="#greeting"></slot></p>
    </custom-element>`);
    expect(text(root(mount(name)))).toBe("hello hello");
  });

  test("a script with a syntax error warns and renders the markup without it", async () => {
    const name = tag("broken");
    const swallow = (event: ErrorEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    window.addEventListener("error", swallow, { capture: true });
    await define(
      `<custom-element name="${name}"><script>const s = 1; const = ;</script><p>x<slot name="#s">-</slot></p></custom-element>`,
    );
    window.removeEventListener("error", swallow, { capture: true });
    expect(warned(`<${name}> has an error in its <script>`)).toBe(true);
    expect(text(root(mount(name)))).toBe("x-");
  });

  test("the hidden attribute hides a component whatever its display", async () => {
    const name = tag("shown");
    await define(
      `<custom-element name="${name}"><style>:host { display: flex; }</style><p>x</p></custom-element>`,
    );
    const el = mount(name) as HTMLElement;
    expect(getComputedStyle(el).display).toBe("flex");
    el.hidden = true;
    expect(getComputedStyle(el).display).toBe("none");
  });

  test("a script whose import fails warns and renders the markup without it", async () => {
    const name = tag("bad-import");
    await define(
      `<custom-element name="${name}"><script>import { nothing } from "./missing-${name}.js";</script><p>static</p></custom-element>`,
    );
    expect(warned(`<${name}> has an error in its <script>`)).toBe(true);
    expect(text(root(mount(name)))).toBe("static");
  });
});

describe("lifecycle", () => {
  const nestedDepth = (el: Element, name: string) => {
    let depth = 0;
    for (
      let node = root(el).querySelector(name);
      node;
      node = node.shadowRoot?.querySelector(name) ?? null
    )
      if (node.shadowRoot) depth++;
    return depth;
  };

  test("a recursive component renders a tree deeper than the call stack allows", async () => {
    const name = tag("tree");
    await define(
      `<custom-element name="${name}"><script>const props = defineProps({ depth: prop.number().default(0) }); const level = useState({ get next() { return props.depth - 1; }, get more() { return props.depth > 0; } });</script><i><slot name="@depth"></slot></i><is-visible when="#level.more"><${name} _depth="#level.next"></${name}></is-visible></custom-element>`,
    );
    const el = mount(name, 'depth="300"');
    await vi.waitFor(() => expect(nestedDepth(el, name)).toBe(300));
    let deepest: Element = el;
    while (root(deepest).querySelector(name))
      deepest = root(deepest).querySelector(name) as Element;
    expect(text(root(deepest))).toBe("0");
    expect(error).not.toHaveBeenCalled();
  });

  test("a component that renders itself without a stop warns and stops", async () => {
    const name = tag("forever");
    await define(`<custom-element name="${name}"><b>again</b><${name}></${name}></custom-element>`);
    const el = mount(name);
    await vi.waitFor(() =>
      expect(warned("is nested 1000 deep. Stop its recursion with a condition.")).toBe(true),
    );
    expect(nestedDepth(el, name)).toBe(1000);
    expect(
      warn.mock.calls.filter((call) => String(call[1]).includes("is nested 1000 deep")),
    ).toHaveLength(1);
    expect(error).not.toHaveBeenCalled();
  });

  test("a deep component removed before its deferred setup is not set up", async () => {
    const name = tag("gone");
    await define(
      `<custom-element name="${name}"><script>const props = defineProps({ depth: prop.number().default(0) }); const level = useState({ get next() { return props.depth - 1; }, get more() { return props.depth > 0; } });</script><is-visible when="#level.more"><${name} _depth="#level.next"></${name}></is-visible></custom-element>`,
    );
    const el = mount(name, 'depth="40"');
    const deepest = () => {
      let node: Element = el;
      while (node.shadowRoot?.querySelector(name))
        node = node.shadowRoot.querySelector(name) as Element;
      return node;
    };
    const waiting = deepest();
    expect(waiting.shadowRoot).toBeNull();
    el.remove();
    await tick();
    expect(waiting.shadowRoot).toBeNull();
    expect(instances.get(waiting)).toBeUndefined();
  });

  test("setup errors are reported and the markup still renders", async () => {
    const name = tag("throws");
    await define(
      `<custom-element name="${name}"><script>const s = useState({ v: 1 }); throw new Error("setup failed");</script><button onclick="nothing()">b<slot name="#s.v">-</slot></button></custom-element>`,
    );
    const el = mount(name);
    expect(error).toHaveBeenCalled();
    expect(text(root(el))).toBe("b-");
    (root(el).querySelector("button") as HTMLButtonElement).click();
  });

  test("onConnected, onDisconnected, host, refs, signal and internals", async () => {
    const name = tag("hooks");
    const log: string[] = [];
    (window as unknown as { hookLog: string[] }).hookLog = log;
    await define(`<custom-element name="${name}">
      <script>
        const log = window.hookLog;
        onConnected(() => {
          log.push("connected:" + refs.box.localName + ":" + host.localName + ":" + (internals instanceof ElementInternals));
          signal.addEventListener("abort", () => log.push("aborted"));
          return () => log.push("cleanup");
        });
        onConnected(() => "not a function");
        onDisconnected(() => log.push("disconnected"));
      </script>
      <div ref="box"></div>
    </custom-element>`);
    const el = mount(name);
    expect(log).toEqual([`connected:div:${name}:true`]);
    el.remove();
    await tick();
    expect(log).toEqual([`connected:div:${name}:true`, "disconnected", "aborted", "cleanup"]);
  });

  test("moving an element keeps its state, removing it tears it down", async () => {
    const name = tag("move");
    await define(`<custom-element name="${name}">
      <script>const s = useState({ n: 0 }); function inc() { s.n++; }</script>
      <button onclick="inc()"><slot name="#s.n"></slot></button>
    </custom-element>`);
    const host = render(`<div id="a"><${name}></${name}></div><div id="b"></div>`);
    const el = host.querySelector(name) as HTMLElement;
    (root(el).querySelector("button") as HTMLButtonElement).click();
    await tick();
    (host.querySelector("#b") as HTMLElement).append(el);
    await tick();
    expect(text(root(el))).toBe("1");
    expect(instances.has(el)).toBe(true);
    el.remove();
    await tick();
    expect(instances.has(el)).toBe(false);
    expect(root(el).childNodes).toHaveLength(0);
    host.append(el);
    await tick();
    expect(text(root(el))).toBe("0");
  });

  test("elements inside a page definition are not mounted", async () => {
    const name = tag("inert");
    await define(`<custom-element name="${name}"><p>x</p></custom-element>`);
    const holder = render(`<custom-element name="later-x"><${name}></${name}></custom-element>`);
    expect((holder.querySelector(name) as HTMLElement).shadowRoot).toBeNull();
  });

  test("role, delegates-focus and form association", async () => {
    const name = tag("field");
    const log: string[] = [];
    (window as unknown as { formLog: string[] }).formLog = log;
    await define(`<custom-element name="${name}" form-associated role="switch" delegates-focus>
      <script>
        const props = defineProps({ checked: prop.boolean().reflect() });
        observe(() => internals.setFormValue(props.checked ? "on" : null));
        onFormReset(() => window.formLog.push("reset"));
        onFormDisabled((disabled) => window.formLog.push("disabled:" + disabled));
        onFormStateRestore((state, mode) => window.formLog.push("restore:" + state + ":" + mode));
      </script>
      <button>toggle</button>
    </custom-element>`);
    const form = render(`<form><${name} name="n" checked></${name}></form>`).querySelector(
      "form",
    ) as HTMLFormElement;
    const field = form.querySelector(name) as HTMLElement & {
      formStateRestoreCallback(s: unknown, m: string): void;
    };
    expect(new FormData(form).get("n")).toBe("on");
    expect(root(field).delegatesFocus).toBe(true);
    form.reset();
    const fieldset = document.createElement("fieldset");
    form.append(fieldset);
    fieldset.append(field);
    fieldset.disabled = true;
    field.formStateRestoreCallback("on", "restore");
    expect(log).toEqual(["reset", "disabled:true", "restore:on:restore"]);
    const detached = document.createElement(name) as HTMLElement & {
      formResetCallback(): void;
      formDisabledCallback(d: boolean): void;
      formStateRestoreCallback(s: unknown, m: string): void;
    };
    detached.formResetCallback();
    detached.formDisabledCallback(true);
    detached.formStateRestoreCallback("x", "autocomplete");
    expect(log).toHaveLength(3);
  });

  test("loading state is exposed as :state(loading)", async () => {
    const name = tag("loading");
    await define(`<custom-element name="${name}"><p></p></custom-element>`);
    const el = mount(name);
    const instance = instances.get(el);
    instance?.setLoading(1);
    expect(el.matches(":state(loading)")).toBe(true);
    instance?.setLoading(-1);
    expect(el.matches(":state(loading)")).toBe(false);
  });
});

describe("defineProps", () => {
  const definePropsComponent = async () => {
    const name = tag("props");
    await define(`<custom-element name="${name}">
      <script>
        const props = defineProps({
          heading: prop.string().default("Todos"),
          count: prop.number().min(0).default(0),
          open: prop.boolean().reflect(),
          tags: prop.array(prop.string()).default([]),
          variant: prop.enum(["a", "b"]).attribute("data-variant").reflect(),
        });
        function tryWrite() { props.count = 99; }
      </script>
      <h1><slot name="@heading"></slot></h1>
      <p><slot name="@count"></slot></p>
      <button onclick="tryWrite()">w</button>
    </custom-element>`);
    return name;
  };

  test("parses attributes, falls back on invalid values and stays reactive", async () => {
    const name = await definePropsComponent();
    const el = mount(name, `heading="Groceries" count="-5"`) as HTMLElement &
      Record<string, unknown>;
    expect(text(root(el).querySelector("h1"))).toBe("Groceries");
    expect(text(root(el).querySelector("p"))).toBe("0");
    expect(warned(`<${name}> prop "count" must be at least 0`)).toBe(true);
    el.setAttribute("count", "3");
    await tick();
    expect(text(root(el).querySelector("p"))).toBe("3");
    el.count = 4;
    await tick();
    expect(text(root(el).querySelector("p"))).toBe("4");
    expect(el.getAttribute("count")).toBe("3");
    expect(el.heading).toBe("Groceries");
  });

  test("reflects to attributes and keeps properties set before upgrade", async () => {
    const name = await definePropsComponent();
    const el = document.createElement("div");
    el.innerHTML = `<${name}></${name}>`;
    const child = el.firstElementChild as HTMLElement & Record<string, unknown>;
    const early = document.createElement(name) as HTMLElement & Record<string, unknown>;
    early.tags = ["x"];
    render("").append(early, el);
    child.open = true;
    child.variant = "b";
    expect(child.hasAttribute("open")).toBe(true);
    expect(child.getAttribute("data-variant")).toBe("b");
    child.open = false;
    expect(child.hasAttribute("open")).toBe(false);
    child.setAttribute("open", "");
    await tick();
    expect(child.open).toBe(true);
    expect(early.tags).toEqual(["x"]);
  });

  test("props written inside the component go through validation", async () => {
    const name = await definePropsComponent();
    const el = mount(name) as HTMLElement & Record<string, unknown>;
    (root(el).querySelector("button") as HTMLButtonElement).click();
    await tick();
    expect(el.count).toBe(99);
    expect(text(root(el).querySelector("p"))).toBe("99");
  });

  test("calling defineProps twice is an error", async () => {
    const name = tag("twice");
    await define(
      `<custom-element name="${name}"><script>defineProps({}); defineProps({});</script></custom-element>`,
    );
    mount(name);
    expect(error).toHaveBeenCalledWith(
      "[realm]",
      expect.objectContaining({ message: `<${name}> called defineProps more than once.` }),
    );
  });

  test("removing an element removes its property accessors", async () => {
    const name = await definePropsComponent();
    const el = mount(name, `heading="H"`) as HTMLElement & Record<string, unknown>;
    el.remove();
    await tick();
    expect(Object.hasOwn(el, "heading")).toBe(false);
  });
});

describe("scope", () => {
  test("values resolve in the owner first, then in parent components", async () => {
    const shell = tag("shell");
    const nav = tag("nav");
    const card = tag("card");
    await define(`
      <custom-element name="${nav}">
        <script>const local = useState({ label: "nav" });</script>
        <p><slot name="#session.user">Guest</slot> <slot name="#local.label"></slot></p>
        <button onclick="logout()">out</button>
        <span><slot name="#nowhere">none</slot></span>
      </custom-element>
      <custom-element name="${card}"><div><slot></slot></div></custom-element>
      <custom-element name="${shell}">
        <script>
          const session = useState({ user: "Ana" });
          const local = useState({ label: "shell" });
          function logout() { session.user = ""; }
        </script>
        <${nav}></${nav}>
        <${card}><slot name="#local.label"></slot></${card}>
      </custom-element>`);
    const el = mount(shell);
    const navEl = root(el).querySelector(nav) as HTMLElement;
    expect(text(root(navEl).querySelector("p"))).toBe("Ana nav");
    expect(text(root(navEl).querySelector("span"))).toBe("none");
    expect(warned(`<${nav}> reads "session" from <${shell}>`)).toBe(true);
    expect(warned(`<${nav}> "#nowhere" is not defined`)).toBe(true);
    const slotted = root(el).querySelector(`${card} slot`) as HTMLSlotElement;
    expect(slotted.textContent).toBe("shell");
    (root(navEl).querySelector("button") as HTMLButtonElement).click();
    await tick();
    expect(text(root(navEl).querySelector("p"))).toBe("Guest nav");
  });

  test("an explicit lookup through a shadow root reads the parent without a warning", async () => {
    const game = tag("game");
    const hero = tag("hero");
    const sprite = tag("sprite");
    await define(`
      <custom-element name="${sprite}">
        <script>const world = lookup("world");</script>
        <p><slot name="#world.name"></slot></p>
      </custom-element>
      <custom-element name="${hero}"><${sprite}></${sprite}></custom-element>
      <custom-element name="${game}">
        <script>const world = { name: "kaplay" };</script>
        <slot></slot>
      </custom-element>`);
    const el = document.createElement(game);
    el.innerHTML = `<${hero}></${hero}>`;
    document.body.append(el);
    await tick();
    const spriteEl = root(el.querySelector(hero) as HTMLElement).querySelector(
      sprite,
    ) as HTMLElement;
    expect(text(root(spriteEl).querySelector("p"))).toBe("kaplay");
    expect(warned(`<${sprite}> reads "world"`)).toBe(false);
    el.remove();
  });

  test("slotted content reads from a component that wraps its slot", async () => {
    const game = tag("game");
    const scene = tag("scene");
    const floater = tag("floater");
    const sprite = tag("sprite");
    await define(`
      <custom-element name="${sprite}">
        <script>const world = lookup("world");</script>
        <p><slot name="#world.name"></slot></p>
      </custom-element>
      <custom-element name="${scene}">
        <script>const world = { name: "floater scene" };</script>
        <slot></slot>
      </custom-element>
      <custom-element name="${floater}"><${scene}><slot></slot></${scene}></custom-element>
      <custom-element name="${game}">
        <script>const world = { name: "game" };</script>
        <${floater}><${sprite}></${sprite}></${floater}>
      </custom-element>`);
    const el = mount(game);
    const spriteEl = root(el).querySelector(sprite) as HTMLElement;
    expect(text(root(spriteEl).querySelector("p"))).toBe("floater scene");
  });

  test("handlers in slotted content resolve from the component they are placed in", async () => {
    const sheet = tag("sheet");
    const dialog = tag("dialog");
    const close = tag("close");
    await define(`
      <custom-element name="${close}"><button onclick="close()">x</button></custom-element>
      <custom-element name="${dialog}">
        <script>const state = useState({ closed: false }); function close() { state.closed = true; }</script>
        <slot></slot>
      </custom-element>
      <custom-element name="${sheet}">
        <script>const state = useState({ closed: false }); function close() { state.closed = true; }</script>
        <${dialog}><slot></slot></${dialog}>
      </custom-element>`);
    const el = document.createElement(sheet);
    el.innerHTML = `<${close}></${close}>`;
    document.body.append(el);
    await tick();
    (
      root(el.querySelector(close) as HTMLElement).querySelector("button") as HTMLButtonElement
    ).click();
    const states = [el, root(el).querySelector(dialog) as HTMLElement].map(
      (host) => (instances.get(host)?.get("state") as { closed: boolean } | undefined)?.closed,
    );
    expect(states).toEqual([true, false]);
    el.remove();
  });

  test("a handler that reads an undeclared name from a parent still warns", async () => {
    const shell = tag("shell");
    const child = tag("child");
    await define(`
      <custom-element name="${child}"><button onclick="save()">save</button></custom-element>
      <custom-element name="${shell}">
        <script>const saved = useState({ count: 0 }); function save() { saved.count++; }</script>
        <${child}></${child}>
      </custom-element>`);
    const el = mount(shell);
    const childEl = root(el).querySelector(child) as HTMLElement;
    (root(childEl).querySelector("button") as HTMLButtonElement).click();
    expect(warned(`<${child}> reads "save" from <${shell}>`)).toBe(true);
  });

  test("handler names that no component defines fall back to globals", async () => {
    const name = tag("globals");
    (window as unknown as { realmGlobalFn: () => void }).realmGlobalFn = vi.fn();
    await define(
      `<custom-element name="${name}"><button onclick="realmGlobalFn(Math.max(1, 2))">b</button></custom-element>`,
    );
    const el = mount(name);
    (root(el).querySelector("button") as HTMLButtonElement).click();
    expect((window as unknown as { realmGlobalFn: () => void }).realmGlobalFn).toHaveBeenCalledWith(
      2,
    );
  });
});

test("a definition's slot attribute places its elements in that slot of their parent", async () => {
  const parent = tag("panel");
  const title = tag("panel-title");
  await define(`
    <custom-element name="${parent}"><header><slot name="title"></slot></header><main><slot></slot></main></custom-element>
    <custom-element name="${title}" slot="title"><h2><slot></slot></h2></custom-element>`);
  const host = render(
    `<${parent}><${title} id="auto">Title</${title}><${title} id="own" slot="other">Kept</${title}><p>Body</p></${parent}>`,
  );
  const auto = host.querySelector("#auto") as HTMLElement;
  expect(auto.slot).toBe("title");
  expect(auto.assignedSlot?.name).toBe("title");
  expect((host.querySelector("#own") as HTMLElement).slot).toBe("other");
});

test("compound parts call their parent's functions and show its state without a script", async () => {
  const parent = tag("toggle");
  const button = tag("toggle-button");
  await define(`
    <custom-element name="${parent}"><script>
      const toggle = useState({ open: false });
      function flip() { toggle.open = !toggle.open; }
    </script><slot name="toggle"></slot></custom-element>
    <custom-element name="${button}" slot="toggle"><button onclick="flip()"><slot name="#toggle.open"></slot></button></custom-element>`);
  const host = render(`<${parent}><${button}></${button}></${parent}>`);
  await tick();
  const inner = root(host.querySelector(button)).querySelector("button") as HTMLButtonElement;
  expect(warn.mock.calls.some((call) => String(call[1]).includes(`<${button}> reads`))).toBe(false);
  expect(text(inner)).toBe("false");
  inner.click();
  await tick();
  expect(text(inner)).toBe("true");
});

test("definitions without a script or handlers insert no script", async () => {
  const name = tag("static");
  const inserted: Node[] = [];
  const observer = new MutationObserver((records) => {
    for (const record of records) inserted.push(...record.addedNodes);
  });
  observer.observe(document.head, { childList: true });
  await define(
    `<custom-element name="${name}"><style>p { color: red; }</style><p>static</p></custom-element>`,
  );
  await tick();
  observer.disconnect();
  expect(inserted.filter((node) => node.nodeName === "SCRIPT")).toEqual([]);
  expect(text(root(mount(name)))).toBe("static");
});

test("a part whose parent finishes setting up later waits for it and reads its state", async () => {
  const parent = tag("late-parent");
  const child = tag("early-child");
  const host = render(`<${parent}><${child}></${child}></${parent}>`);
  const removed = render(`<${parent}><${child}></${child}></${parent}>`);
  const define_ = define(`
    <custom-element name="${parent}">
      <script>
        import label from "data:text/javascript,await new Promise((r) => setTimeout(r, 150)); export default 7";
        const box = useState({ label });
      </script>
      <slot></slot>
    </custom-element>
    <custom-element name="${child}"><p><slot name="#box.label">missing</slot></p></custom-element>`);
  const gone = removed.querySelector(child) as Element;
  await new Promise((resolve) => setTimeout(resolve, 30));
  gone.remove();
  await define_;
  await tick();
  expect(gone.shadowRoot).toBe(null);
  expect(text(root(host.querySelector(child)).querySelector("p"))).toBe("7");
  expect(warned(`<${child}> "#box.label" is not defined`)).toBe(false);
  expect(warned(`<${child}> reads`)).toBe(false);
});

test("custom elements inside a component stay hidden until they are defined", async () => {
  const outer = tag("outer");
  const inner = tag("inner");
  await define(
    `<custom-element name="${outer}"><${inner}><p>plain</p></${inner}><is-visible when="#s.on"><span>shown</span></is-visible><script>const s = useState({ on: true });</script></custom-element>`,
  );
  const el = mount(outer);
  const pending = root(el).querySelector(inner) as Element;
  expect(getComputedStyle(pending).visibility).toBe("hidden");
  expect(getComputedStyle(root(el).querySelector("span") as Element).visibility).toBe("visible");
  await define(`<custom-element name="${inner}"><slot></slot></custom-element>`);
  expect(getComputedStyle(pending).visibility).toBe("visible");
});
