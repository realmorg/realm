import { expect, test } from "vitest";
import { define, render, root, tag, tick } from "./helpers";

test("counter renders state through a value slot and updates on click", async () => {
  const name = tag("counter");
  await define(`
    <custom-element name="${name}">
      <script>
        const counter = useState({ count: 0 });
        function increment() { counter.count++; }
      </script>
      <style>button { font-weight: bold; }</style>
      <button onclick="increment()">Clicked <slot name="#counter.count"></slot> times</button>
    </custom-element>`);
  const host = render(`<${name}></${name}>`);
  const el = host.querySelector(name) as HTMLElement;
  const button = root(el).querySelector("button") as HTMLButtonElement;
  expect(root(el).querySelector("slot")?.textContent).toBe("0");
  button.click();
  button.click();
  await tick();
  expect(root(el).querySelector("slot")?.textContent).toBe("2");
});
