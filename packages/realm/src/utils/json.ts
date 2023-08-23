import { EMPTY_STRING } from "../constants/chars";
import { MixedDataType } from "../constants/data";

export const JSONstringify = JSON.stringify;

export const JSONparse = JSON.parse;

export const JSONSafeStringify = (value: MixedDataType = EMPTY_STRING) =>
  typeof value === "object" ? JSONstringify(value) : `${value}`;

export const JSONSafeParse = (value: MixedDataType) =>
  JSONparse(JSONSafeStringify(value));
