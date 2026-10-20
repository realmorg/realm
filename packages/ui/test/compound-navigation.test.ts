import { describe, expect, test, vi } from "vitest";
import { part, render, shadow, tick } from "./setup";

const key = (target: Element, name: string) =>
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key: name, bubbles: true, composed: true, cancelable: true }),
  );

const internalsOf = new WeakMap<Element, ElementInternals>();
const attachInternals = HTMLElement.prototype.attachInternals;
HTMLElement.prototype.attachInternals = function (this: HTMLElement) {
  const internals = attachInternals.call(this);
  internalsOf.set(this, internals);
  return internals;
};

const settle = () => new Promise((resolve) => setTimeout(resolve, 20));

describe("ui-tabs parts", () => {
  test("tabs list, triggers and content switch with clicks and arrow keys", async () => {
    const host = await render(`
      <ui-tabs value="password">
        <ui-tabs-list>
          <ui-tabs-trigger value="account">Account</ui-tabs-trigger>
          <ui-tabs-trigger value="password">Password</ui-tabs-trigger>
          <ui-tabs-trigger value="team" disabled>Team</ui-tabs-trigger>
        </ui-tabs-list>
        <ui-tabs-content value="account">Account settings</ui-tabs-content>
        <ui-tabs-content value="password">Password settings</ui-tabs-content>
        <ui-tabs-content value="team">Team</ui-tabs-content>
      </ui-tabs>`);
    const tabs = host.querySelector("ui-tabs") as HTMLElement & { value: string };
    const triggers = [...host.querySelectorAll("ui-tabs-trigger")];
    const contents = [...host.querySelectorAll("ui-tabs-content")] as HTMLElement[];
    const buttons = triggers.map((trigger) => part<HTMLButtonElement>(trigger, "trigger"));
    expect(part(host.querySelector("ui-tabs-list"), "list").getAttribute("role")).toBe("tablist");
    expect(buttons.map((button) => button.getAttribute("role"))).toEqual(["tab", "tab", "tab"]);
    expect(contents.map((content) => content.hidden)).toEqual([true, false, true]);
    expect(buttons[1]?.getAttribute("aria-selected")).toBe("true");
    expect(buttons.map((button) => button.tabIndex)).toEqual([-1, 0, -1]);
    expect(buttons[2]?.disabled).toBe(true);
    expect(internalsOf.get(contents[0] as Element)?.role).toBe("tabpanel");
    if ("ariaLabelledByElements" in Element.prototype)
      expect(contents[1]?.ariaLabelledByElements).toEqual([triggers[1]]);
    const changes: string[] = [];
    tabs.addEventListener("change", () => changes.push(tabs.value));
    buttons[0]?.click();
    await tick();
    expect(tabs.value).toBe("account");
    expect(contents[0]?.hidden).toBe(false);
    buttons[0]?.focus();
    key(buttons[0] as Element, "ArrowRight");
    await tick();
    expect(tabs.value).toBe("password");
    expect(shadow(triggers[1] as Element).activeElement).toBe(buttons[1]);
    key(buttons[1] as Element, "ArrowRight");
    await tick();
    expect(tabs.value).toBe("account");
    buttons[1]?.click();
    buttons[1]?.click();
    await tick();
    expect(changes).toEqual(["account", "password", "account", "password"]);
    tabs.value = "account";
    await tick();
    expect(contents[0]?.hidden).toBe(false);
    triggers[2]?.removeAttribute("disabled");
    await tick();
    tabs.value = "team";
    await tick();
    expect(contents[2]?.hidden).toBe(false);
  });

  test("vertical tabs stack the list and an unknown value selects the first enabled tab", async () => {
    const host = await render(`
      <ui-tabs orientation="vertical" value="missing">
        <ui-tabs-list>
          <ui-tabs-trigger value="one">One</ui-tabs-trigger>
          <ui-tabs-trigger value="two">Two</ui-tabs-trigger>
        </ui-tabs-list>
        <ui-tabs-content value="one">1</ui-tabs-content>
        <ui-tabs-content value="two">2</ui-tabs-content>
      </ui-tabs>`);
    const tabs = host.querySelector("ui-tabs") as HTMLElement & { value: string | null };
    const list = part(host.querySelector("ui-tabs-list"), "list");
    const buttons = [...host.querySelectorAll("ui-tabs-trigger")].map((trigger) =>
      part<HTMLButtonElement>(trigger, "trigger"),
    );
    expect(buttons[0]?.getAttribute("aria-selected")).toBe("true");
    expect(list.getAttribute("aria-orientation")).toBe("vertical");
    expect(getComputedStyle(list).flexDirection).toBe("column");
    expect(getComputedStyle(tabs).flexDirection).toBe("row");
    buttons[0]?.focus();
    key(buttons[0] as Element, "ArrowDown");
    await tick();
    expect(tabs.value).toBe("two");
    key(buttons[1] as Element, "ArrowRight");
    await tick();
    expect(tabs.value).toBe("two");
  });

  test("tabs with only disabled triggers select nothing and hide every content", async () => {
    const host = await render(`
      <ui-tabs>
        <ui-tabs-list><ui-tabs-trigger value="a" disabled>A</ui-tabs-trigger><ui-tabs-trigger value="b" disabled>B</ui-tabs-trigger></ui-tabs-list>
        <ui-tabs-content value="a">1</ui-tabs-content><ui-tabs-content value="b">2</ui-tabs-content>
      </ui-tabs>`);
    const selected = [...host.querySelectorAll("ui-tabs-trigger")].map((trigger) =>
      part(trigger, "trigger").getAttribute("aria-selected"),
    );
    expect(selected).toEqual(["false", "false"]);
    expect(
      [...host.querySelectorAll("ui-tabs-content")].every(
        (content) => (content as HTMLElement).hidden,
      ),
    ).toBe(true);
  });
});

