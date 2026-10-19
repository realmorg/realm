import { describe, expect, test } from "vitest";
import { freeNames, splitImports, tokenize, topLevelNames } from "../src/scan";

const names = (source: string) => [...topLevelNames(source)].sort();

describe("tokenize", () => {
  test("strings, templates, comments, numbers and regex", () => {
    const tokens = tokenize(`const a = "x\\"y"; // note
/* block
*/ let b = \`t \${ { c: "}" } } \${\`inner\`}\`; const r = /[/]x\\//g; const n = .5 + 1e3; x = a / b`);
    const types = tokens.map((t) => t.type);
    expect(types).toContain("string");
    expect(types).toContain("template");
    expect(types).toContain("regex");
    expect(tokens.filter((t) => t.type === "regex")).toHaveLength(1);
    expect(tokens.find((t) => t.value === "let")?.newline).toBe(true);
    expect(tokens.filter((t) => t.type === "number").map((t) => t.value)).toEqual([".5", "1e3"]);
  });

  test("regex is recognised after keywords and at the start", () => {
    expect(tokenize("/a/").at(0)?.type).toBe("regex");
    expect(tokenize("return /a/").at(1)?.type).toBe("regex");
    expect(tokenize("x(/a/)").at(2)?.type).toBe("regex");
    expect(tokenize("(1) / 2").at(3)?.type).toBe("punct");
    expect(tokenize("a[0] / 2").at(4)?.type).toBe("punct");
    expect(tokenize("'s' / 2").at(1)?.type).toBe("punct");
  });

  test("unterminated template expressions and a trailing dot", () => {
    expect(tokenize("`${a").at(0)?.type).toBe("template");
    expect(tokenize("a.").map((t) => t.value)).toEqual(["a", "."]);
  });

  test("unterminated comments and multi-character punctuation", () => {
    expect(tokenize("a /* open").map((t) => t.value)).toEqual(["a"]);
    expect(tokenize("a ??= b?.c").map((t) => t.value)).toEqual(["a", "??=", "b", "?.", "c"]);
  });
});

describe("topLevelNames", () => {
  test("declarations of every kind", () => {
    expect(
      names(`
        const counter = useState({ count: 0 });
        let a = 1, b = 2;
        var c;
        function add(event) { const inner = 1; }
        async function load() {}
        function* gen() {}
        class Store {}
        const fn = () => {
          const hidden = 1;
        };
      `),
    ).toEqual(["Store", "a", "add", "b", "c", "counter", "fn", "gen", "load"]);
  });

  test("destructuring patterns", () => {
    expect(
      names(`
        const { a, b: c, d = 1, ...e } = obj;
        const [f, , g = 2, ...h] = list;
        const { i: { j }, [key]: k, ["l"]: m } = obj;
      `),
    ).toEqual(["a", "c", "d", "e", "f", "g", "h", "j", "k", "m"]);
  });

  test("initialisers spanning lines and statements without semicolons", () => {
    expect(
      names(`
        const a = foo
          .bar()
        const b = a +
          1
        const c = 1
        doSomething()
        const d = function named() {}
      `),
    ).toEqual(["a", "b", "c", "d"]);
  });

  test("ignores nested and expression positions", () => {
    expect(
      names("if (x) { const inner = 1; function nested() {} }\nfoo(function bar() {})"),
    ).toEqual([]);
    expect(names("x = class {}")).toEqual([]);
    expect(names("const")).toEqual([]);
    expect(names("const {")).toEqual([]);
    expect(names("let x = (1")).toEqual(["x"]);
    expect(names("a; let\n")).toEqual([]);
    expect(names("{ } const z = 1)")).toEqual(["z"]);
    expect(names("let [a\n")).toEqual(["a"]);
    expect(names("const { a:")).toEqual([]);
    expect(names("const { [k] } = o")).toEqual([]);
    expect(names("class {}\nfunction () {}")).toEqual([]);
  });
});

describe("freeNames", () => {
  test("collects identifiers except properties and keywords", () => {
    expect(
      [...freeNames("toggle(item); this.value = event.target?.value; return false")].sort(),
    ).toEqual(["event", "item", "toggle"]);
  });

  test("looks inside template literal expressions", () => {
    expect(
      [...freeNames("say(`hi ${user.name} and ${`${other}`} \\${skip} {plain}`)")].sort(),
    ).toEqual(["other", "say", "user"]);
  });
});

describe("splitImports", () => {
  test("hoists leading imports and resolves relative paths", () => {
    const {
      imports,
      body,
      names: imported,
    } = splitImports(
      `// state
import { cart, other as alias } from "./state/cart.js";
import Default, * as all from '../lib.js';
import "/side-effect.js"
import x from "pkg";
import {} from "./empty.js";
import { trailing, } from "./trailing.js";
const after = 1;`,
      "https://example.com/components/cart.html",
    );
    expect(imports).toContain('"https://example.com/components/state/cart.js"');
    expect(imports).toContain('"https://example.com/lib.js"');
    expect(imports).toContain('"/side-effect.js"');
    expect(imports).toContain('"pkg"');
    expect(body.trim()).toBe("const after = 1;");
    expect([...imported].sort()).toEqual(["Default", "alias", "all", "cart", "trailing", "x"]);
  });

  test("leaves scripts without imports untouched", () => {
    const result = splitImports("const a = import.meta;", "https://example.com/");
    expect(result.imports).toBe("");
    expect(result.body).toBe("const a = import.meta;");
  });
});
