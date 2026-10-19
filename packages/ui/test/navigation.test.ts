import { describe, expect, test } from "vitest";
import { part, render, shadow, tick } from "./setup";

const key = (target: Element, name: string) =>
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key: name, bubbles: true, composed: true, cancelable: true }),
  );

describe("ui-command", () => {
  test("filters items, groups them and selects with the keyboard or a click", async () => {
    const host = await render(`
      <ui-command>
        <optgroup label="Suggestions">
          <option value="calendar">Calendar</option>
          <option value="emoji">Search Emoji</option>
        </optgroup>
        <optgroup label="Settings"><option value="profile" data-shortcut="⌘P">Profile</option></optgroup>
      </ui-command>`);
    const command = host.querySelector("ui-command") as HTMLElement;
    const root = shadow(command);
    const input = part<HTMLInputElement>(command, "input");
    const picked: string[] = [];
    command.addEventListener("select", (event) => picked.push((event as CustomEvent).detail.value));
    expect([...root.querySelectorAll(".heading")].map((h) => h.textContent)).toEqual([
      "Suggestions",
      "Settings",
    ]);
    expect(root.querySelector(".shortcut:not([hidden])")?.textContent).toBe("⌘P");
    input.value = "pro";
    input.dispatchEvent(new Event("input"));
    await tick();
    expect(
      [...root.querySelectorAll('[role="option"]')].map((o) => o.textContent?.replace(/\s+/g, "")),
    ).toEqual(["Profile⌘P"]);
    key(input, "Enter");
    input.value = "";
    input.dispatchEvent(new Event("input"));
    await tick();
    key(input, "ArrowDown");
    key(input, "ArrowUp");
    key(input, "ArrowUp");
    await tick();
    expect(root.querySelector('[aria-selected="true"]')?.textContent?.replace(/\s+/g, "")).toBe(
      "Profile⌘P",
    );
    root.querySelectorAll('[role="option"]')[1]?.dispatchEvent(new PointerEvent("pointermove"));
    (root.querySelectorAll('[role="option"]')[0] as HTMLElement).click();
    expect(picked).toEqual(["profile", "calendar"]);
    input.value = "zzz";
    input.dispatchEvent(new Event("input"));
    await tick();
    expect((root.querySelector(".empty") as HTMLElement).hidden).toBe(false);
    key(input, "ArrowDown");
    key(input, "Enter");
    key(input, "x");
    expect(picked).toHaveLength(2);
    command.append(
      Object.assign(document.createElement("option"), { value: "new", textContent: "New" }),
    );
    input.value = "";
    input.dispatchEvent(new Event("input"));
    await tick();
    expect(root.querySelectorAll('[role="option"]')).toHaveLength(4);
  });
});
