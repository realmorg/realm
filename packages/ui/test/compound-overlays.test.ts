import { describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { part, render, shadow, tick } from "./setup";

type Modal = HTMLElement & {
  open: boolean;
  showModal(): void;
  close(value?: string): void;
  returnValue: string;
};

const press = (target: Element, key: string) =>
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, composed: true, cancelable: true }),
  );

const deepActive = () => {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
};

const internalsOf = new WeakMap<Element, ElementInternals>();
const attachInternals = HTMLElement.prototype.attachInternals;
HTMLElement.prototype.attachInternals = function (this: HTMLElement) {
  const internals = attachInternals.call(this);
  internalsOf.set(this, internals);
  return internals;
};
const internals = (el: Element | null | undefined) =>
  internalsOf.get(el as Element) as ElementInternals;

const button = (el: Element | null) => part<HTMLButtonElement>(el, "button");
const isOpen = (el: Element | null | undefined) => (el as Element).matches(":popover-open");

describe("dialog parts", () => {
  test("ui-dialog-trigger opens its dialog and ui-dialog-close closes it with a value", async () => {
    const host = await render(`
      <ui-dialog>
        <ui-dialog-trigger><ui-button>Edit profile</ui-button></ui-dialog-trigger>
        <ui-dialog-header>
          <ui-dialog-title>Edit profile</ui-dialog-title>
          <ui-dialog-description>Change your details.</ui-dialog-description>
        </ui-dialog-header>
        Body
        <ui-dialog-footer>
          <ui-dialog-close><ui-button id="cancel">Cancel</ui-button></ui-dialog-close>
          <ui-dialog-close value="saved"><ui-button id="save">Save</ui-button></ui-dialog-close>
        </ui-dialog-footer>
      </ui-dialog>`);
    const dialog = host.querySelector("ui-dialog") as Modal;
    const trigger = host.querySelector("ui-dialog-trigger ui-button") as HTMLElement;
    await userEvent.click(button(trigger));
    await tick();
    expect(dialog.open).toBe(true);
    expect(host.querySelector("ui-dialog-trigger")?.slot).toBe("trigger");
    expect(host.querySelector("ui-dialog-header")?.slot).toBe("header");
    expect(host.querySelector("ui-dialog-footer")?.slot).toBe("footer");
    await expect.element(page.getByRole("heading", { name: "Edit profile" })).toBeVisible();
    await expect
      .element(page.getByRole("dialog", { name: "Edit profile" }))
      .toHaveAccessibleDescription("Change your details.");
    await userEvent.click(button(host.querySelector("#save")));
    await tick();
    expect(dialog.open).toBe(false);
    expect(dialog.returnValue).toBe("saved");
    await vi.waitFor(() => expect(deepActive()).toBe(button(trigger)));
    dialog.showModal();
    await tick();
    button(host.querySelector("#cancel")).click();
    await tick();
    expect(dialog.open).toBe(false);
    expect(dialog.returnValue).toBe("saved");
  });

  test("the dialog name follows its title, a title outside the header or the label attribute", async () => {
    const host = await render(`
      <ui-dialog id="loose"><ui-dialog-title>Loose title</ui-dialog-title></ui-dialog>
      <ui-dialog id="named" label="Named" description="Described"></ui-dialog>
      <ui-dialog id="bare"></ui-dialog>`);
    const native = (id: string) => part(host.querySelector(`#${id}`), "dialog");
    expect(native("loose").getAttribute("aria-label")).toBe("Loose title");
    expect(native("named").getAttribute("aria-label")).toBe("Named");
    expect(native("named").getAttribute("aria-description")).toBe("Described");
    expect(native("bare").hasAttribute("aria-label")).toBe(false);
    (host.querySelector("#loose ui-dialog-title") as HTMLElement).textContent = "Renamed";
    await tick();
    await vi.waitFor(() => expect(native("loose").getAttribute("aria-label")).toBe("Renamed"));
  });
});

describe("dialog reopening", () => {
  test("a dialog reopened before its close event stays open", async () => {
    const host = await render(`<ui-dialog></ui-dialog>`);
    const dialog = host.querySelector("ui-dialog") as Modal;
    const closes: string[] = [];
    dialog.addEventListener("close", () => closes.push("close"));
    dialog.showModal();
    await tick();
    const native = part<HTMLDialogElement>(dialog, "dialog");
    native.close();
    native.showModal();
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(dialog.open).toBe(true);
    expect(closes).toEqual([]);
    dialog.close();
    await vi.waitFor(() => expect(closes).toEqual(["close"]));
  });
});

