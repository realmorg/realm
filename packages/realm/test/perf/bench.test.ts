// Operations from js-framework-benchmark (krausest/js-framework-benchmark), measured on keyed rows.
import { expect, test } from "vitest";
import { flush } from "../../src/reactivity";
import { define, render, root, tag } from "../helpers";

interface Row {
  id: number;
  label: string;
}
interface Bench {
  rows: Row[];
  selected: number;
}

const BUDGET_MS = {
  create1k: 60,
  replace1k: 60,
  updateEvery10th: 16,
  swap: 16,
  select: 16,
  remove: 16,
  create10k: 700,
  append1k: 60,
  clear: 40,
};

let nextId = 1;
const build = (count: number) =>
  Array.from({ length: count }, () => ({ id: nextId++, label: `row ${nextId}` }));

const measure = (fn: () => void) => {
  const start = performance.now();
  fn();
  flush();
  return performance.now() - start;
};

test("keyed rows stay within the benchmark budgets", async () => {
  const name = tag("bench");
  await define(`<custom-element name="${name}">
    <script>const bench = useState({ rows: [], selected: 0 }); window.bench = bench; function select(row) { bench.selected = row.id; }</script>
    <table><tbody>
      <tr repeat="#bench.rows" as="row" key="id">
        <td><slot name="#row.id"></slot></td>
        <td><a onclick="select(row)"><slot name="#row.label"></slot></a></td>
        <td><a>x</a></td>
      </tr>
    </tbody></table>
  </custom-element>`);
  const el = render(`<${name}></${name}>`).querySelector(name) as Element;
  const state = (window as unknown as { bench: Bench }).bench;
  const results: Record<string, number> = {};
  const run = (key: keyof typeof BUDGET_MS, fn: () => void) => {
    const times = Array.from({ length: 5 }, () => {
      state.rows = [];
      flush();
      return measure(fn);
    });
    results[key] = times.sort((a, b) => a - b)[2] as number;
  };
  const prepare = (count: number) => {
    state.rows = build(count);
    flush();
  };

  run("create1k", () => (state.rows = build(1000)));
  run("create10k", () => (state.rows = build(10000)));
  const timed = (key: keyof typeof BUDGET_MS, setup: () => void, fn: () => void) => {
    const times = Array.from({ length: 5 }, () => {
      setup();
      return measure(fn);
    });
    results[key] = times.sort((a, b) => a - b)[2] as number;
  };
  timed(
    "replace1k",
    () => prepare(1000),
    () => (state.rows = build(1000)),
  );
  timed(
    "updateEvery10th",
    () => prepare(1000),
    () => {
      for (let i = 0; i < state.rows.length; i += 10) (state.rows[i] as Row).label += " !!!";
    },
  );
  timed(
    "swap",
    () => prepare(1000),
    () => {
      const rows = state.rows;
      const a = rows[1] as Row;
      rows[1] = rows[998] as Row;
      rows[998] = a;
    },
  );
  timed(
    "select",
    () => prepare(1000),
    () => (state.selected = (state.rows[5] as Row).id),
  );
  timed(
    "remove",
    () => prepare(1000),
    () => state.rows.splice(500, 1),
  );
  timed(
    "append1k",
    () => prepare(1000),
    () => state.rows.push(...build(1000)),
  );
  timed(
    "clear",
    () => prepare(1000),
    () => (state.rows = []),
  );

  console.log(JSON.stringify(results));
  expect(root(el).querySelectorAll("tr")).toHaveLength(0);
  for (const [key, budget] of Object.entries(BUDGET_MS)) {
    expect.soft(results[key], key).toBeLessThanOrEqual(budget);
  }
}, 60000);
