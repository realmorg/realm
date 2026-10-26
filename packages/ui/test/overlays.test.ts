import { describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { part, render, shadow, tick } from "./setup";

type Dialog = HTMLElement & {
  open: boolean;
  showModal(): void;
  close(value?: string): void;
  requestClose(): void;
  returnValue: string;
};

const key = (target: Element, name: string) =>
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key: name, bubbles: true, composed: true, cancelable: true }),
  );

describe("ui-dialog", () => {
  test("a centred dialog fits its content and empty content adds no gap", async () => {
    const host = await render(`
      <ui-dialog>
        <ui-dialog-header><ui-dialog-title>Title</ui-dialog-title></ui-dialog-header>
        <ui-dialog-footer><ui-button>Close</ui-button></ui-dialog-footer>
      </ui-dialog>`);
    const overlay = host.querySelector("ui-dialog") as Dialog;
    overlay.showModal();
    await tick();
    await new Promise((resolve) => setTimeout(resolve, 300));
    const dialog = part(overlay, "dialog");
    const header = (host.querySelector("ui-dialog-header") as HTMLElement).getBoundingClientRect();
    const footer = (host.querySelector("ui-dialog-footer") as HTMLElement).getBoundingClientRect();
    // A centred dialog can sit on a half pixel, so WebKit may measure the 16px gap as 15.5.
    expect(Math.abs(footer.top - header.bottom - 16)).toBeLessThanOrEqual(1);
    const style = getComputedStyle(dialog);
    expect(dialog.getBoundingClientRect().height).toBeLessThan(innerHeight / 2);
    expect(style.maxHeight).toBe(`${innerHeight - 32}px`);
    overlay.close();
  });

  test("opening focuses the dialog itself unless an element inside has autofocus", async () => {
    const host = await render(`
      <ui-dialog id="plain"><ui-dialog-header><ui-dialog-title>Plain</ui-dialog-title></ui-dialog-header><input aria-label="name" /></ui-dialog>
      <ui-dialog id="auto"><input aria-label="email" autofocus /></ui-dialog>
      <ui-drawer id="drawer"><input aria-label="search" /></ui-drawer>
      <ui-drawer id="auto-drawer"><input aria-label="query" autofocus /></ui-drawer>`);
    for (const [id, expected] of [
      ["plain", "dialog"],
      ["auto", "input"],
      ["drawer", "dialog"],
      ["auto-drawer", "input"],
    ] as const) {
      const overlay = host.querySelector(`#${id}`) as Dialog;
      overlay.showModal();
      await tick();
      const focused =
        expected === "dialog" ? shadow(overlay).activeElement : document.activeElement;
      expect(focused?.localName, id).toBe(expected);
      if (expected === "dialog")
        expect(getComputedStyle(focused as Element).outlineStyle).toBe("none");
      overlay.close();
      await tick();
    }
  });

  test("opens through the open attribute and methods, closes with events", async () => {
    const host = await render(
      `<ui-dialog><ui-dialog-header><ui-dialog-title>Edit</ui-dialog-title><ui-dialog-description>Change things</ui-dialog-description></ui-dialog-header>Body<ui-dialog-footer><ui-button>Save</ui-button></ui-dialog-footer></ui-dialog>`,
    );
    const dialog = host.querySelector("ui-dialog") as Dialog;
    const native = part<HTMLDialogElement>(dialog, "dialog");
    const events: string[] = [];
    dialog.addEventListener("close", () => events.push("close"));
    dialog.showModal();
    await tick();
    expect(native.open).toBe(true);
    expect(dialog.hasAttribute("open")).toBe(true);
    dialog.close("done");
    await tick();
    expect(native.open).toBe(false);
    expect(dialog.returnValue).toBe("done");
    await vi.waitFor(() => expect(events).toContain("close"));
  });

  test("backdrop clicks, the close button and cancel events request closing", async () => {
    const host = await render(
      `<ui-dialog open></ui-dialog><ui-dialog id="locked" open persistent hide-close></ui-dialog>`,
    );
    const [dialog, locked] = [...host.querySelectorAll("ui-dialog")] as Dialog[];
    await tick();
    const native = part<HTMLDialogElement>(dialog as Dialog, "dialog");
    native.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await tick();
    expect((dialog as Dialog).open).toBe(false);
    (dialog as Dialog).showModal();
    await tick();
    (dialog as Dialog).addEventListener("cancel", (event) => event.preventDefault(), {
      once: true,
    });
    part<HTMLButtonElement>(dialog as Dialog, "close").click();
    await tick();
    expect((dialog as Dialog).open).toBe(true);
    native.dispatchEvent(new Event("cancel", { cancelable: true }));
    await tick();
    expect((dialog as Dialog).open).toBe(false);
    const lockedNative = part<HTMLDialogElement>(locked as Dialog, "dialog");
    lockedNative.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    lockedNative.dispatchEvent(new Event("cancel", { cancelable: true }));
    await tick();
    expect((locked as Dialog).open).toBe(true);
    expect(part<HTMLButtonElement>(locked as Dialog, "close").hidden).toBe(true);
    (locked as Dialog).close();
    await tick();
  });

  test("responds to command events and renders as a side sheet", async () => {
    const host = await render(`<ui-dialog side="right"></ui-dialog>`);
    const dialog = host.querySelector("ui-dialog") as Dialog;
    const command = (name: string) =>
      dialog.dispatchEvent(Object.assign(new Event("command"), { command: name }));
    command("--show-modal");
    await tick();
    expect(dialog.open).toBe(true);
    const rect = part(dialog, "dialog").getBoundingClientRect();
    expect(Math.round(rect.right)).toBe(window.innerWidth);
    command("request-close");
    await tick();
    expect(dialog.open).toBe(false);
    command("show-modal");
    await tick();
    command("close");
    await tick();
    expect(dialog.open).toBe(false);
    command("unknown");
  });
});

