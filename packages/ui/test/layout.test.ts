import { describe, expect, test, vi } from "vitest";
import { part, render, shadow, tick } from "./setup";

const key = (target: Element, name: string, init: KeyboardEventInit = {}) =>
  target.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: name,
      bubbles: true,
      composed: true,
      cancelable: true,
      ...init,
    }),
  );

describe("layout and display", () => {
  test("aspect ratio, kbd, spinner, empty, item, marker, bubble, message and attachment render", async () => {
    const host = await render(`
      <div style="width: 100px"><ui-aspect-ratio ratio="1 / 1"><div></div></ui-aspect-ratio></div>
      <ui-kbd-group><ui-kbd>⌘</ui-kbd><ui-kbd>K</ui-kbd></ui-kbd-group>
      <ui-spinner size="24" label="Saving"></ui-spinner>
      <ui-empty id="with"><ui-empty-header><ui-empty-media>📁</ui-empty-media><ui-empty-title>No projects</ui-empty-title><ui-empty-description>Create one.</ui-empty-description></ui-empty-header><ui-empty-content><ui-button>New</ui-button></ui-empty-content></ui-empty>
      <ui-item-group><ui-item variant="outline" size="sm"><ui-item-content><ui-item-title>Title</ui-item-title><ui-item-description>Desc</ui-item-description></ui-item-content><ui-item-actions><ui-button>Go</ui-button></ui-item-actions></ui-item></ui-item-group>
      <ui-marker variant="separator">Today</ui-marker>
      <ui-message align="end"><ui-bubble variant="secondary" align="end">Hi there</ui-bubble></ui-message>
      <ui-attachment name="report.pdf" size="1.2 MB" href="data:text/plain,hello"></ui-attachment>`);
    expect(
      (host.querySelector("ui-aspect-ratio") as HTMLElement).getBoundingClientRect().height,
    ).toBe(100);
    expect(
      (host.querySelector("ui-kbd") as HTMLElement).getBoundingClientRect().width,
    ).toBeGreaterThan(0);
    const spinner = host.querySelector("ui-spinner") as HTMLElement;
    expect(spinner.getBoundingClientRect().width).toBe(24);
    expect(getComputedStyle(host.querySelector("#with ui-empty-media") as Element).display).toBe(
      "flex",
    );
    expect(getComputedStyle(host.querySelector("ui-item") as Element).borderTopStyle).toBe("solid");
    expect(getComputedStyle(host.querySelector("ui-message") as Element).flexDirection).toBe(
      "row-reverse",
    );
    expect(part(host.querySelector("ui-attachment"), "title").getAttribute("download")).toBe(
      "report.pdf",
    );
  });

  test("field shows its error and label, field-set groups, label focuses its target", async () => {
    const host = await render(`
      <ui-field-set><ui-field-legend>Profile</ui-field-legend>
        <ui-field invalid error="Required"><ui-label for="name">Name</ui-label><ui-input id="name"></ui-input></ui-field>
      </ui-field-set>
      <ui-label for="terms">Accept</ui-label><ui-checkbox id="terms"></ui-checkbox>
      <ui-label for="missing">Nothing</ui-label>`);
    const field = host.querySelector("ui-field") as HTMLElement;
    expect(part(field, "error").hidden).toBe(false);
    expect(part(field, "error").textContent).toBe("Required");
    const input = host.querySelector("#name") as HTMLElement;
    expect(input.hasAttribute("aria-label")).toBe(false);
    expect(part(input, "input").ariaLabelledByElements).toEqual([
      host.querySelector('ui-label[for="name"]'),
    ]);
    part(host.querySelector('ui-label[for="name"]'), "label").click();
    expect(document.activeElement).toBe(input);
    part(host.querySelector('ui-label[for="terms"]'), "label").click();
    expect((host.querySelector("#terms") as HTMLElement & { checked: boolean }).checked).toBe(true);
    part(host.querySelector('ui-label[for="missing"]'), "label").click();
  });

  test("breadcrumb marks the current page and draws separators", async () => {
    const host = await render(`
      <ui-breadcrumb><ui-breadcrumb-list>
        <ui-breadcrumb-item><ui-breadcrumb-link href="/">Home</ui-breadcrumb-link></ui-breadcrumb-item>
        <ui-breadcrumb-separator></ui-breadcrumb-separator>
        <ui-breadcrumb-item><ui-breadcrumb-page>Props</ui-breadcrumb-page></ui-breadcrumb-item>
      </ui-breadcrumb-list></ui-breadcrumb>`);
    expect(part(host.querySelector("ui-breadcrumb-link"), "link").getAttribute("href")).toBe("/");
    expect(
      part(host.querySelector("ui-breadcrumb-page"), "page").getAttribute("aria-current"),
    ).toBe("page");
    expect(
      shadow(host.querySelector("ui-breadcrumb-separator")).querySelector("svg")?.checkVisibility(),
    ).toBe(true);
    expect(
      shadow(host.querySelector("ui-breadcrumb")).querySelector("nav")?.getAttribute("aria-label"),
    ).toBe("Breadcrumb");
  });

  test("button group joins radii, scroll area scrolls, direction sets dir", async () => {
    const host = await render(`
      <ui-button-group><ui-button>A</ui-button><ui-button>B</ui-button><ui-button>C</ui-button></ui-button-group>
      <ui-scroll-area orientation="both" height="10"><div style="height: 200px; width: 2000px">tall</div></ui-scroll-area>
      <ui-direction dir="rtl"><p>مرحبا</p></ui-direction>`);
    const buttons = [...host.querySelectorAll("ui-button")].map((el) =>
      getComputedStyle(part(el, "button")),
    );
    expect(buttons[1]?.borderTopLeftRadius).toBe("0px");
    expect(buttons[1]?.borderTopRightRadius).toBe("0px");
    expect(buttons[0]?.borderTopRightRadius).toBe("0px");
    expect(buttons[2]?.borderTopLeftRadius).toBe("0px");
    const viewport = part(host.querySelector("ui-scroll-area"), "viewport");
    expect(getComputedStyle(viewport).overflowX).toBe("auto");
    expect((host.querySelector("ui-direction") as HTMLElement).getAttribute("dir")).toBe("rtl");
  });

  test("toggle and toggle group track pressed values", async () => {
    const host = await render(`
      <form>
        <ui-toggle id="bold" aria-label="Bold" variant="outline">B</ui-toggle>
        <ui-toggle-group name="align" value="left"><ui-toggle value="left">L</ui-toggle><ui-toggle value="center">C</ui-toggle><ui-toggle value="right">R</ui-toggle></ui-toggle-group>
        <ui-toggle-group name="marks" type="multiple"><ui-toggle value="b">B</ui-toggle><ui-toggle value="i">I</ui-toggle></ui-toggle-group>
      </form>`);
    const bold = host.querySelector("#bold") as HTMLElement & { pressed: boolean };
    part<HTMLButtonElement>(bold, "button").click();
    await tick();
    expect(bold.pressed).toBe(true);
    expect(part(bold, "button").getAttribute("aria-pressed")).toBe("true");
    const [align, marks] = [...host.querySelectorAll("ui-toggle-group")] as (HTMLElement & {
      value: string;
    })[];
    const alignToggles = [...(align as Element).querySelectorAll("ui-toggle")] as (HTMLElement & {
      pressed: boolean;
    })[];
    expect(alignToggles.map((t) => t.pressed)).toEqual([true, false, false]);
    part<HTMLButtonElement>(alignToggles[2] as Element, "button").click();
    await tick();
    expect(align?.value).toBe("right");
    expect(alignToggles.map((t) => t.pressed)).toEqual([false, false, true]);
    part<HTMLButtonElement>(alignToggles[2] as Element, "button").click();
    await tick();
    expect(align?.value).toBe("");
    for (const toggle of (marks as Element).querySelectorAll("ui-toggle"))
      part<HTMLButtonElement>(toggle, "button").click();
    await tick();
    expect(marks?.value).toBe("b,i");
    expect(new FormData(host.querySelector("form") as HTMLFormElement).get("marks")).toBe("b,i");
    part<HTMLButtonElement>(
      (marks as Element).querySelector("ui-toggle") as Element,
      "button",
    ).click();
    await tick();
    expect(marks?.value).toBe("i");
  });

  test("collapsible opens and closes, unless disabled", async () => {
    const host = await render(
      `<ui-collapsible><ui-collapsible-trigger>More</ui-collapsible-trigger><ui-collapsible-content>Hidden</ui-collapsible-content></ui-collapsible><ui-collapsible id="off" disabled><ui-collapsible-trigger>Off</ui-collapsible-trigger>x</ui-collapsible>`,
    );
    const collapsible = host.querySelector("ui-collapsible") as HTMLElement & { open: boolean };
    part<HTMLElement>(collapsible, "trigger").click();
    await vi.waitFor(() => expect(collapsible.open).toBe(true));
    const off = host.querySelector("#off") as HTMLElement & { open: boolean };
    part<HTMLElement>(off, "trigger").click();
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(off.open).toBe(false);
  });

  test("sidebar layout collapses, persists, opens off-canvas and closes", async () => {
    localStorage.removeItem("sidebar-test");
    const host = await render(`
      <ui-sidebar-layout persist="sidebar-test">
        <ui-sidebar>
          <ui-sidebar-header><b>Acme</b></ui-sidebar-header>
          <ui-sidebar-content>
            <ui-sidebar-group>
              <ui-sidebar-group-label>Platform</ui-sidebar-group-label>
              <ui-sidebar-menu>
                <ui-sidebar-menu-item>
                  <ui-sidebar-menu-button href="#a" current label="Dashboard"><svg viewBox="0 0 24 24"></svg>Dashboard</ui-sidebar-menu-button>
                  <ui-sidebar-menu-badge>3</ui-sidebar-menu-badge>
                </ui-sidebar-menu-item>
                <ui-sidebar-menu-item><ui-sidebar-menu-button href="#b">Settings</ui-sidebar-menu-button></ui-sidebar-menu-item>
              </ui-sidebar-menu>
            </ui-sidebar-group>
          </ui-sidebar-content>
          <ui-sidebar-footer>me</ui-sidebar-footer>
        </ui-sidebar>
        <ui-sidebar-inset>
          <ui-sidebar-trigger></ui-sidebar-trigger>
          <p>Main</p>
        </ui-sidebar-inset>
      </ui-sidebar-layout>`);
    const layout = host.querySelector("ui-sidebar-layout") as HTMLElement & {
      collapsed: boolean;
      toggle(): void;
    };
    const sidebar = part(layout, "sidebar");
    expect(sidebar.getBoundingClientRect().width).toBe(256);
    const trigger = host.querySelector("ui-sidebar-trigger") as Element;
    part<HTMLButtonElement>(shadow(trigger).querySelector("ui-button"), "button").click();
    await tick();
    expect(layout.collapsed).toBe(true);
    expect(localStorage.getItem("sidebar-test")).toBe("true");
    await vi.waitFor(() => expect(sidebar.getBoundingClientRect().width).toBe(48), {
      timeout: 2000,
    });
    const item = host.querySelector("ui-sidebar-menu-button") as Element;
    expect(getComputedStyle(host.querySelector("ui-sidebar-menu-badge") as Element).display).toBe(
      "none",
    );
    expect(getComputedStyle(host.querySelector("ui-sidebar-group-label") as Element).display).toBe(
      "none",
    );
    expect(part(item, "button").getBoundingClientRect().width).toBe(32);
    key(document.body, "b", { ctrlKey: true });
    await tick();
    expect(layout.collapsed).toBe(false);
    key(document.body, "x", { ctrlKey: true });
    const selects: string[] = [];
    layout.addEventListener("select", (event) => selects.push((event.target as Element).localName));
    part<HTMLAnchorElement>(item, "button").click();
    expect(selects).toEqual(["ui-sidebar-menu-button"]);
    const persisted = await render(
      `<ui-sidebar-layout persist="sidebar-test" collapsed></ui-sidebar-layout>`,
    );
    expect(
      (persisted.querySelector("ui-sidebar-layout") as HTMLElement & { collapsed: boolean })
        .collapsed,
    ).toBe(false);
  });
});