describe("modal names", () => {
  test("alert dialog, drawer and sheet also take a title placed outside their header", async () => {
    const host = await render(`
      <ui-alert-dialog><ui-alert-dialog-title>Alert</ui-alert-dialog-title></ui-alert-dialog>
      <ui-drawer><ui-drawer-title>Drawer</ui-drawer-title></ui-drawer>
      <ui-sheet><ui-sheet-title>Sheet</ui-sheet-title></ui-sheet>`);
    const label = (el: Element | null) => part(el, "dialog").getAttribute("aria-label");
    expect(label(host.querySelector("ui-alert-dialog"))).toBe("Alert");
    expect(label(host.querySelector("ui-drawer"))).toBe("Drawer");
    const sheet = host.querySelector("ui-sheet");
    await tick();
    expect(label(shadow(sheet).querySelector("ui-dialog"))).toBe("Sheet");
  });
});

describe("sheet parts", () => {
  test("ui-sheet-trigger, header, title, description, footer and close", async () => {
    const host = await render(`
      <ui-sheet>
        <ui-sheet-trigger><ui-button>Open</ui-button></ui-sheet-trigger>
        <ui-sheet-header>
          <ui-sheet-title>Edit profile</ui-sheet-title>
          <ui-sheet-description>Make changes here.</ui-sheet-description>
        </ui-sheet-header>
        <ui-sheet-footer><ui-sheet-close><ui-button id="done">Done</ui-button></ui-sheet-close></ui-sheet-footer>
      </ui-sheet>`);
    const sheet = host.querySelector("ui-sheet") as Modal;
    button(host.querySelector("ui-sheet-trigger ui-button")).click();
    await tick();
    expect(sheet.open).toBe(true);
    await expect
      .element(page.getByRole("dialog", { name: "Edit profile" }))
      .toHaveAccessibleDescription("Make changes here.");
    await expect.element(page.getByRole("heading", { name: "Edit profile" })).toBeVisible();
    const inner = part(shadow(sheet).querySelector("ui-dialog"), "dialog");
    expect(
      Math.round(
        (host.querySelector("ui-sheet-footer") as HTMLElement).getBoundingClientRect().right,
      ),
    ).toBeLessThanOrEqual(Math.round(inner.getBoundingClientRect().right));
    button(host.querySelector("#done")).click();
    await tick();
    expect(sheet.open).toBe(false);
  });
});

describe("alert dialog parts", () => {
  test("ui-alert-dialog-trigger opens it; action and cancel close it with their values", async () => {
    const host = await render(`
      <ui-alert-dialog>
        <ui-alert-dialog-trigger><ui-button>Delete</ui-button></ui-alert-dialog-trigger>
        <ui-alert-dialog-header>
          <ui-alert-dialog-title>Are you sure?</ui-alert-dialog-title>
          <ui-alert-dialog-description>This cannot be undone.</ui-alert-dialog-description>
        </ui-alert-dialog-header>
        <ui-alert-dialog-footer>
          <ui-alert-dialog-cancel>Cancel</ui-alert-dialog-cancel>
          <ui-alert-dialog-action>Continue</ui-alert-dialog-action>
        </ui-alert-dialog-footer>
      </ui-alert-dialog>`);
    const dialog = host.querySelector("ui-alert-dialog") as Modal;
    const open = async () => {
      button(host.querySelector("ui-alert-dialog-trigger ui-button")).click();
      await tick();
      expect(dialog.open).toBe(true);
    };
    const choose = async (selector: string) => {
      button(part(host.querySelector(selector), "button")).click();
      await tick();
      expect(dialog.open).toBe(false);
      return dialog.returnValue;
    };
    await open();
    await expect
      .element(page.getByRole("alertdialog", { name: "Are you sure?" }))
      .toHaveAccessibleDescription("This cannot be undone.");
    expect(
      part(host.querySelector("ui-alert-dialog-cancel"), "button").getAttribute("variant"),
    ).toBe("outline");
    expect(await choose("ui-alert-dialog-cancel")).toBe("cancel");
    await open();
    expect(await choose("ui-alert-dialog-action")).toBe("action");
  });
});