describe("popover and tooltip", () => {
  test("grid overlays pack their rows at the start, so Safari does not stretch them", async () => {
    const host = await render(`
      <ui-dialog id="d"><ui-dialog-title>Dialog</ui-dialog-title></ui-dialog>
      <ui-alert-dialog id="a"><ui-alert-dialog-title>Alert</ui-alert-dialog-title></ui-alert-dialog>
      <ui-drawer id="r"><ui-drawer-title>Drawer</ui-drawer-title></ui-drawer>
      <ui-popover><ui-popover-trigger><ui-button>Open</ui-button></ui-popover-trigger><ui-popover-content id="p">Popover</ui-popover-content></ui-popover>`);
    for (const id of ["d", "a", "r"]) {
      const overlay = host.querySelector(`#${id}`) as Dialog;
      overlay.showModal();
      await tick();
      expect(getComputedStyle(part(overlay, "dialog")).alignContent, id).toBe("start");
      overlay.close();
      await tick();
    }
    const popover = host.querySelector("#p") as HTMLElement;
    popover.showPopover();
    expect(getComputedStyle(popover).alignContent).toBe("start");
    popover.hidePopover();
  });

  test("anchored popovers fit their content and never grow past the screen", async () => {
    const host = await render(
      `<ui-popover><ui-popover-trigger><ui-button>Open</ui-button></ui-popover-trigger><ui-popover-content>Short</ui-popover-content></ui-popover>`,
    );
    const content = host.querySelector("ui-popover-content") as HTMLElement;
    content.showPopover();
    await tick();
    expect(content.getBoundingClientRect().height).toBeLessThan(innerHeight / 2);
    expect(getComputedStyle(content).maxHeight).toBe(`${innerHeight - 32}px`);
    content.hidePopover();
  });

  test("ui-popover-content becomes a native auto popover", async () => {
    const host = await render(
      `<ui-popover-content id="p" placement="top">Content</ui-popover-content>`,
    );
    const popover = host.querySelector("ui-popover-content") as HTMLElement;
    expect(popover.getAttribute("popover")).toBe("auto");
    popover.showPopover();
    expect(popover.matches(":popover-open")).toBe(true);
    popover.hidePopover();
  });

  test("ui-tooltip shows on hover and focus, hides on leave and Escape", async () => {
    const host = await render(
      `<ui-tooltip delay="0"><ui-tooltip-trigger><button>Hover</button></ui-tooltip-trigger><ui-tooltip-content>Add to library</ui-tooltip-content></ui-tooltip>`,
    );
    const trigger = part(host.querySelector("ui-tooltip-trigger"), "trigger");
    const tip = host.querySelector("ui-tooltip-content") as HTMLElement;
    const wait = () => new Promise((resolve) => setTimeout(resolve, 10));
    trigger.dispatchEvent(new PointerEvent("pointerenter"));
    await wait();
    expect(tip.matches(":popover-open")).toBe(true);
    expect(tip.textContent?.trim()).toBe("Add to library");
    trigger.dispatchEvent(new PointerEvent("pointerleave"));
    expect(tip.matches(":popover-open")).toBe(false);
    (host.querySelector("button") as HTMLButtonElement).focus();
    await wait();
    expect(tip.matches(":popover-open")).toBe(true);
    key(host.querySelector("button") as Element, "Escape");
    expect(tip.matches(":popover-open")).toBe(false);
    trigger.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    key(host.querySelector("button") as Element, "a");
  });
});

