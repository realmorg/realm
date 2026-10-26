import { describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { part, render, shadow, tick } from "./setup";

describe("ui-toggle change", () => {
  test("change stays inside the shadow root that holds the toggle, like a native change", async () => {
    const host = await render(`<div id="outer"></div>`);
    const outer = host.querySelector("#outer") as HTMLElement;
    const root = outer.attachShadow({ mode: "open" });
    root.innerHTML = `<ui-toggle value="a">A</ui-toggle>`;
    await tick();
    const outside: Event[] = [];
    const inside: Event[] = [];
    outer.addEventListener("change", (event) => outside.push(event));
    root.addEventListener("change", (event) => inside.push(event));
    part<HTMLButtonElement>(root.querySelector("ui-toggle"), "button").click();
    expect(inside).toHaveLength(1);
    expect(outside).toHaveLength(0);
  });

  test("a toggle group fires one change with its new value", async () => {
    const host = await render(`
      <ui-toggle-group value="a"><ui-toggle value="a">A</ui-toggle><ui-toggle value="b">B</ui-toggle></ui-toggle-group>`);
    const group = host.querySelector("ui-toggle-group") as HTMLElement & { value: string };
    const values: string[] = [];
    group.addEventListener("change", () => values.push(group.value));
    const bubbled: string[] = [];
    host.addEventListener("change", () => bubbled.push(group.value));
    part<HTMLButtonElement>(group.querySelectorAll("ui-toggle")[1] as Element, "button").click();
    expect(values).toEqual(["b"]);
    expect(bubbled).toEqual(["b"]);
  });

  test("a toggle group ignores change events from other content", async () => {
    const host = await render(`
      <ui-toggle-group value="a"><ui-toggle value="a">A</ui-toggle><input type="checkbox"></ui-toggle-group>`);
    const group = host.querySelector("ui-toggle-group") as HTMLElement & { value: string };
    const checkbox = group.querySelector("input") as HTMLInputElement;
    const targets: EventTarget[] = [];
    group.addEventListener("change", (event) => targets.push(event.target as EventTarget));
    checkbox.click();
    expect(targets).toEqual([checkbox]);
    expect(group.value).toBe("a");
  });
});

describe("ui-input-otp", () => {
  test("the form is valid and holds the full code when complete fires", async () => {
    const host = await render(
      `<form><ui-input-otp name="code" length="2" required></ui-input-otp></form>`,
    );
    const form = host.querySelector("form") as HTMLFormElement;
    const otp = host.querySelector("ui-input-otp") as HTMLElement;
    const seen: { valid: boolean; code: unknown }[] = [];
    otp.addEventListener("complete", () =>
      seen.push({ valid: form.checkValidity(), code: new FormData(form).get("code") }),
    );
    for (const [index, digit] of ["4", "2"].entries()) {
      const box = shadow(otp).querySelectorAll("input")[index] as HTMLInputElement;
      box.value = digit;
      box.dispatchEvent(new Event("input", { bubbles: true }));
      await tick();
    }
    expect(seen).toEqual([{ valid: true, code: "42" }]);
  });

  test("the boxes on either side of a separator have rounded outer corners", async () => {
    const host = await render(`<ui-input-otp length="4" separator="2"></ui-input-otp>`);
    const boxes = [...shadow(host.querySelector("ui-input-otp")).querySelectorAll("input")];
    const corners = (box: Element) => {
      const style = getComputedStyle(box);
      return [
        style.borderTopLeftRadius,
        style.borderBottomLeftRadius,
        style.borderTopRightRadius,
        style.borderBottomRightRadius,
      ].map((radius) => radius !== "0px");
    };
    expect(corners(boxes[0] as Element)).toEqual([true, true, false, false]);
    expect(corners(boxes[1] as Element)).toEqual([false, false, true, true]);
    expect(corners(boxes[2] as Element)).toEqual([true, true, false, false]);
    expect(corners(boxes[3] as Element)).toEqual([false, false, true, true]);
  });
});

describe("form control names", () => {
  test("form-associated controls have a name property that mirrors the attribute", async () => {
    const tags = [
      "ui-button",
      "ui-calendar",
      "ui-checkbox",
      "ui-combobox",
      "ui-input",
      "ui-input-group",
      "ui-input-otp",
      "ui-radio-group",
      "ui-select",
      "ui-slider",
      "ui-switch",
      "ui-textarea",
      "ui-toggle-group",
    ];
    const host = await render(tags.map((tag) => `<${tag} name="${tag}-name"></${tag}>`).join(""));
    for (const tag of tags) {
      const control = host.querySelector(tag) as HTMLElement & { name: string };
      expect(control.name, tag).toBe(`${tag}-name`);
      control.name = "renamed";
      expect(control.getAttribute("name"), tag).toBe("renamed");
    }
  });
});

describe("custom validation messages", () => {
  test("ui-input passes title to its input and takes a custom validity like a native input", async () => {
    const host = await render(`
      <form>
        <ui-input name="handle" pattern="[a-z]+" title="Lowercase letters only"></ui-input>
        <ui-textarea name="bio"></ui-textarea>
        <ui-input-group name="slug"></ui-input-group>
      </form>`);
    const form = host.querySelector("form") as HTMLFormElement;
    const input = host.querySelector("ui-input") as HTMLElement & {
      setCustomValidity(message: string): void;
    };
    expect(part<HTMLInputElement>(input, "input").title).toBe("Lowercase letters only");
    for (const name of ["ui-input", "ui-textarea", "ui-input-group"]) {
      const field = host.querySelector(name) as HTMLElement & {
        setCustomValidity(message: string): void;
      };
      field.setCustomValidity("Taken");
      expect(form.checkValidity(), name).toBe(false);
      expect(
        (shadow(field).querySelector("input, textarea") as HTMLInputElement).validationMessage,
      ).toBe("Taken");
      field.setCustomValidity("");
      expect(form.checkValidity(), name).toBe(true);
    }
  });

  test("ui-input-group forwards the same input attributes as ui-input", async () => {
    const host = await render(`
      <ui-input-group pattern="[0-9]+" minlength="2" maxlength="4" autocomplete="postal-code"
        inputmode="numeric" readonly invalid title="Digits"></ui-input-group>`);
    const input = part<HTMLInputElement>(host.querySelector("ui-input-group"), "input");
    expect(input.pattern).toBe("[0-9]+");
    expect(input.minLength).toBe(2);
    expect(input.maxLength).toBe(4);
    expect(input.getAttribute("autocomplete")).toBe("postal-code");
    expect(input.inputMode).toBe("numeric");
    expect(input.readOnly).toBe(true);
    expect(input.title).toBe("Digits");
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });
});

describe("ui-tabs-list stretch", () => {
  test("a stretched tabs list fills its container and shares the width between triggers", async () => {
    const host = await render(`
      <div style="width: 400px">
        <ui-tabs value="a">
          <ui-tabs-list stretch>
            <ui-tabs-trigger value="a">A</ui-tabs-trigger>
            <ui-tabs-trigger value="b">Longer label</ui-tabs-trigger>
          </ui-tabs-list>
        </ui-tabs>
      </div>`);
    expect(host.querySelector("ui-tabs-list")?.getBoundingClientRect().width).toBe(400);
    const [first, second] = [...host.querySelectorAll("ui-tabs-trigger")].map(
      (trigger) => trigger.getBoundingClientRect().width,
    );
    expect(first).toBeCloseTo(second as number, 0);
  });
});

describe("ui-alert-dialog-action disabled", () => {
  test("a disabled action does not close the dialog until it is enabled", async () => {
    const host = await render(`
      <ui-alert-dialog>
        <ui-alert-dialog-trigger><ui-button>Delete</ui-button></ui-alert-dialog-trigger>
        <ui-alert-dialog-header><ui-alert-dialog-title>Delete?</ui-alert-dialog-title></ui-alert-dialog-header>
        <ui-alert-dialog-footer>
          <ui-alert-dialog-action disabled>Delete</ui-alert-dialog-action>
        </ui-alert-dialog-footer>
      </ui-alert-dialog>`);
    const dialog = host.querySelector("ui-alert-dialog") as HTMLElement & { open: boolean };
    part<HTMLButtonElement>(
      host.querySelector("ui-alert-dialog-trigger ui-button"),
      "button",
    ).click();
    await tick();
    expect(dialog.open).toBe(true);
    const action = host.querySelector("ui-alert-dialog-action") as HTMLElement & {
      disabled: boolean;
    };
    const button = part(action, "button");
    expect(part<HTMLButtonElement>(button, "button").disabled).toBe(true);
    button.click();
    await tick();
    expect(dialog.open).toBe(true);
    action.disabled = false;
    await tick();
    button.click();
    await tick();
    expect(dialog.open).toBe(false);
  });
});

describe("ui-button click()", () => {
  test("click() on a submit button submits its form once, like a native button", async () => {
    const host = await render(`<form><ui-button type="submit">Save</ui-button></form>`);
    const form = host.querySelector("form") as HTMLFormElement;
    let submits = 0;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submits++;
    });
    const button = host.querySelector("ui-button") as HTMLElement;
    let clicks = 0;
    button.addEventListener("click", () => clicks++);
    button.click();
    expect(submits).toBe(1);
    expect(clicks).toBe(1);
    await userEvent.click(button);
    expect(submits).toBe(2);
    expect(clicks).toBe(2);
  });

  test("click() on a link button follows the link, and on a disabled button does nothing", async () => {
    const host = await render(`
      <ui-button id="link" href="#clicked">Go</ui-button>
      <ui-button id="off" disabled>Off</ui-button>`);
    const link = host.querySelector("#link") as HTMLElement;
    const anchor = part(link, "button");
    let followed = 0;
    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      followed++;
    });
    link.click();
    expect(followed).toBe(1);
    const off = host.querySelector("#off") as HTMLElement;
    let clicks = 0;
    off.addEventListener("click", () => clicks++);
    off.click();
    expect(clicks).toBe(0);
    expect(getComputedStyle(off).pointerEvents).toBe("none");
  });
});