describe("drawer parts", () => {
  test("ui-drawer-trigger, header, title, description, footer and close", async () => {
    const host = await render(`
      <ui-drawer>
        <ui-drawer-trigger><ui-button>Open</ui-button></ui-drawer-trigger>
        <ui-drawer-header>
          <ui-drawer-title>Move goal</ui-drawer-title>
          <ui-drawer-description>Set your daily goal.</ui-drawer-description>
        </ui-drawer-header>
        <ui-drawer-footer><ui-drawer-close><ui-button id="cancel">Cancel</ui-button></ui-drawer-close></ui-drawer-footer>
      </ui-drawer>`);
    const drawer = host.querySelector("ui-drawer") as Modal;
    button(host.querySelector("ui-drawer-trigger ui-button")).click();
    await tick();
    expect(drawer.open).toBe(true);
    await expect
      .element(page.getByRole("dialog", { name: "Move goal" }))
      .toHaveAccessibleDescription("Set your daily goal.");
    await expect.element(page.getByRole("heading", { name: "Move goal" })).toBeVisible();
    button(host.querySelector("#cancel")).click();
    await tick();
    expect(drawer.open).toBe(false);
  });
});

describe("popover parts", () => {
  test("ui-popover-trigger toggles ui-popover-content anchored to the trigger", async () => {
    const host = await render(`
      <ui-popover>
        <ui-popover-trigger><ui-button>Open</ui-button></ui-popover-trigger>
        <ui-popover-content width="96">
          <ui-popover-header>
            <ui-popover-title>Dimensions</ui-popover-title>
            <ui-popover-description>Set the dimensions.</ui-popover-description>
          </ui-popover-header>
        </ui-popover-content>
      </ui-popover>`);
    const trigger = button(host.querySelector("ui-popover-trigger ui-button"));
    const content = host.querySelector("ui-popover-content") as HTMLElement;
    expect(content.getAttribute("popover")).toBe("auto");
    await userEvent.click(trigger);
    expect(isOpen(content)).toBe(true);
    const box = content.getBoundingClientRect();
    expect(Math.round(box.width)).toBe(
      Math.round(
        Number.parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.25 * 96,
      ),
    );
    expect(box.top).toBeGreaterThanOrEqual(trigger.getBoundingClientRect().bottom);
    await expect.element(page.getByRole("heading", { name: "Dimensions" })).toBeVisible();
    await userEvent.click(trigger);
    expect(isOpen(content)).toBe(false);
  });

  test("ui-popover-content also opens from a ui-button command", async () => {
    const host = await render(`
      <ui-button commandfor="pop" command="toggle-popover">Toggle</ui-button>
      <ui-popover-content id="pop">Hello</ui-popover-content>`);
    button(host.querySelector("ui-button")).click();
    await tick();
    expect(isOpen(host.querySelector("#pop"))).toBe(true);
    (host.querySelector("#pop") as HTMLElement).hidePopover();
  });
});

describe("hover card parts", () => {
  test("ui-hover-card-content opens on focus and stays open while the pointer is over it", async () => {
    const host = await render(`
      <div style="padding-left: 900px">
        <ui-hover-card open-delay="0" close-delay="0">
          <ui-hover-card-trigger><a href="#profile">@realm</a></ui-hover-card-trigger>
          <ui-hover-card-content width="80">Profile</ui-hover-card-content>
        </ui-hover-card>
      </div>`);
    const card = host.querySelector("ui-hover-card-content") as HTMLElement;
    expect(card.getAttribute("popover")).toBe("manual");
    const trigger = part(host.querySelector("ui-hover-card-trigger"), "trigger");
    trigger.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await vi.waitFor(() => expect(isOpen(card)).toBe(true));
    const inner = part(card, "content");
    trigger.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    inner.dispatchEvent(new PointerEvent("pointerenter"));
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(isOpen(card)).toBe(true);
    inner.dispatchEvent(new PointerEvent("pointerleave"));
    await vi.waitFor(() => expect(isOpen(card)).toBe(false));
  });
});

describe("tooltip parts", () => {
  test("ui-tooltip-content is a tooltip shown next to its trigger", async () => {
    const host = await render(`
      <ui-tooltip delay="0">
        <ui-tooltip-trigger><ui-button>Save</ui-button></ui-tooltip-trigger>
        <ui-tooltip-content placement="bottom">Save the file</ui-tooltip-content>
      </ui-tooltip>`);
    const trigger = button(host.querySelector("ui-button"));
    const tip = host.querySelector("ui-tooltip-content") as HTMLElement;
    trigger.focus();
    await vi.waitFor(() => expect(isOpen(tip)).toBe(true));
    expect(internals(tip).role).toBe("tooltip");
    expect(trigger.getAttribute("aria-description")).toBe("Save the file");
    expect(tip.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      trigger.getBoundingClientRect().bottom,
    );
    tip.textContent = "Saved";
    await vi.waitFor(() => expect(trigger.getAttribute("aria-description")).toBe("Saved"));
    trigger.blur();
    expect(isOpen(tip)).toBe(false);
  });
});

