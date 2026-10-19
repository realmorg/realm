import { describe, expect, test } from "vitest";
import { part, render, shadow, tick } from "./setup";

describe("display components", () => {
  test("card, badge, alert, separator, skeleton and progress render with roles and parts", async () => {
    const host = await render(`
      <ui-card><ui-card-header><ui-card-title>Plan</ui-card-title><ui-card-description>Monthly</ui-card-description></ui-card-header><ui-card-content>Body</ui-card-content><ui-card-footer><ui-button>Go</ui-button></ui-card-footer></ui-card>
      <ui-badge variant="secondary">New</ui-badge>
      <ui-alert variant="destructive"><ui-alert-title>Error</ui-alert-title><ui-alert-description>Something failed.</ui-alert-description></ui-alert>
      <ui-separator orientation="vertical"></ui-separator>
      <ui-skeleton width="16" height="4"></ui-skeleton>
      <ui-progress value="40"></ui-progress>`);
    expect(part(host.querySelector("ui-card-title"), "title")).not.toBeNull();
    expect(getComputedStyle(host.querySelector("ui-badge") as Element).borderRadius).not.toBe(
      "0px",
    );
    expect(
      (host.querySelector("ui-alert") as Element & { computedRole?: string }).computedRole ??
        "alert",
    ).toBe("alert");
    expect((host.querySelector("ui-separator") as HTMLElement).getBoundingClientRect().width).toBe(
      1,
    );
    expect(part<HTMLProgressElement>(host.querySelector("ui-progress"), "bar").value).toBe(40);
  });

  test("components scale with the global design tokens", async () => {
    const host = await render(
      `<ui-button>Default</ui-button><div style="--spacing: 0.5rem; --text-sm: 1rem; --radius-md: 14px"><ui-button>Scaled</ui-button></div>`,
    );
    const [normal, scaled] = [...host.querySelectorAll("ui-button")].map((el) =>
      getComputedStyle(part(el, "button")),
    );
    expect(normal?.height).toBe("36px");
    expect(scaled?.height).toBe("72px");
    expect(scaled?.fontSize).toBe("16px");
    expect(scaled?.borderTopLeftRadius).toBe("14px");
  });

  test("ui-avatar shows the fallback until the image loads, and when it fails", async () => {
    const pixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    const host = await render(
      `<ui-avatar id="ok"><ui-avatar-image src="${pixel}" alt="me"></ui-avatar-image><ui-avatar-fallback>AB</ui-avatar-fallback></ui-avatar><ui-avatar id="bad"><ui-avatar-image src="data:image/png;base64,broken"></ui-avatar-image><ui-avatar-fallback>CD</ui-avatar-fallback></ui-avatar>`,
    );
    const fallback = (id: string) =>
      part(host.querySelector(`${id} ui-avatar-fallback`), "fallback");
    const image = (id: string) =>
      part<HTMLImageElement>(host.querySelector(`${id} ui-avatar-image`), "image");
    await new Promise((resolve) => setTimeout(resolve, 50));
    await tick();
    expect(fallback("#ok")).toBeNull();
    expect(image("#ok").hidden).toBe(false);
    expect(fallback("#bad")).not.toBeNull();
    expect(image("#bad")).toBeNull();
  });

  test("ui-table renders columns and rows from properties", async () => {
    const host = await render(`<ui-table caption="Invoices"></ui-table>`);
    const table = host.querySelector("ui-table") as HTMLElement & {
      columns: unknown;
      rows: unknown;
    };
    table.columns = [{ key: "id", label: "Invoice" }, { key: "amount" }];
    table.rows = [
      { id: "INV001", amount: "$250" },
      { id: "INV002", amount: "$150" },
    ];
    await tick();
    const root = shadow(table);
    expect([...root.querySelectorAll("th")].map((th) => th.textContent)).toEqual([
      "Invoice",
      "amount",
    ]);
    expect(
      [...root.querySelectorAll("tbody tr")].map((tr) => tr.textContent?.replace(/\s+/g, "")),
    ).toEqual(["INV001$250", "INV002$150"]);
    expect(root.querySelector("caption")?.textContent).toBe("Invoices");
  });
});
