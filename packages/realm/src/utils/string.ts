import { DASH_SEPARATOR, EMPTY_STRING } from "../constants/chars";
import {
  SPECIAL_CHARS_REGEX,
  UPPERCASE_ALPHABET_REGEX,
} from "../constants/regx";
import { arrayJoin, arrayMap, arrayReduce } from "./object";

export const strTrim = (str: string): string => str.trim();

export const strSlice = (
  str: string,
  start: number = 1,
  end?: number
): string => {
  if (str == null) return EMPTY_STRING;
  return str.slice(start, end);
};

export const strSplit = (str: string, split: string | RegExp) =>
  str.split(split);

export const strToLower = (str: string) => str?.toLowerCase?.();

export const strReplace = (
  str: string,
  searchValue: string | RegExp,
  replaceValue: string
) => str.replace(searchValue, replaceValue);

export const strStartWith = (str: string, searchValue: string) =>
  str.startsWith(searchValue);

export const strIncludes = (str: string, searchValue: string) =>
  str.includes(searchValue);

export const toUpperCase = (str: string) => str.toUpperCase();

/**
 * Capitalize string
 * @param str - string
 * @returns {string}
 */
export const capitalize = (str: string): string => {
  if (!str) return EMPTY_STRING;
  const [first, ...rest] = strSplit(strToLower(str), EMPTY_STRING);
  return toUpperCase(first) + arrayJoin(rest, EMPTY_STRING);
};

const splitChars = (str: string) =>
  strSplit(
    str?.replace(UPPERCASE_ALPHABET_REGEX, capitalize),
    SPECIAL_CHARS_REGEX
  );

/**
 * Convert string to dash
 * @param str - string
 * @returns {string}
 */
export const dash = (str: string): string => {
  const parts = arrayMap(splitChars(str), strToLower) ?? [];
  const length = parts.length;
  if (length === 0) return EMPTY_STRING;
  if (length === 1) return parts.at(0);
  return arrayJoin(parts, DASH_SEPARATOR);
};

export const newError = (errorMessage: string) => new Error(errorMessage);
