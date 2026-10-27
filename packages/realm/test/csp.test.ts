import { afterEach, expect, test } from "vitest";
import { parseSource } from "../src/sanitize";

const frames: HTMLIFrameElement[] = [];
afterEach(() => {
  for (const frame of frames.splice(0)) frame.remove();
});

const COUNTER = `<custom-element name="click-counter">
  <script>
    const counter = useState({ count: 0 });
    function add() { counter.count++; }
  </script>
  <button onclick="add()" title="turn on x" onkeydown='add()'>Clicked <slot name="#counter.count">0</slot></button>
</custom-element>`;

const strictPage = async (body: string) => {
  const frame = document.createElement("iframe");
  frame.srcdoc = `<!doctype html><meta http-equiv="Content-Security-Policy" content="script-src 'nonce-r4nd0m' 'strict-dynamic'">
<script nonce="r4nd0m">window.violations = []; document.addEventListener("securitypolicyviolation", (e) => violations.push(e.violatedDirective));</script>
<script type="module" nonce="r4nd0m" src="${new URL("../src/auto.ts", import.meta.url).href}"></script>
<body>${body}</body>`;
  frames.push(frame);
  document.body.append(frame);
  const win = frame.contentWindow as Window & typeof globalThis & { violations: string[] };
  const shadow = () => win.document.querySelector("click-counter")?.shadowRoot;
  await expect.poll(() => shadow()?.querySelector("button"), { timeout: 10_000 }).toBeTruthy();
  return { win, shadow: shadow() as ShadowRoot };
};

test("imported definitions with handlers log no violation under a strict nonce policy", async () => {
  const url = URL.createObjectURL(new Blob([COUNTER], { type: "text/html" }));
  const { win, shadow } = await strictPage(
    `<import-element from="${url}"></import-element><click-counter></click-counter>`,
  );
  const button = shadow.querySelector("button") as HTMLButtonElement;
  button.click();
  button.dispatchEvent(new win.KeyboardEvent("keydown"));
  await expect.poll(() => shadow.querySelector("slot")?.textContent).toBe("2");
  expect(button.getAttribute("title")).toBe("turn on x");
  expect(win.violations).toEqual([]);
  URL.revokeObjectURL(url);
});

test("page definitions with realm:on handlers log no violation under a strict nonce policy", async () => {
  const inline = COUNTER.replace("<script>", '<script type="realm">').replaceAll(
    " on",
    " realm:on",
  );
  const { win, shadow } = await strictPage(`${inline}<click-counter></click-counter>`);
  (shadow.querySelector("button") as HTMLButtonElement).click();
  await expect.poll(() => shadow.querySelector("slot")?.textContent).toBe("1");
  expect(win.document.querySelector("custom-element")).toBeNull();
  expect(win.violations).toEqual([]);
});

test("handler attributes are renamed before parsing, outside scripts and attribute values", () => {
  const doc = parseSource(
    `<p onclick="a()" data-x='b onclick=c' ONINPUT=d on>text onclick=e</p><script>const html = '<b onclick="f()">';</script>`,
  );
  const p = doc.querySelector("p") as Element;
  expect(p.getAttributeNames()).toEqual(["realm:onclick", "data-x", "realm:oninput", "on"]);
  expect(p.getAttribute("data-x")).toBe("b onclick=c");
  expect(p.textContent).toBe("text onclick=e");
  expect(doc.querySelector("script")?.textContent).toContain(`<b onclick="f()">`);
});