describe("dropdown menu parts", () => {
  test("the trigger toggles the content and focus returns to it", async () => {
    const host = await render(`
      <ui-dropdown-menu>
        <ui-dropdown-menu-trigger><ui-button>Open</ui-button></ui-dropdown-menu-trigger>
        <ui-dropdown-menu-content placement="bottom-end">
          <ui-menu-label>My Account</ui-menu-label>
          <ui-menu-group>
            <ui-menu-item value="profile">Profile <ui-menu-shortcut>⇧⌘P</ui-menu-shortcut></ui-menu-item>
            <ui-menu-item value="billing">Billing</ui-menu-item>
          </ui-menu-group>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-item value="logout">Log out</ui-menu-item>
        </ui-dropdown-menu-content>
      </ui-dropdown-menu>`);
    const trigger = button(host.querySelector("ui-button"));
    const content = host.querySelector("ui-dropdown-menu-content") as HTMLElement;
    const items = [...host.querySelectorAll("ui-menu-item")] as HTMLElement[];
    await userEvent.click(trigger);
    expect(isOpen(content)).toBe(true);
    await vi.waitFor(() => expect(document.activeElement).toBe(items[0]));
    press(items[0] as Element, "ArrowDown");
    press(items[1] as Element, "ArrowDown");
    expect(document.activeElement).toBe(items[2]);
    expect(internals(content).role).toBe("menu");
    expect(internals(host.querySelector("ui-menu-group")).role).toBe("group");
    expect(internals(host.querySelector("ui-menu-separator")).role).toBe("separator");
    const shortcut = host.querySelector("ui-menu-shortcut") as HTMLElement;
    expect(Math.round(shortcut.getBoundingClientRect().right)).toBeGreaterThan(
      Math.round((items[0] as HTMLElement).getBoundingClientRect().right) - 16,
    );
    expect(content.matches(":state(attr-placement-is-bottom-end)")).toBe(true);
    expect(content.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      trigger.getBoundingClientRect().bottom,
    );
    await userEvent.click(trigger);
    expect(isOpen(content)).toBe(false);
    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    await vi.waitFor(() => expect(deepActive()).toBe(trigger));
  });

  test("checkbox items toggle and radio items pick one value", async () => {
    const host = await render(`
      <ui-dropdown-menu>
        <ui-dropdown-menu-trigger><ui-button>View</ui-button></ui-dropdown-menu-trigger>
        <ui-dropdown-menu-content>
          <ui-menu-checkbox-item value="status" checked>Status bar</ui-menu-checkbox-item>
          <ui-menu-checkbox-item value="panel" disabled>Panel</ui-menu-checkbox-item>
          <ui-menu-radio-group value="top">
            <ui-menu-radio-item value="top">Top</ui-menu-radio-item>
            <ui-menu-radio-item value="bottom">Bottom</ui-menu-radio-item>
            <ui-menu-radio-item value="right" disabled>Right</ui-menu-radio-item>
          </ui-menu-radio-group>
        </ui-dropdown-menu-content>
      </ui-dropdown-menu>`);
    const content = host.querySelector("ui-dropdown-menu-content") as HTMLElement;
    const [status, panel] = [...host.querySelectorAll("ui-menu-checkbox-item")] as HTMLElement[];
    const group = host.querySelector("ui-menu-radio-group") as HTMLElement & { value: string };
    const [top, bottom, right] = [...host.querySelectorAll("ui-menu-radio-item")] as HTMLElement[];
    const picks: unknown[] = [];
    content.addEventListener("select", (event) => picks.push((event as CustomEvent).detail));
    await tick();
    expect(internals(status).role).toBe("menuitemcheckbox");
    expect(internals(status).ariaChecked).toBe("true");
    expect(internals(top).role).toBe("menuitemradio");
    expect(internals(group).role).toBe("group");
    expect(top?.hasAttribute("checked")).toBe(true);
    (status as HTMLElement).click();
    expect(status?.hasAttribute("checked")).toBe(false);
    press(status as Element, "Enter");
    press(status as Element, "a");
    expect(status?.hasAttribute("checked")).toBe(true);
    (panel as HTMLElement).click();
    (bottom as HTMLElement).click();
    press(top as Element, " ");
    press(top as Element, "a");
    await tick();
    press(bottom as Element, "Enter");
    (right as HTMLElement).click();
    await tick();
    expect(group.value).toBe("bottom");
    expect(internals(bottom).ariaChecked).toBe("true");
    expect(internals(panel).ariaDisabled).toBe("true");
    expect(bottom?.hasAttribute("checked")).toBe(true);
    expect(top?.hasAttribute("checked")).toBe(false);
    expect(picks).toEqual([
      { value: "status", checked: false },
      { value: "status", checked: true },
      { value: "bottom" },
      { value: "top" },
      { value: "bottom" },
    ]);
  });

  test("an empty menu opens without moving focus", async () => {
    const host = await render(`
      <ui-dropdown-menu>
        <ui-dropdown-menu-trigger><ui-button>Empty</ui-button></ui-dropdown-menu-trigger>
        <ui-dropdown-menu-content></ui-dropdown-menu-content>
      </ui-dropdown-menu>
      <ui-context-menu><ui-context-menu-trigger>Area</ui-context-menu-trigger><ui-context-menu-content></ui-context-menu-content></ui-context-menu>
      <ui-menubar><ui-menubar-menu><ui-menubar-trigger>File</ui-menubar-trigger><ui-menubar-content></ui-menubar-content></ui-menubar-menu></ui-menubar>`);
    const trigger = button(host.querySelector("ui-button"));
    await userEvent.click(trigger);
    await tick();
    expect(isOpen(host.querySelector("ui-dropdown-menu-content"))).toBe(true);
    expect(deepActive()).toBe(trigger);
    part(host.querySelector("ui-context-menu-trigger"), "trigger").dispatchEvent(
      new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 10, clientY: 10 }),
    );
    await tick();
    expect(isOpen(host.querySelector("ui-context-menu-content"))).toBe(true);
    part<HTMLButtonElement>(host.querySelector("ui-menubar-trigger"), "trigger").click();
    await tick();
    expect(isOpen(host.querySelector("ui-menubar-content"))).toBe(true);
    (host.querySelector("ui-menubar-content") as HTMLElement).hidePopover();
  });
});