describe("ui-dropdown-menu", () => {
  test("opens from its trigger, moves focus with arrows and closes on select", async () => {
    const host = await render(`
      <ui-dropdown-menu>
        <ui-dropdown-menu-trigger><ui-button>Open</ui-button></ui-dropdown-menu-trigger>
        <ui-dropdown-menu-content>
          <ui-menu-item value="profile">Profile</ui-menu-item>
          <ui-menu-item value="billing" disabled>Billing</ui-menu-item>
          <ui-menu-item value="logout" variant="destructive">Log out</ui-menu-item>
        </ui-dropdown-menu-content>
      </ui-dropdown-menu>
      <button id="outside">outside</button>`);
    const dropdown = host.querySelector("ui-dropdown-menu") as HTMLElement;
    const menu = host.querySelector("ui-dropdown-menu-content") as HTMLElement;
    const items = [...host.querySelectorAll("ui-menu-item")] as HTMLElement[];
    const picked: string[] = [];
    dropdown.addEventListener("select", (event) =>
      picked.push((event as CustomEvent).detail.value),
    );
    const open = async () => {
      part<HTMLButtonElement>(host.querySelector("ui-button"), "button").click();
      await tick();
    };
    await open();
    expect(menu.matches(":popover-open")).toBe(true);
    await vi.waitFor(() => expect(document.activeElement).toBe(items[0]));
    key(items[0] as Element, "ArrowDown");
    expect(document.activeElement).toBe(items[2]);
    key(items[2] as Element, "Enter");
    expect(picked).toEqual(["logout"]);
    expect(menu.matches(":popover-open")).toBe(false);
    (items[1] as HTMLElement).click();
    expect(picked).toEqual(["logout"]);
    await open();
    await userEvent.keyboard("{Escape}");
    expect(menu.matches(":popover-open")).toBe(false);
    await open();
    (items[0] as HTMLElement).focus();
    (host.querySelector("#outside") as HTMLButtonElement).focus();
    expect(menu.matches(":popover-open")).toBe(false);
    (items[0] as HTMLElement).click();
    key(items[0] as Element, "x");
    expect(picked).toEqual(["logout", "profile"]);
  });
});

