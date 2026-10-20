import { describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { part, render, shadow, tick } from "./setup";

type Modal = HTMLElement & {
  open: boolean;
  show(): void;
  showModal(): void;
  close(value?: string): void;
  returnValue?: string;
};

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

describe("overlays", () => {
  test("alert dialog returns the chosen action and ignores Escape", async () => {
    const host = await render(
      `<ui-alert-dialog><ui-alert-dialog-header><ui-alert-dialog-title>Delete?</ui-alert-dialog-title><ui-alert-dialog-description>This cannot be undone.</ui-alert-dialog-description></ui-alert-dialog-header><ui-alert-dialog-footer><ui-alert-dialog-cancel>Cancel</ui-alert-dialog-cancel><ui-alert-dialog-action value="delete" variant="destructive">Delete</ui-alert-dialog-action></ui-alert-dialog-footer></ui-alert-dialog>`,
    );
    const dialog = host.querySelector("ui-alert-dialog") as Modal;
    const native = part<HTMLDialogElement>(dialog, "dialog");
    expect(native.getAttribute("role")).toBe("alertdialog");
    dialog.dispatchEvent(Object.assign(new Event("command"), { command: "--show-modal" }));
    await tick();
    expect(native.open).toBe(true);
    native.dispatchEvent(new Event("cancel", { cancelable: true }));
    expect(native.open).toBe(true);
    part<HTMLButtonElement>(
      part(host.querySelector("ui-alert-dialog-action"), "button"),
      "button",
    ).click();
    await tick();
    expect(native.open).toBe(false);
    expect(dialog.returnValue).toBe("delete");
    dialog.showModal();
    await tick();
    dialog.dispatchEvent(Object.assign(new Event("command"), { command: "close" }));
    await tick();
    expect(native.open).toBe(false);
  });

  test("drawer and sheet open, close by backdrop, drag and commands", async () => {
    const host = await render(
      `<ui-drawer><ui-drawer-header><ui-drawer-title>Drawer</ui-drawer-title></ui-drawer-header>Body</ui-drawer><ui-drawer id="right" side="right"></ui-drawer><ui-sheet side="left"><ui-sheet-header><ui-sheet-title>Sheet</ui-sheet-title></ui-sheet-header></ui-sheet>`,
    );
    const drawer = host.querySelector("ui-drawer") as Modal;
    drawer.showModal();
    await tick();
    const native = part<HTMLDialogElement>(drawer, "dialog");
    expect(native.open).toBe(true);
    const handle = part(drawer, "handle");
    handle.dispatchEvent(
      new PointerEvent("pointerdown", { clientY: 100, pointerId: 1, bubbles: true }),
    );
    handle.dispatchEvent(
      new PointerEvent("pointerup", { clientY: 120, pointerId: 1, bubbles: true }),
    );
    await tick();
    expect(drawer.open).toBe(true);
    handle.dispatchEvent(
      new PointerEvent("pointerdown", { clientY: 100, pointerId: 1, bubbles: true }),
    );
    handle.dispatchEvent(
      new PointerEvent("pointerup", { clientY: 300, pointerId: 1, bubbles: true }),
    );
    await tick();
    expect(drawer.open).toBe(false);
    handle.dispatchEvent(
      new PointerEvent("pointerup", { clientY: 300, pointerId: 1, bubbles: true }),
    );
    drawer.dispatchEvent(Object.assign(new Event("command"), { command: "show-modal" }));
    await tick();
    native.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await vi.waitFor(() => expect(drawer.open).toBe(false));
    const right = host.querySelector("#right") as Modal;
    right.show();
    await tick();
    expect(Math.round(part(right, "dialog").getBoundingClientRect().right)).toBe(window.innerWidth);
    right.close();
    const sheet = host.querySelector("ui-sheet") as Modal;
    const closes: string[] = [];
    sheet.addEventListener("close", () => closes.push("close"));
    sheet.showModal();
    await tick();
    const inner = shadow(sheet).querySelector("ui-dialog") as Modal;
    expect(part<HTMLDialogElement>(inner, "dialog").open).toBe(true);
    sheet.close();
    await tick();
    await vi.waitFor(() => expect(closes).toEqual(["close"]));
    sheet.show();
    await tick();
    inner.close();
    await vi.waitFor(() => expect(sheet.open).toBe(false));
  });

  test("hover card opens after a delay and closes when the pointer leaves", async () => {
    const host = await render(
      `<ui-hover-card open-delay="0" close-delay="0"><ui-hover-card-trigger><a href="#">@realm</a></ui-hover-card-trigger><ui-hover-card-content placement="top">Profile card</ui-hover-card-content></ui-hover-card>`,
    );
    const trigger = part(host.querySelector("ui-hover-card-trigger"), "trigger");
    const card = host.querySelector("ui-hover-card-content") as Element;
    trigger.dispatchEvent(new PointerEvent("pointerenter"));
    await vi.waitFor(() => expect(card.matches(":popover-open")).toBe(true));
    trigger.dispatchEvent(new PointerEvent("pointerleave"));
    await vi.waitFor(() => expect(card.matches(":popover-open")).toBe(false));
  });

  test("context menu opens at the pointer and closes on select", async () => {
    const host = await render(
      `<ui-context-menu><ui-context-menu-trigger>Right click</ui-context-menu-trigger><ui-context-menu-content><ui-menu-item value="copy">Copy</ui-menu-item><ui-menu-item value="paste">Paste</ui-menu-item></ui-context-menu-content></ui-context-menu>`,
    );
    part(host.querySelector("ui-context-menu-trigger"), "trigger").dispatchEvent(
      new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 40, clientY: 30 }),
    );
    await tick();
    const menu = host.querySelector("ui-context-menu-content") as HTMLElement;
    expect(menu.matches(":popover-open")).toBe(true);
    expect(menu.style.left).toBe("40px");
    await vi.waitFor(() => expect(document.activeElement).toBe(host.querySelector("ui-menu-item")));
    key(host.querySelector("ui-menu-item") as Element, "ArrowDown");
    expect(document.activeElement).toBe(host.querySelectorAll("ui-menu-item")[1]);
    (host.querySelectorAll("ui-menu-item")[1] as HTMLElement).click();
    expect(menu.matches(":popover-open")).toBe(false);
  });

  test("menubar and navigation menu move focus and open panels", async () => {
    const host = await render(`
      <ui-menubar><ui-button variant="ghost">File</ui-button><ui-button variant="ghost">Edit</ui-button></ui-menubar>
      <ui-navigation-menu><ui-navigation-menu-list>
        <ui-navigation-menu-item><ui-navigation-menu-trigger>Products</ui-navigation-menu-trigger><ui-navigation-menu-content><a href="#a">Analytics</a></ui-navigation-menu-content></ui-navigation-menu-item>
        <ui-navigation-menu-item><ui-navigation-menu-link href="#docs" current>Docs</ui-navigation-menu-link></ui-navigation-menu-item>
      </ui-navigation-menu-list></ui-navigation-menu>`);
    const [file, edit] = [...host.querySelectorAll("ui-menubar ui-button")];
    part(file as Element, "button").focus();
    key(part(file as Element, "button"), "ArrowRight");
    expect(shadow(edit as Element).activeElement).toBe(part(edit as Element, "button"));
    const products = host.querySelector("ui-navigation-menu-item") as Element;
    const trigger = part<HTMLButtonElement>(
      host.querySelector("ui-navigation-menu-trigger"),
      "trigger",
    );
    trigger.click();
    expect(part(products, "panel").matches(":popover-open")).toBe(true);
    trigger.dispatchEvent(new PointerEvent("pointerleave"));
    await vi.waitFor(() => expect(part(products, "panel").matches(":popover-open")).toBe(false));
    trigger.dispatchEvent(new PointerEvent("pointerenter"));
    await vi.waitFor(() => expect(part(products, "panel").matches(":popover-open")).toBe(true));
    expect(part(host.querySelector("ui-navigation-menu-link"), "link").getAttribute("href")).toBe(
      "#docs",
    );
  });
});