describe("context menu parts", () => {
  test("focus leaving the content closes it", async () => {
    const host = await render(`
      <button id="outside">Outside</button>
      <ui-context-menu>
        <ui-context-menu-trigger><div>Right click here</div></ui-context-menu-trigger>
        <ui-context-menu-content>
          <ui-menu-item value="back">Back <ui-menu-shortcut>⌘[</ui-menu-shortcut></ui-menu-item>
          <ui-menu-item value="forward">Forward</ui-menu-item>
        </ui-context-menu-content>
      </ui-context-menu>`);
    const content = host.querySelector("ui-context-menu-content") as HTMLElement;
    const [back, forward] = [...host.querySelectorAll("ui-menu-item")] as HTMLElement[];
    host
      .querySelector("ui-context-menu-trigger div")
      ?.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 5, clientY: 5 }),
      );
    await vi.waitFor(() => expect(document.activeElement).toBe(back));
    (forward as HTMLElement).focus();
    expect(isOpen(content)).toBe(true);
    (host.querySelector("#outside") as HTMLElement).focus();
    expect(isOpen(content)).toBe(false);
  });
});

describe("menubar parts", () => {
  test("menubar triggers open their menus and arrow keys move between triggers", async () => {
    const host = await render(`
      <ui-menubar>
        <ui-menubar-menu>
          <ui-menubar-trigger>File</ui-menubar-trigger>
          <ui-menubar-content>
            <ui-menu-item value="new">New Tab <ui-menu-shortcut>⌘T</ui-menu-shortcut></ui-menu-item>
            <ui-menu-item value="print">Print</ui-menu-item>
          </ui-menubar-content>
        </ui-menubar-menu>
        <ui-menubar-menu>
          <ui-menubar-trigger>Edit</ui-menubar-trigger>
          <ui-menubar-content><ui-menu-item value="undo">Undo</ui-menu-item></ui-menubar-content>
        </ui-menubar-menu>
      </ui-menubar>
      <button id="outside">Outside</button>`);
    const [file, edit] = [...host.querySelectorAll("ui-menubar-trigger")].map((el) =>
      part<HTMLButtonElement>(el, "trigger"),
    );
    const [fileMenu] = [...host.querySelectorAll("ui-menubar-content")] as HTMLElement[];
    const items = [...host.querySelectorAll("ui-menu-item")] as HTMLElement[];
    expect(internals(host.querySelector("ui-menubar")).role).toBe("menubar");
    expect(internals(fileMenu).role).toBe("menu");
    expect(file?.getAttribute("role")).toBe("menuitem");
    expect(file?.getAttribute("aria-haspopup")).toBe("menu");
    file?.focus();
    press(file as Element, "ArrowRight");
    expect(deepActive()).toBe(edit);
    file?.click();
    expect(isOpen(fileMenu)).toBe(true);
    await vi.waitFor(() => expect(document.activeElement).toBe(items[0]));
    expect((fileMenu as HTMLElement).getBoundingClientRect().top).toBeGreaterThanOrEqual(
      (file as HTMLElement).getBoundingClientRect().bottom,
    );
    (items[1] as HTMLElement).click();
    expect(isOpen(fileMenu)).toBe(false);
    file?.click();
    (items[0] as HTMLElement).focus();
    (host.querySelector("#outside") as HTMLElement).focus();
    expect(isOpen(fileMenu)).toBe(false);
    file?.click();
    file?.dispatchEvent(new PointerEvent("pointerdown"));
    file?.click();
    expect(isOpen(fileMenu)).toBe(false);
  });
});