describe("anchored menus keep their side", () => {
  test("a dropdown that opens above its trigger stays above while the page scrolls", async () => {
    const host = await render(`
      <div style="height: calc(100vh - 48px)"></div>
      <ui-dropdown-menu>
        <ui-dropdown-menu-trigger><ui-button>Open</ui-button></ui-dropdown-menu-trigger>
        <ui-dropdown-menu-content>
          <ui-menu-item value="a">One</ui-menu-item>
          <ui-menu-item value="b">Two</ui-menu-item>
          <ui-menu-item value="c">Three</ui-menu-item>
        </ui-dropdown-menu-content>
      </ui-dropdown-menu>
      <div style="height: 200vh"></div>`);
    const trigger = host.querySelector("ui-dropdown-menu-trigger") as HTMLElement;
    const menu = host.querySelector("ui-dropdown-menu-content") as HTMLElement;
    const above = () => menu.getBoundingClientRect().bottom <= trigger.getBoundingClientRect().top;
    part<HTMLButtonElement>(host.querySelector("ui-button"), "button").click();
    await vi.waitFor(() => expect(menu.matches(":popover-open") && above()).toBe(true));
    const scrolled = scrollY;
    scrollBy(0, innerHeight / 2);
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    expect(trigger.getBoundingClientRect().top).toBeLessThan(innerHeight / 2);
    expect(above()).toBe(true);
    menu.hidePopover();
    scrollTo(0, scrolled);
  });
});

const BOTTOM_OF_SCREEN = [
  {
    name: "a popover",
    markup: `<ui-popover><ui-popover-trigger><ui-button>Open</ui-button></ui-popover-trigger><ui-popover-content>Body</ui-popover-content></ui-popover>`,
    trigger: "ui-popover-trigger",
    overlay: (host: HTMLElement) => host.querySelector("ui-popover-content") as HTMLElement,
    open: (host: HTMLElement) =>
      part<HTMLButtonElement>(host.querySelector("ui-button"), "button").click(),
  },
  {
    name: "a hover card",
    markup: `<ui-hover-card open-delay="0" close-delay="0"><ui-hover-card-trigger><a href="#p">@realm</a></ui-hover-card-trigger><ui-hover-card-content>Card</ui-hover-card-content></ui-hover-card>`,
    trigger: "ui-hover-card-trigger",
    overlay: (host: HTMLElement) => host.querySelector("ui-hover-card-content") as HTMLElement,
    open: (host: HTMLElement) =>
      part(host.querySelector("ui-hover-card-trigger"), "trigger").dispatchEvent(
        new FocusEvent("focusin", { bubbles: true }),
      ),
  },
  {
    name: "a tooltip placed below",
    markup: `<ui-tooltip delay="0"><ui-tooltip-trigger><ui-button>Save</ui-button></ui-tooltip-trigger><ui-tooltip-content placement="bottom">Save the file</ui-tooltip-content></ui-tooltip>`,
    trigger: "ui-tooltip-trigger",
    overlay: (host: HTMLElement) => host.querySelector("ui-tooltip-content") as HTMLElement,
    open: (host: HTMLElement) =>
      part<HTMLButtonElement>(host.querySelector("ui-button"), "button").focus(),
  },
  {
    name: "a menubar menu",
    markup: `<ui-menubar><ui-menubar-menu><ui-menubar-trigger>File</ui-menubar-trigger><ui-menubar-content><ui-menu-item>New</ui-menu-item><ui-menu-item>Open</ui-menu-item></ui-menubar-content></ui-menubar-menu></ui-menubar>`,
    trigger: "ui-menubar-trigger",
    overlay: (host: HTMLElement) => host.querySelector("ui-menubar-content") as HTMLElement,
    open: (host: HTMLElement) =>
      part<HTMLButtonElement>(host.querySelector("ui-menubar-trigger"), "trigger").click(),
  },
  {
    name: "a combobox list",
    markup: `<ui-combobox aria-label="Framework"><option value="a">A</option><option value="b">B</option><option value="c">C</option></ui-combobox>`,
    trigger: "ui-combobox",
    overlay: (host: HTMLElement) => part(host.querySelector("ui-combobox"), "list"),
    open: (host: HTMLElement) => part(host.querySelector("ui-combobox"), "input").focus(),
  },
];

