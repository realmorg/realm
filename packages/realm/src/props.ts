type Kind = "string" | "number" | "boolean" | "enum" | "array" | "object" | "date";

export type Result = { ok: true; value: unknown } | { ok: false; message: string };

interface Rules {
  default?: unknown;
  hasDefault?: boolean;
  required?: boolean;
  reflect?: boolean;
  attribute?: string;
  min?: number;
  max?: number;
  int?: boolean;
  pattern?: RegExp;
  format?: "email" | "url";
  values?: readonly string[];
  item?: PropType;
  shape?: Record<string, PropType>;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ok = (value: unknown): Result => ({ ok: true, value });
const fail = (message: string): Result => ({ ok: false, message });

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export class PropType {
  constructor(
    readonly kind: Kind,
    readonly rules: Rules = {},
  ) {}

  #with(rules: Rules) {
    return new PropType(this.kind, { ...this.rules, ...rules });
  }

  default(value: unknown) {
    return this.#with({ default: value, hasDefault: true });
  }
  required() {
    return this.#with({ required: true });
  }
  optional() {
    return this.#with({ required: false });
  }
  reflect() {
    return this.#with({ reflect: true });
  }
  attribute(name: string) {
    return this.#with({ attribute: name });
  }
  min(value: number) {
    return this.#with({ min: value });
  }
  max(value: number) {
    return this.#with({ max: value });
  }
  int() {
    return this.#with({ int: true });
  }
  pattern(value: RegExp) {
    return this.#with({ pattern: value });
  }
  email() {
    return this.#with({ format: "email" });
  }
  url() {
    return this.#with({ format: "url" });
  }

  get fallback() {
    if (this.rules.hasDefault) {
      const value = this.rules.default;
      return isPlainObject(value) || Array.isArray(value) ? structuredClone(value) : value;
    }
    return this.kind === "boolean" ? false : undefined;
  }

  parse(text: string | null): Result {
    if (this.kind === "boolean") return ok(text !== null);
    if (text === null) return this.check(undefined);
    switch (this.kind) {
      case "number":
        return text.trim() === "" ? fail(`"${text}" is not a number`) : this.check(Number(text));
      case "date":
        return this.check(new Date(text));
      case "array":
      case "object":
        try {
          return this.check(JSON.parse(text));
        } catch {
          return fail(`"${text}" is not valid JSON`);
        }
      default:
        return this.check(text);
    }
  }

  check(value: unknown): Result {
    if (value === undefined || value === null) {
      if (this.rules.hasDefault) return ok(this.fallback);
      if (this.rules.required) return fail("is required");
      return ok(this.kind === "boolean" ? false : value);
    }
    const message = this.#validate(value);
    return message ? fail(message) : ok(value);
  }

  #validate(value: unknown): string | undefined {
    const { rules } = this;
    switch (this.kind) {
      case "string": {
        if (typeof value !== "string") return `expected a string, got ${typeof value}`;
        if (rules.min !== undefined && value.length < rules.min)
          return `must be at least ${rules.min} characters`;
        if (rules.max !== undefined && value.length > rules.max)
          return `must be at most ${rules.max} characters`;
        if (rules.pattern && !rules.pattern.test(value)) return `must match ${rules.pattern}`;
        if (rules.format === "email" && !EMAIL.test(value)) return "must be an email address";
        if (rules.format === "url" && !URL.canParse(value)) return "must be a URL";
        return;
      }
      case "number": {
        if (typeof value !== "number" || Number.isNaN(value))
          return `"${String(value)}" is not a number`;
        if (rules.int && !Number.isInteger(value)) return "must be an integer";
        if (rules.min !== undefined && value < rules.min) return `must be at least ${rules.min}`;
        if (rules.max !== undefined && value > rules.max) return `must be at most ${rules.max}`;
        return;
      }
      case "boolean":
        return typeof value === "boolean" ? undefined : `expected a boolean, got ${typeof value}`;
      case "enum":
        return rules.values?.includes(value as string)
          ? undefined
          : `must be one of ${rules.values?.map((v) => `"${v}"`).join(", ")}`;
      case "date":
        return value instanceof Date && !Number.isNaN(value.getTime())
          ? undefined
          : "is not a valid date";
      case "array": {
        if (!Array.isArray(value)) return "expected an array";
        for (const [index, item] of value.entries()) {
          const result = rules.item?.check(item);
          if (result && !result.ok) return `[${index}] ${result.message}`;
        }
        return;
      }
      case "object": {
        if (!isPlainObject(value)) return "expected an object";
        for (const [key, type] of Object.entries(rules.shape ?? {})) {
          const result = type.check(value[key]);
          if (!result.ok) return `.${key} ${result.message}`;
        }
        return;
      }
    }
  }

  serialize(value: unknown): string | null {
    if (value === undefined || value === null || value === false) return null;
    if (value === true) return "";
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  }
}

export const prop = {
  string: () => new PropType("string"),
  number: () => new PropType("number"),
  boolean: () => new PropType("boolean"),
  date: () => new PropType("date"),
  enum: (values: readonly string[]) => new PropType("enum", { values }),
  array: (item?: PropType) => new PropType("array", { item }),
  object: (shape?: Record<string, PropType>) => new PropType("object", { shape }),
};

export const toAttributeName = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
