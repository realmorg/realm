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
