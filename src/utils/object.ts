/**
 * Creates new Map
 * @template TKey
 * @template TValue
 * @returns {Map<TKey, TValue>}
 */
export const createMap = <TKey, TValue>() => new Map<TKey, TValue>();

/**
 * Creates array from source
 * @param from - source
 * @returns {T[]}
 */
export const createArray = <T>(from) => Array.from<T>(from);