describe("ui-accordion parts", () => {
  test("accordion trigger and content fill the item; single mode keeps one item open", async () => {
    const host = await render(`
      <ui-accordion>
        <ui-accordion-item open>
          <ui-accordion-trigger>One <b>new</b></ui-accordion-trigger>
          <ui-accordion-content>First</ui-accordion-content>
        </ui-accordion-item>
        <ui-accordion-item>
          <ui-accordion-trigger>Two</ui-accordion-trigger>
          <ui-accordion-content>Second</ui-accordion-content>
        </ui-accordion-item>
        <ui-accordion-item disabled>
          <ui-accordion-trigger>Three</ui-accordion-trigger>
          <ui-accordion-content>Third</ui-accordion-content>
        </ui-accordion-item>
      </ui-accordion>
      <ui-accordion type="multiple">
        <ui-accordion-item open><ui-accordion-trigger>A</ui-accordion-trigger><ui-accordion-content>a</ui-accordion-content></ui-accordion-item>
        <ui-accordion-item><ui-accordion-trigger>B</ui-accordion-trigger><ui-accordion-content>b</ui-accordion-content></ui-accordion-item>
      </ui-accordion>`);
    const [single, multiple] = [...host.querySelectorAll("ui-accordion")] as Element[];
    const items = [...(single as Element).querySelectorAll("ui-accordion-item")] as (HTMLElement & {
      open: boolean;
    })[];
    const trigger = host.querySelector("ui-accordion-trigger") as HTMLElement;
    const content = host.querySelector("ui-accordion-content") as HTMLElement;
    expect(trigger.slot).toBe("trigger");
    expect(trigger.assignedSlot?.parentElement?.localName).toBe("summary");
    expect(content.assignedSlot?.parentElement?.localName).toBe("details");
    expect(getComputedStyle(content).paddingBottom).toBe("16px");
    expect(part(items[0] as Element, "summary").textContent?.trim()).toBe("");
    const summary = (item: Element) => part<HTMLElement>(item, "summary");
    summary(items[1] as Element).click();
    await settle();
    await tick();
    expect(items.map((item) => item.open)).toEqual([false, true, false]);
    summary(items[2] as Element).click();
    await settle();
    expect(items[2]?.open).toBe(false);
    const both = [
      ...(multiple as Element).querySelectorAll("ui-accordion-item"),
    ] as (HTMLElement & {
      open: boolean;
    })[];
    summary(both[1] as Element).click();
    await settle();
    await tick();
    expect(both.map((item) => item.open)).toEqual([true, true]);
    expect(getComputedStyle(single as Element).display).toBe("block");
  });
});