describe("inputs", () => {
  test("input group submits its value with addons", async () => {
    const host = await render(
      `<form><ui-input-group name="site" value="realm.dev"><ui-input-group-addon>https://</ui-input-group-addon></ui-input-group><ui-input-group name="plain"></ui-input-group></form>`,
    );
    const group = host.querySelector("ui-input-group") as Element;
    expect(getComputedStyle(group.querySelector("ui-input-group-addon") as Element).order).toBe(
      "-1",
    );
    expect(new FormData(host.querySelector("form") as HTMLFormElement).get("site")).toBe(
      "realm.dev",
    );
  });

  test("OTP input accepts typed and pasted digits, backspace and arrows", async () => {
    const host = await render(
      `<form><ui-input-otp name="code" length="4" separator="2" required></ui-input-otp></form>`,
    );
    const otp = host.querySelector("ui-input-otp") as HTMLElement & { value: string };
    const form = host.querySelector("form") as HTMLFormElement;
    const boxes = () => [...shadow(otp).querySelectorAll("input")];
    const completes: string[] = [];
    otp.addEventListener("complete", (event) =>
      completes.push((event as CustomEvent).detail.value),
    );
    expect(boxes()).toHaveLength(4);
    expect(boxes()[2]?.hasAttribute("data-gap")).toBe(true);
    expect(form.checkValidity()).toBe(false);
    const box = boxes()[0] as HTMLInputElement;
    box.value = "7";
    box.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(otp.value).toBe("7");
    box.value = "x";
    box.dispatchEvent(new Event("input", { bubbles: true }));
    box.value = "";
    box.dispatchEvent(new Event("input", { bubbles: true }));
    const data = new DataTransfer();
    data.setData("text", "1234");
    const paste = new ClipboardEvent("paste", {
      clipboardData: data,
      bubbles: true,
      cancelable: true,
    });
    if (paste.clipboardData?.getData("text")) boxes()[1]?.dispatchEvent(paste);
    else {
      for (const [index, digit] of ["1", "2", "3"].entries()) {
        const field = boxes()[index + 1] as HTMLInputElement;
        field.value = digit;
        field.dispatchEvent(new Event("input", { bubbles: true }));
        await tick();
      }
    }
    await tick();
    await tick();
    expect(otp.value).toBe("7123");
    expect(completes.at(-1)).toBe("7123");
    expect(form.checkValidity()).toBe(true);
    key(boxes()[3] as Element, "Backspace");
    await tick();
    expect(otp.value).toBe("712");
    key(boxes()[3] as Element, "Backspace");
    await tick();
    expect(otp.value).toBe("71");
    key(boxes()[0] as Element, "ArrowRight");
    key(boxes()[0] as Element, "Backspace");
    key(boxes()[0] as Element, "Backspace");
    await tick();
    expect(otp.value).toBe("");
  });

  test("combobox filters, selects with keyboard and pointer, and validates", async () => {
    const host = await render(
      `<form><ui-combobox name="framework" required aria-label="Framework"><option value="realm">REALM</option><option value="lit">Lit</option><option value="old" disabled>Old</option></ui-combobox></form>`,
    );
    const combo = host.querySelector("ui-combobox") as HTMLElement & { value: string };
    const input = part<HTMLInputElement>(combo, "input");
    const list = part(combo, "list");
    const form = host.querySelector("form") as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    input.focus();
    await tick();
    expect(list.matches(":popover-open")).toBe(true);
    input.value = "li";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(
      [...shadow(combo).querySelectorAll('[role="option"]')].map((o) => o.textContent?.trim()),
    ).toEqual(["Lit"]);
    key(input, "Enter");
    await tick();
    expect(combo.value).toBe("lit");
    expect(input.value).toBe("Lit");
    expect(list.matches(":popover-open")).toBe(false);
    key(input, "ArrowDown");
    await tick();
    key(input, "ArrowUp");
    key(input, "Escape");
    key(input, "x");
    await tick();
    input.value = "zzz";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect((shadow(combo).querySelector(".empty") as HTMLElement).hidden).toBe(false);
    key(input, "ArrowDown");
    key(input, "Enter");
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    const options = [...shadow(combo).querySelectorAll('[role="option"]')] as HTMLElement[];
    options[2]?.click();
    options[0]?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, cancelable: true }));
    options[0]?.click();
    await tick();
    expect(combo.value).toBe("realm");
    expect(form.checkValidity()).toBe(true);
    list.showPopover();
    list.hidePopover();
  });

  test("calendar selects dates, navigates months and respects limits", async () => {
    const host = await render(
      `<form><ui-calendar name="date" value="2026-10-19" min="2026-10-05" max="2026-11-20" locale="en-US"></ui-calendar></form>`,
    );
    const calendar = host.querySelector("ui-calendar") as HTMLElement & { value: string };
    const root = shadow(calendar);
    const day = (date: string) => root.querySelector(`[data-date="${date}"]`) as HTMLButtonElement;
    expect(root.textContent).toContain("October 2026");
    expect(day("2026-10-19").getAttribute("aria-selected")).toBe("true");
    expect(day("2026-10-01").disabled).toBe(true);
    day("2026-10-20").click();
    await tick();
    expect(calendar.value).toBe("2026-10-20");
    expect(new FormData(host.querySelector("form") as HTMLFormElement).get("date")).toBe(
      "2026-10-20",
    );
    day("2026-10-20").focus();
    key(day("2026-10-20"), "ArrowDown");
    await tick();
    expect(root.activeElement).toBe(day("2026-10-27"));
    key(day("2026-10-27"), "ArrowDown");
    await tick();
    expect(root.textContent).toContain("November 2026");
    key(day("2026-11-03"), "Tab");
    const [previous, next] = [...root.querySelectorAll("ui-button")];
    part<HTMLButtonElement>(previous as Element, "button").click();
    await tick();
    expect(root.textContent).toContain("October 2026");
    part<HTMLButtonElement>(next as Element, "button").click();
    await tick();
    day("2026-12-31")?.click();
    day("2026-11-30").click();
    expect(calendar.value).toBe("2026-10-20");
    const plain = await render(`<ui-calendar></ui-calendar>`);
    expect(shadow(plain.querySelector("ui-calendar")).querySelector("[data-today]")).not.toBeNull();
  });

  test("pagination renders ellipses and changes pages", async () => {
    const host = await render(
      `<ui-pagination page="5" total="10"></ui-pagination><ui-pagination id="links" total="3" href="?page={page}"></ui-pagination>`,
    );
    const pagination = host.querySelector("ui-pagination") as HTMLElement & { page: number };
    const labels = () =>
      [...shadow(pagination).querySelectorAll("li")].map((li) =>
        li.textContent?.replace(/\s+/g, ""),
      );
    expect(labels()).toEqual(["‹Previous", "1", "…", "4", "5", "6", "…", "10", "Next›"]);
    part<HTMLAnchorElement>(pagination, "next").click();
    await tick();
    expect(pagination.page).toBe(6);
    part<HTMLAnchorElement>(pagination, "previous").click();
    await tick();
    expect(pagination.page).toBe(5);
    pagination.addEventListener("change", (event) => event.preventDefault(), { once: true });
    part<HTMLAnchorElement>(pagination, "next").click();
    expect(pagination.page).toBe(5);
    (shadow(pagination).querySelectorAll('[part="page"]')[0] as HTMLAnchorElement).click();
    await tick();
    expect(pagination.page).toBe(1);
    part<HTMLAnchorElement>(pagination, "previous").click();
    const links = host.querySelector("#links") as HTMLElement & { page: number };
    expect(shadow(links).querySelector('[part="page"]')?.getAttribute("href")).toBe("?page=1");
    links.addEventListener("change", (event) => event.preventDefault());
    (shadow(links).querySelectorAll('[part="page"]')[1] as HTMLAnchorElement).click();
    expect(links.page).toBe(1);
  });

  test("pagination fits a phone-width container and keeps its Previous and Next names", async () => {
    await page.viewport(390, 800);
    try {
      const host = await render(
        `<div style="width: 300px"><ui-pagination page="10" total="20" siblings="2"></ui-pagination></div>`,
      );
      const pagination = host.querySelector("ui-pagination") as HTMLElement;
      const bounds = (host.firstElementChild as HTMLElement).getBoundingClientRect();
      for (const item of shadow(pagination).querySelectorAll("li")) {
        expect(item.getBoundingClientRect().left).toBeGreaterThanOrEqual(bounds.left);
        expect(item.getBoundingClientRect().right).toBeLessThanOrEqual(bounds.right);
      }
      const previous = part(pagination, "previous");
      const next = part(pagination, "next");
      expect(previous.textContent?.replace(/\s+/g, "")).toBe("‹Previous");
      expect(next.textContent?.replace(/\s+/g, "")).toBe("Next›");
    } finally {
      await page.viewport(1280, 800);
    }
  });
});

