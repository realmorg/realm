type TokenType = "name" | "punct" | "string" | "number" | "regex" | "template";

export interface Token {
  type: TokenType;
  value: string;
  newline: boolean;
}

const PUNCTUATORS =
  ">>>= ... === !== **= <<= >>= >>> &&= ||= ??= => == != <= >= && || ?? ?. ++ -- += -= *= /= %= &= |= ^= ** << >>".split(
    " ",
  );

const REGEX_AFTER_KEYWORD = new Set(
  "return typeof instanceof in of new delete void throw case do else yield await".split(" "),
);

export const KEYWORDS = new Set(
  "await break case catch class const continue debugger default delete do else export extends false finally for function if import in instanceof let new null of return static super switch this throw true try typeof var void while with yield async arguments undefined NaN Infinity globalThis eval enum implements interface package private protected public".split(
    " ",
  ),
);

const isNameStart = (c: string) => /[A-Za-z_$\u0080-￿]/.test(c);
const isNamePart = (c: string) => /[\w$\u0080-￿]/.test(c);

const regexAllowed = (previous: Token | undefined) => {
  if (!previous) return true;
  if (previous.type === "name") return REGEX_AFTER_KEYWORD.has(previous.value);
  if (previous.type === "punct") return !(previous.value === ")" || previous.value === "]");
  return false;
};

export const tokenize = (source: string): Token[] => {
  const tokens: Token[] = [];
  let i = 0;
  let newline = false;
  const push = (type: TokenType, value: string) => {
    tokens.push({ type, value, newline });
    newline = false;
  };

  const skipQuoted = (start: number, quote: string) => {
    let j = start + 1;
    while (j < source.length && source[j] !== quote) j += source[j] === "\\" ? 2 : 1;
    return j + 1;
  };

  const skipTemplate = (start: number): number => {
    let j = start + 1;
    while (j < source.length && source[j] !== "`") {
      if (source[j] === "\\") j += 2;
      else if (source[j] === "$" && source[j + 1] === "{") j = skipCode(j + 2);
      else j++;
    }
    return j + 1;
  };

  const skipCode = (start: number): number => {
    let depth = 0;
    let j = start;
    while (j < source.length) {
      const c = source[j] as string;
      if (c === "'" || c === '"') j = skipQuoted(j, c);
      else if (c === "`") j = skipTemplate(j);
      else if (c === "{") {
        depth++;
        j++;
      } else if (c === "}") {
        if (depth === 0) return j + 1;
        depth--;
        j++;
      } else j++;
    }
    return j;
  };

  while (i < source.length) {
    const c = source[i] as string;
    const next = source[i + 1];
    if (c === "\n") {
      newline = true;
      i++;
    } else if (/\s/.test(c)) i++;
    else if (c === "/" && next === "/") {
      while (i < source.length && source[i] !== "\n") i++;
    } else if (c === "/" && next === "*") {
      const end = source.indexOf("*/", i + 2);
      const stop = end === -1 ? source.length : end + 2;
      if (source.slice(i, stop).includes("\n")) newline = true;
      i = stop;
    } else if (c === "'" || c === '"') {
      const end = skipQuoted(i, c);
      push("string", source.slice(i, end));
      i = end;
    } else if (c === "`") {
      const end = skipTemplate(i);
      push("template", source.slice(i, end));
      i = end;
    } else if (/\d/.test(c) || (c === "." && /\d/.test(next ?? ""))) {
      let j = i + 1;
      while (j < source.length && /[\w.]/.test(source[j] as string)) j++;
      push("number", source.slice(i, j));
      i = j;
    } else if (isNameStart(c)) {
      let j = i + 1;
      while (j < source.length && isNamePart(source[j] as string)) j++;
      push("name", source.slice(i, j));
      i = j;
    } else if (c === "/" && regexAllowed(tokens.at(-1))) {
      let j = i + 1;
      let inClass = false;
      while (j < source.length) {
        const r = source[j];
        if (r === "\\") j++;
        else if (r === "[") inClass = true;
        else if (r === "]") inClass = false;
        else if (r === "/" && !inClass) break;
        j++;
      }
      j++;
      while (j < source.length && /[a-z]/.test(source[j] as string)) j++;
      push("regex", source.slice(i, j));
      i = j;
    } else {
      const punct = PUNCTUATORS.find((p) => source.startsWith(p, i)) ?? c;
      push("punct", punct);
      i += punct.length;
    }
  }
  return tokens;
};

const OPEN = new Set(["(", "[", "{"]);
const CLOSE = new Set([")", "]", "}"]);

const isPunct = (token: Token | undefined, value: string) =>
  token?.type === "punct" && token.value === value;

