export type MixedDataType = string | number | object | boolean | Array<unknown>;

export const RealmMimeTypes = {
  HTML: "text/html",
  JSON: "application/json",
  TEXT: "text/plain",
} as const;
