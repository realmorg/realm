import { describe, expect, test } from "vitest";
import { part, render, shadow, tick } from "./setup";

type Field = HTMLElement & { value: string; checked: boolean };

const typeInto = async (input: HTMLInputElement | HTMLTextAreaElement, value: string) => {
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
  await tick();
};

describe("ui-button", () => {
  test("renders variants and submits or resets its form", async () => {
    const host = await render(`
      <form>
        <input name="plain" value="start">
        <ui-button id="submit" type="submit" variant="destructive" size="sm">Save</ui-button>
        <ui-button id="reset" type="reset" variant="outline">Reset</ui-button>
        <ui-button id="off" type="submit" disabled>Off</ui-button>
      </form>`);
    const form = host.querySelector("form") as HTMLFormElement;
    let submits = 0;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submits++;
    });
    part<HTMLButtonElement>(host.querySelector("#submit"), "button").click();
    expect(submits).toBe(1);
    (form.elements.namedItem("plain") as HTMLInputElement).value = "changed";
    part<HTMLButtonElement>(host.querySelector("#reset"), "button").click();
    expect((form.elements.namedItem("plain") as HTMLInputElement).value).toBe("start");
    const off = part<HTMLButtonElement>(host.querySelector("#off"), "button");
    expect(off.disabled).toBe(true);
    off.click();
    expect(submits).toBe(1);
    const background = getComputedStyle(
      part(host.querySelector("#submit"), "button"),
    ).backgroundColor;
    expect(background).not.toBe(
      getComputedStyle(part(host.querySelector("#reset"), "button")).backgroundColor,
    );
  });

  test("opens popovers and dialogs through native invoker attributes", async () => {
    const host = await render(`
      <ui-button popovertarget="pop">Open</ui-button>
      <ui-popover-content id="pop">Hello</ui-popover-content>
      <ui-button commandfor="dlg" command="--show-modal">Dialog</ui-button>
      <ui-dialog id="dlg"><ui-dialog-header><ui-dialog-title>Title</ui-dialog-title></ui-dialog-header>Body</ui-dialog>`);
    const [popButton, dialogButton] = [...host.querySelectorAll("ui-button")];
    part<HTMLButtonElement>(popButton as Element, "button").click();
    expect((host.querySelector("#pop") as HTMLElement).matches(":popover-open")).toBe(true);
    part<HTMLButtonElement>(dialogButton as Element, "button").click();
    await tick();
    const dialog = host.querySelector("#dlg") as HTMLElement & { open: boolean; close(): void };
    expect(dialog.open).toBe(true);
    expect(part<HTMLDialogElement>(dialog, "dialog").open).toBe(true);
    dialog.close();
    await tick();
  });
});

describe("text fields", () => {
  test("ui-input submits its current value, validates and resets to the value attribute", async () => {
    const host = await render(
      `<form><ui-input name="email" type="email" value="a@b.co" required placeholder="Email"></ui-input></form>`,
    );
    const form = host.querySelector("form") as HTMLFormElement;
    const field = host.querySelector("ui-input") as Field;
    const input = part<HTMLInputElement>(field, "input");
    expect(input.placeholder).toBe("Email");
    expect(new FormData(form).get("email")).toBe("a@b.co");
    const changes: string[] = [];
    field.addEventListener("change", () => changes.push(field.value));
    await typeInto(input, "bad");
    expect(field.value).toBe("bad");
    expect(form.checkValidity()).toBe(false);
    await typeInto(input, "ok@realm.dev");
    expect(form.checkValidity()).toBe(true);
    expect(changes).toEqual(["bad", "ok@realm.dev"]);
    form.reset();
    await tick();
    expect(field.value).toBe("a@b.co");
    field.value = "set@realm.dev";
    await tick();
    expect(input.value).toBe("set@realm.dev");
  });

  test("ui-input and ui-textarea follow fieldset disabling", async () => {
    const host = await render(
      `<form><fieldset><ui-input name="a"></ui-input><ui-textarea name="b" value="note" rows="2"></ui-textarea></fieldset></form>`,
    );
    const fieldset = host.querySelector("fieldset") as HTMLFieldSetElement;
    fieldset.disabled = true;
    await tick();
    expect(part<HTMLInputElement>(host.querySelector("ui-input"), "input").disabled).toBe(true);
    expect(part<HTMLTextAreaElement>(host.querySelector("ui-textarea"), "textarea").disabled).toBe(
      true,
    );
    fieldset.disabled = false;
    await tick();
    const textarea = part<HTMLTextAreaElement>(host.querySelector("ui-textarea"), "textarea");
    expect(textarea.disabled).toBe(false);
    expect(textarea.rows).toBe(2);
    await typeInto(textarea, "longer note");
    expect(new FormData(host.querySelector("form") as HTMLFormElement).get("b")).toBe(
      "longer note",
    );
  });
});