const CONTINUATION = /^(?:[.,?:=+\-*/%&|^<>!~]|=>|\?\.|\(|\[|`)/;

const continues = (previous: Token | undefined, token: Token) => {
  if (previous?.type === "punct" && !CLOSE.has(previous.value)) return true;
  return token.type === "template" || (token.type === "punct" && CONTINUATION.test(token.value));
};

const skipExpression = (tokens: Token[], start: number, stops: Set<string>, statement: boolean) => {
  let depth = 0;
  let i = start;
  for (; i < tokens.length; i++) {
    const token = tokens[i] as Token;
    if (depth === 0) {
      if (token.type === "punct" && stops.has(token.value)) return i;
      if (statement && i > start && token.newline && !continues(tokens[i - 1], token)) return i;
    }
    if (token.type === "punct" && OPEN.has(token.value)) depth++;
    else if (token.type === "punct" && CLOSE.has(token.value)) {
      if (depth === 0) return i;
      depth--;
    }
  }
  return i;
};

const PATTERN_STOPS = new Set([",", "}", "]"]);

const readPattern = (tokens: Token[], start: number, names: string[]): number => {
  const token = tokens[start];
  if (!token) return start;
  if (token.type === "name") {
    names.push(token.value);
    return start + 1;
  }
  if (!isPunct(token, "{") && !isPunct(token, "[")) return start + 1;
  const close = token.value === "{" ? "}" : "]";
  let i = start + 1;
  while (i < tokens.length && !isPunct(tokens[i], close)) {
    const current = tokens[i] as Token;
    if (isPunct(current, ",")) {
      i++;
      continue;
    }
    if (isPunct(current, "...")) {
      i = readPattern(tokens, i + 1, names);
    } else if (close === "}" && isPunct(tokens[i + 1], ":")) {
      i = readPattern(tokens, i + 2, names);
    } else if (close === "}" && isPunct(current, "[")) {
      i = skipExpression(tokens, i + 1, PATTERN_STOPS, false) + 1;
      i = isPunct(tokens[i], ":") ? readPattern(tokens, i + 1, names) : i;
    } else {
      i = readPattern(tokens, i, names);
    }
    if (isPunct(tokens[i], "=")) i = skipExpression(tokens, i + 1, PATTERN_STOPS, false);
  }
  return i + 1;
};

const DECLARATION_STOPS = new Set([",", ";"]);

const readDeclarators = (tokens: Token[], start: number, names: string[]) => {
  let i = start;
  while (i < tokens.length) {
    i = readPattern(tokens, i, names);
    if (isPunct(tokens[i], "=")) i = skipExpression(tokens, i + 1, DECLARATION_STOPS, true);
    if (!isPunct(tokens[i], ",")) return i;
    i++;
  }
  return i;
};

const statementStart = (tokens: Token[], i: number) => {
  const previous = tokens[i - 1];
  if (!previous) return true;
  if (previous.type === "punct" && (previous.value === ";" || previous.value === "}")) return true;
  return (tokens[i] as Token).newline && !continues(previous, tokens[i] as Token);
};

export const topLevelNames = (source: string): Set<string> => {
  const tokens = tokenize(source);
  const names: string[] = [];
  let depth = 0;
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i] as Token;
    if (token.type === "punct") {
      if (OPEN.has(token.value)) depth++;
      else if (CLOSE.has(token.value)) depth--;
      i++;
      continue;
    }
    if (depth !== 0 || token.type !== "name" || !statementStart(tokens, i)) {
      i++;
      continue;
    }
    let j = i;
    if (tokens[j]?.value === "async" && tokens[j + 1]?.value === "function") j++;
    const keyword = tokens[j]?.value;
    if (keyword === "function" || keyword === "class") {
      j++;
      if (isPunct(tokens[j], "*")) j++;
      const name = tokens[j];
      if (name?.type === "name") names.push(name.value);
      i = j + 1;
    } else if (keyword === "let" || keyword === "const" || keyword === "var") {
      i = readDeclarators(tokens, j + 1, names);
    } else {
      i++;
    }
  }
  return new Set(names);
};

const templateExpressions = (template: string) => {
  const parts: string[] = [];
  let depth = 0;
  let start = -1;
  for (let i = 1; i < template.length - 1; i++) {
    const c = template[i];
    if (c === "\\" && depth === 0) i++;
    else if (depth === 0 && c === "$" && template[i + 1] === "{") {
      depth = 1;
      start = i + 2;
      i++;
    } else if (depth > 0 && c === "{") depth++;
    else if (depth > 0 && c === "}" && --depth === 0) parts.push(template.slice(start, i));
  }
  return parts;
};

export const freeNames = (code: string, names = new Set<string>()): Set<string> => {
  const tokens = tokenize(code);
  tokens.forEach((token, index) => {
    if (token.type === "template") {
      for (const part of templateExpressions(token.value)) freeNames(part, names);
      return;
    }
    if (token.type !== "name" || KEYWORDS.has(token.value)) return;
    const previous = tokens[index - 1];
    if (isPunct(previous, ".") || isPunct(previous, "?.")) return;
    names.add(token.value);
  });
  return names;
};

export interface ImportSplit {
  imports: string;
  body: string;
  names: Set<string>;
}

const IMPORT = /^import\s*(?:([\w$*\s{},]+?)\s*from\s*)?(["'])([^"']+)\2\s*;?/;
const LEADING = /^(?:\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/)*/;

const importNames = (clause: string, names: Set<string>) => {
  const braces = clause.match(/\{([^}]*)\}/);
  const outside = clause.replace(/\{[^}]*\}/, "");
  for (const part of outside.split(",")) {
    const name = part
      .trim()
      .split(/\s+as\s+/)
      .at(-1);
    if (name && name !== "*") names.add(name);
  }
  for (const part of braces?.[1]?.split(",") ?? []) {
    const name = part
      .trim()
      .split(/\s+as\s+/)
      .at(-1);
    if (name) names.add(name);
  }
};

export const splitImports = (source: string, base: string | null): ImportSplit => {
  const imports: string[] = [];
  const names = new Set<string>();
  let rest = source;
  for (;;) {
    const lead = (rest.match(LEADING) as RegExpMatchArray)[0];
    const match = rest.slice(lead.length).match(IMPORT);
    if (!match) break;
    const [statement, clause = "", quote, specifier = ""] = match;
    const resolved =
      base && /^\.{1,2}\//.test(specifier) ? new URL(specifier, base).href : specifier;
    imports.push(statement.replace(`${quote}${specifier}${quote}`, JSON.stringify(resolved)));
    importNames(clause, names);
    rest = rest.slice(lead.length + statement.length);
  }
  return { imports: imports.join("\n"), body: rest, names };
};