describe("ui-collapsible parts", () => {
  test("collapsible trigger becomes the summary and content shows when open", async () => {
    const host = await render(`
      <ui-collapsible>
        <ui-collapsible-trigger>Starred <svg viewBox="0 0 24 24"></svg></ui-collapsible-trigger>
        <ui-collapsible-content><div>realm/core</div></ui-collapsible-content>
      </ui-collapsible>
      <ui-collapsible id="off" disabled>
        <ui-collapsible-trigger>Off</ui-collapsible-trigger>
        <ui-collapsible-content>x</ui-collapsible-content>
      </ui-collapsible>`);
    const collapsible = host.querySelector("ui-collapsible") as HTMLElement & { open: boolean };
    const trigger = host.querySelector("ui-collapsible-trigger") as HTMLElement;
    const content = host.querySelector("ui-collapsible-content") as HTMLElement;
    expect(trigger.assignedSlot?.parentElement).toBe(part(collapsible, "trigger"));
    expect(getComputedStyle(trigger).justifyContent).toBe("space-between");
    expect(getComputedStyle(trigger.querySelector("svg") as Element).width).toBe("16px");
    expect(content.checkVisibility()).toBe(false);
    part<HTMLElement>(collapsible, "trigger").click();
    await vi.waitFor(() => expect(collapsible.open).toBe(true));
    expect(content.checkVisibility()).toBe(true);
    expect(getComputedStyle(content).flexDirection).toBe("column");
    const off = host.querySelector("#off") as HTMLElement & { open: boolean };
    part<HTMLElement>(off, "trigger").click();
    await settle();
    expect(off.open).toBe(false);
  });
});

describe("ui-breadcrumb parts", () => {
  test("breadcrumb list, item, link, page, separator and ellipsis render a labelled ordered list", async () => {
    const host = await render(`
      <ui-breadcrumb>
        <ui-breadcrumb-list>
          <ui-breadcrumb-item><ui-breadcrumb-link href="/">Home</ui-breadcrumb-link></ui-breadcrumb-item>
          <ui-breadcrumb-separator></ui-breadcrumb-separator>
          <ui-breadcrumb-item><ui-breadcrumb-ellipsis></ui-breadcrumb-ellipsis></ui-breadcrumb-item>
          <ui-breadcrumb-separator>/</ui-breadcrumb-separator>
          <ui-breadcrumb-item><ui-breadcrumb-page>Props</ui-breadcrumb-page></ui-breadcrumb-item>
        </ui-breadcrumb-list>
      </ui-breadcrumb>
      <ui-breadcrumb label="Fil d'Ariane"></ui-breadcrumb>`);
    const [breadcrumb, french] = [...host.querySelectorAll("ui-breadcrumb")] as Element[];
    expect(
      shadow(breadcrumb as Element)
        .querySelector("nav")
        ?.getAttribute("aria-label"),
    ).toBe("Breadcrumb");
    expect(
      shadow(french as Element)
        .querySelector("nav")
        ?.getAttribute("aria-label"),
    ).toBe("Fil d'Ariane");
    expect(part(host.querySelector("ui-breadcrumb-list"), "list").localName).toBe("ol");
    expect(part(host.querySelector("ui-breadcrumb-link"), "link").getAttribute("href")).toBe("/");
    const page = part(host.querySelector("ui-breadcrumb-page"), "page");
    expect(page.getAttribute("aria-current")).toBe("page");
    expect(page.getAttribute("aria-disabled")).toBe("true");
    const separators = [...host.querySelectorAll("ui-breadcrumb-separator")];
    expect(
      shadow(separators[0] as Element)
        .querySelector("svg")
        ?.checkVisibility(),
    ).toBe(true);
    expect((separators[1] as HTMLElement).textContent).toBe("/");
    expect(internalsOf.get(separators[0] as Element)?.role).toBe("presentation");
    expect(internalsOf.get(separators[0] as Element)?.ariaHidden).toBe("true");
    expect(internalsOf.get(host.querySelector("ui-breadcrumb-item") as Element)?.role).toBe(
      "listitem",
    );
    expect(part(host.querySelector("ui-breadcrumb-ellipsis"), "label").textContent).toBe("More");
    expect(getComputedStyle(host.querySelector("ui-breadcrumb-item") as Element).alignItems).toBe(
      "center",
    );
  });
});

