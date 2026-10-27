import { expect, test } from "vitest";
import css from "../public/realm.css?raw";

const page = async (body: string) => {
  const iframe = document.createElement("iframe");
  iframe.srcdoc = `<style>${css}</style>${body}`;
  const loaded = new Promise((r) => iframe.addEventListener("load", r));
  document.body.append(iframe);
  await loaded;
  const doc = iframe.contentDocument as Document;
  const win = iframe.contentWindow as Window & typeof globalThis;
  const visibility = (id: string) =>
    win.getComputedStyle(doc.getElementById(id) as Element).visibility;
  return { iframe, doc, win, visibility };
};

test("realm.css keeps undefined components hidden until they are defined", async () => {
  const { iframe, doc, win, visibility } = await page(
    `<late-card><p id="raw">raw content</p></late-card><custom-element name="x-y"><p id="def">definition</p></custom-element>`,
  );
  expect(visibility("raw")).toBe("hidden");
  expect((doc.getElementById("def") as HTMLElement).getClientRects()).toHaveLength(0);
  win.customElements.define("late-card", class extends win.HTMLElement {});
  expect(visibility("raw")).toBe("visible");
  iframe.remove();
});

test("realm.css hides undefined elements only while REALM starts or imports", async () => {
  const { iframe, doc, win, visibility } = await page(
    `<import-element from="x.html"></import-element><app-root><p id="app">app</p></app-root>`,
  );
  expect(visibility("app")).toBe("hidden");
  let internals: ElementInternals | undefined;
  win.customElements.define(
    "import-element",
    class extends win.HTMLElement {
      constructor() {
        super();
        internals = this.attachInternals();
      }
    },
  );
  expect(visibility("app")).toBe("visible");
  internals?.states.add("loading");
  expect(visibility("app")).toBe("hidden");
  internals?.states.delete("loading");
  expect(visibility("app")).toBe("visible");
  doc.body.append(doc.createElement("custom-element"));
  expect(visibility("app")).toBe("hidden");
  iframe.remove();
});

test("realm.css leaves undefined elements visible on a page without REALM work", async () => {
  const { iframe, visibility } = await page(`<app-root><p id="app">app</p></app-root>`);
  expect(visibility("app")).toBe("visible");
  iframe.remove();
});
