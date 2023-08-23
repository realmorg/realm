export const EMPTY_STRING = "";

export const BIND_ATTR_PREFIX = "_";

export const STATE_PREFIX = "#";

export const ATTR_PREFIX = "@";

export const SOURCE_PREFIX = "$";

export const EVENT_PREFIX = "RLM:";

export const DATA_PREFIX = "data-";

export const VAR_PREFIX = "var";

export const COMMA_SEPARATOR = ",";

export const DASH_SEPARATOR = "-";

export const PIPELINE_SEPARATOR = "|";

export const COLON = ":";

export const SEMICOLON = ";";

export const LEFT_PARENTHESES = "(";

export const RIGHT_PARENTHESES = ")";

export const LEFT_BRACES = "{";

export const RIGHT_BRACES = "}";

export const DOT_NOTATION = ".";

export const META_PREFIX = "!";

export const ALL = "*";

export const RealmLogicOp = {
  EQUALS_TO: "eq",
  NOT_EQUALS_TO: "neq",
  GREATER_THAN: "gt",
  GREATER_THAN_OR_EQUALS_TO: "gte",
  LESS_THAN: "lt",
  LESS_THAN_OR_EQUALS_TO: "lte",
  CONTAINS: "contains",
} as const;
