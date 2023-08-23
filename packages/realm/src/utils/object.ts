import { DOT_NOTATION, SOURCE_PREFIX } from "../constants/chars";
import { DOT_NOTATION_REGEX } from "../constants/regx";
import { RealmState } from "../libs/RealmState.class";
import { JSONstringify } from "./json";
import { strSlice, strStartWith } from "./string";

/**
 * Creates new Map
 * @template TKey
 * @template TValue
 * @returns {Map<TKey, TValue>}
 */
export const createMap = <TKey, TValue>(map = []) => new Map<TKey, TValue>(map);

/**
 * Creates new Set
 * @template T
 * @returns {Set<T>}
 */
export const createSet = <T>(entries?: T[]) => new Set<T>(entries);

/**
 * Creates array from source
 * @param from - source
 * @returns {T[]}
 */
export const createArray = <T>(from) => Array.from<T>(from);

/**
 * Dot notation reduce from array
 * e.g `a.b.c` is equal to `a[b][c]`
 * @param acc
 * @param item
 * @param index
 * @returns
 */
type ObjectNotationAccumulator = Record<string, unknown> | Event | RealmState;
const getObject =
  (isState: boolean) =>
  (acc: ObjectNotationAccumulator, item: string, index: number) =>
    isState && index === 0 ? (<RealmState>acc).get(item) : acc[item];

/**
 * Select object from string as dot notation
 * @param object
 * @param str
 * @returns {unknown}
 */
export type DataSource =
  | Record<string, unknown>
  | Event
  | RealmState
  | Attr[]
  | Object
  | ArrayLike<unknown>;

export const getValueFrom = (
  source: DataSource,
  dotNotation: string,
  prefix?: string
) => {
  if (!dotNotation) return source;
  if (!DOT_NOTATION_REGEX.test(dotNotation)) return dotNotation;
  if (!!prefix && !strStartWith(dotNotation, prefix)) return dotNotation;

  const isState = source instanceof RealmState;
  return dotNotation.replace(DOT_NOTATION_REGEX, (_match, group) => {
    const target = arraySplit(strSlice(group), DOT_NOTATION);
    const replaceValue = arrayReduce(target, getObject(isState), source);
    return typeof replaceValue === "object"
      ? JSONstringify(replaceValue)
      : replaceValue;
  });
};

/**
 * Convert object to dot notation array of string support nested object
 * @param object
 * @returns {string[]}
 */
export const toDotNotation = (
  object: DataSource,
  prefix: string = SOURCE_PREFIX
): string[] => {
  const entries = entriesOf(object);
  return arrayReduce(
    entries,
    (acc, [key, value]) => {
      if (typeof value === "object")
        return arrayReduce(
          toDotNotation(value as Record<string, unknown>),
          (acc, item) => [
            ...acc,
            `${prefix}${DOT_NOTATION}${key}${DOT_NOTATION}${item}`,
          ],
          acc
        );
      return [...acc, `${prefix}${DOT_NOTATION}${key}`];
    },
    []
  );
};

/**
 * Check if value is an array
 * @param array
 * @returns {boolean}
 */
export const isArray = (array) => Array.isArray(array);

/**
 * Iterates over array or set
 * @param array
 * @param fn
 * @returns
 */
export const forEach = <T>(
  array: T[] | Set<T>,
  fn: (item: T, index: number) => void
) =>
  void arrayReduce(createArray(array), (acc, item: T, index: number) => {
    fn?.(item, index);
    return acc;
  });

/**
 * Iterates over map
 * @param array
 * @param fn
 * @returns
 */
export const forEachMap = <K, V>(
  map: Map<K, V>,
  fn: (value: V, key: K, map: Map<K, V>) => void
) => map.forEach(fn);

/**
 * Iterates over node element
 * @param array
 * @param fn
 * @returns
 */
export const forEachNode = <T extends Node>(
  nodes: NodeListOf<T>,
  fn: (value: T, index: number, array: NodeListOf<T>) => void
) => nodes.forEach(fn);

export const arrayReduce = <T, R>(
  array: T[],
  fn: (acc: R, value: T, index?: number) => R,
  initialValue?: R
) => array.reduce(fn, initialValue);

export const arrayPush = <T, R>(array: T[], value: T) => array.push(value);

export const arrayPop = <T>(array: T[]) => array.pop();

export const arrayMap = <T, R>(array: T[], fn: (value: T) => R) =>
  array.map(fn);

export const arrayJoin = <T>(array: T[], separator?: string) =>
  array.join(separator);

export const arraySplit = (str: string, separator?: string | RegExp) =>
  str.split(separator);

export const arraySplice = <T>(
  array: T[],
  start?: number,
  deleteCount?: number,
  ...items: T[]
) => array.splice(start, deleteCount, ...items);

export const arrayIncludes = <T>(value: T, array: T[]) => array.includes(value);

export const trimArrayString = (array: string[]) =>
  array.map((item) => item.trim());

export const someArray = <T>(
  array: T[],
  fn: (value: T, index: number) => boolean
) => array.some(fn);

export const findArray = <T>(
  array: T[],
  fn: (value: T, index: number) => boolean
) => array.find(fn);

export const filterArray = <T>(
  array: T[],
  fn: (value: T, index: number) => boolean
) => array.filter(fn);

export const getMap = <K, V>(map: Map<K, V>, key: K) => map.get(key);

export const setMap = <K, V>(map: Map<K, V>, key: K, value: V) =>
  map.set(key, value);

export const addSet = <T>(set: Set<T>, value: T) => set.add(value);

export const fromEntries = <T>(
  entries: Array<unknown[]> | IterableIterator<[number, T]>
): T => Object.fromEntries(entries);

export const entriesOf = <T>(object: T) => Object.entries(object);