describe("data display", () => {
  test("resizable panels resize with the keyboard and pointer", async () => {
    const host = await render(`
      <div style="width: 400px"><ui-resizable height="25"><ui-resizable-panel size="50">A</ui-resizable-panel><ui-resizable-handle handle></ui-resizable-handle><ui-resizable-panel size="50" min="20">B</ui-resizable-panel></ui-resizable></div>
      <ui-resizable direction="vertical" height="50"><ui-resizable-panel>A</ui-resizable-panel><ui-resizable-handle></ui-resizable-handle><ui-resizable-panel>B</ui-resizable-panel></ui-resizable>
      <ui-resizable><ui-resizable-handle id="lonely"></ui-resizable-handle></ui-resizable>`);
    const [first, second] = [...host.querySelectorAll("ui-resizable-panel")] as (HTMLElement & {
      size: number;
    })[];
    const handle = host.querySelector("ui-resizable-handle") as HTMLElement;
    key(handle, "ArrowRight");
    await tick();
    expect(first?.size).toBe(55);
    expect(second?.size).toBe(45);
    for (let i = 0; i < 10; i++) key(handle, "ArrowRight");
    expect(first?.size).toBe(80);
    key(handle, "Enter");
    handle.dispatchEvent(new PointerEvent("pointermove", { movementX: 40 }));
    handle.dispatchEvent(new PointerEvent("pointerdown", { pointerId: 1 }));
    handle.dispatchEvent(new PointerEvent("pointermove", { movementX: -40 }));
    handle.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1 }));
    expect(first?.size).toBe(70);
    const vertical = host.querySelectorAll("ui-resizable-handle")[1] as HTMLElement;
    expect(vertical.matches(":state(vertical)")).toBe(true);
    vertical.dispatchEvent(new PointerEvent("pointerdown", { pointerId: 1 }));
    vertical.dispatchEvent(new PointerEvent("pointermove", { movementY: 20 }));
    key(host.querySelector("#lonely") as Element, "ArrowLeft");
  });

  test("carousel moves between slides", async () => {
    const host = await render(
      `<div style="width: 200px"><ui-carousel><ui-carousel-content><ui-carousel-item>1</ui-carousel-item><ui-carousel-item>2</ui-carousel-item><ui-carousel-item>3</ui-carousel-item></ui-carousel-content><ui-carousel-previous></ui-carousel-previous><ui-carousel-next></ui-carousel-next></ui-carousel></div><ui-carousel orientation="vertical" height="15"><ui-carousel-content><ui-carousel-item>a</ui-carousel-item></ui-carousel-content></ui-carousel><ui-carousel id="bare"><ui-carousel-next></ui-carousel-next></ui-carousel>`,
    );
    const carousel = host.querySelector("ui-carousel") as HTMLElement;
    const track = part(carousel.querySelector("ui-carousel-content"), "track");
    const [previous, next] = ["ui-carousel-previous", "ui-carousel-next"].map((name) =>
      shadow(carousel.querySelector(name)).querySelector("ui-button"),
    );
    expect(part<HTMLButtonElement>(previous as Element, "button").disabled).toBe(true);
    part<HTMLButtonElement>(next as Element, "button").click();
    key(track, "ArrowRight");
    key(track, "q");
    track.scrollLeft = track.clientWidth + 16;
    track.dispatchEvent(new Event("scrollend"));
    await tick();
    expect(part<HTMLButtonElement>(previous as Element, "button").disabled).toBe(false);
    part<HTMLButtonElement>(previous as Element, "button").click();
    const vertical = host.querySelectorAll("ui-carousel")[1] as HTMLElement;
    part(vertical.querySelector("ui-carousel-content"), "track").dispatchEvent(
      new Event("scrollend"),
    );
    const bare = host.querySelector("#bare ui-carousel-next") as Element;
    part<HTMLButtonElement>(shadow(bare).querySelector("ui-button"), "button").click();
  });

  test("chart draws bars, lines and areas from data", async () => {
    const host = await render(
      `<ui-chart y="desktop,mobile" x="month"></ui-chart><ui-chart id="line" type="area"></ui-chart><ui-chart id="empty" type="line"></ui-chart>`,
    );
    const [bar, area] = [...host.querySelectorAll("ui-chart")] as (HTMLElement & {
      data: unknown;
    })[];
    const data = [
      { month: "Jan", desktop: 186, mobile: 80, value: 5 },
      { month: "Feb", desktop: 305, mobile: 200, value: 9 },
    ];
    (bar as HTMLElement & { data: unknown }).data = data;
    (area as HTMLElement & { data: unknown }).data = data;
    await tick();
    const svg = shadow(bar as Element).querySelector("svg") as SVGSVGElement;
    expect(svg.getAttribute("viewBox")).toBe("0 0 600 240");
    expect(shadow(bar as Element).querySelectorAll(".bars rect")).toHaveLength(4);
    expect(shadow(bar as Element).querySelectorAll(".legend span")).toHaveLength(2);
    expect(shadow(bar as Element).querySelector(".label")?.textContent).toBe("Jan");
    expect(
      getComputedStyle(shadow(area as Element).querySelector(".area") as Element).display,
    ).not.toBe("none");
    expect(
      shadow(area as Element)
        .querySelector(".line")
        ?.getAttribute("d"),
    ).toMatch(/^M/);
  });

  test("chart scales negative values from the zero line", async () => {
    const host = await render(`<ui-chart y="high,low" x="day"></ui-chart>`);
    const chart = host.querySelector("ui-chart") as HTMLElement & { data: unknown };
    chart.data = [
      { day: "Mon", high: 4, low: -4 },
      { day: "Tue", high: 2, low: -2 },
    ];
    await tick();
    const root = shadow(chart);
    const heights = [...root.querySelectorAll(".bars rect")].map((rect) =>
      Number(rect.getAttribute("height")),
    );
    expect(heights.every((height) => height > 0)).toBe(true);
    expect(heights[0]).toBeCloseTo(heights[1] as number);
    expect([...root.querySelectorAll(".tick")].map((tick) => tick.textContent)).toEqual([
      "-4",
      "-2",
      "0",
      "2",
      "4",
    ]);
    const low = root.querySelectorAll(".line")[1]?.getAttribute("d") ?? "";
    const ys = [...low.matchAll(/,([\d.]+)/g)].map((match) => Number(match[1]));
    expect(Math.max(...ys)).toBeLessThanOrEqual(240 - 28);
  });

  test("code block copies its text and message scroller follows new messages", async () => {
    await page.viewport(1280, 800);
    const host = await render(
      `<ui-code-block language="html"><pre>&lt;p&gt;hi&lt;/p&gt;</pre></ui-code-block><ui-message-scroller height="15"><p style="height: 100px">1</p></ui-message-scroller>`,
    );
    const writes: string[] = [];
    const clipboard = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockImplementation(async (text) => {
        writes.push(text);
      });
    const block = host.querySelector("ui-code-block") as Element;
    part<HTMLButtonElement>(shadow(block).querySelector("ui-button"), "button").click();
    await vi.waitFor(() => expect(writes).toEqual(["<p>hi</p>"]));
    clipboard.mockRestore();
    const scroller = host.querySelector("ui-message-scroller") as HTMLElement;
    const viewport = part(scroller, "viewport");
    expect(viewport.scrollTop).toBeGreaterThan(0);
    viewport.scrollTop = 0;
    viewport.dispatchEvent(new Event("scroll"));
    await tick();
    expect(scroller.matches(":state(state-scroll-pinned)")).toBe(false);
    scroller.append(Object.assign(document.createElement("p"), { textContent: "2" }));
    await tick();
    expect(viewport.scrollTop).toBe(0);
    part<HTMLButtonElement>(shadow(scroller).querySelector("ui-button"), "button").click();
    viewport.scrollTop = viewport.scrollHeight;
    viewport.dispatchEvent(new Event("scroll"));
    await tick();
    scroller.append(
      Object.assign(document.createElement("p"), { textContent: "3", style: "height: 100px" }),
    );
    await vi.waitFor(() =>
      expect(viewport.scrollTop + viewport.clientHeight).toBe(viewport.scrollHeight),
    );
  });
});

