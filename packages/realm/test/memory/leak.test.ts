import { expect, test } from "vitest";
import { define, render, root, tag, tick } from "../helpers";

declare const gc: () => void;

const frame = () => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve)));

// Blink caches a shadow root's slot list and rebuilds it lazily, so the most recently removed
// <slot> elements stay reachable until the next slot assignment. Touching assignedSlot forces
// that rebuild; without it the last removed batch is held briefly, which is not a REALM leak.
const flushSlotCache = (host: Element) => {
  const probe = document.createElement("span");
  host.append(probe);
  void probe.assignedSlot;
  probe.remove();
};

const collect = async (refs: WeakRef<object>[]) => {
  for (let round = 0; round < 50; round++) {
    await frame();
    gc();
    if (refs.every((ref) => ref.deref() === undefined)) return 0;
  }
  return refs.filter((ref) => ref.deref() !== undefined).length;
};

test("components mounted and removed 1,000 times are garbage collected", async () => {
  const name = tag("leak");
  await define(`<custom-element name="${name}">
    <script>
      const props = defineProps({ label: prop.string().default("x") });
      const s = useState({ items: [1, 2, 3], open: true, n: 0 });
      observe(() => { void s.n; const id = setInterval(() => {}, 1000); return () => clearInterval(id); });
      onConnected(() => { window.addEventListener("resize", () => {}, { signal }); });
      function inc() { s.n++; }
    </script>
    <button onclick="inc()" debounce="10ms"><slot name="@label"></slot><slot name="#s.n"></slot></button>
    <is-visible when="#s.open"><repeat-list of="#s.items"><i onclick="inc()"><slot name="#item"></slot></i></repeat-list></is-visible>
    <div fetch="/never" trigger="none" poll="1h"></div>
  </custom-element>`);
  const refs: WeakRef<object>[] = [];
  const host = render("");
  const cycle = () => {
    const el = document.createElement(name);
    host.append(el);
    (root(el).querySelector("button") as HTMLButtonElement).click();
    refs.push(new WeakRef(el), new WeakRef(root(el)));
    el.remove();
  };
  for (let i = 0; i < 1000; i++) cycle();
  await tick();
  expect(await collect(refs)).toBe(0);
});

test("list items removed from a keyed list are garbage collected", async () => {
  const name = tag("leak-list");
  await define(`<custom-element name="${name}">
    <script>const s = useState({ rows: [] }); window.leakRows = s;</script>
    <repeat-list of="#s.rows" key="id"><p onclick="void item"><slot name="#item.label"></slot></p></repeat-list>
  </custom-element>`);
  render(`<${name}></${name}>`);
  const state = (window as unknown as { leakRows: { rows: { id: number; label: string }[] } })
    .leakRows;
  const refs: WeakRef<object>[] = [];
  const grab = () => {
    root(document.querySelector(name))
      .querySelectorAll("p")
      .forEach((p) => {
        refs.push(new WeakRef(p));
      });
  };
  for (let round = 0; round < 50; round++) {
    state.rows = Array.from({ length: 100 }, (_, id) => ({
      id: round * 100 + id,
      label: `r${id}`,
    }));
    await tick();
    grab();
  }
  state.rows = [];
  await tick();
  flushSlotCache(document.querySelector(name) as Element);
  expect(await collect(refs)).toBe(0);
});
