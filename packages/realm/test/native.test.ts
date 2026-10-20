import { expect, test } from "vitest";

test("slot fallback content renders through nested slot projection", async () => {
  class Outer extends HTMLElement {
    connectedCallback() {
      const root = this.attachShadow({ mode: "open" });
      root.innerHTML = `<x-native-inner><slot name="#value">fallback</slot></x-native-inner>`;
      (root.querySelector("slot") as HTMLSlotElement).textContent = "42";
    }
  }
  class Inner extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: "open" }).innerHTML = `<span><slot></slot></span>`;
    }
  }
  customElements.define("x-native-inner", Inner);
  customElements.define("x-native-outer", Outer);
  const el = document.createElement("x-native-outer");
  document.body.append(el);
  const inner = el.shadowRoot?.querySelector("x-native-inner") as HTMLElement;
  const span = inner.shadowRoot?.querySelector("span") as HTMLElement;
  const slot = span.querySelector("slot") as HTMLSlotElement;
  expect(
    slot
      .assignedNodes({ flatten: true })
      .map((n) => n.textContent)
      .join(""),
  ).toBe("42");
  expect(span.getBoundingClientRect().width).toBeGreaterThan(0);
  el.remove();
});

test("a script or style with a non-standard type is inert", async () => {
  const iframe = document.createElement("iframe");
  iframe.srcdoc = `<p id="p">x</p><script type="realm">window.ran = true</script><style type="realm">p { color: rgb(255, 0, 0) }</style>`;
  const loaded = new Promise((r) => iframe.addEventListener("load", r));
  document.body.append(iframe);
  await loaded;
  const win = iframe.contentWindow as unknown as { ran?: boolean };
  const doc = iframe.contentDocument as Document;
  expect(win.ran).toBeUndefined();
  expect(getComputedStyle(doc.getElementById("p") as Element).color).not.toBe("rgb(255, 0, 0)");
  iframe.remove();
});