describe("ui-navigation-menu parts", () => {
  test("navigation menu trigger opens its content, hover schedules it and links mark the current page", async () => {
    const host = await render(`
      <ui-navigation-menu>
        <ui-navigation-menu-list>
          <ui-navigation-menu-item>
            <ui-navigation-menu-trigger>Products</ui-navigation-menu-trigger>
            <ui-navigation-menu-content width="72" columns="2">
              <ui-navigation-menu-link href="#a"><strong>Analytics</strong><span>Charts</span></ui-navigation-menu-link>
              <ui-navigation-menu-link href="#b">Billing</ui-navigation-menu-link>
            </ui-navigation-menu-content>
          </ui-navigation-menu-item>
          <ui-navigation-menu-item>
            <ui-navigation-menu-link href="#docs" current>Docs</ui-navigation-menu-link>
          </ui-navigation-menu-item>
          <ui-navigation-menu-item>
            <ui-navigation-menu-link href="#blog">Blog</ui-navigation-menu-link>
          </ui-navigation-menu-item>
        </ui-navigation-menu-list>
      </ui-navigation-menu>`);
    const [products, docs, blog] = [
      ...host.querySelectorAll("ui-navigation-menu-item"),
    ] as Element[];
    const trigger = part<HTMLButtonElement>(
      host.querySelector("ui-navigation-menu-trigger"),
      "trigger",
    );
    const panel = part(products as Element, "panel");
    const content = host.querySelector("ui-navigation-menu-content") as HTMLElement;
    expect(
      shadow(host.querySelector("ui-navigation-menu"))
        .querySelector("nav")
        ?.getAttribute("aria-label"),
    ).toBe("Main");
    expect(
      part(host.querySelector("ui-navigation-menu-list"), "list").getAttribute("focusgroup"),
    ).toBe("toolbar inline");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    trigger.click();
    await tick();
    expect(panel.matches(":popover-open")).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(content.assignedSlot?.parentElement).toBe(panel);
    expect(content.getBoundingClientRect().width).toBe(288);
    expect(getComputedStyle(content).gridTemplateColumns.split(" ")).toHaveLength(2);
    const link = part(content.querySelector("ui-navigation-menu-link"), "link");
    expect(getComputedStyle(link).flexDirection).toBe("column");
    expect(
      getComputedStyle(part(docs?.querySelector("ui-navigation-menu-link") as Element, "link"))
        .flexDirection,
    ).toBe("row");
    trigger.dispatchEvent(new PointerEvent("pointerleave"));
    await vi.waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("false"));
    trigger.dispatchEvent(new PointerEvent("pointerenter"));
    trigger.dispatchEvent(new PointerEvent("pointerleave"));
    panel.dispatchEvent(new PointerEvent("pointerenter"));
    await vi.waitFor(() => expect(panel.matches(":popover-open")).toBe(true));
    panel.dispatchEvent(new PointerEvent("pointerleave"));
    await vi.waitFor(() => expect(panel.matches(":popover-open")).toBe(false));
    trigger.click();
    expect(panel.matches(":popover-open")).toBe(true);
    trigger.click();
    expect(panel.matches(":popover-open")).toBe(false);
    const docsLink = part(docs?.querySelector("ui-navigation-menu-link") as Element, "link");
    expect(docsLink.getAttribute("href")).toBe("#docs");
    expect(docsLink.getAttribute("aria-current")).toBe("page");
    expect(
      part(blog?.querySelector("ui-navigation-menu-link") as Element, "link").hasAttribute(
        "aria-current",
      ),
    ).toBe(false);
  });
});

