// Native parity checks modelled on WPT html/webappapis/scripting/events (event handler attributes).
import { describe, expect, test, vi } from "vitest";
import { define, render, root, tag, tick } from "./helpers";

const dialogComponent = async () => {
  const name = tag("dialog");
  await define(`<custom-element name="${name}">
    <script>
      function close() {
        const allowed = host.dispatchEvent(new CustomEvent("requestclose", { bubbles: true, composed: true, cancelable: true, detail: { source: "button" } }));
        if (allowed) host.setAttribute("closed", "");
      }
      function ping() { host.dispatchEvent(new Event("click")); }
    </script>
    <button onclick="close()">x</button>
  </custom-element>`);
  return name;
};

describe("custom events", () => {
  test("parent components handle a child's custom event by name", async () => {
    const child = await dialogComponent();
    const parent = tag("parent");
    await define(`<custom-element name="${parent}">
      <script>const s = useState({ last: "" }); function keepOpen(event) { s.last = event.detail.source; event.preventDefault(); }</script>
      <${child} onrequestclose="keepOpen(event)"></${child}>
      <p><slot name="#s.last"></slot></p>
    </custom-element>`);
    const el = render(`<${parent}></${parent}>`).querySelector(parent) as HTMLElement;
    const dialog = root(el).querySelector(child) as HTMLElement;
    (root(dialog).querySelector("button") as HTMLButtonElement).click();
    await tick();
    expect(root(el).querySelector("p")?.textContent).toBe("button");
    expect(dialog.hasAttribute("closed")).toBe(false);
  });

  test("on a plain page the attribute holds JavaScript and stays in sync with the property", async () => {
    const name = await dialogComponent();
    const host = render(
      `<${name} onrequestclose="window.pageLog.push('attr:' + event.detail.source); return false"></${name}>`,
    );
    const log: string[] = [];
    (window as unknown as { pageLog: string[] }).pageLog = log;
    const dialog = host.querySelector(name) as HTMLElement & { onrequestclose: unknown };
    const button = root(dialog).querySelector("button") as HTMLButtonElement;
    button.click();
    expect(log).toEqual(["attr:button"]);
    expect(dialog.hasAttribute("closed")).toBe(false);
    expect(typeof dialog.onrequestclose).toBe("function");

    dialog.onrequestclose = (event: CustomEvent) => log.push(`prop:${event.detail.source}`);
    button.click();
    expect(log).toEqual(["attr:button", "prop:button"]);
    expect(dialog.hasAttribute("closed")).toBe(true);

    dialog.onrequestclose = "not a function";
    expect(dialog.onrequestclose).toBeNull();
    dialog.setAttribute("onrequestclose", "window.pageLog.push('again')");
    button.click();
    dialog.setAttribute("onrequestclose", "window.pageLog.push('again')");
    dialog.removeAttribute("onrequestclose");
    button.click();
    expect(log).toEqual(["attr:button", "prop:button", "again"]);
    expect(dialog.onrequestclose).toBeNull();

    const listener = vi.fn();
    dialog.addEventListener("requestclose", listener);
    dialog.onrequestclose = () => {};
    button.click();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test("handler attributes set before connection are compiled on connect", async () => {
    const name = await dialogComponent();
    const el = document.createElement(name) as HTMLElement & { onrequestclose: unknown };
    el.setAttribute("onrequestclose", "window.early = true");
    expect(el.onrequestclose).toBeNull();
    render("").append(el);
    expect(typeof el.onrequestclose).toBe("function");
    el.setAttribute("title", "ignored attribute");
  });

  test("a handler attribute with a syntax error is ignored", async () => {
    const name = await dialogComponent();
    const swallow = (event: ErrorEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    window.addEventListener("error", swallow, { capture: true });
    const dialog = render(
      `<${name} onrequestclose="this is not javascript"></${name}>`,
    ).querySelector(name) as HTMLElement & { onrequestclose: unknown };
    window.removeEventListener("error", swallow, { capture: true });
    expect(dialog.onrequestclose).toBeNull();
  });

  test("native handler names are not redefined", async () => {
    const name = await dialogComponent();
    const ctor = customElements.get(name) as unknown as { observedAttributes: string[] };
    expect(ctor.observedAttributes).toEqual(["onrequestclose"]);
  });
});

test("page handler attributes work for events sent with dispatch", async () => {
  const name = tag("pinger");
  await define(`<custom-element name="${name}">
    <script>function ping() { dispatch("ping", 7); }</script>
    <button onclick="ping()"></button></custom-element>`);
  const log: number[] = [];
  (window as unknown as { pingLog: number[] }).pingLog = log;
  const el = render(`<${name} onping="window.pingLog.push(event.detail)"></${name}>`).querySelector(
    name,
  ) as Element;
  (root(el).querySelector("button") as HTMLButtonElement).click();
  expect(log).toEqual([7]);
});
