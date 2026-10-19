import { expect, test } from "vitest";
import css from "../public/realm.css?raw";

test("realm.css keeps undefined components hidden until they are defined", async () => {
  const iframe = document.createElement("iframe");
  iframe.srcdoc = `<style>${css}</style><late-card><p id="raw">raw content</p></late-card><custom-element name="x-y"><p id="def">definition</p></custom-element>`;
  const loaded = new Promise((r) => iframe.addEventListener("load", r));
  document.body.append(iframe);
  await loaded;
  const doc = iframe.contentDocument as Document;
  const win = iframe.contentWindow as Window & typeof globalThis;
  const raw = doc.getElementById("raw") as Element;
  expect(win.getComputedStyle(raw).visibility).toBe("hidden");
  expect((doc.getElementById("def") as HTMLElement).getClientRects()).toHaveLength(0);
  win.customElements.define("late-card", class extends win.HTMLElement {});
  expect(win.getComputedStyle(raw).visibility).toBe("visible");
  iframe.remove();
});
