import { RealmEventAliases } from "../constants/events";
import {
  SPECIAL_CHARS_REGEX,
  UPPERCASE_ALPHABET_REGEX,
} from "../constants/regx";

/**
 * Capitalize string
 * @param str - string
 * @returns {string}
 */
export const capitalize = (str: string): string => {
  if (!str) return "";
  const [first, ...rest] = str.toLowerCase().split("");
  return first.toUpperCase() + rest.join("");
};

/**
 * Convert string to camel case
 * @param str - string
 * @returns {string}
 */
export const camel = (str: string): string => {
  const parts =
    str
      ?.replace(UPPERCASE_ALPHABET_REGEX, capitalize)
      ?.split(SPECIAL_CHARS_REGEX)
      .map((x) => x.toLowerCase()) ?? [];
  const length = parts.length;
  if (length === 0) return "";
  if (length === 1) return parts[0];
  return parts.reduce(
    (acc, part) => `${acc}${part.charAt(0).toUpperCase()}${part.slice(1)}`
  );
};

/**
 * Replace keywords with specific value
 * @param content - script content
 * @param correction - correction object
 * @returns {string}
 */
export const replaceKeywords = (
  content: string,
  correction?: Partial<{ [key in RealmEventAliases]: string }>
) =>
  content.replaceAll(
    new RegExp(`\\$(${[RealmEventAliases.TRIGGER].join("|")})`, "g"),
    (_match, pattern) => correction[pattern]
  );