describe("mobile sidebar", () => {
  test("on narrow screens the sidebar opens off-canvas and closes on the backdrop", async () => {
    await page.viewport(400, 800);
    const host = await render(
      `<ui-sidebar-layout><ui-sidebar><ui-sidebar-content><ui-sidebar-menu><ui-sidebar-menu-item><ui-sidebar-menu-button href="#x">X</ui-sidebar-menu-button></ui-sidebar-menu-item></ui-sidebar-menu></ui-sidebar-content></ui-sidebar><ui-sidebar-inset>Main</ui-sidebar-inset></ui-sidebar-layout>`,
    );
    const layout = host.querySelector("ui-sidebar-layout") as HTMLElement & { toggle(): void };
    expect(layout.matches(":state(state-layout-mobile)")).toBe(true);
    layout.toggle();
    await tick();
    expect(layout.matches(":state(state-layout-open)")).toBe(true);
    expect(getComputedStyle(part(host.querySelector("ui-sidebar-inset"), "main")).marginTop).toBe(
      "0px",
    );
    part(layout, "backdrop").click();
    await tick();
    expect(layout.matches(":state(state-layout-open)")).toBe(false);
    await page.viewport(1280, 800);
    await vi.waitFor(() => expect(layout.matches(":state(state-layout-mobile)")).toBe(false));
    void userEvent;
  });
});