describe("ui-chart sizing, ticks and sparkline", () => {
  const sales = [
    { label: "Mon", value: 12_400 },
    { label: "Tue", value: 31_800 },
    { label: "Wed", value: 27_150 },
  ];

  test("text and strokes keep their size at any chart width", async () => {
    const host = await render(`
      <div style="width: 300px"><ui-chart id="narrow" type="line"></ui-chart></div>
      <div style="width: 900px"><ui-chart id="wide" type="line"></ui-chart></div>`);
    const charts = [...host.querySelectorAll("ui-chart")] as (HTMLElement & { data: unknown })[];
    for (const chart of charts) chart.data = sales;
    await tick();
    const sizes = charts.map((chart) => {
      const root = shadow(chart);
      const svg = root.querySelector("svg") as SVGSVGElement;
      const label = root.querySelector(".label") as SVGTextElement;
      return {
        viewBox: svg.getAttribute("viewBox"),
        height: svg.getBoundingClientRect().height,
        text: label.getBoundingClientRect().height,
      };
    });
    expect(sizes[0]?.viewBox).toBe("0 0 300 240");
    expect(sizes[1]?.viewBox).toBe("0 0 900 240");
    expect(sizes[0]?.height).toBe(240);
    expect(sizes[1]?.height).toBe(240);
    expect(sizes[0]?.text).toBeCloseTo(sizes[1]?.text as number, 0);
    const wide = host.querySelector("#wide") as HTMLElement;
    (wide.parentElement as HTMLElement).style.width = "600px";
    await expect
      .poll(() => shadow(wide).querySelector("svg")?.getAttribute("viewBox"))
      .toBe("0 0 600 240");
  });

  test("a hidden chart keeps drawing at its last width", async () => {
    const host = await render(`<div hidden><ui-chart></ui-chart></div>`);
    const chart = host.querySelector("ui-chart") as HTMLElement;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    expect(shadow(chart).querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 600 240");
  });

  test("y-axis ticks are rounded numbers", async () => {
    const host = await render(`<ui-chart></ui-chart>`);
    const chart = host.querySelector("ui-chart") as HTMLElement & { data: unknown };
    chart.data = sales;
    await tick();
    expect([...shadow(chart).querySelectorAll(".tick")].map((tick) => tick.textContent)).toEqual([
      "0",
      "10K",
      "20K",
      "30K",
      "40K",
    ]);
  });

  test("a sparkline draws only the series, edge to edge", async () => {
    const host = await render(
      `<div style="width: 200px"><ui-chart variant="sparkline" type="line" height="40" y="a,b"></ui-chart></div>`,
    );
    const chart = host.querySelector("ui-chart") as HTMLElement & { data: unknown };
    chart.data = [
      { a: 1, b: 2 },
      { a: 3, b: 1 },
    ];
    await tick();
    const root = shadow(chart);
    for (const selector of [".axes", ".label", ".legend"])
      for (const element of root.querySelectorAll(selector))
        expect(getComputedStyle(element).display, selector).toBe("none");
    expect(root.querySelector("svg")?.getBoundingClientRect().height).toBe(40);
    const line = root.querySelector(".line") as SVGPathElement;
    const box = line.getBBox();
    expect(box.x).toBe(2);
    expect(box.x + box.width).toBe(198);
  });
});

describe("ui-code-block in a narrow container", () => {
  test("the language label and copy button sit above the first line of code", async () => {
    const host = await render(`
      <div style="width: 320px">
        <ui-code-block language="html"><pre>&lt;ui-button variant="outline"&gt;Save changes&lt;/ui-button&gt;</pre></ui-code-block>
      </div>
      <div style="width: 800px">
        <ui-code-block id="wide" language="html"><pre>x</pre></ui-code-block>
      </div>`);
    const block = host.querySelector("ui-code-block") as Element;
    const bar = part(block, "bar").getBoundingClientRect();
    const code = (block.querySelector("pre") as Element).getBoundingClientRect();
    expect(code.top).toBeGreaterThanOrEqual(bar.bottom);
    const wide = host.querySelector("#wide") as Element;
    expect(
      (wide.querySelector("pre") as Element).getBoundingClientRect().top -
        wide.getBoundingClientRect().top,
    ).toBeLessThan(bar.height);
  });
});

describe("ui-avatar group and fallback", () => {
  const RING = 2;

  test("overlapping avatars keep their initials visible at every size", async () => {
    const host = await render(
      ["sm", "default", "lg"]
        .map(
          (size) => `
            <ui-avatar-group>
              <ui-avatar size="${size}"><ui-avatar-fallback>MR</ui-avatar-fallback></ui-avatar>
              <ui-avatar size="${size}"><ui-avatar-fallback>JD</ui-avatar-fallback></ui-avatar>
              <ui-avatar size="${size}"><ui-avatar-fallback>AB</ui-avatar-fallback></ui-avatar>
            </ui-avatar-group>`,
        )
        .join(""),
    );
    for (const group of host.querySelectorAll("ui-avatar-group")) {
      const avatars = [...group.querySelectorAll("ui-avatar")];
      for (const [index, avatar] of avatars.slice(0, -1).entries()) {
        const range = document.createRange();
        range.selectNodeContents(avatar.querySelector("ui-avatar-fallback") as Node);
        const text = range.getBoundingClientRect();
        const next = (avatars[index + 1] as Element).getBoundingClientRect();
        expect(next.left, avatar.getAttribute("size") as string).toBeLessThan(
          avatar.getBoundingClientRect().right,
        );
        expect(text.right, avatar.getAttribute("size") as string).toBeLessThanOrEqual(
          next.left - RING,
        );
      }
    }
  });

  test("the group count matches the avatar size and fits its text", async () => {
    const host = await render(`
      <ui-avatar-group>
        <ui-avatar size="lg"><ui-avatar-fallback>MR</ui-avatar-fallback></ui-avatar>
        <ui-avatar-group-count size="lg">+24k</ui-avatar-group-count>
      </ui-avatar-group>
      <ui-avatar-group>
        <ui-avatar size="sm"><ui-avatar-fallback>MR</ui-avatar-fallback></ui-avatar>
        <ui-avatar-group-count size="sm">+3</ui-avatar-group-count>
      </ui-avatar-group>`);
    for (const group of host.querySelectorAll("ui-avatar-group")) {
      const avatar = (group.querySelector("ui-avatar") as Element).getBoundingClientRect();
      const count = group.querySelector("ui-avatar-group-count") as HTMLElement;
      expect(count.getBoundingClientRect().height).toBe(avatar.height);
      expect(count.getBoundingClientRect().width).toBeGreaterThanOrEqual(avatar.width);
      const range = document.createRange();
      range.selectNodeContents(count);
      const text = range.getBoundingClientRect();
      expect(text.left).toBeGreaterThanOrEqual(count.getBoundingClientRect().left);
      expect(text.right).toBeLessThanOrEqual(count.getBoundingClientRect().right);
    }
  });

  test("the fallback keeps its own colours on a coloured panel", async () => {
    const host = await render(`
      <div style="background: var(--primary); color: var(--primary-foreground)">
        <ui-avatar><ui-avatar-fallback>MR</ui-avatar-fallback></ui-avatar>
      </div>
      <p id="muted" style="color: var(--muted-foreground)">x</p>`);
    const fallback = part(host.querySelector("ui-avatar-fallback"), "fallback");
    expect(getComputedStyle(fallback).color).toBe(
      getComputedStyle(host.querySelector("#muted") as Element).color,
    );
  });
});
