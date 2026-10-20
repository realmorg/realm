import { describe, expect, test } from "vitest";
import realm from "../../realm/src/auto.ts?url";

const files = import.meta.glob("../components/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const usages: Record<string, string> = {
  "alert-dialog": `
    <ui-alert-dialog open>
      <ui-alert-dialog-trigger>Delete</ui-alert-dialog-trigger>
      <ui-alert-dialog-header>
        <ui-alert-dialog-title>Are you sure?</ui-alert-dialog-title>
        <ui-alert-dialog-description>This cannot be undone.</ui-alert-dialog-description>
      </ui-alert-dialog-header>
      <ui-alert-dialog-footer>
        <ui-alert-dialog-cancel>Cancel</ui-alert-dialog-cancel>
        <ui-alert-dialog-action>Continue</ui-alert-dialog-action>
      </ui-alert-dialog-footer>
    </ui-alert-dialog>`,
  carousel: `
    <ui-carousel>
      <ui-carousel-content>
        <ui-carousel-item>One</ui-carousel-item>
        <ui-carousel-item>Two</ui-carousel-item>
      </ui-carousel-content>
      <ui-carousel-previous></ui-carousel-previous>
      <ui-carousel-next></ui-carousel-next>
    </ui-carousel>`,
  sheet: `
    <ui-sheet open>
      <ui-sheet-trigger>Open</ui-sheet-trigger>
      <ui-sheet-header>
        <ui-sheet-title>Edit profile</ui-sheet-title>
        <ui-sheet-description>Make changes here.</ui-sheet-description>
      </ui-sheet-header>
      <ui-sheet-footer><ui-sheet-close>Save</ui-sheet-close></ui-sheet-footer>
    </ui-sheet>`,
  sidebar: `
    <ui-sidebar-layout>
      <ui-sidebar>
        <ui-sidebar-header>Acme</ui-sidebar-header>
        <ui-sidebar-content>
          <ui-sidebar-group>
            <ui-sidebar-group-label>Pages</ui-sidebar-group-label>
            <ui-sidebar-menu>
              <ui-sidebar-menu-item>
                <ui-sidebar-menu-button href="#home">Home</ui-sidebar-menu-button>
                <ui-sidebar-menu-badge>3</ui-sidebar-menu-badge>
              </ui-sidebar-menu-item>
            </ui-sidebar-menu>
          </ui-sidebar-group>
        </ui-sidebar-content>
        <ui-sidebar-footer>Settings</ui-sidebar-footer>
      </ui-sidebar>
      <ui-sidebar-inset><ui-sidebar-trigger></ui-sidebar-trigger>Content</ui-sidebar-inset>
    </ui-sidebar-layout>`,
  "toggle-group": `
    <ui-toggle-group type="single">
      <ui-toggle value="bold">B</ui-toggle>
      <ui-toggle value="italic">I</ui-toggle>
    </ui-toggle-group>`,
};

const tagsOf = (html: string) =>
  [...html.matchAll(/<custom-element name="([^"]+)"/g)].map((match) => match[1] as string);

const usageOf = (name: string, tags: string[]) => {
  const [main, ...parts] = tags;
  return (
    usages[name] ?? `<${main}>${parts.map((tag) => `<${tag}>Text</${tag}>`).join("")}</${main}>`
  );
};

const undefinedTags = (frame: HTMLIFrameElement) => {
  const registry = (frame.contentWindow as Window & typeof globalThis).customElements;
  const missing = new Set<string>();
  const walk = (root: ParentNode) => {
    for (const el of root.querySelectorAll("*")) {
      if (el.localName.startsWith("ui-") && !registry.get(el.localName)) missing.add(el.localName);
      if (el.shadowRoot) walk(el.shadowRoot);
    }
  };
  walk((frame.contentDocument as Document).body);
  return [...missing];
};

const shadowHosts = (frame: HTMLIFrameElement) =>
  [...(frame.contentDocument as Document).body.querySelectorAll("*")].filter(
    (el) => el.localName.startsWith("ui-") && el.shadowRoot,
  ).length;

const load = (name: string, usage: string) =>
  new Promise<HTMLIFrameElement>((resolve) => {
    const frame = document.createElement("iframe");
    frame.srcdoc = `<!doctype html>
      <script type="module" src="${realm}"></script>
      <import-element from="${new URL(`/components/${name}.html`, location.href).href}"></import-element>
      <body>${usage}</body>`;
    frame.addEventListener("load", () => resolve(frame), { once: true });
    document.body.append(frame);
  });

describe("standalone component files", () => {
  for (const [path, html] of Object.entries(files)) {
    const name = path.replace("../components/", "").replace(".html", "");
    const tags = tagsOf(html);
    test(`${name}.html imported alone defines every ui element its render uses`, async () => {
      const frame = await load(name, usageOf(name, tags));
      try {
        await expect.poll(() => shadowHosts(frame), { timeout: 10000 }).toBeGreaterThan(0);
        await expect.poll(() => undefinedTags(frame), { timeout: 10000 }).toEqual([]);
      } finally {
        frame.remove();
      }
    });
  }
});