describe("choices", () => {
  test("ui-checkbox and ui-switch submit when checked and expose :state(attr-checked)", async () => {
    const host = await render(
      `<form><ui-checkbox name="terms" checked>Accept</ui-checkbox><ui-switch name="alerts" value="yes">Alerts</ui-switch></form>`,
    );
    const form = host.querySelector("form") as HTMLFormElement;
    const checkbox = host.querySelector("ui-checkbox") as Field;
    const toggle = host.querySelector("ui-switch") as Field;
    expect(new FormData(form).get("terms")).toBe("on");
    expect(new FormData(form).get("alerts")).toBeNull();
    expect(checkbox.matches(":state(attr-checked)")).toBe(true);
    part<HTMLInputElement>(checkbox, "control").click();
    part<HTMLInputElement>(toggle, "control").click();
    await tick();
    expect(checkbox.checked).toBe(false);
    expect(new FormData(form).get("alerts")).toBe("yes");
    expect(part(toggle, "control").getAttribute("aria-checked")).toBe("true");
    form.reset();
    await tick();
    expect(checkbox.checked).toBe(true);
    expect(toggle.checked).toBe(false);
    part<HTMLLabelElement>(checkbox, "label").click();
    await tick();
    expect(checkbox.checked).toBe(false);
  });

  test("ui-radio-group reads options, is required and changes value", async () => {
    const host = await render(
      `<form><ui-radio-group name="plan" required><option value="free">Free</option><option value="pro">Pro</option><option value="team" disabled>Team</option></ui-radio-group></form>`,
    );
    const form = host.querySelector("form") as HTMLFormElement;
    const group = host.querySelector("ui-radio-group") as Field;
    const radios = [...shadow(group).querySelectorAll("input")];
    expect(radios).toHaveLength(3);
    expect(radios[2]?.disabled).toBe(true);
    expect(form.checkValidity()).toBe(false);
    radios[1]?.click();
    await tick();
    expect(group.value).toBe("pro");
    expect(new FormData(form).get("plan")).toBe("pro");
    expect(form.checkValidity()).toBe(true);
    group.querySelector("option")?.remove();
    await tick();
    expect(shadow(group).querySelectorAll("input")).toHaveLength(2);
  });

  test("ui-select mirrors light-DOM options with a placeholder", async () => {
    const host = await render(
      `<form><ui-select name="fruit" placeholder="Pick one" required><option value="apple">Apple</option><option value="pear">Pear</option></ui-select></form>`,
    );
    const form = host.querySelector("form") as HTMLFormElement;
    const field = host.querySelector("ui-select") as Field;
    const select = part<HTMLSelectElement>(field, "control");
    expect([...select.options].map((option) => option.label)).toEqual([
      "Pick one",
      "Apple",
      "Pear",
    ]);
    expect(form.checkValidity()).toBe(false);
    select.value = "pear";
    select.dispatchEvent(new Event("change"));
    await tick();
    expect(field.value).toBe("pear");
    expect(new FormData(form).get("fruit")).toBe("pear");
    form.reset();
    await tick();
    expect(field.value).toBe("");
  });

  test("ui-slider does not rewrite its control while it is dragged", async () => {
    const host = await render(`<ui-slider value="10"></ui-slider>`);
    const slider = host.querySelector("ui-slider") as Field;
    const input = part<HTMLInputElement>(slider, "control");
    expect(input.value).toBe("10");
    const native = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ) as PropertyDescriptor;
    const writes: unknown[] = [];
    Object.defineProperty(input, "value", {
      get: () => native.get?.call(input),
      set(value) {
        writes.push(value);
        native.set?.call(input, value);
      },
    });
    native.set?.call(input, "40");
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await tick();
    expect(slider.value).toBe(40);
    expect(writes).toEqual([]);
    (slider as unknown as { value: number }).value = 70;
    await tick();
    expect(writes).toEqual(["70"]);
  });

  test("ui-slider keeps touch drags to itself", async () => {
    const host = await render(`<ui-slider value="10"></ui-slider>`);
    const input = part(host.querySelector("ui-slider"), "control");
    expect(getComputedStyle(input).touchAction).toBe("none");
  });

  test("ui-slider reports its value and fill percentage", async () => {
    const host = await render(
      `<form><ui-slider name="volume" value="25" min="0" max="50" step="5"></ui-slider></form>`,
    );
    const slider = host.querySelector("ui-slider") as Field;
    const input = part<HTMLInputElement>(slider, "control");
    expect(slider.style.getPropertyValue("--state-range-percent")).toBe("50%");
    input.value = "50";
    input.dispatchEvent(new Event("input"));
    await tick();
    expect(String(slider.value)).toBe("50");
    expect(slider.style.getPropertyValue("--state-range-percent")).toBe("100%");
    expect(new FormData(host.querySelector("form") as HTMLFormElement).get("volume")).toBe("50");
  });
});
