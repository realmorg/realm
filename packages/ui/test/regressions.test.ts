import { describe, expect, test, vi } from "vitest";
import { server, userEvent } from "vitest/browser";
import { part, render, shadow, tick } from "./setup";

type Modal = HTMLElement & { open: boolean; showModal(): void; close(): void };

const internalsOf = new WeakMap<Element, ElementInternals>();
const attachInternals = HTMLElement.prototype.attachInternals;
HTMLElement.prototype.attachInternals = function (this: HTMLElement) {
  const internals = attachInternals.call(this);
  internalsOf.set(this, internals);
  return internals;
};

const deepActive = () => {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
};

const press = (target: Element, key: string) =>
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, composed: true, cancelable: true }),
  );

const box = (el: Element) => el.getBoundingClientRect();

describe("modal commands", () => {
  test("dialog, alert dialog, drawer and sheet open and close from ui-button commands without the -- prefix", async () => {
    const host = await render(`
      <ui-button id="open-d" commandfor="d" command="show-modal">Open</ui-button>
      <ui-dialog id="d"><ui-button id="close-d" commandfor="d" command="close">Close</ui-button><ui-button id="request-d" commandfor="d" command="request-close">Done</ui-button></ui-dialog>
      <ui-button id="open-a" commandfor="a" command="show-modal">Open</ui-button>
      <ui-alert-dialog id="a"><ui-button id="close-a" commandfor="a" command="close">Close</ui-button></ui-alert-dialog>
      <ui-button id="open-r" commandfor="r" command="show-modal">Open</ui-button>
      <ui-drawer id="r"><ui-button id="close-r" commandfor="r" command="request-close">Close</ui-button></ui-drawer>
      <ui-button id="open-s" commandfor="s" command="show-modal">Open</ui-button>
      <ui-sheet id="s"><ui-button id="close-s" commandfor="s" command="close">Close</ui-button><ui-button id="request-s" commandfor="s" command="--request-close">Done</ui-button></ui-sheet>`);
    const click = async (id: string) => {
      part<HTMLButtonElement>(host.querySelector(`#${id}`), "button").click();
      await tick();
    };
    const modal = (id: string) => host.querySelector(`#${id}`) as Modal;
    for (const [id, closer] of [
      ["d", "close-d"],
      ["d", "request-d"],
      ["a", "close-a"],
      ["r", "close-r"],
      ["s", "close-s"],
      ["s", "request-s"],
    ] as const) {
      await click(`open-${id}`);
      expect(modal(id).open).toBe(true);
      await click(closer);
      await vi.waitFor(() => expect(modal(id).open).toBe(false));
    }
  });
});

describe("menus return focus", () => {
  test("dropdown menu and navigation panel return focus to their trigger after Escape", async () => {
    const host = await render(`
      <ui-dropdown-menu><ui-dropdown-menu-trigger><ui-button>Options</ui-button></ui-dropdown-menu-trigger><ui-dropdown-menu-content><ui-menu-item value="a">A</ui-menu-item></ui-dropdown-menu-content></ui-dropdown-menu>
      <ui-navigation-menu><ui-navigation-menu-list><ui-navigation-menu-item><ui-navigation-menu-trigger>Products</ui-navigation-menu-trigger><ui-navigation-menu-content><a href="#a">Analytics</a></ui-navigation-menu-content></ui-navigation-menu-item></ui-navigation-menu-list></ui-navigation-menu>`);
    const trigger = host.querySelector("ui-button") as HTMLElement;
    await userEvent.click(part(trigger, "button"));
    await vi.waitFor(() => expect(document.activeElement).toBe(host.querySelector("ui-menu-item")));
    await userEvent.keyboard("{Escape}");
    await vi.waitFor(() => expect(deepActive()).toBe(part(trigger, "button")));

    const item = host.querySelector("ui-navigation-menu-item") as HTMLElement;
    const navigationTrigger = part(host.querySelector("ui-navigation-menu-trigger"), "trigger");
    await userEvent.click(navigationTrigger);
    expect(part(item, "panel").matches(":popover-open")).toBe(true);
    (host.querySelector('a[href="#a"]') as HTMLElement).focus();
    await userEvent.keyboard("{Escape}");
    await vi.waitFor(() => expect(deepActive()).toBe(navigationTrigger));
  });

  test("hover card closes on Escape", async () => {
    const host = await render(
      `<ui-hover-card open-delay="0" close-delay="0"><ui-hover-card-trigger><a href="#">@realm</a></ui-hover-card-trigger><ui-hover-card-content>Profile</ui-hover-card-content></ui-hover-card>`,
    );
    const card = host.querySelector("ui-hover-card-content") as Element;
    part(host.querySelector("ui-hover-card-trigger"), "trigger").dispatchEvent(
      new PointerEvent("pointerenter"),
    );
    await vi.waitFor(() => expect(card.matches(":popover-open")).toBe(true));
    press(document.body, "Escape");
    expect(card.matches(":popover-open")).toBe(false);
  });
});

