import { defineComponent, flush } from "@realmorg/realm";
import { afterAll, afterEach } from "vitest";
import { commands } from "vitest/browser";
import theme from "../theme.css?raw";

const files = import.meta.glob("../components/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const sheet = new CSSStyleSheet();
sheet.replaceSync(theme);
document.adoptedStyleSheets = [sheet];

declare module "vitest/browser" {
  interface BrowserCommands {
    startComponentCoverage(): Promise<void>;
    takeComponentCoverage(): Promise<void>;
    reduceMotion(reduce: boolean): Promise<void>;
  }
}

await commands.startComponentCoverage();

export const ready = Promise.all(
  Object.entries(files).flatMap(([path, html]) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return [...doc.querySelectorAll("custom-element")].map((el) =>
      defineComponent(el, new URL(path, location.href).href, false),
    );
  }),
);

const mounted: Element[] = [];

export const render = async (html: string) => {
  await ready;
  const host = document.createElement("div");
  host.innerHTML = html;
  document.body.append(host);
  mounted.push(host);
  await tick();
  return host;
};

export const tick = async () => {
  await Promise.resolve();
  flush();
  await new Promise((resolve) => setTimeout(resolve));
  flush();
};

export const shadow = (el: Element | null) => (el as Element).shadowRoot as ShadowRoot;
export const part = <T extends Element = HTMLElement>(el: Element | null, name: string) =>
  shadow(el).querySelector(`[part~="${name}"]`) as T;

afterAll(() => commands.takeComponentCoverage());

afterEach(() => {
  for (const el of mounted.splice(0)) el.remove();
});