describe("anchored overlays keep their side", () => {
  for (const { name, markup, trigger, overlay, open } of BOTTOM_OF_SCREEN)
    test(`${name} that opens above its trigger stays above while the page scrolls`, async () => {
      const host = await render(
        `<div style="height: calc(100vh - 48px)"></div>${markup}<div style="height: 200vh"></div>`,
      );
      const anchor = host.querySelector(trigger) as HTMLElement;
      const box = overlay(host);
      const above = () => box.getBoundingClientRect().bottom <= anchor.getBoundingClientRect().top;
      open(host);
      await vi.waitFor(() => expect(box.matches(":popover-open") && above()).toBe(true));
      const scrolled = scrollY;
      scrollBy(0, innerHeight / 2);
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      expect(anchor.getBoundingClientRect().top).toBeLessThan(innerHeight / 2);
      expect(above()).toBe(true);
      scrollTo(0, scrolled);
    });

  test("an overlay placed to the side never flips up or down", async () => {
    const host = await render(
      `<div style="height: calc(100vh - 48px)"></div><ui-popover><ui-popover-trigger><ui-button>Open</ui-button></ui-popover-trigger><ui-popover-content placement="right">Body</ui-popover-content></ui-popover>`,
    );
    const content = host.querySelector("ui-popover-content") as HTMLElement;
    part<HTMLButtonElement>(host.querySelector("ui-button"), "button").click();
    await vi.waitFor(() => expect(content.matches(":popover-open")).toBe(true));
    expect(getComputedStyle(content).getPropertyValue("position-area")).toBe("right");
    content.hidePopover();
  });
});

describe("ui-toaster", () => {
  test("shows toasts from document events and its method, then dismisses them", async () => {
    const host = await render(`<ui-toaster position="top-center" duration="40"></ui-toaster>`);
    const toaster = host.querySelector("ui-toaster") as HTMLElement & {
      toast(detail?: object): number;
      dismiss(id: number): void;
    };
    const region = part(toaster, "region");
    document.dispatchEvent(
      new CustomEvent("toast", { detail: { title: "Saved", description: "All good" } }),
    );
    const id = toaster.toast({ title: "Sticky", variant: "destructive", duration: 0 });
    toaster.toast();
    await tick();
    expect(region.matches(":popover-open")).toBe(true);
    expect([...shadow(toaster).querySelectorAll("strong")].map((s) => s.textContent)).toEqual([
      "Saved",
      "Sticky",
      "",
    ]);
    await new Promise((resolve) => setTimeout(resolve, 80));
    await tick();
    expect(shadow(toaster).querySelectorAll("li")).toHaveLength(1);
    toaster.dismiss(id);
    toaster.dismiss(999);
    await tick();
    expect(region.matches(":popover-open")).toBe(false);
    toaster.toast({ title: "x" });
    await tick();
    (shadow(toaster).querySelector("li button") as HTMLButtonElement).click();
    await tick();
    expect(shadow(toaster).querySelectorAll("li")).toHaveLength(0);
  });
});

describe("dialog names", () => {
  test("dialogs take their accessible name and description from their title and description parts", async () => {
    const host = await render(`
      <ui-dialog id="d"><ui-dialog-header><ui-dialog-title>Edit profile</ui-dialog-title><ui-dialog-description>Change your details.</ui-dialog-description></ui-dialog-header></ui-dialog>
      <ui-alert-dialog id="a"><ui-alert-dialog-header><ui-alert-dialog-title>Delete file?</ui-alert-dialog-title></ui-alert-dialog-header></ui-alert-dialog>
      <ui-drawer id="r"><ui-drawer-header><ui-drawer-title>Filters</ui-drawer-title></ui-drawer-header></ui-drawer>`);
    for (const id of ["d", "a", "r"]) (host.querySelector(`#${id}`) as Dialog).showModal();
    await tick();
    await expect.element(page.getByRole("dialog", { name: "Edit profile" })).toBeVisible();
    await expect
      .element(page.getByRole("dialog", { name: "Edit profile" }))
      .toHaveAccessibleDescription("Change your details.");
    await expect
      .element(page.getByRole("alertdialog", { name: "Delete file?" }))
      .toBeInTheDocument();
    await expect.element(page.getByRole("dialog", { name: "Filters" })).toBeInTheDocument();
    for (const id of ["d", "a", "r"]) (host.querySelector(`#${id}`) as Dialog).close();
  });
});