describe("ui-sidebar parts", () => {
  test("sidebar header, content, footer, group, menu and inset fill their slots", async () => {
    const host = await render(`
      <ui-sidebar-layout>
        <ui-sidebar>
          <ui-sidebar-header>Acme</ui-sidebar-header>
          <ui-sidebar-content>
            <ui-sidebar-group>
              <ui-sidebar-group-label>Platform</ui-sidebar-group-label>
              <ui-sidebar-menu>
                <ui-sidebar-menu-item>
                  <ui-sidebar-menu-button href="#inbox">Inbox</ui-sidebar-menu-button>
                  <ui-sidebar-menu-badge>12</ui-sidebar-menu-badge>
                </ui-sidebar-menu-item>
              </ui-sidebar-menu>
            </ui-sidebar-group>
          </ui-sidebar-content>
          <ui-sidebar-footer>Jane</ui-sidebar-footer>
        </ui-sidebar>
        <ui-sidebar-inset>Main</ui-sidebar-inset>
      </ui-sidebar-layout>`);
    const layout = host.querySelector("ui-sidebar-layout") as Element;
    const sidebar = host.querySelector("ui-sidebar") as HTMLElement;
    expect(sidebar.assignedSlot?.parentElement).toBe(part(layout, "sidebar"));
    const slotOf = (selector: string) =>
      (host.querySelector(selector) as HTMLElement).assignedSlot?.name;
    expect(slotOf("ui-sidebar-header")).toBe("header");
    expect(slotOf("ui-sidebar-footer")).toBe("footer");
    expect(slotOf("ui-sidebar-content")).toBe("");
    expect(part(host.querySelector("ui-sidebar-content"), "content").localName).toBe("nav");
    const menu = part(host.querySelector("ui-sidebar-menu"), "menu");
    expect(menu.localName).toBe("ul");
    expect(menu.getAttribute("focusgroup")).toBe("menu block");
    const main = part(host.querySelector("ui-sidebar-inset"), "main");
    expect(main.localName).toBe("main");
    expect(getComputedStyle(main).marginTop).toBe("8px");
    const badge = host.querySelector("ui-sidebar-menu-badge") as Element;
    const button = part(host.querySelector("ui-sidebar-menu-button"), "button");
    expect(badge.getBoundingClientRect().right).toBeLessThanOrEqual(
      button.getBoundingClientRect().right,
    );
    const group = host.querySelector("ui-sidebar-group") as Element;
    expect(internalsOf.get(group)?.role).toBe("group");
    if ("ariaLabelledByElements" in ElementInternals.prototype)
      expect(internalsOf.get(group)?.ariaLabelledByElements).toEqual([
        host.querySelector("ui-sidebar-group-label"),
      ]);
    expect(internalsOf.get(host.querySelector("ui-sidebar-menu-item") as Element)?.role).toBe(
      "listitem",
    );
  });
});

describe("ui-button-group parts", () => {
  test("button group text and separator join the group", async () => {
    const host = await render(`
      <ui-button-group>
        <ui-button-group-text>https://</ui-button-group-text>
        <ui-button>Copy</ui-button>
        <ui-button-group-separator></ui-button-group-separator>
        <ui-button>Share</ui-button>
      </ui-button-group>
      <ui-button-group orientation="vertical">
        <ui-button>Up</ui-button>
        <ui-button-group-separator orientation="horizontal"></ui-button-group-separator>
        <ui-button>Down</ui-button>
      </ui-button-group>`);
    const text = host.querySelector("ui-button-group-text") as Element;
    const style = getComputedStyle(text);
    expect(style.borderTopRightRadius).toBe("0px");
    expect(style.borderTopLeftRadius).not.toBe("0px");
    const [vertical, horizontal] = [...host.querySelectorAll("ui-button-group-separator")];
    const box = (el: Element | undefined) => (el as Element).getBoundingClientRect();
    expect(box(vertical).width).toBe(1);
    expect(box(vertical).height).toBe(box(host.querySelector("ui-button") as Element).height);
    expect(box(horizontal).height).toBe(1);
    expect(box(horizontal).width).toBeGreaterThan(1);
    expect(internalsOf.get(vertical as Element)?.ariaOrientation).toBe("vertical");
    expect(internalsOf.get(horizontal as Element)?.ariaOrientation).toBe("horizontal");
  });
});
