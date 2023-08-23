export const UPPERCASE_ALPHABET_REGEX = /([A-Z])+/g;

export const SPECIAL_CHARS_REGEX = /(?=[A-Z])|[.\-\s_]/;

export const CSS_CUSTOM_SELECTOR_REGEX =
  /:host\(\[\\([#@]\w+?)\](\[(global)\])?(\[(eq|neq|gt|gte|lt|lte|contains)="(\w+?)"\])?\)/g;

export const DOT_NOTATION_REGEX = /[$|#|@|!]([.]?(?:\w+[.-])*\w+)/gm;
