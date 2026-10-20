import { afterEach } from "vitest";
import { defineComponent } from "../src/definition";
import { flush } from "../src/reactivity";

let counter = 0;
export const tag = (base = "x") => `${base}-${++counter}-${Math.random().toString(36).slice(2, 7)}`;

export const define = async (html: string, base = location.href) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  await Promise.all(
    [...doc.querySelectorAll("custom-element")].map((el) => defineComponent(el, base, false)),
  );
};

const mounted: Element[] = [];

export const render = (html: string) => {
  const host = document.createElement("div");
  host.innerHTML = html;
  document.body.append(host);
  mounted.push(host);
  return host;
};

export const tick = async () => {
  await Promise.resolve();
  flush();
  await new Promise((resolve) => setTimeout(resolve));
  flush();
};

export const root = (el: Element | null) => (el as Element).shadowRoot as ShadowRoot;

export const text = (el: Element | ShadowRoot | null) =>
  ((el as Element).textContent ?? "").replace(/\s+/g, " ").trim();

export const slotText = (el: ParentNode, selector = "slot") =>
  [...el.querySelectorAll<HTMLSlotElement>(selector)].map((slot) => slot.textContent).join("|");

afterEach(() => {
  for (const el of mounted.splice(0)) el.remove();
});