describe("combobox and command", () => {
  test("clicking the combobox input keeps the list open, and leaving closes it", async () => {
    const host = await render(
      `<button id="outside">Outside</button><ui-combobox aria-label="Framework"><option value="realm">REALM</option><option value="lit">Lit</option></ui-combobox>`,
    );
    const combo = host.querySelector("ui-combobox") as HTMLElement;
    const list = part(combo, "list");
    await userEvent.click(part(combo, "input"));
    await tick();
    expect(list.matches(":popover-open")).toBe(true);
    await userEvent.click(host.querySelector("#outside") as HTMLElement);
    await tick();
    expect(list.matches(":popover-open")).toBe(false);
  });

  test("combobox and command point aria-activedescendant at the active option", async () => {
    const host = await render(`
      <ui-combobox aria-label="Framework"><option value="realm">REALM</option><option value="lit">Lit</option></ui-combobox>
      <ui-command><option value="a">Alpha</option><option value="b">Beta</option></ui-command>`);
    for (const el of [host.querySelector("ui-combobox"), host.querySelector("ui-command")]) {
      const input = part<HTMLInputElement>(el, "input");
      const active = () =>
        shadow(el).getElementById(input.getAttribute("aria-activedescendant") ?? "");
      input.focus();
      await tick();
      expect(active()?.textContent?.trim()).toBe(
        el?.localName === "ui-command" ? "Alpha" : "REALM",
      );
      press(input, "ArrowDown");
      await tick();
      expect(active()?.textContent?.trim()).toBe(el?.localName === "ui-command" ? "Beta" : "Lit");
      expect(active()?.getAttribute("role")).toBe("option");
    }
    const comboInput = part(host.querySelector("ui-combobox"), "input");
    press(comboInput, "Escape");
    await tick();
    expect(comboInput.hasAttribute("aria-activedescendant")).toBe(false);
  });
});

describe("required group controls", () => {
  test("required OTP input and radio group anchor their validation message on a focusable control", async () => {
    const host = await render(`
      <form id="otp"><ui-input-otp name="code" length="4" required value="12"></ui-input-otp></form>
      <form id="radio"><ui-radio-group name="plan" required><option value="free">Free</option><option value="pro">Pro</option></ui-radio-group></form>`);
    const otp = host.querySelector("ui-input-otp") as HTMLElement;
    expect((host.querySelector("#otp") as HTMLFormElement).reportValidity()).toBe(false);
    expect(shadow(otp).activeElement).toBe(shadow(otp).querySelectorAll("input")[2]);
    const radio = host.querySelector("ui-radio-group") as HTMLElement;
    expect((host.querySelector("#radio") as HTMLFormElement).reportValidity()).toBe(false);
    expect(shadow(radio).activeElement).toBe(shadow(radio).querySelector("input"));
  });
});

