import { expect, test, vi } from "vitest";
import { part, render, shadow, tick } from "./setup";

const carousel = async (count: number) => {
  const items = Array.from(
    { length: count },
    (_, i) => `<ui-carousel-item><p>${i}</p></ui-carousel-item>`,
  );
  const host = await render(
    `<div class="demo"><ui-carousel><ui-carousel-content>${items.join("")}</ui-carousel-content><ui-carousel-previous></ui-carousel-previous><ui-carousel-next></ui-carousel-next></ui-carousel></div>`,
  );
  (host.querySelector(".demo") as HTMLElement).style.width = "300px";
  const root = host.querySelector("ui-carousel") as HTMLElement;
  const changes: number[] = [];
  root.addEventListener("change", (event) => changes.push((event as CustomEvent).detail.index));
  const button = (tag: string) =>
    part<HTMLButtonElement>(shadow(root.querySelector(tag)).querySelector("ui-button"), "button");
  const track = part(root.querySelector("ui-carousel-content"), "track");
  return {
    root,
    changes,
    next: button("ui-carousel-next"),
    previous: button("ui-carousel-previous"),
    track,
  };
};

test("quick clicks on the carousel buttons advance one slide each, without waiting for scrolling", async () => {
  const { changes, next, previous } = await carousel(5);
  next.click();
  next.click();
  next.click();
  await tick();
  previous.click();
  expect(changes).toEqual([1, 2, 3, 2]);
});

test("the carousel reports the slide nearest the start after scrolling, however many slides", async () => {
  const { changes, root, track } = await carousel(12);
  const slide = root.querySelectorAll("ui-carousel-item")[10] as HTMLElement;
  track.scrollLeft = slide.getBoundingClientRect().left - track.getBoundingClientRect().left;
  track.dispatchEvent(new Event("scrollend"));
  expect(changes).toEqual([10]);
  track.dispatchEvent(new Event("scrollend"));
  expect(changes).toEqual([10]);
  await vi.waitFor(() =>
    expect(
      shadow(root.querySelector("ui-carousel-next"))
        .querySelector("ui-button")
        ?.hasAttribute("disabled"),
    ).toBe(false),
  );
});
