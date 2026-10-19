// Behaviour modelled on zod's coercion, default and optional semantics, rewritten for REALM's prop builder.
import { describe, expect, test } from "vitest";
import { prop, toAttributeName } from "../src/props";

const value = (result: { ok: boolean; value?: unknown; message?: string }) =>
  result.ok ? result.value : result.message;

describe("prop builder", () => {
  test("string rules", () => {
    const type = prop
      .string()
      .min(2)
      .max(4)
      .pattern(/^[a-z]+$/);
    expect(value(type.parse("abc"))).toBe("abc");
    expect(value(type.parse("a"))).toBe("must be at least 2 characters");
    expect(value(type.parse("abcde"))).toBe("must be at most 4 characters");
    expect(value(type.parse("AB"))).toBe("must match /^[a-z]+$/");
    expect(value(prop.string().email().check("a@b.co"))).toBe("a@b.co");
    expect(value(prop.string().email().check("nope"))).toBe("must be an email address");
    expect(value(prop.string().url().check("https://x.dev"))).toBe("https://x.dev");
    expect(value(prop.string().url().check("x"))).toBe("must be a URL");
    expect(value(prop.string().check(1))).toBe("expected a string, got number");
  });

  test("number rules", () => {
    const type = prop.number().int().min(0).max(10);
    expect(value(type.parse("5"))).toBe(5);
    expect(value(type.parse(""))).toBe('"" is not a number');
    expect(value(type.parse("x"))).toBe('"NaN" is not a number');
    expect(value(type.parse("1.5"))).toBe("must be an integer");
    expect(value(type.parse("-1"))).toBe("must be at least 0");
    expect(value(type.parse("11"))).toBe("must be at most 10");
  });

  test("boolean follows the native presence rule", () => {
    expect(value(prop.boolean().parse(""))).toBe(true);
    expect(value(prop.boolean().parse("false"))).toBe(true);
    expect(value(prop.boolean().parse(null))).toBe(false);
    expect(value(prop.boolean().check(undefined))).toBe(false);
    expect(value(prop.boolean().check("yes"))).toBe("expected a boolean, got string");
    expect(prop.boolean().fallback).toBe(false);
  });

  test("enum", () => {
    const type = prop.enum(["a", "b"]);
    expect(value(type.parse("a"))).toBe("a");
    expect(value(type.parse("c"))).toBe('must be one of "a", "b"');
  });

  test("date", () => {
    const parsed = prop.date().parse("2026-10-19");
    expect(parsed.ok && parsed.value instanceof Date).toBe(true);
    expect(value(prop.date().parse("nope"))).toBe("is not a valid date");
  });

  test("array and object shapes", () => {
    const tags = prop.array(prop.string());
    expect(value(tags.parse('["a"]'))).toEqual(["a"]);
    expect(value(tags.parse("[1]"))).toBe("[0] expected a string, got number");
    expect(value(tags.parse("{"))).toBe('"{" is not valid JSON');
    expect(value(tags.check({}))).toBe("expected an array");
    expect(value(prop.array().check([1, "a"]))).toEqual([1, "a"]);
    const user = prop.object({ name: prop.string().required() });
    expect(value(user.parse('{"name":"Ana"}'))).toEqual({ name: "Ana" });
    expect(value(user.parse("{}"))).toBe(".name is required");
    expect(value(user.check([]))).toBe("expected an object");
    expect(value(prop.object().check({ any: 1 }))).toEqual({ any: 1 });
  });

  test("defaults, required and optional", () => {
    expect(value(prop.string().default("x").parse(null))).toBe("x");
    expect(value(prop.string().required().parse(null))).toBe("is required");
    expect(value(prop.string().required().optional().parse(null))).toBeUndefined();
    expect(value(prop.string().check(null))).toBeNull();
    const list = prop.array().default([1]);
    const first = list.fallback as number[];
    expect(first).toEqual([1]);
    expect(list.fallback).not.toBe(first);
    expect(prop.string().fallback).toBeUndefined();
    expect(prop.number().default(3).fallback).toBe(3);
  });

  test("attribute name, reflection and serialisation", () => {
    const type = prop.string().attribute("data-x").reflect();
    expect(type.rules.attribute).toBe("data-x");
    expect(type.rules.reflect).toBe(true);
    expect(type.serialize(undefined)).toBeNull();
    expect(type.serialize(null)).toBeNull();
    expect(type.serialize(false)).toBeNull();
    expect(type.serialize(true)).toBe("");
    expect(type.serialize(new Date("2026-01-01T00:00:00.000Z"))).toBe("2026-01-01T00:00:00.000Z");
    expect(type.serialize({ a: 1 })).toBe('{"a":1}');
    expect(type.serialize(5)).toBe("5");
    expect(toAttributeName("maxItems")).toBe("max-items");
  });
});
