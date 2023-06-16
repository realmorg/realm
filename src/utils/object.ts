/**
 * Creates new Map
 * @template TKey
 * @template TValue
 * @returns {Map<TKey, TValue>}
 */
export const createMap = <TKey, TValue>() => new Map<TKey, TValue>();

/**
 * Creates new Set
 * @template T
 * @returns {Set<T>}
 */
export const createSet = <T>() => new Set<T>();

/**
 * Creates array from source
 * @param from - source
 * @returns {T[]}
 */
export const createArray = <T>(from) => Array.from<T>(from);

/**
 * Creates object from entries
 * @param entries
 * @returns {object}
 */
export const ObjectFromEntries = (entries) => Object.fromEntries(entries);
