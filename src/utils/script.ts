import { MimeTypes } from "../constants/mime";

/**
 * Generate script closure from script element as string
 * @param script - script element
 * @param args - function arguments as array
 * @param fnArgs - function arguments as string
 */
export const scriptClosure = (
  script: HTMLScriptElement | Node,
  args: unknown[],
  fnArgs: string
) => `(([${args.join(",")}]) => {${script.textContent}})(${fnArgs})`.trim();

/**
 * Create blob script URL from script content
 * @param content - script content
 * @returns {string}
 */
export const createScriptURL = (content: string): string =>
  URL.createObjectURL(new Blob([content], { type: MimeTypes.JAVASCRIPT }));