describe("form state", () => {
  test("checkbox clears indeterminate when clicked and can become indeterminate again", async () => {
    const host = await render(`<ui-checkbox indeterminate>Select all</ui-checkbox>`);
    const checkbox = host.querySelector("ui-checkbox") as HTMLElement & { indeterminate: boolean };
    const control = part<HTMLInputElement>(checkbox, "control");
    expect(control.indeterminate).toBe(true);
    control.click();
    await tick();
    expect(checkbox.indeterminate).toBe(false);
    checkbox.indeterminate = true;
    await tick();
    expect(control.indeterminate).toBe(true);
  });

  test("calendar marks today from the local date, not the UTC date", async () => {
    const east = new Date().getTimezoneOffset() < 0;
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(east ? new Date(2024, 0, 15, 0, 30) : new Date(2024, 0, 15, 23, 30));
    try {
      const host = await render(`<ui-calendar></ui-calendar>`);
      const today = shadow(host.querySelector("ui-calendar")).querySelector("[data-today]");
      expect(today?.getAttribute("data-date")).toBe("2024-01-15");
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("keyboard navigation", () => {
  test("pagination controls are focusable and work with Enter", async () => {
    const host = await render(
      `<ui-pagination page="5" total="10"></ui-pagination><ui-pagination id="links" page="2" total="3" href="?page={page}"></ui-pagination>`,
    );
    const pagination = host.querySelector("ui-pagination") as HTMLElement & { page: number };
    const next = part(pagination, "next");
    next.focus();
    expect(shadow(pagination).activeElement).toBe(next);
    await userEvent.keyboard("{Enter}");
    await tick();
    expect(pagination.page).toBe(6);
    const first = shadow(pagination).querySelector('[part="page"]') as HTMLElement;
    first.focus();
    expect(shadow(pagination).activeElement).toBe(first);
    const links = host.querySelector("#links") as Element;
    expect(part(links, "previous").getAttribute("href")).toBe("?page=1");
    expect(part(links, "next").getAttribute("href")).toBe("?page=3");
  });

  test("sidebar menu button select event is cancelable and stops the link", async () => {
    const host = await render(
      `<ui-sidebar-menu-button href="#sidebar-cancelled">Inbox</ui-sidebar-menu-button>`,
    );
    const item = host.querySelector("ui-sidebar-menu-button") as HTMLElement;
    item.addEventListener("select", (event) => event.preventDefault());
    const click = new MouseEvent("click", { bubbles: true, cancelable: true, composed: true });
    part(item, "button").dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    expect(location.hash).not.toBe("#sidebar-cancelled");
  });
});

describe("layout", () => {
  test("vertical button group and toggle group stack with joined top and bottom corners", async () => {
    const host = await render(`
      <ui-button-group orientation="vertical"><ui-button variant="outline">Alpha</ui-button><ui-button variant="outline">B</ui-button><ui-button variant="outline">Gamma</ui-button></ui-button-group>
      <ui-toggle-group orientation="vertical"><ui-toggle variant="outline" value="a">Alpha</ui-toggle><ui-toggle variant="outline" value="b">B</ui-toggle><ui-toggle variant="outline" value="c">Gamma</ui-toggle></ui-toggle-group>`);
    for (const group of host.querySelectorAll("ui-button-group, ui-toggle-group")) {
      const buttons = [...group.children].map((child) => part(child, "button"));
      const [first, middle, last] = buttons.map((button) => getComputedStyle(button));
      expect(box(buttons[1] as Element).top).toBeGreaterThan(box(buttons[0] as Element).top);
      expect(box(buttons[1] as Element).width).toBe(box(buttons[0] as Element).width);
      expect(first?.borderTopLeftRadius).not.toBe("0px");
      expect(first?.borderTopRightRadius).not.toBe("0px");
      expect(first?.borderBottomLeftRadius).toBe("0px");
      expect(middle?.borderTopLeftRadius).toBe("0px");
      expect(middle?.borderBottomRightRadius).toBe("0px");
      expect(last?.borderTopRightRadius).toBe("0px");
      expect(last?.borderBottomLeftRadius).not.toBe("0px");
    }
  });

  test("carousel slides include their borders and a vertical carousel fits the height it is given", async () => {
    const host = await render(`
      <div style="width: 300px">
        <ui-carousel><ui-carousel-content><ui-carousel-item><div style="border: 4px solid; padding: 8px">1</div></ui-carousel-item><ui-carousel-item>2</ui-carousel-item></ui-carousel-content></ui-carousel>
        <ui-carousel orientation="vertical" height="50"><ui-carousel-content><ui-carousel-item><div style="border: 4px solid">1</div></ui-carousel-item><ui-carousel-item>2</ui-carousel-item></ui-carousel-content><ui-carousel-previous></ui-carousel-previous><ui-carousel-next></ui-carousel-next></ui-carousel>
      </div>`);
    const [horizontal, vertical] = [...host.querySelectorAll("ui-carousel")] as Element[];
    const track = part((horizontal as Element).querySelector("ui-carousel-content"), "track");
    expect(
      box((horizontal as Element).querySelector("ui-carousel-item div") as Element).width,
    ).toBe(track.clientWidth);
    const verticalTrack = part((vertical as Element).querySelector("ui-carousel-content"), "track");
    expect(
      box((vertical as Element).querySelector("ui-carousel-next") as Element).bottom,
    ).toBeLessThanOrEqual(box(vertical as Element).bottom);
    expect(box((vertical as Element).querySelector("ui-carousel-item") as Element).height).toBe(
      verticalTrack.clientHeight,
    );
  });

  test("item without media starts its content at the padding, and is a list item inside an item group", async () => {
    const host = await render(`
      <ui-item id="plain"><ui-item-content><ui-item-title>Plain</ui-item-title></ui-item-content></ui-item>
      <ui-item-group><ui-item id="full"><ui-item-media>M</ui-item-media><ui-item-content>Full</ui-item-content><ui-item-actions><button>Go</button></ui-item-actions></ui-item></ui-item-group>`);
    const plain = host.querySelector("#plain") as Element;
    const full = host.querySelector("#full") as Element;
    await tick();
    expect(box(plain.querySelector("ui-item-content") as Element).left - box(plain).left).toBe(
      Number.parseFloat(getComputedStyle(plain).paddingLeft) + 1,
    );
    expect(internalsOf.get(full)?.role).toBe("listitem");
    expect(internalsOf.get(plain)?.role ?? null).toBeNull();
  });
});

describe("accessibility", () => {
  test("progress takes a label and is indeterminate without a value", async () => {
    const host = await render(
      `<ui-progress aria-label="Uploading"></ui-progress><ui-progress id="known" value="30" aria-label="Saved"></ui-progress>`,
    );
    const bar = part<HTMLProgressElement>(host.querySelector("ui-progress"), "bar");
    expect(bar.getAttribute("aria-label")).toBe("Uploading");
    expect(bar.hasAttribute("value")).toBe(false);
    expect(bar.position).toBe(-1);
    const known = host.querySelector("#known") as HTMLElement;
    const knownBar = part<HTMLProgressElement>(known, "bar");
    expect(knownBar.value).toBe(30);
    expect(knownBar.getAttribute("aria-label")).toBe("Saved");
    known.removeAttribute("value");
    await tick();
    expect(knownBar.position).toBe(-1);
  });

  test("tooltip describes its trigger", async () => {
    const host = await render(`
      <ui-tooltip><ui-tooltip-trigger><ui-button>Save</ui-button></ui-tooltip-trigger><ui-tooltip-content>Save the file</ui-tooltip-content></ui-tooltip>
      <ui-tooltip><ui-tooltip-trigger><button id="plain">Delete</button></ui-tooltip-trigger><ui-tooltip-content>Delete forever</ui-tooltip-content></ui-tooltip>`);
    await tick();
    expect(part(host.querySelector("ui-button"), "button").getAttribute("aria-description")).toBe(
      "Save the file",
    );
    expect(host.querySelector("#plain")?.getAttribute("aria-description")).toBe("Delete forever");
  });

  test("field set is a group named by its legend", async () => {
    const host = await render(
      `<ui-field-set><ui-field-legend>Profile</ui-field-legend><ui-input aria-label="Name"></ui-input></ui-field-set>`,
    );
    const internals = internalsOf.get(host.querySelector("ui-field-set") as Element);
    expect(internals?.role).toBe("group");
    expect(internals?.ariaLabelledByElements).toEqual([host.querySelector("ui-field-legend")]);
  });

  test("current breadcrumb, navigation and sidebar items use aria-current page", async () => {
    const host = await render(`
      <ui-breadcrumb-page>Here</ui-breadcrumb-page>
      <ui-navigation-menu-link href="#docs" current>Docs</ui-navigation-menu-link>
      <ui-sidebar-menu-button href="#inbox" current>Inbox</ui-sidebar-menu-button>
      <ui-sidebar-menu-button id="other" href="#other">Other</ui-sidebar-menu-button>`);
    expect(
      part(host.querySelector("ui-breadcrumb-page"), "page").getAttribute("aria-current"),
    ).toBe("page");
    expect(
      part(host.querySelector("ui-navigation-menu-link"), "link").getAttribute("aria-current"),
    ).toBe("page");
    expect(
      part(host.querySelector("ui-sidebar-menu-button"), "button").getAttribute("aria-current"),
    ).toBe("page");
    expect(part(host.querySelector("#other"), "button").hasAttribute("aria-current")).toBe(false);
  });
});

test("a sidebar menu button without href is a button that Enter and Space activate", async () => {
  const host = await render(
    `<ui-sidebar-menu-button>Settings</ui-sidebar-menu-button><ui-sidebar-menu-button href="#a">Home</ui-sidebar-menu-button>`,
  );
  const [plain, link] = [...host.querySelectorAll("ui-sidebar-menu-button")];
  const selects: string[] = [];
  host.addEventListener("select", () => selects.push("select"));
  const inner = part(plain as Element, "button");
  expect(inner.getAttribute("role")).toBe("button");
  expect(part(link as Element, "button").hasAttribute("role")).toBe(false);
  for (const key of ["Enter", " ", "x"])
    inner.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
  part(link as Element, "button").dispatchEvent(
    new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
  );
  expect(selects).toEqual(["select", "select"]);
});

test("Escape in a closed combobox is left for the dialog around it", async () => {
  const host = await render(
    `<ui-combobox aria-label="Fruit"><option value="a">Apple</option></ui-combobox>`,
  );
  const input = shadow(host.querySelector("ui-combobox")).querySelector(
    "input",
  ) as HTMLInputElement;
  const escapeKey = new KeyboardEvent("keydown", {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  });
  input.dispatchEvent(escapeKey);
  expect(escapeKey.defaultPrevented).toBe(false);
});

test("a radio group without enabled options still validates", async () => {
  const errors: unknown[] = [];
  const spy = vi.spyOn(console, "error").mockImplementation((...args) => errors.push(args));
  const host = await render(
    `<form><ui-radio-group name="unit" required><option value="a" disabled>A</option></ui-radio-group><ui-radio-group name="empty"></ui-radio-group></form>`,
  );
  await tick();
  expect(errors).toEqual([]);
  expect((host.querySelector("form") as HTMLFormElement).checkValidity()).toBe(false);
  spy.mockRestore();
});

describe("button fallbacks", () => {
  test("ui-button emulates invoker commands in browsers without them", async () => {
    const prototype = HTMLButtonElement.prototype;
    const native = Object.getOwnPropertyDescriptor(prototype, "commandForElement");
    if (native) Reflect.deleteProperty(prototype, "commandForElement");
    try {
      const host = await render(`
        <ui-button id="open" commandfor="target" command="show-modal">Open</ui-button>
        <ui-button id="toggle" commandfor="tip" command="toggle-popover">Toggle</ui-button>
        <ui-button id="nowhere" commandfor="missing" command="show-modal">Nowhere</ui-button>
        <ui-button id="silent" commandfor="target">Silent</ui-button>
        <dialog id="target"></dialog>
        <div id="tip" popover>Tip</div>`);
      const click = (id: string) =>
        part<HTMLButtonElement>(host.querySelector(`#${id}`), "button").click();
      const dialog = host.querySelector("dialog") as HTMLDialogElement;
      const commands: string[] = [];
      dialog.addEventListener("command", (event) => {
        commands.push((event as Event & { command: string }).command);
        if (commands.length > 1) event.preventDefault();
      });
      click("silent");
      click("nowhere");
      expect(dialog.open).toBe(false);
      click("open");
      expect(commands).toEqual(["show-modal"]);
      expect(dialog.open).toBe(true);
      dialog.close();
      click("open");
      expect(dialog.open).toBe(false);
      click("toggle");
      expect((host.querySelector("#tip") as HTMLElement).matches(":popover-open")).toBe(true);
    } finally {
      if (native) Object.defineProperty(prototype, "commandForElement", native);
    }
  });

  test("ui-button passes popovertargetaction to its button", async () => {
    const host = await render(
      `<ui-button popovertarget="menu" popovertargetaction="show">Show</ui-button><div id="menu" popover>Menu</div>`,
    );
    const button = part<HTMLButtonElement>(host.querySelector("ui-button"), "button");
    const menu = host.querySelector("#menu") as HTMLElement;
    expect(button.popoverTargetAction).toBe("show");
    button.click();
    button.click();
    expect(menu.matches(":popover-open")).toBe(true);
  });

  test("a ui-button disabled earlier in the same task does not submit", async () => {
    const host = await render(`<form><ui-button type="submit">Save</ui-button></form>`);
    const submits: string[] = [];
    host.querySelector("form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      submits.push("submit");
    });
    const button = host.querySelector("ui-button") as HTMLElement & { disabled: boolean };
    button.disabled = true;
    part<HTMLButtonElement>(button, "button").click();
    await tick();
    expect(submits).toEqual([]);
  });
});

describe("dialog edge cases", () => {
  test("alert dialog and drawer reopened before their close event stay open", async () => {
    const host = await render(`<ui-alert-dialog></ui-alert-dialog><ui-drawer></ui-drawer>`);
    for (const el of [host.querySelector("ui-alert-dialog"), host.querySelector("ui-drawer")]) {
      const modal = el as Modal;
      const closes: string[] = [];
      modal.addEventListener("close", () => closes.push("close"));
      modal.showModal();
      await tick();
      const native = part<HTMLDialogElement>(modal, "dialog");
      native.close();
      native.showModal();
      await tick();
      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(modal.open).toBe(true);
      expect(closes).toEqual([]);
      modal.close();
      await vi.waitFor(() => expect(closes).toEqual(["close"]));
    }
  });

  test("alert dialog closes on a request-close command", async () => {
    const host = await render(`<ui-alert-dialog open></ui-alert-dialog>`);
    const dialog = host.querySelector("ui-alert-dialog") as Modal;
    await tick();
    dialog.dispatchEvent(Object.assign(new Event("command"), { command: "request-close" }));
    await tick();
    expect(dialog.open).toBe(false);
  });

  test("dragging the drawer handle down with a real pointer closes it", async () => {
    const host = await render(
      `<ui-drawer><div style="height: 200px">Body</div><p id="end">End</p></ui-drawer>`,
    );
    const drawer = host.querySelector("ui-drawer") as Modal;
    drawer.showModal();
    await tick();
    await userEvent.dragAndDrop(part(drawer, "handle"), host.querySelector("#end") as Element);
    await vi.waitFor(() => expect(drawer.open).toBe(false));
  });
});

test("dragging a resizable handle with a real pointer resizes its panels", async () => {
  const host = await render(
    `<div style="width: 400px"><ui-resizable height="25"><ui-resizable-panel size="50">A</ui-resizable-panel><ui-resizable-handle></ui-resizable-handle><ui-resizable-panel size="50">B</ui-resizable-panel></ui-resizable></div>`,
  );
  const [first, second] = [...host.querySelectorAll("ui-resizable-panel")] as (HTMLElement & {
    size: number;
  })[];
  await userEvent.dragAndDrop(
    host.querySelector("ui-resizable-handle") as Element,
    second as Element,
  );
  // Playwright's WebKit reports movementX as 0 for automated mouse moves.
  if (server.browser !== "webkit") expect(first?.size).toBeGreaterThan(50);
});

describe("empty and missing values", () => {
  test("breadcrumb and navigation links that are not current have no aria-current", async () => {
    const host = await render(`
      <ui-breadcrumb-link href="#section">Section</ui-breadcrumb-link>
      <ui-navigation-menu-link href="#blog">Blog</ui-navigation-menu-link>`);
    expect(
      part(host.querySelector("ui-breadcrumb-link"), "link").hasAttribute("aria-current"),
    ).toBe(false);
    expect(
      part(host.querySelector("ui-navigation-menu-link"), "link").hasAttribute("aria-current"),
    ).toBe(false);
  });

  test("a carousel with no width reports the first slide", async () => {
    const host = await render(
      `<div style="width: 0"><ui-carousel><ui-carousel-content><ui-carousel-item>1</ui-carousel-item><ui-carousel-item>2</ui-carousel-item></ui-carousel-content></ui-carousel></div>`,
    );
    const carousel = host.querySelector("ui-carousel") as HTMLElement;
    const indexes: number[] = [];
    carousel.addEventListener("change", (event) =>
      indexes.push((event as CustomEvent).detail.index),
    );
    part(carousel.querySelector("ui-carousel-content"), "track").dispatchEvent(
      new Event("scrollend"),
    );
    expect(indexes).toEqual([0]);
  });

  test("chart plots missing values at zero", async () => {
    const host = await render(
      `<ui-chart y="a,b"></ui-chart><ui-chart id="line" type="line" y="a,b"></ui-chart>`,
    );
    const data = [{ label: "Mon", a: 4 }];
    for (const chart of host.querySelectorAll("ui-chart"))
      (chart as HTMLElement & { data: unknown }).data = data;
    await tick();
    const [bar, line] = [...host.querySelectorAll("ui-chart")] as Element[];
    const heights = [...shadow(bar as Element).querySelectorAll(".bars rect")].map((rect) =>
      Number(rect.getAttribute("height")),
    );
    expect(heights[0]).toBeGreaterThan(0);
    expect(heights[1]).toBe(0);
    expect(shadow(bar as Element).querySelectorAll(".bars rect")[1]?.textContent).toContain("b: 0");
    const zero = shadow(line as Element)
      .querySelectorAll(".line")[1]
      ?.getAttribute("d");
    expect(zero).toBe(`M${44 + (600 - 56) / 2},${240 - 28}`);
  });

  test("label without for does nothing, and a label for a native checkbox toggles it", async () => {
    const host = await render(
      `<ui-label id="plain">Plain</ui-label><ui-label for="native">Native</ui-label><input id="native" type="checkbox">`,
    );
    part(host.querySelector("#plain"), "label").click();
    part(host.querySelector('ui-label[for="native"]'), "label").click();
    const checkbox = host.querySelector("#native") as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
    expect(checkbox.getAttribute("aria-label")).toBe("Native");
  });

  test("sidebar group without a label has no accessible name", async () => {
    const host = await render(`<ui-sidebar-group></ui-sidebar-group>`);
    const internals = internalsOf.get(host.querySelector("ui-sidebar-group") as Element);
    expect(internals?.ariaLabel).toBeNull();
    expect(internals?.ariaLabelledByElements ?? []).toEqual([]);
  });

  test("slider with equal min and max shows an empty fill", async () => {
    const host = await render(`<ui-slider min="10" max="10" value="10"></ui-slider>`);
    const slider = host.querySelector("ui-slider") as HTMLElement;
    expect(slider.style.getPropertyValue("--state-range-percent")).toBe("0%");
  });

  test("table rows without ids render, and missing cells are empty", async () => {
    const host = await render(`<ui-table></ui-table>`);
    const table = host.querySelector("ui-table") as HTMLElement & {
      columns: unknown;
      rows: unknown;
    };
    table.columns = [{ key: "name" }, { key: "email" }];
    table.rows = [{ name: "Ada" }, { name: "Linus", email: "l@x.dev" }];
    await tick();
    expect(
      [...shadow(table).querySelectorAll("tbody tr")].map((tr) =>
        [...tr.querySelectorAll("td")].map((td) => td.textContent),
      ),
    ).toEqual([
      ["Ada", ""],
      ["Linus", "l@x.dev"],
    ]);
  });

  test("tooltip without content gives its trigger an empty description", async () => {
    const host = await render(
      `<ui-tooltip><ui-tooltip-trigger><button>Bare</button></ui-tooltip-trigger></ui-tooltip>`,
    );
    expect(host.querySelector("button")?.getAttribute("aria-description")).toBe("");
  });
});

describe("controls ignore no-op input", () => {
  test("collapsible does not fire toggle when open is set from script", async () => {
    const host = await render(
      `<ui-collapsible><ui-collapsible-trigger>More</ui-collapsible-trigger><ui-collapsible-content>Body</ui-collapsible-content></ui-collapsible>`,
    );
    const collapsible = host.querySelector("ui-collapsible") as HTMLElement & { open: boolean };
    const toggles: boolean[] = [];
    collapsible.addEventListener("toggle", () => toggles.push(collapsible.open));
    collapsible.open = true;
    await tick();
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(shadow(collapsible).querySelector("details")?.open).toBe(true);
    expect(toggles).toEqual([]);
  });

  test("hover card stays open on keys other than Escape", async () => {
    const host = await render(
      `<ui-hover-card open-delay="0" close-delay="0"><ui-hover-card-trigger><a href="#">@realm</a></ui-hover-card-trigger><ui-hover-card-content>Profile</ui-hover-card-content></ui-hover-card>`,
    );
    const card = host.querySelector("ui-hover-card-content") as Element;
    part(host.querySelector("ui-hover-card-trigger"), "trigger").dispatchEvent(
      new PointerEvent("pointerenter"),
    );
    await vi.waitFor(() => expect(card.matches(":popover-open")).toBe(true));
    press(document.body, "a");
    expect(card.matches(":popover-open")).toBe(true);
  });

  test("Backspace in an empty first OTP box changes nothing", async () => {
    const host = await render(`<ui-input-otp length="4"></ui-input-otp>`);
    const otp = host.querySelector("ui-input-otp") as HTMLElement & { value: string };
    const changes: string[] = [];
    otp.addEventListener("change", () => changes.push(otp.value));
    press(shadow(otp).querySelector("input") as Element, "Backspace");
    expect(otp.value).toBe("");
    expect(changes).toEqual([]);
  });

  test("pagination ignores the current page and the disabled ends", async () => {
    const host = await render(
      `<ui-pagination page="3" total="3" href="#page-{page}"></ui-pagination>`,
    );
    const pagination = host.querySelector("ui-pagination") as Element;
    const changes: number[] = [];
    pagination.addEventListener("change", (event) =>
      changes.push((event as CustomEvent).detail.page),
    );
    expect(part(pagination, "next").hasAttribute("href")).toBe(false);
    part(pagination, "next").click();
    (shadow(pagination).querySelector('[aria-current="page"]') as HTMLElement).click();
    expect(changes).toEqual([]);
  });
});

test("ui-select without a placeholder picks the selected or first option", async () => {
  const host = await render(`
    <ui-select id="first"><option value="a">A</option><option value="b">B</option></ui-select>
    <ui-select id="marked"><option value="a">A</option><option value="b" selected>B</option></ui-select>
    <ui-select id="valued" value="a"><option value="a">A</option><option value="b" selected>B</option></ui-select>
    <ui-select id="empty"></ui-select>`);
  const value = (id: string) =>
    (host.querySelector(`#${id}`) as HTMLElement & { value: string }).value;
  expect(value("first")).toBe("a");
  expect(value("marked")).toBe("b");
  expect(value("valued")).toBe("a");
  expect(value("empty")).toBe("");
  host.querySelector("#empty")?.append(new Option("Late", "late"));
  await tick();
  expect(value("empty")).toBe("late");
});

test("code block resets its copied indicator", async () => {
  const host = await render(`<ui-code-block><pre>x</pre></ui-code-block>`);
  const clipboard = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  const button = shadow(host.querySelector("ui-code-block")).querySelector(
    "ui-button",
  ) as HTMLElement;
  part<HTMLButtonElement>(button, "button").click();
  await vi.waitFor(() => expect(button.textContent?.trim()).toBe("✓"));
  await vi.waitFor(() => expect(button.textContent?.trim()).toBe("⧉"), { timeout: 3000 });
  clipboard.mockRestore();
});

test("removing a toaster stops its pending dismiss timers", async () => {
  const host = await render(`<ui-toaster duration="10000"></ui-toaster>`);
  const toaster = host.querySelector("ui-toaster") as HTMLElement & {
    toast(detail?: object): number;
  };
  const setTimer = vi.spyOn(window, "setTimeout");
  toaster.toast({ title: "Pending" });
  const timer = setTimer.mock.results.at(-1)?.value;
  setTimer.mockRestore();
  await tick();
  const clearTimer = vi.spyOn(window, "clearTimeout");
  toaster.remove();
  await tick();
  expect(clearTimer).toHaveBeenCalledWith(timer);
  clearTimer.mockRestore();
});

test("a toaster removed right after a toast is queued logs no error", async () => {
  const errors: unknown[] = [];
  const spy = vi.spyOn(console, "error").mockImplementation((...args) => errors.push(args));
  const host = await render(`<ui-toaster></ui-toaster>`);
  const toaster = host.querySelector("ui-toaster") as HTMLElement & {
    toast(detail: object): number;
  };
  toaster.toast({ title: "Bye" });
  toaster.remove();
  await tick();
  expect(errors).toEqual([]);
  spy.mockRestore();
});