describe("command parts", () => {
  test("ui-command groups options by optgroup and shows ui-command-empty when nothing matches", async () => {
    const host = await render(`
      <ui-command>
        <optgroup label="Suggestions"><option value="calendar">Calendar</option></optgroup>
        <option value="loose">Loose</option>
        <ui-command-empty>Nothing here.</ui-command-empty>
      </ui-command>
      <ui-command id="plain"><option value="a">Alpha</option></ui-command>`);
    const command = host.querySelector("ui-command") as HTMLElement;
    const root = shadow(command);
    expect([...root.querySelectorAll(".heading:not([hidden])")].map((h) => h.textContent)).toEqual([
      "Suggestions",
    ]);
    expect(root.querySelectorAll('[role="group"]')).toHaveLength(2);
    const input = part<HTMLInputElement>(command, "input");
    input.value = "zzz";
    input.dispatchEvent(new Event("input"));
    await tick();
    const empty = part(command, "empty");
    expect(empty.hidden).toBe(false);
    expect(empty.querySelector("slot")?.assignedElements()[0]?.textContent).toBe("Nothing here.");
    const plain = host.querySelector("#plain") as HTMLElement;
    const plainInput = part<HTMLInputElement>(plain, "input");
    plainInput.value = "zzz";
    plainInput.dispatchEvent(new Event("input"));
    await tick();
    expect(part(plain, "empty").textContent?.trim()).toBe("No results found.");
  });
});

describe("combobox and select sizing", () => {
  test("combobox and select fill their container, or take a width in spacing units", async () => {
    const host = await render(`
      <div id="box">
        <ui-combobox aria-label="Fruit"><option value="a">Apple</option><ui-combobox-empty>No fruit.</ui-combobox-empty></ui-combobox>
        <ui-combobox id="narrow" width="48" aria-label="Fruit"></ui-combobox>
        <ui-select aria-label="Fruit"><option value="a">Apple</option></ui-select>
        <ui-select id="small" width="40" aria-label="Fruit"><option value="a">Apple</option></ui-select>
      </div>`);
    const width = (el: Element | null) => Math.round((el as Element).getBoundingClientRect().width);
    const box = width(host.querySelector("#box"));
    const unit = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) * 0.25;
    expect(width(host.querySelector("ui-combobox"))).toBe(box);
    expect(width(host.querySelector("ui-select"))).toBe(box);
    expect(width(host.querySelector("#narrow"))).toBe(Math.round(unit * 48));
    expect(width(host.querySelector("#small"))).toBe(Math.round(unit * 40));
    const combo = host.querySelector("ui-combobox") as HTMLElement;
    const input = part<HTMLInputElement>(combo, "input");
    input.focus();
    input.value = "zzz";
    input.dispatchEvent(new Event("input"));
    await tick();
    const empty = part(combo, "empty");
    expect(empty.hidden).toBe(false);
    expect(empty.querySelector("slot")?.assignedElements()[0]?.textContent).toBe("No fruit.");
    input.blur();
  });
});
